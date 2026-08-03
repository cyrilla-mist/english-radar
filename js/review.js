(function () {
  'use strict';

  var SCHEDULES = {
    new: [1],
    fuzzy: [2, 3, 7, 14],
    clear: [7, 14, 30, 60]
  };
  var ORDER = { new: 0, fuzzy: 1, clear: 2 };

  function asDate(value) {
    if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
    if (!value) return null;
    var date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  function addDays(date, days) {
    var result = new Date(date.getTime());
    result.setDate(result.getDate() + days);
    return result;
  }

  function getReviewDelayDays(mastery, reviewCount) {
    var schedule = SCHEDULES[mastery] || SCHEDULES.new;
    var count = Number(reviewCount);
    if (!Number.isFinite(count) || count < 0) count = 0;
    return schedule[Math.min(count, schedule.length - 1)];
  }

  function getNextReviewAt(mastery, reviewCount, fromDate) {
    var date = asDate(fromDate) || new Date();
    return addDays(date, getReviewDelayDays(mastery, reviewCount)).toISOString();
  }

  function isDue(record, now) {
    var due = asDate(record && record.nextReviewAt);
    return !!due && due.getTime() <= (asDate(now) || new Date()).getTime();
  }

  function getReviewQueue(signals, progress, now) {
    var current = asDate(now) || new Date();
    return (Array.isArray(signals) ? signals : []).filter(function (signal) {
      return progress && progress[signal.id] && isDue(progress[signal.id], current);
    }).sort(function (a, b) {
      var aRecord = progress[a.id];
      var bRecord = progress[b.id];
      var aDate = asDate(aRecord.nextReviewAt);
      var bDate = asDate(bRecord.nextReviewAt);
      var aTime = aDate ? aDate.getTime() : -Infinity;
      var bTime = bDate ? bDate.getTime() : -Infinity;
      if (aTime !== bTime) return aTime - bTime;
      return (ORDER[aRecord.mastery] === undefined ? 9 : ORDER[aRecord.mastery]) - (ORDER[bRecord.mastery] === undefined ? 9 : ORDER[bRecord.mastery]);
    });
  }

  function sameLocalDay(a, b) {
    var first = asDate(a); var second = asDate(b);
    return !!first && !!second && first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate();
  }

  function formatLocalDate(date) {
    var value = asDate(date) || new Date();
    return new Intl.DateTimeFormat(undefined, { month: 'short', day: '2-digit' }).format(value).toUpperCase();
  }

  window.EnglishRadarReview = {
    asDate: asDate,
    getReviewDelayDays: getReviewDelayDays,
    getNextReviewAt: getNextReviewAt,
    isDue: isDue,
    getReviewQueue: getReviewQueue,
    sameLocalDay: sameLocalDay,
    formatLocalDate: formatLocalDate,
    schedules: {
      new: SCHEDULES.new.slice(),
      fuzzy: SCHEDULES.fuzzy.slice(),
      clear: SCHEDULES.clear.slice()
    }
  };
}());
