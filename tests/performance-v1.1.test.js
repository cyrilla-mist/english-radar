'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
function source(file) { return fs.readFileSync(path.join(root, file), 'utf8'); }
function run(file, windowValue) { vm.runInNewContext(source(file), { window: windowValue, Date, Object, Array, String, Math, console }); return windowValue; }

const core = [{ id: 'core-1', term: 'core', category: 'Internet Culture', meaningZh: '核心', exampleEn: 'Core example.' }];
const imported = Array.from({ length: 800 }, (_, index) => ({ id: `imported-${index}`, term: `term ${index}`, category: 'Imported', meaningZh: `含义 ${index}`, exampleEn: `Example ${index}.`, contentStatus: 'active' }));
let customReads = 0;
const registryWindow = { ENGLISH_RADAR_SIGNALS: core, EnglishRadarStorage: { getCustomSignals: () => { customReads += 1; return { signals: Object.fromEntries(imported.map((item) => [item.id, item])) }; }, getInbox: () => [] } };
run('js/content-registry.js', registryWindow);
assert.equal(registryWindow.EnglishRadarContent.getImportedSignals().length, 800);
registryWindow.EnglishRadarContent.getActiveLearningSignals();
registryWindow.EnglishRadarContent.getDictionarySignals();
registryWindow.EnglishRadarContent.getSignalSource('imported-799');
assert.equal(customReads, 1, 'Content Registry should read imported data once per page lifecycle.');
registryWindow.EnglishRadarContent.invalidate();
registryWindow.EnglishRadarContent.getActiveLearningSignals();
assert.equal(customReads, 2, 'Cache should refresh after explicit invalidation.');

const dictionarySource = source('js/dictionary.js');
assert.match(dictionarySource, /visibleCount\s*=\s*50/);
assert.match(dictionarySource, /filtered\.slice\(0, visibleCount\)/);
assert.match(dictionarySource, /createDocumentFragment/);
assert.match(dictionarySource, /setTimeout\(function \(\)/);
assert.match(dictionarySource, /150/);

const importedWindow = { EnglishRadarContent: { getImportedSignals: () => imported }, ENGLISH_RADAR_QUIZZES: [{ id: 'core-quiz', signalId: 'core-1' }] };
run('js/imported-quiz-generator.js', importedWindow);
assert.equal(importedWindow.ENGLISH_RADAR_QUIZZES.length, 1, 'Imported quizzes must not be generated during script initialization.');
const first = imported[0];
const generated = importedWindow.EnglishRadarImportedQuizGenerator.createForSignals([first]);
assert.ok(generated.length <= 3);
assert.equal(importedWindow.EnglishRadarImportedQuizGenerator.stats().cachedSignals, 1);
assert.equal(importedWindow.EnglishRadarImportedQuizGenerator.createForSignals([first]).length, generated.length);

const quizSource = source('js/quiz.js');
assert.match(quizSource, /getQuizHistory/);
assert.doesNotMatch(quizSource, /resetQuizHistory/);
console.log('English Radar v1.1 performance structure tests passed.');
