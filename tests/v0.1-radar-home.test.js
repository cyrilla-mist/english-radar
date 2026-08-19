const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');
const home = fs.readFileSync('js/radar-home.js', 'utf8');
const css = fs.readFileSync('css/radar-home.css', 'utf8');

for (const phrase of ['What should you notice today?', 'Daily Mix', 'On the Radar', 'Worth Another Look', 'Connection', 'Capture', 'MORE WAYS TO PRACTICE']) {
  assert.match(html, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), `Radar Home should include ${phrase}`);
}
assert.match(html, /data-daily-mix-preview/);
assert.match(html, /data-on-radar-list/);
assert.match(html, /data-worth-list/);
assert.match(html, /data-connection-list/);
assert.match(html, /<details class="radar-practice">/);
assert.match(html, /learn\.html\?feed=daily-mix&size=5/);
assert.match(home, /getTodaySnapshot\(\)/);
assert.match(home, /getDailyMix/);
assert.match(home, /firstLearnedAt/);
assert.match(home, /relatedTerms/);
assert.match(home, /confusedWith/);
assert.match(home, /mode=lookup&signal=/);
assert.match(css, /\.radar-section/);
assert.match(css, /@media \(max-width: 767px\)/);
assert.doesNotMatch(home, /localStorage|setItem|removeItem/);
assert.doesNotMatch(home, /reason|tag/i);

console.log('PASS: Sideglance Radar v0.1 Phase 2 Radar Home IA, engine reuse, conditional sections and storage boundaries');
