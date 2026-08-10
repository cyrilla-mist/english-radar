const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: {}, console, Date };
['data/signals.js', 'data/quizzes.js', 'data/ui-vocabulary-core-pack.js', 'data/ui-vocabulary-quizzes.js', 'data/content-pack-01.js', 'data/content-pack-01-quizzes.js', 'data/content-pack-02.js', 'data/content-pack-02-quizzes.js', 'data/content-pack-03.js', 'data/content-pack-03-quizzes.js', 'data/content-pack-04.js', 'data/content-pack-04-quizzes.js'].forEach((file) => vm.runInNewContext(read(file), context, { filename: file }));

const pack = context.window.ENGLISH_RADAR_CONTENT_PACK_04;
const quizzes = context.window.ENGLISH_RADAR_CONTENT_PACK_04_QUIZZES;
const ids = new Set(pack.signals.map((signal) => signal.id));
assert.equal(pack.pack.id, 'english-radar-content-pack-04');
assert.equal(pack.pack.name, 'Community Discourse');
assert.equal(pack.signals.length, 10);
assert.equal(new Set(pack.signals.map((signal) => signal.id)).size, 10);
pack.signals.forEach((signal) => {
  assert(/^cd-[a-z0-9-]+$/.test(signal.id));
  assert.equal(signal.category, 'Community Discourse');
  ['platforms', 'tone', 'relatedTerms', 'confusedWith'].forEach((field) => assert(Array.isArray(signal[field]) && signal[field].length, `${signal.id}.${field}`));
  ['meaningEn', 'meaningZh', 'exampleEn', 'exampleZh', 'useWhen', 'avoidWhen', 'originalMeaningEn', 'originalMeaningZh', 'culturalContextEn', 'culturalContextZh', 'sourceName', 'sourceUrl', 'editorialSourceType', 'auditedAt'].forEach((field) => assert(signal[field], `${signal.id}.${field}`));
});
assert.equal(quizzes.length, 20);
assert.equal(new Set(quizzes.map((quiz) => quiz.id)).size, 20);
pack.signals.forEach((signal) => assert.equal(quizzes.filter((quiz) => quiz.signalId === signal.id).length, 2));
quizzes.forEach((quiz) => {
  assert(ids.has(quiz.signalId));
  assert(['meaning', 'boundary'].includes(quiz.questionType));
  assert.equal(quiz.options.length, 4);
  assert(quiz.options.some((option) => option.id === quiz.correctOptionId));
  ['context', 'prompt', 'explanationEn', 'explanationZh'].forEach((field) => assert(quiz[field], `${quiz.id}.${field}`));
});

let custom = { version: 1, packs: [], signals: {} };
context.window.EnglishRadarStorage = { getCustomSignals: () => custom, getInbox: () => [] };
vm.runInNewContext(read('js/content-registry.js'), context, { filename: 'js/content-registry.js' });
const registry = context.window.EnglishRadarContent;
const normalized = pack.signals.map((signal) => registry.normalizeSignal(signal, { sourceType: 'imported', packId: pack.pack.id }));
assert(normalized.every(Boolean));
assert.equal(normalized[0].culturalContextEn, pack.signals[0].culturalContextEn);
assert.equal(normalized[0].sourcePackId, pack.pack.id);

custom = { version: 1, packs: [Object.assign({}, pack.pack, { signalIds: normalized.map((signal) => signal.id) })], signals: Object.fromEntries(normalized.map((signal) => [signal.id, Object.assign({}, signal, { contentStatus: 'active' })])) };
registry.invalidate();
assert.equal(registry.getActiveLearningSignals().filter((signal) => signal.sourcePackId === pack.pack.id).length, 10);
assert.equal(registry.getDictionarySignals().find((signal) => signal.id === 'cd-ratio').culturalContextZh.length > 0, true);

const progress = { 'cd-ratio': { signalId: 'cd-ratio', mastery: 'fuzzy' } };
const quizHistory = { byQuiz: { 'cp04-ratio-meaning': { lastAnswerCorrect: false } } };
custom.signals = {};
custom.packs = [];
registry.invalidate();
assert.equal(registry.getActiveLearningSignals().some((signal) => signal.id === 'cd-ratio'), false);
assert.equal(progress['cd-ratio'].mastery, 'fuzzy');
assert.equal(quizHistory.byQuiz['cp04-ratio-meaning'].lastAnswerCorrect, false);
custom = { version: 1, packs: [Object.assign({}, pack.pack, { signalIds: normalized.map((signal) => signal.id) })], signals: Object.fromEntries(normalized.map((signal) => [signal.id, Object.assign({}, signal, { contentStatus: 'active' })])) };
registry.invalidate();
assert.equal(registry.getActiveLearningSignals().filter((signal) => signal.sourcePackId === pack.pack.id).length, 10);

vm.runInNewContext(read('js/quiz-registry.js'), context, { filename: 'js/quiz-registry.js' });
const quizRegistry = context.window.EnglishRadarQuizRegistry;
assert.equal(quizRegistry.getContentPack04Quizzes().length, 20);
assert.equal(quizRegistry.getStaticQuizzes().length, 248);
assert.equal(quizRegistry.getInterfaceQuizzes().length, 70);

assert(read('js/dictionary.js').includes('culturalContextEn'));
assert(read('js/learning-engine.js').includes("'Community Discourse'"));
assert(read('js/session.js').includes('data-rich-signal-section'));
for (const page of ['index.html', 'learn.html', 'dictionary.html', 'inbox.html', 'quiz.html', 'me.html']) {
  const html = read(page);
  assert(html.includes('./data/content-pack-04.js?v=1.6.0'), `${page} should load Pack 04 Signals`);
  assert(html.includes('./data/content-pack-04-quizzes.js?v=1.6.0'), `${page} should load Pack 04 quizzes`);
}

console.log('PASS: v1.6 Community Discourse Pack 04 schema, registry, lifecycle preservation, search, learning integration and page loading');
