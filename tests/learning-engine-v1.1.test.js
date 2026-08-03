'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

function runScript(relativePath, context) {
  const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
  vm.runInContext(source, context, { filename: relativePath });
}

function createContext(windowValue, dateConstructor = Date) {
  const context = vm.createContext({
    window: windowValue,
    console,
    Date: dateConstructor,
    Intl,
    Number,
    Math,
    Array,
    Object,
    String,
    URLSearchParams,
    setTimeout,
    clearTimeout
  });
  return context;
}

const FIXED_NOW = new Date('2026-08-04T12:00:00.000Z');

class FixedDate extends Date {
  constructor(...args) {
    super(...(args.length ? args : [FIXED_NOW.getTime()]));
  }

  static now() {
    return FIXED_NOW.getTime();
  }
}

function testReviewSchedule() {
  const windowValue = {};
  const context = createContext(windowValue);
  runScript('js/review.js', context);

  const review = windowValue.EnglishRadarReview;
  assert.ok(review, 'Review module should be exposed.');
  assert.equal(review.getReviewDelayDays('new', 0), 1);
  assert.equal(review.getReviewDelayDays('new', 8), 1);
  assert.equal(review.getReviewDelayDays('fuzzy', 0), 2);
  assert.equal(review.getReviewDelayDays('fuzzy', 1), 3);
  assert.equal(review.getReviewDelayDays('fuzzy', 2), 7);
  assert.equal(review.getReviewDelayDays('fuzzy', 20), 14);
  assert.equal(review.getReviewDelayDays('clear', 0), 7);
  assert.equal(review.getReviewDelayDays('clear', 1), 14);
  assert.equal(review.getReviewDelayDays('clear', 2), 30);
  assert.equal(review.getReviewDelayDays('clear', 20), 60);

  const start = new Date('2026-08-03T00:00:00.000Z');
  assert.equal(review.getNextReviewAt('clear', 2, start), '2026-09-02T00:00:00.000Z');
}

function buildSignals() {
  return [
    { id: 'unseen-general-1', term: 'alpha', category: 'Internet Culture', platforms: ['Reddit'] },
    { id: 'unseen-general-2', term: 'beta', category: 'Community English', platforms: ['Discord'] },
    { id: 'unseen-interest', term: 'gamma', category: 'Idol Fandom English', platforms: ['K-pop'] },
    { id: 'weak-due', term: 'delta', category: 'Builder English', platforms: ['GitHub'] },
    { id: 'old-learned', term: 'epsilon', category: 'Product Design English', platforms: ['Figma'] },
    { id: 'recent-learned', term: 'zeta', category: 'Sports English', platforms: ['Sports'] },
    { id: 'extra-unseen', term: 'eta', category: 'General English', platforms: ['TikTok'] }
  ];
}

function loadLearningEngine(search, progress) {
  const signals = buildSignals();
  const registry = { getActiveLearningSignals: () => signals.slice() };
  const originalRegistryMethod = registry.getActiveLearningSignals;
  const windowValue = {
    location: { search },
    EnglishRadarContent: registry,
    EnglishRadarStorage: { getProgress: () => progress }
  };
  const context = createContext(windowValue, FixedDate);
  runScript('js/learning-engine.js', context);
  return { windowValue, registry, signals, originalRegistryMethod };
}

function testDailyMix() {
  const now = FIXED_NOW.getTime();
  const progress = {
    'weak-due': {
      firstLearnedAt: new Date(now - 10 * 86400000).toISOString(),
      lastReviewedAt: new Date(now - 7 * 86400000).toISOString(),
      nextReviewAt: new Date(now - 86400000).toISOString(),
      mastery: 'fuzzy'
    },
    'old-learned': {
      firstLearnedAt: new Date(now - 90 * 86400000).toISOString(),
      lastReviewedAt: new Date(now - 60 * 86400000).toISOString(),
      nextReviewAt: new Date(now + 10 * 86400000).toISOString(),
      mastery: 'clear'
    },
    'recent-learned': {
      firstLearnedAt: new Date(now - 3 * 86400000).toISOString(),
      lastReviewedAt: new Date(now - 86400000).toISOString(),
      nextReviewAt: new Date(now + 10 * 86400000).toISOString(),
      mastery: 'clear'
    }
  };

  const { windowValue } = loadLearningEngine('?feed=daily-mix', progress);
  const mix = windowValue.EnglishRadarLearningEngine.getFilteredSignals().slice(0, 5);
  const repeat = windowValue.EnglishRadarLearningEngine.getDailyMix();
  const ids = mix.map((signal) => signal.id);

  assert.equal(mix.length, 5, 'Daily Mix should provide five signals when enough are available.');
  assert.equal(new Set(ids).size, 5, 'Daily Mix should not contain duplicate signals.');
  assert.ok(ids.includes('unseen-interest'), 'Daily Mix should include an interest signal.');
  assert.ok(ids.includes('weak-due'), 'Daily Mix should include a weak or due signal.');
  assert.ok(ids.includes('old-learned'), 'Daily Mix should include an older learned signal.');
  assert.ok(mix.filter((signal) => !progress[signal.id]).length >= 2, 'Daily Mix should include at least two unseen signals.');
  assert.deepEqual(repeat.map((signal) => signal.id), ids, 'Daily Mix should be deterministic for a fixed date and input.');
}

function testUnseenAndTopicFilters() {
  const progress = {
    'weak-due': { firstLearnedAt: '2026-07-01T00:00:00.000Z', mastery: 'fuzzy' },
    'old-learned': { firstLearnedAt: '2026-06-01T00:00:00.000Z', mastery: 'clear' }
  };

  const unseenLoad = loadLearningEngine('?feed=unseen', progress);
  const unseen = unseenLoad.windowValue.EnglishRadarLearningEngine.getFilteredSignals();
  assert.ok(unseen.length > 0);
  assert.ok(unseen.every((signal) => !progress[signal.id]), 'Discovery mode should contain only unseen signals.');

  const fandomLoad = loadLearningEngine('?topic=fandom', progress);
  const fandom = fandomLoad.windowValue.EnglishRadarLearningEngine.getFilteredSignals();
  assert.ok(fandom.length > 0);
  assert.ok(fandom.every((signal) => /fandom|idol|k-pop|j-pop/i.test([signal.category].concat(signal.platforms || []).join(' '))));
}

function testTodaySnapshot() {
  const signals = buildSignals();
  let customReads = 0;
  let progressReads = 0;
  const registry = {};
  const progress = {};
  const windowValue = {
    location: { search: '' },
    EnglishRadarContent: registry,
    ENGLISH_RADAR_SIGNALS: signals,
    EnglishRadarStorage: {
      getCustomSignals: function () { customReads += 1; return { signals: {} }; },
      getInbox: function () { return []; },
      getProgress: function () { progressReads += 1; return progress; }
    },
    ENGLISH_RADAR_QUIZZES: []
  };
  const context = createContext(windowValue, FixedDate);
  runScript('js/content-registry.js', context);
  const originalRegistryMethod = windowValue.EnglishRadarContent.getActiveLearningSignals;
  runScript('js/learning-engine.js', context);
  const engine = windowValue.EnglishRadarLearningEngine;
  const first = engine.getTodaySnapshot();
  const second = engine.getTodaySnapshot();
  assert.equal(first, second, 'Today snapshot should be reused during one page lifecycle.');
  assert.equal(customReads, 1, 'Today snapshot should read customSignals once.');
  assert.equal(progressReads, 1, 'Today snapshot should read progress once.');
  assert.equal(windowValue.EnglishRadarContent.getActiveLearningSignals, originalRegistryMethod, 'Learning Engine must not replace Registry methods.');
  assert.equal(first.dailyMix.length, 5, 'Today snapshot should include a five-signal Daily Mix.');
}

testReviewSchedule();
testDailyMix();
testUnseenAndTopicFilters();
testTodaySnapshot();

console.log('English Radar v1.1 learning engine tests passed.');
