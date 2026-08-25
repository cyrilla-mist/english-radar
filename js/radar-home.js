(function () {
  'use strict';

  function resolveSessionStatus(current, dailyMix) {
    var mix = Array.isArray(dailyMix) ? dailyMix : [];
    if (!current || current.mode !== 'learn' || !Array.isArray(current.signalIds) || !current.signalIds.length) return null;
    var ids = current.signalIds;
    var isDailyMix = ids.length === mix.length && ids.every(function (id, index) { return mix[index] && id === mix[index].id; });
    return { current: current, isDailyMix: isDailyMix, index: Math.min(Math.max(Number(current.currentIndex) || 0, 0), Math.max(ids.length - 1, 0)) };
  }
  function resolveSessionPresentation(current, dailyMix) {
    var mix = Array.isArray(dailyMix) ? dailyMix : [];
    var status = resolveSessionStatus(current, mix);
    if (!status) return { cta: 'Start Daily Mix', href: './learn.html?feed=daily-mix&size=5', state: '', recoveryVisible: false, status: null };
    if (status.isDailyMix) return { cta: 'Continue Daily Mix', href: './learn.html?resume=1', state: 'IN PROGRESS · ' + (status.index + 1) + ' / ' + mix.length, recoveryVisible: false, status: status };
    return { cta: 'Start Daily Mix', href: './learn.html?feed=daily-mix&size=5', state: '', recoveryVisible: true, status: status };
  }
  function normalizedRelations(signal) {
    var resolver = window.SideglanceSignalResolver;
    if (resolver && typeof resolver.resolve === 'function') return resolver.resolve(signal).relations || [];
    var related = signal && Array.isArray(signal.relatedTerms) ? signal.relatedTerms.map(function (value) { return { target: value, type: 'same-context' }; }) : [];
    var confused = signal && Array.isArray(signal.confusedWith) ? signal.confusedWith.map(function (value) { return { target: value && (value.id || value.term), type: 'contrast' }; }) : [];
    return related.concat(confused).filter(function (relation) { return relation && relation.target; });
  }
  function relationTargetMatches(relation, signal) {
    var target = relation && relation.target;
    return [signal && signal.id, signal && signal.term].map(norm).filter(Boolean).indexOf(norm(target)) !== -1;
  }
  function relationTypesForPair(source, target) {
    return normalizedRelations(source).filter(function (relation) { return relationTargetMatches(relation, target); }).map(function (relation) { return norm(relation.type); });
  }
  function findCurrentMixRelation(signal, currentMix, type) {
    return (Array.isArray(currentMix) ? currentMix : []).find(function (candidate) {
      if (!candidate || candidate.id === signal.id) return false;
      var types = relationTypesForPair(signal, candidate).concat(relationTypesForPair(candidate, signal));
      return types.indexOf(type) !== -1;
    }) || null;
  }
  function identityValues(value) {
    var values = Array.isArray(value) ? value : [value];
    return values.map(text).filter(Boolean);
  }
  function resolveContextHint(signal) {
    var resolver = window.SideglanceSignalResolver;
    var normalized = resolver && typeof resolver.resolve === 'function' ? resolver.resolve(signal) : null;
    var feeling = normalized && normalized.meaning ? text(normalized.meaning.feeling) : '';
    var legacyFeeling = text(signal && signal.chineseFeeling);
    if (feeling && feeling !== legacyFeeling) return feeling;
    return text(normalized && normalized.meaning && normalized.meaning.core) || text(signal && signal.meaningEn) || feeling;
  }
  function resolveSignalIdentity(signal) {
    var resolver = window.SideglanceSignalResolver;
    var normalized = resolver && typeof resolver.resolve === 'function' ? resolver.resolve(signal) : null;
    var identity = normalized && normalized.identity ? normalized.identity : {};
    var metadata = signal && signal.signalIdentity && typeof signal.signalIdentity === 'object' ? signal.signalIdentity : {};
    var legacyGroups = [metadata.usageContext || signal && signal.usageContext || signal && signal.communityContext || signal && signal.productContext || signal && signal.developerContext, metadata.platforms || metadata.communityContext || metadata.productContext || metadata.developerContext || signal && signal.platforms, metadata.tone || signal && signal.tone, metadata.signalType || metadata.type || metadata.category || signal && signal.category];
    var groups = normalized ? [identity.contexts || legacyGroups[0], identity.platforms && identity.platforms.length ? identity.platforms : legacyGroups[1], identity.tone || legacyGroups[2], identity.category || legacyGroups[3]] : legacyGroups;
    var parts = [];
    groups.forEach(function (group) { identityValues(group).forEach(function (value) { if (parts.indexOf(value) === -1 && value.length <= 80 && parts.length < 3) parts.push(value); }); });
    return parts.join(' · ');
  }
  function resolveDailyMixContextCue(signal, currentMix, progress) {
    if (!signal || !signal.id) return { type: 'RADAR PICK', detail: '' };
    var contrast = findCurrentMixRelation(signal, currentMix, 'contrast');
    if (contrast) return { type: 'CONTRAST', detail: 'Contrasts with "' + text(contrast.term) + '".' };
    var connected = ['similar', 'often-paired', 'same-context'].map(function (type) { return findCurrentMixRelation(signal, currentMix, type); }).find(Boolean);
    if (connected) return { type: 'CONNECTED', detail: 'Connected to "' + text(connected.term) + '".' };
    var record = progress && progress[signal.id];
    if (record && record.firstLearnedAt) return { type: 'REVISIT', detail: '' };
    if (!progress || !record || !record.firstLearnedAt) return { type: 'NEW', detail: '' };
    return { type: 'RADAR PICK', detail: '' };
  }
  window.SideglanceRadarHome = { resolveSessionStatus: resolveSessionStatus, resolveSessionPresentation: resolveSessionPresentation, resolveDailyMixContextCue: resolveDailyMixContextCue, resolveContextHint: resolveContextHint, resolveSignalIdentity: resolveSignalIdentity };

  var engine = window.EnglishRadarLearningEngine;
  var registry = window.EnglishRadarContent;
  var storage = window.EnglishRadarStorage;
  var review = window.EnglishRadarReview;
  if (!engine || !registry) return;

  var snapshot = typeof engine.getTodaySnapshot === 'function' ? engine.getTodaySnapshot() : null;
  var signals = snapshot ? snapshot.signals : registry.getActiveLearningSignals();
  var mix = snapshot ? snapshot.dailyMix : (engine.getDailyMix ? engine.getDailyMix() : []);
  var todayFocus = snapshot && snapshot.todayFocus ? snapshot.todayFocus : (engine.getTodayFocus ? engine.getTodayFocus() : null);
  var progress = snapshot ? snapshot.progress : (storage ? storage.getProgress() : {});
  var mixIds = {}; mix.forEach(function (signal) { mixIds[signal.id] = true; });

  function text(value) { return String(value === undefined || value === null ? '' : value).trim(); }
  function norm(value) { return text(value).toLowerCase().replace(/\s+/g, ' '); }
  function setText(selector, value) { var node = document.querySelector(selector); if (node) node.textContent = text(value); }
  function formatDate(date) { var value = date || new Date(); var month = new Intl.DateTimeFormat(undefined, { month: 'short' }).format(value).toUpperCase(); var day = new Intl.DateTimeFormat(undefined, { day: '2-digit' }).format(value); var weekday = new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(value).toUpperCase(); return { short: month + ' ' + day, long: month + ' ' + day + ' · ' + weekday }; }
  function signalName(signal) { return text(signal && (signal.term || signal.displayTerm)); }
  function signalHref(signal) { return './learn.html?mode=lookup&signal=' + encodeURIComponent(signal.id); }
  function hash(value) { var result = 2166136261; text(value).split('').forEach(function (character) { result ^= character.charCodeAt(0); result = Math.imul(result, 16777619); }); return result >>> 0; }
  function signalById(id) { return signals.find(function (signal) { return signal.id === id; }) || null; }
  function isUnseen(signal) { return !(progress[signal.id] && progress[signal.id].firstLearnedAt); }
  function isDueOrWeak(signal) { var record = progress[signal.id]; if (!record || !record.firstLearnedAt) return false; if (record.mastery === 'new' || record.mastery === 'fuzzy') return true; var next = review && review.asDate ? review.asDate(record.nextReviewAt) : null; return !!(next && next.getTime() <= Date.now()); }
  function clear(node) { if (node) node.textContent = ''; }
  function makeLink(signal, label) { var link = document.createElement('a'); link.href = signalHref(signal); link.className = 'radar-signal-link'; var name = document.createElement('strong'); name.textContent = signalName(signal); var meta = document.createElement('span'); meta.textContent = label || text(signal.category); var arrow = document.createElement('span'); arrow.className = 'signal-arrow'; arrow.textContent = '↗'; link.appendChild(name); link.appendChild(meta); link.appendChild(arrow); return link; }
  function renderList(selector, items, label) { var target = document.querySelector(selector); if (!target) return; clear(target); items.forEach(function (signal) { target.appendChild(makeLink(signal, label)); }); }
  function renderSessionStatus() {
    var current = storage ? storage.getCurrentSession() : null; var presentation = resolveSessionPresentation(current, mix); var status = presentation.status; var state = document.querySelector('[data-daily-mix-state]'); var area = document.querySelector('[data-session-recovery]');
    if (state) state.textContent = presentation.state;
    if (!area) return;
    area.hidden = !presentation.recoveryVisible;
    if (!presentation.recoveryVisible || !status) return;
    setText('[data-recovery-kicker]', 'SESSION NOTE');
    setText('[data-recovery-copy]', 'You have an unfinished library session.');
    setText('[data-recovery-progress]', 'Continue where you left off');
  }
  function renderTodayFocus() { var section = document.querySelector('[data-today-focus]'); if (!section) return; if (!todayFocus || !todayFocus.title || !todayFocus.description) { section.hidden = true; return; } section.hidden = false; setText('[data-today-focus-title]', todayFocus.title); setText('[data-today-focus-description]', todayFocus.description); }
  function renderMix() { var target = document.querySelector('[data-daily-mix-preview]'); if (!target) return; clear(target); mix.forEach(function (signal) { var cue = resolveDailyMixContextCue(signal, mix, progress); var item = document.createElement('a'); item.className = 'daily-mix-signal'; item.href = './signal-entry.html?id=' + encodeURIComponent(signal.id); item.setAttribute('aria-label', 'Open Signal Entry for ' + signalName(signal)); var term = document.createElement('strong'); term.className = 'daily-mix-term'; term.textContent = signalName(signal); var type = document.createElement('span'); type.className = 'daily-mix-cue'; type.textContent = cue.type; var context = document.createElement('span'); context.className = 'daily-mix-context'; context.textContent = resolveContextHint(signal); item.appendChild(term); item.appendChild(type); item.appendChild(context); if ((cue.type === 'CONNECTED' || cue.type === 'CONTRAST') && cue.detail) { var detail = document.createElement('span'); detail.className = 'daily-mix-detail'; detail.textContent = cue.detail; item.appendChild(detail); } var identity = resolveSignalIdentity(signal); if (identity) { var identityLine = document.createElement('span'); identityLine.className = 'daily-mix-identity'; identityLine.textContent = identity; item.appendChild(identityLine); } target.appendChild(item); }); setText('[data-daily-mix-count]', String(mix.length).padStart(2, '0')); var link = document.querySelector('[data-daily-mix-link]'); var current = storage ? storage.getCurrentSession() : null; var presentation = resolveSessionPresentation(current, mix); if (link) { link.href = presentation.href; link.firstChild.textContent = presentation.cta + ' '; } }
  function renderOnRadar() { var candidates = signals.filter(function (signal) { return !mixIds[signal.id] && isUnseen(signal); }).sort(function (a, b) { return hash('on-radar|' + a.id) - hash('on-radar|' + b.id); }).slice(0, 3); var section = document.querySelector('[data-radar-section="on-radar"]'); if (!candidates.length) { if (section) section.hidden = true; return; } if (section) section.hidden = false; renderList('[data-on-radar-list]', candidates, 'UNSEEN'); }
  function renderWorthAnotherLook() { var section = document.querySelector('[data-radar-section="worth-another-look"]'); var candidates = signals.filter(function (signal) { return !mixIds[signal.id] && isDueOrWeak(signal); }).sort(function (a, b) { var ad = progress[a.id] && progress[a.id].nextReviewAt || ''; var bd = progress[b.id] && progress[b.id].nextReviewAt || ''; return String(ad).localeCompare(String(bd)) || hash(a.id) - hash(b.id); }).slice(0, 1); if (!candidates.length) { if (section) section.hidden = true; return; } if (section) section.hidden = false; renderList('[data-worth-list]', candidates, 'REVIEW'); }
  function renderConnection() { var section = document.querySelector('[data-radar-section="connection"]'); var preferred = mix.concat(signals.filter(function (signal) { return !mixIds[signal.id]; })); var chosen = null; var related = null; preferred.some(function (signal) { var match = preferred.find(function (candidate) { return candidate.id !== signal.id && (relationTypesForPair(signal, candidate).length || relationTypesForPair(candidate, signal).length); }); if (match) { chosen = signal; related = match; return true; } return false; }); if (!chosen) { if (section) section.hidden = true; return; } if (section) section.hidden = false; var target = document.querySelector('[data-connection-list]'); clear(target); var item = document.createElement('div'); item.className = 'radar-connection'; item.appendChild(makeLink(chosen, 'PRIMARY SIGNAL')); var connector = document.createElement('span'); connector.className = 'radar-connection-mark'; connector.textContent = 'connected to'; item.appendChild(connector); item.appendChild(makeLink(related, 'RELATED SIGNAL')); target.appendChild(item); }
  function renderDates() { var dates = formatDate(); document.querySelectorAll('[data-date-mobile]').forEach(function (node) { node.textContent = dates.short; }); document.querySelectorAll('[data-date-label]').forEach(function (node) { node.textContent = dates.long; }); }
  renderDates(); renderTodayFocus(); renderMix(); renderOnRadar(); renderWorthAnotherLook(); renderConnection(); renderSessionStatus();
}());
