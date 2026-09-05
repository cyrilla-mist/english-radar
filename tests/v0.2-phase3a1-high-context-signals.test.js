const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: {}, console };

vm.runInNewContext(read('data/signal-v2.js'), context, { filename: 'data/signal-v2.js' });
vm.runInNewContext(read('data/signals.js'), context, { filename: 'data/signals.js' });
vm.runInNewContext(read('data/quizzes.js'), context, { filename: 'data/quizzes.js' });
vm.runInNewContext(read('data/context-collections.js'), context, { filename: 'data/context-collections.js' });
vm.runInNewContext(read('js/signal-resolver.js'), context, { filename: 'js/signal-resolver.js' });

const signals = context.window.ENGLISH_RADAR_SIGNALS;
const byId = new Map(signals.map((signal) => [signal.id, signal]));
const resolver = context.window.SideglanceSignalResolver;
const phase3a1Ids = [
  'internet-highkey', 'internet-no-cap', 'internet-its-giving', 'internet-delulu',
  'internet-chronically-online', 'internet-we-are-so-back', 'internet-iykyk'
];
const relationTypes = new Set(['similar', 'contrast', 'often-paired', 'same-context']);

assert.equal(byId.has('internet-highkey'), true);
assert.equal(byId.get('internet-highkey').term, 'highkey');
assert.equal(context.window.SIDEGLANCE_SIGNAL_V2['internet-highkey'].relations.length, 0);

for (const id of phase3a1Ids) {
  const signal = byId.get(id);
  const overlay = context.window.SIDEGLANCE_SIGNAL_V2[id];
  assert(signal, `missing Phase 3A.1 Signal ${id}`);
  assert(overlay, `missing Phase 3A.1 overlay ${id}`);
  assert(overlay.identity && overlay.identity.category && overlay.identity.collections.length && overlay.identity.contexts.length && overlay.identity.tone.length, `${id} identity is incomplete`);
  assert(overlay.meaning && overlay.meaning.core && overlay.meaning.zh && overlay.meaning.feeling, `${id} meaning is incomplete`);
  assert(overlay.context && overlay.context.whyPeopleUseIt, `${id} context is incomplete`);
  assert(overlay.usage && overlay.usage.commonPatterns.length, `${id} usage is incomplete`);
  assert(Array.isArray(overlay.examples) && overlay.examples.length >= 2, `${id} needs at least two examples`);
  overlay.examples.forEach((example) => assert(example.text && example.zh, `${id} example is incomplete`));
  assert(overlay.boundaries && overlay.boundaries.natural.length && overlay.boundaries.avoid.length, `${id} boundaries are incomplete`);
  assert(Array.isArray(overlay.relations), `${id} relations must be an array`);
  overlay.relations.forEach((relation) => {
    assert(relationTypes.has(relation.type), `${id} has invalid relation type`);
    assert(byId.has(relation.target), `${id} relation target ${relation.target} must resolve`);
  });
  assert.equal(typeof signal.signalV2, 'undefined', `${id} legacy record was mutated`);
  assert.equal(resolver.resolve(signal).meaning.core, overlay.meaning.core);
}

const snapshots = new Map(phase3a1Ids.map((id) => [id, JSON.stringify(byId.get(id))]));
phase3a1Ids.forEach((id) => resolver.resolve(byId.get(id)));
snapshots.forEach((snapshot, id) => assert.equal(JSON.stringify(byId.get(id)), snapshot, `${id} legacy Signal changed after resolve`));

const collections = context.window.SIDEGLANCE_CONTEXT_COLLECTIONS;
const everyDay = collections.find((collection) => collection.id === 'everyday-internet-tone');
const reactions = collections.find((collection) => collection.id === 'online-reactions-meme-culture');
assert.equal(everyDay.signalIds.length, 6);
assert.equal(reactions.signalIds.length, 10);
assert(everyDay.signalIds.includes('internet-highkey') && everyDay.signalIds.includes('internet-no-cap'));
['internet-its-giving', 'internet-delulu', 'internet-chronically-online', 'internet-we-are-so-back', 'internet-iykyk'].forEach((id) => assert(reactions.signalIds.includes(id), `missing ${id} from reactions collection`));
collections.forEach((collection) => {
  assert.equal(new Set(collection.signalIds).size, collection.signalIds.length, `${collection.id} has duplicate Signal IDs`);
  collection.signalIds.forEach((id) => assert(byId.has(id), `${collection.id} references missing Signal ${id}`));
});

const expectedRelations = [
  ['internet-lowkey', 'internet-highkey', 'contrast'],
  ['internet-no-cap', 'internet-fr', 'similar'],
  ['internet-its-giving', 'internet-ate', 'same-context'],
  ['internet-delulu', 'internet-chronically-online', 'same-context'],
  ['internet-touch-grass', 'internet-chronically-online', 'often-paired'],
  ['internet-cooked', 'internet-we-are-so-back', 'contrast'],
  ['internet-iykyk', 'internet-lore', 'same-context']
];
expectedRelations.forEach(([source, target, type]) => assert(context.window.SIDEGLANCE_SIGNAL_V2[source].relations.some((relation) => relation.target === target && relation.type === type), `${source} -> ${target} (${type}) missing`));
assert(!context.window.SIDEGLANCE_SIGNAL_V2['internet-chronically-online'].relations.some((relation) => relation.target === 'internet-touch-grass' && relation.type === 'often-paired'));
assert(!context.window.SIDEGLANCE_SIGNAL_V2['internet-we-are-so-back'].relations.some((relation) => relation.target === 'internet-cooked' && relation.type === 'contrast'));

const phase3a1PlatformlessIds = phase3a1Ids;
phase3a1PlatformlessIds.forEach((id) => assert.equal(Object.prototype.hasOwnProperty.call(context.window.SIDEGLANCE_SIGNAL_V2[id].identity, 'platforms'), false, `${id} should not define v2 platforms in Phase 3A.1`));
assert(!context.window.SIDEGLANCE_SIGNAL_V2['internet-no-cap'].usage.commonPatterns.includes('that was no cap'));
assert(context.window.SIDEGLANCE_SIGNAL_V2['internet-no-cap'].usage.commonPatterns.includes('... no cap'));

const highkeyQuizzes = context.window.ENGLISH_RADAR_QUIZZES.filter((quiz) => quiz.signalId === 'internet-highkey');
assert.equal(highkeyQuizzes.length, 2);
assert(highkeyQuizzes.some((quiz) => quiz.type === 'meaning-in-context'));
assert(highkeyQuizzes.some((quiz) => quiz.type === 'tone' || quiz.type === 'natural-usage'));
highkeyQuizzes.forEach((quiz) => assert(byId.has(quiz.signalId)));

assert.equal(signals.length, 62);
assert.equal(context.window.ENGLISH_RADAR_QUIZZES.length, 124);
console.log('PASS: v0.2 Phase 3A.1 high-context Signal v2 content, highkey compatibility, collections, relations and quizzes');
