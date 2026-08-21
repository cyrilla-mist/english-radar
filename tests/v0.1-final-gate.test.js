const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const count = (value, pattern) => (value.match(pattern) || []).length;
const signalEntryHtml = read('signal-entry.html');
const signalEntryCss = read('css/signal-entry.css');
const signalEntryJs = read('js/signal-entry.js');
const archive = read('archive.html');
const archiveDetail = read('archive-signal.html');
const me = read('me.html');
const learn = read('learn.html');
const currentRoutes = ['index.html', 'signal-entry.html', 'learn.html', 'archive.html', 'me.html', 'dictionary.html', 'inbox.html', 'quiz.html', 'archive-signal.html', '404.html'];

assert.match(signalEntryCss, /\.entry-block\[hidden\]\s*\{\s*display:\s*none\s*!important/);
assert.match(signalEntryJs, /fullFormSection\.hidden\s*=\s*!fullForm/);
assert.match(signalEntryJs, /relatedSection\.hidden\s*=\s*!related\.length/);
assert.match(signalEntryHtml, /data-entry-section="full-form" hidden/);
assert.match(signalEntryHtml, /data-entry-section="related" hidden/);

assert.equal((archive.match(/ARCHIVE \/ V0\.1\.0/g) || []).length, 2, 'Archive sidebar and footer should expose the current shell version');
assert.match(archive, /ARCHIVE \/ V0\.1\.0/);
assert.doesNotMatch(archive, /ARCHIVE \/ V1\.8/);
assert.match(archiveDetail, /ARCHIVE \/ V0\.1\.0/);
assert.doesNotMatch(archiveDetail, /ARCHIVE \/ V1\.8/);
assert.match(me, />SR\/05</);

for (const route of currentRoutes) assert.doesNotMatch(read(route), /Back to Today/);
assert.match(learn, /Back to Radar/);
assert.match(me, /Back to Radar/);
assert.match(read('quiz.html'), /Back to Radar/);

const radar = read('index.html');
assert.equal(count(radar, /daily-mix-section/g), 1);
assert.equal(count(radar, /data-daily-mix-link/g), 1);
assert.equal(count(radar, /data-radar-section="on-radar"/g), 1);
assert.equal(count(radar, /capture-section/g), 1);
assert.equal(count(signalEntryHtml, /entry-label">TONE/g), 1);
assert.equal(count(signalEntryHtml, /data-entry-section="related"/g), 1);
assert.equal(count(signalEntryHtml, /entry-label">PRACTICE/g), 1);
assert.equal(count(learn, /CORE MEANING/g), 1);
assert.equal(count(learn, /block-label">IN CONTEXT/g), 1);
assert.equal(count(learn, /class="mastery-bar"/g), 1);
for (const disclosure of ['last-7-days', 'mastery', 'weak-signals', 'recent-activity', 'context-insights', 'content-library', 'notion-sync', 'preferences', 'data-backup']) {
  assert.equal(count(me, new RegExp(`data-me-disclosure="${disclosure}"`, 'g')), 1, `${disclosure} should have one source disclosure`);
}

const storage = read('js/storage.js');
const storageKeys = [...storage.matchAll(/\b(englishRadar_[A-Za-z]+)\b/g)].map(match => match[1]);
assert.deepEqual([...new Set(storageKeys)].sort(), [
  'englishRadar_currentSession', 'englishRadar_customSignals', 'englishRadar_inbox', 'englishRadar_progress',
  'englishRadar_quizHistory', 'englishRadar_settings', 'englishRadar_syncHistory', 'englishRadar_syncSettings'
].sort());
assert.doesNotMatch(read('js/learning-engine.js'), /personalRadar|finalGate/);
assert.doesNotMatch(read('worker/src/index.js'), /personalRadar|finalGate/);
assert.doesNotMatch(read('js/notion-sync.js'), /personalRadar|finalGate/);

console.log('v0.1 final gate tests: PASS');
