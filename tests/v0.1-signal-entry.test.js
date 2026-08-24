const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const read = (file) => fs.readFileSync(file, 'utf8');
const html = read('signal-entry.html');
const entry = read('js/signal-entry.js');
const radarHome = read('js/radar-home.js');
const storage = read('js/storage.js');

for (const phrase of ['Signal Entry', 'FULL FORM', 'CORE IDEA', 'CONTEXT', 'WHERE IT APPEARS', 'TONE', 'RELATED SIGNALS', 'PRACTICE', 'Return to Radar']) {
  assert.match(html, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), `Signal Entry should include ${phrase}`);
}
assert.match(html, /data-entry-title/);
assert.match(html, /data-entry-save/);
assert.match(html, /data-entry-review/);
assert.match(html, /js\/archive\.js/);
assert.match(html, /js\/signal-entry\.js/);
assert.match(radarHome, /signal-entry\.html\?id=/);
assert.match(entry, /signalIdentity/);
assert.match(entry, /communityContext/);
assert.match(entry, /productContext/);
assert.match(entry, /developerContext/);
assert.match(entry, /relationshipHint/);
assert.doesNotMatch(entry, /buildDailyMix|pickDeterministic|interestCategories/);
assert.doesNotMatch(entry, /englishRadarSignalEntry_/);
assert.match(fs.readFileSync('js/learning-engine.js', 'utf8'), /getTodayFocus/);

const context = { window: { addEventListener: () => {} } };
vm.runInNewContext(entry, context, { filename: 'js/signal-entry.js' });
const api = context.window.SideglanceSignalEntry;
assert.equal(api.resolveIdentity({ category: 'Community Discourse', platforms: ['Reddit'], tone: ['Casual'] }), 'Community Discourse · Reddit · Casual');
assert.equal(api.resolveIdentity({ signalIdentity: { type: 'Developer', usageContext: 'code review', developerContext: 'GitHub', tone: 'Direct' } }), 'Developer · code review · GitHub · Direct');
assert.equal(api.resolveIdentity({ id: 'legacy', productContext: 'A long legacy product description that belongs in the detailed record and should not become a dense entry metadata line.' }), '');
assert.equal(api.resolveIdentity({ id: 'empty' }), '');
const signals = [{ id: 'a', term: 'lowkey' }, { id: 'b', term: 'subtle' }, { id: 'c', term: 'kinda' }];
assert.deepEqual(api.signalRelations({ id: 'a', relatedTerms: ['b', 'kinda'] }, signals).map((signal) => signal.id), ['b', 'c']);
assert.deepEqual(api.signalRelations({ id: 'a', relatedTerms: [{ id: 'b' }] }, signals).map((signal) => signal.id), ['b']);

const keys = [...storage.matchAll(/englishRadar_[A-Za-z]+/g)].map((match) => match[0]);
assert.deepEqual([...new Set(keys)].sort(), ['englishRadar_currentSession', 'englishRadar_customSignals', 'englishRadar_inbox', 'englishRadar_progress', 'englishRadar_quizHistory', 'englishRadar_settings', 'englishRadar_syncHistory', 'englishRadar_syncSettings'].sort());
assert.match(read('css/signal-entry.css'), /@media \(max-width: 767px\)/);

console.log('PASS: Sideglance Radar v0.1 Signal Entry route, metadata rendering, relation links and storage boundaries');
