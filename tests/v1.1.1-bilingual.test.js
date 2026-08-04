const assert = require('assert');
const fs = require('fs');
const vm = require('vm');

const root = __dirname + '/..';
const read = (file) => fs.readFileSync(root + '/' + file, 'utf8');

const copy = read('js/ui-copy.js');
assert(copy.includes('Today: \'今日学习\''));
assert(copy.includes('Daily Mix'));
['index.html', 'learn.html', 'dictionary.html', 'inbox.html', 'me.html', 'quiz.html'].forEach((file) => assert(read(file).includes('./js/ui-copy.js'), `${file} loads centralized UI copy`));

const session = read('js/session.js');
assert(session.includes('useWhenZh') && session.includes('avoidWhenZh'));
assert(session.includes('该词条的中文使用说明尚未补充'));
assert(read('learn.html').includes('data-profile-zh="platforms"'));

const quiz = read('js/quiz.js');
assert(quiz.includes('explanationZh'));
assert(quiz.includes('中文解释暂未补充'));

const notion = read('js/notion-sync.js');
assert(notion.includes('originalSignalId') && notion.includes('normalizedSignalId'));
assert(notion.includes('invalidRecords'));
assert(notion.includes('toLowerCase()'));

const me = read('me.html');
assert(me.includes('CONTENT LIBRARY') && me.includes('NOTION SYNC') && me.includes('DATA &amp; BACKUP'));
assert(read('js/ui-copy.js').includes('meCollapsible'));

const context = { window: { EnglishRadarContent: {
  normalizeSignal(raw) { return raw && raw.id === 'icr-20260803-based' && raw.term && raw.category && raw.meaningZh && raw.exampleEn ? { ...raw, id: raw.id } : null; },
  validateSignal(signal) { return !!signal && !!signal.id && !!signal.term && !!signal.category && !!signal.meaningZh && !!signal.exampleEn; },
  getDictionarySignals() { return []; }, findPotentialDuplicates() { return []; }, getSignalSource() { return null; }
}, EnglishRadarStorage: null }, URLSearchParams, URL, AbortController, fetch: async () => { throw new Error('not called'); }, console, Date, setTimeout, clearTimeout };
vm.runInNewContext(read('js/notion-sync.js'), context);
const api = context.window.EnglishRadarNotionSync;
const payload = api.normalizeSyncPayload({ schemaVersion: 1, source: 'notion', records: [
  { notionPageId: 'page-1', signal: { id: 'ICR-20260803-based', term: 'based', category: 'Internet Culture', meaningZh: '认可', exampleEn: 'Based.' } },
  { notionPageId: 'page-2', signal: { id: 'INVALID', term: '', category: 'Internet Culture', meaningZh: '', exampleEn: '' } }
] });
assert.strictEqual(payload.records[0].signal.id, 'icr-20260803-based');
assert.strictEqual(payload.invalidRecords.length, 1);
const preview = api.previewNotionSync(payload);
assert.strictEqual(preview.invalid, 1);

console.log('PASS: v1.1.1 bilingual, compatibility and Notion normalization checks');
