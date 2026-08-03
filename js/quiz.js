(function () {
  'use strict';

  var signals = window.EnglishRadarContent ? window.EnglishRadarContent.getActiveLearningSignals() : (Array.isArray(window.ENGLISH_RADAR_SIGNALS) ? window.ENGLISH_RADAR_SIGNALS : []);
  var rawQuizzes = Array.isArray(window.ENGLISH_RADAR_QUIZZES) ? window.ENGLISH_RADAR_QUIZZES : [];
  var storage = window.EnglishRadarStorage;
  var params = new URLSearchParams(window.location.search);
  var mode = params.get('mode') || 'quick';
  var signalMap = {};
  signals.forEach(function (signal) { signalMap[signal.id] = signal; });
  var questions = [];
  var questionIndex = 0;
  var selectedId = null;
  var checked = false;
  var correctCount = 0;
  var incorrectQuestions = [];
  var storageFailure = false;

  var refs = {
    panel: document.querySelector('[data-quiz-panel]'), empty: document.querySelector('[data-quiz-empty]'), summary: document.querySelector('[data-quiz-summary]'), progress: document.querySelector('[data-quiz-progress]'), correct: document.querySelector('[data-quiz-correct]'), progressBar: document.querySelector('[data-quiz-progress-bar]'), context: document.querySelector('[data-quiz-context]'), difficulty: document.querySelector('[data-quiz-difficulty]'), questionType: document.querySelector('[data-quiz-type]'), question: document.querySelector('[data-quiz-question]'), options: document.querySelector('[data-quiz-options]'), check: document.querySelector('[data-quiz-check]'), feedback: document.querySelector('[data-quiz-feedback]'), explanation: document.querySelector('[data-quiz-explanation]'), explanationEn: document.querySelector('[data-quiz-explanation-en]'), explanationZh: document.querySelector('[data-quiz-explanation-zh]'), correctAnswer: document.querySelector('[data-quiz-correct-answer]'), reviewSignal: document.querySelector('[data-review-signal]')
  };

  function text(value) { return String(value === undefined || value === null ? '' : value).trim(); }
  function stableSort(items) { return items.slice().sort(function (a, b) { return text(a.id).localeCompare(text(b.id)); }); }
  function inferType(question) {
    var value = text(question.questionType || question.type).toLowerCase();
    if (value === 'meaning' || value.indexOf('meaning') !== -1) return 'meaning';
    if (value === 'boundary' || value.indexOf('boundary') !== -1 || value.indexOf('avoid') !== -1) return 'boundary';
    return 'context';
  }
  function normalizeQuestion(question) {
    if (!question || !question.id || !signalMap[question.signalId]) return null;
    var questionType = inferType(question);
    var difficulty = text(question.difficulty).toLowerCase();
    if (['easy', 'medium', 'hard'].indexOf(difficulty) === -1) difficulty = questionType === 'meaning' ? 'easy' : questionType === 'boundary' ? 'hard' : 'medium';
    var explanationEn = text(question.explanationEn || question.explanation);
    var explanationZh = text(question.explanationZh || question.explanation);
    if (!Array.isArray(question.options) || question.options.length !== 4 || !question.correctOptionId || !explanationEn) return null;
    if (!question.options.every(function (option, index, list) { return option && option.id && text(option.text) && list.findIndex(function (item) { return item && item.id === option.id; }) === index; })) return null;
    if (!question.options.some(function (option) { return option.id === question.correctOptionId; })) return null;
    return Object.assign({}, question, { questionType: questionType, difficulty: difficulty, prompt: text(question.prompt || question.question), question: text(question.question || question.prompt), explanation: explanationEn, explanationEn: explanationEn, explanationZh: explanationZh || explanationEn });
  }
  function baseQuestions() { return rawQuizzes.map(normalizeQuestion).filter(Boolean); }
  function historyPriority(question) {
    var history = storage ? storage.getQuizHistory() : { byQuiz: {} };
    var entry = history.byQuiz && history.byQuiz[question.id];
    if (!entry) return 0;
    return entry.lastAnswerCorrect === false ? 1 : 2;
  }
  function ordered(items) { return stableSort(items).sort(function (a, b) { return historyPriority(a) - historyPriority(b) || text(a.id).localeCompare(text(b.id)); }); }
  function signalIdsFromParam() { return (params.get('signals') || '').split(',').map(function (id) { return id.trim(); }).filter(function (id, index, ids) { return signalMap[id] && ids.indexOf(id) === index; }); }
  function pickUnique(items, count, picked) {
    var selected = picked || [];
    ordered(items).some(function (question) {
      if (selected.length >= count) return true;
      if (!selected.some(function (item) { return item.signalId === question.signalId; })) selected.push(question);
      return false;
    });
    return selected;
  }
  function chooseBalanced(candidates, count, targetCounts) {
    var selected = [];
    ['easy', 'medium', 'hard'].forEach(function (difficulty) {
      var target = targetCounts[difficulty] || 0;
      pickUnique(ordered(candidates.filter(function (question) { return question.difficulty === difficulty; })), selected.length + target, selected);
    });
    pickUnique(ordered(candidates), count, selected);
    return selected.slice(0, count);
  }
  function getMistakeQuestions(all) {
    var history = storage ? storage.getQuizHistory() : { byQuiz: {} }; var byQuiz = history.byQuiz || {}; var mistakes = all.filter(function (question) { return byQuiz[question.id] && byQuiz[question.id].lastAnswerCorrect === false; }).sort(function (a, b) { return new Date(byQuiz[b.id].lastAnsweredAt || 0).getTime() - new Date(byQuiz[a.id].lastAnsweredAt || 0).getTime(); });
    return pickUnique(mistakes, mistakes.length, []).slice(0, mistakes.length);
  }
  function getQuestions() {
    var all = baseQuestions();
    if (mode === 'mistakes') return getMistakeQuestions(all);
    if (mode === 'signal') { var signalId = params.get('signal'); return ordered(all.filter(function (question) { return question.signalId === signalId; })).slice(0, 3); }
    if (mode === 'session') { var ids = signalIdsFromParam(); return pickUnique(all.filter(function (question) { return ids.indexOf(question.signalId) !== -1; }), all.length, []).slice(0, ids.length); }
    var count = mode === 'standard' ? 10 : 5;
    return chooseBalanced(all, Math.min(count, all.length), mode === 'standard' ? { easy: 3, medium: 4, hard: 3 } : { easy: 2, medium: 2, hard: 1 });
  }
  function setText(element, value) { if (element) element.textContent = value === undefined || value === null ? '' : String(value); }
  function typeLabel(type) { return type === 'meaning' ? 'MEANING' : type === 'boundary' ? 'USAGE BOUNDARY' : 'CONTEXT'; }
  function showEmpty(title, message) { if (refs.panel) refs.panel.hidden = true; if (refs.summary) refs.summary.hidden = true; if (refs.empty) refs.empty.hidden = false; setText(document.querySelector('[data-quiz-empty-title]'), title); setText(document.querySelector('[data-quiz-empty-message]'), message); var quick = document.querySelector('[data-empty-quick]'); if (quick) quick.hidden = mode !== 'mistakes'; }
  function setModeNavigation() { document.querySelectorAll('.side-nav .nav-item, .mobile-nav a').forEach(function (link) { link.classList.remove('is-active'); }); }
  function updateStatus() { var total = questions.length; setText(refs.progress, 'Question ' + String(questionIndex + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0')); setText(refs.correct, correctCount); if (refs.progressBar) refs.progressBar.style.width = (total ? (questionIndex + 1) / total * 100 : 0) + '%'; }
  function renderOptions(question) {
    refs.options.textContent = '';
    question.options.forEach(function (option, index) {
      var button = document.createElement('button'); button.type = 'button'; button.className = 'quiz-option'; button.dataset.optionId = option.id; button.setAttribute('role', 'radio'); button.setAttribute('aria-checked', 'false');
      var number = document.createElement('span'); number.className = 'quiz-option-number'; number.textContent = String(index + 1).padStart(2, '0'); var copy = document.createElement('span'); copy.className = 'quiz-option-copy'; copy.textContent = option.text; button.appendChild(number); button.appendChild(copy); button.addEventListener('click', function () { selectOption(option.id); }); refs.options.appendChild(button);
    });
  }
  function selectOption(id) { if (checked) return; selectedId = id; document.querySelectorAll('.quiz-option').forEach(function (button) { var active = button.dataset.optionId === id; button.classList.toggle('is-selected', active); button.setAttribute('aria-checked', active ? 'true' : 'false'); }); if (refs.check) refs.check.disabled = false; }
  function updateSignalProgress(question, correct) {
    if (!storage) { storageFailure = true; return; }
    var now = new Date(); var progress = storage.getProgress(); var existing = progress[question.signalId] && typeof progress[question.signalId] === 'object' ? progress[question.signalId] : { signalId: question.signalId, mastery: null, firstLearnedAt: null, lastReviewedAt: null, nextReviewAt: null, reviewCount: 0, errorCount: 0, favorite: false };
    var next = Object.assign({}, existing, { signalId: question.signalId, lastQuizAt: now.toISOString(), lastQuizCorrect: correct });
    if (!correct) { var soon = new Date(now.getTime() + 86400000); var current = new Date(existing.nextReviewAt || 0); if (isNaN(current.getTime()) || current.getTime() > soon.getTime()) next.nextReviewAt = soon.toISOString(); next.errorCount = Math.max(0, Number(existing.errorCount) || 0) + 1; }
    progress[question.signalId] = next; if (!storage.setProgress(progress)) storageFailure = true;
  }
  function recordAnswer(question) {
    if (!storage) { storageFailure = true; return; }
    var attempt = { id: 'attempt-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6), quizId: question.id, signalId: question.signalId, selectedOptionId: selectedId, correct: selectedId === question.correctOptionId, answeredAt: new Date().toISOString() };
    if (!storage.recordQuizAttempt(attempt)) storageFailure = true;
    updateSignalProgress(question, attempt.correct);
  }
  function checkAnswer() {
    if (checked || !selectedId || !questions[questionIndex]) return; checked = true; var question = questions[questionIndex]; var correct = selectedId === question.correctOptionId; if (correct) correctCount += 1; else incorrectQuestions.push(question); recordAnswer(question);
    document.querySelectorAll('.quiz-option').forEach(function (button) { var id = button.dataset.optionId; button.disabled = true; if (id === question.correctOptionId) button.classList.add('is-correct'); if (id === selectedId && !correct) button.classList.add('is-wrong'); });
    setText(refs.feedback, storageFailure ? 'Quiz progress could not be saved in this browser.' : correct ? 'Correct.' : 'Needs another pass.'); refs.feedback.classList.toggle('is-error', !correct); setText(refs.correctAnswer, 'Correct answer: ' + question.options.find(function (option) { return option.id === question.correctOptionId; }).text); setText(refs.explanationEn, question.explanationEn); setText(refs.explanationZh, question.explanationZh); refs.explanation.hidden = false; refs.reviewSignal.href = './learn.html?mode=lookup&signal=' + encodeURIComponent(question.signalId); refs.check.textContent = questionIndex === questions.length - 1 ? 'View summary' : 'Next question'; refs.check.disabled = false; updateStatus();
  }
  function nextQuestion() { if (!checked) { checkAnswer(); return; } if (questionIndex >= questions.length - 1) { showSummary(); return; } questionIndex += 1; selectedId = null; checked = false; renderQuestion(); window.scrollTo({ top: 0, behavior: window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }
  function renderQuestion() { var question = questions[questionIndex]; if (!question) { showEmpty('No quiz questions available.', ''); return; } checked = false; selectedId = null; refs.panel.hidden = false; refs.empty.hidden = true; refs.summary.hidden = true; setText(refs.context, '"' + text(question.context) + '"'); setText(refs.difficulty, question.difficulty.toUpperCase()); setText(refs.questionType, typeLabel(question.questionType)); setText(refs.question, question.prompt); refs.explanation.hidden = true; refs.check.textContent = 'Check answer ->'; refs.check.disabled = true; setText(refs.feedback, ''); renderOptions(question); updateStatus(); }
  function showSummary() { refs.panel.hidden = true; refs.empty.hidden = true; refs.summary.hidden = false; document.title = 'Context Check Complete - English Radar'; var total = questions.length; var incorrect = total - correctCount; setText(document.querySelector('[data-summary-total]'), total + ' questions checked'); setText(document.querySelector('[data-summary-correct]'), correctCount + ' correct'); setText(document.querySelector('[data-summary-incorrect]'), incorrect + ' incorrect'); setText(document.querySelector('[data-summary-accuracy]'), (total ? Math.round(correctCount / total * 100) : 0) + '% accuracy'); var list = document.querySelector('[data-quiz-revisit-list]'); list.textContent = ''; var seen = {}; incorrectQuestions.slice(0, 20).forEach(function (question) { if (seen[question.signalId] || Object.keys(seen).length >= 6) return; seen[question.signalId] = true; var link = document.createElement('a'); link.href = './learn.html?mode=lookup&signal=' + encodeURIComponent(question.signalId); link.textContent = signalMap[question.signalId].displayTerm || signalMap[question.signalId].term; list.appendChild(link); }); var retry = document.querySelector('[data-retry-mistakes]'); if (retry) retry.hidden = !incorrectQuestions.length; window.scrollTo({ top: 0, behavior: 'auto' }); }
  function retryMistakes() { if (!incorrectQuestions.length) return; questions = incorrectQuestions.slice(); questionIndex = 0; correctCount = 0; incorrectQuestions = []; document.title = 'Context Check - English Radar'; renderQuestion(); }

  window.EnglishRadarQuizEngine = { normalizeQuestion: normalizeQuestion, baseQuestions: baseQuestions, chooseBalanced: chooseBalanced, getQuestions: getQuestions };

  refs.check.addEventListener('click', nextQuestion);
  document.addEventListener('keydown', function (event) { if (event.target && /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return; if (/^[1-4]$/.test(event.key) && !checked) { var button = refs.options.querySelectorAll('.quiz-option')[Number(event.key) - 1]; if (button) selectOption(button.dataset.optionId); } else if (event.key === 'Enter') { event.preventDefault(); nextQuestion(); } });
  var retry = document.querySelector('[data-retry-mistakes]'); if (retry) retry.addEventListener('click', retryMistakes);
  setModeNavigation(); questions = getQuestions();
  if (!rawQuizzes.length || !questions.length) showEmpty(mode === 'mistakes' ? 'No context mistakes waiting.' : mode === 'signal' ? 'No context questions for this signal yet.' : 'No quiz questions available.', mode === 'mistakes' ? 'Your recent answers are clear.' : mode === 'signal' ? 'This signal can still be learned and reviewed without a quiz.' : ''); else renderQuestion();
}());
