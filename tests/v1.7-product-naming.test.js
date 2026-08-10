const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: {}, console, Date, Object, Array, String, Number, Math, URLSearchParams };
vm.createContext(context);
[
  'js/bundled-pack-registry.js',
  'data/cyrilla-notion-archive-pack.js', 'data/ui-vocabulary-core-pack.js',
  'data/content-pack-01.js', 'data/content-pack-02.js', 'data/content-pack-03.js',
  'data/content-pack-04.js', 'data/content-pack-05.js',
  'data/ui-vocabulary-quizzes.js', 'data/content-pack-01-quizzes.js',
  'data/content-pack-02-quizzes.js', 'data/content-pack-03-quizzes.js',
  'data/content-pack-04-quizzes.js', 'data/content-pack-05-quizzes.js'
].forEach((file) => vm.runInContext(read(file), context, { filename: file }));

const registry = context.window.EnglishRadarBundledPackRegistry;
const packs = registry.getBundledPacks();
const packIds = packs.map((item) => item.pack.id);
assert(packIds.includes('english-radar-content-pack-05'));
assert.equal(packs.find((item) => item.pack.id === 'english-radar-content-pack-05').signals.length, 10);
assert.equal(registry.getQuizPack('english-radar-content-pack-05').length, 20);
assert.equal(registry.getQuizPack('english-radar-content-pack-05').filter((quiz) => quiz.questionType === 'boundary').length, 7);

const pack = context.window.ENGLISH_RADAR_CONTENT_PACK_05;
const ids = pack.signals.map((signal) => signal.id);
assert.equal(JSON.stringify(ids), JSON.stringify(['pn-explore', 'pn-discover', 'pn-draft', 'pn-collection', 'pn-library', 'pn-queue', 'pn-hub', 'pn-spaces', 'pn-history', 'pn-saved']));
pack.signals.forEach((signal) => {
  assert.equal(signal.category, 'Product Naming');
  ['meaningEn', 'meaningZh', 'originalMeaningEn', 'originalMeaningZh', 'productMeaningEn', 'productMeaningZh', 'whyProductsUseItEn', 'whyProductsUseItZh', 'commonInterfaces', 'realInterfaceExamples', 'relatedTerms', 'confusedWith', 'sourceName', 'sourceUrl', 'editorialSourceType', 'auditedAt'].forEach((field) => assert(signal[field], `${signal.id} missing ${field}`));
});

const quizIds = registry.getQuizPack(pack.pack.id).map((quiz) => quiz.signalId);
ids.forEach((id) => assert.equal(quizIds.filter((signalId) => signalId === id).length, 2));
assert(registry.getQuizPack('english-radar-content-pack-05').length === 20);

const session = read('js/session.js');
assert(session.includes('productMeaningEn') && session.includes('whyProductsUseItEn'));
assert(session.includes('commonInterfaces') && session.includes('realInterfaceExamples'));
assert(session.includes('data-interface-section'));
assert(read('js/learning-engine.js').includes("'Product Naming'"));
assert(read('js/dictionary.js').includes('productMeaningEn'));
assert(read('js/me.js').includes('EnglishRadarBundledPackRegistry'));
assert(!/ENGLISH_RADAR_CONTENT_PACK_0[1-5]/.test(read('js/me.js')));
assert(!/var contentPack0[1-5]/.test(read('js/quiz-registry.js')));
assert(!/english-radar-content-pack-0[1-5].*if/.test(read('scripts/validate-content-pack.js')));

for (const page of ['index.html', 'learn.html', 'quiz.html', 'dictionary.html', 'inbox.html', 'me.html']) {
  const html = read(page);
  assert(html.includes('bundled-pack-registry.js?v=1.7.0'));
  assert(html.includes('content-pack-05.js?v=1.7.0'));
  assert(html.includes('content-pack-05-quizzes.js?v=1.7.0'));
  assert.match(html, /v1\.7\.0/i);
}
assert(read('README.md').includes('Content Pack 05'));
assert(fs.existsSync(path.join(root, 'docs/v1.7.0-product-naming.md')));
assert(fs.existsSync(path.join(root, 'docs/v1.7.0-release-notes.md')));
const notFound = read('404.html');
assert.match(notFound, /<meta name="version" content="v1\.7\.0">/i);
assert.match(notFound, /<meta name="description" content="English Radar v1\.7\.0 signal not found\.">/i);
assert.doesNotMatch(notFound, /<meta name="description"[^>]*v1\.6\.0/i);
console.log('PASS: v1.7 Product Naming registry, schema, Learn semantics, quiz coverage and page wiring');
