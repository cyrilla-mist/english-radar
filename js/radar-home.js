(function () {
  'use strict';

  var engine = window.EnglishRadarLearningEngine;
  var registry = window.EnglishRadarContent;
  var storage = window.EnglishRadarStorage;
  var review = window.EnglishRadarReview;
  if (!engine || !registry) return;

  var snapshot = typeof engine.getTodaySnapshot === 'function' ? engine.getTodaySnapshot() : null;
  var signals = snapshot ? snapshot.signals : registry.getActiveLearningSignals();
  var mix = snapshot ? snapshot.dailyMix : (engine.getDailyMix ? engine.getDailyMix() : []);
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
  function currentSessionStatus() {
    var current = storage ? storage.getCurrentSession() : null;
    if (!current || current.mode !== 'learn' || !Array.isArray(current.signalIds) || !current.signalIds.length) return null;
    var ids = current.signalIds;
    var isDailyMix = ids.length === mix.length && ids.every(function (id, index) { return id === mix[index].id; });
    return { current: current, isDailyMix: isDailyMix, index: Math.min(Math.max(Number(current.currentIndex) || 0, 0), Math.max(ids.length - 1, 0)) };
  }
  function renderSessionStatus() {
    var status = currentSessionStatus(); var state = document.querySelector('[data-daily-mix-state]'); var area = document.querySelector('[data-session-recovery]');
    if (state) state.textContent = status && status.isDailyMix ? 'IN PROGRESS · ' + (status.index + 1) + ' / ' + mix.length : '';
    if (!area) return;
    area.hidden = !status;
    if (!status) return;
    setText('[data-recovery-kicker]', status.isDailyMix ? 'DAILY MIX' : 'SESSION NOTE');
    setText('[data-recovery-copy]', status.isDailyMix ? 'Your Daily Mix is waiting.' : 'You have an unfinished library session.');
    setText('[data-recovery-progress]', status.isDailyMix ? 'Signal ' + (status.index + 1) + ' of ' + mix.length : 'Continue where you left off');
  }
  function renderMix() { var target = document.querySelector('[data-daily-mix-preview]'); if (!target) return; clear(target); mix.forEach(function (signal) { var item = document.createElement('span'); item.textContent = signalName(signal); target.appendChild(item); }); setText('[data-daily-mix-count]', String(mix.length).padStart(2, '0')); var link = document.querySelector('[data-daily-mix-link]'); var status = currentSessionStatus(); if (link && status && status.isDailyMix) { link.href = './learn.html?resume=1'; link.firstChild.textContent = 'Continue Daily Mix '; } }
  function renderOnRadar() { var candidates = signals.filter(function (signal) { return !mixIds[signal.id] && isUnseen(signal); }).sort(function (a, b) { return hash('on-radar|' + a.id) - hash('on-radar|' + b.id); }).slice(0, 3); var section = document.querySelector('[data-radar-section="on-radar"]'); if (!candidates.length) { if (section) section.hidden = true; return; } if (section) section.hidden = false; renderList('[data-on-radar-list]', candidates, 'UNSEEN'); }
  function renderWorthAnotherLook() { var section = document.querySelector('[data-radar-section="worth-another-look"]'); var candidates = signals.filter(function (signal) { return !mixIds[signal.id] && isDueOrWeak(signal); }).sort(function (a, b) { var ad = progress[a.id] && progress[a.id].nextReviewAt || ''; var bd = progress[b.id] && progress[b.id].nextReviewAt || ''; return String(ad).localeCompare(String(bd)) || hash(a.id) - hash(b.id); }).slice(0, 1); if (!candidates.length) { if (section) section.hidden = true; return; } if (section) section.hidden = false; renderList('[data-worth-list]', candidates, 'REVIEW'); }
  function relationTerms(signal) { var values = Array.isArray(signal.relatedTerms) ? signal.relatedTerms.slice() : []; if (Array.isArray(signal.confusedWith)) values = values.concat(signal.confusedWith.map(function (item) { return item && item.term; })); return values.map(norm).filter(Boolean); }
  function renderConnection() { var section = document.querySelector('[data-radar-section="connection"]'); var preferred = mix.concat(signals.filter(function (signal) { return !mixIds[signal.id]; })); var chosen = null; var related = null; preferred.some(function (signal) { var terms = relationTerms(signal); var match = preferred.find(function (candidate) { return candidate.id !== signal.id && (terms.indexOf(norm(candidate.term)) !== -1 || terms.indexOf(norm(candidate.id)) !== -1); }); if (match) { chosen = signal; related = match; return true; } return false; }); if (!chosen) { if (section) section.hidden = true; return; } if (section) section.hidden = false; var target = document.querySelector('[data-connection-list]'); clear(target); var item = document.createElement('div'); item.className = 'radar-connection'; item.appendChild(makeLink(chosen, 'PRIMARY SIGNAL')); var connector = document.createElement('span'); connector.className = 'radar-connection-mark'; connector.textContent = 'connected to'; item.appendChild(connector); item.appendChild(makeLink(related, 'RELATED SIGNAL')); target.appendChild(item); }
  function renderDates() { var dates = formatDate(); document.querySelectorAll('[data-date-mobile]').forEach(function (node) { node.textContent = dates.short; }); document.querySelectorAll('[data-date-label]').forEach(function (node) { node.textContent = dates.long; }); setText('[data-radar-date]', dates.long); }
  renderDates(); renderMix(); renderOnRadar(); renderWorthAnotherLook(); renderConnection(); renderSessionStatus();
}());
