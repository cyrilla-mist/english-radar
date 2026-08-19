const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const session = read('js/session.js');
const layout = read('css/layout.css');
const responsive = read('css/responsive.css');

assert.match(session, /function displayTerm\(value\) \{ return hasText\(value\) \? String\(value\)\.trim\(\) : ''; \}/);
assert(!session.includes('String(value).trim().toUpperCase()'), 'displayTerm must preserve canonical casing');
assert.match(session, /var displayTerm = text\(signal\.displayTerm \|\| signal\.term\);/);
assert(!session.includes('text(signal.displayTerm || signal.term).toUpperCase()'), 'Learn title must not force uppercase');
assert(!session.includes('displayTerm.length > 10'), 'title sizing must not depend on the old character-count safeguard');
assert.match(session, /setText\(refs\.term, displayTerm\)/);
assert.match(session, /function renderSignal\(\)/);
assert.match(session, /mode === 'review'/);
assert.match(session, /isLookup/);
assert.match(session, /function renderStandardSignal\(signal\)/);
assert.match(session, /function renderInterfaceSignal\(signal\)/);
assert.match(session, /data-full-form-section|fullForm/);

assert.match(layout, /\.signal-heading\s*\{[^}]*min-width:\s*0/);
assert.match(layout, /\.signal-heading h1\s*\{[^}]*max-width:\s*100%/);
assert.match(layout, /\.signal-heading h1\s*\{[^}]*overflow-wrap:\s*anywhere/);
assert.match(layout, /\.signal-heading h1\s*\{[^}]*word-break:\s*normal/);
assert.match(responsive, /\.signal-heading h1 \{ font-size: clamp\(32px, 9vw, 72px\); line-height: \.95; word-break: break-word; \}/);
assert.match(responsive, /\.signal-heading h1 \{[^}]*word-break: break-word/);

const context = { window: {} };
context.window.window = context.window;
context.window.EnglishRadarBundledPackRegistry = { packs: [], registerPack(pack) { this.packs.push(...(pack.signals || [])); } };
vm.createContext(context);
vm.runInContext(read('data/signals.js'), context);
for (const file of ['data/ui-vocabulary-core-pack.js', 'data/content-pack-01.js', 'data/content-pack-02.js', 'data/content-pack-03.js', 'data/content-pack-04.js', 'data/content-pack-05.js']) {
  if (fs.existsSync(path.join(root, file))) vm.runInContext(read(file), context);
}
const signals = [
  ...(context.window.ENGLISH_RADAR_SIGNALS || []),
  ...(context.window.ENGLISH_RADAR_UI_VOCABULARY_PACK?.signals || []),
  ...(context.window.EnglishRadarBundledPackRegistry?.packs || [])
];
const allSource = ['data/content-pack-01.js', 'data/content-pack-02.js', 'data/content-pack-03.js', 'data/content-pack-04.js', 'data/content-pack-05.js']
  .filter((file) => fs.existsSync(path.join(root, file))).map(read).join('\n');
const records = (context.window.ENGLISH_RADAR_SIGNALS || []).concat(
  (context.window.ENGLISH_RADAR_UI_VOCABULARY_PACK?.signals || [])
);
const find = (value) => records.concat(signals).find((signal) => String(signal.term || '').toLowerCase() === value.toLowerCase() || String(signal.displayTerm || '').toLowerCase() === value.toLowerCase());
for (const term of ['fr', 'OP', 'MVP', 'NGL', 'workflow', 'settings', 'prototype', 'collection', 'discover', 'touch grass', 'ship it', 'TL;DR', 'IYKYK']) {
  assert(find(term), `expected audited Signal ${term}`);
}
assert(find('workflow').displayTerm === 'WORKFLOW');
assert(find('touch grass').displayTerm === 'TOUCH GRASS');
assert(find('TL;DR').displayTerm === 'TL;DR');
assert(find('IYKYK').displayTerm === 'IYKYK');
assert(find('NGL').fullForm === 'not gonna lie');
assert(find('MVP').fullForm === 'minimum viable product');
assert(find('OP').fullForm === 'original poster');
assert(allSource.includes('GitHub'), 'content audit should retain mixed-case platform references');

console.log('PASS: v1.8.2 Learn title casing, fit safeguards, shared renderer and Signal audit checks');
