import assert from 'node:assert/strict';
import worker from '../src/index.js';

const rich = (content) => ({ rich_text: [{ plain_text: content }] });
function page(signalId, expression = 'based') {
  return { id: 'page-' + String(signalId || expression).replace(/[^a-z0-9]/gi, '-'), created_time: '2026-08-03T00:00:00Z', last_edited_time: '2026-08-03T00:00:00Z', properties: {
    Expression: rich(expression), 'Signal ID': rich(signalId), Category: { select: { name: 'Internet Culture' } }, Status: { select: { name: 'Approved' } }, 'Meaning ZH': rich('表示认可'), 'Example EN': rich('Based.'), 'Example ZH': rich('表示认可。')
  } };
}
async function query(pages) {
  globalThis.fetch = async () => new Response(JSON.stringify({ results: pages, next_cursor: null, has_more: false }), { status: 200, headers: { 'content-type': 'application/json' } });
  const response = await worker.fetch(new Request('https://worker.test/api/signals?status=Approved&limit=10'), { NOTION_TOKEN: 'test-only', NOTION_DATA_SOURCE_ID: 'source-id' });
  return response.json();
}

let data = await query([page('ICR-20260803-based')]);
assert.equal(data.records.length, 1);
assert.equal(data.records[0].signal.id, 'icr-20260803-based');
assert.equal(data.records[0].signal.originalSignalId, 'ICR-20260803-based');
assert.equal(data.records[0].signal.rawSignalId, 'ICR-20260803-based');
assert.equal(data.records[0].signal.normalizedSignalId, 'icr-20260803-based');
assert.equal(data.records[0].signal.idWasNormalized, true);

data = await query([page('')]);
assert.equal(data.records.length, 0);
assert.equal(data.invalidRecords.length, 1);
assert.equal(data.invalidRecords[0].reason, 'Signal ID is missing.');

data = await query([page(' ICR-20260803-based ')]);
assert.equal(data.records[0].signal.id, 'icr-20260803-based');
assert.equal(data.records[0].signal.rawSignalId, ' ICR-20260803-based ');
assert.equal(data.records[0].signal.originalSignalId, ' ICR-20260803-based ');
assert.equal(data.records[0].signal.normalizedSignalId, 'icr-20260803-based');
assert.equal(data.records[0].signal.idWasNormalized, true);

data = await query([page('   ')]);
assert.equal(data.records.length, 0);
assert.equal(data.invalidRecords[0].rawSignalId, '   ');
assert.equal(data.invalidRecords[0].originalSignalId, '   ');
assert.equal(data.invalidRecords[0].normalizedSignalId, '');
assert.equal(data.invalidRecords[0].reason, 'Signal ID is missing.');

data = await query([page('bad/id')]);
assert.equal(data.records.length, 0);
assert.equal(data.invalidRecords[0].normalizedSignalId, 'bad/id');

data = await query([page('icr-20260803-based')]);
assert.equal(data.records[0].signal.id, 'icr-20260803-based');
assert.equal(data.records[0].signal.idWasNormalized, false);

console.log('PASS: Worker Signal ID normalization and invalid record reporting');
