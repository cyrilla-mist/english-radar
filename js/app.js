(function () {
  'use strict';

  var options = document.querySelectorAll('.session-option');
  var startLink = document.querySelector('.primary-button[href*="learn.html"]');
  var customPanel = document.querySelector('.custom-session');
  var customInput = document.querySelector('#custom-size');
  var deepDiveLabel = document.querySelector('[data-deep-dive-label]');
  var signals = window.EnglishRadarContent ? window.EnglishRadarContent.getActiveLearningSignals() : (Array.isArray(window.ENGLISH_RADAR_SIGNALS) ? window.ENGLISH_RADAR_SIGNALS : []);
  var storage = window.EnglishRadarStorage;
  var review = window.EnglishRadarReview;
  var progress = storage ? storage.getProgress() : {};
  var available = signals.length;
  var today = new Date();

  function setText(selector, value) { var element = document.querySelector(selector); if (element) element.textContent = value; }
  function isLearned(signal) { return !!(progress[signal.id] && progress[signal.id].firstLearnedAt); }
  function recordDate(record) { return review && review.asDate(record && record.lastReviewedAt); }
  function formatHomeDate(date) {
    var value = date || new Date();
    var month = new Intl.DateTimeFormat(undefined, { month: 'short' }).format(value).toUpperCase();
    var day = new Intl.DateTimeFormat(undefined, { day: '2-digit' }).format(value);
    var weekday = new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(value).toUpperCase();
    return { short: month + ' ' + day, long: month + ' ' + day + ' · ' + weekday };
  }
  function updateDates() {
    var dates = formatHomeDate(today);
    document.querySelectorAll('[data-date-mobile]').forEach(function (element) { element.textContent = dates.short; });
    document.querySelectorAll('[data-date-label]').forEach(function (element) { element.textContent = dates.long; });
  }
  function updateStats() {
    var learned = signals.filter(isLearned);
    var due = signals.filter(function (signal) { var next = progress[signal.id] && review && review.asDate(progress[signal.id].nextReviewAt); return !!(next && next.getTime() <= today.getTime()); });
    var todayRecords = learned.filter(function (signal) { return review && review.sameLocalDay(recordDate(progress[signal.id]), today); });
    var clearToday = todayRecords.filter(function (signal) { return progress[signal.id].mastery === 'clear'; }).length;
    var fuzzyToday = todayRecords.filter(function (signal) { return progress[signal.id].mastery === 'fuzzy' || progress[signal.id].mastery === 'new'; }).length;
    setText('[data-stat="new-signals"]', String(Math.max(0, available - learned.length)));
    setText('[data-stat="reviews-waiting"]', String(due.length));
    setText('[data-stat="today-progress"]', String(todayRecords.length));
    setText('[data-stat="today-progress-ratio"]', String(todayRecords.length));
    setText('[data-stat="session-total"]', String(available));
    setText('[data-stat="today-clear"]', String(clearToday));
    setText('[data-stat="today-fuzzy"]', String(fuzzyToday));
    var progressBar = document.querySelector('[data-today-progress-bar]');
    if (progressBar) progressBar.style.width = (available ? Math.min(100, todayRecords.length / available * 100) : 0) + '%';
    var weakList = document.querySelector('[data-weak-list]');
    if (weakList) {
      weakList.textContent = '';
      var weak = learned.filter(function (signal) { return progress[signal.id].mastery === 'new' || progress[signal.id].mastery === 'fuzzy'; }).slice(0, 4);
      if (!weak.length) { var empty = document.createElement('span'); empty.textContent = 'No weak signals right now.'; weakList.appendChild(empty); }
      weak.forEach(function (signal) { var item = document.createElement('span'); item.textContent = signal.displayTerm || signal.term; weakList.appendChild(item); });
    }
    var quizStats = storage && storage.getQuizStats ? storage.getQuizStats() : { mistakes: 0 };
    setText('[data-quiz-mistakes]', quizStats.mistakes + ' ' + (quizStats.mistakes === 1 ? 'MISTAKE' : 'MISTAKES'));
    setText('[data-quiz-mistakes-label]', quizStats.mistakes ? 'Practice context mistakes.' : 'No mistakes waiting.');
    var mistakesLink = document.querySelector('[data-quiz-mistakes-link]');
    if (mistakesLink && !quizStats.mistakes) { mistakesLink.setAttribute('aria-disabled', 'true'); mistakesLink.classList.add('is-empty'); }
  }
  function updateRecovery() {
    var area = document.querySelector('[data-session-recovery]');
    var current = storage ? storage.getCurrentSession() : null;
    var valid = current && current.mode === 'learn' && Array.isArray(current.signalIds) && current.signalIds.some(function (id) { return signals.some(function (signal) { return signal.id === id; }); });
    if (!area) return;
    area.hidden = !valid;
    if (valid) {
      var index = Math.min(Math.max(Number(current.currentIndex) || 0, 0), current.signalIds.length - 1);
      setText('[data-recovery-progress]', 'Signal ' + (index + 1) + ' of ' + current.signalIds.length);
    }
  }
  function showHomeFeedback(message) { var target = document.querySelector('[data-home-feedback]'); if (target) target.textContent = message || ''; }

  var debug = window.EnglishRadarPerformanceDebug;
  if (debug) debug.measure('today.render', function () { updateDates(); updateStats(); updateRecovery(); }); else { updateDates(); updateStats(); updateRecovery(); }
  if (storage) {
    var settingsRaw = storage.read(storage.keys.settings, null);
    if (!settingsRaw || Number(settingsRaw.dataVersion) !== 1 || Number(settingsRaw.contentVersion) !== 1) storage.setSettings(storage.getSettings());
  }

  if (options.length && startLink) {
    if (deepDiveLabel) deepDiveLabel.textContent = 'All ' + available + ' signals';
    if (customInput) customInput.max = String(Math.max(1, available));
    function validCustomSize() {
      var value = Number.parseInt(customInput && customInput.value, 10);
      if (!Number.isFinite(value)) value = Math.min(7, Math.max(1, available));
      return available > 0 ? Math.min(Math.max(value, 1), available) : 1;
    }
    function syncLink() {
      var selected = document.querySelector('.session-option.is-selected');
      var size = selected ? selected.getAttribute('data-size') : '15';
      if (size === 'custom') size = String(validCustomSize());
      if (size !== 'all' && available > 0) size = String(Math.min(Number(size) || 5, available));
      startLink.href = './learn.html?size=' + encodeURIComponent(size);
    }
    var preferredSettings = storage && storage.getSettings ? storage.getSettings() : { defaultSessionSize: 15 };
    var preferredSize = preferredSettings.defaultSessionSize;
    if (Number.isInteger(Number(preferredSize)) && Number(preferredSize) > available) preferredSize = available;
    if (preferredSize === 'all' || Array.prototype.some.call(options, function (option) { return option.getAttribute('data-size') === String(preferredSize); })) {
      options.forEach(function (option) {
        var active = option.getAttribute('data-size') === String(preferredSize);
        option.classList.toggle('is-selected', active); option.setAttribute('aria-checked', active ? 'true' : 'false');
        if (customPanel) customPanel.hidden = !active || preferredSize !== 'custom';
      });
    }
    if (preferredSize !== 'all' && preferredSize !== 5 && preferredSize !== 15 && Number.isInteger(Number(preferredSize)) && Number(preferredSize) >= 1 && Number(preferredSize) <= available) {
      options.forEach(function (option) { option.classList.toggle('is-selected', option.getAttribute('data-size') === 'custom'); option.setAttribute('aria-checked', option.getAttribute('data-size') === 'custom' ? 'true' : 'false'); });
      if (customInput) customInput.value = String(preferredSize);
      if (customPanel) customPanel.hidden = false;
    }
    options.forEach(function (option) {
      option.addEventListener('click', function () {
        options.forEach(function (item) { item.classList.remove('is-selected'); item.setAttribute('aria-checked', 'false'); });
        option.classList.add('is-selected'); option.setAttribute('aria-checked', 'true');
        if (customPanel) customPanel.hidden = option.getAttribute('data-size') !== 'custom';
        syncLink();
      });
    });
    if (customInput) {
      customInput.addEventListener('input', function () { if (customInput.value !== '') customInput.value = validCustomSize(); syncLink(); });
      customInput.addEventListener('blur', function () { customInput.value = validCustomSize(); syncLink(); });
    }
    syncLink();
  }

  var newSession = document.querySelector('[data-new-session]');
  if (newSession) newSession.addEventListener('click', function () {
    if (storage) storage.remove(storage.keys.currentSession);
    updateRecovery();
    showHomeFeedback('Ready for a new session.');
  });
  var resetOpen = document.querySelector('[data-reset-open]');
  var resetConfirm = document.querySelector('[data-reset-confirm]');
  var resetCancel = document.querySelector('[data-reset-cancel]');
  var resetAction = document.querySelector('[data-reset-confirm-action]');
  if (resetOpen && resetConfirm) resetOpen.addEventListener('click', function () { resetConfirm.hidden = false; resetOpen.hidden = true; });
  if (resetCancel && resetConfirm && resetOpen) resetCancel.addEventListener('click', function () { resetConfirm.hidden = true; resetOpen.hidden = false; });
  if (resetAction && resetConfirm && resetOpen) resetAction.addEventListener('click', function () {
    var cleared = storage && storage.clearAll();
    if (!cleared) { showHomeFeedback('Progress could not be saved in this browser.'); return; }
    window.location.reload();
  });
}());
