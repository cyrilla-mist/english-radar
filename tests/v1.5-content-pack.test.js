const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: {}, console, Date };
['data/signals.js', 'data/quizzes.js', 'data/ui-vocabulary-core-pack.js', 'data/ui-vocabulary-quizzes.js', 'data/content-pack-01.js', 'data/content-pack-01-quizzes.js', 'data/content-pack-02.js', 'data/content-pack-02-quizzes.js', 'data/content-pack-03.js', 'data/content-pack-03-quizzes.js'].forEach((file) => vm.runInNewContext(read(file), context, { filename: file }));

const pack03 = context.window.ENGLISH_RADAR_CONTENT_PACK_03;
const pack03Quizzes = context.window.ENGLISH_RADAR_CONTENT_PACK_03_QUIZZES;
const pack03Ids = new Set(pack03.signals.map((signal) => signal.id));
assert.equal(pack03.pack.id, 'english-radar-content-pack-03');
assert.equal(pack03.pack.name, 'Interface Structure & Overlays');
assert.equal(pack03.signals.length, 10);
assert.equal(pack03.signals.filter((signal) => signal.radarType === 'interface').length, 10);
assert.equal(pack03.signals.filter((signal) => signal.category === 'UI Vocabulary').length, 10);
assert.equal(new Set(pack03.signals.map((signal) => signal.id)).size, 10);
pack03.signals.forEach((signal) => {
  assert(/^ui-[a-z0-9-]+$/.test(signal.id));
  ['sourceName', 'sourceUrl', 'editorialSourceType', 'auditedAt'].forEach((field) => assert(signal[field], `${signal.id}.${field}`));
  ['uiArea', 'originalMeaningEn', 'originalMeaningZh', 'productMeaningEn', 'productMeaningZh', 'whyProductsUseItEn', 'whyProductsUseItZh', 'commonInterfaces', 'realInterfaceExamples', 'relatedTerms', 'confusedWith', 'interfaceTargets', 'usageBoundaryEn', 'usageBoundaryZh'].forEach((field) => assert(Array.isArray(signal[field]) ? signal[field].length : signal[field], `${signal.id}.${field}`));
});
assert.equal(pack03Quizzes.length, 20);
assert.equal(new Set(pack03Quizzes.map((quiz) => quiz.id)).size, 20);
pack03.signals.forEach((signal) => assert.equal(pack03Quizzes.filter((quiz) => quiz.signalId === signal.id).length, 2));
pack03Quizzes.forEach((quiz) => {
  assert(pack03Ids.has(quiz.signalId));
  assert.equal(new Set(quiz.options.map((option) => option.id)).size, 4);
  assert(quiz.options.some((option) => option.id === quiz.correctOptionId));
  ['context', 'prompt', 'explanationEn', 'explanationZh'].forEach((field) => assert(quiz[field], `${quiz.id}.${field}`));
  assert(!/\$\{|correctOptionId|answerKey|metadata/i.test(`${quiz.context} ${quiz.prompt}`));
});

const storage = { getCustomSignals: () => ({ version: 1, packs: [], signals: {} }), getInbox: () => [] };
context.window.EnglishRadarStorage = storage;
vm.runInNewContext(read('js/content-registry.js'), context, { filename: 'js/content-registry.js' });
vm.runInNewContext(read('js/quiz-registry.js'), context, { filename: 'js/quiz-registry.js' });
const registry = context.window.EnglishRadarQuizRegistry;
assert.equal(registry.getStaticQuizzes().length, 228);
assert.equal(registry.getInterfaceQuizzes().length, 70);
assert.equal(registry.getContentPack03Quizzes().length, 20);
assert.equal(registry.getInterfaceQuizzes().filter((quiz) => pack03Ids.has(quiz.signalId)).length, 20);

const meSource = read('js/me.js');
assert(meSource.includes('ENGLISH_RADAR_CONTENT_PACK_03'));
assert(meSource.includes('data-pack-id='));
assert(!meSource.includes('var card = cards[index]'));
assert(!read('js/interface-learning.js').includes('CONTENT_PACK_03'));
assert(read('scripts/validate-content-pack.js').includes('english-radar-content-pack-03'));
for (const page of ['index.html', 'learn.html', 'dictionary.html', 'inbox.html', 'quiz.html', 'me.html']) {
  const html = read(page);
  assert(html.includes('./data/content-pack-03.js?v=1.5.0'), `${page} should load Pack 03`);
  assert(html.indexOf('./data/content-pack-03.js?v=1.5.0') < html.indexOf('./js/content-registry.js'), `${page} Pack 03 must load before registry`);
}
for (const page of ['index.html', 'learn.html', 'quiz.html']) {
  const html = read(page);
  assert(html.includes('./data/content-pack-03-quizzes.js?v=1.5.0'), `${page} should load Pack 03 quizzes`);
  assert(html.indexOf('./data/content-pack-03-quizzes.js?v=1.5.0') < html.indexOf('./js/quiz-registry.js'), `${page} Pack 03 quizzes must load before registry`);
}

console.log('PASS: v1.5 Content Pack 03 metadata, validator, static/interface registry, bundled loading and learning-target boundary checks');
