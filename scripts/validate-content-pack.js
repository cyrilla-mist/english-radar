const fs = require('fs');
const path = require('path');
const vm = require('vm');

const fileName = process.argv[2];
if (!fileName) {
  console.log('Usage: node scripts/validate-content-pack.js path/to/pack.js');
  process.exit(0);
}

const errors = [];
let payload;
let quizzes = [];

function text(value) { return typeof value === 'string' && value.trim().length > 0; }
function complete(value) { return Array.isArray(value) ? value.length > 0 : text(value); }
function idFor(signal) { return String(signal.id || '').trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '') || `imported-${String(signal.category || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${String(signal.term || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`; }
function packNumber(id) { const match = String(id || '').match(/content-pack-(\d+)$/); return match ? match[1] : ''; }
function quizFileFor(packId, sourceFile) {
  const number = packNumber(packId);
  if (number) return path.join(path.dirname(sourceFile), `content-pack-${String(number).padStart(2, '0')}-quizzes.js`);
  if (packId === 'english-radar-ui-vocabulary-core') return path.join(path.dirname(sourceFile), 'ui-vocabulary-quizzes.js');
  return null;
}
function quizGlobalFor(packId) {
  const number = packNumber(packId);
  if (number) return `ENGLISH_RADAR_CONTENT_PACK_${String(number).padStart(2, '0')}_QUIZZES`;
  if (packId === 'english-radar-ui-vocabulary-core') return 'ENGLISH_RADAR_UI_VOCABULARY_QUIZZES';
  return '';
}

try {
  const source = fs.readFileSync(fileName, 'utf8');
  if (/\.js$/i.test(fileName)) {
    const context = { window: {} };
    vm.runInNewContext(source, context, { filename: fileName });
    payload = Object.keys(context.window).map((key) => context.window[key]).find((value) => value && value.app === 'English Radar Content Pack' && value.pack && Array.isArray(value.signals));
    if (payload && payload.pack) {
      const quizFile = quizFileFor(payload.pack.id, fileName);
      const quizGlobal = quizGlobalFor(payload.pack.id);
      if (quizFile && fs.existsSync(quizFile)) {
        const quizContext = { window: {} };
        vm.runInNewContext(fs.readFileSync(quizFile, 'utf8'), quizContext, { filename: quizFile });
        quizzes = Array.isArray(quizContext.window[quizGlobal]) ? quizContext.window[quizGlobal] : [];
      }
    }
  } else payload = JSON.parse(source);
} catch (error) {
  console.error(`Content pack could not be read: ${error.message}`);
  process.exit(1);
}

if (!payload || payload.app !== 'English Radar Content Pack') errors.push('app must be "English Radar Content Pack"');
if (!payload || Number(payload.schemaVersion) !== 1) errors.push('schemaVersion must be 1');
if (!payload || !payload.pack || !text(payload.pack.id)) errors.push('pack.id is required');
if (!payload || !Array.isArray(payload.signals)) errors.push('signals must be an array');

const signals = payload && Array.isArray(payload.signals) ? payload.signals : [];
const ids = new Set();
const terms = new Set();
const interfaceRequired = ['uiArea', 'originalMeaningEn', 'originalMeaningZh', 'productMeaningEn', 'productMeaningZh', 'whyProductsUseItEn', 'whyProductsUseItZh', 'commonInterfaces', 'realInterfaceExamples', 'relatedTerms', 'confusedWith', 'interfaceTargets', 'usageBoundaryEn', 'usageBoundaryZh'];
const sourceRequired = ['sourceName', 'sourceUrl', 'editorialSourceType', 'auditedAt'];
const productNamingRequired = ['originalMeaningEn', 'originalMeaningZh', 'productMeaningEn', 'productMeaningZh', 'whyProductsUseItEn', 'whyProductsUseItZh', 'commonInterfaces', 'realInterfaceExamples', 'relatedTerms', 'confusedWith'];
const communityRequired = ['originalMeaningEn', 'originalMeaningZh', 'culturalContextEn', 'culturalContextZh', 'relatedTerms', 'confusedWith'];

function requireFields(signal, index, fields, label) {
  fields.forEach((field) => { if (!complete(signal[field])) errors.push(`signals[${index}].${field} is required for ${label}`); });
}

signals.forEach((signal, index) => {
  if (!signal || typeof signal !== 'object' || Array.isArray(signal)) { errors.push(`signals[${index}] must be an object`); return; }
  ['id', 'term', 'category', 'meaningZh', 'exampleEn'].forEach((field) => { if (!text(signal[field])) errors.push(`signals[${index}].${field} is required`); });
  const id = idFor(signal);
  const key = `${String(signal.term || '').trim().toLowerCase()}|${String(signal.category || '').trim().toLowerCase()}`;
  if (ids.has(id)) errors.push(`duplicate Signal id: ${id}`);
  if (terms.has(key)) errors.push(`duplicate term/category: ${key}`);
  ids.add(id); terms.add(key);
  if (signal.contentStatus && !['active', 'archived'].includes(signal.contentStatus)) errors.push(`signals[${index}].contentStatus is invalid`);
  if (signal.quizStatus && !['none', 'draft', 'ready'].includes(signal.quizStatus)) errors.push(`signals[${index}].quizStatus is invalid`);
  if (signal.platforms !== undefined && !Array.isArray(signal.platforms)) errors.push(`signals[${index}].platforms must be an array`);
  if (signal.tone !== undefined && !Array.isArray(signal.tone)) errors.push(`signals[${index}].tone must be an array`);
  if (signal.fullForm !== undefined && !text(signal.fullForm)) errors.push(`signals[${index}].fullForm must be a non-empty string when present`);

  const category = String(signal.category || '').trim();
  if (category === 'Product Naming') {
    requireFields(signal, index, sourceRequired.concat(productNamingRequired), 'Product Naming');
    if (!/^pn-[a-z0-9-]+$/.test(signal.id)) errors.push(`signals[${index}].id must use the pn- prefix`);
    if (signal.radarType === 'interface') errors.push(`signals[${index}] Product Naming Signals must not use radarType interface`);
  } else if (category === 'Community Discourse') {
    requireFields(signal, index, sourceRequired.concat(communityRequired), 'Community Discourse');
    if (!/^cd-[a-z0-9-]+$/.test(signal.id)) errors.push(`signals[${index}].id must use the cd- prefix`);
    if (signal.radarType === 'interface') errors.push(`signals[${index}] Community Discourse Signals must not use radarType interface`);
  } else if (category === 'AI Builder') {
    requireFields(signal, index, sourceRequired, 'AI Builder');
    if (!/^ai-[a-z0-9-]+$/.test(signal.id)) errors.push(`signals[${index}].id must use the ai- prefix`);
    if (signal.radarType === 'interface') errors.push(`signals[${index}] AI Builder Signals must not use radarType interface`);
  } else if (signal.radarType === 'interface') {
    requireFields(signal, index, interfaceRequired, 'Interface');
    if (!/^ui-[a-z0-9-]+$/.test(signal.id)) errors.push(`signals[${index}].id must use the ui- prefix`);
    if (category !== 'UI Vocabulary') errors.push(`signals[${index}].category must be UI Vocabulary for Interface Signals`);
  }
});

function validateQuiz(quiz, index, counts, quizIds) {
  if (!quiz || typeof quiz !== 'object') { errors.push(`quizzes[${index}] must be an object`); return; }
  if (!text(quiz.id)) errors.push(`quizzes[${index}].id is required`);
  if (quizIds.has(quiz.id)) errors.push(`duplicate Quiz id: ${quiz.id}`);
  quizIds.add(quiz.id);
  if (!ids.has(quiz.signalId)) errors.push(`quizzes[${index}].signalId does not exist: ${quiz.signalId}`);
  counts.set(quiz.signalId, (counts.get(quiz.signalId) || 0) + 1);
  if (!Array.isArray(quiz.options) || quiz.options.length !== 4) errors.push(`quizzes[${index}] must have exactly 4 options`);
  else {
    const optionIds = new Set();
    quiz.options.forEach((option) => { if (!option || !text(option.id) || !text(option.text)) errors.push(`quizzes[${index}] options must have non-empty id and text`); else optionIds.add(option.id); });
    if (optionIds.size !== 4) errors.push(`quizzes[${index}] option IDs must be unique`);
    if (!optionIds.has(quiz.correctOptionId)) errors.push(`quizzes[${index}].correctOptionId is invalid`);
  }
  ['context', 'prompt', 'explanationEn', 'explanationZh'].forEach((field) => { if (!text(quiz[field])) errors.push(`quizzes[${index}].${field} is required`); });
  ['context', 'prompt'].forEach((field) => { if (text(quiz[field]) && (/\$\{|correctOptionId|answerKey|metadata/i.test(quiz[field]))) errors.push(`quizzes[${index}].${field} exposes answer metadata`); });
}

if (quizzes.length) {
  const quizIds = new Set();
  const counts = new Map();
  quizzes.forEach((quiz, index) => validateQuiz(quiz, index, counts, quizIds));
  if (quizzes.length !== signals.length * 2) errors.push(`each Signal must have exactly 2 quizzes; expected ${signals.length * 2}, found ${quizzes.length}`);
  signals.forEach((signal) => { if (counts.get(signal.id) !== 2) errors.push(`${signal.id} must have exactly 2 quizzes`); });
}

if (errors.length) { console.error(`Content pack validation failed with ${errors.length} error(s):`); errors.forEach((error) => console.error(`- ${error}`)); process.exit(1); }
console.log(`Content pack valid: ${payload.pack.id} · ${signals.length} Signals${quizzes.length ? ` · ${quizzes.length} Quizzes` : ''}`);
