const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

for (const file of ['archive.html', 'archive-signal.html', 'js/archive.js', 'js/archive-signal.js', 'css/archive.css']) {
  assert(fs.existsSync(path.join(root, file)), file + ' should exist');
}

const context = {
  window: {},
  document: { addEventListener() {} },
  console,
  Date,
  Object,
  Array,
  String,
  Number,
  Math,
  URLSearchParams
};
vm.createContext(context);
[
  'js/bundled-pack-registry.js',
  'data/signals.js',
  'data/content-pack-01.js',
  'data/content-pack-02.js',
  'data/content-pack-03.js',
  'data/content-pack-04.js',
  'data/content-pack-05.js',
  'js/content-registry.js',
  'js/archive.js'
].forEach((file) => vm.runInContext(read(file), context, { filename: file }));
vm.runInContext(read('js/archive-signal.js'), context, { filename: 'js/archive-signal.js' });

const archive = context.window.EnglishRadarArchive;
const index = archive.createIndex(context.window.EnglishRadarContent, context.window.EnglishRadarBundledPackRegistry);
assert(index.signals.length >= 100);
for (const term of ['cooked', 'touch grass', 'OP', 'ship it', 'RAG', 'Library', 'Queue']) {
  assert(index.signals.some((signal) => signal.term.toLowerCase() === term.toLowerCase()), term + ' should be indexed');
}
assert.equal(archive.recordType({ category: 'Community Discourse' }), 'COMMUNITY SIGNAL');
assert.equal(archive.recordType({ category: 'Product Naming' }), 'PRODUCT LEXICON');
assert.equal(archive.recordType({ category: 'AI Builder' }), 'BUILDER LOG');
assert.equal(archive.recordType({ category: 'UI Vocabulary', radarType: 'interface' }), 'INTERFACE RECORD');
assert.equal(archive.recordType({ category: 'Internet Culture' }), 'NETWORK ARTIFACT');
assert.equal(archive.recordType({ category: 'Other' }), 'LANGUAGE SIGNAL');
const searchIndex = (query) => index.signals.filter((signal) => [
  signal.term, signal.meaningEn, signal.meaningZh, signal.category,
  ...(signal.platforms || []), ...(signal.relatedTerms || []),
  signal.culturalContextEn, signal.culturalContextZh,
  signal.productMeaningEn, signal.productMeaningZh
].filter(Boolean).join(' ').toLowerCase().includes(query.toLowerCase()));
assert(searchIndex('product naming').some((signal) => signal.id === 'pn-library'));
assert(searchIndex('community discourse').some((signal) => signal.id.startsWith('cd-')));
assert(searchIndex('collection').some((signal) => signal.id === 'pn-collection'));
const sparseHtml = context.window.EnglishRadarArchiveDetail.render({
  id: 'sparse',
  term: 'sparse',
  category: 'Other',
  meaningEn: 'A sparse record.'
}, archive);
assert(!sparseHtml.includes('ORIGINAL TRACE'));
assert(!sparseHtml.includes('PRODUCT MEANING'));
assert(!/SAFE|DANGEROUS|OFFENSIVE/.test(read('js/archive-signal.js')));
assert(!/localStorage|EnglishRadarStorage|setItem|removeItem/.test(read('js/archive.js')));
for (const page of ['index.html', 'learn.html', 'dictionary.html', 'quiz.html', 'me.html']) {
  assert(!read(page).includes('archive.html'), page + ' should not add Archive to formal navigation');
}
assert(read('archive.html').includes('data-archive-search'));
assert(read('archive-signal.html').includes('archive-signal.js'));
console.log('PASS: Archive prototype registry index, record mapping, generic detail contract and isolation');
