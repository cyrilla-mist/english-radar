const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: {}, console, Date };
['data/signals.js', 'data/quizzes.js', 'data/ui-vocabulary-core-pack.js', 'data/ui-vocabulary-quizzes.js', 'data/content-pack-01.js', 'data/content-pack-01-quizzes.js', 'data/content-pack-02.js', 'data/content-pack-02-quizzes.js'].forEach((file) => vm.runInNewContext(read(file), context, { filename: file }));

const pack01 = context.window.ENGLISH_RADAR_CONTENT_PACK_01;
const pack02 = context.window.ENGLISH_RADAR_CONTENT_PACK_02;
const pack02Quizzes = context.window.ENGLISH_RADAR_CONTENT_PACK_02_QUIZZES;
const pack02Ids = new Set(pack02.signals.map((signal) => signal.id));
assert.equal(pack02.pack.id, 'english-radar-content-pack-02');
assert.equal(pack02.pack.name, 'AI Foundations');
assert.equal(pack02.pack.sourceLabel, 'English Radar audited AI foundations');
assert.equal(pack02.signals.length, 10);
assert.equal(pack02.signals.filter((signal) => signal.radarType === 'interface').length, 0);
assert.equal(new Set(pack02.signals.map((signal) => signal.id)).size, 10);
pack02.signals.forEach((signal) => {
  assert(/^ai-[a-z0-9-]+$/.test(signal.id));
  assert.equal(signal.category, 'AI Builder');
  ['sourceName', 'sourceUrl', 'editorialSourceType', 'auditedAt'].forEach((field) => assert(signal[field], `${signal.id}.${field}`));
});
assert.equal(pack02Quizzes.length, 20);
assert.equal(new Set(pack02Quizzes.map((quiz) => quiz.id)).size, 20);
pack02.signals.forEach((signal) => assert.equal(pack02Quizzes.filter((quiz) => quiz.signalId === signal.id).length, 2));
pack02Quizzes.forEach((quiz) => {
  assert(pack02.signals.some((signal) => signal.id === quiz.signalId));
  assert.equal(new Set(quiz.options.map((option) => option.id)).size, 4);
  assert(quiz.options.some((option) => option.id === quiz.correctOptionId));
  ['context', 'prompt', 'explanationEn', 'explanationZh'].forEach((field) => assert(quiz[field], `${quiz.id}.${field}`));
  assert(!/\$\{|correctOptionId|answerKey|metadata/i.test(`${quiz.context} ${quiz.prompt}`));
});

let custom = { version: 1, packs: [], signals: {} };
const progress = { 'ui-dashboard': { signalId: 'ui-dashboard', mastery: 'clear' } };
const history = { byQuiz: { 'core-1': { lastAnswerCorrect: false } }, attempts: [] };
context.window.EnglishRadarStorage = { getCustomSignals: () => custom, getInbox: () => [], getProgress: () => progress, getQuizHistory: () => history };
vm.runInNewContext(read('js/content-registry.js'), context, { filename: 'js/content-registry.js' });
vm.runInNewContext(read('js/quiz-registry.js'), context, { filename: 'js/quiz-registry.js' });
const content = context.window.EnglishRadarContent;
const registry = context.window.EnglishRadarQuizRegistry;
assert.equal(content.getActiveLearningSignals().length, 60);
assert.equal(registry.getStaticQuizzes().length, 208);
assert.equal(registry.getInterfaceQuizzes().length, 50);
assert.equal(registry.getContentPack02Quizzes().length, 20);
assert.equal(registry.getInterfaceQuizzes().filter((quiz) => /^ai-/.test(quiz.signalId)).length, 0);
assert.equal(registry.getStaticQuizzes().filter((quiz) => content.getSignalById(quiz.signalId) && pack02Ids.has(quiz.signalId)).length, 0);

function install(pack) {
  pack.signals.forEach((signal) => { custom.signals[signal.id] = Object.assign({}, signal, { sourcePackId: pack.pack.id }); });
  custom.packs = custom.packs.filter((item) => item.id !== pack.pack.id).concat(Object.assign({}, pack.pack, { signalIds: pack.signals.map((signal) => signal.id) }));
  content.invalidate();
}
install(pack02);
assert.equal(Object.keys(custom.signals).length, 10);
assert.equal(content.getActiveLearningSignals().length, 70);
assert.equal(registry.getStaticQuizzes().filter((quiz) => content.getSignalById(quiz.signalId) && pack02Ids.has(quiz.signalId)).length, 20);
install(pack01);
assert.equal(Object.keys(custom.signals).length, 34);
assert.equal(content.getActiveLearningSignals().length, 94);
assert.equal(progress['ui-dashboard'].mastery, 'clear');
assert.equal(history.byQuiz['core-1'].lastAnswerCorrect, false);
custom.packs = custom.packs.filter((item) => item.id !== pack02.pack.id);
pack02.signals.forEach((signal) => delete custom.signals[signal.id]);
content.invalidate();
assert.equal(content.getActiveLearningSignals().length, 84);
assert(pack01.signals.every((signal) => content.getSignalById(signal.id)));
assert.equal(progress['ui-dashboard'].mastery, 'clear');
assert.equal(history.byQuiz['core-1'].lastAnswerCorrect, false);

const meSource = read('js/me.js');
assert(meSource.includes('ENGLISH_RADAR_CONTENT_PACK_02'));
assert(meSource.includes("bundledSourceLabel(payload)"));
assert(meSource.includes("status.setAttribute('data-bundled-status', '')"));
assert.match(meSource, /data-bundled-pack\]\[data-pack-id=/);
assert(!meSource.includes('var card = cards[index]'));
const quizSource = read('js/quiz.js');
assert(quizSource.includes("mode === 'signal'"));
assert(quizSource.includes("mode === 'mistakes'"));
assert(quizSource.includes('getInterfaceQuizzes'));
assert(read('scripts/validate-content-pack.js').includes('english-radar-content-pack-02'));
for (const page of ['index.html', 'learn.html', 'dictionary.html', 'inbox.html', 'quiz.html', 'me.html']) {
  const html = read(page);
  assert(html.includes('./data/content-pack-02.js?v=1.4.0'), `${page} should load Pack 02`);
  assert(html.indexOf('./data/content-pack-02.js?v=1.4.0') < html.indexOf('./js/content-registry.js'), `${page} Pack 02 must load before registry`);
  assert(!html.includes('./js/quiz-registry.js?v=1.3.0'), `${page} must not use stale quiz registry cache key`);
  assert(!html.includes('./js/me.js?v=1.3.0'), `${page} must not use stale me.js cache key`);
  assert(!/English Radar v1\.3\.0|ENGLISH RADAR \/ V1\.3\.0|>V1\.3\.0</.test(html), `${page} must not expose stale current release metadata`);
  assert(/English Radar v1\.5\.0|ENGLISH RADAR \/ V1\.5\.0|>V1\.5\.0</.test(html), `${page} must expose V1.5.0 metadata`);
}
assert(/English Radar v1\.5\.0/.test(read('404.html')));
for (const page of ['index.html', 'learn.html', 'quiz.html']) {
  const html = read(page);
  assert(html.includes('./data/content-pack-02-quizzes.js?v=1.4.0'), `${page} should load Pack 02 quizzes`);
  assert(html.indexOf('./data/content-pack-02-quizzes.js?v=1.4.0') < html.indexOf('./js/quiz-registry.js'), `${page} Pack 02 quizzes must load before registry`);
}
for (const page of ['index.html', 'learn.html', 'quiz.html']) assert(read(page).includes('./js/quiz-registry.js?v=1.5.0'), `${page} should use v1.5.0 quiz registry cache key`);
assert(read('me.html').includes('./js/me.js?v=1.5.0'));
assert(read('index.html').includes('./data/content-pack-01.js?v=1.3.0'), 'Pack 01 asset version may retain its own v1.3.0 identity');
const releaseNotes = read('docs/v1.4.0-release-notes.md');
['English Radar v1.4.0 — AI Foundations', '10 audited AI Builder Signals', '20 dedicated quizzes', 'Interface Check', 'Content Pack 01 and Content Pack 02', 'Progress and Quiz History', 'LocalStorage key or schema migration', 'Worker deployment', 'Notion API change', 'Existing Core, UI Core, and Content Pack 01 content'].forEach((phrase) => assert(releaseNotes.includes(phrase), `release notes should include ${phrase}`));

console.log('PASS: v1.4 Content Pack 02 metadata, validator, registry, activation, isolation and quiz boundary checks');
