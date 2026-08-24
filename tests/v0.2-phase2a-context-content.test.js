const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: {}, console };
for (const file of ['data/signal-v2.js', 'data/signals.js', 'data/context-collections.js', 'js/signal-resolver.js']) {
  vm.runInNewContext(read(file), context, { filename: file });
}

const signals = context.window.ENGLISH_RADAR_SIGNALS;
const byId = new Map(signals.map((signal) => [signal.id, signal]));
const resolver = context.window.SideglanceSignalResolver;
const phase2aIds = [
  'internet-fr', 'internet-tbh', 'internet-locked-in', 'internet-based', 'internet-ate',
  'github-pr', 'github-breaking-change', 'ai-tool-calling', 'ai-hallucination',
  'product-poc', 'internet-yapping', 'internet-eli5'
];
const sections = ['identity', 'meaning', 'context', 'usage', 'examples', 'boundaries', 'relations'];

assert.equal(byId.has('internet-eli5'), true);
assert.equal(byId.get('internet-eli5').term, 'ELI5');
assert.equal(signals.filter((signal) => signal.id === 'internet-eli5').length, 1);

for (const id of phase2aIds) {
  assert(byId.has(id), `missing Phase 2A Signal ${id}`);
  const signal = byId.get(id);
  assert.equal(typeof signal.signalV2, 'undefined', `${id} legacy record was mutated`);
  const overlay = context.window.SIDEGLANCE_SIGNAL_V2[id];
  assert(overlay, `${id} missing from Signal v2 overlay`);
  sections.forEach((section) => assert(overlay[section], `${id} missing overlay ${section}`));
  const normalized = resolver.resolve(signal);
  sections.forEach((section) => assert(normalized[section], `${id} missing normalized ${section}`));
  assert(normalized.identity.category && normalized.identity.collections.length && normalized.identity.contexts.length && normalized.identity.tone.length);
  assert(normalized.meaning.core && normalized.meaning.zh && normalized.meaning.feeling);
  assert(normalized.context.whyPeopleUseIt);
  assert(normalized.usage.commonPatterns.length);
  assert(normalized.examples[0].text && normalized.examples[0].zh);
  assert(normalized.boundaries.natural.length && normalized.boundaries.avoid.length);
  assert(normalized.relations.length);
}

const legacySnapshots = new Map(['internet-lowkey', 'internet-fr', 'github-pr', 'internet-eli5'].map((id) => [id, JSON.stringify(byId.get(id))]));
phase2aIds.forEach((id) => resolver.resolve(byId.get(id)));
legacySnapshots.forEach((snapshot, id) => assert.equal(JSON.stringify(byId.get(id)), snapshot, `${id} legacy Signal changed after resolve`));

const collections = context.window.SIDEGLANCE_CONTEXT_COLLECTIONS;
assert.equal(collections.length, 6);
collections.forEach((collection) => {
  const resolvable = collection.signalIds.filter((id) => byId.has(id) && resolver.resolve(byId.get(id)).meaning.core);
  assert(resolvable.length >= 3, `${collection.id} needs at least 3 resolvable Signals`);
  assert.equal(new Set(collection.signalIds).size, collection.signalIds.length, `${collection.id} has duplicate Signal IDs`);
});

const requiredMembership = {
  'everyday-internet-tone': ['internet-lowkey', 'internet-ngl', 'internet-fr', 'internet-tbh'],
  'online-reactions-meme-culture': ['internet-cooked', 'internet-locked-in', 'internet-touch-grass', 'internet-based', 'internet-ate'],
  'developer-communication': ['github-lgtm', 'github-pr', 'product-ship-it', 'github-breaking-change'],
  'building-with-ai': ['ai-agent', 'ai-rag', 'ai-tool-calling', 'ai-hallucination'],
  'building-products-online': ['product-mvp', 'product-poc', 'product-ship-it'],
  'community-forum-conventions': ['internet-tldr', 'internet-yapping', 'internet-eli5']
};
collections.forEach((collection) => assert.deepEqual(Array.from(collection.signalIds), requiredMembership[collection.id]));

console.log('PASS: v0.2 Phase 2A context content expansion, ELI5 compatibility, overlay immutability and collection coverage');
