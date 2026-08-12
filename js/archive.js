(function () {
  'use strict';

  function text(value) { return typeof value === 'string' ? value.trim() : ''; }
  function list(value) { return Array.isArray(value) ? value.filter(function (item) { return text(item); }) : []; }
  function escapeHtml(value) {
    return String(value === undefined || value === null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }
  function recordType(signal) {
    var category = text(signal && signal.category).toLowerCase();
    if (category === 'community discourse') return 'COMMUNITY SIGNAL';
    if (category === 'product naming') return 'PRODUCT LEXICON';
    if (category === 'ai builder' || category.indexOf('ai') !== -1) return 'BUILDER LOG';
    if (category === 'ui vocabulary' || signal && signal.radarType === 'interface') return 'INTERFACE RECORD';
    if (category === 'internet culture' || category === 'slang') return 'NETWORK ARTIFACT';
    return 'LANGUAGE SIGNAL';
  }
  function searchable(signal) {
    return [
      signal.term, signal.meaningEn, signal.meaningZh, signal.category,
      list(signal.platforms).join(' '), list(signal.relatedTerms).join(' '),
      signal.culturalContextEn, signal.culturalContextZh,
      signal.productMeaningEn, signal.productMeaningZh
    ].map(text).join(' ').toLowerCase();
  }
  function createIndex(content, bundledRegistry) {
    var byId = {};
    var signals = content && typeof content.getDictionarySignals === 'function' ? content.getDictionarySignals().slice() : [];
    var packs = bundledRegistry && typeof bundledRegistry.getBundledPacks === 'function' ? bundledRegistry.getBundledPacks() : [];
    packs.forEach(function (payload) {
      var packId = payload && payload.pack && payload.pack.id;
      (payload && Array.isArray(payload.signals) ? payload.signals : []).forEach(function (raw) {
        var normalized = content && typeof content.normalizeSignal === 'function'
          ? content.normalizeSignal(raw, { sourceType: 'bundled', packId: packId })
          : raw;
        if (normalized && normalized.id && !byId[normalized.id]) { byId[normalized.id] = normalized; signals.push(normalized); }
      });
    });
    signals.forEach(function (signal) { if (signal && signal.id) byId[signal.id] = signal; });
    return { signals: signals.filter(function (signal, index, listValue) { return signal && listValue.findIndex(function (item) { return item.id === signal.id; }) === index; }), byId: byId };
  }
  function search(index, query) {
    var needle = text(query).toLowerCase();
    if (!needle) return index.signals.slice();
    return index.signals.filter(function (signal) { return searchable(signal).indexOf(needle) !== -1; });
  }
  function archiveStatus(index) { return index.signals.length ? 'INDEX ONLINE' : 'INDEX EMPTY'; }
  function renderCard(signal) {
    var platforms = list(signal.platforms);
    var context = platforms.slice(0, 2).join(' / ') || text(signal.category) || 'general internet';
    var status = text(signal.status) || text(signal.contentStatus) || 'indexed';
    var tone = list(signal.tone).slice(0, 2).join(' / ') || 'unmarked';
    return '<article class="archive-card"><div class="archive-card-top"><span class="archive-record-type">' + escapeHtml(recordType(signal)) + '</span><span class="archive-meta">' + escapeHtml(status) + '</span></div><h2><a class="archive-link" href="./archive-signal.html?id=' + encodeURIComponent(signal.id) + '">' + escapeHtml(signal.displayTerm || signal.term) + '</a></h2><p>' + escapeHtml(text(signal.meaningEn) || text(signal.meaningZh) || 'Indexed language signal.') + '</p><div class="archive-card-footer"><span class="archive-meta">' + escapeHtml(context) + '</span><span class="archive-meta">TONE / ' + escapeHtml(tone) + '</span></div></article>';
  }
  function boot() {
    var index = createIndex(window.EnglishRadarContent, window.EnglishRadarBundledPackRegistry);
    window.EnglishRadarArchive = { index: index, recordType: recordType, search: function (query) { return search(index, query); }, findSignal: function (id) { return index.byId[id] || null; }, createIndex: createIndex };
    var cards = document.querySelector('[data-archive-record-grid]');
    var input = document.querySelector('[data-archive-search]');
    var count = document.querySelector('[data-archive-count]');
    var status = document.querySelector('[data-archive-status]');
    var categories = document.querySelector('[data-archive-categories]');
    function render(query) {
      var result = search(index, query);
      if (count) count.textContent = result.length;
      if (status) status.textContent = archiveStatus({ signals: result });
      if (cards) cards.innerHTML = result.length ? result.map(renderCard).join('') : '<div class="archive-empty"><strong>No records found.</strong><p>Try a term, category, platform or semantic meaning.</p></div>';
    }
    var categoryCount = {}; index.signals.forEach(function (signal) { categoryCount[signal.category] = (categoryCount[signal.category] || 0) + 1; });
    if (categories) categories.textContent = Object.keys(categoryCount).length + ' / ' + Object.keys(categoryCount).sort().join(' · ');
    if (input) input.addEventListener('input', function () { render(input.value); });
    render('');
  }
  window.EnglishRadarArchive = { recordType: recordType, createIndex: createIndex };
  document.addEventListener('DOMContentLoaded', boot);
}());
