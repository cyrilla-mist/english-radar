const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: {}, console };
vm.runInNewContext(read('data/signal-v2.js'), context, { filename: 'data/signal-v2.js' });
assert.equal(typeof context.window.SIDEGLANCE_SIGNAL_V2, 'object');
assert.equal(typeof context.window.ENGLISH_RADAR_SIGNALS, 'undefined', 'overlay must initialize without legacy signals');
for (const file of ['data/signals.js', 'data/context-collections.js', 'js/signal-resolver.js']) {
  vm.runInNewContext(read(file), context, { filename: file });
}

const signals = context.window.ENGLISH_RADAR_SIGNALS;
const byId = new Map(signals.map((signal) => [signal.id, signal]));
const resolver = context.window.SideglanceSignalResolver;
const goldIds = [
  'internet-lowkey', 'internet-cooked', 'internet-touch-grass', 'internet-ngl',
  'github-lgtm', 'product-ship-it', 'ai-agent', 'ai-rag', 'product-mvp', 'internet-tldr'
];
const relationTypes = new Set(['similar', 'contrast', 'often-paired', 'same-context']);

assert.equal(typeof resolver.resolve, 'function');
assert.equal(typeof resolver.normalize, 'undefined');
assert.equal(new Set(goldIds).size, 10);
for (const id of goldIds) {
  assert.equal(signals.filter((signal) => signal.id === id).length, 1, `${id} must exist exactly once`);
  const signal = byId.get(id);
  assert.equal(typeof signal.signalV2, 'undefined', `${id} legacy record must not be mutated`);
  const overlay = context.window.SIDEGLANCE_SIGNAL_V2[id];
  assert(overlay, `${id} missing from Signal v2 overlay`);
  for (const section of ['identity', 'meaning', 'context', 'usage', 'examples', 'boundaries', 'relations']) {
    assert(overlay[section], `${id}.${section} missing`);
  }
  assert(overlay.identity.category);
  assert(overlay.identity.collections.length);
  assert(overlay.identity.contexts.length);
  assert(overlay.identity.tone.length);
  assert(overlay.meaning.core && overlay.meaning.zh && overlay.meaning.feeling);
  assert(overlay.context.whyPeopleUseIt);
  assert(overlay.usage.commonPatterns.length);
  assert(overlay.examples[0].text && overlay.examples[0].zh);
  assert(overlay.boundaries.natural.length && overlay.boundaries.avoid.length);
  overlay.relations.forEach((relation) => assert(relationTypes.has(relation.type), `${id} has invalid relation type`));
  for (const legacyField of ['meaningEn', 'meaningZh', 'exampleEn', 'exampleZh', 'useWhen', 'avoidWhen']) {
    assert(signal[legacyField], `${id} lost legacy field ${legacyField}`);
  }
}

const legacy = byId.get('internet-valid');
const before = JSON.stringify(legacy);
const legacyNormalized = resolver.resolve(legacy);
assert.equal(legacyNormalized.identity.category, legacy.category);
assert.equal(legacyNormalized.meaning.core, legacy.meaningEn);
assert.equal(legacyNormalized.meaning.zh, legacy.meaningZh);
assert.equal(legacyNormalized.examples[0].text, legacy.exampleEn);
assert.equal(legacyNormalized.examples[0].zh, legacy.exampleZh);
assert.deepEqual(Array.from(legacyNormalized.boundaries.natural), [legacy.useWhen]);
assert.deepEqual(Array.from(legacyNormalized.boundaries.avoid), [legacy.avoidWhen]);
assert.equal(JSON.stringify(legacy), before, 'resolver must not mutate source Signal');

const goldSnapshots = new Map(['internet-lowkey', 'github-lgtm', 'ai-agent'].map((id) => [id, JSON.stringify(byId.get(id))]));
const lowkey = resolver.resolve(byId.get('internet-lowkey'));
const lgtm = resolver.resolve(byId.get('github-lgtm'));
const agent = resolver.resolve(byId.get('ai-agent'));
assert.equal(byId.has('github-ship'), true);
assert(context.window.SIDEGLANCE_SIGNAL_V2['product-ship-it'].relations.some((relation) => relation.target === 'github-ship' && relation.type === 'similar'));
assert.equal(lowkey.meaning.core, context.window.SIDEGLANCE_SIGNAL_V2['internet-lowkey'].meaning.core);
assert.deepEqual(Array.from(lowkey.identity.collections), ['everyday-internet-tone']);
assert.equal(lowkey.examples[0].text, 'I lowkey want to rebuild the whole homepage.');
assert.equal(lowkey.relations[0].target, 'internet-highkey');
assert.equal(lgtm.meaning.core, context.window.SIDEGLANCE_SIGNAL_V2['github-lgtm'].meaning.core);
assert.equal(agent.meaning.core, context.window.SIDEGLANCE_SIGNAL_V2['ai-agent'].meaning.core);
goldSnapshots.forEach((snapshot, id) => assert.equal(JSON.stringify(byId.get(id)), snapshot, `${id} legacy Signal mutated`));

const collections = context.window.SIDEGLANCE_CONTEXT_COLLECTIONS;
assert.equal(collections.length, 6);
assert.equal(new Set(collections.map((collection) => collection.id)).size, 6);
const collectionSignalIds = new Set();
collections.forEach((collection) => {
  assert(collection.title && collection.description);
  assert.equal(new Set(collection.signalIds).size, collection.signalIds.length);
  collection.signalIds.forEach((id) => {
    assert(byId.has(id), `${collection.id} references missing Signal ${id}`);
    collectionSignalIds.add(id);
  });
});
assert(collections.find((collection) => collection.id === 'developer-communication').signalIds.includes('product-ship-it'));
assert(collections.find((collection) => collection.id === 'building-products-online').signalIds.includes('product-ship-it'));
assert.equal(collections.filter((collection) => collection.signalIds.includes('product-ship-it')).length, 2);

for (const file of ['data/signal-v2.js', 'data/context-collections.js', 'js/signal-resolver.js']) {
  assert.doesNotMatch(read(file), /localStorage|sessionStorage|learning-engine|Daily Mix|fetch\s*\(/i, `${file} must remain a local data/resolver layer`);
}

console.log('PASS: v0.2 Signal v2 resolver, Gold Standard 10 enrichment, Context Collections and compatibility safeguards');
