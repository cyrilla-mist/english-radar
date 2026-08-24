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
  var todayFocusCache = null;
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
    'Product Naming',
    'Community Discourse',
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

  function isInterface(signal) { return !!(signal && signal.radarType === 'interface'); }
  function quizList() { return window.EnglishRadarQuizRegistry && typeof window.EnglishRadarQuizRegistry.getStaticQuizzes === 'function' ? window.EnglishRadarQuizRegistry.getStaticQuizzes() : (Array.isArray(window.ENGLISH_RADAR_QUIZZES) ? window.ENGLISH_RADAR_QUIZZES : []); }

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

  function localDayOrdinal() {
    var now = new Date();
    return Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
  }

  function cloneFocus(collection, signals) {
    if (!collection) return null;
    var result = {
      id: collection.id,
      title: collection.title,
      description: collection.description,
      signalIds: Array.isArray(collection.signalIds) ? collection.signalIds.slice() : []
    };
    return result;
  }

  function getContextCollections() {
    return Array.isArray(window.SIDEGLANCE_CONTEXT_COLLECTIONS) ? window.SIDEGLANCE_CONTEXT_COLLECTIONS : [];
  }

  function getEligibleCollections(allSignals) {
    var signalMap = {};
    allSignals.forEach(function (signal) { if (signal && signal.id) signalMap[signal.id] = signal; });
    return getContextCollections().map(function (collection) {
      var resolvedSignals = Array.isArray(collection && collection.signalIds) ? collection.signalIds.map(function (id) { return signalMap[id]; }).filter(Boolean) : [];
      return { collection: collection, signals: resolvedSignals };
    }).filter(function (entry) { return entry.signals.length >= 3; });
  }

  function getTodayFocusEntry() {
    var eligible = getEligibleCollections(getBaseSignals());
    if (!eligible.length) return null;
    return eligible[localDayOrdinal() % eligible.length];
  }

  function getTodayFocus() {
    if (todayFocusCache) return cloneFocus(todayFocusCache.collection, todayFocusCache.signals);
    var entry = getTodayFocusEntry();
    if (!entry) return null;
    todayFocusCache = { collection: entry.collection, signals: entry.signals };
    return cloneFocus(entry.collection, entry.signals);
  }

  function masteryTier(signal, progress) {
    var record = progress[signal.id];
    if (!record || !record.firstLearnedAt) return 0;
    return record.mastery === 'clear' ? 2 : 1;
  }

  function rankFocusSignals(signals, focusId, progress) {
    return signals.map(function (signal, index) {
      return { signal: signal, index: index, tier: masteryTier(signal, progress), rank: hash(dateKey + '|' + focusId + '|' + text(signal.id)) };
    }).sort(function (a, b) {
      return a.tier - b.tier || a.rank - b.rank || a.index - b.index;
    }).map(function (entry) { return entry.signal; });
  }

  function relationTarget(signal, target, signalById, signalByTerm) {
    var id = text(target);
    var normalized = id.toLowerCase().replace(/\s+/g, ' ');
    return signalById[id] || signalByTerm[normalized] || null;
  }

  function findExplicitConnection(selectedFocus, allSignals, selectedIds) {
    var resolver = window.SideglanceSignalResolver;
    if (!resolver || typeof resolver.resolve !== 'function') return null;
    var signalById = {}; var signalByTerm = {};
    allSignals.forEach(function (signal) {
      signalById[signal.id] = signal;
      signalByTerm[text(signal.term).toLowerCase().replace(/\s+/g, ' ')] = signal;
    });
    for (var focusIndex = 0; focusIndex < selectedFocus.length; focusIndex += 1) {
      var focus = selectedFocus[focusIndex];
      var relations = resolver.resolve(focus).relations || [];
      for (var relationIndex = 0; relationIndex < relations.length; relationIndex += 1) {
        var candidate = relationTarget(focus, relations[relationIndex].target, signalById, signalByTerm);
        if (candidate && !selectedIds[candidate.id]) return candidate;
      }
    }
    for (var candidateIndex = 0; candidateIndex < allSignals.length; candidateIndex += 1) {
      var reverse = allSignals[candidateIndex];
      if (selectedIds[reverse.id]) continue;
      var reverseRelations = resolver.resolve(reverse).relations || [];
      for (var reverseRelationIndex = 0; reverseRelationIndex < reverseRelations.length; reverseRelationIndex += 1) {
        var target = relationTarget(reverse, reverseRelations[reverseRelationIndex].target, signalById, signalByTerm);
        if (target && selectedIds[target.id]) return reverse;
      }
    }
    return null;
  }

  function buildDailyMixV2(allSignals, progress, focusEntry) {
    var now = new Date();
    var selected = []; var selectedIds = {};
    function add(signal) { if (signal && !selectedIds[signal.id] && selected.length < 5) { selected.push(signal); selectedIds[signal.id] = true; } }
    var focusSignals = rankFocusSignals(focusEntry.signals, focusEntry.collection.id, progress);
    focusSignals.slice(0, 3).forEach(add);
    add(pickOldest(allSignals.filter(function (signal) { return !selectedIds[signal.id] && dueOrWeak(signal, progress, now); }), progress, selectedIds));
    add(findExplicitConnection(selected.slice(0, 3), allSignals, selectedIds));
    var fallbackGroups = [
      allSignals.filter(function (signal) { return !selectedIds[signal.id] && dueOrWeak(signal, progress, now); }),
      allSignals.filter(function (signal) { return !selectedIds[signal.id] && progress[signal.id] && masteryTier(signal, progress) === 1; }),
      allSignals.filter(function (signal) { return !selectedIds[signal.id] && isUnseen(signal, progress); }),
      allSignals.filter(function (signal) { return !selectedIds[signal.id]; })
    ];
    fallbackGroups.forEach(function (group) { if (selected.length < 5) add(pickDeterministic(group, selectedIds, 'daily-radar-fallback')); });
    return unique(selected).slice(0, 5);
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
    var interfaceSignals = allSignals.filter(isInterface);
    var selected = [];
    var selectedIds = {};
    function add(signal) { if (signal && !selectedIds[signal.id] && selected.length < 5) { selected.push(signal); selectedIds[signal.id] = true; } }
    add(pickDeterministic(unseen.filter(function (signal) { return !isInterface(signal); }), selectedIds, 'unseen'));
    add(pickDeterministic(unseen.filter(function (signal) { return !isInterface(signal); }), selectedIds, 'unseen'));
    add(pickDeterministic(unseenInterest.length ? unseenInterest : interestAny, selectedIds, unseenInterest.length ? 'interest-unseen' : 'interest-any'));
    add(pickOldest(weak.filter(function (signal) { return !isInterface(signal); }), progress, selectedIds));
    add(pickOldest(learned.filter(function (signal) { return !isInterface(signal); }), progress, selectedIds));
    var interfaceCandidate = pickDeterministic(interfaceSignals.filter(function (signal) { return isUnseen(signal, progress) || dueOrWeak(signal, progress, now); }), selectedIds, 'interface-priority') || pickOldest(interfaceSignals, progress, selectedIds);
    if (interfaceCandidate) { selected.splice(Math.min(2, selected.length), 0, interfaceCandidate); selectedIds[interfaceCandidate.id] = true; selected = selected.slice(0, 5); }
    allSignals.forEach(function (signal) { if (selected.length < 5 && !selectedIds[signal.id] && !isInterface(signal)) add(signal); });
    if (selected.length < 5) allSignals.forEach(function (signal) { if (selected.length < 5 && !selectedIds[signal.id]) add(signal); });
    return unique(selected).slice(0, 5);
  }

  function getBaseSignals() {
    if (baseSignalsCache) return baseSignalsCache;
    baseSignalsCache = registry && typeof registry.getActiveLearningSignals === 'function' ? registry.getActiveLearningSignals() : [];
    return baseSignalsCache;
  }

  function getDailyMix() {
    var build = function () {
      var signals = getBaseSignals();
      var focusEntry = getTodayFocusEntry();
      return focusEntry ? buildDailyMixV2(signals, progressMap(), focusEntry) : buildDailyMix(signals, progressMap());
    };
    return window.EnglishRadarPerformanceDebug ? window.EnglishRadarPerformanceDebug.measure('today.dailyMixCalculation', build) : build();
  }

  function buildStatistics(signals, progress) {
    var now = new Date();
    var quizIds = {};
    quizList().forEach(function (quiz) { if (quiz && quiz.signalId) quizIds[quiz.signalId] = true; });
    var learned = 0; var mastered = 0; var due = 0; var todayRecords = 0; var clearToday = 0; var fuzzyToday = 0;
    signals.forEach(function (signal) {
      var record = progress[signal.id];
      if (!record || !record.firstLearnedAt) return;
      learned += 1;
      if (record.mastery === 'clear') mastered += 1;
      if (review && typeof review.isDue === 'function' && review.isDue(record, now)) due += 1;
      if (review && typeof review.sameLocalDay === 'function' && review.sameLocalDay(review.asDate(record.lastReviewedAt), now)) { todayRecords += 1; if (record.mastery === 'clear') clearToday += 1; if (record.mastery === 'fuzzy' || record.mastery === 'new') fuzzyToday += 1; }
    });
    var quizReady = signals.filter(function (signal) { return quizIds[signal.id]; }).length;
    return { learned: learned, mastered: mastered, unseen: signals.length - learned, learning: learned - mastered, due: due, todayRecords: todayRecords, clearToday: clearToday, fuzzyToday: fuzzyToday, quizReady: quizReady, quizSignalIds: quizIds };
  }

  function getTodaySnapshot() {
    if (todaySnapshotCache) return todaySnapshotCache;
    var build = function () {
      var signals = getBaseSignals();
      var progress = progressMap();
      var todayFocus = getTodayFocus();
      var dailyMix = getDailyMix();
      var statistics = window.EnglishRadarPerformanceDebug ? window.EnglishRadarPerformanceDebug.measure('today.statisticsCalculation', function () { return buildStatistics(signals, progress); }) : buildStatistics(signals, progress);
      return { signals: signals, progress: progress, todayFocus: todayFocus, dailyMix: dailyMix, statistics: statistics, quizReadyCount: statistics.quizReady };
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
    getTodayFocus: getTodayFocus,
    getDailyMix: getDailyMix,
    getTodaySnapshot: getTodaySnapshot,
    getProgress: progressMap,
    getUnseenCount: function () { var progress = progressMap(); return getBaseSignals().filter(function (signal) { return isUnseen(signal, progress); }).length; },
    interestCategories: interestCategories.slice(),
    dateKey: dateKey,
    _resetForTests: function () { baseSignalsCache = null; progressCache = null; todaySnapshotCache = null; todayFocusCache = null; }
  };
}());
