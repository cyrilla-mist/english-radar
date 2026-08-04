const API_VERSION = '1';
const DEFAULT_NOTION_VERSION = '2026-03-11';
const MAX_PAGE_SIZE = 100;
const MAX_BODY_BYTES = 100000;

function originFor(request, env) {
  const origin = request.headers.get('Origin');
  const allowed = String(env.ALLOWED_ORIGINS || '').split(',').map((item) => item.trim()).filter((item) => item && item !== '*');
  return origin && allowed.includes(origin) ? origin : origin ? null : '';
}

function corsHeaders(request, env) {
  const origin = originFor(request, env);
  const headers = { 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Max-Age': '600', Vary: 'Origin' };
  if (origin) headers['Access-Control-Allow-Origin'] = origin;
  return headers;
}

function json(request, env, body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }, corsHeaders(request, env)) });
}

function property(properties, name) {
  const target = String(name).toLowerCase();
  const key = Object.keys(properties || {}).find((item) => item.toLowerCase() === target);
  return key ? properties[key] : null;
}

function readPlainText(value) {
  if (!value) return '';
  if (typeof value === 'string') return value.trim();
  const parts = value.title || value.rich_text || value.text || [];
  if (Array.isArray(parts)) return parts.map((part) => part && (part.plain_text || part.text?.content || '')).join('').trim();
  return String(value.plain_text || value.content || value.url || '').trim();
}
function readRawPlainText(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  const parts = value.title || value.rich_text || value.text || [];
  if (Array.isArray(parts)) return parts.map((part) => part && (part.plain_text || part.text?.content || '')).join('');
  return String(value.plain_text || value.content || value.url || '');
}

function readSelect(value) { return value && (value.select?.name || value.status?.name || value.name || '') || ''; }
function readMultiSelect(value) { return Array.isArray(value?.multi_select) ? value.multi_select.map((item) => item.name).filter(Boolean) : []; }
function readDate(value) { return value?.date?.start || value?.start || null; }
function slugify(value) { return String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, ''); }
function generateStableSignalId(term, category) { return `notion-${slugify(category)}-${slugify(term)}`; }
function validId(value) { return /^[a-z0-9][a-z0-9-]{1,120}$/.test(String(value || '')); }
function normalizeSignalId(value) { const rawSignalId = String(value ?? ''); const normalizedSignalId = rawSignalId.trim().toLowerCase(); return { rawSignalId, originalSignalId: rawSignalId, normalizedSignalId, idWasNormalized: rawSignalId !== normalizedSignalId }; }

function mapNotionPageToSignal(page) {
  const properties = page?.properties || {};
  const term = readPlainText(property(properties, 'Expression'));
  const category = readSelect(property(properties, 'Category'));
  const suppliedId = readRawPlainText(property(properties, 'Signal ID'));
  const idInfo = normalizeSignalId(suppliedId);
  const id = idInfo.normalizedSignalId;
  const notionStatus = readSelect(property(properties, 'Status'));
  const quizStatus = readSelect(property(properties, 'Quiz Status')).toLowerCase();
  const addedAt = readDate(property(properties, 'Added At')) || page.created_time || null;
  return {
    id,
    rawSignalId: idInfo.rawSignalId,
    originalSignalId: idInfo.originalSignalId,
    normalizedSignalId: idInfo.normalizedSignalId,
    idWasNormalized: idInfo.idWasNormalized,
    term: term.toLowerCase().replace(/\s+/g, ' ').trim(),
    displayTerm: term || id,
    speechText: term || id,
    pronunciation: readPlainText(property(properties, 'IPA')) || '—',
    category,
    platforms: readMultiSelect(property(properties, 'Platforms')),
    tone: readMultiSelect(property(properties, 'Tone')),
    status: notionStatus === 'Imported' ? 'Imported' : 'Imported Candidate',
    formality: readSelect(property(properties, 'Formality')) || '—',
    meaningEn: readPlainText(property(properties, 'Meaning EN')) || '—',
    meaningZh: readPlainText(property(properties, 'Meaning ZH')),
    exampleEn: readPlainText(property(properties, 'Example EN')),
    exampleZh: readPlainText(property(properties, 'Example ZH')) || '—',
    useWhen: readPlainText(property(properties, 'Use When')) || '—',
    avoidWhen: readPlainText(property(properties, 'Avoid When')) || '—',
    chineseFeeling: readPlainText(property(properties, 'Chinese Feeling')) || '—',
    contentStatus: 'active',
    quizStatus: ['none', 'draft', 'ready'].includes(quizStatus) ? quizStatus : 'none',
    sourceType: 'notion-sync',
    source: readPlainText(property(properties, 'Source')),
    sourceContext: readPlainText(property(properties, 'Source Context')),
    confidence: readSelect(property(properties, 'Confidence')) || '',
    changeRisk: readSelect(property(properties, 'Change Risk')) || '',
    createdAt: addedAt,
    updatedAt: page.last_edited_time || addedAt
  };
}

function validateMappedSignal(signal) {
  return !!signal && validId(signal.id) && ['term', 'category', 'meaningZh', 'exampleEn'].every((field) => typeof signal[field] === 'string' && signal[field].trim()) && signal.contentStatus === 'active' && ['none', 'draft', 'ready'].includes(signal.quizStatus) && !signal.id.startsWith('core-');
}
function invalidMappedRecord(record) {
  const signal = record.signal || {};
  return { notionPageId: record.notionPageId, expression: signal.term || '', rawSignalId: signal.rawSignalId || signal.originalSignalId || '', originalSignalId: signal.originalSignalId || '', normalizedSignalId: signal.normalizedSignalId || '', reason: !String(signal.normalizedSignalId || '').trim() ? 'Signal ID is missing.' : !validId(signal.normalizedSignalId) ? 'Signal ID contains invalid characters or has an invalid length.' : 'Required Signal fields are missing or invalid.' };
}

function notionHeaders(env) { return { Authorization: `Bearer ${env.NOTION_TOKEN}`, 'Notion-Version': env.NOTION_VERSION || DEFAULT_NOTION_VERSION, 'Content-Type': 'application/json' }; }
async function notionRequest(env, path, options = {}) {
  if (!env.NOTION_TOKEN) return { ok: false, status: 503, error: 'Notion service is not configured.' };
  try {
    const response = await fetch(`https://api.notion.com/v1${path}`, { method: options.method || 'GET', headers: notionHeaders(env), body: options.body ? JSON.stringify(options.body) : undefined });
    const data = await response.json().catch(() => null);
    return response.ok ? { ok: true, status: response.status, data } : { ok: false, status: response.status, error: 'Notion request failed.' };
  } catch (error) { return { ok: false, status: 502, error: 'Notion service unavailable.' }; }
}

function statusFilter(status, type) { return type === 'select' ? { property: 'Status', select: { equals: status } } : { property: 'Status', status: { equals: status } }; }
function approvedFilter(since, type, status) {
  const statusFilterValue = statusFilter(status, type);
  if (!since) return statusFilterValue;
  return { and: [statusFilterValue, { timestamp: 'last_edited_time', last_edited_time: { on_or_after: since } }] };
}

async function querySignals(request, env, url) {
  if (!env.NOTION_DATA_SOURCE_ID) return json(request, env, { ok: false, error: 'Notion data source is not configured.' }, 503);
  const requestedStatus = url.searchParams.get('status') || 'Approved';
  if (!['Approved', 'Imported'].includes(requestedStatus)) return json(request, env, { ok: false, error: 'status must be Approved or Imported.' }, 400);
  const limit = Math.min(MAX_PAGE_SIZE, Math.max(1, Number(url.searchParams.get('limit')) || 100));
  const cursor = url.searchParams.get('cursor') || undefined;
  const since = url.searchParams.get('since') || null;
  const body = { page_size: limit, filter: approvedFilter(since, 'status', requestedStatus) };
  if (cursor) body.start_cursor = cursor;
  let result = await notionRequest(env, `/data_sources/${encodeURIComponent(env.NOTION_DATA_SOURCE_ID)}/query`, { method: 'POST', body });
  if (!result.ok && !cursor) result = await notionRequest(env, `/data_sources/${encodeURIComponent(env.NOTION_DATA_SOURCE_ID)}/query`, { method: 'POST', body: Object.assign({}, body, { filter: approvedFilter(since, 'select', requestedStatus) }) });
  if (!result.ok) return json(request, env, { ok: false, error: result.error }, 502);
  const pages = Array.isArray(result.data?.results) ? result.data.results : [];
  const mapped = pages.map((page) => ({ notionPageId: page.id, lastEditedAt: page.last_edited_time || null, signal: mapNotionPageToSignal(page) }));
  const records = mapped.filter((record) => validateMappedSignal(record.signal));
  const invalidRecords = mapped.filter((record) => !validateMappedSignal(record.signal)).map(invalidMappedRecord);
  return json(request, env, { ok: true, schemaVersion: 1, source: 'notion', generatedAt: new Date().toISOString(), nextCursor: result.data?.next_cursor || null, hasMore: result.data?.has_more === true, signals: records.map((record) => record.signal), records, invalidRecords });
}

function authValid(request, env) { const header = request.headers.get('Authorization') || ''; return !!env.SYNC_ADMIN_TOKEN && header === `Bearer ${env.SYNC_ADMIN_TOKEN}`; }
function updateProperties(page, signalId, batchId, now) {
  const properties = page.properties || {};
  const updates = {};
  const status = property(properties, 'Status');
  if (status?.type === 'status') updates.Status = { status: { name: 'Imported' } };
  else if (status?.type === 'select') updates.Status = { select: { name: 'Imported' } };
  const importedAt = property(properties, 'Imported At');
  if (importedAt) updates['Imported At'] = { date: { start: now } };
  const batch = property(properties, 'Import Batch');
  if (batch) updates['Import Batch'] = { rich_text: [{ type: 'text', text: { content: batchId } }] };
  const signal = property(properties, 'Signal ID');
  if (signal) updates['Signal ID'] = { rich_text: [{ type: 'text', text: { content: signalId } }] };
  return updates;
}

async function updateImportedRecord(record, batchId, env) {
  if (!record || !record.notionPageId || !record.signalId) return { status: 'failed', error: 'Missing record fields.' };
  const page = await notionRequest(env, `/pages/${encodeURIComponent(record.notionPageId)}`);
  if (!page.ok) return { notionPageId: record.notionPageId, signalId: record.signalId, status: 'failed', error: 'Could not read Notion record.' };
  const currentStatus = readSelect(property(page.data?.properties, 'Status'));
  if (currentStatus === 'Imported') return { notionPageId: record.notionPageId, signalId: record.signalId, status: 'skipped' };
  if (currentStatus !== 'Approved') return { notionPageId: record.notionPageId, signalId: record.signalId, status: 'failed', error: 'Record is no longer Approved.' };
  const updates = updateProperties(page.data, record.signalId, batchId, new Date().toISOString());
  if (!updates.Status) return { notionPageId: record.notionPageId, signalId: record.signalId, status: 'failed', error: 'Status property is not a supported Select or Status field.' };
  const updated = await notionRequest(env, `/pages/${encodeURIComponent(record.notionPageId)}`, { method: 'PATCH', body: { properties: updates } });
  return updated.ok ? { notionPageId: record.notionPageId, signalId: record.signalId, status: 'updated' } : { notionPageId: record.notionPageId, signalId: record.signalId, status: 'failed', error: 'Could not update Notion record.' };
}

async function markImported(request, env) {
  if (!authValid(request, env)) return json(request, env, { ok: false, error: request.headers.get('Authorization') ? 'Forbidden.' : 'Unauthorized.' }, request.headers.get('Authorization') ? 403 : 401);
  if (Number(request.headers.get('Content-Length') || 0) > MAX_BODY_BYTES) return json(request, env, { ok: false, error: 'Request body is too large.' }, 413);
  let body; let rawBody; try { rawBody = await request.text(); if (rawBody.length > MAX_BODY_BYTES) return json(request, env, { ok: false, error: 'Request body is too large.' }, 413); body = JSON.parse(rawBody); } catch (error) { return json(request, env, { ok: false, error: 'Invalid JSON body.' }, 400); }
  if (!body || typeof body.batchId !== 'string' || !body.batchId || !Array.isArray(body.records) || body.records.length > 100) return json(request, env, { ok: false, error: 'batchId and up to 100 records are required.' }, 400);
  const results = []; for (const record of body.records) results.push(await updateImportedRecord(record, body.batchId, env));
  const updated = results.filter((item) => item.status === 'updated').length; const failed = results.filter((item) => item.status === 'failed').length;
  return json(request, env, { ok: true, updated, failed, results });
}

export default {
  async fetch(request, env) {
    const origin = originFor(request, env);
    if (request.headers.get('Origin') && !origin) return json(request, env, { ok: false, error: 'Origin not allowed.' }, 403);
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    if (request.method === 'GET' && url.pathname === '/api/health') return json(request, env, { ok: true, service: 'English Radar Notion Sync', version: API_VERSION });
    if (request.method === 'GET' && url.pathname === '/api/signals') return querySignals(request, env, url);
    if (request.method === 'POST' && url.pathname === '/api/imported') return markImported(request, env);
    return json(request, env, { ok: false, error: 'Not found.' }, 404);
  }
};
