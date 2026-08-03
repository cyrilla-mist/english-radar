(function () {
  'use strict';

  var keys = [
    ['englishRadar_customSignals', 'customSignals'],
    ['englishRadar_progress', 'progress'],
    ['englishRadar_quizHistory', 'quizHistory'],
    ['englishRadar_inbox', 'inbox'],
    ['englishRadar_syncHistory', 'syncHistory'],
    ['englishRadar_settings', 'settings'],
    ['englishRadar_currentSession', 'currentSession']
  ];
  var rows = document.querySelector('#rows');
  var parseTotal = 0;
  function bytes(value) { try { return new TextEncoder().encode(value).length; } catch (error) { return new Blob([value]).size; } }
  function count(value) { if (Array.isArray(value)) return String(value.length); if (value && typeof value === 'object') return String(Object.keys(value).length); return '0'; }
  function extra(label, value) {
    if (!value || typeof value !== 'object') return '';
    if (label === 'customSignals') return 'Signals ' + Object.keys(value.signals || {}).length + ' · Packs ' + (Array.isArray(value.packs) ? value.packs.length : 0);
    if (label === 'quizHistory') return 'Attempts ' + (Array.isArray(value.attempts) ? value.attempts.length : 0) + ' · byQuiz ' + Object.keys(value.byQuiz || {}).length;
    if (label === 'progress') return 'Records ' + Object.keys(value).length;
    return '';
  }
  function addCell(row, value) { var cell = document.createElement('td'); cell.textContent = String(value); row.appendChild(cell); }
  keys.forEach(function (item) {
    var raw = null; var exists = false; try { raw = window.localStorage.getItem(item[0]); exists = raw !== null; } catch (error) { raw = null; }
    var value = null; var elapsed = 0;
    if (exists) { var clock = window.performance && typeof window.performance.now === 'function' ? function () { return window.performance.now(); } : function () { return Date.now(); }; var started = clock(); try { value = JSON.parse(raw); } catch (error) { value = null; } elapsed = clock() - started; parseTotal += elapsed; }
    var row = document.createElement('tr'); addCell(row, item[0]); addCell(row, exists ? 'Yes' : 'No'); addCell(row, exists ? raw.length : 0); addCell(row, exists ? bytes(raw) : 0); addCell(row, exists ? elapsed.toFixed(3) : '—'); addCell(row, exists ? count(value) : '—'); addCell(row, extra(item[1], value)); rows.appendChild(row);
  });
  var summary = document.querySelector('#summary'); if (summary) summary.textContent = 'Total JSON.parse time: ' + parseTotal.toFixed(3) + ' ms';
  var debug = window.__englishRadarPerformance; var performanceCopy = document.querySelector('#performance');
  if (performanceCopy) performanceCopy.textContent = debug ? 'Page debug data is available in the console only when the page URL includes ?debug=performance.' : 'For page initialization timing, open a target page with ?debug=performance.';
}());
