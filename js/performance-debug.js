(function () {
  'use strict';

  var search = window.location && window.location.search ? window.location.search : '';
  if (search.indexOf('debug=performance') === -1) return;

  var startedAt = Date.now();
  var records = [];
  var calls = {};
  var signalCounts = { active: null, imported: null };
  var longTasks = [];
  var now = window.performance && typeof window.performance.now === 'function' ? function () { return window.performance.now(); } : function () { return Date.now(); };

  function cleanNumber(value) { return Number(Number(value).toFixed(2)); }
  function record(name, elapsed, details) {
    records.push(Object.assign({ name: name, ms: cleanNumber(elapsed) }, details || {}));
  }
  function measure(name, callback) {
    var started = now(); var result = callback(); record(name, now() - started); return result;
  }
  function increment(name) { calls[name] = (calls[name] || 0) + 1; return calls[name]; }
  function wrap(object, method, label, resultHandler) {
    if (!object || typeof object[method] !== 'function') return;
    var original = object[method];
    object[method] = function () {
      var callNumber = increment(label); var started = now(); var result = original.apply(this, arguments); var details = { call: callNumber };
      var elapsed = now() - started;
      if (resultHandler) resultHandler(result, details, elapsed);
      record(label, elapsed, details);
      return result;
    };
  }
  function sum(names) { return cleanNumber(records.filter(function (item) { return names.indexOf(item.name) !== -1; }).reduce(function (total, item) { return total + item.ms; }, 0)); }
  function first(name) { var item = records.find(function (entry) { return entry.name === name; }); return item ? item.ms : 0; }
  function latest(name) { var list = records.filter(function (entry) { return entry.name === name; }); return list.length ? list[list.length - 1].ms : 0; }
  function duplicateWarnings() { return ['storage.getCustomSignals', 'content.getImportedSignals', 'content.getActiveLearningSignals'].filter(function (name) { return (calls[name] || 0) > 1; }); }
  function snapshot() {
    var longest = records.reduce(function (max, item) { return Math.max(max, item.ms); }, 0);
    var navigation = window.__englishRadarNavigationPerformance && window.__englishRadarNavigationPerformance.snapshot ? window.__englishRadarNavigationPerformance.snapshot() : {};
    return {
      page: (window.location.pathname || '').split('/').pop() || 'index.html',
      totalInitializationMs: cleanNumber(Date.now() - startedAt),
      storageReadMs: sum(['storage.getCustomSignals', 'storage.getProgress', 'storage.getQuizHistory', 'storage.getInbox', 'storage.getSyncHistory', 'storage.getSettings', 'storage.getCurrentSession']),
      jsonParseMs: sum(['JSON.parse']),
      registryInitMs: first('contentRegistry.init'),
      importedNormalizeCopyMs: sum(['content.importedSignals.normalizeCopy']),
      activeSignalsBuildMs: first('content.activeSignals.build'),
      progressHistoryIndexingMs: sum(['storage.getProgress', 'storage.getQuizHistory', 'storage.getInbox', 'storage.getSyncHistory']),
      pagePreparationMs: sum(['today.dailyMix', 'today.dashboardStatistics', 'dictionary.index', 'dictionary.searchIndex', 'dictionary.categoryCounts', 'quiz.candidateSignals', 'quiz.distractorPools', 'quiz.generation', 'quiz.sessionSelection', 'me.masteryStatistics', 'me.categoryCoverage', 'me.packMetadata', 'me.recentActivity']),
      domRenderMs: sum(['today.render', 'today.dashboardDomRender', 'dictionary.initial50.render', 'quiz.DOM render', 'me.render']),
      initialDomNodes: document.getElementsByTagName('*').length,
      longestSynchronousTaskMs: cleanNumber(longest),
      longTasksOver100ms: longTasks.length,
      activeSignalsCount: signalCounts.active,
      importedSignalsCount: signalCounts.imported,
      callCounts: Object.assign({}, calls),
      duplicateCallWarnings: duplicateWarnings(),
      navigation: navigation.navigation || {},
      paint: navigation.paint || {},
      firstUsableContentMs: navigation.firstUsableContent,
      totalBlockingTimeMs: navigation.totalBlockingTime || 0,
      longTasksOver50ms: navigation.longTasksOver50ms || 0,
      longTasksOver100ms: navigation.longTasksOver100ms || 0,
      longestObservedTask: navigation.longestTask || { start: 0, duration: 0 },
      layoutShift: navigation.layoutShift || 0,
      interactions: navigation.interactions || [],
      resources: navigation.resources || [],
      stageRecords: records.slice()
    };
  }
  function reportRows(payload) {
    return [
      ['Page', payload.page], ['Total initialization', payload.totalInitializationMs + ' ms'], ['Storage read', payload.storageReadMs + ' ms'], ['JSON.parse', payload.jsonParseMs + ' ms'], ['Content Registry init', payload.registryInitMs + ' ms'], ['Imported Signals normalize/copy', payload.importedNormalizeCopyMs + ' ms'], ['Active Signals build', payload.activeSignalsBuildMs + ' ms'], ['Progress/history indexing', payload.progressHistoryIndexingMs + ' ms'], ['Page-specific data preparation', payload.pagePreparationMs + ' ms'], ['DOM render', payload.domRenderMs + ' ms'], ['Initial DOM node count', payload.initialDomNodes], ['DNS', (payload.navigation.dns || 0).toFixed(2) + ' ms'], ['Connection', (payload.navigation.connection || 0).toFixed(2) + ' ms'], ['Request / response', (payload.navigation.requestResponse || 0).toFixed(2) + ' ms'], ['DOM interactive', (payload.navigation.domInteractive || 0).toFixed(2) + ' ms'], ['DOMContentLoaded', (payload.navigation.domContentLoaded || 0).toFixed(2) + ' ms'], ['Window load', (payload.navigation.load || 0).toFixed(2) + ' ms'], ['First Paint', payload.paint.firstPaint === null ? '—' : payload.paint.firstPaint.toFixed(2) + ' ms'], ['First Contentful Paint', payload.paint.firstContentfulPaint === null ? '—' : payload.paint.firstContentfulPaint.toFixed(2) + ' ms'], ['Time to first usable content', payload.firstUsableContentMs === null ? '—' : Number(payload.firstUsableContentMs).toFixed(2) + ' ms'], ['Total Blocking Time', payload.totalBlockingTimeMs.toFixed(2) + ' ms'], ['Long Tasks >50ms', payload.longTasksOver50ms], ['Long Tasks >100ms', payload.longTasksOver100ms], ['Longest observed task', Number(payload.longestObservedTask.duration || 0).toFixed(2) + ' ms @ ' + Number(payload.longestObservedTask.start || 0).toFixed(2) + ' ms'], ['Layout Shift', payload.layoutShift], ['Interactions captured', payload.interactions.length], ['Active Signals count', payload.activeSignalsCount === null ? '—' : payload.activeSignalsCount], ['Imported Signals count', payload.importedSignalsCount === null ? '—' : payload.importedSignalsCount], ['Duplicate call warning', payload.duplicateCallWarnings.length ? payload.duplicateCallWarnings.join(', ') : 'None']];
  }
  function addCell(row, value) { var cell = document.createElement('td'); cell.textContent = String(value); row.appendChild(cell); }
  function ensurePanel() {
    var panel = document.querySelector('[data-performance-panel]');
    if (panel) return panel;
    panel = document.createElement('aside'); panel.setAttribute('data-performance-panel', 'true'); panel.setAttribute('aria-live', 'polite');
    panel.style.cssText = 'position:fixed;z-index:9999;left:12px;right:12px;bottom:12px;max-height:44vh;overflow:auto;padding:12px 14px;background:#18231f;color:#f3f5ed;border:1px solid rgba(255,255,255,.24);box-shadow:0 8px 30px rgba(0,0,0,.28);font:12px/1.45 system-ui,sans-serif;';
    document.body.appendChild(panel); return panel;
  }
  function render(payload) {
    var panel = ensurePanel(); panel.textContent = '';
    var heading = document.createElement('div'); heading.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px;';
    var title = document.createElement('strong'); title.textContent = 'Performance Report · ' + payload.page; heading.appendChild(title);
    var actions = document.createElement('span');
    [['Copy report', function () { var text = JSON.stringify(payload, null, 2); if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text); }], ['Refresh measurement', function () { render(snapshot()); }]].forEach(function (item) { var button = document.createElement('button'); button.type = 'button'; button.textContent = item[0]; button.style.cssText = 'margin-left:6px;padding:5px 8px;border:1px solid rgba(255,255,255,.28);background:#cedcc7;color:#18231f;cursor:pointer;font:11px system-ui,sans-serif;'; button.addEventListener('click', item[1]); actions.appendChild(button); }); heading.appendChild(actions); panel.appendChild(heading);
    var table = document.createElement('table'); table.style.cssText = 'width:100%;border-collapse:collapse;'; reportRows(payload).forEach(function (item) { var row = document.createElement('tr'); var label = document.createElement('th'); label.textContent = item[0]; label.style.cssText = 'padding:3px 8px 3px 0;text-align:left;color:#cedcc7;font-weight:600;'; row.appendChild(label); addCell(row, item[1]); row.lastChild.style.cssText = 'padding:3px 0;text-align:right;color:#f5f2e8;'; table.appendChild(row); }); panel.appendChild(table);
    var counts = document.createElement('p'); counts.textContent = 'Calls: ' + Object.keys(payload.callCounts).map(function (name) { return name + '=' + payload.callCounts[name]; }).join(' · '); counts.style.cssText = 'margin:8px 0 0;color:#9eb09b;word-break:break-word;'; panel.appendChild(counts);
    var interactions = document.createElement('p'); interactions.textContent = 'Interaction samples: ' + (payload.interactions.length ? payload.interactions.map(function (item) { return item.type + ' ' + item.duration + 'ms'; }).join(' · ') : 'None yet.'); interactions.style.cssText = 'margin:4px 0 0;color:#9eb09b;word-break:break-word;'; panel.appendChild(interactions);
    var resourceTitle = document.createElement('strong'); resourceTitle.textContent = 'Resources (' + payload.resources.length + ')'; resourceTitle.style.cssText = 'display:block;margin-top:8px;color:#cedcc7;'; panel.appendChild(resourceTitle);
    var resourceTable = document.createElement('table'); resourceTable.style.cssText = 'width:100%;border-collapse:collapse;'; payload.resources.forEach(function (item) { var row = document.createElement('tr'); addCell(row, item.file); addCell(row, item.transferSize + ' B'); addCell(row, item.decodedBodySize + ' B'); addCell(row, item.duration + ' ms'); row.querySelectorAll('td').forEach(function (cell) { cell.style.cssText = 'padding:2px 4px 2px 0;color:#f5f2e8;word-break:break-all;'; }); resourceTable.appendChild(row); }); panel.appendChild(resourceTable);
    var stageTitle = document.createElement('strong'); stageTitle.textContent = 'Stage details'; stageTitle.style.cssText = 'display:block;margin-top:8px;color:#cedcc7;'; panel.appendChild(stageTitle);
    var stageTable = document.createElement('table'); stageTable.style.cssText = 'width:100%;border-collapse:collapse;'; payload.stageRecords.forEach(function (item) { var row = document.createElement('tr'); addCell(row, item.name); addCell(row, item.ms + ' ms'); row.querySelectorAll('td').forEach(function (cell) { cell.style.cssText = 'padding:2px 4px 2px 0;color:#f5f2e8;word-break:break-word;'; }); stageTable.appendChild(row); }); panel.appendChild(stageTable);
  }
  function publish() { var payload = snapshot(); window.__englishRadarPerformance = payload; render(payload); console.info('[English Radar performance]', payload); }
  var publishScheduled = false;
  function schedulePublish() { if (publishScheduled) return; publishScheduled = true; var raf = window.requestAnimationFrame || function (callback) { callback(); }; raf(function () { raf(function () { publishScheduled = false; publish(); }); }); }

  window.EnglishRadarPerformanceDebug = { enabled: true, measure: measure, record: record, increment: increment, snapshot: snapshot, publish: publish };
  if (window.PerformanceObserver) {
    try { var observer = new PerformanceObserver(function (list) { list.getEntries().forEach(function (entry) { if (entry.duration > 100) longTasks.push(entry.duration); }); }); observer.observe({ type: 'longtask', buffered: true }); } catch (error) { /* unsupported */ }
  }
  wrap(window.EnglishRadarStorage, 'getCustomSignals', 'storage.getCustomSignals', function (result) { if (signalCounts.imported === null && result && result.signals && typeof result.signals === 'object') signalCounts.imported = Object.keys(result.signals).length; });
  wrap(window.EnglishRadarStorage, 'getProgress', 'storage.getProgress');
  wrap(window.EnglishRadarStorage, 'getQuizHistory', 'storage.getQuizHistory');
  wrap(window.EnglishRadarStorage, 'getInbox', 'storage.getInbox');
  wrap(window.EnglishRadarStorage, 'getSyncHistory', 'storage.getSyncHistory');
  wrap(window.EnglishRadarStorage, 'getSettings', 'storage.getSettings');
  wrap(window.EnglishRadarStorage, 'getCurrentSession', 'storage.getCurrentSession');
  wrap(window.EnglishRadarContent, 'getImportedSignals', 'content.getImportedSignals', function (result, details, elapsed) { signalCounts.imported = Array.isArray(result) ? result.length : null; details.count = signalCounts.imported; record('content.importedSignals.normalizeCopy', elapsed); });
  wrap(window.EnglishRadarContent, 'getActiveLearningSignals', 'content.getActiveLearningSignals', function (result, details, elapsed) { signalCounts.active = Array.isArray(result) ? result.length : null; details.count = signalCounts.active; if (details.call === 1) { record('contentRegistry.init', elapsed); record('content.activeSignals.build', elapsed); } });
  wrap(window.EnglishRadarContent, 'getDictionarySignals', 'content.getDictionarySignals', function (result, details) { details.count = Array.isArray(result) ? result.length : null; });
  wrap(window.EnglishRadarContent, 'getSignalSource', 'content.getSignalSource');
  window.addEventListener('load', schedulePublish);
  document.addEventListener('click', schedulePublish, true);
  document.addEventListener('input', schedulePublish, true);
  window.addEventListener('scroll', schedulePublish, { passive: true });
}());
