const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data/signals.js'), 'utf8'), context, { filename: 'data/signals.js' });
vm.runInNewContext(fs.readFileSync(path.join(root, 'data/quizzes.js'), 'utf8'), context, { filename: 'data/quizzes.js' });
const signals = context.window.ENGLISH_RADAR_SIGNALS;
const quizzes = context.window.ENGLISH_RADAR_QUIZZES;
const errors = [];
const signalIds = new Set();
const terms = new Set();
const requiredSignal = ['id','term','displayTerm','speechText','pronunciation','category','platforms','tone','status','formality','meaningEn','meaningZh','exampleEn','exampleZh','useWhen','avoidWhen','chineseFeeling'];
if (!Array.isArray(signals) || signals.length !== 60) errors.push(`Expected 60 signals, found ${signals && signals.length}.`);
(signals || []).forEach((signal, index) => {
  requiredSignal.forEach((field) => { if (signal[field] === undefined || signal[field] === null || signal[field] === '') errors.push(`Signal ${index + 1} missing ${field}.`); });
  if (signalIds.has(signal.id)) errors.push(`Duplicate Signal ID: ${signal.id}`); signalIds.add(signal.id);
  const term = String(signal.term || '').trim().toLowerCase(); if (terms.has(term)) errors.push(`Duplicate Signal term: ${signal.term}`); terms.add(term);
  ['platforms','tone'].forEach((field) => { if (!Array.isArray(signal[field])) errors.push(`Signal ${signal.id} ${field} must be an array.`); });
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(String(signal.id || ''))) errors.push(`Unstable Signal ID: ${signal.id}`);
});
const quizIds = new Set(); const pairs = new Set(); const counts = {};
const types = new Set(['meaning-in-context','natural-usage','tone','community','formality']); const difficulties = new Set(['easy','medium','hard']);
if (!Array.isArray(quizzes) || quizzes.length !== 120) errors.push(`Expected 120 quizzes, found ${quizzes && quizzes.length}.`);
(quizzes || []).forEach((quiz, index) => {
  if (quizIds.has(quiz.id)) errors.push(`Duplicate Quiz ID: ${quiz.id}`); quizIds.add(quiz.id);
  if (!signalIds.has(quiz.signalId)) errors.push(`Quiz ${quiz.id} references unknown Signal ${quiz.signalId}`);
  counts[quiz.signalId] = (counts[quiz.signalId] || 0) + 1;
  if (!types.has(quiz.type)) errors.push(`Quiz ${quiz.id} has invalid type ${quiz.type}`);
  if (!difficulties.has(quiz.difficulty)) errors.push(`Quiz ${quiz.id} has invalid difficulty ${quiz.difficulty}`);
  if (!Array.isArray(quiz.options) || quiz.options.length !== 4) errors.push(`Quiz ${quiz.id} must have exactly 4 options.`);
  const optionIds = new Set((quiz.options || []).map((option) => option.id)); if (optionIds.size !== 4) errors.push(`Quiz ${quiz.id} has duplicate option IDs.`);
  if (!optionIds.has(quiz.correctOptionId)) errors.push(`Quiz ${quiz.id} has an invalid correctOptionId.`);
  if (!quiz.explanationEn || !quiz.explanationZh) errors.push(`Quiz ${quiz.id} needs both explanations.`);
  const pair = `${quiz.question}\u0000${quiz.context}`; if (pairs.has(pair)) errors.push(`Duplicate question/context: ${quiz.id}`); pairs.add(pair);
});
signalIds.forEach((id) => { if (counts[id] !== 2) errors.push(`Signal ${id} has ${counts[id] || 0} quizzes; expected 2.`); });
if (errors.length) { console.error('English Radar data validation failed.'); errors.forEach((error) => console.error(`- ${error}`)); process.exitCode = 1; } else { console.log('English Radar data validation passed.'); console.log('60 signals'); console.log('120 quizzes'); console.log('All signal and quiz IDs are valid.'); }
