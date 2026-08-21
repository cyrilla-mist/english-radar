const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: {}, console, document: { addEventListener() {} } };
vm.createContext(context);
['js/bundled-pack-registry.js', 'data/signals.js', 'data/content-pack-01.js', 'data/content-pack-02.js', 'data/content-pack-03.js', 'data/content-pack-04.js', 'data/content-pack-05.js', 'js/content-registry.js', 'js/archive.js'].forEach(file => vm.runInContext(read(file), context, { filename: file }));
const archive = context.window.EnglishRadarArchive;
const content = { getDictionarySignals: () => context.window.ENGLISH_RADAR_SIGNALS, normalizeSignal: signal => signal };
const index = archive.createIndex(content, context.window.EnglishRadarBundledPackRegistry);
const recentId = index.activeSignals[0].id;
const fuzzyId = index.activeSignals[1].id;
const clearId = index.activeSignals[2].id;
const progress = {
  [recentId]: { signalId: recentId, favorite: true, mastery: 'new', lastReviewedAt: '2026-08-20T00:00:00.000Z' },
  [fuzzyId]: { signalId: fuzzyId, favorite: false, mastery: 'fuzzy', lastReviewedAt: '2026-08-19T00:00:00.000Z' },
  [clearId]: { signalId: clearId, favorite: true, mastery: 'clear', lastReviewedAt: '2026-08-18T00:00:00.000Z' }
};
const overview = archive.getOverview(index, progress);
assert.equal(overview.total, index.activeGroups.length);
assert.equal(overview.saved, 2);
assert.equal(overview.clear, 1);
const groups = archive.getMasteryGroups(index, progress);
assert.equal(groups.recent[0].id, recentId);
assert.ok(groups.fuzzy.some(signal => signal.id === fuzzyId));
assert.ok(groups.clear.some(signal => signal.id === clearId));
assert.match(archive.highlightHtml('engineering language', 'engineering'), /<mark class="archive-search-match">engineering<\/mark>/i);
assert.match(read('archive.html'), /data-archive-overview-total/);
for (const section of ['recent', 'fuzzy', 'clear']) assert.match(read('archive.html'), new RegExp(`data-archive-mastery="${section}"`));
assert.match(read('js/archive.js'), /No signals here yet|Your context library starts/);
assert.match(read('js/archive.js'), /No matching signals found/);
assert.match(read('css/archive.css'), /archive-search-match/);
assert.match(read('css/archive.css'), /archive-mastery-grid/);
assert.ok(!/setItem\(|removeItem\(/.test(read('js/archive.js')));
console.log('v0.1 archive polish tests: PASS');
