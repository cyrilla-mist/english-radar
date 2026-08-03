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

function createContext(windowValue) {
  const context = vm.createContext({
    window: windowValue,
    console,
    Date,
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
    { id: 'extra-unseen', term: 'eta', category: 'Meme English', platforms: ['TikTok'] }
  ];
}

function loadLearningEngine(search, progress) {
  const signals = buildSignals();
  const registry = { getActiveLearningSignals: () => signals.slice() };
  const windowValue = {
    location: { search },
    EnglishRadarContent: registry,
    EnglishRadarStorage: { getProgress: () => progress }
  };
  const context = createContext(windowValue);
  runScript('js/learning-engine.js', context);
  return { windowValue, registry, signals };
}

function testDailyMix() {
  const now = Date.now();
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
  const mix = windowValue.EnglishRadarContent.getActiveLearningSignals().slice(0, 5);
  const ids = mix.map((signal) => signal.id);

  assert.equal(mix.length, 5, 'Daily Mix should provide five signals when enough are available.');
  assert.equal(new Set(ids).size, 5, 'Daily Mix should not contain duplicate signals.');
  assert.ok(ids.includes('unseen-interest'), 'Daily Mix should include an interest signal.');
  assert.ok(ids.includes('weak-due'), 'Daily Mix should include a weak or due signal.');
  assert.ok(ids.includes('old-learned'), 'Daily Mix should include an older learned signal.');
  assert.ok(mix.filter((signal) => !progress[signal.id]).length >= 2, 'Daily Mix should include at least two unseen signals.');
}

function testUnseenAndTopicFilters() {
  const progress = {
    'weak-due': { firstLearnedAt: '2026-07-01T00:00:00.000Z', mastery: 'fuzzy' },
    'old-learned': { firstLearnedAt: '2026-06-01T00:00:00.000Z', mastery: 'clear' }
  };

  const unseenLoad = loadLearningEngine('?feed=unseen', progress);
  const unseen = unseenLoad.windowValue.EnglishRadarContent.getActiveLearningSignals();
  assert.ok(unseen.length > 0);
  assert.ok(unseen.every((signal) => !progress[signal.id]), 'Discovery mode should contain only unseen signals.');

  const fandomLoad = loadLearningEngine('?topic=fandom', progress);
  const fandom = fandomLoad.windowValue.EnglishRadarContent.getActiveLearningSignals();
  assert.ok(fandom.length > 0);
  assert.ok(fandom.every((signal) => /fandom|idol|k-pop|j-pop/i.test([signal.category].concat(signal.platforms || []).join(' '))));
}

testReviewSchedule();
testDailyMix();
testUnseenAndTopicFilters();

console.log('English Radar v1.1 learning engine tests passed.');
