const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const context = vm.createContext({ window: {}, console });
vm.runInContext(read('data/signals.js'), context);
vm.runInContext(read('data/quizzes.js'), context);
vm.runInContext(read('data/ui-vocabulary-quizzes.js'), context);
vm.runInContext(read('js/quiz-registry.js'), context);

const core = context.window.ENGLISH_RADAR_QUIZZES;
const ui = context.window.ENGLISH_RADAR_UI_VOCABULARY_QUIZZES;
const registry = context.window.EnglishRadarQuizRegistry;
assert.equal(core.length, 120, 'Core Quiz runtime count must remain 120');
assert.equal(ui.length, 20, 'UI Quiz count must be exactly 20');
assert.equal(registry.getStaticQuizzes().length, 140, 'Static Quiz registry should contain 140 questions');
assert.equal(new Set(ui.map((question) => question.id)).size, 20);
const counts = new Map();
const signalIds = new Set();
ui.forEach((question) => {
  assert.match(question.signalId, /^ui-/);
  signalIds.add(question.signalId);
  counts.set(question.signalId, (counts.get(question.signalId) || 0) + 1);
  assert.ok(question.prompt && question.explanationEn && question.explanationZh);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.id)).size, 4);
  assert.ok(question.options.some((option) => option.id === question.correctOptionId));
});
assert.equal(signalIds.size, 10);
counts.forEach((count) => assert.equal(count, 2));
assert.deepEqual(Array.from(registry.getQuizzesForSignal('ui-sync'), (question) => question.id), ['uiq-sync-meaning', 'uiq-sync-boundary']);
console.log('PASS: V1.2 UI Vocabulary Quiz data and registry checks');
