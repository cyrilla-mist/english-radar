const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const context = { window: {}, console, Date };
vm.runInNewContext(read('data/cyrilla-notion-archive-pack.js'), context, { filename: 'data/cyrilla-notion-archive-pack.js' });
vm.runInNewContext(read('data/ui-vocabulary-core-pack.js'), context, { filename: 'data/ui-vocabulary-core-pack.js' });
const cyrilla = context.window.ENGLISH_RADAR_BUNDLED_PACK;
const ui = context.window.ENGLISH_RADAR_UI_VOCABULARY_PACK;
assert.equal(cyrilla.pack.id, 'cyrilla-notion-archive-v1');
assert.equal(ui.pack.id, 'english-radar-ui-vocabulary-core');
assert.equal(ui.signals.length, 10);
assert.notEqual(cyrilla.pack.id, ui.pack.id);

context.window.EnglishRadarStorage = { getCustomSignals: () => ({ version: 1, packs: [], signals: {} }), getInbox: () => [] };
context.window.ENGLISH_RADAR_SIGNALS = [];
vm.runInNewContext(read('js/content-registry.js'), context, { filename: 'js/content-registry.js' });
const registry = context.window.EnglishRadarContent;
const custom = {
  version: 1,
  packs: [{ id: cyrilla.pack.id, name: cyrilla.pack.name, signalIds: [cyrilla.signals[0].id] }],
  signals: { [cyrilla.signals[0].id]: Object.assign({}, cyrilla.signals[0], { sourcePackId: cyrilla.pack.id }) }
};
const progress = { 'ui-daily-mix': { signalId: 'ui-daily-mix', mastery: 'clear' } };
ui.signals.forEach((raw) => {
  const signal = registry.normalizeSignal(raw, { sourceType: 'imported', packId: ui.pack.id });
  assert(signal, `${raw.id} should normalize`);
  custom.signals[signal.id] = signal;
});
custom.packs.push({ id: ui.pack.id, name: ui.pack.name, signalIds: ui.signals.map((signal) => signal.id) });
assert.equal(custom.packs.find((pack) => pack.id === ui.pack.id).signalIds.length, 10);
ui.signals.forEach((signal) => assert.equal(custom.signals[signal.id].sourcePackId, ui.pack.id));
assert.equal(custom.packs.find((pack) => pack.id === cyrilla.pack.id).signalIds.length, 1);

ui.signals.forEach((signal) => delete custom.signals[signal.id]);
custom.packs = custom.packs.filter((pack) => pack.id !== ui.pack.id);
assert.equal(Object.keys(custom.signals).length, 1);
assert.equal(custom.packs.length, 1);
assert.equal(custom.packs[0].id, cyrilla.pack.id);
assert.equal(progress['ui-daily-mix'].mastery, 'clear');

const meSource = read('js/me.js');
assert(meSource.includes('ENGLISH_RADAR_BUNDLED_PACK, window.ENGLISH_RADAR_UI_VOCABULARY_PACK'));
assert(meSource.includes("bundledInstallLabel(payload)"));
assert(meSource.includes("state.installed ? 'Install missing signals'"));
assert(meSource.includes("library.querySelector('[data-pack-id=\"' + payload.pack.id + '\"]')"));
assert(meSource.includes("bundledPacks().slice(1).forEach(createBundledCard)"));
assert(!meSource.includes("registry.normalizeSignal(raw, { sourceType: 'imported', sourcePackId:"));

console.log('PASS: V1.2 bundled pack coexistence, install, partial state and removal checks');
