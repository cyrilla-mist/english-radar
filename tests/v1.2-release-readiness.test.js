'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const pages = ['index.html', 'learn.html', 'dictionary.html', 'inbox.html', 'quiz.html', 'me.html'];

for (const page of pages) {
  const html = read(page);
  assert.match(html, /v1\.2\.0/i, `${page} should expose v1.2.0`);
  assert.doesNotMatch(html, /v1\.1\.1/i, `${page} should not expose the previous patch version`);
  assert.match(html, /components\.css\?v=1\.2\.0/);
  assert.match(html, /responsive\.css\?v=1\.2\.0/);
  for (const resource of [
    'ui-vocabulary-core-pack.js',
    'interface-learning.js'
  ]) assert.match(html, new RegExp(`${resource.replace('.', '\\.')}\\?v=1\\.2\\.0`), `${page} should cache-bust ${resource}`);
  const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1].split('?')[0]);
  assert.equal(scripts.length, new Set(scripts).size, `${page} should not load duplicate scripts`);
}

assert.match(read('index.html'), /dashboard\.js\?v=1\.2\.0/);
assert.match(read('learn.html'), /learning-engine\.js\?v=1\.2\.0/);
assert.match(read('learn.html'), /session\.js\?v=1\.2\.0/);
assert.match(read('dictionary.html'), /dictionary\.js\?v=1\.2\.0/);
assert.match(read('quiz.html'), /quiz-registry\.js\?v=1\.2\.0/);
assert.match(read('quiz.html'), /quiz\.js\?v=1\.2\.0/);
assert.match(read('me.html'), /me\.js\?v=1\.2\.0/);

const context = vm.createContext({ window: {}, console });
vm.runInContext(read('data/signals.js'), context);
vm.runInContext(read('data/quizzes.js'), context);
vm.runInContext(read('data/ui-vocabulary-quizzes.js'), context);
vm.runInContext(read('js/quiz-registry.js'), context);
const coreSignals = context.window.ENGLISH_RADAR_SIGNALS;
const coreQuizzes = context.window.ENGLISH_RADAR_QUIZZES;
const uiQuizzes = context.window.ENGLISH_RADAR_UI_VOCABULARY_QUIZZES;
const registry = context.window.EnglishRadarQuizRegistry;
assert.equal(coreSignals.length, 60, 'Core Signal count must remain 60');
assert.equal(coreQuizzes.length, 120, 'runtime Core Quiz count must remain 120');
assert.equal(uiQuizzes.length, 20, 'UI Quiz count must remain 20');
assert.equal(registry.getStaticQuizzes().length, 140, 'static Quiz registry count must remain 140');

const storageSource = read('js/storage.js');
for (const key of ['englishRadar_customSignals', 'englishRadar_progress', 'englishRadar_quizHistory', 'englishRadar_syncSettings']) {
  assert.match(storageSource, new RegExp(key));
}
assert.match(storageSource, /dataVersion:\s*1/);
assert.match(storageSource, /contentVersion:\s*1/);
const interfaceSource = read('js/interface-learning.js');
assert.match(interfaceSource, /sessionStorage/);
assert.doesNotMatch(interfaceSource, /localStorage/);
assert.match(read('js/quiz.js'), /mode === 'interface'/);
assert.match(read('js/quiz.js'), /getInterfaceQuizzes/);
assert.match(read('js/dictionary.js'), /UI Vocabulary/);
assert.match(read('js/learning-engine.js'), /radarType === 'interface'/);

console.log('V1.2 release readiness checks passed.');
