(function () {
  'use strict';
  function text(value) { return typeof value === 'string' ? value.trim() : ''; }
  function list(value) { return Array.isArray(value) ? value.filter(function (item) { return text(item); }) : []; }
  function normalizeTerm(value) { return text(value).toLowerCase().replace(/\s+/g, ' '); }
  function metadata(signal) { return signal && signal.signalIdentity && typeof signal.signalIdentity === 'object' ? signal.signalIdentity : signal && signal.identity && typeof signal.identity === 'object' ? signal.identity : {}; }
  function metadataText(signal) { var meta = metadata(signal); return [meta.signalType, meta.type, meta.usageContext, meta.context, meta.communityContext, meta.productContext, meta.developerContext, meta.platform, meta.relationshipHint, signal && signal.usageContext, signal && signal.communityContext, signal && signal.productContext, signal && signal.developerContext, signal && signal.relationshipHint].map(function (value) { return Array.isArray(value) ? value.join(' ') : value; }).filter(function (value) { return text(value); }).join(' '); }
  function escapeHtml(value) { return String(value == null ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); }
  function escapeRegExp(value) { return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function highlightHtml(value, query) { var safe = escapeHtml(value); var needle = text(query); if (!needle) return safe; var pattern = new RegExp(escapeRegExp(needle), 'ig'); return safe.replace(pattern, '<mark class="archive-search-match">$&</mark>'); }
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
    return { term: normalizeTerm(signal.term), fullForm: normalizeTerm(signal.fullForm), related: related.join(' ').toLowerCase(), confused: confused.join(' ').toLowerCase(), meaning: [signal.meaningEn, signal.meaningZh].map(text).join(' ').toLowerCase(), product: [signal.productMeaningEn, signal.productMeaningZh].map(text).join(' ').toLowerCase(), cultural: [signal.culturalContextEn, signal.culturalContextZh].map(text).join(' ').toLowerCase(), metadata: [signal.category, list(signal.platforms).join(' '), list(signal.tone).join(' '), metadataText(signal)].map(text).join(' ').toLowerCase() };
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
  function categoryMatches(entry, category, progress) {
    if (!category || category === 'all') return true;
    var signal = entry.signal; var value = text(category).toLowerCase(); var actual = text(signal.category).toLowerCase(); var platforms = list(signal.platforms).join(' ').toLowerCase();
    if (value === 'saved') return !!(progress && progress[signal.id] && progress[signal.id].favorite === true);
    if (value === 'internet culture') return actual === 'internet culture' || actual === 'slang';
    if (value === 'developer language') return ['github', 'ai builder', 'developer language'].indexOf(actual) !== -1 || /engineering|developer|open source|version control/.test(platforms);
    if (value === 'product language') return ['product design', 'product naming', 'ui vocabulary', 'product language'].indexOf(actual) !== -1 || /product|design tools|startups/.test(platforms);
    if (value === 'community expression') return ['community discourse', 'community expression'].indexOf(actual) !== -1 || /community|comments|comment|discord|reddit|tiktok|social media|casual chat/.test(platforms);
    return actual === value;
  }
  function search(index, query, category, scope, progress) {
    var groups = scope === 'catalog' ? index.catalogGroups : index.activeGroups;
    var needle = normalizeTerm(query);
    var exact = needle ? groups.filter(function (group) { return group.variants.some(function (entry) { return normalizeTerm(entry.signal.term) === needle; }) && group.variants.some(function (entry) { return categoryMatches(entry, category, progress); }); }) : [];
    if (exact.length) return exact;
    return groups.map(function (group) { var candidates = group.variants.map(function (entry) { return score(entry, needle, index); }); return { group: group, score: needle ? Math.max.apply(Math, candidates) : 0, category: group.variants.some(function (entry) { return categoryMatches(entry, category, progress); }) }; }).filter(function (item) { return item.category && (!needle || item.score > 0); }).sort(function (a, b) { return b.score - a.score || a.group.primary.signal.term.localeCompare(b.group.primary.signal.term); }).map(function (item) { return matchedGroup(item.group, needle, index); });
  }
  function packLabel(entry) { var pack = entry.pack; return pack ? 'AVAILABLE IN ' + (pack.name || 'CONTENT PACK') : 'AVAILABLE CONTENT'; }
  function availabilityHtml(group, scope) {
    var primary = group.primary;
    if (scope !== 'catalog') return '';
    if (primary.status === 'available') return '<span class="archive-availability">' + escapeHtml(packLabel(primary)) + '<small>NOT INSTALLED / 未安装</small></span>';
    var available = group.variants.filter(function (entry) { return entry.status === 'available'; });
    return available.length ? '<span class="archive-availability archive-availability-quiet">ACTIVE<span> + ' + available.length + ' available</span></span>' : '';
  }
  function masteryLabel(signal, progress) { var mastery = progress && progress[signal.id] && progress[signal.id].mastery; return mastery === 'clear' ? 'Clear' : mastery === 'fuzzy' ? 'Familiar' : 'New'; }
  function progressTime(record) { if (!record || typeof record !== 'object') return 0; return ['lastReviewedAt', 'firstLearnedAt'].map(function (key) { var value = new Date(record[key] || 0).getTime(); return isNaN(value) ? 0 : value; }).reduce(function (latest, value) { return Math.max(latest, value); }, 0); }
  function getMasteryGroups(index, progress) {
    var groupsById = {}; index.activeGroups.forEach(function (group) { group.variants.forEach(function (entry) { groupsById[entry.signal.id] = group; }); }); var signals = index.activeSignals.filter(function (signal) { return progress && progress[signal.id]; });
    return { recent: signals.slice().sort(function (a, b) { return progressTime(progress[b.id]) - progressTime(progress[a.id]); }).filter(function (signal) { return progressTime(progress[signal.id]) > 0; }).slice(0, 3), fuzzy: signals.filter(function (signal) { return progress[signal.id].mastery === 'fuzzy'; }).slice(0, 3), clear: signals.filter(function (signal) { return progress[signal.id].mastery === 'clear'; }).slice(0, 3), groupsById: groupsById };
  }
  function getOverview(index, progress) { var ids = index.activeSignals.map(function (signal) { return signal.id; }); return { total: index.activeGroups.length, saved: ids.filter(function (id) { return progress && progress[id] && progress[id].favorite === true; }).length, clear: ids.filter(function (id) { return progress && progress[id] && progress[id].mastery === 'clear'; }).length }; }
  function renderCard(group, scope, progress, query) {
    var entry = group.primary; var displayEntry = group.matchedPrimary || entry; var signal = displayEntry.signal; var chips = list(signal.platforms).slice(0, 2).concat(list(signal.tone).slice(0, 2)).map(function (value) { return '<span class="archive-chip">' + highlightHtml(value, query) + '</span>'; }).join('');
    var variants = group.variants.length > 1 ? '<span class="archive-variant-count">' + group.variants.length + ' RECORDS</span>' : '';
    var fullFormHtml = text(signal.fullForm) ? '<p class="archive-card-full-form">FULL FORM · ' + escapeHtml(signal.fullForm) + '</p>' : '';
    var meta = metadata(signal); var context = text(meta.usageContext || meta.context || signal.usageContext || meta.relationshipHint || signal.relationshipHint); var contextHtml = context ? '<p class="archive-card-context">' + highlightHtml(context, query) + '</p>' : ''; var mastery = masteryLabel(signal, progress); var displayName = signal.displayTerm || signal.term; var meaning = text(signal.meaningEn) || 'Indexed language signal.';
    return '<article class="archive-card ' + (entry.status === 'available' ? 'is-available' : '') + '"><div class="archive-card-top"><span class="archive-record-type">' + escapeHtml(recordType(signal)) + '</span>' + variants + '</div><h3><a class="archive-link" href="./archive-signal.html?id=' + encodeURIComponent(signal.id) + '">' + highlightHtml(displayName, query) + '</a></h3><p class="archive-card-category">' + highlightHtml(signal.category || 'Internet context', query) + '</p>' + fullFormHtml + availabilityHtml(group, scope) + '<p class="archive-card-meaning">' + highlightHtml(meaning, query) + '</p>' + contextHtml + (text(signal.meaningZh) ? '<p class="archive-card-zh">' + escapeHtml(signal.meaningZh) + '</p>' : '') + (chips ? '<div class="archive-card-chips">' + chips + '</div>' : '') + '<div class="archive-card-footer"><span class="archive-mastery">STATUS: ' + escapeHtml(mastery) + '</span><a class="archive-open-link" href="./archive-signal.html?id=' + encodeURIComponent(signal.id) + '">Open Signal →</a></div></article>';
  }
  function boot() {
    var index = createIndex(window.EnglishRadarContent, window.EnglishRadarBundledPackRegistry); var progress = window.EnglishRadarStorage && typeof window.EnglishRadarStorage.getProgress === 'function' ? window.EnglishRadarStorage.getProgress() : {}; var state = { query: '', category: 'all', scope: 'my' }; var cards = document.querySelector('[data-archive-record-grid]'); var input = document.querySelector('[data-archive-search]');
    window.EnglishRadarArchive = { index: index, recordType: recordType, normalizeTerm: normalizeTerm, search: function (query, category, scope) { return search(index, query, category, scope || state.scope, progress); }, searchIndex: search, findSignal: function (id) { return index.byId[id] || index.catalogEntries.find(function (entry) { return entry.signal.id === id; }) || null; }, findGroup: function (id, scope) { var groups = scope === 'catalog' ? index.catalogGroups : index.activeGroups; var found = groups.find(function (group) { return group.variants.some(function (entry) { return entry.signal.id === id; }); }); if (!found && scope !== 'catalog') found = index.catalogGroups.find(function (group) { return group.variants.some(function (entry) { return entry.signal.id === id; }); }); return found || null; }, createIndex: createIndex };
    function setText(selector, value) { document.querySelectorAll(selector).forEach(function (element) { element.textContent = value; }); }
    function current() { return search(index, state.query, state.category, state.scope, progress); }
    function emptyHtml() { if (state.query) return '<div class="archive-empty"><strong>No matching signals found.</strong><p>Try another term or context keyword.</p></div>'; if (state.category === 'saved') return '<div class="archive-empty"><strong>No signals here yet.</strong><p>Your context library starts from the first signal you save.</p></div>'; if (state.category !== 'all') return '<div class="archive-empty"><strong>No signals in this category yet.</strong><p>Your context library starts from the first signal you notice.</p></div>'; return '<div class="archive-empty"><strong>No signals here yet.</strong><p>Your context library starts from the first signal you notice.</p></div>'; }
    function renderMasterySections() { var groups = getMasteryGroups(index, progress); var messages = { recent: ['No signals here yet.', 'Your context library starts from the first signal you notice.'], fuzzy: ['Nothing is fuzzy right now.', 'Signals marked Familiar will appear here.'], clear: ['No clear signals yet.', 'Keep returning to the signals that matter.'] }; ['recent', 'fuzzy', 'clear'].forEach(function (key) { var target = document.querySelector('[data-archive-mastery="' + key + '"]'); if (!target) return; var signals = groups[key]; target.innerHTML = signals.length ? signals.map(function (signal) { return renderCard(groups.groupsById[signal.id], 'my', progress, ''); }).join('') : '<div class="archive-section-empty"><strong>' + messages[key][0] + '</strong><p>' + messages[key][1] + '</p></div>'; }); }
    function render() { var result = current(); var groups = state.scope === 'catalog' ? index.catalogGroups : index.activeGroups; var overview = getOverview(index, progress); var hasResultState = Boolean(normalizeTerm(state.query) || state.category !== 'all'); setText('[data-archive-total]', groups.length); setText('[data-archive-result-count]', result.length); setText('[data-archive-status]', result.length ? 'INDEX ONLINE' : 'NO MATCHES'); setText('[data-archive-overview-total]', overview.total); setText('[data-archive-overview-saved]', overview.saved); setText('[data-archive-overview-clear]', overview.clear); setText('[data-archive-scope-label]', state.scope === 'catalog' ? '全部档案' : '我的档案'); document.querySelectorAll('.archive-result-status').forEach(function (element) { element.classList.toggle('is-visible', hasResultState); }); document.querySelectorAll('[data-archive-scope]').forEach(function (button) { button.classList.toggle('is-active', button.getAttribute('data-archive-scope') === state.scope); }); if (cards) cards.innerHTML = result.length ? result.map(function (group) { return renderCard(group, state.scope, progress, state.query); }).join('') : emptyHtml(); renderMasterySections(); }
    var categories = {}; index.catalogSignals.forEach(function (signal) { categories[signal.category] = true; }); setText('[data-archive-categories]', Object.keys(categories).length); setText('[data-archive-total]', index.activeGroups.length); setText('[data-archive-result-count]', index.activeGroups.length);
    if (input) input.addEventListener('input', function () { state.query = input.value; render(); });
    document.querySelectorAll('[data-archive-scope]').forEach(function (button) { button.addEventListener('click', function () { state.scope = button.getAttribute('data-archive-scope'); state.query = ''; if (input) input.value = ''; state.category = 'all'; render(); }); });
    document.querySelectorAll('[data-archive-filter]').forEach(function (button) { button.addEventListener('click', function () { var value = button.getAttribute('data-archive-filter'); state.category = value === 'more' ? '' : value; document.querySelectorAll('[data-archive-filter]').forEach(function (item) { item.classList.toggle('is-active', item === button); }); render(); }); });
    render();
  }
  window.EnglishRadarArchive = { recordType: recordType, createIndex: createIndex, normalizeTerm: normalizeTerm, searchIndex: search, categoryMatches: categoryMatches, masteryLabel: masteryLabel, getOverview: getOverview, getMasteryGroups: getMasteryGroups, highlightHtml: highlightHtml };
  document.addEventListener('DOMContentLoaded', boot);
}());
