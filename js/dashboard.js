(function () {
  'use strict';

  var registry = window.EnglishRadarContent;
  var storage = window.EnglishRadarStorage;
  var engine = window.EnglishRadarLearningEngine;
  if (!registry || !engine || typeof engine.getTodaySnapshot !== 'function') return;

  var snapshot = engine.getTodaySnapshot();
  var signals = snapshot.signals;
  var progress = snapshot.progress;
  var statistics = snapshot.statistics;

  function setText(selector, value) {
    var element = document.querySelector(selector);
    if (element) element.textContent = String(value);
  }

  function renderStats() {
    setText('[data-library-total]', signals.length);
    setText('[data-library-unseen]', statistics.unseen);
    setText('[data-library-learning]', statistics.learning);
    setText('[data-library-mastered]', statistics.mastered);
    setText('[data-library-due]', statistics.due);
    setText('[data-library-quiz-ready]', snapshot.quizReadyCount);

    var progressBar = document.querySelector('[data-library-progress-bar]');
    if (progressBar) {
      progressBar.style.width = (signals.length ? Math.min(100, mastered.length / signals.length * 100) : 0) + '%';
    }
  }

  function renderDailyMix() {
    var target = document.querySelector('[data-daily-mix-preview]');
    if (!target) return;
    var mix = snapshot.dailyMix;
    target.textContent = '';
    if (!mix.length) {
      var empty = document.createElement('span');
      empty.textContent = 'No signals available.';
      target.appendChild(empty);
      return;
    }

    mix.forEach(function (signal) {
      var item = document.createElement('span');
      item.textContent = signal.displayTerm || signal.term;
      target.appendChild(item);
    });
  }

  if (window.EnglishRadarPerformanceDebug) {
    window.EnglishRadarPerformanceDebug.measure('today.libraryStatusDomRender', renderStats);
    window.EnglishRadarPerformanceDebug.measure('today.dailyMixDomRender', renderDailyMix);
  } else { renderStats(); renderDailyMix(); }
}());
