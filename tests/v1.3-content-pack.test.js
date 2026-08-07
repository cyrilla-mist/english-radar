const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: {}, console, Date };
vm.runInNewContext(read('data/content-pack-01.js'), context, { filename: 'data/content-pack-01.js' });
vm.runInNewContext(read('data/content-pack-01-quizzes.js'), context, { filename: 'data/content-pack-01-quizzes.js' });
vm.runInNewContext(read('data/signals.js'), context, { filename: 'data/signals.js' });
vm.runInNewContext(read('data/quizzes.js'), context, { filename: 'data/quizzes.js' });
vm.runInNewContext(read('data/ui-vocabulary-core-pack.js'), context, { filename: 'data/ui-vocabulary-core-pack.js' });
vm.runInNewContext(read('data/ui-vocabulary-quizzes.js'), context, { filename: 'data/ui-vocabulary-quizzes.js' });

const pack = context.window.ENGLISH_RADAR_CONTENT_PACK_01;
const packQuizzes = context.window.ENGLISH_RADAR_CONTENT_PACK_01_QUIZZES;
assert.equal(pack.pack.id, 'english-radar-content-pack-01');
assert.equal(pack.pack.version, '1.0.0');
assert.equal(pack.signals.length, 24);
assert.equal(pack.signals.filter((signal) => signal.radarType === 'interface').length, 15);
assert.equal(pack.signals.filter((signal) => signal.radarType !== 'interface').length, 9);
assert.equal(new Set(pack.signals.map((signal) => signal.id)).size, 24);
pack.signals.forEach((signal) => {
  assert(signal.sourceName && signal.sourceUrl && signal.editorialSourceType && signal.auditedAt, `${signal.id} source metadata`);
  if (signal.radarType === 'interface') {
    assert(/^ui-/.test(signal.id));
    ['uiArea', 'originalMeaningEn', 'originalMeaningZh', 'productMeaningEn', 'productMeaningZh', 'whyProductsUseItEn', 'whyProductsUseItZh', 'commonInterfaces', 'realInterfaceExamples', 'relatedTerms', 'confusedWith', 'interfaceTargets', 'usageBoundaryEn', 'usageBoundaryZh'].forEach((field) => assert(signal[field] && signal[field].length, `${signal.id}.${field}`));
  } else assert(/^builder-/.test(signal.id));
});
assert.equal(packQuizzes.length, 48);
assert.equal(new Set(packQuizzes.map((quiz) => quiz.id)).size, 48);
pack.signals.forEach((signal) => assert.equal(packQuizzes.filter((quiz) => quiz.signalId === signal.id).length, 2));
packQuizzes.forEach((quiz) => {
  assert(pack.signals.some((signal) => signal.id === quiz.signalId));
  assert.equal(new Set(quiz.options.map((option) => option.id)).size, 4);
  assert(quiz.options.some((option) => option.id === quiz.correctOptionId));
});

let custom = { version: 1, packs: [], signals: {} };
context.window.EnglishRadarStorage = { getCustomSignals: () => custom, getInbox: () => [] };
vm.runInNewContext(read('js/content-registry.js'), context, { filename: 'js/content-registry.js' });
vm.runInNewContext(read('js/quiz-registry.js'), context, { filename: 'js/quiz-registry.js' });
const content = context.window.EnglishRadarContent;
const quizzes = context.window.EnglishRadarQuizRegistry;
assert.equal(quizzes.getStaticQuizzes().length, 188);
assert.equal(quizzes.getContentPack01Quizzes().length, 48);
assert.equal(quizzes.getInterfaceQuizzes().length, 50);
assert.equal(quizzes.getStaticQuizzes().filter((quiz) => packQuizzes.some((candidate) => candidate.id === quiz.id)).length, 48);
assert.equal(content.getActiveLearningSignals().length, 60);
assert.equal(quizzes.getStaticQuizzes().filter((quiz) => content.getSignalById(quiz.signalId)).filter((quiz) => quiz.id.startsWith('cp01-')).length, 0);

const progress = { 'ui-dashboard': { signalId: 'ui-dashboard', mastery: 'clear' } };
function install(ids) {
  const selected = pack.signals.filter((signal) => ids.includes(signal.id));
  selected.forEach((signal) => { if (!custom.signals[signal.id]) custom.signals[signal.id] = Object.assign({}, signal, { sourcePackId: pack.pack.id }); });
  custom.packs = custom.packs.filter((item) => item.id !== pack.pack.id).concat({ id: pack.pack.id, name: pack.pack.name, signalIds: Array.from(new Set(selected.map((signal) => signal.id).concat(custom.packs.find((item) => item.id === pack.pack.id)?.signalIds || []))) });
  content.invalidate();
}
install(pack.signals.map((signal) => signal.id));
assert.equal(Object.keys(custom.signals).length, 24);
assert.equal(content.getActiveLearningSignals().length, 84);
assert.equal(quizzes.getStaticQuizzes().filter((quiz) => content.getSignalById(quiz.signalId)).filter((quiz) => quiz.id.startsWith('cp01-')).length, 48);
install(pack.signals.slice(0, 12).map((signal) => signal.id));
assert.equal(Object.keys(custom.signals).length, 24);
pack.signals.slice(12).forEach((signal) => delete custom.signals[signal.id]);
custom.packs = custom.packs.filter((item) => item.id !== pack.pack.id);
content.invalidate();
assert.equal(Object.keys(custom.signals).length, 12);
assert.equal(content.getActiveLearningSignals().length, 72);
assert.equal(progress['ui-dashboard'].mastery, 'clear');

const meSource = read('js/me.js');
assert(meSource.includes("bundledSourceLabel(payload)"));
assert(meSource.includes("English Radar audited content"));
assert.match(meSource, /document\.querySelector\('\[data-bundled-pack\]\[data-pack-id="/);
assert(!meSource.includes('var card = cards[index]'));
const meHtml = read('me.html');
assert.match(meHtml, /data-pack-id="cyrilla-notion-archive-v1"/);
for (const page of ['index.html', 'learn.html', 'dictionary.html', 'inbox.html', 'quiz.html', 'me.html', '404.html']) {
  const html = read(page);
  assert.match(html, /v1\.5\.0/i, `${page} should expose V1.5.0`);
  assert.doesNotMatch(html, /v1\.2\.1/i, `${page} should not expose stale V1.2.1 metadata`);
}
assert.match(meHtml, /me\.js\?v=1\.5\.0/);
assert.match(read('quiz.html'), /quiz-registry\.js\?v=1\.5\.0/);
assert(fs.existsSync(path.join(root, 'docs/v1.3.0-release-notes.md')));

console.log('PASS: v1.3 Content Pack 01 metadata, registry, activation, reinstall, partial install and removal');
