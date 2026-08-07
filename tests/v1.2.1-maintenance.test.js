'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const pageFiles = ['index.html', 'learn.html', 'dictionary.html', 'inbox.html', 'quiz.html', 'me.html', '404.html'];

for (const file of pageFiles) {
  const html = read(file);
  assert.match(html, /v1\.3\.0/i, `${file} should expose V1.3.0`);
  assert.doesNotMatch(html, /v1\.2\.1|v1\.2\.0|v1\.1\.1/i, `${file} contains stale user-visible version text`);
}

const mainHtml = pageFiles.slice(0, 6).map(read).join('\n');
assert.equal((mainHtml.match(/ENGLISH RADAR \/ V1\.3\.0/g) || []).length, 4);
const readme = read('README.md');
assert.match(readme, /current release on `main`/);
assert.doesNotMatch(readme, /release candidate|PR #3 remains open|is not merged|feat\/v1\.2-interface-learning/i);

const workflow = read('.github/workflows/v1.1-checks.yml');
assert.match(workflow, /name:\s*English Radar v1\.2 checks/);
assert.match(workflow, /pull_request:\s*\r?\n\s+branches:\s*\r?\n\s+- main/);
assert.match(workflow, /push:\s*\r?\n\s+branches:\s*\r?\n\s+- main/);
assert.match(workflow, /workflow_dispatch:/);

const notes = read('docs/v1.2.1-release-notes.md');
for (const heading of ['## Type', '## Fixed', '## Verified', '## Compatibility', '## Data counts']) assert.match(notes, new RegExp(heading));
assert.match(notes, /Maintenance release/);
const checklist = read('docs/production-release-checklist.md');
for (const heading of ['## Before merge', '## After merge', '## Browser smoke test', '## Mobile widths', '## Desktop widths', '## Final record']) assert.match(checklist, new RegExp(heading));
assert.match(checklist, /Worker Health Check succeeds/);
assert.match(checklist, /No Notion write is performed/);

console.log('PASS: V1.2.1 maintenance metadata and release hygiene checks');
