(function () {
  'use strict';

  var core = Array.isArray(window.ENGLISH_RADAR_SIGNALS) ? window.ENGLISH_RADAR_SIGNALS : [];
  var storage = window.EnglishRadarStorage;
  var required = ['id', 'term', 'category', 'meaningZh', 'exampleEn'];
  var cache = null;

  function normalizeTerm(value) { return String(value === undefined || value === null ? '' : value).trim().toLowerCase().replace(/\s+/g, ' '); }
  function slug(value) { return normalizeTerm(value).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-+/g, '-'); }
  function stringArray(value) { return Array.isArray(value) ? value.filter(function (item) { return typeof item === 'string' && item.trim(); }).map(function (item) { return item.trim(); }) : []; }
  function objectArray(value, fields) { return Array.isArray(value) ? value.filter(function (item) { return item && typeof item === 'object' && !Array.isArray(item); }).map(function (item) { var result = {}; fields.forEach(function (field) { if (typeof item[field] === 'string' && item[field].trim()) result[field] = item[field].trim(); }); return result; }).filter(function (item) { return Object.keys(item).length; }) : []; }
  function normalizeInterfaceFields(raw) { return { radarType: typeof raw.radarType === 'string' ? raw.radarType.trim().toLowerCase() : '', uiArea: stringArray(raw.uiArea), originalMeaningEn: String(raw.originalMeaningEn || '').trim(), originalMeaningZh: String(raw.originalMeaningZh || '').trim(), productMeaningEn: String(raw.productMeaningEn || '').trim(), productMeaningZh: String(raw.productMeaningZh || '').trim(), whyProductsUseItEn: String(raw.whyProductsUseItEn || '').trim(), whyProductsUseItZh: String(raw.whyProductsUseItZh || '').trim(), commonInterfaces: stringArray(raw.commonInterfaces), realInterfaceExamples: objectArray(raw.realInterfaceExamples, ['surface', 'exampleEn', 'exampleZh']), relatedTerms: stringArray(raw.relatedTerms), confusedWith: objectArray(raw.confusedWith, ['term', 'differenceEn', 'differenceZh']), interfaceTargets: objectArray(raw.interfaceTargets, ['page', 'area', 'label']), usageBoundaryEn: String(raw.usageBoundaryEn || '').trim(), usageBoundaryZh: String(raw.usageBoundaryZh || '').trim() }; }
  function validateSignal(signal) { return !!signal && required.every(function (field) { return typeof signal[field] === 'string' && signal[field].trim(); }) && (!signal.contentStatus || ['active', 'archived'].indexOf(signal.contentStatus) !== -1) && (!signal.quizStatus || ['none', 'draft', 'ready'].indexOf(signal.quizStatus) !== -1); }
  function normalizeSignal(raw, context) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    var source = context || {}; var term = normalizeTerm(raw.term); if (!term || !String(raw.category || '').trim() || !String(raw.meaningZh || '').trim() || !String(raw.exampleEn || '').trim()) return null;
    var id = String(raw.id || '').trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '') || 'imported-' + slug(raw.category) + '-' + slug(term); var now = new Date().toISOString();
    var result = Object.assign({}, raw, { id: id, term: term, displayTerm: String(raw.displayTerm || term.toUpperCase()), speechText: String(raw.speechText || term), pronunciation: String(raw.pronunciation || '—'), category: String(raw.category).trim(), platforms: Array.isArray(raw.platforms) ? raw.platforms.slice() : [], tone: Array.isArray(raw.tone) ? raw.tone.slice() : [], status: String(raw.status || 'Imported'), formality: String(raw.formality || '—'), meaningEn: String(raw.meaningEn || '—'), meaningZh: String(raw.meaningZh).trim(), exampleEn: String(raw.exampleEn).trim(), exampleZh: String(raw.exampleZh || '—'), useWhen: String(raw.useWhen || '—'), avoidWhen: String(raw.avoidWhen || '—'), chineseFeeling: String(raw.chineseFeeling || '—'), contentStatus: ['active', 'archived'].indexOf(raw.contentStatus) !== -1 ? raw.contentStatus : 'active', quizStatus: ['none', 'draft', 'ready'].indexOf(raw.quizStatus) !== -1 ? raw.quizStatus : 'none', sourceType: source.sourceType || 'imported', sourcePackId: source.packId || raw.sourcePackId || '', createdAt: raw.createdAt || now, updatedAt: now }, normalizeInterfaceFields(raw));
    return validateSignal(result) ? result : null;
  }
  function uniqueSignals(list) { var seen = {}; return list.filter(function (signal) { if (!signal || !signal.id || seen[signal.id]) return false; seen[signal.id] = true; return true; }); }
  function readPersonalSignals() { var items = storage ? storage.getInbox() : []; return items.filter(function (item) { return item && item.status === 'decoded' && item.decodedSignal && item.decodedSignal.id; }).map(function (item) { return Object.assign({}, item.decodedSignal, { sourceType: 'personal', sourceInboxId: item.id }); }); }
  function buildCache() {
    if (cache) return cache;
    var debug = window.EnglishRadarPerformanceDebug;
    var measure = function (name, callback) { return debug ? debug.measure(name, callback) : callback(); };
    var coreSignals = measure('registry.coreCopy', function () { return core.map(function (signal) { return Object.assign({}, signal, { sourceType: 'core' }); }); });
    var coreIds = {}; core.forEach(function (signal) { coreIds[signal.id] = true; });
    var saved = storage ? storage.getCustomSignals() : { signals: {} };
    var importedSignals = measure('registry.importedValidationFilter', function () { return Object.keys(saved.signals || {}).map(function (id) { return saved.signals[id]; }).filter(function (signal) { return validateSignal(signal) && signal.contentStatus === 'active' && !coreIds[signal.id]; }).map(function (signal) { return Object.assign({}, signal); }); });
    var personalSignals = readPersonalSignals(); var activeSignals; var dictionarySignals; var signalMap = {}; var sourceMap = {};
    var activeBuild = measure('registry.activeConcatDedupe', function () { var active = uniqueSignals(coreSignals.concat(importedSignals)); return { active: active, dictionary: uniqueSignals(active.concat(personalSignals)) }; });
    activeSignals = activeBuild.active; dictionarySignals = activeBuild.dictionary;
    measure('registry.signalMaps', function () { coreSignals.concat(importedSignals, personalSignals).forEach(function (signal) { if (!signalMap[signal.id]) signalMap[signal.id] = signal; if (!sourceMap[signal.id]) sourceMap[signal.id] = signal.sourceType || 'core'; }); });
    cache = { core: coreSignals, imported: importedSignals, personal: personalSignals, active: activeSignals, dictionary: dictionarySignals, signalMap: signalMap, sourceMap: sourceMap };
    return cache;
  }
  function invalidate() { cache = null; }
  function getSignalById(id, options) { var opts = options || {}; var data = buildCache(); if (opts.personal) return data.personal.find(function (signal) { return signal.id === id; }) || null; if (opts.dictionary) return data.dictionary.find(function (signal) { return signal.id === id; }) || null; return data.signalMap[id] && data.active.some(function (signal) { return signal.id === id; }) ? data.signalMap[id] : null; }
  function findPotentialDuplicates(signal, existing) { var term = normalizeTerm(signal.term); var category = normalizeTerm(signal.category); return (existing || []).filter(function (item) { return item.id === signal.id || (normalizeTerm(item.term) === term && normalizeTerm(item.category) === category) || normalizeTerm(item.term) === term; }).map(function (item) { return { signal: item, exact: item.id === signal.id || (normalizeTerm(item.term) === term && normalizeTerm(item.category) === category) }; }); }
  window.EnglishRadarContent = { getCoreSignals: function () { return buildCache().core; }, getImportedSignals: function () { return buildCache().imported; }, getPersonalSignals: function () { return buildCache().personal; }, getActiveLearningSignals: function () { return buildCache().active; }, getDictionarySignals: function () { return buildCache().dictionary; }, getSignalById: getSignalById, getSignalSource: function (id) { return buildCache().sourceMap[id] || null; }, normalizeSignal: normalizeSignal, validateSignal: validateSignal, normalizeTerm: normalizeTerm, findPotentialDuplicates: findPotentialDuplicates, invalidate: invalidate };
}());
