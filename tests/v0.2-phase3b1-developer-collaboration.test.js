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
const ids = ['github-fork', 'github-branch', 'github-commit', 'github-merge', 'github-issue', 'github-open-source', 'github-wip'];
const relationTypes = new Set(['similar', 'contrast', 'often-paired', 'same-context']);
const boilerplate = /meaning described by the Signal|matches the Signal’s usage boundary|literal unrelated action|formal label with no context/i;

ids.forEach((id) => {
  const signal = byId.get(id);
  const overlay = overlays[id];
  assert(signal, `missing target Signal ${id}`);
  assert(overlay, `missing target overlay ${id}`);
  assert(overlay.identity.category && overlay.identity.collections.length && overlay.identity.contexts.length && overlay.identity.tone.length);
  assert(!Object.prototype.hasOwnProperty.call(overlay.identity, 'platforms'), `${id} should not use generic v2 platforms`);
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

const wip = byId.get('github-wip');
assert.equal(wip.term, 'WIP');
assert.equal(wip.displayTerm, 'WIP');
assert.equal(wip.fullForm, 'work in progress');
assert.equal(wip.category, 'GitHub / Development');
assert.deepEqual(Array.from(wip.platforms), ['GitHub']);

assert.equal(signals.length, 69);
assert.equal(context.window.ENGLISH_RADAR_QUIZZES.length, 138);

const developer = context.window.SIDEGLANCE_CONTEXT_COLLECTIONS.find((collection) => collection.id === 'developer-communication');
assert.deepEqual(Array.from(developer.signalIds), [
  'github-lgtm', 'github-pr', 'product-ship-it', 'github-breaking-change', 'github-ship',
  'github-fork', 'github-branch', 'github-commit', 'github-merge', 'github-issue', 'github-open-source', 'github-wip'
]);

const hasRelation = (source, target, type) => overlays[source].relations.some((relation) => relation.target === target && relation.type === type);
assert(hasRelation('github-fork', 'github-branch', 'same-context'));
assert(!hasRelation('github-branch', 'github-fork', 'same-context'));
assert(hasRelation('github-merge', 'github-branch', 'often-paired'));
assert(!hasRelation('github-branch', 'github-merge', 'often-paired'));
assert(hasRelation('github-issue', 'github-pr', 'often-paired'));
assert(!hasRelation('github-pr', 'github-issue', 'often-paired'));
assert(hasRelation('github-open-source', 'github-fork', 'same-context'));
assert(!hasRelation('github-fork', 'github-open-source', 'same-context'));
assert.equal(overlays['github-commit'].relations.length, 0);
assert.equal(overlays['github-wip'].relations.length, 0);
assert(hasRelation('github-lgtm', 'github-wip', 'contrast'));
assert(!hasRelation('github-wip', 'github-lgtm', 'contrast'));

const wipQuizzes = context.window.ENGLISH_RADAR_QUIZZES.filter((quiz) => quiz.signalId === 'github-wip');
assert.equal(wipQuizzes.length, 2);
wipQuizzes.forEach((quiz) => {
  assert(!boilerplate.test(quiz.options.map((option) => option.text).join(' ')), `${quiz.id} contains generic quiz boilerplate`);
  assert(quiz.explanationEn && quiz.explanationZh);
});

console.log('PASS: v0.2 Phase 3B.1 Developer Collaboration content, relations, collection and WIP quiz checks');
