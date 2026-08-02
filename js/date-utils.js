(function () {
  'use strict';

  function asDate(value) {
    var date = value instanceof Date ? new Date(value.getTime()) : new Date(value === undefined ? Date.now() : value);
    return isNaN(date.getTime()) ? null : date;
  }

  function pad(value) { return String(value).padStart(2, '0'); }

  function localDateKey(value) {
    var date = asDate(value);
    return date ? date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) : '';
  }

  function shortLocalDate(value) {
    var date = asDate(value);
    return date ? new Intl.DateTimeFormat(undefined, { month: 'short', day: '2-digit' }).format(date) : '—';
  }

  window.EnglishRadarDate = {
    asDate: asDate,
    localDateKey: localDateKey,
    shortLocalDate: shortLocalDate
  };
}());
