const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: {}, console, Date };
['data/signals.js', 'data/content-pack-01.js', 'data/content-pack-02.js', 'data/content-pack-03.js'].forEach((file) => {
  vm.runInNewContext(read(file), context, { filename: file });
});

const pack01 = context.window.ENGLISH_RADAR_CONTENT_PACK_01;
const pack02 = context.window.ENGLISH_RADAR_CONTENT_PACK_02;
const pack03 = context.window.ENGLISH_RADAR_CONTENT_PACK_03;
const progress = { 'ui-dashboard': { signalId: 'ui-dashboard', mastery: 'clear' } };
const history = { byQuiz: { 'core-1': { lastAnswerCorrect: false } }, attempts: [] };
let custom = { version: 1, packs: [], signals: {} };
context.window.EnglishRadarStorage = { getCustomSignals: () => custom, getInbox: () => [], getProgress: () => progress, getQuizHistory: () => history };
vm.runInNewContext(read('js/content-registry.js'), context, { filename: 'js/content-registry.js' });
const content = context.window.EnglishRadarContent;

function install(pack) {
  pack.signals.forEach((signal) => { custom.signals[signal.id] = Object.assign({}, signal, { sourcePackId: pack.pack.id }); });
  custom.packs = custom.packs.filter((item) => item.id !== pack.pack.id).concat(Object.assign({}, pack.pack, { signalIds: pack.signals.map((signal) => signal.id) }));
  content.invalidate();
}

function remove(pack) {
  const record = custom.packs.find((item) => item.id === pack.pack.id);
  const ids = record ? record.signalIds.slice() : [];
  ids.forEach((id) => delete custom.signals[id]);
  custom.packs = custom.packs.filter((item) => item.id !== pack.pack.id);
  content.invalidate();
}

install(pack01);
install(pack02);
install(pack03);
assert.equal(custom.packs.length, 3);
assert.equal(content.getActiveLearningSignals().length, 104);

// Hard-reload equivalent: state is reconstructed from persisted custom pack records.
custom = JSON.parse(JSON.stringify(custom));
content.invalidate();
const rehydratedPack03 = custom.packs.find((item) => item.id === pack03.pack.id);
assert(rehydratedPack03, 'Pack 03 must rehydrate from persisted pack state');
assert.equal(rehydratedPack03.signalIds.length, 10);
assert.equal(rehydratedPack03.signalIds.filter((id) => custom.signals[id].sourcePackId === pack03.pack.id).length, 10);

const meSource = read('js/me.js');
assert(meSource.includes("if (preview) preview.hidden = true;"), 'bundled render must clear preview state during hydration');
assert(meSource.includes("remove.dataset.confirming = '';"), 'bundled render must clear remove confirmation state during hydration');
assert(meSource.includes("remove.hidden = state.installed === 0;"), 'remove visibility must follow persisted installed state');
assert(meSource.includes("card.dataset.bundledBound === 'true'"), 'bundled listeners must not be rebound on rerender');
assert(meSource.includes("removePack(payload.pack.id)"), 'hydrated Remove action must retain pack removal path');

remove(pack03);
assert(!custom.packs.some((item) => item.id === pack03.pack.id));
assert.equal(Object.keys(custom.signals).filter((id) => /^ui-/.test(id)).length, 15);
assert(pack01.signals.every((signal) => content.getSignalById(signal.id)));
assert(pack02.signals.every((signal) => content.getSignalById(signal.id)));
assert.equal(progress['ui-dashboard'].mastery, 'clear');
assert.equal(history.byQuiz['core-1'].lastAnswerCorrect, false);

// Reinstall remains idempotent after removal and reload reconstruction.
install(pack03);
install(pack03);
assert.equal(custom.packs.filter((item) => item.id === pack03.pack.id).length, 1);
assert.equal(custom.packs.find((item) => item.id === pack03.pack.id).signalIds.length, 10);

console.log('PASS: Pack 03 bundled state rehydrates, exposes Remove, isolates removal, and reinstalls idempotently');
