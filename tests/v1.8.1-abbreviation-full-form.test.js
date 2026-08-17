const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const context = { window: {}, document: { addEventListener() {} }, console, Date, Object, Array, String, Number, Math, URLSearchParams };
vm.createContext(context);
for (const file of ['js/bundled-pack-registry.js', 'data/signals.js', 'data/content-pack-01.js', 'data/content-pack-02.js', 'data/content-pack-03.js', 'data/content-pack-04.js', 'data/content-pack-05.js', 'data/cyrilla-notion-archive-pack.js', 'js/content-registry.js', 'js/archive.js']) {
  vm.runInContext(read(file), context, { filename: file });
}

const registry = context.window.EnglishRadarContent;
const normalize = registry.normalizeSignal;
const signals = context.window.ENGLISH_RADAR_SIGNALS;
const byId = (id) => signals.find((signal) => signal.id === id);
const baseSignal = { ...byId('internet-ngl') };
delete baseSignal.fullForm;
assert.equal(normalize(baseSignal).fullForm, undefined);
assert.equal(normalize({ ...baseSignal, fullForm: '  test expansion  ' }).fullForm, 'test expansion');
assert.equal(normalize({ ...baseSignal, fullForm: '   ' }), null);
assert.equal(byId('internet-ngl').fullForm, 'not gonna lie');
assert.notEqual(byId('internet-ngl').fullForm, byId('internet-ngl').meaningEn);
assert.equal(byId('github-lgtm').fullForm, 'looks good to me');
assert.equal(byId('product-mvp').fullForm, 'minimum viable product');

assert(read('learn.html').includes('data-full-form-section'));
assert(read('js/session.js').includes("[data-full-form-section]"));
assert(read('js/dictionary.js').includes('signal.fullForm'));
assert(read('js/dictionary.js').includes('dictionary-full-form'));
assert(read('js/archive.js').includes('fullForm'));
assert(read('js/archive-signal.js').includes('<h2>FULL FORM</h2>'));
assert(read('archive-signal.html').includes('./js/storage.js?v=1.8.0'));
assert(!read('js/session.js').includes('englishRadar_'));
assert(!read('js/archive.js').match(/localStorage|setItem|removeItem/));

const archive = context.window.EnglishRadarArchive;
const index = archive.createIndex(context.window.EnglishRadarContent, context.window.EnglishRadarBundledPackRegistry);
const overpowered = archive.searchIndex(index, 'overpowered', 'all', 'catalog')[0];
const originalPoster = archive.searchIndex(index, 'original poster', 'all', 'catalog')[0];
const exactOp = archive.searchIndex(index, 'OP', 'all', 'catalog')[0];
assert.equal(overpowered.primary.signal.displayTerm.toUpperCase(), 'OP');
assert.equal(overpowered.matchedPrimary.signal.fullForm, 'overpowered');
assert.equal(originalPoster.primary.signal.displayTerm.toUpperCase(), 'OP');
assert.equal(originalPoster.matchedPrimary.signal.fullForm, 'original poster');
assert.equal(exactOp.matchedPrimary, undefined);
assert.equal(exactOp.primary.signal.fullForm, 'original poster');
assert.equal(archive.searchIndex(index, 'not gonna lie', 'all', 'my')[0].primary.signal.id, 'internet-ngl');
assert.equal(archive.searchIndex(index, 'for real', 'all', 'my')[0].primary.signal.id, 'internet-fr');
assert.equal(archive.searchIndex(index, 'minimum viable product', 'all', 'my')[0].primary.signal.id, 'product-mvp');
assert(read('js/me.js').includes('removePack'));
assert(read('js/archive.js').includes('groupEntries'));

const detailContext = { window: { EnglishRadarArchive: { index: { byId: {}, catalogEntries: [] }, normalizeTerm: (value) => String(value || '').toLowerCase(), findGroup: () => null } }, document: { addEventListener() {} }, console, URLSearchParams };
vm.createContext(detailContext);
vm.runInContext(read('js/archive-signal.js'), detailContext, { filename: 'js/archive-signal.js' });
const detail = detailContext.window.EnglishRadarArchiveDetail;
const ngl = byId('internet-ngl');
assert(detail.render({ signal: ngl }, detailContext.window.EnglishRadarArchive).includes('FULL FORM'));
assert(!detail.render({ signal: byId('internet-based') }, detailContext.window.EnglishRadarArchive).includes('FULL FORM'));

console.log('PASS: v1.8.1 optional full-form normalization, surfaces, search, archive detail, and safety boundaries');
