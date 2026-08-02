(function () {
  'use strict';

  var FIRST_DELAYS = { new: 1, fuzzy: 2, clear: 7 };
  var REPEAT_DELAYS = { new: 1, fuzzy: 3, clear: 14 };
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

  function getNextReviewAt(mastery, reviewCount, fromDate) {
    var date = asDate(fromDate) || new Date();
    var delays = Number(reviewCount) > 0 ? REPEAT_DELAYS : FIRST_DELAYS;
    return addDays(date, delays[mastery] || FIRST_DELAYS.new).toISOString();
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
    getNextReviewAt: getNextReviewAt,
    isDue: isDue,
    getReviewQueue: getReviewQueue,
    sameLocalDay: sameLocalDay,
    formatLocalDate: formatLocalDate
  };
}());
