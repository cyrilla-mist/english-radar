const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: {}, console };
['data/signal-v2.js', 'data/signals.js', 'data/quizzes.js', 'data/context-collections.js', 'js/signal-resolver.js']
  .forEach((file) => vm.runInNewContext(read(file), context, { filename: file }));

const signals = context.window.ENGLISH_RADAR_SIGNALS;
const byId = new Map(signals.map((signal) => [signal.id, signal]));
const overlays = context.window.SIDEGLANCE_SIGNAL_V2;
const resolver = context.window.SideglanceSignalResolver;
const ids = ['ai-workflow', 'ai-memory', 'ai-context-window', 'ai-grounding', 'ai-system-prompt', 'ai-eval', 'github-ship'];
const newIds = ['ai-system-prompt', 'ai-eval'];
const relationTypes = new Set(['similar', 'contrast', 'often-paired', 'same-context']);
const boilerplate = /meaning described by the Signal|matches the Signal’s usage boundary|literal unrelated action|formal label with no context/i;

ids.forEach((id) => {
  const signal = byId.get(id);
  const overlay = overlays[id];
  assert(signal, `missing target Signal ${id}`);
  assert(overlay, `missing target overlay ${id}`);
  assert(overlay.identity.category && overlay.identity.collections.length && overlay.identity.contexts.length && overlay.identity.tone.length);
  assert(!Object.prototype.hasOwnProperty.call(overlay.identity, 'platforms'), `${id} should use contexts rather than generic v2 platforms`);
  assert(overlay.meaning.core && overlay.meaning.zh && overlay.meaning.feeling);
  assert(overlay.context.whyPeopleUseIt && overlay.usage.commonPatterns.length);
  assert(overlay.examples.length >= 2);
  assert(overlay.boundaries.natural.length && overlay.boundaries.avoid.length);
  assert(Array.isArray(overlay.relations));
  overlay.relations.forEach((relation) => {
    assert(relationTypes.has(relation.type), `${id} has an invalid relation type`);
    assert(byId.has(relation.target), `${id} relation target must resolve`);
  });
  assert.equal(signal.signalV2, undefined, `${id} legacy record was mutated`);
  assert.equal(resolver.resolve(signal).meaning.core, overlay.meaning.core);
});

assert.equal(signals.length, 69);
assert.equal(context.window.ENGLISH_RADAR_QUIZZES.length, 138);
assert(byId.get('ai-system-prompt').term === 'system prompt');
assert(byId.get('ai-eval').term === 'eval');

const collections = context.window.SIDEGLANCE_CONTEXT_COLLECTIONS;
const buildingWithAi = collections.find((collection) => collection.id === 'building-with-ai');
const developer = collections.find((collection) => collection.id === 'developer-communication');
const products = collections.find((collection) => collection.id === 'building-products-online');
assert.equal(buildingWithAi.signalIds.length, 10);
ids.slice(0, 6).forEach((id) => assert(buildingWithAi.signalIds.includes(id)));
assert(developer.signalIds.includes('github-ship'));
assert(products.signalIds.includes('github-ship'));
collections.forEach((collection) => {
  assert.equal(new Set(collection.signalIds).size, collection.signalIds.length, `${collection.id} has duplicate IDs`);
  collection.signalIds.forEach((id) => assert(byId.has(id), `${collection.id} target must resolve`));
});

const hasRelation = (source, target, type) => overlays[source].relations.some((relation) => relation.target === target && relation.type === type);
assert(hasRelation('ai-agent', 'ai-workflow', 'same-context'));
assert(!hasRelation('ai-workflow', 'ai-agent', 'same-context'));
assert(hasRelation('ai-memory', 'ai-context-window', 'same-context'));
assert(!hasRelation('ai-context-window', 'ai-memory', 'same-context'));
assert(!hasRelation('ai-grounding', 'ai-rag', 'same-context'));
assert(!hasRelation('ai-rag', 'ai-grounding', 'same-context'));
assert(hasRelation('ai-eval', 'ai-hallucination', 'same-context'));
assert.equal(overlays['ai-system-prompt'].relations.length, 0);
assert(hasRelation('product-ship-it', 'github-ship', 'similar'));
assert(!hasRelation('github-ship', 'product-ship-it', 'often-paired'));

newIds.forEach((id) => {
  const quizzes = context.window.ENGLISH_RADAR_QUIZZES.filter((quiz) => quiz.signalId === id);
  assert.equal(quizzes.length, 2, `${id} should have exactly two quizzes`);
  quizzes.forEach((quiz) => {
    assert(!boilerplate.test(quiz.options.map((option) => option.text).join(' ')), `${quiz.id} contains generic quiz boilerplate`);
    assert(quiz.explanationEn && quiz.explanationZh);
  });
});

console.log('PASS: v0.2 Phase 3B.2 AI Builder mental models, relations, collections and hand-authored quizzes');
