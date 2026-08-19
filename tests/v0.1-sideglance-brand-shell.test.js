const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const pages = ['index.html', 'learn.html', 'dictionary.html', 'quiz.html', 'me.html', 'inbox.html', 'archive.html', 'archive-signal.html', '404.html'];
const pageText = pages.map(read).join('\n');
const currentBrandMarkup = (html) => [
  ...(html.match(/class="brand"[\s\S]*?<\/a>/g) || []),
  ...(html.match(/class="mobile-brand[^"]*"[\s\S]*?<\/a>/g) || []),
];

pages.forEach((page) => {
  const html = read(page);
  const brands = currentBrandMarkup(html);
  assert.ok(brands.length > 0, `${page} should contain a current brand lockup`);
  brands.forEach((brand) => {
    assert.match(brand, /SIDEGLANCE/);
    assert.match(brand, /RADAR/);
    assert.doesNotMatch(brand, /ENGLISH RADAR/i);
  });
  assert.match(html, /brand-parent/);
  assert.match(html, /brand-module/);
  assert.match(html, /brand-positioning/);
  assert.doesNotMatch(html, /aria-label="English Radar Today"/i);
  assert.doesNotMatch(html, /<strong>ENGLISH RADAR<\/strong>/i);
  assert.doesNotMatch(html, /<small>Personal language archive<\/small>/i);
  assert.doesNotMatch(html, /sideglance-brand\.js/i);
  assert.doesNotMatch(html, /<span>Today<\/span>/);
  assert.doesNotMatch(html, />Today<\/a>/);
});

assert.match(read('index.html'), /<meta name="version" content="v0\.1\.0">/);
assert.match(read('index.html'), /<title>Radar — Sideglance Radar<\/title>/);
assert.match(read('index.html'), /What should you notice today\?/);
assert.doesNotMatch(pageText, /in the radar today/i);
assert.doesNotMatch(pageText, /What do you want|to decode today/i);
assert.match(read('css/base.css'), /brand-module[^}]*font:\s*700\s+16px/);
assert.match(read('css/base.css'), /brand-parent[^}]*font:\s*700\s+10px/);
assert.match(read('css/responsive.css'), /brand-module/);
assert.doesNotMatch(read('css/responsive.css'), /today-workspace[^}]*brand-copy small\s*\{\s*display:\s*none/);
assert.doesNotMatch(pageText, /<strong>ENGLISH RADAR<\/strong>/i);
assert.equal(fs.existsSync(path.join(root, 'js/sideglance-brand.js')), false, 'brand shell should be static HTML/CSS');
assert.doesNotMatch(pageText, /TreeWalker|v1\.8\.3.*replace/i);

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

console.log('PASS: Sideglance Radar v0.1 Phase 1 static brand shell boundaries and compatibility checks');
