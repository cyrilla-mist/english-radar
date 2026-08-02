(function () {
  'use strict';

  var signals = window.EnglishRadarContent ? window.EnglishRadarContent.getActiveLearningSignals() : (Array.isArray(window.ENGLISH_RADAR_SIGNALS) ? window.ENGLISH_RADAR_SIGNALS : []);
  var quizzes = Array.isArray(window.ENGLISH_RADAR_QUIZZES) ? window.ENGLISH_RADAR_QUIZZES : [];
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
    panel: document.querySelector('[data-quiz-panel]'), empty: document.querySelector('[data-quiz-empty]'), summary: document.querySelector('[data-quiz-summary]'), progress: document.querySelector('[data-quiz-progress]'), correct: document.querySelector('[data-quiz-correct]'), progressBar: document.querySelector('[data-quiz-progress-bar]'), context: document.querySelector('[data-quiz-context]'), question: document.querySelector('[data-quiz-question]'), options: document.querySelector('[data-quiz-options]'), check: document.querySelector('[data-quiz-check]'), feedback: document.querySelector('[data-quiz-feedback]'), explanation: document.querySelector('[data-quiz-explanation]'), explanationEn: document.querySelector('[data-quiz-explanation-en]'), explanationZh: document.querySelector('[data-quiz-explanation-zh]'), reviewSignal: document.querySelector('[data-review-signal]')
  };

  function shuffle(items) { var array = items.slice(); for (var i = array.length - 1; i > 0; i -= 1) { var j = Math.floor(Math.random() * (i + 1)); var swap = array[i]; array[i] = array[j]; array[j] = swap; } return array; }
  function validQuestion(question) { return question && question.id && signalMap[question.signalId] && Array.isArray(question.options) && question.options.length === 4 && question.correctOptionId && question.options.some(function (option) { return option && option.id === question.correctOptionId; }) && question.options.every(function (option, index, list) { return option && option.id && option.text && list.findIndex(function (item) { return item && item.id === option.id; }) === index; }) && question.explanationEn && question.explanationZh; }
  function baseQuestions() { return quizzes.filter(validQuestion); }
  function signalIdsFromParam() { return (params.get('signals') || '').split(',').map(function (id) { return id.trim(); }).filter(function (id, index, ids) { return signalMap[id] && ids.indexOf(id) === index; }); }
  function chooseBalanced(candidates, count) {
    var shuffled = shuffle(candidates); var picked = []; var seenSignals = {};
    shuffled.forEach(function (question) { if (picked.length < count && !seenSignals[question.signalId]) { picked.push(question); seenSignals[question.signalId] = true; } });
    shuffled.forEach(function (question) { if (picked.length < count && picked.indexOf(question) === -1) picked.push(question); });
    return picked;
  }
  function getMistakeQuestions() {
    var history = storage ? storage.getQuizHistory() : { byQuiz: {} }; var byQuiz = history.byQuiz || {};
    return baseQuestions().filter(function (question) { return byQuiz[question.id] && byQuiz[question.id].lastAnswerCorrect === false; }).sort(function (a, b) { return new Date(byQuiz[b.id].lastAnsweredAt || 0).getTime() - new Date(byQuiz[a.id].lastAnsweredAt || 0).getTime(); });
  }
  function getQuestions() {
    var all = baseQuestions();
    if (mode === 'mistakes') return getMistakeQuestions();
    if (mode === 'signal') { var signalId = params.get('signal'); return all.filter(function (question) { return question.signalId === signalId; }); }
    if (mode === 'session') { var ids = signalIdsFromParam(); return chooseBalanced(all.filter(function (question) { return ids.indexOf(question.signalId) !== -1; }), all.length); }
    var count = mode === 'standard' ? 10 : 5; return chooseBalanced(all, Math.min(count, all.length));
  }
  function setText(element, value) { if (element) element.textContent = value === undefined || value === null ? '' : String(value); }
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
    setText(refs.feedback, storageFailure ? 'Quiz progress could not be saved in this browser.' : correct ? 'Correct.' : 'Not quite.'); refs.feedback.classList.toggle('is-error', !correct); setText(refs.explanationEn, question.explanationEn); setText(refs.explanationZh, question.explanationZh); refs.explanation.hidden = false; refs.reviewSignal.href = './learn.html?mode=lookup&signal=' + encodeURIComponent(question.signalId); refs.check.textContent = questionIndex === questions.length - 1 ? 'View summary' : 'Next question'; refs.check.disabled = false; updateStatus();
  }
  function nextQuestion() { if (!checked) { checkAnswer(); return; } if (questionIndex >= questions.length - 1) { showSummary(); return; } questionIndex += 1; selectedId = null; checked = false; renderQuestion(); window.scrollTo({ top: 0, behavior: window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }
  function renderQuestion() { var question = questions[questionIndex]; if (!question) { showEmpty('No quiz questions available.', ''); return; } checked = false; selectedId = null; refs.panel.hidden = false; refs.empty.hidden = true; refs.summary.hidden = true; setText(refs.context, '“' + question.context + '”'); setText(refs.question, question.question); refs.explanation.hidden = true; refs.check.textContent = 'Check answer →'; refs.check.disabled = true; setText(refs.feedback, ''); renderOptions(question); updateStatus(); }
  function showSummary() {
    refs.panel.hidden = true; refs.empty.hidden = true; refs.summary.hidden = false; document.title = 'Context Check Complete — English Radar'; var total = questions.length; var incorrect = total - correctCount; setText(document.querySelector('[data-summary-total]'), total + ' questions checked'); setText(document.querySelector('[data-summary-correct]'), correctCount + ' correct'); setText(document.querySelector('[data-summary-incorrect]'), incorrect + ' incorrect'); setText(document.querySelector('[data-summary-accuracy]'), (total ? Math.round(correctCount / total * 100) : 0) + '% accuracy'); var list = document.querySelector('[data-quiz-revisit-list]'); list.textContent = ''; var seen = {}; incorrectQuestions.slice(0, 20).forEach(function (question) { if (seen[question.signalId] || Object.keys(seen).length >= 6) return; seen[question.signalId] = true; var link = document.createElement('a'); link.href = './learn.html?mode=lookup&signal=' + encodeURIComponent(question.signalId); link.textContent = signalMap[question.signalId].displayTerm || signalMap[question.signalId].term; list.appendChild(link); }); var retry = document.querySelector('[data-retry-mistakes]'); if (retry) retry.hidden = !incorrectQuestions.length; window.scrollTo({ top: 0, behavior: 'auto' }); }
  function retryMistakes() { if (!incorrectQuestions.length) return; questions = incorrectQuestions.slice(); questionIndex = 0; correctCount = 0; incorrectQuestions = []; document.title = 'Context Check — English Radar'; renderQuestion(); }
  refs.check.addEventListener('click', nextQuestion);
  document.addEventListener('keydown', function (event) { if (event.target && /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return; if (/^[1-4]$/.test(event.key) && !checked) { var button = refs.options.querySelectorAll('.quiz-option')[Number(event.key) - 1]; if (button) selectOption(button.dataset.optionId); } else if (event.key === 'Enter') { event.preventDefault(); nextQuestion(); } });
  var retry = document.querySelector('[data-retry-mistakes]'); if (retry) retry.addEventListener('click', retryMistakes);
  setModeNavigation(); questions = getQuestions();
  if (!quizzes.length || !questions.length) { showEmpty(mode === 'mistakes' ? 'No context mistakes waiting.' : mode === 'signal' ? 'No context questions for this signal yet.' : 'No quiz questions available.', mode === 'mistakes' ? 'Your recent answers are clear.' : mode === 'signal' ? 'This signal can still be learned and reviewed without a quiz.' : ''); } else { renderQuestion(); }
}());
