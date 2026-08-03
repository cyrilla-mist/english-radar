(function () {
  'use strict';

  var search = window.location && window.location.search ? window.location.search : '';
  if (search.indexOf('debug=performance') === -1) return;

  var entries = [];
  var longTasks = [];
  var now = window.performance && typeof window.performance.now === 'function' ? function () { return window.performance.now(); } : function () { return Date.now(); };
  function measure(name, callback) {
    var started = now(); var result = callback(); var elapsed = now() - started;
    entries.push({ name: name, ms: Number(elapsed.toFixed(2)) });
    return result;
  }
  function record(name, ms, details) {
    entries.push(Object.assign({ name: name, ms: Number(Number(ms).toFixed(2)) }, details || {}));
  }
  function snapshot() {
    return { page: (window.location.pathname || '').split('/').pop() || 'index.html', entries: entries.slice(), longTasksOver100ms: longTasks.length, longTaskTotalMs: Number(longTasks.reduce(function (total, value) { return total + value; }, 0).toFixed(2)), domNodes: document.getElementsByTagName('*').length, scrollWidth: document.documentElement.scrollWidth, viewportWidth: window.innerWidth };
  }
  function publish() {
    var payload = snapshot();
    window.__englishRadarPerformance = payload;
    console.info('[English Radar performance]', payload);
  }
  function wrap(object, method, label) {
    if (!object || typeof object[method] !== 'function') return;
    var original = object[method];
    object[method] = function () { var started = performance.now(); var result = original.apply(this, arguments); record(label, performance.now() - started); return result; };
  }

  window.EnglishRadarPerformanceDebug = { enabled: true, measure: measure, record: record, snapshot: snapshot, publish: publish };
  if (window.PerformanceObserver) {
    try { var observer = new PerformanceObserver(function (list) { list.getEntries().forEach(function (entry) { if (entry.duration > 100) longTasks.push(entry.duration); }); }); observer.observe({ type: 'longtask', buffered: true }); } catch (error) { /* unsupported in this browser */ }
  }
  wrap(window.EnglishRadarStorage, 'getCustomSignals', 'storage.getCustomSignals');
  wrap(window.EnglishRadarStorage, 'getProgress', 'storage.getProgress');
  wrap(window.EnglishRadarStorage, 'getQuizHistory', 'storage.getQuizHistory');
  wrap(window.EnglishRadarStorage, 'getInbox', 'storage.getInbox');
  wrap(window.EnglishRadarStorage, 'getSyncHistory', 'storage.getSyncHistory');
  wrap(window.EnglishRadarStorage, 'getSettings', 'storage.getSettings');
  wrap(window.EnglishRadarStorage, 'getCurrentSession', 'storage.getCurrentSession');
  wrap(window.EnglishRadarContent, 'getImportedSignals', 'content.getImportedSignals');
  wrap(window.EnglishRadarContent, 'getActiveLearningSignals', 'content.getActiveLearningSignals');
  wrap(window.EnglishRadarContent, 'getDictionarySignals', 'content.getDictionarySignals');
  window.addEventListener('load', function () { setTimeout(publish, 250); });
}());
