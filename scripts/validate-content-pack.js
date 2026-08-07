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
try {
  const source = fs.readFileSync(fileName, 'utf8');
  if (/\.js$/i.test(fileName)) {
    const context = { window: {} };
    vm.runInNewContext(source, context, { filename: fileName });
    payload = context.window.ENGLISH_RADAR_CONTENT_PACK_01 || context.window.ENGLISH_RADAR_CONTENT_PACK_02 || context.window.ENGLISH_RADAR_CONTENT_PACK_03 || context.window.ENGLISH_RADAR_UI_VOCABULARY_PACK || context.window.ENGLISH_RADAR_BUNDLED_PACK;
    if (payload && payload.pack && ['english-radar-content-pack-01', 'english-radar-content-pack-02', 'english-radar-content-pack-03'].includes(payload.pack.id)) {
      const quizFile = path.join(path.dirname(fileName), payload.pack.id === 'english-radar-content-pack-02' ? 'content-pack-02-quizzes.js' : payload.pack.id === 'english-radar-content-pack-03' ? 'content-pack-03-quizzes.js' : 'content-pack-01-quizzes.js');
      const quizContext = { window: {} };
      vm.runInNewContext(fs.readFileSync(quizFile, 'utf8'), quizContext, { filename: quizFile });
      quizzes = payload.pack.id === 'english-radar-content-pack-02' ? (quizContext.window.ENGLISH_RADAR_CONTENT_PACK_02_QUIZZES || []) : payload.pack.id === 'english-radar-content-pack-03' ? (quizContext.window.ENGLISH_RADAR_CONTENT_PACK_03_QUIZZES || []) : (quizContext.window.ENGLISH_RADAR_CONTENT_PACK_01_QUIZZES || []);
    }
  } else payload = JSON.parse(source);
} catch (error) {
  console.error(`Content pack could not be read: ${error.message}`);
  process.exit(1);
}

function text(value) { return typeof value === 'string' && value.trim().length > 0; }
function idFor(signal) { return String(signal.id || '').trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '') || `imported-${String(signal.category || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${String(signal.term || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`; }
function complete(value) { return Array.isArray(value) ? value.length > 0 : text(value); }

if (!payload || payload.app !== 'English Radar Content Pack') errors.push('app must be "English Radar Content Pack"');
if (!payload || Number(payload.schemaVersion) !== 1) errors.push('schemaVersion must be 1');
if (!payload || !payload.pack || !text(payload.pack.id)) errors.push('pack.id is required');
if (!payload || !Array.isArray(payload.signals)) errors.push('signals must be an array');

const signals = payload && Array.isArray(payload.signals) ? payload.signals : [];
const ids = new Set();
const terms = new Set();
const isInterfacePack = payload && payload.pack && payload.pack.id === 'english-radar-ui-vocabulary-core';
const isContentPack01 = payload && payload.pack && payload.pack.id === 'english-radar-content-pack-01';
const isContentPack02 = payload && payload.pack && payload.pack.id === 'english-radar-content-pack-02';
const isContentPack03 = payload && payload.pack && payload.pack.id === 'english-radar-content-pack-03';
const interfaceRequired = ['uiArea', 'originalMeaningEn', 'originalMeaningZh', 'productMeaningEn', 'productMeaningZh', 'whyProductsUseItEn', 'whyProductsUseItZh', 'commonInterfaces', 'realInterfaceExamples', 'relatedTerms', 'confusedWith', 'interfaceTargets', 'usageBoundaryEn', 'usageBoundaryZh'];

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
  if (isContentPack01) {
    ['sourceName', 'sourceUrl', 'editorialSourceType', 'auditedAt'].forEach((field) => { if (!text(signal[field])) errors.push(`signals[${index}].${field} is required`); });
    if (signal.radarType === 'interface') {
      if (signal.category !== 'UI Vocabulary') errors.push(`signals[${index}].category must be UI Vocabulary`);
      if (!/^ui-[a-z0-9-]+$/.test(signal.id)) errors.push(`signals[${index}].id must use the ui- prefix`);
      interfaceRequired.forEach((field) => { if (!complete(signal[field])) errors.push(`signals[${index}].${field} is required for interface Signals`); });
    } else {
      if (!/^builder-[a-z0-9-]+$/.test(signal.id)) errors.push(`signals[${index}].id must use the builder- prefix`);
      if (signal.radarType === 'interface') errors.push(`signals[${index}] Builder Signals must not use radarType interface`);
    }
  }
  if (isContentPack02) {
    ['sourceName', 'sourceUrl', 'editorialSourceType', 'auditedAt'].forEach((field) => { if (!text(signal[field])) errors.push(`signals[${index}].${field} is required`); });
    if (!/^ai-[a-z0-9-]+$/.test(signal.id)) errors.push(`signals[${index}].id must use the ai- prefix`);
    if (signal.category !== 'AI Builder') errors.push(`signals[${index}].category must be AI Builder`);
    if (signal.radarType === 'interface') errors.push(`signals[${index}] must not use radarType interface`);
  }
  if (isInterfacePack) {
    ['displayTerm', 'speechText', 'pronunciation', 'status', 'formality', 'meaningEn', 'exampleZh', 'useWhen', 'useWhenZh', 'avoidWhen', 'avoidWhenZh', 'chineseFeeling', 'contentStatus', 'quizStatus', 'sourceType'].forEach((field) => { if (!text(signal[field])) errors.push(`signals[${index}].${field} is required for UI Vocabulary`); });
    interfaceRequired.forEach((field) => { if (!complete(signal[field])) errors.push(`signals[${index}].${field} is required for UI Vocabulary`); });
    if (!/^ui-[a-z0-9-]+$/.test(signal.id)) errors.push(`signals[${index}].id must use the ui- prefix`);
    if (signal.radarType !== 'interface') errors.push(`signals[${index}].radarType must be interface`);
    if (signal.category !== 'UI Vocabulary') errors.push(`signals[${index}].category must be UI Vocabulary`);
    if (signal.contentStatus !== 'active') errors.push(`signals[${index}].contentStatus must be active`);
    if (!['none', 'ready'].includes(signal.quizStatus)) errors.push(`signals[${index}].quizStatus must be none or ready`);
    if (signal.sourceType !== 'imported') errors.push(`signals[${index}].sourceType must be imported`);
  }
});

if (isInterfacePack && signals.length !== 10) errors.push(`UI Vocabulary Pack must contain exactly 10 Signals, found ${signals.length}`);
if (isContentPack01) {
  if (signals.length !== 24) errors.push(`Content Pack 01 must contain exactly 24 Signals, found ${signals.length}`);
  if (signals.filter((signal) => signal.radarType === 'interface').length !== 15) errors.push('Content Pack 01 must contain exactly 15 Interface Signals');
  if (signals.filter((signal) => signal.radarType !== 'interface').length !== 9) errors.push('Content Pack 01 must contain exactly 9 Builder Signals');
  if (quizzes.length !== 48) errors.push(`Content Pack 01 must contain exactly 48 quizzes, found ${quizzes.length}`);
  const quizIds = new Set(); const counts = new Map();
  quizzes.forEach((quiz, index) => {
    if (!quiz || typeof quiz !== 'object') { errors.push(`quizzes[${index}] must be an object`); return; }
    if (!text(quiz.id)) errors.push(`quizzes[${index}].id is required`);
    if (quizIds.has(quiz.id)) errors.push(`duplicate Quiz id: ${quiz.id}`); quizIds.add(quiz.id);
    if (!ids.has(quiz.signalId)) errors.push(`quizzes[${index}].signalId does not exist: ${quiz.signalId}`);
    counts.set(quiz.signalId, (counts.get(quiz.signalId) || 0) + 1);
    if (!Array.isArray(quiz.options) || quiz.options.length !== 4) errors.push(`quizzes[${index}] must have exactly 4 options`);
    else {
      const optionIds = new Set(); quiz.options.forEach((option) => { if (!option || !text(option.id) || !text(option.text)) errors.push(`quizzes[${index}] options must have non-empty id and text`); else optionIds.add(option.id); });
      if (optionIds.size !== 4) errors.push(`quizzes[${index}] option IDs must be unique`);
      if (!optionIds.has(quiz.correctOptionId)) errors.push(`quizzes[${index}].correctOptionId is invalid`);
    }
    ['context', 'prompt', 'explanationEn', 'explanationZh'].forEach((field) => { if (!text(quiz[field])) errors.push(`quizzes[${index}].${field} is required`); });
    ['context', 'prompt'].forEach((field) => { if (text(quiz[field]) && (/\$\{|correctOptionId|answerKey|metadata/i.test(quiz[field]))) errors.push(`quizzes[${index}].${field} exposes answer metadata`); });
  });
  signals.forEach((signal) => { if (counts.get(signal.id) !== 2) errors.push(`${signal.id} must have exactly 2 quizzes`); });
}

if (isContentPack02) {
  if (signals.length !== 10) errors.push(`Content Pack 02 must contain exactly 10 Signals, found ${signals.length}`);
  if (signals.filter((signal) => signal.radarType === 'interface').length !== 0) errors.push('Content Pack 02 must contain zero Interface Signals');
  if (quizzes.length !== 20) errors.push(`Content Pack 02 must contain exactly 20 quizzes, found ${quizzes.length}`);
  const quizIds = new Set(); const counts = new Map();
  quizzes.forEach((quiz, index) => {
    if (!quiz || typeof quiz !== 'object') { errors.push(`quizzes[${index}] must be an object`); return; }
    if (!text(quiz.id)) errors.push(`quizzes[${index}].id is required`);
    if (quizIds.has(quiz.id)) errors.push(`duplicate Quiz id: ${quiz.id}`); quizIds.add(quiz.id);
    if (!ids.has(quiz.signalId)) errors.push(`quizzes[${index}].signalId does not exist: ${quiz.signalId}`);
    counts.set(quiz.signalId, (counts.get(quiz.signalId) || 0) + 1);
    if (!Array.isArray(quiz.options) || quiz.options.length !== 4) errors.push(`quizzes[${index}] must have exactly 4 options`);
    else {
      const optionIds = new Set(); quiz.options.forEach((option) => { if (!option || !text(option.id) || !text(option.text)) errors.push(`quizzes[${index}] options must have non-empty id and text`); else optionIds.add(option.id); });
      if (optionIds.size !== 4) errors.push(`quizzes[${index}] option IDs must be unique`);
      if (!optionIds.has(quiz.correctOptionId)) errors.push(`quizzes[${index}].correctOptionId is invalid`);
    }
    ['context', 'prompt', 'explanationEn', 'explanationZh'].forEach((field) => { if (!text(quiz[field])) errors.push(`quizzes[${index}].${field} is required`); });
    ['context', 'prompt'].forEach((field) => { if (text(quiz[field]) && (/\$\{|correctOptionId|answerKey|metadata/i.test(quiz[field]))) errors.push(`quizzes[${index}].${field} exposes answer metadata`); });
  });
  signals.forEach((signal) => { if (counts.get(signal.id) !== 2) errors.push(`${signal.id} must have exactly 2 quizzes`); });
}

if (isContentPack03) {
  if (signals.length !== 10) errors.push(`Content Pack 03 must contain exactly 10 Signals, found ${signals.length}`);
  if (signals.filter((signal) => signal.radarType === 'interface').length !== 10) errors.push('Content Pack 03 must contain exactly 10 Interface Signals');
  if (signals.filter((signal) => signal.category === 'UI Vocabulary').length !== 10) errors.push('Content Pack 03 must contain exactly 10 UI Vocabulary Signals');
  if (signals.filter((signal) => /^ui-[a-z0-9-]+$/.test(signal.id)).length !== 10) errors.push('Content Pack 03 Signal IDs must use the ui- prefix');
  if (signals.filter((signal) => text(signal.sourceName) && text(signal.sourceUrl) && text(signal.editorialSourceType) && text(signal.auditedAt)).length !== 10) errors.push('Content Pack 03 Signals must include complete source metadata');
  interfaceRequired.forEach((field) => { if (signals.some((signal) => !complete(signal[field]))) errors.push(`Content Pack 03 interface field ${field} is incomplete`); });
  if (quizzes.length !== 20) errors.push(`Content Pack 03 must contain exactly 20 quizzes, found ${quizzes.length}`);
  const quizIds = new Set(); const counts = new Map();
  quizzes.forEach((quiz, index) => {
    if (!quiz || typeof quiz !== 'object') { errors.push(`quizzes[${index}] must be an object`); return; }
    if (!text(quiz.id)) errors.push(`quizzes[${index}].id is required`);
    if (quizIds.has(quiz.id)) errors.push(`duplicate Quiz id: ${quiz.id}`); quizIds.add(quiz.id);
    if (!ids.has(quiz.signalId)) errors.push(`quizzes[${index}].signalId does not exist: ${quiz.signalId}`);
    counts.set(quiz.signalId, (counts.get(quiz.signalId) || 0) + 1);
    if (!Array.isArray(quiz.options) || quiz.options.length !== 4) errors.push(`quizzes[${index}] must have exactly 4 options`);
    else {
      const optionIds = new Set(); quiz.options.forEach((option) => { if (!option || !text(option.id) || !text(option.text)) errors.push(`quizzes[${index}] options must have non-empty id and text`); else optionIds.add(option.id); });
      if (optionIds.size !== 4) errors.push(`quizzes[${index}] option IDs must be unique`);
      if (!optionIds.has(quiz.correctOptionId)) errors.push(`quizzes[${index}].correctOptionId is invalid`);
    }
    ['context', 'prompt', 'explanationEn', 'explanationZh'].forEach((field) => { if (!text(quiz[field])) errors.push(`quizzes[${index}].${field} is required`); });
    ['context', 'prompt'].forEach((field) => { if (text(quiz[field]) && (/\$\{|correctOptionId|answerKey|metadata/i.test(quiz[field]))) errors.push(`quizzes[${index}].${field} exposes answer metadata`); });
  });
  signals.forEach((signal) => { if (counts.get(signal.id) !== 2) errors.push(`${signal.id} must have exactly 2 quizzes`); });
}

if (errors.length) { console.error(`Content pack validation failed with ${errors.length} error(s):`); errors.forEach((error) => console.error(`- ${error}`)); process.exit(1); }
console.log(`Content pack valid: ${payload.pack.id} · ${signals.length} Signals${isContentPack01 || isContentPack02 || isContentPack03 ? ` · ${quizzes.length} Quizzes` : ''}`);
