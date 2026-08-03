(function () {
  'use strict';

  var registry = window.EnglishRadarContent;
  if (!registry || typeof registry.getActiveLearningSignals !== 'function') return;

  var originalGetSignals = registry.getActiveLearningSignals.bind(registry);
  var storage = window.EnglishRadarStorage;
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
    return storage && typeof storage.getProgress === 'function' ? storage.getProgress() : {};
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

  function oldestFirst(items, progress) {
    return items.slice().sort(function (a, b) {
      var left = asDate(progress[a.id] && progress[a.id].lastReviewedAt);
      var right = asDate(progress[b.id] && progress[b.id].lastReviewedAt);
      return (left ? left.getTime() : 0) - (right ? right.getTime() : 0);
    });
  }

  function takeFirst(list, selected) {
    for (var index = 0; index < list.length; index += 1) {
      if (!selected.some(function (item) { return item.id === list[index].id; })) {
        selected.push(list[index]);
        return;
      }
    }
  }

  function buildDailyMix(allSignals, progress) {
    var now = new Date();
    var unseen = stableShuffle(allSignals.filter(function (signal) { return isUnseen(signal, progress); }), 'unseen');
    var unseenInterest = stableShuffle(unseen.filter(isInterest), 'interest-unseen');
    var interestAny = stableShuffle(allSignals.filter(isInterest), 'interest-any');
    var weak = oldestFirst(allSignals.filter(function (signal) { return dueOrWeak(signal, progress, now); }), progress);
    var learned = oldestFirst(allSignals.filter(function (signal) { return !isUnseen(signal, progress); }), progress);
    var selected = [];

    takeFirst(unseen, selected);
    takeFirst(unseen.slice(1), selected);
    takeFirst(unseenInterest.length ? unseenInterest : interestAny, selected);
    takeFirst(weak, selected);
    takeFirst(learned, selected);

    unique(unseen.concat(weak, learned, allSignals)).forEach(function (signal) {
      if (selected.length < allSignals.length && !selected.some(function (item) { return item.id === signal.id; })) selected.push(signal);
    });
    return unique(selected);
  }

  function topicMatch(signal, topic) {
    var value = [signal.category].concat(signal.platforms || []).join(' ').toLowerCase();
    var groups = {
      internet: ['internet', 'community', 'reddit', 'discord', 'meme', 'streaming', 'creator', 'platform'],
      builder: ['builder', 'github', 'developer', 'hackathon', 'ai', 'product design'],
      fandom: ['fandom', 'idol', 'k-pop', 'j-pop'],
      sports: ['sport', 'running', 'table tennis', 'volleyball', 'football', 'gaming'],
      design: ['product design', 'ui', 'ux', 'figma']
    };
    return (groups[topic] || [topic]).some(function (keyword) { return value.indexOf(keyword) !== -1; });
  }

  function getLearningSignals() {
    var allSignals = originalGetSignals();
    var progress = progressMap();
    var feed = params.get('feed');
    var topic = text(params.get('topic')).toLowerCase();
    var category = text(params.get('category'));

    if (feed === 'daily-mix') return buildDailyMix(allSignals, progress);
    if (feed === 'unseen') {
      var unseen = allSignals.filter(function (signal) { return isUnseen(signal, progress); });
      return stableShuffle(unseen.length ? unseen : allSignals, 'discovery');
    }
    if (category) return stableShuffle(allSignals.filter(function (signal) { return text(signal.category) === category; }), 'category-' + category);
    if (topic) return stableShuffle(allSignals.filter(function (signal) { return topicMatch(signal, topic); }), 'topic-' + topic);
    return allSignals;
  }

  registry.getActiveLearningSignals = getLearningSignals;
  window.EnglishRadarLearningEngine = {
    getDailyMix: function () { return buildDailyMix(originalGetSignals(), progressMap()).slice(0, 5); },
    getUnseenCount: function () { var progress = progressMap(); return originalGetSignals().filter(function (signal) { return isUnseen(signal, progress); }).length; },
    interestCategories: interestCategories.slice(),
    dateKey: dateKey
  };
}());
