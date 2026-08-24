'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

for (const file of ['index.html', 'learn.html']) {
  const html = read(file);
  const signalV2 = html.indexOf('data/signal-v2.js');
  const collections = html.indexOf('data/context-collections.js');
  const resolver = html.indexOf('js/signal-resolver.js');
  const engine = html.indexOf('js/learning-engine.js');
  assert.ok(signalV2 !== -1 && signalV2 < collections && collections < resolver && resolver < engine, `${file} must load Phase 2B1 dependencies before the learning engine.`);
}

function createDate(iso) {
  const fixed = new Date(iso);
  return class FixedDate extends Date {
    constructor(...args) { super(...(args.length ? args : [fixed.getTime()])); }
    static now() { return fixed.getTime(); }
  };
}

function createContext({ date, signals, collections, overlay, progress, currentSession }) {
  let sessionWrites = 0;
  const windowValue = {
    location: { search: '' },
    ENGLISH_RADAR_SIGNALS: signals,
    SIDEGLANCE_CONTEXT_COLLECTIONS: collections,
    SIDEGLANCE_SIGNAL_V2: overlay || {},
    EnglishRadarContent: { getActiveLearningSignals: () => signals.slice() },
    EnglishRadarStorage: {
      getProgress: () => progress,
      getCurrentSession: () => currentSession,
      setCurrentSession: () => { sessionWrites += 1; }
    }
  };
  const context = vm.createContext({ window: windowValue, console, Date: createDate(date), Intl, Number, Math, Array, Object, String, URLSearchParams });
  vm.runInContext(read('js/signal-resolver.js'), context);
  vm.runInContext(read('js/learning-engine.js'), context);
  return { windowValue, engine: windowValue.EnglishRadarLearningEngine, getSessionWrites: () => sessionWrites };
}

function signal(id, category = 'Internet Culture', term = id) {
  return { id, term, category, meaningEn: id, meaningZh: id, exampleEn: id };
}

function collection(id, ids) { return { id, title: id, description: id + ' description', signalIds: ids }; }

function testRealCollections() {
  const windowValue = { ENGLISH_RADAR_SIGNALS: [], SIDEGLANCE_CONTEXT_COLLECTIONS: [], location: { search: '' } };
  const context = vm.createContext({ window: windowValue, console });
  vm.runInContext(read('data/signals.js'), context);
  vm.runInContext(read('data/context-collections.js'), context);
  const activeIds = new Set(windowValue.ENGLISH_RADAR_SIGNALS.map((item) => item.id));
  const eligible = windowValue.SIDEGLANCE_CONTEXT_COLLECTIONS.filter((item) => item.signalIds.filter((id) => activeIds.has(id)).length >= 3);
  assert.equal(eligible.length, 6, 'All six current Context Collections should be eligible.');
}

function testFocusRotationAndPriority() {
  const groups = [
    ['a1', 'a2', 'a3'], ['b1', 'b2', 'b3'], ['c1', 'c2', 'c3']
  ];
  const signals = groups.flatMap((ids) => ids.map((id) => signal(id)));
  const collections = groups.map((ids, index) => collection('collection-' + index, ids));
  const progress = { a2: { firstLearnedAt: '2026-01-01T00:00:00.000Z', mastery: 'clear' }, a3: { firstLearnedAt: '2026-01-01T00:00:00.000Z', mastery: 'fuzzy' } };
  const first = createContext({ date: '2026-08-24T12:00:00.000Z', signals, collections, progress });
  const repeated = first.engine.getTodayFocus();
  assert.deepEqual(first.engine.getTodayFocus(), repeated, 'Focus should be deterministic during a local day.');
  assert.equal(repeated.signalIds.length, 3);
  assert.equal(first.engine.getDailyMix().slice(0, 3).every((item) => repeated.signalIds.includes(item.id)), true, 'First three Daily Mix entries must be Focus Signals.');
  const unseenFocus = repeated.signalIds.filter((id) => !progress[id]);
  assert.ok(unseenFocus.includes(first.engine.getDailyMix()[0].id), 'Unseen Focus Signals must outrank learned Focus Signals.');

  const changedProgress = createContext({ date: '2026-08-24T12:00:00.000Z', signals, collections, progress: {} });
  assert.equal(changedProgress.engine.getTodayFocus().id, repeated.id, 'Progress changes must not switch Today\'s Focus.');
  const next = createContext({ date: '2026-08-25T12:00:00.000Z', signals, collections, progress });
  const nextIndex = (collections.findIndex((item) => item.id === repeated.id) + 1) % collections.length;
  assert.equal(next.engine.getTodayFocus().id, collections[nextIndex].id, 'Next local day must advance editorial rotation.');
  const wrap = createContext({ date: '2026-08-26T12:00:00.000Z', signals, collections, progress });
  assert.equal(wrap.engine.getTodayFocus().id, collections[(nextIndex + 1) % collections.length].id, 'Rotation must continue deterministically.');

  const prioritySignals = ['p1', 'p2', 'p3'].map((id) => signal(id));
  const priority = createContext({
    date: '2026-08-24T12:00:00.000Z',
    signals: prioritySignals,
    collections: [collection('priority', ['p1', 'p2', 'p3'])],
    progress: {
      p1: { firstLearnedAt: '2026-01-01T00:00:00.000Z', mastery: 'clear' },
      p2: { firstLearnedAt: '2026-01-01T00:00:00.000Z', mastery: 'fuzzy' },
      p3: { firstLearnedAt: '2026-01-01T00:00:00.000Z', mastery: 'clear' }
    }
  });
  const priorityIds = priority.engine.getDailyMix().slice(0, 3).map((item) => item.id);
  assert.ok(priorityIds.indexOf('p2') < priorityIds.indexOf('p1'), 'Learned non-clear Focus Signals must outrank clear Signals.');
}

function testMixRelationsFallbackAndSafety() {
  const ids = ['focus-1', 'focus-2', 'focus-3', 'revisit', 'connected', 'same-category', 'fallback'];
  const signals = ids.map((id) => signal(id, id === 'same-category' ? 'Focus Category' : 'Other'));
  const collections = [collection('focus', ['focus-1', 'focus-2', 'focus-3'])];
  const overlay = { 'focus-1': { relations: [{ target: 'connected', type: 'same-context' }] } };
  const progress = {
    revisit: { firstLearnedAt: '2026-01-01T00:00:00.000Z', lastReviewedAt: '2026-01-02T00:00:00.000Z', nextReviewAt: '2026-01-03T00:00:00.000Z', mastery: 'fuzzy' },
    'focus-2': { firstLearnedAt: '2026-01-01T00:00:00.000Z', mastery: 'clear' }
  };
  const currentSession = { mode: 'learn', signalIds: ['legacy-session'], currentIndex: 1 };
  const loaded = createContext({ date: '2026-08-24T12:00:00.000Z', signals, collections, overlay, progress, currentSession });
  const rawBefore = JSON.stringify(signals);
  const overlayBefore = JSON.stringify(overlay);
  const mix = loaded.engine.getDailyMix();
  assert.equal(mix.length, 5);
  assert.equal(new Set(mix.map((item) => item.id)).size, 5, 'Daily Mix IDs must be unique.');
  assert.ok(mix.slice(0, 3).every((item) => item.id.startsWith('focus-')), 'Daily Mix must start with three Focus Signals.');
  assert.ok(mix.some((item) => item.id === 'revisit'), 'Due/weak learned Signal should fill Revisit.');
  assert.ok(mix.some((item) => item.id === 'connected'), 'Explicit v2 relation should fill Connection.');
  assert.deepEqual(JSON.stringify(signals), rawBefore, 'Selection must not mutate legacy Signal records.');
  assert.deepEqual(JSON.stringify(overlay), overlayBefore, 'Selection must not mutate Signal v2 overlay records.');
  assert.deepEqual(loaded.engine.getTodaySnapshot().dailyMix.map((item) => item.id), mix.map((item) => item.id));
  assert.equal(loaded.engine.getTodaySnapshot().todayFocus.id, 'focus');
  assert.equal(loaded.getSessionWrites(), 0, 'Focus, Mix, and Snapshot must not write the current session.');
  assert.deepEqual(currentSession, { mode: 'learn', signalIds: ['legacy-session'], currentIndex: 1 });

  const noRelation = createContext({ date: '2026-08-24T12:00:00.000Z', signals, collections, progress, currentSession });
  const fallbackMix = noRelation.engine.getDailyMix();
  assert.equal(fallbackMix.length, 5, 'No explicit relation must still produce a valid mix.');
  assert.equal(new Set(fallbackMix.map((item) => item.id)).size, 5);
}

function testReverseRelationBoundaries() {
  const focusIds = ['focus-a', 'focus-b', 'focus-c'];
  const collections = [collection('focus', focusIds)];
  const baseSignals = focusIds.concat(['revisit', 'candidate', 'unrelated']).map((id) => signal(id));
  const progress = {
    revisit: { firstLearnedAt: '2026-01-01T00:00:00.000Z', lastReviewedAt: '2026-01-02T00:00:00.000Z', nextReviewAt: '2026-01-03T00:00:00.000Z', mastery: 'fuzzy' },
    candidate: { firstLearnedAt: '2026-01-01T00:00:00.000Z', mastery: 'clear' }
  };

  const reverseFocus = createContext({
    date: '2026-08-24T12:00:00.000Z',
    signals: baseSignals,
    collections,
    progress,
    overlay: { candidate: { relations: [{ target: 'focus-a', type: 'same-context' }] } }
  });
  assert.ok(reverseFocus.engine.getDailyMix().includes(baseSignals.find((item) => item.id === 'candidate')), 'A reverse relation pointing to Focus must qualify as Connection.');

  const reverseRevisit = createContext({
    date: '2026-08-24T12:00:00.000Z',
    signals: baseSignals,
    collections,
    progress,
    overlay: { candidate: { relations: [{ target: 'revisit', type: 'same-context' }] } }
  });
  const rejected = reverseRevisit.engine.getDailyMix();
  assert.ok(rejected.some((item) => item.id === 'unrelated'), 'An unrelated unseen Signal should fill the slot when no Focus relation exists.');
  assert.ok(!rejected.some((item) => item.id === 'candidate'), 'A relation to Revisit must not qualify as Connection.');
}

function testMetadataDoesNotCreateConnection() {
  const focusIds = ['meta-a', 'meta-b', 'meta-c'];
  const signals = focusIds.concat(['meta-revisit', 'metadata-only', 'meta-unrelated']).map((id) => signal(id));
  signals.slice(0, 3).forEach((item) => { item.category = 'Shared Context'; item.tone = ['Casual']; item.platforms = ['Discord']; });
  const metadataOnly = signals.find((item) => item.id === 'metadata-only');
  metadataOnly.category = 'Shared Context';
  metadataOnly.tone = ['Casual'];
  metadataOnly.platforms = ['Discord'];
  const progress = {
    'meta-revisit': { firstLearnedAt: '2026-01-01T00:00:00.000Z', nextReviewAt: '2026-01-03T00:00:00.000Z', mastery: 'fuzzy' },
    'metadata-only': { firstLearnedAt: '2026-01-01T00:00:00.000Z', mastery: 'clear' }
  };
  const result = createContext({ date: '2026-08-24T12:00:00.000Z', signals, collections: [collection('metadata-focus', focusIds)], progress }).engine.getDailyMix();
  assert.ok(result.some((item) => item.id === 'meta-unrelated'), 'Ordinary fallback should remain available.');
  assert.ok(!result.some((item) => item.id === 'metadata-only'), 'Shared category/tone/platform metadata must not create a Connection.');
}

function testSameDayDailyMixDeterminism() {
  const ids = ['day-a', 'day-b', 'day-c', 'day-review', 'day-other', 'day-fallback'];
  const signals = ids.map((id) => signal(id));
  const collections = [collection('day-focus', ['day-a', 'day-b', 'day-c'])];
  const progress = {
    'day-review': { firstLearnedAt: '2026-01-01T00:00:00', lastReviewedAt: '2026-08-01T00:00:00', nextReviewAt: '2026-08-24T18:00:00', mastery: 'clear' }
  };
  const beforeCutoff = createContext({ date: '2026-08-24T12:00:00', signals, collections, progress }).engine.getDailyMix().map((item) => item.id);
  const afterCutoff = createContext({ date: '2026-08-24T20:00:00', signals, collections, progress }).engine.getDailyMix().map((item) => item.id);
  assert.equal(JSON.stringify(afterCutoff), JSON.stringify(beforeCutoff), 'Daily Mix must remain stable across review cutoff changes on one local day.');
}

testRealCollections();
testFocusRotationAndPriority();
testMixRelationsFallbackAndSafety();
testReverseRelationBoundaries();
testMetadataDoesNotCreateConnection();
testSameDayDailyMixDeterminism();
console.log('PASS: Sideglance v0.2 Phase 2B1 Daily Radar selection checks');
