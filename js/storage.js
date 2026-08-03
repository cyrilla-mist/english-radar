(function () {
  'use strict';

  var KEYS = {
    progress: 'englishRadar_progress',
    currentSession: 'englishRadar_currentSession',
    settings: 'englishRadar_settings',
    inbox: 'englishRadar_inbox',
    quizHistory: 'englishRadar_quizHistory',
    customSignals: 'englishRadar_customSignals',
    syncSettings: 'englishRadar_syncSettings',
    syncHistory: 'englishRadar_syncHistory'
  };
  var lastError = false;

  function getLocalStorage() {
    try { return window.localStorage; } catch (error) { lastError = true; return null; }
  }

  function read(key, fallback) {
    var store = getLocalStorage();
    if (!store) return fallback;
    try {
      var raw = store.getItem(key);
      if (!raw) return fallback;
      var value = JSON.parse(raw);
      return value === null || value === undefined ? fallback : value;
    } catch (error) {
      lastError = true;
      return fallback;
    }
  }

  function write(key, value) {
    var store = getLocalStorage();
    if (!store) return false;
    try {
      store.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      lastError = true;
      return false;
    }
  }

  function remove(key) {
    var store = getLocalStorage();
    if (!store) return false;
    try { store.removeItem(key); return true; } catch (error) { lastError = true; return false; }
  }

  function validObject(value) { return value && typeof value === 'object' && !Array.isArray(value); }
  function getProgress() { var value = read(KEYS.progress, {}); return validObject(value) ? value : {}; }
  function setProgress(value) { return write(KEYS.progress, validObject(value) ? value : {}); }
  function getCurrentSession() { var value = read(KEYS.currentSession, null); return validObject(value) ? value : null; }
  function setCurrentSession(value) { return value ? write(KEYS.currentSession, value) : remove(KEYS.currentSession); }
  function getSettings() {
    var value = read(KEYS.settings, {});
    if (!validObject(value) || Number(value.dataVersion) !== 1) return { dataVersion: 1, contentVersion: 1, defaultSessionSize: 15, speechRate: 1 };
    var settings = Object.assign({ dataVersion: 1, contentVersion: 1, defaultSessionSize: 15, speechRate: 1 }, value);
    if (!([5, 15, 'all'].indexOf(settings.defaultSessionSize) !== -1 || (Number.isInteger(Number(settings.defaultSessionSize)) && Number(settings.defaultSessionSize) >= 1 && Number(settings.defaultSessionSize) <= 15))) settings.defaultSessionSize = 15;
    if ([0.75, 1, 1.25].indexOf(Number(settings.speechRate)) === -1) settings.speechRate = 1;
    return settings;
  }
  function setSettings(value) { return write(KEYS.settings, validObject(value) ? value : { dataVersion: 1 }); }
  function getInbox() { var value = read(KEYS.inbox, []); return Array.isArray(value) ? value : []; }
  function saveInbox(value) { var saved = write(KEYS.inbox, Array.isArray(value) ? value : []); if (saved && window.EnglishRadarContent && window.EnglishRadarContent.invalidate) window.EnglishRadarContent.invalidate(); return saved; }
  function addInboxItem(item) { var items = getInbox(); items.push(item); return saveInbox(items); }
  function updateInboxItem(id, updates) {
    var items = getInbox(); var found = false;
    var next = items.map(function (item) { if (!item || item.id !== id) return item; found = true; return Object.assign({}, item, updates || {}); });
    return found ? saveInbox(next) : false;
  }
  function deleteInboxItem(id) { return saveInbox(getInbox().filter(function (item) { return item && item.id !== id; })); }
  function defaultCustomSignals() { return { version: 1, packs: [], signals: {} }; }
  function normalizeCustomSignals(value) {
    if (!validObject(value)) return defaultCustomSignals();
    var result = Object.assign({}, value, { version: 1, packs: Array.isArray(value.packs) ? value.packs : [], signals: validObject(value.signals) ? value.signals : {} });
    return result;
  }
  function getCustomSignals() { return normalizeCustomSignals(read(KEYS.customSignals, null)); }
  function saveCustomSignals(value) { var saved = write(KEYS.customSignals, normalizeCustomSignals(value)); if (saved && window.EnglishRadarContent && window.EnglishRadarContent.invalidate) window.EnglishRadarContent.invalidate(); return saved; }
  function defaultSyncSettings() { return { version: 1, enabled: false, workerBaseUrl: '', adminToken: '', lastSyncAt: null, lastSuccessfulBatchId: null }; }
  function normalizeSyncSettings(value) { if (!validObject(value)) return defaultSyncSettings(); return Object.assign(defaultSyncSettings(), value, { version: 1, enabled: value.enabled === true, workerBaseUrl: typeof value.workerBaseUrl === 'string' ? value.workerBaseUrl.trim().replace(/\/$/, '') : '', adminToken: typeof value.adminToken === 'string' ? value.adminToken : '', lastSyncAt: value.lastSyncAt || null, lastSuccessfulBatchId: value.lastSuccessfulBatchId || null }); }
  function getSyncSettings() { return normalizeSyncSettings(read(KEYS.syncSettings, null)); }
  function getSafeSyncSettings() { var settings = getSyncSettings(); return { version: 1, enabled: settings.enabled, workerBaseUrl: settings.workerBaseUrl, lastSyncAt: settings.lastSyncAt, lastSuccessfulBatchId: settings.lastSuccessfulBatchId }; }
  function saveSyncSettings(value) { return write(KEYS.syncSettings, normalizeSyncSettings(value)); }
  function defaultSyncHistory() { return { version: 1, batches: [] }; }
  function normalizeSyncHistory(value) { if (!validObject(value)) return defaultSyncHistory(); return { version: 1, batches: Array.isArray(value.batches) ? value.batches.filter(function (batch) { return validObject(batch) && batch.batchId; }).slice(-30) : [] }; }
  function getSyncHistory() { return normalizeSyncHistory(read(KEYS.syncHistory, null)); }
  function saveSyncHistory(value) { return write(KEYS.syncHistory, normalizeSyncHistory(value)); }
  function addSyncHistory(batch) { var history = getSyncHistory(); history.batches.push(batch); history.batches = history.batches.slice(-30); return saveSyncHistory(history); }
  function defaultQuizHistory() { return { version: 1, byQuiz: {}, attempts: [] }; }
  function normalizeQuizHistory(value) {
    if (!validObject(value)) return defaultQuizHistory();
    var history = defaultQuizHistory(); history.version = 1;
    history.byQuiz = validObject(value.byQuiz) ? value.byQuiz : {};
    history.attempts = Array.isArray(value.attempts) ? value.attempts.filter(function (attempt) { return validObject(attempt); }).slice(-300) : [];
    return history;
  }
  function getQuizHistory() { return normalizeQuizHistory(read(KEYS.quizHistory, null)); }
  function saveQuizHistory(history) { return write(KEYS.quizHistory, normalizeQuizHistory(history)); }
  function recordQuizAttempt(attempt) {
    if (!validObject(attempt) || !attempt.quizId || !attempt.signalId) return false;
    var history = getQuizHistory(); var previous = validObject(history.byQuiz[attempt.quizId]) ? history.byQuiz[attempt.quizId] : { quizId: attempt.quizId, signalId: attempt.signalId, attempts: 0, correctCount: 0, wrongCount: 0 };
    var entry = Object.assign({}, attempt); history.attempts.push(entry); history.attempts = history.attempts.slice(-300);
    var attempts = Number(previous.attempts); var correctCount = Number(previous.correctCount); var wrongCount = Number(previous.wrongCount); if (!Number.isFinite(attempts) || attempts < 0) attempts = 0; if (!Number.isFinite(correctCount) || correctCount < 0) correctCount = 0; if (!Number.isFinite(wrongCount) || wrongCount < 0) wrongCount = 0;
    history.byQuiz[attempt.quizId] = Object.assign({}, previous, { quizId: attempt.quizId, signalId: attempt.signalId, attempts: attempts + 1, correctCount: correctCount + (attempt.correct ? 1 : 0), wrongCount: wrongCount + (attempt.correct ? 0 : 1), lastAnsweredAt: attempt.answeredAt, lastSelectedOptionId: attempt.selectedOptionId, lastAnswerCorrect: !!attempt.correct });
    return saveQuizHistory(history);
  }
  function getQuizMistakeIds() { return Object.keys(getQuizHistory().byQuiz).filter(function (id) { return getQuizHistory().byQuiz[id] && getQuizHistory().byQuiz[id].lastAnswerCorrect === false; }); }
  function getQuizStats() {
    var history = getQuizHistory(); var correct = history.attempts.filter(function (attempt) { return attempt.correct === true; }).length; var incorrect = history.attempts.filter(function (attempt) { return attempt.correct === false; }).length;
    return { attempts: history.attempts.length, correct: correct, incorrect: incorrect, total: correct + incorrect, mistakes: getQuizMistakeIds().length };
  }
  function resetQuizHistory() { return remove(KEYS.quizHistory); }
  function clearAll() { var progress = remove(KEYS.progress); var current = remove(KEYS.currentSession); var settings = remove(KEYS.settings); var inbox = remove(KEYS.inbox); var quizHistory = resetQuizHistory(); var customSignals = remove(KEYS.customSignals); var syncSettings = remove(KEYS.syncSettings); var syncHistory = remove(KEYS.syncHistory); var cleared = progress && current && settings && inbox && quizHistory && customSignals && syncSettings && syncHistory; if (cleared && window.EnglishRadarContent && window.EnglishRadarContent.invalidate) window.EnglishRadarContent.invalidate(); return cleared; }

  window.EnglishRadarStorage = {
    keys: KEYS,
    read: read,
    write: write,
    remove: remove,
    getProgress: getProgress,
    setProgress: setProgress,
    getCurrentSession: getCurrentSession,
    setCurrentSession: setCurrentSession,
    getSettings: getSettings,
    setSettings: setSettings,
    getInbox: getInbox,
    saveInbox: saveInbox,
    addInboxItem: addInboxItem,
    updateInboxItem: updateInboxItem,
    deleteInboxItem: deleteInboxItem,
    getCustomSignals: getCustomSignals,
    saveCustomSignals: saveCustomSignals,
    getSyncSettings: getSyncSettings,
    getSafeSyncSettings: getSafeSyncSettings,
    saveSyncSettings: saveSyncSettings,
    getSyncHistory: getSyncHistory,
    saveSyncHistory: saveSyncHistory,
    addSyncHistory: addSyncHistory,
    getQuizHistory: getQuizHistory,
    saveQuizHistory: saveQuizHistory,
    recordQuizAttempt: recordQuizAttempt,
    getQuizMistakeIds: getQuizMistakeIds,
    getQuizStats: getQuizStats,
    resetQuizHistory: resetQuizHistory,
    clearAll: clearAll,
    get lastError() { return lastError; },
    clearError: function () { lastError = false; }
  };
}());
