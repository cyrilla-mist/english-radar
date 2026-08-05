const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const root = require('path').resolve(__dirname, '..');
const read = (file) => fs.readFileSync(require('path').join(root, file), 'utf8');
const context = {
  window: {
    ENGLISH_RADAR_SIGNALS: [],
    ENGLISH_RADAR_UI_VOCABULARY_PACK: undefined,
    EnglishRadarStorage: { getCustomSignals: () => ({ version: 1, packs: [], signals: {} }), getInbox: () => [] }
  },
  console,
  Date
};

vm.runInNewContext(read('data/ui-vocabulary-core-pack.js'), context, { filename: 'data/ui-vocabulary-core-pack.js' });
const pack = context.window.ENGLISH_RADAR_UI_VOCABULARY_PACK;
assert.equal(pack.app, 'English Radar Content Pack');
assert.equal(pack.schemaVersion, 1);
assert.equal(pack.pack.id, 'english-radar-ui-vocabulary-core');
assert.equal(pack.signals.length, 10);

const ids = new Set(pack.signals.map((signal) => signal.id));
assert.equal(ids.size, 10);
pack.signals.forEach((signal) => {
  assert.match(signal.id, /^ui-[a-z0-9-]+$/);
  assert.equal(signal.category, 'UI Vocabulary');
  assert.equal(signal.radarType, 'interface');
  assert.equal(signal.contentStatus, 'active');
  assert.equal(signal.quizStatus, 'none');
  ['id', 'term', 'displayTerm', 'speechText', 'pronunciation', 'category', 'status', 'formality', 'meaningEn', 'meaningZh', 'exampleEn', 'exampleZh', 'useWhen', 'useWhenZh', 'avoidWhen', 'avoidWhenZh', 'chineseFeeling'].forEach((field) => assert(signal[field], `${signal.id} missing ${field}`));
  ['uiArea', 'commonInterfaces', 'relatedTerms', 'realInterfaceExamples', 'confusedWith', 'interfaceTargets'].forEach((field) => assert(Array.isArray(signal[field]), `${signal.id} ${field} must be an array`));
  ['originalMeaningEn', 'originalMeaningZh', 'productMeaningEn', 'productMeaningZh', 'whyProductsUseItEn', 'whyProductsUseItZh', 'usageBoundaryEn', 'usageBoundaryZh'].forEach((field) => assert(signal[field], `${signal.id} missing ${field}`));
  signal.relatedTerms.forEach((id) => assert(ids.has(id), `${signal.id} references unknown related term ${id}`));
  signal.interfaceTargets.forEach((target) => assert(target.page && target.area && target.label, `${signal.id} has an incomplete target`));
  signal.confusedWith.forEach((item) => assert(item.term && item.differenceEn && item.differenceZh, `${signal.id} has an incomplete confusedWith item`));
});

vm.runInNewContext(read('js/content-registry.js'), context, { filename: 'js/content-registry.js' });
const registry = context.window.EnglishRadarContent;
const normalized = registry.normalizeSignal(pack.signals[0], { sourceType: 'imported', sourcePackId: pack.pack.id });
assert(normalized, 'Interface Signal should normalize');
assert.equal(normalized.radarType, 'interface');
assert.deepEqual(normalized.interfaceTargets, pack.signals[0].interfaceTargets);
assert.deepEqual(normalized.confusedWith, pack.signals[0].confusedWith);
assert.equal(registry.normalizeSignal({ id: 'legacy-one', term: 'legacy', category: 'Internet Culture', meaningZh: '旧词', exampleEn: 'Legacy.' }).radarType, '');
assert.equal(registry.normalizeSignal({ id: 'broken', term: 'broken', category: 'UI Vocabulary', meaningZh: '缺字段', exampleEn: 'Broken.' }).productMeaningEn, '');

console.log('PASS: V1.2 Interface Vocabulary schema and registry compatibility checks');
