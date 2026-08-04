(function () {
  'use strict';

  var storage = window.EnglishRadarStorage;
  var registry = window.EnglishRadarContent;
  var dateTools = window.EnglishRadarDate;
  var config = window.ENGLISH_RADAR_SYNC_CONFIG || { enabled: false, workerBaseUrl: '', adminToken: '' };
  var MAX_RECORDS = 500;

  function localDateKey(value) { return dateTools && dateTools.localDateKey ? dateTools.localDateKey(value) : new Date(value === undefined ? Date.now() : value).toLocaleDateString('en-CA'); }

  function settings() { var defaults = { enabled: config.enabled === true, workerBaseUrl: typeof config.workerBaseUrl === 'string' ? config.workerBaseUrl : '', adminToken: typeof config.adminToken === 'string' ? config.adminToken : '', lastSyncAt: null, lastSuccessfulBatchId: null, version: 1 }; var saved = storage && storage.getSyncSettings ? storage.getSyncSettings() : {}; return Object.assign(defaults, saved || {}); }
  function cleanBaseUrl(value) { return typeof value === 'string' ? value.trim().replace(/\/$/, '') : ''; }
  function validWorkerUrl(value) { try { var url = new URL(cleanBaseUrl(value)); return url.protocol === 'https:' || url.hostname === 'localhost' || url.hostname === '127.0.0.1'; } catch (error) { return false; } }
  function getSyncSettings() { return settings(); }
  function saveSyncSettings(value) { if (!storage || !storage.saveSyncSettings) return false; var current = settings(); var next = Object.assign({}, current, value || {}, { workerBaseUrl: cleanBaseUrl(value && value.workerBaseUrl !== undefined ? value.workerBaseUrl : current.workerBaseUrl) }); if (value && value.adminToken === '' && current.adminToken) next.adminToken = current.adminToken; return storage.saveSyncSettings(next); }
  function getLastSyncAt() { return settings().lastSyncAt || null; }
  function createSyncBatchId() { return 'notion-sync-' + new Date().toISOString().replace(/[:.]/g, '-').replace(/Z$/, '') + '-' + Math.random().toString(36).slice(2, 8); }
  function resultError(message, status) { return { ok: false, error: message, status: status || 0 }; }
  function endpoint(path) { var base = cleanBaseUrl(settings().workerBaseUrl); return base ? base + path : ''; }

  async function requestJson(url, options) {
    var opts = options || {}; var controller = typeof AbortController !== 'undefined' ? new AbortController() : null; var timer = null; var aborted = false;
    if (controller) { if (opts.signal) { if (opts.signal.aborted) controller.abort(); else opts.signal.addEventListener('abort', function () { controller.abort(); }, { once: true }); } timer = window.setTimeout(function () { aborted = true; controller.abort(); }, 15000); opts = Object.assign({}, opts, { signal: controller.signal }); }
    try { var response = await fetch(url, opts); var raw = await response.text(); var data; try { data = raw ? JSON.parse(raw) : null; } catch (error) { return resultError('Invalid response.', response.status); } if (!response.ok) { var detail = data && (data.error || data.message); return resultError(detail ? 'Worker returned ' + response.status + ': ' + String(detail) : 'Worker returned ' + response.status + '.', response.status); } return { ok: true, status: response.status, data: data }; } catch (error) { if (aborted || error && error.name === 'AbortError') return resultError('Request timed out or was cancelled.'); return resultError('Network unavailable.'); } finally { if (timer) window.clearTimeout(timer); }
  }
  async function testConnection() { var current = settings(); if (!validWorkerUrl(current.workerBaseUrl)) return resultError(current.workerBaseUrl ? 'Worker URL invalid.' : 'Worker URL missing.'); return requestJson(endpoint('/api/health'), { method: 'GET', headers: { Accept: 'application/json' } }); }
  function normalizeSyncPayload(payload) {
    if (!payload || Number(payload.schemaVersion) !== 1 || payload.source !== 'notion') return { ok: false, error: 'Invalid sync payload.' };
    var records = Array.isArray(payload.records) ? payload.records.slice() : [];
    var knownKeys = {};
    records.forEach(function (record, index) {
      var signal = record && record.signal;
      if (record && record.notionPageId) knownKeys['page:' + record.notionPageId] = true;
      if (signal && signal.id) knownKeys['signal:' + signal.id] = true;
      if ((!record || (!record.notionPageId && !(signal && signal.id)))) knownKeys['record:' + index] = true;
    });
    if (Array.isArray(payload.signals)) payload.signals.forEach(function (signal, index) {
      if (!signal || typeof signal !== 'object') return;
      var key = signal.notionPageId ? 'page:' + signal.notionPageId : signal.id ? 'signal:' + signal.id : 'signal-index:' + index;
      if (!knownKeys[key]) records.push({ notionPageId: signal.notionPageId || '', lastEditedAt: signal.updatedAt || null, signal: signal });
    });
    var normalized = []; var invalidRecords = [];
    records.forEach(function (record, index) {
      if (!record || !record.signal) { invalidRecords.push({ record: record || {}, originalSignalId: '', normalizedSignalId: '', expression: '', reason: 'Missing signal object.' }); return; }
      var raw = record.signal; var originalSignalId = String(raw.id || '').trim(); var normalizedSignalId = originalSignalId.toLowerCase();
      var candidate = Object.assign({}, raw, { id: normalizedSignalId });
      var signal = registry && registry.normalizeSignal ? registry.normalizeSignal(candidate, { sourceType: 'notion-sync' }) : null;
      if (!signal) { invalidRecords.push({ record: record, originalSignalId: originalSignalId, normalizedSignalId: normalizedSignalId, expression: String(raw.term || raw.expression || '').trim(), reason: 'Required Signal fields are missing or invalid.' }); return; }
      signal = Object.assign({}, signal, { sourceType: 'notion-sync', sourcePackId: '', status: raw.status || 'Imported Candidate', originalSignalId: originalSignalId });
      normalized.push({ notionPageId: String(record.notionPageId || ''), lastEditedAt: record.lastEditedAt || null, signal: signal });
    });
    return { ok: true, schemaVersion: 1, source: 'notion', generatedAt: payload.generatedAt || new Date().toISOString(), nextCursor: payload.nextCursor || null, hasMore: payload.hasMore === true, records: normalized, invalidRecords: invalidRecords, signals: normalized.map(function (record) { return record.signal; }) };
  }
  async function fetchApprovedSignals(options) {
    var current = settings(); var opts = options || {}; if (!current.enabled) return resultError('Notion Sync is disabled.'); if (!validWorkerUrl(current.workerBaseUrl)) return resultError(current.workerBaseUrl ? 'Worker URL invalid.' : 'Worker URL missing.'); var cursor = opts.cursor || null; var records = []; var pages = 0;
    var invalidRecords = [];
    while (records.length < MAX_RECORDS) { var params = new URLSearchParams({ status: 'Approved', limit: String(Math.min(100, MAX_RECORDS - records.length)) }); if (cursor) params.set('cursor', cursor); if (opts.since) params.set('since', opts.since); var response = await requestJson(endpoint('/api/signals') + '?' + params.toString(), { method: 'GET', headers: { Accept: 'application/json' }, signal: opts.signal }); if (!response.ok) return response; var payload = normalizeSyncPayload(response.data); if (!payload.ok) return resultError(payload.error); records = records.concat(payload.records); invalidRecords = invalidRecords.concat(payload.invalidRecords || []); cursor = payload.nextCursor; pages += 1; if (!cursor || payload.hasMore === false || !payload.records.length || pages >= 10) break; }
    return { ok: true, payload: { schemaVersion: 1, source: 'notion', generatedAt: new Date().toISOString(), nextCursor: cursor, hasMore: !!cursor, records: records.slice(0, MAX_RECORDS), invalidRecords: invalidRecords, signals: records.slice(0, MAX_RECORDS).map(function (record) { return record.signal; }) } };
  }
  function compactTerm(value) { return registry.normalizeTerm(value).replace(/[^a-z0-9]+/g, ''); }
  function previewNotionSync(payload) {
    var normalized = payload && payload.ok === true && Array.isArray(payload.records) ? payload : normalizeSyncPayload(payload); if (!normalized.ok) return { ok: false, error: normalized.error || 'Invalid sync payload.' };
    var existing = registry.getDictionarySignals(); var accepted = []; var valid = []; var exact = []; var possible = []; var invalid = (normalized.invalidRecords || []).map(function (item) { return { record: item.record, originalSignalId: item.originalSignalId, normalizedSignalId: item.normalizedSignalId, expression: item.expression, reason: item.reason }; });
    normalized.records.forEach(function (record) { var signal = record.signal; if (!registry.validateSignal(signal)) { invalid.push({ record: record, reason: 'Required Signal fields are missing.' }); return; } var matches = registry.findPotentialDuplicates(signal, existing.concat(accepted)); var exactMatch = matches.find(function (match) { return match.exact; }); var compactMatch = existing.concat(accepted).find(function (item) { return compactTerm(item.term) === compactTerm(signal.term) && registry.normalizeTerm(item.category) !== registry.normalizeTerm(signal.category); }); if (exactMatch) { var source = registry.getSignalSource(exactMatch.signal.id); exact.push({ record: record, signal: signal, reason: source === 'imported' ? 'Already imported.' : 'Exact ID or term/category match.', source: source }); return; } var possibleMatches = matches.filter(function (match) { return !match.exact; }); if (compactMatch && possibleMatches.every(function (match) { return match.signal.id !== compactMatch.id; })) possibleMatches.push({ signal: compactMatch, exact: false }); var item = { record: record, signal: signal, matches: possibleMatches, reason: possibleMatches.length ? 'Possible duplicate: same expression or nearby category.' : '' }; if (possibleMatches.length) possible.push(item); valid.push(item); accepted.push(signal); });
    return { ok: true, received: normalized.records.length + (normalized.invalidRecords || []).length, valid: valid.length, exact: exact.length, exactDuplicates: exact.length, possible: possible.length, possibleDuplicates: possible.length, invalid: invalid.length, alreadyImported: exact.filter(function (item) { return item.source === 'imported'; }).length, newSignals: valid, exactItems: exact, possibleItems: possible, invalidItems: invalid, generatedAt: normalized.generatedAt };
  }
  async function importApprovedSignals(preview) {
    if (!preview || !preview.ok || !storage || !registry) return resultError('Sync preview is invalid.'); var entries = preview.newSignals || []; var custom = storage.getCustomSignals(); var batchId = preview.batchId || createSyncBatchId(); var packId = 'notion-sync-' + new Date().toISOString().slice(0, 10) + '-' + batchId.slice(-6); var imported = []; var signalIds = [];
    entries.forEach(function (entry) { var signal = entry.signal; if (custom.signals[signal.id]) return; var savedSignal = Object.assign({}, signal, { sourceType: 'notion-sync', sourcePackId: packId, importedAt: new Date().toISOString() }); custom.signals[signal.id] = savedSignal; signalIds.push(signal.id); imported.push({ notionPageId: entry.record.notionPageId, signalId: signal.id }); });
    if (!imported.length) return { ok: true, imported: [], packId: null, batchId: batchId }; var now = new Date().toISOString(); var pack = { id: packId, name: 'Notion Sync · ' + localDateKey(new Date()), description: 'Approved vocabulary synced from the English Radar Notion pipeline.', source: 'notion-sync', syncBatchId: batchId, notionPageIds: imported.map(function (item) { return item.notionPageId; }), workerSource: 'Cloudflare Worker', importedAt: now, signalIds: signalIds }; custom.packs = (custom.packs || []).concat(pack); if (!storage.saveCustomSignals(custom)) return resultError('LocalStorage write failed. Notion status was not updated.'); var saved = storage.getCustomSignals(); var verified = signalIds.every(function (id) { return saved.signals[id] && saved.signals[id].sourcePackId === packId; }); if (!verified) return resultError('Local import could not be verified. Notion status was not updated.'); return { ok: true, imported: imported, packId: packId, batchId: batchId, importedAt: now };
  }
  async function markRecordsImported(records, batchId) { var current = settings(); if (!current.enabled) return resultError('Notion Sync is disabled.'); if (!current.adminToken) return resultError('Admin token missing.'); if (!Array.isArray(records) || !records.length) return { ok: true, updated: 0, failed: 0, results: [] }; var results = []; var updated = 0; for (var offset = 0; offset < records.length; offset += 100) { var chunk = records.slice(offset, offset + 100); var response = await requestJson(endpoint('/api/imported'), { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: 'Bearer ' + current.adminToken }, body: JSON.stringify({ batchId: batchId, records: chunk }) }); if (!response.ok) return { ok: false, error: response.error, status: response.status, data: { updated: updated, failed: records.length - offset, results: results.concat(chunk.map(function (record) { return { notionPageId: record.notionPageId, signalId: record.signalId, status: 'failed' }; })) } }; var data = response.data || {}; updated += Number(data.updated) || 0; if (Array.isArray(data.results)) results = results.concat(data.results); } return { ok: true, updated: updated, failed: results.filter(function (item) { return item.status === 'failed'; }).length, results: results }; }
  window.EnglishRadarNotionSync = { getSyncSettings: getSyncSettings, saveSyncSettings: saveSyncSettings, testConnection: testConnection, fetchApprovedSignals: fetchApprovedSignals, normalizeSyncPayload: normalizeSyncPayload, previewNotionSync: previewNotionSync, importApprovedSignals: importApprovedSignals, markRecordsImported: markRecordsImported, createSyncBatchId: createSyncBatchId, getLastSyncAt: getLastSyncAt };
}());
