'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
function source(file) { return fs.readFileSync(path.join(root, file), 'utf8'); }
function run(file, windowValue) { vm.runInNewContext(source(file), { window: windowValue, Date, Object, Array, String, Math, URLSearchParams, console }); return windowValue; }

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

let learningCustomReads = 0;
let learningProgressReads = 0;
const learningWindow = {
  location: { search: '' },
  ENGLISH_RADAR_SIGNALS: core.concat(imported),
  EnglishRadarStorage: {
    getCustomSignals: () => { learningCustomReads += 1; return { signals: {} }; },
    getInbox: () => [],
    getProgress: () => { learningProgressReads += 1; return {}; }
  },
  ENGLISH_RADAR_QUIZZES: []
};
run('js/content-registry.js', learningWindow);
const learningRegistryMethod = learningWindow.EnglishRadarContent.getActiveLearningSignals;
run('js/learning-engine.js', learningWindow);
const snapshotOne = learningWindow.EnglishRadarLearningEngine.getTodaySnapshot();
assert.equal(learningWindow.EnglishRadarLearningEngine.getTodaySnapshot(), snapshotOne);
assert.equal(learningCustomReads, 1, 'Today should read a large customSignals payload once.');
assert.equal(learningProgressReads, 1, 'Today should read progress once.');
assert.equal(learningWindow.EnglishRadarContent.getActiveLearningSignals, learningRegistryMethod, 'Learning Engine must not replace Registry methods.');
assert.equal(snapshotOne.signals.length, 801);

const dictionarySource = source('js/dictionary.js');
assert.match(dictionarySource, /visibleCount\s*=\s*50/);
assert.match(dictionarySource, /filtered\.slice\(0, visibleCount\)/);
assert.match(dictionarySource, /createDocumentFragment/);
assert.match(dictionarySource, /setTimeout\(function \(\)/);
assert.match(dictionarySource, /150/);

const debugSource = source('js/performance-debug.js');
assert.match(debugSource, /debug=performance/);
assert.match(debugSource, /data-performance-panel/);
assert.match(debugSource, /Copy report/);
assert.match(debugSource, /Refresh measurement/);
assert.match(debugSource, /duplicateCallWarnings/);
assert.match(debugSource, /navigator\.clipboard/);
assert.match(debugSource, /execCommand\('copy'\)/);
assert.match(debugSource, /data-performance-raw/);
assert.match(debugSource, /Download report/);
assert.match(debugSource, /application\/json/);
assert.match(debugSource, /Clipboard unavailable/);
assert.match(debugSource, /Copy failed/);
assert.doesNotMatch(debugSource, /innerHTML/);
assert.doesNotMatch(debugSource, /adminToken|exampleEn|meaningZh|displayTerm/);
const normalWindow = { location: { search: '' } };
vm.runInNewContext(debugSource, { window: normalWindow });
assert.equal(normalWindow.EnglishRadarPerformanceDebug, undefined, 'Normal URLs must not initialize performance diagnostics.');
const storageSource = source('js/storage.js');
assert.match(storageSource, /JSON\.parse/);
assert.match(storageSource, /debug\.record\('JSON\.parse'/);
const bootstrapSource = source('js/performance-bootstrap.js');
assert.match(bootstrapSource, /performanceObject\.timeOrigin/);
assert.match(bootstrapSource, /getEntriesByType\('navigation'\)/);
assert.match(bootstrapSource, /getEntriesByType\('resource'\)/);
assert.match(bootstrapSource, /PerformanceObserver/);
assert.match(bootstrapSource, /first-contentful-paint/);
assert.doesNotMatch(bootstrapSource, /startedAt\s*=\s*Date\.now/);
assert.doesNotMatch(debugSource, /setTimeout\(publish/);
['index.html', 'learn.html', 'dictionary.html', 'quiz.html', 'me.html'].forEach((file) => {
  const html = source(file);
  const bootstrapIndex = html.indexOf('performance-bootstrap.js');
  const cssIndex = html.indexOf('css/tokens.css');
  assert.ok(bootstrapIndex !== -1 && bootstrapIndex < cssIndex, `${file} should load performance bootstrap before CSS.`);
});

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
