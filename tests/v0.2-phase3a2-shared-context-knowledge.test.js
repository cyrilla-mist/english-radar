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
const resolver = context.window.SideglanceSignalResolver;
const ids = ['internet-imo', 'internet-idk', 'internet-rn', 'internet-ikr', 'internet-rent-free', 'internet-left-no-crumbs', 'internet-ratio'];
const newIds = ids.slice(0, 4);
const relationTypes = new Set(['similar', 'contrast', 'often-paired', 'same-context']);

ids.forEach((id) => {
  const signal = byId.get(id);
  const overlay = context.window.SIDEGLANCE_SIGNAL_V2[id];
  assert(signal, `missing canonical Signal ${id}`);
  assert(overlay, `missing v2 knowledge node ${id}`);
  assert(overlay.identity.category && overlay.identity.collections.length && overlay.identity.contexts.length && overlay.identity.tone.length);
  assert(overlay.meaning.core && overlay.meaning.zh && overlay.meaning.feeling);
  assert(overlay.context.whyPeopleUseIt && overlay.usage.commonPatterns.length);
  assert(overlay.examples.length >= 2);
  assert(overlay.boundaries.natural.length && overlay.boundaries.avoid.length);
  assert(Array.isArray(overlay.relations));
  overlay.relations.forEach((relation) => {
    assert(relationTypes.has(relation.type));
    assert(byId.has(relation.target), `${id} relation target must resolve`);
  });
  assert.equal(signal.signalV2, undefined, `${id} legacy record was mutated`);
  const resolved = resolver.resolve(signal);
  assert.equal(resolved.meaning.core, overlay.meaning.core);
  assert(resolved.context.whyPeopleUseIt && resolved.examples.length >= 2 && resolved.boundaries.natural.length);
});

const fullForms = { 'internet-imo': 'in my opinion', 'internet-idk': "I don't know", 'internet-rn': 'right now', 'internet-ikr': 'I know, right?' };
Object.entries(fullForms).forEach(([id, fullForm]) => assert.equal(byId.get(id).fullForm, fullForm));

const collections = context.window.SIDEGLANCE_CONTEXT_COLLECTIONS;
const everyday = collections.find((collection) => collection.id === 'everyday-internet-tone');
const reactions = collections.find((collection) => collection.id === 'online-reactions-meme-culture');
assert.equal(everyday.signalIds.length, 10);
assert.equal(reactions.signalIds.length, 13);
newIds.forEach((id) => assert(everyday.signalIds.includes(id)));
['internet-rent-free', 'internet-left-no-crumbs', 'internet-ratio'].forEach((id) => assert(reactions.signalIds.includes(id)));
collections.forEach((collection) => {
  assert.equal(new Set(collection.signalIds).size, collection.signalIds.length, `${collection.id} has duplicate IDs`);
  collection.signalIds.forEach((id) => assert(byId.has(id), `${collection.id} target must resolve`));
});

const relation = (source, target, type) => context.window.SIDEGLANCE_SIGNAL_V2[source].relations.some((item) => item.target === target && item.type === type);
assert(relation('internet-imo', 'internet-idk', 'same-context'));
assert(relation('internet-ikr', 'internet-fr', 'similar'));
assert(relation('internet-ate', 'internet-left-no-crumbs', 'often-paired'));
assert(!relation('internet-idk', 'internet-imo', 'same-context'));
assert(!relation('internet-left-no-crumbs', 'internet-ate', 'often-paired'));

const expectedQuizTypes = { 'internet-imo': ['meaning-in-context', 'natural-usage'], 'internet-idk': ['meaning-in-context', 'tone'], 'internet-rn': ['meaning-in-context', 'natural-usage'], 'internet-ikr': ['meaning-in-context', 'tone'] };
newIds.forEach((id) => {
  const quizzes = context.window.ENGLISH_RADAR_QUIZZES.filter((quiz) => quiz.signalId === id);
  assert.equal(quizzes.length, 2, `${id} should have two quizzes`);
  assert.equal(Array.from(quizzes, (quiz) => quiz.type).join('|'), expectedQuizTypes[id].join('|'));
  quizzes.forEach((quiz) => {
    assert(!/meaning described by the Signal|matches the Signal’s usage boundary|literal unrelated action|formal label with no context/i.test(quiz.options.map((option) => option.text).join(' ')), `${quiz.id} contains generator boilerplate`);
  });
});
context.window.ENGLISH_RADAR_QUIZZES.forEach((quiz) => assert(byId.has(quiz.signalId), `${quiz.id} target must resolve`));
assert.equal(signals.length, 68);
assert.equal(context.window.ENGLISH_RADAR_QUIZZES.length, 136);
console.log('PASS: v0.2 Phase 3A.2 shared context knowledge, abbreviations, collections, relations and quizzes');
