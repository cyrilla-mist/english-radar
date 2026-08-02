(function () {
  'use strict';

  var signals = window.EnglishRadarContent ? window.EnglishRadarContent.getActiveLearningSignals() : (Array.isArray(window.ENGLISH_RADAR_SIGNALS) ? window.ENGLISH_RADAR_SIGNALS : []);
  var storage = window.EnglishRadarStorage;
  var progress = storage ? storage.getProgress() : {};
  var inbox = storage ? storage.getInbox() : [];
  var view = 'community';
  var filter = 'all';
  var sourceFilter = 'all';
  var query = '';
  var categories = ['Internet Culture', 'AI Builder', 'GitHub', 'GitHub / Development', 'Product Design', 'Fandom', 'Sports', 'Sports / Everyday', 'Everyday English', 'Personal'];
  var list = document.querySelector('[data-dictionary-list]');
  var empty = document.querySelector('[data-dictionary-empty]');
  var filterArea = document.querySelector('[data-dictionary-filters]');
  var search = document.querySelector('#dictionary-search');

  function personalEntries() {
    return inbox.filter(function (item) { return item && item.status === 'decoded' && item.decodedSignal && item.decodedSignal.id; }).map(function (item) { return { signal: item.decodedSignal, source: 'personal', inboxId: item.id }; });
  }
  function entries() { return signals.map(function (signal) { return { signal: signal, source: window.EnglishRadarContent ? window.EnglishRadarContent.getSignalSource(signal.id) || 'core' : 'core' }; }).concat(personalEntries()); }
  function record(entry) { return progress[entry.signal.id] || null; }
  function mastery(entry) { var value = record(entry); return value && value.mastery ? value.mastery : 'unseen'; }
  function label(value) { return value === 'unseen' ? 'Unseen' : value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Unseen'; }
  function searchable(entry) { var signal = entry.signal; return [signal.term, signal.displayTerm, signal.meaningEn, signal.meaningZh, signal.category, signal.platforms, signal.tone].map(function (value) { return Array.isArray(value) ? value.join(' ') : value || ''; }).join(' ').toLowerCase(); }
  function setText(selector, value) { var element = document.querySelector(selector); if (element) element.textContent = value; }
  function element(tag, className, value) { var node = document.createElement(tag); if (className) node.className = className; if (value !== undefined) node.textContent = value; return node; }

  function updateCounts() {
    var all = entries();
    setText('[data-dict-count="total"]', String(all.length));
    setText('[data-dict-count="learned"]', String(all.filter(function (entry) { return record(entry) && record(entry).firstLearnedAt; }).length));
    setText('[data-dict-count="favorites"]', String(all.filter(function (entry) { return record(entry) && record(entry).favorite === true; }).length));
    setText('[data-dict-count="personal"]', String(personalEntries().length));
  }

  function renderFilters() {
    var sourceArea = document.querySelector('[data-dictionary-sources]'); sourceArea.textContent = ''; [['all','All'],['core','Core'],['imported','Imported'],['personal','Personal']].forEach(function (item) { var sourceButton = element('button', sourceFilter === item[0] ? 'is-active' : '', item[1]); sourceButton.type = 'button'; sourceButton.dataset.source = item[0]; sourceButton.setAttribute('aria-pressed', sourceFilter === item[0] ? 'true' : 'false'); sourceArea.appendChild(sourceButton); }); sourceArea.querySelectorAll('button').forEach(function (button) { button.addEventListener('click', function () { sourceFilter = button.dataset.source; renderFilters(); render(); }); });
    filterArea.textContent = '';
    if (view === 'community') {
      categories.forEach(function (category) {
        var count = entries().filter(function (entry) { return (entry.source === 'personal' ? 'Personal' : entry.signal.category) === category; }).length;
        var button = element('button', filter === category ? 'is-active' : '', category + ' ' + count); button.type = 'button'; button.dataset.filter = category; button.setAttribute('aria-pressed', filter === category ? 'true' : 'false'); filterArea.appendChild(button);
      });
    } else if (view === 'mastery') {
      [['all', 'All'], ['unseen', 'Unseen'], ['new', 'New'], ['fuzzy', 'Fuzzy'], ['clear', 'Clear']].forEach(function (item) { var button = element('button', filter === item[0] ? 'is-active' : '', item[1]); button.type = 'button'; button.dataset.filter = item[0]; button.setAttribute('aria-pressed', filter === item[0] ? 'true' : 'false'); filterArea.appendChild(button); });
    }
    filterArea.querySelectorAll('button').forEach(function (button) { button.addEventListener('click', function () { filter = button.dataset.filter; renderFilters(); render(); }); });
  }

  function getFiltered() {
    return entries().filter(function (entry) {
      var category = entry.source === 'personal' ? 'Personal' : entry.signal.category;
      if (sourceFilter !== 'all' && entry.source !== sourceFilter) return false;
      if (query && searchable(entry).indexOf(query) === -1) return false;
      if (view === 'community' && filter !== 'all' && category !== filter) return false;
      if (view === 'mastery' && filter !== 'all' && mastery(entry) !== filter) return false;
      if (view === 'favorites' && !(record(entry) && record(entry).favorite === true)) return false;
      if (view === 'personal' && entry.source !== 'personal') return false;
      return true;
    });
  }

  function makeEntry(entry) {
    var signal = entry.signal; var current = record(entry); var row = element('div', 'dictionary-entry');
    var href = entry.source === 'personal' ? './learn.html?mode=lookup&source=inbox&signal=' + encodeURIComponent(signal.id) : './learn.html?mode=lookup&signal=' + encodeURIComponent(signal.id);
    var link = element('a', 'dictionary-entry-main'); link.href = href; link.setAttribute('aria-label', 'Open ' + (signal.displayTerm || signal.term)); link.appendChild(element('strong', 'dictionary-term', signal.displayTerm || signal.term)); link.appendChild(element('span', 'dictionary-meaning zh-text', signal.meaningZh || '—'));
    var meta = element('span', 'dictionary-meta', (entry.source.charAt(0).toUpperCase() + entry.source.slice(1)) + ' · ' + (entry.source === 'personal' ? 'Personal' : signal.category) + ' · ' + label(mastery(entry))); link.appendChild(meta); row.appendChild(link);
    var favorite = element('button', 'favorite-button' + (current && current.favorite ? ' is-favorite' : ''), current && current.favorite ? '★' : '☆'); favorite.type = 'button'; favorite.setAttribute('aria-label', current && current.favorite ? 'Remove from favorites' : 'Add to favorites'); favorite.setAttribute('aria-pressed', current && current.favorite ? 'true' : 'false');
    favorite.addEventListener('click', function (event) { event.preventDefault(); event.stopPropagation(); var existing = progress[signal.id] && typeof progress[signal.id] === 'object' ? progress[signal.id] : { signalId: signal.id, mastery: null, firstLearnedAt: null, lastReviewedAt: null, nextReviewAt: null, reviewCount: 0, errorCount: 0, favorite: false }; var next = Object.assign({}, existing, { signalId: signal.id, favorite: !existing.favorite }); progress[signal.id] = next; var saved = storage && storage.setProgress(progress); if (!saved) { favorite.title = 'Progress could not be saved in this browser.'; return; } updateCounts(); render(); });
    row.appendChild(favorite); return row;
  }

  function render() {
    var filtered = getFiltered(); list.textContent = ''; setText('[data-results-label]', view === 'community' ? 'By Community' : view === 'mastery' ? 'By Mastery' : view.charAt(0).toUpperCase() + view.slice(1)); setText('[data-results-count]', filtered.length + ' signal' + (filtered.length === 1 ? '' : 's')); empty.hidden = filtered.length > 0; filtered.forEach(function (entry) { list.appendChild(makeEntry(entry)); }); updateCounts();
  }

  document.querySelectorAll('[data-dictionary-view]').forEach(function (tab) { tab.addEventListener('click', function () { view = tab.dataset.dictionaryView; filter = 'all'; document.querySelectorAll('[data-dictionary-view]').forEach(function (item) { item.classList.remove('is-active'); item.setAttribute('aria-selected', item === tab ? 'true' : 'false'); }); tab.classList.add('is-active'); renderFilters(); render(); }); });
  if (search) search.addEventListener('input', function () { query = search.value.trim().toLowerCase(); render(); });
  renderFilters(); render();
}());
