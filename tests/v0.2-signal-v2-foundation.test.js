const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: {}, console };
for (const file of ['data/signals.js', 'data/signal-v2.js', 'data/context-collections.js', 'js/signal-resolver.js']) {
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
assert.equal(new Set(goldIds).size, 10);
for (const id of goldIds) {
  assert.equal(signals.filter((signal) => signal.id === id).length, 1, `${id} must exist exactly once`);
  const signal = byId.get(id);
  assert(signal.signalV2, `${id} missing additive Signal v2 data`);
  for (const section of ['identity', 'meaning', 'context', 'usage', 'examples', 'boundaries', 'relations']) {
    assert(signal.signalV2[section], `${id}.${section} missing`);
  }
  assert(signal.signalV2.identity.category);
  assert(signal.signalV2.identity.collections.length);
  assert(signal.signalV2.identity.contexts.length);
  assert(signal.signalV2.identity.tone.length);
  assert(signal.signalV2.meaning.core && signal.signalV2.meaning.zh && signal.signalV2.meaning.feeling);
  assert(signal.signalV2.context.whyPeopleUseIt);
  assert(signal.signalV2.usage.commonPatterns.length);
  assert(signal.signalV2.examples[0].text && signal.signalV2.examples[0].zh);
  assert(signal.signalV2.boundaries.natural.length && signal.signalV2.boundaries.avoid.length);
  signal.signalV2.relations.forEach((relation) => assert(relationTypes.has(relation.type), `${id} has invalid relation type`));
  for (const legacyField of ['meaningEn', 'meaningZh', 'exampleEn', 'exampleZh', 'useWhen', 'avoidWhen']) {
    assert(signal[legacyField], `${id} lost legacy field ${legacyField}`);
  }
}

const legacy = byId.get('internet-based');
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

const lowkey = resolver.resolve(byId.get('internet-lowkey'));
assert.equal(lowkey.meaning.core, byId.get('internet-lowkey').signalV2.meaning.core);
assert.deepEqual(Array.from(lowkey.identity.collections), ['everyday-internet-tone']);
assert.equal(lowkey.examples[0].text, 'I lowkey want to rebuild the whole homepage.');
assert.equal(lowkey.relations[0].target, 'internet-highkey');

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
