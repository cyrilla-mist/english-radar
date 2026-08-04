'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');

function load(relativePath, windowValue) {
  const context = vm.createContext({ window: windowValue, document: windowValue.document, console, Date, Math, Number, String, Array, Object, URLSearchParams, setTimeout, clearTimeout });
  vm.runInContext(fs.readFileSync(path.join(root, relativePath), 'utf8'), context, { filename: relativePath });
  return windowValue;
}

function element() {
  return { hidden: false, disabled: false, textContent: '', value: '', href: '', style: {}, dataset: {}, classList: { add() {}, remove() {}, toggle() {} }, appendChild() {}, addEventListener() {}, setAttribute() {}, querySelectorAll() { return []; } };
}

function quizWindow(search, quizzes, history) {
  const signals = [...new Set(quizzes.map((quiz) => quiz.signalId))].map((id) => ({ id, term: id }));
  const document = { querySelector() { return element(); }, querySelectorAll() { return []; }, createElement() { return element(); }, addEventListener() {} };
  return { location: { search }, document, EnglishRadarContent: { getActiveLearningSignals: () => signals }, ENGLISH_RADAR_QUIZZES: quizzes, EnglishRadarStorage: { getQuizHistory: () => history || { byQuiz: {}, attempts: [] }, getProgress: () => {}, setProgress: () => true, recordQuizAttempt: () => true } };
}

function question(id, signalId, questionType, difficulty) {
  return { id, signalId, type: questionType === 'meaning' ? 'meaning-in-context' : questionType === 'boundary' ? 'usage-boundary' : 'natural-usage', question: id, options: [{ id: 'a', text: 'correct' }, { id: 'b', text: 'wrong 1' }, { id: 'c', text: 'wrong 2' }, { id: 'd', text: 'wrong 3' }], correctOptionId: 'a', explanationEn: 'why', explanationZh: '说明', difficulty };
}

const legacy = [question('legacy-meaning', 'signal-1', 'meaning'), question('legacy-context', 'signal-2', 'context'), question('legacy-boundary', 'signal-3', 'boundary')];
const normalizedWindow = load('js/quiz.js', quizWindow('?mode=quick', legacy));
const normalized = normalizedWindow.EnglishRadarQuizEngine.baseQuestions();
assert.deepEqual(normalized.map((item) => item.questionType), ['meaning', 'context', 'boundary']);
assert.deepEqual(normalized.map((item) => item.difficulty), ['easy', 'medium', 'hard']);
assert.ok(normalized.every((item) => item.prompt && item.explanation));

const pool = [];
for (let i = 0; i < 8; i += 1) pool.push(question(`easy-${i}`, `easy-signal-${i}`, 'meaning', 'easy'));
for (let i = 0; i < 8; i += 1) pool.push(question(`medium-${i}`, `medium-signal-${i}`, 'context', 'medium'));
for (let i = 0; i < 8; i += 1) pool.push(question(`hard-${i}`, `hard-signal-${i}`, 'boundary', 'hard'));
const quickWindow = load('js/quiz.js', quizWindow('?mode=quick', pool));
const quick = quickWindow.EnglishRadarQuizEngine.getQuestions();
assert.equal(quick.length, 5);
assert.deepEqual(quick.reduce((counts, item) => { counts[item.difficulty] += 1; return counts; }, { easy: 0, medium: 0, hard: 0 }), { easy: 2, medium: 2, hard: 1 });
assert.equal(new Set(quick.map((item) => item.signalId)).size, quick.length);
const standardWindow = load('js/quiz.js', quizWindow('?mode=standard', pool));
const standard = standardWindow.EnglishRadarQuizEngine.getQuestions();
assert.equal(standard.length, 10);
assert.deepEqual(standard.reduce((counts, item) => { counts[item.difficulty] += 1; return counts; }, { easy: 0, medium: 0, hard: 0 }), { easy: 3, medium: 4, hard: 3 });

const mistakeWindow = load('js/quiz.js', quizWindow('?mode=mistakes', pool, { byQuiz: { 'medium-1': { lastAnswerCorrect: false, lastAnsweredAt: '2026-08-03T00:00:00Z' }, 'easy-1': { lastAnswerCorrect: true } }, attempts: [] }));
assert.deepEqual(Array.from(mistakeWindow.EnglishRadarQuizEngine.getQuestions(), (item) => item.id), ['medium-1']);
const signalWindow = load('js/quiz.js', quizWindow('?mode=signal&signal=hard-signal-2', pool));
assert.ok(signalWindow.EnglishRadarQuizEngine.getQuestions().every((item) => item.signalId === 'hard-signal-2'));

const imported = Array.from({ length: 5 }, (_, index) => ({ id: `imported-${index}`, term: `term ${index}`, category: 'Imported', meaningEn: `meaning ${index}`, meaningZh: `含义 ${index}`, exampleEn: `Example ${index}.`, useWhen: `Use it in context ${index}.`, avoidWhen: `Avoid it in boundary ${index}.` }));
const generatorWindow = { EnglishRadarContent: { getImportedSignals: () => imported }, ENGLISH_RADAR_QUIZZES: [] };
load('js/imported-quiz-generator.js', generatorWindow);
const generated = generatorWindow.EnglishRadarImportedQuizGenerator.createForSignals(imported);
assert.equal(generated.length, 15);
assert.deepEqual(generated.reduce((counts, item) => { counts[item.questionType] += 1; return counts; }, { meaning: 0, context: 0, boundary: 0 }), { meaning: 5, context: 5, boundary: 5 });
assert.ok(generated.every((item) => item.prompt && item.questionType && item.difficulty && item.options.length === 4 && item.correctOptionId && item.explanation));
const incompleteWindow = { EnglishRadarContent: { getImportedSignals: () => [Object.assign({}, imported[0], { avoidWhen: 'unknown' })] }, ENGLISH_RADAR_QUIZZES: [] };
load('js/imported-quiz-generator.js', incompleteWindow);
assert.equal(incompleteWindow.EnglishRadarImportedQuizGenerator.createForSignals(incompleteWindow.EnglishRadarContent.getImportedSignals()).length, 0);

console.log('English Radar v1.1 Quiz Engine tests passed.');
