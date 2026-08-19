const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const pages = ['index.html', 'learn.html', 'dictionary.html', 'quiz.html', 'me.html', 'inbox.html', 'archive.html', 'archive-signal.html', '404.html'];
const pageText = pages.map(read).join('\n');

assert.match(read('js/sideglance-brand.js'), /Sideglance Radar/);
assert.match(read('js/sideglance-brand.js'), /v0\.1\.0/);
pages.forEach((page) => {
  assert.match(read(page), /sideglance-brand\.js\?v=0\.1\.0/, `${page} should load the Sideglance brand shell`);
});
assert.match(read('index.html'), /<meta name="version" content="v0\.1\.0">/);
assert.match(read('index.html'), /<title>Radar — Sideglance Radar<\/title>/);
assert.match(read('js/sideglance-brand.js'), /What should you notice/);
assert.doesNotMatch(pageText, /radar\.html/i);
assert.ok(fs.existsSync(path.join(root, 'dictionary.html')));
assert.ok(fs.existsSync(path.join(root, 'archive.html')));
assert.ok(fs.existsSync(path.join(root, 'inbox.html')));

const storage = read('js/storage.js');
['englishRadar_progress', 'englishRadar_currentSession', 'englishRadar_settings', 'englishRadar_inbox', 'englishRadar_quizHistory', 'englishRadar_customSignals', 'englishRadar_syncSettings', 'englishRadar_syncHistory'].forEach((key) => assert.match(storage, new RegExp(key)));
assert.doesNotMatch(pageText + storage, /sideglance_[a-z0-9_]+/i);
assert.match(read('js/session.js'), /signal\.term/);
assert.match(read('js/speech.js'), /en-us/);
assert.match(read('js/speech.js'), /natural\|neural\|enhanced\|premium/i);
assert.match(read('js/speech.js'), /voiceschanged/);
assert.match(read('me.html'), /data-me-disclosure="weak-signals"/);
assert.match(read('me.html'), /data-me-weak-toggle/);
assert.match(read('js/archive.js'), /matchedPrimary/);
assert.match(read('js/notion-sync.js'), /Notion/);
assert.match(read('worker/src/index.js'), /Notion/);
assert.match(read('README.md'), /English Radar v1\.8\.3/);

console.log('PASS: Sideglance Radar v0.1 Phase 1 brand shell boundaries and compatibility checks');
