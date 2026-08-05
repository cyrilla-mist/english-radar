const fs = require('fs');
const vm = require('vm');

const fileName = process.argv[2];
if (!fileName) {
  console.log('Usage: node scripts/validate-content-pack.js path/to/pack.json');
  process.exit(0);
}

const errors = [];
let payload;
try {
  const source = fs.readFileSync(fileName, 'utf8');
  if (/\.js$/i.test(fileName)) {
    const context = { window: {} };
    vm.runInNewContext(source, context, { filename: fileName });
    payload = context.window.ENGLISH_RADAR_UI_VOCABULARY_PACK || context.window.ENGLISH_RADAR_BUNDLED_PACK;
  } else payload = JSON.parse(source);
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
const isInterfacePack = payload && payload.pack && payload.pack.id === 'english-radar-ui-vocabulary-core';
const interfaceRequired = ['uiArea', 'originalMeaningEn', 'originalMeaningZh', 'productMeaningEn', 'productMeaningZh', 'whyProductsUseItEn', 'whyProductsUseItZh', 'commonInterfaces', 'realInterfaceExamples', 'relatedTerms', 'confusedWith', 'interfaceTargets', 'usageBoundaryEn', 'usageBoundaryZh'];
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
  if (isInterfacePack) {
    ['id', 'displayTerm', 'speechText', 'pronunciation', 'status', 'formality', 'meaningEn', 'exampleZh', 'useWhen', 'useWhenZh', 'avoidWhen', 'avoidWhenZh', 'chineseFeeling', 'contentStatus', 'quizStatus', 'sourceType'].forEach((field) => { if (!text(signal[field])) errors.push(`signals[${index}].${field} is required for UI Vocabulary`); });
    interfaceRequired.forEach((field) => { if (signal[field] === undefined || signal[field] === null || (typeof signal[field] === 'string' && !signal[field].trim()) || (Array.isArray(signal[field]) && signal[field].length === 0)) errors.push(`signals[${index}].${field} is required for UI Vocabulary`); });
    if (signal.id !== String(signal.id).toLowerCase() || !/^ui-[a-z0-9-]+$/.test(signal.id)) errors.push(`signals[${index}].id must use the ui- prefix`);
    if (signal.radarType !== 'interface') errors.push(`signals[${index}].radarType must be interface`);
    if (signal.category !== 'UI Vocabulary') errors.push(`signals[${index}].category must be UI Vocabulary`);
    if (signal.contentStatus !== 'active') errors.push(`signals[${index}].contentStatus must be active`);
    if (!['none', 'ready'].includes(signal.quizStatus)) errors.push(`signals[${index}].quizStatus must be none or ready`);
    if (signal.sourceType !== 'imported') errors.push(`signals[${index}].sourceType must be imported`);
    if (!Array.isArray(signal.uiArea) || !signal.uiArea.every(text)) errors.push(`signals[${index}].uiArea must be a string array`);
    ['commonInterfaces', 'relatedTerms'].forEach((field) => { if (!Array.isArray(signal[field]) || !signal[field].every(text)) errors.push(`signals[${index}].${field} must be a string array`); });
    if (!Array.isArray(signal.realInterfaceExamples) || !signal.realInterfaceExamples.every((item) => item && text(item.surface) && text(item.exampleEn) && text(item.exampleZh))) errors.push(`signals[${index}].realInterfaceExamples must contain complete examples`);
    if (!Array.isArray(signal.interfaceTargets) || !signal.interfaceTargets.every((item) => item && text(item.page) && text(item.area) && text(item.label))) errors.push(`signals[${index}].interfaceTargets must contain page, area and label`);
    if (!Array.isArray(signal.confusedWith) || !signal.confusedWith.every((item) => item && text(item.term) && text(item.differenceEn) && text(item.differenceZh))) errors.push(`signals[${index}].confusedWith must contain complete differences`);
  }
});

if (isInterfacePack) {
  if (signals.length !== 10) errors.push(`UI Vocabulary Pack must contain exactly 10 Signals, found ${signals.length}`);
  const uiIds = new Set(signals.map((signal) => signal.id));
  signals.forEach((signal, index) => { (signal.relatedTerms || []).forEach((id) => { if (!uiIds.has(id)) errors.push(`signals[${index}].relatedTerms references missing UI Signal ${id}`); }); });
}

if (errors.length) {
  console.error(`Content pack validation failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Content pack valid: ${payload.pack.id} · ${signals.length} Signals`);
