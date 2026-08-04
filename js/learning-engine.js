(function () {
  'use strict';

  var registry = window.EnglishRadarContent;
  if (!registry || typeof registry.getActiveLearningSignals !== 'function') {
    registry = registry || {};
    registry.getActiveLearningSignals = function () { return Array.isArray(window.ENGLISH_RADAR_SIGNALS) ? window.ENGLISH_RADAR_SIGNALS.slice() : []; };
    window.EnglishRadarContent = registry;
  }
  var storage = window.EnglishRadarStorage;
  var review = window.EnglishRadarReview;
  var baseSignalsCache = null;
  var progressCache = null;
  var todaySnapshotCache = null;
  var params = new URLSearchParams(window.location.search);
  var dateKey = (function () {
    var now = new Date();
    return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
  }());

  var interestCategories = [
    'Idol Fandom English',
    'Fandom English',
    'Japanese Sports English',
    'Sports English',
    'Hackathon English',
    'AI Builder English',
    'Builder English',
    'Product Design English',
    'Discord & Reddit English',
    'Meme English'
  ];

  function text(value) {
    return String(value === undefined || value === null ? '' : value).trim();
  }

  function hash(value) {
    var result = 2166136261;
    var input = String(value || '');
    for (var index = 0; index < input.length; index += 1) {
      result ^= input.charCodeAt(index);
      result = Math.imul(result, 16777619);
    }
    return result >>> 0;
  }

  function stableShuffle(items, salt) {
    return items.slice().sort(function (a, b) {
      return hash(dateKey + '|' + salt + '|' + text(a && a.id)) - hash(dateKey + '|' + salt + '|' + text(b && b.id));
    });
  }

  function pickDeterministic(items, selectedIds, salt) {
    var best = null;
    var bestRank = Infinity;
    items.forEach(function (signal) {
      if (!signal || selectedIds[signal.id]) return;
      var rank = hash(dateKey + '|' + salt + '|' + text(signal.id));
      if (rank < bestRank) { best = signal; bestRank = rank; }
    });
    return best;
  }

  function asDate(value) {
    if (!value) return null;
    var parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  function unique(items) {
    var seen = {};
    return items.filter(function (item) {
      if (!item || !item.id || seen[item.id]) return false;
      seen[item.id] = true;
      return true;
    });
  }

  function progressMap() {
    if (progressCache) return progressCache;
    progressCache = storage && typeof storage.getProgress === 'function' ? storage.getProgress() : {};
    return progressCache;
  }

  function isUnseen(signal, progress) {
    return !(progress[signal.id] && progress[signal.id].firstLearnedAt);
  }

  function isInterest(signal) {
    return interestCategories.indexOf(text(signal.category)) !== -1;
  }

  function dueOrWeak(signal, progress, now) {
    var record = progress[signal.id];
    if (!record || !record.firstLearnedAt) return false;
    var due = asDate(record.nextReviewAt);
    return record.mastery === 'new' || record.mastery === 'fuzzy' || !!(due && due.getTime() <= now.getTime());
  }

  function pickOldest(items, progress, selectedIds) {
    var best = null;
    var bestTime = Infinity;
    var bestRank = Infinity;
    items.forEach(function (signal) {
      if (!signal || selectedIds[signal.id]) return;
      var parsed = asDate(progress[signal.id] && progress[signal.id].lastReviewedAt);
      var time = parsed ? parsed.getTime() : 0;
      var rank = hash(dateKey + '|oldest|' + text(signal.id));
      if (time < bestTime || (time === bestTime && rank < bestRank)) { best = signal; bestTime = time; bestRank = rank; }
    });
    return best;
  }

  function buildDailyMix(allSignals, progress) {
    var now = new Date();
    var unseen = [];
    var unseenInterest = [];
    var interestAny = [];
    var weak = [];
    var learned = [];
    allSignals.forEach(function (signal) {
      var unseenSignal = isUnseen(signal, progress);
      if (unseenSignal) unseen.push(signal);
      if (isInterest(signal)) { interestAny.push(signal); if (unseenSignal) unseenInterest.push(signal); }
      if (dueOrWeak(signal, progress, now)) weak.push(signal);
      if (!unseenSignal) learned.push(signal);
    });
    var selected = [];
    var selectedIds = {};
    function add(signal) { if (signal && !selectedIds[signal.id] && selected.length < 5) { selected.push(signal); selectedIds[signal.id] = true; } }
    add(pickDeterministic(unseen, selectedIds, 'unseen'));
    add(pickDeterministic(unseen, selectedIds, 'unseen'));
    add(pickDeterministic(unseenInterest.length ? unseenInterest : interestAny, selectedIds, unseenInterest.length ? 'interest-unseen' : 'interest-any'));
    add(pickOldest(weak, progress, selectedIds));
    add(pickOldest(learned, progress, selectedIds));
    allSignals.forEach(function (signal) { if (selected.length < 5 && !selectedIds[signal.id]) add(signal); });
    return unique(selected).slice(0, 5);
  }

  function getBaseSignals() {
    if (baseSignalsCache) return baseSignalsCache;
    baseSignalsCache = registry && typeof registry.getActiveLearningSignals === 'function' ? registry.getActiveLearningSignals() : [];
    return baseSignalsCache;
  }

  function getDailyMix() {
    var build = function () { return buildDailyMix(getBaseSignals(), progressMap()); };
    return window.EnglishRadarPerformanceDebug ? window.EnglishRadarPerformanceDebug.measure('today.dailyMixCalculation', build) : build();
  }

  function buildStatistics(signals, progress) {
    var now = new Date();
    var quizIds = {};
    (Array.isArray(window.ENGLISH_RADAR_QUIZZES) ? window.ENGLISH_RADAR_QUIZZES : []).forEach(function (quiz) { if (quiz && quiz.signalId) quizIds[quiz.signalId] = true; });
    var learned = 0; var mastered = 0; var due = 0; var todayRecords = 0; var clearToday = 0; var fuzzyToday = 0;
    signals.forEach(function (signal) {
      var record = progress[signal.id];
      if (!record || !record.firstLearnedAt) return;
      learned += 1;
      if (record.mastery === 'clear') mastered += 1;
      if (review && typeof review.isDue === 'function' && review.isDue(record, now)) due += 1;
      if (review && typeof review.sameLocalDay === 'function' && review.sameLocalDay(review.asDate(record.lastReviewedAt), now)) { todayRecords += 1; if (record.mastery === 'clear') clearToday += 1; if (record.mastery === 'fuzzy' || record.mastery === 'new') fuzzyToday += 1; }
    });
    var quizReady = signals.filter(function (signal) { return quizIds[signal.id] || signal.quizStatus === 'ready'; }).length;
    return { learned: learned, mastered: mastered, unseen: signals.length - learned, learning: learned - mastered, due: due, todayRecords: todayRecords, clearToday: clearToday, fuzzyToday: fuzzyToday, quizReady: quizReady, quizSignalIds: quizIds };
  }

  function getTodaySnapshot() {
    if (todaySnapshotCache) return todaySnapshotCache;
    var build = function () {
      var signals = getBaseSignals();
      var progress = progressMap();
      var dailyMix = getDailyMix();
      var statistics = window.EnglishRadarPerformanceDebug ? window.EnglishRadarPerformanceDebug.measure('today.statisticsCalculation', function () { return buildStatistics(signals, progress); }) : buildStatistics(signals, progress);
      return { signals: signals, progress: progress, dailyMix: dailyMix, statistics: statistics, quizReadyCount: statistics.quizReady };
    };
    todaySnapshotCache = window.EnglishRadarPerformanceDebug ? window.EnglishRadarPerformanceDebug.measure('today.snapshotBuild', build) : build();
    return todaySnapshotCache;
  }

  function topicMatch(signal, topic) {
    var category = text(signal.category).toLowerCase();
    var categoryGroups = {
      internet: ['internet culture', 'community english', 'meme english'],
      builder: ['ai builder', 'github', 'github / development', 'builder english', 'hackathon english'],
      fandom: ['fandom', 'idol fandom english', 'fandom english'],
      sports: ['sports', 'sports / everyday', 'sports english', 'japanese sports english'],
      design: ['product design', 'product design english']
    };
    return (categoryGroups[topic] || []).some(function (name) { return category === name; });
  }

  function getLearningSignals() {
    var allSignals = getBaseSignals();
    var progress = progressMap();
    var feed = params.get('feed');
    var topic = text(params.get('topic')).toLowerCase();
    var category = text(params.get('category'));

    if (feed === 'daily-mix') return getDailyMix();
    if (feed === 'unseen') {
      var unseen = allSignals.filter(function (signal) { return isUnseen(signal, progress); });
      return stableShuffle(unseen.length ? unseen : allSignals, 'discovery');
    }
    if (category) return stableShuffle(allSignals.filter(function (signal) { return text(signal.category) === category; }), 'category-' + category);
    if (topic) return stableShuffle(allSignals.filter(function (signal) { return topicMatch(signal, topic); }), 'topic-' + topic);
    return allSignals;
  }

  window.EnglishRadarLearningEngine = {
    getBaseSignals: getBaseSignals,
    getFilteredSignals: getLearningSignals,
    getSignals: getLearningSignals,
    getDailyMix: getDailyMix,
    getTodaySnapshot: getTodaySnapshot,
    getProgress: progressMap,
    getUnseenCount: function () { var progress = progressMap(); return getBaseSignals().filter(function (signal) { return isUnseen(signal, progress); }).length; },
    interestCategories: interestCategories.slice(),
    dateKey: dateKey,
    _resetForTests: function () { baseSignalsCache = null; progressCache = null; todaySnapshotCache = null; }
  };
}());
