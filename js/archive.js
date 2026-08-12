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
  function searchable(signal, byId, byTerm) {
    var related = list(signal.relatedTerms).map(function (value) { var relatedSignal = byId[value] || byTerm[normalizeTerm(value)]; return relatedSignal ? relatedSignal.term : value; });
    var confused = Array.isArray(signal.confusedWith) ? signal.confusedWith.map(function (item) { return item.term; }) : [];
    return { term: normalizeTerm(signal.term), related: related.join(' ').toLowerCase(), confused: confused.join(' ').toLowerCase(), meaning: [signal.meaningEn, signal.meaningZh].map(text).join(' ').toLowerCase(), product: [signal.productMeaningEn, signal.productMeaningZh].map(text).join(' ').toLowerCase(), cultural: [signal.culturalContextEn, signal.culturalContextZh].map(text).join(' ').toLowerCase(), metadata: [signal.category, list(signal.platforms).join(' ')].map(text).join(' ').toLowerCase() };
  }
  function richness(signal) { return ['originalMeaningEn', 'productMeaningEn', 'whyProductsUseItEn', 'culturalContextEn', 'useWhen', 'avoidWhen', 'relatedTerms', 'confusedWith'].reduce(function (score, field) { return score + (Array.isArray(signal[field]) ? signal[field].length : text(signal[field]) ? 1 : 0); }, 0); }
  function createIndex(content, bundledRegistry) {
    var signals = content && typeof content.getDictionarySignals === 'function' ? content.getDictionarySignals().slice() : [];
    var byId = {};
    var packs = bundledRegistry && typeof bundledRegistry.getBundledPacks === 'function' ? bundledRegistry.getBundledPacks() : [];
    packs.forEach(function (payload) {
      var packId = payload && payload.pack && payload.pack.id;
      (payload && Array.isArray(payload.signals) ? payload.signals : []).forEach(function (raw) { var normalized = content && typeof content.normalizeSignal === 'function' ? content.normalizeSignal(raw, { sourceType: 'bundled', packId: packId }) : raw; if (normalized && normalized.id) signals.push(normalized); });
    });
    signals = signals.filter(function (signal, index, all) { return signal && signal.id && all.findIndex(function (item) { return item.id === signal.id; }) === index; });
    signals.forEach(function (signal) { byId[signal.id] = signal; });
    var byTerm = {};
    signals.forEach(function (signal) { if (!byTerm[normalizeTerm(signal.term)]) byTerm[normalizeTerm(signal.term)] = signal; });
    var groupsByTerm = {};
    signals.forEach(function (signal) { var key = normalizeTerm(signal.term); if (!groupsByTerm[key]) groupsByTerm[key] = { key: key, variants: [] }; groupsByTerm[key].variants.push(signal); });
    var groups = Object.keys(groupsByTerm).map(function (key) { var group = groupsByTerm[key]; group.variants.sort(function (a, b) { return richness(b) - richness(a); }); group.primary = group.variants[0]; return group; });
    var groupsById = {};
    groups.forEach(function (group) { group.variants.forEach(function (signal) { groupsById[signal.id] = group; }); });
    var searchFields = {};
    signals.forEach(function (signal) { searchFields[signal.id] = searchable(signal, byId, byTerm); });
    return { signals: signals, groups: groups, byId: byId, byTerm: byTerm, groupsById: groupsById, searchFields: searchFields };
  }
  function score(signal, query, index) {
    var fields = index.searchFields[signal.id] || {};
    var term = fields.term;
    if (term === query) return 1000;
    if (term.indexOf(query) === 0) return 800;
    if (term.indexOf(query) !== -1) return 700;
    if (fields.related.indexOf(query) !== -1 || fields.confused.indexOf(query) !== -1) return 500;
    if (fields.meaning.indexOf(query) !== -1) return 400;
    if (fields.product.indexOf(query) !== -1) return 300;
    if (fields.cultural.indexOf(query) !== -1) return 200;
    if (fields.metadata.indexOf(query) !== -1) return 100;
    return 0;
  }
  function search(index, query, category) {
    var needle = normalizeTerm(query);
    var exactGroups = needle ? index.groups.filter(function (group) { return group.variants.some(function (signal) { return normalizeTerm(signal.term) === needle; }) && (!category || category === 'all' || group.variants.some(function (signal) { return signal.category === category; })); }) : [];
    if (exactGroups.length) return exactGroups;
    return index.groups.map(function (group) {
      var candidates = group.variants.map(function (signal) { return score(signal, needle, index); });
      var groupScore = needle ? Math.max.apply(Math, candidates) : 0;
      var matchesCategory = !category || category === 'all' || group.variants.some(function (signal) { return signal.category === category; });
      return { group: group, score: groupScore, matchesCategory: matchesCategory };
    }).filter(function (item) { return item.matchesCategory && (!needle || item.score > 0); }).sort(function (a, b) { return b.score - a.score || a.group.primary.term.localeCompare(b.group.primary.term); }).map(function (item) { return item.group; });
  }
  function renderCard(group) {
    var signal = group.primary;
    var platforms = list(signal.platforms).slice(0, 2);
    var tone = list(signal.tone).slice(0, 2);
    var chips = platforms.concat(tone).map(function (value) { return '<span class="archive-chip">' + escapeHtml(value) + '</span>'; }).join('');
    var variants = group.variants.length > 1 ? '<span class="archive-variant-count">' + group.variants.length + ' RECORDS</span>' : '';
    return '<article class="archive-card"><div class="archive-card-top"><span class="archive-record-type">' + escapeHtml(recordType(signal)) + '</span>' + variants + '</div><h3><a class="archive-link" href="./archive-signal.html?id=' + encodeURIComponent(signal.id) + '">' + escapeHtml(signal.displayTerm || signal.term) + '</a></h3><p class="archive-card-meaning">' + escapeHtml(text(signal.meaningEn) || 'Indexed language signal.') + '</p>' + (text(signal.meaningZh) ? '<p class="archive-card-zh">' + escapeHtml(signal.meaningZh) + '</p>' : '') + (chips ? '<div class="archive-card-chips">' + chips + '</div>' : '') + '</article>';
  }
  function boot() {
    var index = createIndex(window.EnglishRadarContent, window.EnglishRadarBundledPackRegistry);
    var state = { query: '', category: 'all' };
    function current() { return search(index, state.query, state.category); }
    window.EnglishRadarArchive = { index: index, recordType: recordType, normalizeTerm: normalizeTerm, search: function (query, category) { return search(index, query, category); }, searchIndex: search, findSignal: function (id) { return index.byId[id] || null; }, findGroup: function (id) { return index.groupsById[id] || null; }, createIndex: createIndex };
    var cards = document.querySelector('[data-archive-record-grid]');
    var input = document.querySelector('[data-archive-search]');
    var total = document.querySelector('[data-archive-total]');
    var resultCount = document.querySelector('[data-archive-result-count]');
    var status = document.querySelector('[data-archive-status]');
    var categoryCount = document.querySelector('[data-archive-categories]');
    function setText(selector, value) { document.querySelectorAll(selector).forEach(function (element) { element.textContent = value; }); }
    function render() { var result = current(); var hasResultState = Boolean(normalizeTerm(state.query) || state.category !== 'all'); setText('[data-archive-total]', index.groups.length); setText('[data-archive-result-count]', result.length); setText('[data-archive-status]', result.length ? 'INDEX ONLINE' : 'NO MATCHES'); document.querySelectorAll('.archive-result-status').forEach(function (element) { element.classList.toggle('is-visible', hasResultState); }); if (cards) cards.innerHTML = result.length ? result.map(renderCard).join('') : '<div class="archive-empty"><strong>No records found.</strong><p>没有找到匹配记录。</p></div>'; }
    var categories = {}; index.signals.forEach(function (signal) { categories[signal.category] = true; });
    setText('[data-archive-total]', index.groups.length);
    setText('[data-archive-result-count]', index.groups.length);
    setText('[data-archive-categories]', Object.keys(categories).length);
    if (input) input.addEventListener('input', function () { state.query = input.value; render(); });
    document.querySelectorAll('[data-archive-filter]').forEach(function (button) { button.addEventListener('click', function () { var value = button.getAttribute('data-archive-filter'); state.category = value === 'more' ? '' : value; document.querySelectorAll('[data-archive-filter]').forEach(function (item) { item.classList.toggle('is-active', item === button); }); render(); }); });
    render();
  }
  window.EnglishRadarArchive = { recordType: recordType, createIndex: createIndex, normalizeTerm: normalizeTerm, searchIndex: search };
  document.addEventListener('DOMContentLoaded', boot);
}());
