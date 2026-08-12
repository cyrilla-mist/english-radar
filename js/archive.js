(function () {
  'use strict';
  function text(value) { return typeof value === 'string' ? value.trim() : ''; }
  function list(value) { return Array.isArray(value) ? value.filter(function (item) { return text(item); }) : []; }
  function normalizeTerm(value) { return text(value).toLowerCase().replace(/\s+/g, ' '); }
  function escapeHtml(value) { return String(value == null ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); }
  function recordType(signal) {
    var category = text(signal && signal.category).toLowerCase();
    if (category === 'community discourse') return 'COMMUNITY SIGNAL';
    if (category === 'product naming') return 'PRODUCT LEXICON';
    if (category === 'ai builder' || category.indexOf('ai') !== -1) return 'BUILDER LOG';
    if (category === 'ui vocabulary' || signal && signal.radarType === 'interface') return 'INTERFACE RECORD';
    if (category === 'internet culture' || category === 'slang') return 'NETWORK ARTIFACT';
    return 'LANGUAGE SIGNAL';
  }
  function searchable(signal) { return [signal.term, signal.meaningEn, signal.meaningZh, signal.category, list(signal.platforms).join(' '), list(signal.relatedTerms).join(' '), signal.culturalContextEn, signal.culturalContextZh, signal.productMeaningEn, signal.productMeaningZh].map(text).join(' ').toLowerCase(); }
  function richness(signal) { return ['originalMeaningEn', 'productMeaningEn', 'whyProductsUseItEn', 'culturalContextEn', 'useWhen', 'avoidWhen', 'relatedTerms', 'confusedWith'].reduce(function (score, field) { return score + (Array.isArray(signal[field]) ? signal[field].length : text(signal[field]) ? 1 : 0); }, 0); }
  function createIndex(content, bundledRegistry) {
    var signals = content && typeof content.getDictionarySignals === 'function' ? content.getDictionarySignals().slice() : [];
    var byId = {};
    var packs = bundledRegistry && typeof bundledRegistry.getBundledPacks === 'function' ? bundledRegistry.getBundledPacks() : [];
    packs.forEach(function (payload) {
      var packId = payload && payload.pack && payload.pack.id;
      (payload && Array.isArray(payload.signals) ? payload.signals : []).forEach(function (raw) {
        var normalized = content && typeof content.normalizeSignal === 'function' ? content.normalizeSignal(raw, { sourceType: 'bundled', packId: packId }) : raw;
        if (normalized && normalized.id) signals.push(normalized);
      });
    });
    signals = signals.filter(function (signal, index, all) { return signal && signal.id && all.findIndex(function (item) { return item.id === signal.id; }) === index; });
    signals.forEach(function (signal) { byId[signal.id] = signal; });
    var groupsByTerm = {};
    signals.forEach(function (signal) { var key = normalizeTerm(signal.term); if (!groupsByTerm[key]) groupsByTerm[key] = { key: key, variants: [] }; groupsByTerm[key].variants.push(signal); });
    var groups = Object.keys(groupsByTerm).map(function (key) { var group = groupsByTerm[key]; group.variants.sort(function (a, b) { return richness(b) - richness(a); }); group.primary = group.variants[0]; return group; });
    var groupsById = {};
    groups.forEach(function (group) { group.variants.forEach(function (signal) { groupsById[signal.id] = group; }); });
    return { signals: signals, groups: groups, byId: byId, groupsById: groupsById };
  }
  function search(index, query, category) {
    var needle = text(query).toLowerCase();
    return index.groups.filter(function (group) { return (!category || category === 'all' || group.variants.some(function (signal) { return signal.category === category; })) && (!needle || group.variants.some(function (signal) { return searchable(signal).indexOf(needle) !== -1; })); });
  }
  function renderCard(group) {
    var signal = group.primary;
    var context = list(signal.platforms).slice(0, 2).join(' / ') || text(signal.category) || 'general internet';
    var tone = list(signal.tone).slice(0, 2).join(' / ') || 'unmarked';
    var variants = group.variants.length > 1 ? '<span class="archive-variant-count">' + group.variants.length + ' RECORDS</span>' : '';
    return '<article class="archive-card"><div class="archive-card-top"><span class="archive-record-type">' + escapeHtml(recordType(signal)) + '</span>' + variants + '</div><h3><a class="archive-link" href="./archive-signal.html?id=' + encodeURIComponent(signal.id) + '">' + escapeHtml(signal.displayTerm || signal.term) + '</a></h3><p class="archive-card-meaning">' + escapeHtml(text(signal.meaningEn) || 'Indexed language signal.') + '</p>' + (text(signal.meaningZh) ? '<p class="archive-card-zh">' + escapeHtml(signal.meaningZh) + '</p>' : '') + '<div class="archive-card-footer"><span class="archive-meta">' + escapeHtml(context) + '</span><span class="archive-meta">' + escapeHtml(tone) + '</span></div></article>';
  }
  function boot() {
    var index = createIndex(window.EnglishRadarContent, window.EnglishRadarBundledPackRegistry);
    var state = { query: '', category: 'all' };
    function current() { return search(index, state.query, state.category); }
    window.EnglishRadarArchive = { index: index, recordType: recordType, normalizeTerm: normalizeTerm, search: function (query, category) { return search(index, query, category); }, findSignal: function (id) { return index.byId[id] || null; }, findGroup: function (id) { return index.groupsById[id] || null; }, createIndex: createIndex };
    var cards = document.querySelector('[data-archive-record-grid]');
    var input = document.querySelector('[data-archive-search]');
    var count = document.querySelector('[data-archive-count]');
    var status = document.querySelector('[data-archive-status]');
    var categoryCount = document.querySelector('[data-archive-categories]');
    function render() { var result = current(); if (count) count.textContent = result.length; if (status) status.textContent = result.length ? 'INDEX ONLINE' : 'NO MATCHES'; if (cards) cards.innerHTML = result.length ? result.map(renderCard).join('') : '<div class="archive-empty"><strong>No records found.</strong><p>没有找到匹配记录。</p></div>'; }
    var categories = {}; index.signals.forEach(function (signal) { categories[signal.category] = true; });
    if (categoryCount) categoryCount.textContent = Object.keys(categories).length;
    if (input) input.addEventListener('input', function () { state.query = input.value; render(); });
    document.querySelectorAll('[data-archive-filter]').forEach(function (button) { button.addEventListener('click', function () { var value = button.getAttribute('data-archive-filter'); state.category = value === 'more' ? '' : value; document.querySelectorAll('[data-archive-filter]').forEach(function (item) { item.classList.toggle('is-active', item === button); }); render(); }); });
    render();
  }
  window.EnglishRadarArchive = { recordType: recordType, createIndex: createIndex, normalizeTerm: normalizeTerm };
  document.addEventListener('DOMContentLoaded', boot);
}());
