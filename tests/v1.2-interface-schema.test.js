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
const normalized = registry.normalizeSignal(pack.signals[0], { sourceType: 'imported', packId: pack.pack.id });
assert(normalized, 'Interface Signal should normalize');
assert.equal(normalized.radarType, 'interface');
assert.equal(normalized.sourcePackId, pack.pack.id);
assert.deepEqual(normalized.interfaceTargets, pack.signals[0].interfaceTargets);
assert.deepEqual(normalized.confusedWith, pack.signals[0].confusedWith);
assert.equal(registry.normalizeSignal({ id: 'legacy-one', term: 'legacy', category: 'Internet Culture', meaningZh: '旧词', exampleEn: 'Legacy.' }).radarType, '');
assert.equal(registry.normalizeSignal({ id: 'broken', term: 'broken', category: 'UI Vocabulary', meaningZh: '缺字段', exampleEn: 'Broken.' }).productMeaningEn, '');

const allowedPages = new Set(['today', 'learn', 'dictionary', 'inbox', 'me', 'quiz', 'review']);
const targetsById = Object.fromEntries(pack.signals.map((signal) => [signal.id, signal.interfaceTargets[0]]));
pack.signals.forEach((signal) => assert(allowedPages.has(signal.interfaceTargets[0].page), `${signal.id} points to an unknown page`));
assert.deepEqual(targetsById['ui-sync'], { page: 'me', area: 'notion-sync', label: 'Notion Sync' });
assert.deepEqual(targetsById['ui-profile'], { page: 'learn', area: 'signal-profile', label: 'Signal Profile' });
assert.deepEqual(targetsById['ui-archive'], { page: 'me', area: 'content-library', label: 'Imported Archive' });
assert.notEqual(targetsById['ui-sync'].page + '/' + targetsById['ui-sync'].area, 'today/sync-status');
assert.notEqual(targetsById['ui-archive'].page + '/' + targetsById['ui-archive'].area, 'dictionary/archive-label');
assert(!JSON.stringify(pack).includes('Search expressions, meanings or communities.'));
assert(!JSON.stringify(pack).includes('为某一天准备的一组混合内容'));
const meSource = read('js/me.js');
assert(meSource.includes("payload.pack.id === 'cyrilla-notion-archive-v1' ? 'Install archive' : 'Install pack'"));
assert(meSource.includes("state.installed ? 'Install missing signals'"));
assert(meSource.includes("packId: payload.pack.id"));

console.log('PASS: V1.2 Interface Vocabulary schema and registry compatibility checks');
