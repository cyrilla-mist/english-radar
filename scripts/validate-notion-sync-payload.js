const fs = require('fs');

const fileName = process.argv[2];
if (!fileName) {
  console.log('Usage: node scripts/validate-notion-sync-payload.js path/to/payload.json');
  process.exit(0);
}

let payload;
try { payload = JSON.parse(fs.readFileSync(fileName, 'utf8')); } catch (error) { console.error(`Sync payload could not be read: ${error.message}`); process.exit(1); }
const errors = [];
const text = (value) => typeof value === 'string' && value.trim();
const idOk = (value) => /^[a-z0-9][a-z0-9-]{1,120}$/.test(String(value || ''));
const records = Array.isArray(payload.records) ? payload.records : Array.isArray(payload.signals) ? payload.signals.map((signal) => ({ notionPageId: signal.notionPageId || 'fixture-page', signal })) : [];

if (!payload || Number(payload.schemaVersion) !== 1) errors.push('schemaVersion must be 1');
if (!payload || payload.source !== 'notion') errors.push('source must be "notion"');
if (!records.length) errors.push('signals or records must contain at least one item');
const ids = new Set();
const terms = new Set();
records.forEach((record, index) => {
  const signal = record && record.signal ? record.signal : record;
  if (!record || !text(record.notionPageId)) errors.push(`records[${index}].notionPageId is required`);
  if (!signal || typeof signal !== 'object') { errors.push(`records[${index}].signal must be an object`); return; }
  ['id', 'term', 'category', 'meaningZh', 'exampleEn'].forEach((field) => { if (!text(signal[field])) errors.push(`records[${index}].signal.${field} is required`); });
  if (signal.id && !idOk(signal.id)) errors.push(`records[${index}].signal.id is invalid`);
  const id = String(signal.id || ''); const termKey = `${String(signal.term || '').toLowerCase().trim()}|${String(signal.category || '').toLowerCase().trim()}`;
  if (ids.has(id)) errors.push(`duplicate Signal id: ${id}`); if (terms.has(termKey)) errors.push(`duplicate term/category: ${termKey}`); ids.add(id); terms.add(termKey);
  if (signal.contentStatus && !['active', 'archived'].includes(signal.contentStatus)) errors.push(`records[${index}].signal.contentStatus is invalid`);
  if (signal.quizStatus && !['none', 'draft', 'ready'].includes(signal.quizStatus)) errors.push(`records[${index}].signal.quizStatus is invalid`);
});
if (errors.length) { console.error(`Notion sync payload validation failed with ${errors.length} error(s):`); errors.forEach((error) => console.error(`- ${error}`)); process.exit(1); }
console.log(`Notion sync payload valid: ${records.length} records`);
