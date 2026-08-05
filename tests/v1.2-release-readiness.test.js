'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const pages = ['index.html', 'learn.html', 'dictionary.html', 'inbox.html', 'quiz.html', 'me.html', '404.html'];
const mainPages = pages.slice(0, 6);

for (const page of pages) {
  const html = read(page);
  assert.match(html, /v1\.2\.1/i, `${page} should expose v1.2.1`);
  assert.doesNotMatch(html, /v1\.2\.0/i, `${page} should not expose the previous release version`);
  assert.doesNotMatch(html, /v1\.1\.1/i, `${page} should not expose the previous patch version`);
  assert.match(html, /components\.css\?v=1\.2\.1/);
  assert.match(html, /responsive\.css\?v=1\.2\.1/);
  if (mainPages.includes(page)) {
    for (const resource of [
      'ui-vocabulary-core-pack.js',
      'interface-learning.js'
    ]) assert.match(html, new RegExp(`${resource.replace('.', '\\.')}\\?v=1\\.2\\.1`), `${page} should cache-bust ${resource}`);
  }
  const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1].split('?')[0]);
  assert.equal(scripts.length, new Set(scripts).size, `${page} should not load duplicate scripts`);
}

assert.match(read('index.html'), /dashboard\.js\?v=1\.2\.1/);
assert.match(read('learn.html'), /learning-engine\.js\?v=1\.2\.1/);
assert.match(read('learn.html'), /session\.js\?v=1\.2\.1/);
assert.match(read('dictionary.html'), /dictionary\.js\?v=1\.2\.1/);
assert.match(read('quiz.html'), /quiz-registry\.js\?v=1\.2\.1/);
assert.match(read('quiz.html'), /quiz\.js\?v=1\.2\.1/);
assert.match(read('me.html'), /me\.js\?v=1\.2\.1/);
for (const page of mainPages) {
  const html = read(page);
  if (html.includes('page-footer')) assert.match(html, /ENGLISH RADAR \/ V1\.2\.1/);
}

const readme = read('README.md');
assert.match(readme, /English Radar v1\.2\.1 is the current maintenance release on `main`/);
assert.doesNotMatch(readme, /PR #3 remains open|is not merged|release candidate on `feat\/v1\.2-interface-learning`/i);
assert.ok(fs.existsSync(path.join(root, 'docs/v1.2.1-release-notes.md')));
assert.ok(fs.existsSync(path.join(root, 'docs/production-release-checklist.md')));

const context = vm.createContext({ window: {}, console });
vm.runInContext(read('data/signals.js'), context);
vm.runInContext(read('data/quizzes.js'), context);
vm.runInContext(read('data/ui-vocabulary-core-pack.js'), context);
vm.runInContext(read('data/ui-vocabulary-quizzes.js'), context);
vm.runInContext(read('js/quiz-registry.js'), context);
const coreSignals = context.window.ENGLISH_RADAR_SIGNALS;
const coreQuizzes = context.window.ENGLISH_RADAR_QUIZZES;
const uiQuizzes = context.window.ENGLISH_RADAR_UI_VOCABULARY_QUIZZES;
const uiPack = context.window.ENGLISH_RADAR_UI_VOCABULARY_PACK;
const registry = context.window.EnglishRadarQuizRegistry;
assert.equal(coreSignals.length, 60, 'Core Signal count must remain 60');
assert.equal(coreQuizzes.length, 120, 'runtime Core Quiz count must remain 120');
assert.equal(uiQuizzes.length, 20, 'UI Quiz count must remain 20');
assert.equal(uiPack.signals.length, 10, 'UI Vocabulary Signal count must remain 10');
assert.equal(registry.getStaticQuizzes().length, 140, 'static Quiz registry count must remain 140');

const storageSource = read('js/storage.js');
for (const key of ['englishRadar_progress', 'englishRadar_currentSession', 'englishRadar_settings', 'englishRadar_inbox', 'englishRadar_quizHistory', 'englishRadar_customSignals', 'englishRadar_syncSettings', 'englishRadar_syncHistory']) {
  assert.match(storageSource, new RegExp(key));
}
assert.deepEqual([...storageSource.matchAll(/'((?:englishRadar)_[A-Za-z]+)'/g)].map((match) => match[1]), [
  'englishRadar_progress', 'englishRadar_currentSession', 'englishRadar_settings', 'englishRadar_inbox',
  'englishRadar_quizHistory', 'englishRadar_customSignals', 'englishRadar_syncSettings', 'englishRadar_syncHistory'
]);
assert.match(storageSource, /dataVersion:\s*1/);
assert.match(storageSource, /contentVersion:\s*1/);
const interfaceSource = read('js/interface-learning.js');
assert.match(interfaceSource, /sessionStorage/);
assert.doesNotMatch(interfaceSource, /localStorage/);
assert.match(read('js/quiz.js'), /mode === 'interface'/);
assert.match(read('js/quiz.js'), /getInterfaceQuizzes/);
assert.match(read('js/dictionary.js'), /UI Vocabulary/);
assert.match(read('js/learning-engine.js'), /radarType === 'interface'/);

const workerChanges = require('node:child_process').execFileSync('git', ['diff', '--name-only', 'HEAD^1', 'HEAD'], { cwd: root, encoding: 'utf8' });
assert.doesNotMatch(workerChanges, /(^|\r?\n)worker\//, 'Worker files must remain unchanged');

console.log('V1.2.1 release readiness checks passed.');
