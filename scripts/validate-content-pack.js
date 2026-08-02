const fs = require('fs');

const fileName = process.argv[2];
if (!fileName) {
  console.log('Usage: node scripts/validate-content-pack.js path/to/pack.json');
  process.exit(0);
}

const errors = [];
let payload;
try {
  payload = JSON.parse(fs.readFileSync(fileName, 'utf8'));
} catch (error) {
  console.error(`Content pack could not be read: ${error.message}`);
  process.exit(1);
}

function text(value) { return typeof value === 'string' && value.trim(); }
function idFor(signal) {
  return String(signal.id || '').trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '') || `imported-${String(signal.category || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${String(signal.term || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

if (!payload || payload.app !== 'English Radar Content Pack') errors.push('app must be "English Radar Content Pack"');
if (!payload || Number(payload.schemaVersion) !== 1) errors.push('schemaVersion must be 1');
if (!payload || !payload.pack || !text(payload.pack.id)) errors.push('pack.id is required');
if (!payload || !Array.isArray(payload.signals)) errors.push('signals must be an array');

const ids = new Set();
const terms = new Set();
const signals = payload && Array.isArray(payload.signals) ? payload.signals : [];
signals.forEach((signal, index) => {
  if (!signal || typeof signal !== 'object' || Array.isArray(signal)) {
    errors.push(`signals[${index}] must be an object`);
    return;
  }
  ['term', 'category', 'meaningZh', 'exampleEn'].forEach((field) => {
    if (!text(signal[field])) errors.push(`signals[${index}].${field} is required`);
  });
  const id = idFor(signal);
  const key = `${String(signal.term || '').trim().toLowerCase()}|${String(signal.category || '').trim().toLowerCase()}`;
  if (ids.has(id)) errors.push(`duplicate Signal id: ${id}`);
  if (terms.has(key)) errors.push(`duplicate term/category: ${key}`);
  ids.add(id);
  terms.add(key);
  if (signal.contentStatus && !['active', 'archived'].includes(signal.contentStatus)) errors.push(`signals[${index}].contentStatus is invalid`);
  if (signal.quizStatus && !['none', 'draft', 'ready'].includes(signal.quizStatus)) errors.push(`signals[${index}].quizStatus is invalid`);
  if (signal.platforms !== undefined && !Array.isArray(signal.platforms)) errors.push(`signals[${index}].platforms must be an array`);
  if (signal.tone !== undefined && !Array.isArray(signal.tone)) errors.push(`signals[${index}].tone must be an array`);
});

if (errors.length) {
  console.error(`Content pack validation failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Content pack valid: ${payload.pack.id} · ${signals.length} Signals`);
