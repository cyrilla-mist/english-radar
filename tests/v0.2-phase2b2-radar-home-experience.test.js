'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const read = (file) => fs.readFileSync(file, 'utf8');
const html = read('index.html');
const home = read('js/radar-home.js');
const css = read('css/radar-home.css');
const storage = read('js/storage.js');

assert.match(html, /class="radar-section today-focus"[^>]*data-today-focus[^>]*hidden/);
assert.match(html, /TODAY'S FOCUS/);
assert.match(html, /data-today-focus-title/);
assert.match(html, /data-today-focus-description/);
assert.ok(html.indexOf('class="radar-hero"') < html.indexOf('data-today-focus'));
assert.ok(html.indexOf('data-today-focus') < html.indexOf('data-daily-mix-preview'));
assert.doesNotMatch(html, /Change Focus|Shuffle|Pick another|Tomorrow.?s Focus|progress %|unlock state/i);
assert.match(home, /getTodaySnapshot\(\)/);
assert.match(home, /todayFocus/);
assert.match(home, /data-today-focus-title/);
assert.match(home, /data-today-focus-description/);
assert.doesNotMatch(home, /SIDEGLANCE_SIGNAL_V2/);
assert.doesNotMatch(home, /localStorage|setItem|removeItem/);
assert.match(css, /\.today-focus/);
assert.match(css, /\.daily-mix-context/);
assert.match(css, /@media \(max-width: 767px\)/);
assert.match(css, /today-focus[^}]*font-size/);
assert.deepEqual([...storage.matchAll(/englishRadar_[A-Za-z]+/g)].map((match) => match[0]).filter((key, index, keys) => keys.indexOf(key) === index).sort(), ['englishRadar_currentSession', 'englishRadar_customSignals', 'englishRadar_inbox', 'englishRadar_progress', 'englishRadar_quizHistory', 'englishRadar_settings', 'englishRadar_syncHistory', 'englishRadar_syncSettings'].sort());

function loadHome({ overlay = {}, todayFocus = null } = {}) {
  const focusSection = { hidden: true };
  const focusTitle = { textContent: '' };
  const focusDescription = { textContent: '' };
  const nodes = {
    '[data-today-focus]': focusSection,
    '[data-today-focus-title]': focusTitle,
    '[data-today-focus-description]': focusDescription
  };
  const windowValue = {
    SIDEGLANCE_SIGNAL_V2: overlay,
    SideglanceSignalResolver: undefined,
    EnglishRadarLearningEngine: {
      getTodaySnapshot: () => ({ signals: [], dailyMix: [], progress: {}, todayFocus }),
      getTodayFocus: () => todayFocus,
      getDailyMix: () => []
    },
    EnglishRadarContent: { getActiveLearningSignals: () => [] },
    EnglishRadarStorage: { getProgress: () => ({}), getCurrentSession: () => null }
  };
  const context = vm.createContext({
    window: windowValue,
    document: {
      querySelector: (selector) => nodes[selector] || null,
      querySelectorAll: () => []
    },
    console,
    Date,
    Intl,
    URLSearchParams,
    encodeURIComponent,
    Math,
    String,
    Number,
    Array,
    Object
  });
  vm.runInContext(read('js/signal-resolver.js'), context);
  vm.runInContext(home, context);
  return { api: windowValue.SideglanceRadarHome, focusSection, focusTitle, focusDescription };
}

const focusRun = loadHome({ todayFocus: { id: 'focus', title: 'Online Reactions & Meme Culture', description: 'How people react, exaggerate, joke, and judge online.', signalIds: ['a', 'b', 'c'] } });
assert.equal(focusRun.focusSection.hidden, false);
assert.equal(focusRun.focusTitle.textContent, 'Online Reactions & Meme Culture');
assert.equal(focusRun.focusDescription.textContent, 'How people react, exaggerate, joke, and judge online.');
const missingFocusRun = loadHome();
assert.equal(missingFocusRun.focusSection.hidden, true, 'Missing Focus should hide the block gracefully.');

const signalA = { id: 'a', term: 'agent', meaningEn: 'A builder of systems.' };
const signalB = { id: 'b', term: 'workflow', meaningEn: 'A sequence of work.' };
const signalC = { id: 'c', term: 'hallucination', meaningEn: 'An unsupported output.' };
const resolverRun = loadHome({ overlay: {
  a: { meaning: { feeling: 'Useful when talking about a system builder.' }, relations: [{ target: 'b', type: 'same-context' }, { target: 'c', type: 'contrast' }] },
  b: { relations: [{ target: 'a', type: 'similar' }] }
} });
assert.equal(resolverRun.api.resolveContextHint(signalA), 'Useful when talking about a system builder.', 'v2 feeling should be the primary Context Hint.');
assert.equal(resolverRun.api.resolveContextHint({ id: 'core', term: 'core', meaningEn: 'An English core meaning.', chineseFeeling: '中文感受' }), 'An English core meaning.', 'Legacy Chinese feeling must not become the English hint.');
assert.equal(resolverRun.api.resolveContextHint({ id: 'fallback', term: 'fallback', meaningEn: 'A legacy meaning.' }), 'A legacy meaning.');
assert.equal(resolverRun.api.resolveDailyMixContextCue(signalA, [signalA, signalB, signalC], {}).type, 'CONTRAST', 'Contrast must outrank Connected.');
assert.equal(resolverRun.api.resolveDailyMixContextCue(signalA, [signalA, signalB], {}).detail, 'Connected to "workflow".');
assert.equal(resolverRun.api.resolveDailyMixContextCue(signalB, [signalA, signalB], {}).type, 'CONNECTED', 'Reverse explicit relation should connect.');
assert.equal(resolverRun.api.resolveDailyMixContextCue({ id: 'metadata', term: 'metadata', category: 'Internet', tone: ['Casual'], platforms: ['Discord'] }, [signalA, { id: 'metadata', term: 'metadata', category: 'Internet', tone: ['Casual'], platforms: ['Discord'] }], {}).type, 'NEW');
assert.equal(resolverRun.api.resolveDailyMixContextCue(signalA, [signalA], {}).detail, '');
assert.equal(resolverRun.api.resolveDailyMixContextCue(signalA, [signalA], { a: { firstLearnedAt: '2026-08-01T00:00:00.000Z' } }).detail, '');
assert.equal(resolverRun.api.resolveDailyMixContextCue(null, [], {}).detail, '');

const sessionApi = resolverRun.api;
const mix = ['a', 'b', 'c', 'd', 'e'].map((id) => ({ id }));
assert.equal(sessionApi.resolveSessionPresentation({ mode: 'learn', signalIds: ['a', 'b', 'c', 'd', 'e'], currentIndex: 1 }, mix).cta, 'Continue Daily Mix');
assert.equal(sessionApi.resolveSessionPresentation({ mode: 'learn', signalIds: ['x'], currentIndex: 0 }, mix).recoveryVisible, true);
assert.equal(sessionApi.resolveSessionPresentation(null, mix).cta, 'Start Daily Mix');

console.log('PASS: Sideglance v0.2 Phase 2B2 Radar Home context experience checks');
