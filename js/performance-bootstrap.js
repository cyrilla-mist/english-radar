(function () {
  'use strict';

  var search = window.location && window.location.search ? window.location.search : '';
  if (search.indexOf('debug=performance') === -1) return;

  var performanceObject = window.performance;
  var now = performanceObject && typeof performanceObject.now === 'function' ? function () { return performanceObject.now(); } : function () { return Date.now(); };
  var navigationStart = performanceObject && typeof performanceObject.timeOrigin === 'number' ? performanceObject.timeOrigin : Date.now();
  var state = { navigationStart: navigationStart, longTasks: [], layoutShifts: [], interactions: [], firstUsableContent: null };
  function epochNow() { return performanceObject && typeof performanceObject.timeOrigin === 'number' ? performanceObject.timeOrigin + now() : Date.now(); }
  function recordInteraction(type, started) { var elapsed = now() - started; state.interactions.push({ type: type, duration: Number(elapsed.toFixed(2)) }); }
  function observe(type, callback) {
    if (!window.PerformanceObserver) return;
    try { var observer = new PerformanceObserver(callback); observer.observe({ type: type, buffered: true }); } catch (error) { /* unsupported */ }
  }
  observe('longtask', function (list) { list.getEntries().forEach(function (entry) { state.longTasks.push({ start: entry.startTime, duration: entry.duration }); }); });
  observe('layout-shift', function (list) { list.getEntries().forEach(function (entry) { if (!entry.hadRecentInput) state.layoutShifts.push(Number(entry.value || 0)); }); });
  observe('event', function (list) { list.getEntries().forEach(function (entry) { if (entry.name === 'click' || entry.name === 'input' || entry.name === 'scroll') state.interactions.push({ type: entry.name, duration: Number(entry.duration.toFixed(2)), processing: Number(Math.max(0, entry.processingStart - entry.startTime).toFixed(2)) }); }); });
  function fallbackInteraction(type) { var started = now(); var schedule = window.requestAnimationFrame || function (callback) { setTimeout(callback, 0); }; schedule(function () { recordInteraction(type, started); }); }
  document.addEventListener('click', function () { fallbackInteraction('click'); }, true);
  document.addEventListener('input', function () { fallbackInteraction('input'); }, true);
  window.addEventListener('scroll', function () { fallbackInteraction('scroll'); }, { passive: true });
  document.addEventListener('DOMContentLoaded', function () { if (document.querySelector('main')) state.firstUsableContent = epochNow() - navigationStart; });
  window.__englishRadarNavigationPerformance = {
    navigationStart: navigationStart,
    state: state,
    now: epochNow,
    snapshot: function () {
      var navigation = performanceObject && performanceObject.getEntriesByType ? performanceObject.getEntriesByType('navigation')[0] : null;
      var paint = performanceObject && performanceObject.getEntriesByType ? performanceObject.getEntriesByType('paint') : [];
      var resources = performanceObject && performanceObject.getEntriesByType ? performanceObject.getEntriesByType('resource').map(function (entry) { var pathname = ''; try { pathname = new URL(entry.name).pathname; } catch (error) { pathname = entry.name; } return { file: pathname.split('/').pop() || pathname, transferSize: entry.transferSize || 0, decodedBodySize: entry.decodedBodySize || 0, duration: Number(entry.duration.toFixed(2)) }; }) : [];
      var longTasks = state.longTasks.slice(); var blocking = longTasks.reduce(function (total, entry) { return total + Math.max(0, entry.duration - 50); }, 0); var longest = longTasks.reduce(function (max, entry) { return entry.duration > max.duration ? entry : max; }, { start: 0, duration: 0 });
      return { navigation: navigation ? { dns: navigation.domainLookupEnd - navigation.domainLookupStart, connection: navigation.connectEnd - navigation.connectStart, requestResponse: navigation.responseEnd - navigation.requestStart, domInteractive: navigation.domInteractive, domContentLoaded: navigation.domContentLoadedEventEnd, load: navigation.loadEventEnd, transferSize: navigation.transferSize || 0 } : {}, paint: { firstPaint: paint.find(function (entry) { return entry.name === 'first-paint'; })?.startTime || null, firstContentfulPaint: paint.find(function (entry) { return entry.name === 'first-contentful-paint'; })?.startTime || null }, totalBlockingTime: Number(blocking.toFixed(2)), longestTask: { start: Number(longest.start.toFixed(2)), duration: Number(longest.duration.toFixed(2)) }, longTasksOver50ms: longTasks.filter(function (entry) { return entry.duration > 50; }).length, longTasksOver100ms: longTasks.filter(function (entry) { return entry.duration > 100; }).length, layoutShift: Number(state.layoutShifts.reduce(function (total, value) { return total + value; }, 0).toFixed(4)), interactions: state.interactions.slice(), firstUsableContent: state.firstUsableContent, resources: resources };
    }
  };
}());
