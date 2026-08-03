(function () {
  'use strict';

  var registry = window.EnglishRadarContent;
  var storage = window.EnglishRadarStorage;
  var review = window.EnglishRadarReview;
  if (!registry || typeof registry.getActiveLearningSignals !== 'function') return;

  var signals = registry.getActiveLearningSignals();
  var progress = storage && typeof storage.getProgress === 'function' ? storage.getProgress() : {};
  var now = new Date();

  function setText(selector, value) {
    var element = document.querySelector(selector);
    if (element) element.textContent = String(value);
  }

  function isLearned(signal) {
    return !!(progress[signal.id] && progress[signal.id].firstLearnedAt);
  }

  function isMastered(signal) {
    return isLearned(signal) && progress[signal.id].mastery === 'clear';
  }

  function isDue(signal) {
    return isLearned(signal) && review && typeof review.isDue === 'function' && review.isDue(progress[signal.id], now);
  }

  function getQuizSignalIds() {
    var ids = {};
    (Array.isArray(window.ENGLISH_RADAR_QUIZZES) ? window.ENGLISH_RADAR_QUIZZES : []).forEach(function (quiz) {
      if (quiz && quiz.signalId) ids[quiz.signalId] = true;
    });
    return ids;
  }

  function renderStats() {
    var quizSignalIds = getQuizSignalIds();
    var learned = signals.filter(isLearned);
    var mastered = signals.filter(isMastered);
    var unseen = signals.length - learned.length;
    var learning = learned.length - mastered.length;
    var due = signals.filter(isDue).length;
    var quizReady = signals.filter(function (signal) {
      return quizSignalIds[signal.id] || signal.quizStatus === 'ready';
    }).length;

    setText('[data-library-total]', signals.length);
    setText('[data-library-unseen]', unseen);
    setText('[data-library-learning]', learning);
    setText('[data-library-mastered]', mastered.length);
    setText('[data-library-due]', due);
    setText('[data-library-quiz-ready]', quizReady);

    var progressBar = document.querySelector('[data-library-progress-bar]');
    if (progressBar) {
      progressBar.style.width = (signals.length ? Math.min(100, mastered.length / signals.length * 100) : 0) + '%';
    }
  }

  function renderDailyMix() {
    var target = document.querySelector('[data-daily-mix-preview]');
    var engine = window.EnglishRadarLearningEngine;
    if (!target || !engine || typeof engine.getDailyMix !== 'function') return;

    var mix = engine.getDailyMix();
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

  renderStats();
  renderDailyMix();
}());
