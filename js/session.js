(function () {
  'use strict';

  var learningEngine = window.EnglishRadarLearningEngine;
  var signals = learningEngine && typeof learningEngine.getFilteredSignals === 'function' ? learningEngine.getFilteredSignals() : (window.EnglishRadarContent ? window.EnglishRadarContent.getActiveLearningSignals() : (Array.isArray(window.ENGLISH_RADAR_SIGNALS) ? window.ENGLISH_RADAR_SIGNALS : []));
  var storage = window.EnglishRadarStorage;
  var review = window.EnglishRadarReview;
  var params = new URLSearchParams(window.location.search);
  var modeParam = params.get('mode');
  var mode = modeParam === 'review' ? 'review' : modeParam === 'lookup' ? 'lookup' : 'learn';
  var isLookup = mode === 'lookup';
  var requested = params.get('size');
  var currentIndex = 0;
  var sessionSignals = [];
  var masteryResults = {};
  var skippedResults = {};
  var startedAt = new Date().toISOString();
  var sessionSize = 0;
  var isAdvancing = false;
  var storageFailure = false;

  var detail = document.querySelector('.signal-detail');
  var summary = document.querySelector('.session-summary');
  var emptyState = document.querySelector('.empty-state');
  if (!detail || !summary || !emptyState) return;

  var refs = {
    title: document.querySelector('title'), meta: document.querySelector('[data-session-meta]'), category: document.querySelector('[data-field="category"]'), progress: document.querySelector('.learn-progress span'), progressTrack: document.querySelector('.learn-progress'), stamp: document.querySelector('.signal-stamp'), term: document.querySelector('.signal-heading h1'), pronunciation: document.querySelector('.pronunciation'), listen: document.querySelector('[data-speak-signal]'), meaningEn: document.querySelector('[data-field="meaningEn"]'), meaningZh: document.querySelector('[data-field="meaningZh"]'), exampleEn: document.querySelector('[data-field="exampleEn"]'), exampleZh: document.querySelector('[data-field="exampleZh"]'), platforms: document.querySelector('[data-field="platforms"]'), tone: document.querySelector('[data-field="tone"]'), status: document.querySelector('[data-field="status"]'), formality: document.querySelector('[data-field="formality"]'), useWhen: document.querySelector('[data-field="useWhen"]'), avoidWhen: document.querySelector('[data-field="avoidWhen"]'), chineseFeeling: document.querySelector('[data-field="chineseFeeling"]'), feedbacks: document.querySelectorAll('[data-session-feedback]'), exampleListen: document.querySelector('[data-speak-example]'), previous: document.querySelector('[data-session-previous]'), skip: document.querySelector('[data-session-skip]'), favorite: document.querySelector('[data-signal-favorite]'), practice: document.querySelector('[data-practice-signal]'), backLink: document.querySelector('[data-back-link]'), backLabel: document.querySelector('[data-back-label]'), summaryKicker: document.querySelector('[data-summary-kicker]'), emptyTitle: document.querySelector('[data-empty-title]'), emptyMessage: document.querySelector('[data-empty-message]'), sessionQuiz: document.querySelector('[data-session-quiz]'), reviewMistakesEmpty: document.querySelector('[data-review-mistakes-empty]'), reviewMistakesSummary: document.querySelector('[data-review-mistakes-summary]')
  };
  var standardSignalSection = document.querySelector('[data-standard-signal-section]');
  var interfaceSignalSection = document.querySelector('[data-interface-signal-section]');
  var interfaceFields = {};
  document.querySelectorAll('[data-interface-field]').forEach(function (element) { interfaceFields[element.getAttribute('data-interface-field')] = element; });
  var interfaceSections = {};
  document.querySelectorAll('[data-interface-section]').forEach(function (element) { interfaceSections[element.getAttribute('data-interface-section')] = element; });
  var interfaceList = document.querySelector('[data-interface-list="commonInterfaces"]');
  var interfaceExamples = document.querySelector('[data-interface-examples]');
  var interfaceConfused = document.querySelector('[data-interface-confused]');
  var interfaceRelated = document.querySelector('[data-interface-related]');

  var progressRecords = learningEngine && typeof learningEngine.getProgress === 'function' ? learningEngine.getProgress() : (storage ? storage.getProgress() : {});
  var bilingualRefs = { platforms: document.querySelector('[data-profile-zh="platforms"]'), tone: document.querySelector('[data-profile-zh="tone"]'), status: document.querySelector('[data-profile-zh="status"]'), formality: document.querySelector('[data-profile-zh="formality"]'), useWhen: document.querySelector('[data-field="useWhenZh"]'), avoidWhen: document.querySelector('[data-field="avoidWhenZh"]') };
  var profileZh = { platforms: { 'Internet culture': '互联网文化', 'Social media': '社交媒体', 'Casual chat': '日常聊天', 'Fandom': '粉丝文化', 'Developer community': '开发者社区', 'Product teams': '产品团队', GitHub: 'GitHub 社区' }, tone: { Casual: '非正式', Softened: '弱化语气', Playful: '带玩笑感', Approving: '表示认可', Cautionary: '带提醒意味' }, status: { Common: '常见', Established: '较稳定', Niche: '小众', 'Community-specific': '社区特定' }, formality: { 'Very informal': '非常非正式', Informal: '非正式', Neutral: '中性' } };
  Object.assign(profileZh.platforms, { Comments: '评论区', 'Comment sections': '评论区', Reddit: 'Reddit 社区', X: 'X 社区', TikTok: 'TikTok 社区', Discord: 'Discord 社区', YouTube: 'YouTube 社区', Product: '产品语境', Sports: '体育语境', Gaming: '游戏社区', 'News chat': '新闻讨论', Workplace: '工作场景', 'Design community': '设计社区', 'Developer community': '开发者社区', 'Product teams': '产品团队', 'Social media': '社交媒体', 'Casual chat': '日常聊天', 'Internet culture': '互联网文化', Fandom: '粉丝文化', 'Group chat': '群聊', 'Fan chat': '粉丝聊天', 'Music communities': '音乐社区', 'Community chat': '社区聊天', 'Work chat': '工作聊天', 'Startups': '创业团队', 'Strategy chat': '策略讨论', 'Engineering chat': '工程讨论', 'Design chat': '设计讨论', 'Research': '研究场景', 'Design tools': '设计工具', 'Release tools': '发布工具' });
  Object.assign(profileZh.tone, { Approving: '表示认可', Direct: '直接', Casual: '非正式', Playful: '带玩笑感', Supportive: '支持性', Critical: '批评性', Sarcastic: '讽刺性', Neutral: '中性', Enthusiastic: '热烈', Dismissive: '带敷衍或否定感', Humorous: '幽默', Excited: '兴奋', Surprised: '惊讶', Dramatic: '夸张', Softened: '弱化语气', Cautionary: '提醒性', Friendly: '友好', Negative: '负面', Positive: '正面', Teasing: '调侃', 'Self-mocking': '自嘲', Emphatic: '强调', Reflective: '反思性', Frank: '坦率', 'Community-specific': '社区特定', Personal: '个人化', Affectionate: '亲昵', Technical: '技术性', Practical: '实用', Strategic: '策略性', Experimental: '实验性', Systematic: '系统性', Operational: '运营性', 'Research-focused': '研究导向', 'Process-focused': '过程导向', 'Evidence-focused': '证据导向', Competitive: '竞争性', Public: '公开', Observational: '观察性', Confrontational: '对抗性', Amused: '觉得好笑' });
  Object.assign(profileZh.status, { Common: '常见', Established: '较稳定', Emerging: '正在出现', Evolving: '不断变化', Niche: '小众', Trending: '流行中', Stable: '稳定', 'Community-specific': '社区特定' });
  Object.assign(profileZh.formality, { 'Very informal': '非常非正式', Informal: '非正式', Neutral: '中性', Formal: '正式' });
  var missingZh = '该词条的中文使用说明尚未补充，请结合上方中文含义和例句理解。';
  function translateProfile(value, map) {
    var source = Array.isArray(value) ? value : String(value || '').trim();
    var values = Array.isArray(source) ? source : source.indexOf('·') !== -1 ? source.split(/\s*·\s*/) : source.indexOf(',') !== -1 ? source.split(/\s*,\s*/) : source ? [source] : [];
    return values.map(function (item) { return map[String(item).trim()] || '暂无标准中文标签'; }).join(' · ');
  }
  window.EnglishRadarProfileTools = window.EnglishRadarProfileTools || { translateProfile: translateProfile };
  if (storage) { var settingsRaw = storage.read(storage.keys.settings, null); if (!settingsRaw || Number(settingsRaw.dataVersion) !== 1 || Number(settingsRaw.contentVersion) !== 1) storage.setSettings(storage.getSettings()); }

  function text(value) { return value === undefined || value === null || value === '' ? '—' : String(value); }
  function displayTerm(value) { return hasText(value) ? String(value).trim().toUpperCase() : ''; }
  function list(value) { return Array.isArray(value) && value.length ? value.join(' · ') : '—'; }
  function hasText(value) { return typeof value === 'string' && value.trim() && value.trim() !== '—'; }
  function setText(element, value) { if (element) element.textContent = text(value); }
  function setFeedback(value) { refs.feedbacks.forEach(function (element) { element.textContent = value || ''; }); }
  function stopSpeech() { if (window.EnglishRadarSpeech) window.EnglishRadarSpeech.cancel(); }
  function renderBilingual(signal) { setText(bilingualRefs.platforms, translateProfile(list(signal.platforms), profileZh.platforms)); setText(bilingualRefs.tone, translateProfile(list(signal.tone), profileZh.tone)); setText(bilingualRefs.status, profileZh.status[signal.status] || '暂无标准中文标签'); setText(bilingualRefs.formality, profileZh.formality[signal.formality] || '暂无标准中文标签'); setText(bilingualRefs.useWhen, signal.useWhenZh || missingZh); setText(bilingualRefs.avoidWhen, signal.avoidWhenZh || missingZh); }
  function signalById(id) { return signals.find(function (signal) { return signal.id === id; }); }
  function quizList() { return window.EnglishRadarQuizRegistry && typeof window.EnglishRadarQuizRegistry.getStaticQuizzes === 'function' ? window.EnglishRadarQuizRegistry.getStaticQuizzes() : (Array.isArray(window.ENGLISH_RADAR_QUIZZES) ? window.ENGLISH_RADAR_QUIZZES : []); }
  function hasQuiz(signalId) { return quizList().some(function (question) { return question && question.signalId === signalId; }); }
  function categoryCode(category) { return ({ 'Internet Culture': 'IC', 'Product Design': 'PD', GitHub: 'GH', Sports: 'SP', 'UI Vocabulary': 'UI' })[category] || 'ER'; }
  function parseSize(value) { if (value === 'all') return signals.length; if (!/^\d+$/.test(value || '')) return 5; var number = Number(value); return number > 0 ? number : 5; }
  function validIds(ids) { return (Array.isArray(ids) ? ids : []).filter(function (id, index, list) { return signalById(id) && list.indexOf(id) === index; }); }
  function setEmptyCopy(title, message) { if (refs.emptyTitle) refs.emptyTitle.innerHTML = title; setText(refs.emptyMessage, message || ''); }
  function updateSessionObject() { window.EnglishRadarSession.currentIndex = currentIndex; window.EnglishRadarSession.sessionSignals = sessionSignals; window.EnglishRadarSession.masteryResults = masteryResults; }
  function saveCurrentSession() {
    if (isLookup || !storage || !sessionSignals.length) return true;
    var record = { mode: mode, size: sessionSize, signalIds: sessionSignals.map(function (signal) { return signal.id; }), currentIndex: currentIndex, masteryResults: masteryResults, skippedIds: Object.keys(skippedResults), startedAt: startedAt, updatedAt: new Date().toISOString() };
    var saved = storage.setCurrentSession(record); if (!saved) storageFailure = true; return saved;
  }
  function saveProgressRecord(signal, mastery) {
    if (!storage) { storageFailure = true; return false; }
    var now = new Date(); var existing = progressRecords[signal.id] && typeof progressRecords[signal.id] === 'object' ? progressRecords[signal.id] : {};
    var reviewCount = Number(existing.reviewCount); if (!Number.isFinite(reviewCount) || reviewCount < 0) reviewCount = 0;
    var errorCount = Number(existing.errorCount); if (!Number.isFinite(errorCount) || errorCount < 0) errorCount = 0;
    progressRecords[signal.id] = Object.assign({}, existing, { signalId: signal.id, mastery: mastery, firstLearnedAt: existing.firstLearnedAt || now.toISOString(), lastReviewedAt: now.toISOString(), nextReviewAt: review ? review.getNextReviewAt(mastery, reviewCount, now) : now.toISOString(), reviewCount: reviewCount + 1, errorCount: errorCount + (mastery === 'new' || mastery === 'fuzzy' ? 1 : 0), favorite: existing.favorite === undefined ? false : existing.favorite });
    var saved = storage.setProgress(progressRecords); if (!saved) storageFailure = true; return saved;
  }
  function saveFavorite(signal) {
    if (!storage) { storageFailure = true; return false; }
    var existing = progressRecords[signal.id] && typeof progressRecords[signal.id] === 'object' ? progressRecords[signal.id] : { signalId: signal.id, mastery: null, firstLearnedAt: null, lastReviewedAt: null, nextReviewAt: null, reviewCount: 0, errorCount: 0, favorite: false };
    progressRecords[signal.id] = Object.assign({}, existing, { signalId: signal.id, favorite: !existing.favorite });
    var saved = storage.setProgress(progressRecords); if (!saved) storageFailure = true; return saved;
  }
  function updateMasteryButtons(signal) { document.querySelectorAll('[data-mastery]').forEach(function (button) { button.classList.toggle('is-selected', masteryResults[signal.id] === button.getAttribute('data-mastery')); }); }
  function updateFavorite(signal) {
    if (!refs.favorite) return;
    var active = !!(progressRecords[signal.id] && progressRecords[signal.id].favorite === true);
    refs.favorite.textContent = active ? '★ Favorited' : '☆ Favorite'; refs.favorite.classList.toggle('is-favorite', active); refs.favorite.setAttribute('aria-pressed', active ? 'true' : 'false'); refs.favorite.setAttribute('aria-label', active ? 'Remove from favorites' : 'Add to favorites');
  }
  function isInterfaceSignal(signal) { return !!(signal && signal.radarType === 'interface'); }
  function clearInterfaceContent() {
    Object.keys(interfaceFields).forEach(function (key) { interfaceFields[key].textContent = ''; });
    [interfaceList, interfaceExamples, interfaceConfused, interfaceRelated].forEach(function (element) { if (element) element.textContent = ''; });
    Object.keys(interfaceSections).forEach(function (key) { interfaceSections[key].hidden = true; });
  }
  function setTemplateMode(signal) {
    var interfaceMode = isInterfaceSignal(signal);
    if (standardSignalSection) standardSignalSection.hidden = interfaceMode;
    if (interfaceSignalSection) interfaceSignalSection.hidden = !interfaceMode;
    if (!interfaceMode) clearInterfaceContent();
  }
  function renderInterfacePair(sectionName, enKey, zhKey, signal) {
    var en = hasText(signal[enKey]) ? signal[enKey].trim() : '';
    var zh = hasText(signal[zhKey]) ? signal[zhKey].trim() : '';
    if (interfaceFields[enKey]) interfaceFields[enKey].textContent = en;
    if (interfaceFields[zhKey]) interfaceFields[zhKey].textContent = zh;
    if (interfaceSections[sectionName]) interfaceSections[sectionName].hidden = !(en || zh);
  }
  function renderInterfaceSignal(signal) {
    clearInterfaceContent();
    renderInterfacePair('original', 'originalMeaningEn', 'originalMeaningZh', signal);
    renderInterfacePair('product', 'productMeaningEn', 'productMeaningZh', signal);
    renderInterfacePair('why', 'whyProductsUseItEn', 'whyProductsUseItZh', signal);
    var interfaces = Array.isArray(signal.commonInterfaces) ? signal.commonInterfaces.filter(hasText) : [];
    if (interfaceList && interfaces.length) { interfaces.forEach(function (item) { var tag = document.createElement('span'); tag.className = 'interface-tag'; tag.textContent = item.trim(); interfaceList.appendChild(tag); }); interfaceSections.where.hidden = false; }
    var examples = Array.isArray(signal.realInterfaceExamples) ? signal.realInterfaceExamples.filter(function (item) { return item && typeof item === 'object' && hasText(item.surface) && hasText(item.exampleEn) && hasText(item.exampleZh); }) : [];
    if (interfaceExamples && examples.length) { examples.forEach(function (item) { var example = document.createElement('article'); example.className = 'interface-example'; var surface = document.createElement('span'); surface.className = 'interface-surface'; surface.textContent = item.surface.trim(); var english = document.createElement('blockquote'); english.textContent = '“' + item.exampleEn.trim() + '”'; var chinese = document.createElement('p'); chinese.className = 'zh-text zh-example'; chinese.textContent = item.exampleZh.trim(); example.appendChild(surface); example.appendChild(english); example.appendChild(chinese); interfaceExamples.appendChild(example); }); interfaceSections.examples.hidden = false; }
    var confusions = Array.isArray(signal.confusedWith) ? signal.confusedWith.filter(function (item) { return item && typeof item === 'object' && hasText(item.term) && hasText(item.differenceEn) && hasText(item.differenceZh); }) : [];
    if (interfaceConfused && confusions.length) { confusions.forEach(function (item) { var row = document.createElement('article'); row.className = 'interface-confusion'; var term = document.createElement('strong'); term.textContent = displayTerm(signal.term) + ' ≠ ' + displayTerm(item.term); var english = document.createElement('p'); english.textContent = item.differenceEn.trim(); var chinese = document.createElement('p'); chinese.className = 'zh-text zh-meaning'; chinese.textContent = item.differenceZh.trim(); row.appendChild(term); row.appendChild(english); row.appendChild(chinese); interfaceConfused.appendChild(row); }); interfaceSections.confused.hidden = false; }
    var related = Array.isArray(signal.relatedTerms) ? signal.relatedTerms.map(function (id) { var target = window.EnglishRadarContent && window.EnglishRadarContent.getSignalById ? window.EnglishRadarContent.getSignalById(id) : signalById(id); return target ? { id: id, signal: target } : null; }).filter(Boolean) : [];
    if (interfaceRelated && related.length) { related.forEach(function (item) { var link = document.createElement('a'); link.href = './learn.html?mode=lookup&signal=' + encodeURIComponent(item.id); link.textContent = displayTerm(item.signal.displayTerm || item.signal.term); interfaceRelated.appendChild(link); }); interfaceSections.related.hidden = false; }
    renderInterfacePair('boundary', 'usageBoundaryEn', 'usageBoundaryZh', signal);
  }
  function renderStandardSignal(signal) {
    setText(refs.meaningEn, signal.meaningEn); setText(refs.meaningZh, signal.meaningZh); setText(refs.exampleEn, '“' + text(signal.exampleEn) + '”'); setText(refs.exampleZh, signal.exampleZh); setText(refs.platforms, list(signal.platforms)); setText(refs.tone, list(signal.tone)); setText(refs.status, signal.status); setText(refs.formality, signal.formality); setText(refs.useWhen, signal.useWhen); setText(refs.avoidWhen, signal.avoidWhen); setText(refs.chineseFeeling, signal.chineseFeeling); renderBilingual(signal);
  }
  function renderSignal() {
    var signal = sessionSignals[currentIndex]; if (!signal) return;
    var position = currentIndex + 1; var total = sessionSignals.length; var displayTerm = text(signal.displayTerm || signal.term).toUpperCase(); var interfaceMode = isInterfaceSignal(signal);
    refs.title.textContent = text(signal.term) + ' — English Radar'; setText(refs.meta, isLookup ? 'DICTIONARY ENTRY' : (mode === 'review' ? 'Review ' : 'SIGNAL ') + String(position).padStart(2, '0') + ' / ' + total); setText(refs.category, interfaceMode ? 'UI VOCABULARY' : isLookup ? signal.category : mode === 'review' ? 'REVIEW' : signal.category);
    if (refs.progress) refs.progress.style.width = (total ? position / total * 100 : 0) + '%'; if (refs.progressTrack) refs.progressTrack.setAttribute('aria-label', position + ' of ' + total + ' signals'); setText(refs.stamp, interfaceMode ? 'UI / ' + String(position).padStart(2, '0') : (isLookup ? categoryCode(signal.category) : mode === 'review' ? 'REVIEW' : categoryCode(signal.category)) + ' / ' + String(position).padStart(2, '0'));
    setText(refs.term, displayTerm); refs.term.classList.toggle('is-long', displayTerm.length > 10); setText(refs.pronunciation, signal.pronunciation); setTemplateMode(signal); if (interfaceMode) renderInterfaceSignal(signal); else renderStandardSignal(signal);
    var interfaceExample = interfaceMode && Array.isArray(signal.realInterfaceExamples) ? signal.realInterfaceExamples.find(function (item) { return item && hasText(item.exampleEn); }) : null; if (refs.listen) { refs.listen.dataset.speak = text(signal.speechText || signal.term); refs.listen.disabled = !!(window.EnglishRadarSpeech && !window.EnglishRadarSpeech.supported); } if (refs.exampleListen) { refs.exampleListen.dataset.speakExample = text(interfaceExample ? interfaceExample.exampleEn : signal.exampleEn); refs.exampleListen.disabled = !!(window.EnglishRadarSpeech && !window.EnglishRadarSpeech.supported); } if (refs.practice) { var practiceAvailable = signal.quizStatus !== 'none' && hasQuiz(signal.id); refs.practice.hidden = !isLookup || signal.sourceType === 'personal' || !practiceAvailable; refs.practice.href = './quiz.html?mode=signal&signal=' + encodeURIComponent(signal.id); } if (refs.previous) refs.previous.disabled = currentIndex === 0; updateMasteryButtons(signal); updateFavorite(signal); updateSessionObject(); setFeedback(storageFailure ? 'Progress could not be saved in this browser.' : '');
  }
  function showSummary() {
    stopSpeech(); if (storage) storage.setCurrentSession(null); document.body.classList.add('session-complete'); detail.hidden = true; summary.hidden = false; setText(refs.summaryKicker, mode === 'review' ? 'REVIEW COMPLETE' : 'SESSION COMPLETE'); if (refs.sessionQuiz) { var quizSignalIds = sessionSignals.filter(function (signal) { return hasQuiz(signal.id); }).map(function (signal) { return signal.id; }); refs.sessionQuiz.hidden = mode !== 'learn' || !quizSignalIds.length; if (quizSignalIds.length) refs.sessionQuiz.href = './quiz.html?mode=session&signals=' + encodeURIComponent(quizSignalIds.join(',')); } if (refs.reviewMistakesSummary) refs.reviewMistakesSummary.hidden = !(storage && storage.getQuizMistakeIds && storage.getQuizMistakeIds().length);
    var counts = { new: 0, fuzzy: 0, clear: 0 }; Object.keys(masteryResults).forEach(function (id) { if (counts[masteryResults[id]] !== undefined) counts[masteryResults[id]] += 1; }); setText(document.querySelector('[data-summary-total]'), sessionSignals.length + ' signals explored'); setText(document.querySelector('[data-summary-new]'), counts.new + ' new'); setText(document.querySelector('[data-summary-fuzzy]'), counts.fuzzy + ' fuzzy'); setText(document.querySelector('[data-summary-clear]'), counts.clear + ' clear'); setText(document.querySelector('[data-summary-skipped]'), Object.keys(skippedResults).length + ' skipped'); window.scrollTo({ top: 0, behavior: 'auto' });
  }
  function advance() { if (isAdvancing || isLookup) return; isAdvancing = true; stopSpeech(); window.setTimeout(function () { if (currentIndex >= sessionSignals.length - 1) showSummary(); else { currentIndex += 1; saveCurrentSession(); renderSignal(); var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); } isAdvancing = false; }, 380); }
  function mark(value) {
    if (isAdvancing || !sessionSignals[currentIndex]) return; var signal = sessionSignals[currentIndex]; masteryResults[signal.id] = value; var progressSaved = saveProgressRecord(signal, value); var sessionSaved = saveCurrentSession(); updateMasteryButtons(signal); setFeedback(!progressSaved || !sessionSaved || storageFailure ? 'Progress could not be saved in this browser.' : 'Marked as ' + value + '.'); if (!isLookup) advance();
  }
  function skip() { if (isAdvancing || isLookup || !sessionSignals[currentIndex]) return; skippedResults[sessionSignals[currentIndex].id] = true; saveCurrentSession(); setFeedback(storageFailure ? 'Progress could not be saved in this browser.' : 'Skipped.'); advance(); }
  function showEmpty(kind) { document.body.classList.remove('session-complete'); detail.hidden = true; summary.hidden = true; emptyState.hidden = false; if (refs.reviewMistakesEmpty) refs.reviewMistakesEmpty.hidden = !(kind === 'review' && storage && storage.getQuizMistakeIds && storage.getQuizMistakeIds().length); if (kind === 'review' && storage && storage.getQuizMistakeIds && storage.getQuizMistakeIds().length) setEmptyCopy('No reviews due.<br><em>Context needs another pass.</em>', 'You still have context mistakes to revisit.'); else if (kind === 'review') setEmptyCopy('No reviews due.<br><em>Your radar is clear for now.</em>', ''); else if (kind === 'lookup') setEmptyCopy('Signal not found.<br><em>Try another archive entry.</em>', ''); else setEmptyCopy('No signals<br><em>available.</em>', ''); }
  function configureMode() {
    document.body.classList.toggle('lookup-mode', isLookup); document.body.classList.toggle('review-mode', mode === 'review');
    if (refs.backLink && refs.backLabel) { refs.backLink.href = isLookup ? './dictionary.html' : './index.html'; refs.backLabel.textContent = isLookup ? 'Dictionary' : 'Exit'; }
    var activeHref = isLookup ? './dictionary.html' : mode === 'review' ? './learn.html?mode=review' : './index.html';
    document.querySelectorAll('.side-nav .nav-item, .mobile-nav a').forEach(function (link) {
      var active = link.getAttribute('href') === activeHref; link.classList.toggle('is-active', active); if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
    });
  }
  function getLookupSignal() {
    var id = params.get('signal'); if (params.get('source') === 'inbox' && storage) { var item = storage.getInbox().find(function (entry) { return entry && entry.status === 'decoded' && entry.decodedSignal && entry.decodedSignal.id === id; }); return item ? item.decodedSignal : null; } return signalById(id);
  }
  function initialise() {
    configureMode();
    if (isLookup) { var lookupSignal = getLookupSignal(); if (!lookupSignal) { showEmpty('lookup'); return; } sessionSignals = [lookupSignal]; sessionSize = 1; emptyState.hidden = true; summary.hidden = true; detail.hidden = false; renderSignal(); return; }
    var current = storage ? storage.getCurrentSession() : null;
    if (mode === 'review') { sessionSignals = review ? review.getReviewQueue(signals, progressRecords, new Date()) : []; sessionSize = sessionSignals.length; }
    else if (params.get('resume') === '1' && current && current.mode === 'learn') { var ids = validIds(current.signalIds); if (!ids.length) { if (storage) storage.setCurrentSession(null); showEmpty('empty'); return; } sessionSignals = ids.map(signalById); sessionSize = sessionSignals.length; currentIndex = Math.min(Math.max(Number(current.currentIndex) || 0, 0), sessionSignals.length - 1); masteryResults = current.masteryResults && typeof current.masteryResults === 'object' ? current.masteryResults : {}; skippedResults = {}; validIds(current.skippedIds).forEach(function (id) { skippedResults[id] = true; }); startedAt = current.startedAt || startedAt; }
    else { var size = parseSize(requested); var fresh = signals.filter(function (signal) { return !progressRecords[signal.id]; }); var old = signals.filter(function (signal) { return !!progressRecords[signal.id]; }).slice().sort(function (a, b) { var ad = review && review.asDate(progressRecords[a.id].lastReviewedAt); var bd = review && review.asDate(progressRecords[b.id].lastReviewedAt); return (ad ? ad.getTime() : Infinity) - (bd ? bd.getTime() : Infinity); }); sessionSignals = fresh.concat(old).slice(0, Math.min(size, signals.length)); sessionSize = sessionSignals.length; }
    if (!sessionSignals.length) { showEmpty(mode === 'review' ? 'review' : 'empty'); return; } document.body.classList.remove('no-signals'); emptyState.hidden = true; summary.hidden = true; detail.hidden = false; saveCurrentSession(); renderSignal();
  }

  window.EnglishRadarSession = { currentIndex: currentIndex, sessionSignals: sessionSignals, masteryResults: masteryResults };
  document.querySelectorAll('[data-mastery]').forEach(function (button) { button.addEventListener('click', function () { mark(button.getAttribute('data-mastery')); }); });
  if (refs.skip) refs.skip.addEventListener('click', skip);
  if (refs.previous) refs.previous.addEventListener('click', function () { if (currentIndex === 0 || isAdvancing || isLookup) return; stopSpeech(); currentIndex -= 1; saveCurrentSession(); renderSignal(); });
  if (refs.favorite) refs.favorite.addEventListener('click', function () { if (!sessionSignals[currentIndex]) return; if (saveFavorite(sessionSignals[currentIndex])) { updateFavorite(sessionSignals[currentIndex]); setFeedback('Favorite updated.'); } else setFeedback('Progress could not be saved in this browser.'); });
  document.addEventListener('keydown', function (event) { if (event.target && /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return; if (event.key === '1') mark('new'); if (event.key === '2') mark('fuzzy'); if (event.key === '3') mark('clear'); });
  var restartButton = document.querySelector('[data-restart-session]'); if (restartButton) restartButton.addEventListener('click', function () { if (storage) storage.setCurrentSession(null); window.location.href = mode === 'review' ? './learn.html?mode=review' : './learn.html?size=' + encodeURIComponent(sessionSize || 5); });
  initialise();
}());
