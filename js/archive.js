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
  function richness(signal) { return ['originalMeaningEn', 'productMeaningEn', 'whyProductsUseItEn', 'culturalContextEn', 'useWhen', 'avoidWhen', 'relatedTerms', 'confusedWith'].reduce(function (score, field) { return score + (Array.isArray(signal[field]) ? signal[field].length : text(signal[field]) ? 1 : 0); }, 0); }
  function groupEntries(entries) {
    var grouped = {};
    entries.forEach(function (entry) { var key = normalizeTerm(entry.signal.term); if (!grouped[key]) grouped[key] = { key: key, variants: [] }; grouped[key].variants.push(entry); });
    return Object.keys(grouped).map(function (key) { var group = grouped[key]; group.activeVariants = group.variants.filter(function (entry) { return entry.status === 'active'; }); group.primary = (group.activeVariants.length ? group.activeVariants : group.variants).slice().sort(function (a, b) { return richness(b.signal) - richness(a.signal); })[0]; return group; });
  }
  function createIndex(content, bundledRegistry) {
    var activeSignals = content && typeof content.getDictionarySignals === 'function' ? content.getDictionarySignals().slice() : [];
    var activeById = {}; activeSignals.forEach(function (signal) { activeById[signal.id] = signal; });
    var packs = bundledRegistry && typeof bundledRegistry.getBundledPacks === 'function' ? bundledRegistry.getBundledPacks() : [];
    var packsById = {}; packs.forEach(function (payload) { if (payload && payload.pack && payload.pack.id) packsById[payload.pack.id] = payload.pack; });
    var activeEntries = activeSignals.map(function (signal) { return { signal: signal, status: 'active', pack: packsById[signal.sourcePackId] || null }; });
    var catalogEntries = activeEntries.slice();
    packs.forEach(function (payload) {
      var pack = payload && payload.pack;
      (payload && Array.isArray(payload.signals) ? payload.signals : []).forEach(function (raw) {
        var normalized = content && typeof content.normalizeSignal === 'function' ? content.normalizeSignal(raw, { sourceType: 'bundled', packId: pack && pack.id }) : raw;
        if (!normalized || !normalized.id || activeById[normalized.id]) return;
        catalogEntries.push({ signal: normalized, status: 'available', pack: pack || null });
      });
    });
    var activeGroups = groupEntries(activeEntries);
    var catalogGroups = groupEntries(catalogEntries);
    var byId = {}; catalogEntries.forEach(function (entry) { if (!byId[entry.signal.id] || entry.status === 'active') byId[entry.signal.id] = entry; });
    var groupsById = {}; catalogGroups.forEach(function (group) { group.variants.forEach(function (entry) { groupsById[entry.signal.id] = group; }); });
    return { activeSignals: activeSignals, catalogSignals: catalogEntries.map(function (entry) { return entry.signal; }), activeEntries: activeEntries, catalogEntries: catalogEntries, activeGroups: activeGroups, catalogGroups: catalogGroups, groups: catalogGroups, signals: catalogEntries.map(function (entry) { return entry.signal; }), byId: byId, groupsById: groupsById, packsById: packsById };
  }
  function searchable(entry, index) {
    var signal = entry.signal;
    var related = list(signal.relatedTerms).map(function (value) { var relatedEntry = index.byId[value] || index.catalogEntries.find(function (item) { return normalizeTerm(item.signal.term) === normalizeTerm(value); }); return relatedEntry ? relatedEntry.signal.term : value; });
    var confused = Array.isArray(signal.confusedWith) ? signal.confusedWith.map(function (item) { return item.term; }) : [];
    return { term: normalizeTerm(signal.term), fullForm: normalizeTerm(signal.fullForm), related: related.join(' ').toLowerCase(), confused: confused.join(' ').toLowerCase(), meaning: [signal.meaningEn, signal.meaningZh].map(text).join(' ').toLowerCase(), product: [signal.productMeaningEn, signal.productMeaningZh].map(text).join(' ').toLowerCase(), cultural: [signal.culturalContextEn, signal.culturalContextZh].map(text).join(' ').toLowerCase(), metadata: [signal.category, list(signal.platforms).join(' ')].map(text).join(' ').toLowerCase() };
  }
  function score(entry, query, index) {
    var fields = searchable(entry, index); if (fields.term === query) return 1000; if (fields.term.indexOf(query) === 0) return 800; if (fields.term.indexOf(query) !== -1) return 700; if (fields.fullForm.indexOf(query) !== -1) return 650; if (fields.related.indexOf(query) !== -1 || fields.confused.indexOf(query) !== -1) return 500; if (fields.meaning.indexOf(query) !== -1) return 400; if (fields.product.indexOf(query) !== -1) return 300; if (fields.cultural.indexOf(query) !== -1) return 200; if (fields.metadata.indexOf(query) !== -1) return 100; return 0;
  }
  function matchedGroup(group, query, index) {
    if (!query) return group;
    var bestEntry = group.variants[0]; var bestScore = score(bestEntry, query, index);
    group.variants.slice(1).forEach(function (entry) { var entryScore = score(entry, query, index); if (entryScore > bestScore) { bestEntry = entry; bestScore = entryScore; } });
    return bestEntry && bestScore > 0 ? Object.assign({}, group, { matchedPrimary: bestEntry }) : group;
  }
  function search(index, query, category, scope) {
    var groups = scope === 'catalog' ? index.catalogGroups : index.activeGroups;
    var needle = normalizeTerm(query);
    var exact = needle ? groups.filter(function (group) { return group.variants.some(function (entry) { return normalizeTerm(entry.signal.term) === needle; }) && (!category || category === 'all' || group.variants.some(function (entry) { return entry.signal.category === category; })); }) : [];
    if (exact.length) return exact;
    return groups.map(function (group) { var candidates = group.variants.map(function (entry) { return score(entry, needle, index); }); return { group: group, score: needle ? Math.max.apply(Math, candidates) : 0, category: !category || category === 'all' || group.variants.some(function (entry) { return entry.signal.category === category; }) }; }).filter(function (item) { return item.category && (!needle || item.score > 0); }).sort(function (a, b) { return b.score - a.score || a.group.primary.signal.term.localeCompare(b.group.primary.signal.term); }).map(function (item) { return matchedGroup(item.group, needle, index); });
  }
  function packLabel(entry) { var pack = entry.pack; return pack ? 'AVAILABLE IN ' + (pack.name || 'CONTENT PACK') : 'AVAILABLE CONTENT'; }
  function availabilityHtml(group, scope) {
    var primary = group.primary;
    if (scope !== 'catalog') return '';
    if (primary.status === 'available') return '<span class="archive-availability">' + escapeHtml(packLabel(primary)) + '<small>NOT INSTALLED / 未安装</small></span>';
    var available = group.variants.filter(function (entry) { return entry.status === 'available'; });
    return available.length ? '<span class="archive-availability archive-availability-quiet">ACTIVE<span> + ' + available.length + ' available</span></span>' : '';
  }
  function renderCard(group, scope) {
    var entry = group.primary; var displayEntry = group.matchedPrimary || entry; var signal = displayEntry.signal; var chips = list(signal.platforms).slice(0, 2).concat(list(signal.tone).slice(0, 2)).map(function (value) { return '<span class="archive-chip">' + escapeHtml(value) + '</span>'; }).join('');
    var variants = group.variants.length > 1 ? '<span class="archive-variant-count">' + group.variants.length + ' RECORDS</span>' : '';
    var fullFormHtml = text(signal.fullForm) ? '<p class="archive-card-full-form">FULL FORM · ' + escapeHtml(signal.fullForm) + '</p>' : '';
    return '<article class="archive-card ' + (entry.status === 'available' ? 'is-available' : '') + '"><div class="archive-card-top"><span class="archive-record-type">' + escapeHtml(recordType(signal)) + '</span>' + variants + '</div><h3><a class="archive-link" href="./archive-signal.html?id=' + encodeURIComponent(signal.id) + '">' + escapeHtml(signal.displayTerm || signal.term) + '</a></h3>' + fullFormHtml + availabilityHtml(group, scope) + '<p class="archive-card-meaning">' + escapeHtml(text(signal.meaningEn) || 'Indexed language signal.') + '</p>' + (text(signal.meaningZh) ? '<p class="archive-card-zh">' + escapeHtml(signal.meaningZh) + '</p>' : '') + (chips ? '<div class="archive-card-chips">' + chips + '</div>' : '') + '</article>';
  }
  function boot() {
    var index = createIndex(window.EnglishRadarContent, window.EnglishRadarBundledPackRegistry); var state = { query: '', category: 'all', scope: 'my' }; var cards = document.querySelector('[data-archive-record-grid]'); var input = document.querySelector('[data-archive-search]');
    window.EnglishRadarArchive = { index: index, recordType: recordType, normalizeTerm: normalizeTerm, search: function (query, category, scope) { return search(index, query, category, scope || state.scope); }, searchIndex: search, findSignal: function (id) { return index.byId[id] || index.catalogEntries.find(function (entry) { return entry.signal.id === id; }) || null; }, findGroup: function (id, scope) { var groups = scope === 'catalog' ? index.catalogGroups : index.activeGroups; var found = groups.find(function (group) { return group.variants.some(function (entry) { return entry.signal.id === id; }); }); if (!found && scope !== 'catalog') found = index.catalogGroups.find(function (group) { return group.variants.some(function (entry) { return entry.signal.id === id; }); }); return found || null; }, createIndex: createIndex };
    function setText(selector, value) { document.querySelectorAll(selector).forEach(function (element) { element.textContent = value; }); }
    function current() { return search(index, state.query, state.category, state.scope); }
    function render() { var result = current(); var groups = state.scope === 'catalog' ? index.catalogGroups : index.activeGroups; var hasResultState = Boolean(normalizeTerm(state.query) || state.category !== 'all'); setText('[data-archive-total]', groups.length); setText('[data-archive-result-count]', result.length); setText('[data-archive-status]', result.length ? 'INDEX ONLINE' : 'NO MATCHES'); setText('[data-archive-scope-label]', state.scope === 'catalog' ? '全部档案' : '我的档案'); document.querySelectorAll('.archive-result-status').forEach(function (element) { element.classList.toggle('is-visible', hasResultState); }); document.querySelectorAll('[data-archive-scope]').forEach(function (button) { button.classList.toggle('is-active', button.getAttribute('data-archive-scope') === state.scope); }); if (cards) cards.innerHTML = result.length ? result.map(function (group) { return renderCard(group, state.scope); }).join('') : '<div class="archive-empty"><strong>No records found.</strong><p>没有找到匹配记录。</p></div>'; }
    var categories = {}; index.catalogSignals.forEach(function (signal) { categories[signal.category] = true; }); setText('[data-archive-categories]', Object.keys(categories).length); setText('[data-archive-total]', index.activeGroups.length); setText('[data-archive-result-count]', index.activeGroups.length);
    if (input) input.addEventListener('input', function () { state.query = input.value; render(); });
    document.querySelectorAll('[data-archive-scope]').forEach(function (button) { button.addEventListener('click', function () { state.scope = button.getAttribute('data-archive-scope'); state.query = ''; if (input) input.value = ''; state.category = 'all'; render(); }); });
    document.querySelectorAll('[data-archive-filter]').forEach(function (button) { button.addEventListener('click', function () { var value = button.getAttribute('data-archive-filter'); state.category = value === 'more' ? '' : value; document.querySelectorAll('[data-archive-filter]').forEach(function (item) { item.classList.toggle('is-active', item === button); }); render(); }); });
    render();
  }
  window.EnglishRadarArchive = { recordType: recordType, createIndex: createIndex, normalizeTerm: normalizeTerm, searchIndex: search };
  document.addEventListener('DOMContentLoaded', boot);
}());
