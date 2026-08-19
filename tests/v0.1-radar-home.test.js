const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const home = fs.readFileSync('js/radar-home.js', 'utf8');
const css = fs.readFileSync('css/radar-home.css', 'utf8');
const storage = fs.readFileSync('js/storage.js', 'utf8');

for (const phrase of ['What should you notice today?', 'Daily Mix', 'On the Radar', 'Worth Another Look', 'Connection', 'Capture', 'MORE WAYS TO PRACTICE']) {
  assert.match(html, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), `Radar Home should include ${phrase}`);
}
assert.match(html, /data-daily-mix-preview/);
assert.match(html, /data-on-radar-list/);
assert.match(html, /data-worth-list/);
assert.match(html, /data-connection-list/);
assert.match(html, /<details class="radar-practice">/);
assert.match(html, /learn\.html\?feed=daily-mix&size=5/);
assert.match(html, /<h2 id="daily-mix-title">Your signals for today<\/h2>/);
assert.doesNotMatch(html, /class="mobile-today"/);
assert.doesNotMatch(html, /data-radar-date/);
assert.doesNotMatch(html, /dashboard\.js/);
const labels = [...html.matchAll(/<div class="radar-section-label"><span class="section-kicker">([^<]+)<\/span>/g)].map((match) => match[1]);
assert.deepEqual(labels, ['DAILY MIX', 'ON THE RADAR', 'WORTH ANOTHER LOOK', 'CONNECTION', 'CAPTURE']);
for (const prefix of ['01 /', '02 /', '03 /', '04 /', '05 /']) assert(labels.every((label) => !label.includes(prefix)), `Conditional section labels must not include ${prefix}`);
assert.match(home, /getTodaySnapshot\(\)/);
assert.match(home, /getDailyMix/);
assert.doesNotMatch(home, /buildDailyMix|pickDeterministic|interestCategories/);
assert.match(home, /firstLearnedAt/);
assert.match(home, /relatedTerms/);
assert.match(home, /confusedWith/);
assert.match(home, /mode=lookup&signal=/);
assert.match(css, /\.radar-section/);
assert.match(css, /@media \(max-width: 767px\)/);
assert.doesNotMatch(home, /localStorage|setItem|removeItem/);
assert.doesNotMatch(home, /reason|tag/i);
assert.equal((html.match(/data-daily-mix-preview/g) || []).length, 1);
assert.equal((home.match(/querySelector\('\[data-daily-mix-preview\]'\)/g) || []).length, 1);

const context = { window: {} };
vm.runInNewContext(home, context, { filename: 'js/radar-home.js' });
const presentation = context.window.SideglanceRadarHome.resolveSessionPresentation;
const dailyMix = ['a', 'b', 'c', 'd', 'e'].map((id) => ({ id }));
const exact = presentation({ mode: 'learn', signalIds: ['a', 'b', 'c', 'd', 'e'], currentIndex: 2 }, dailyMix);
assert.equal(exact.cta, 'Continue Daily Mix');
assert.equal(exact.state, 'IN PROGRESS · 3 / 5');
assert.equal(exact.recoveryVisible, false);
assert.equal(exact.href, './learn.html?resume=1');
const unrelated = presentation({ mode: 'learn', signalIds: ['x', 'y'], currentIndex: 1 }, dailyMix);
assert.equal(unrelated.cta, 'Start Daily Mix');
assert.equal(unrelated.state, '');
assert.equal(unrelated.recoveryVisible, true);
const reordered = presentation({ mode: 'learn', signalIds: ['b', 'a', 'c', 'd', 'e'], currentIndex: 0 }, dailyMix);
assert.equal(reordered.recoveryVisible, true, 'Daily Mix identity must preserve exact ID order.');
const none = presentation(null, dailyMix);
assert.equal(none.cta, 'Start Daily Mix');
assert.equal(none.state, '');
assert.equal(none.recoveryVisible, false);

const keys = [...storage.matchAll(/englishRadar_[A-Za-z]+/g)].map((match) => match[0]);
assert.deepEqual([...new Set(keys)].sort(), ['englishRadar_currentSession', 'englishRadar_customSignals', 'englishRadar_inbox', 'englishRadar_progress', 'englishRadar_quizHistory', 'englishRadar_settings', 'englishRadar_syncHistory', 'englishRadar_syncSettings'].sort());

console.log('PASS: Sideglance Radar v0.1 Phase 2 Radar Home IA, engine reuse, conditional sections and storage boundaries');
