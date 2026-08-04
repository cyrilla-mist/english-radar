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
const dataContext = { window: {} };
vm.runInNewContext(read('data/signals.js'), dataContext);
vm.runInNewContext(read('data/quizzes.js'), dataContext);
const coreSignals = dataContext.window.ENGLISH_RADAR_SIGNALS;
const staticQuizzes = dataContext.window.ENGLISH_RADAR_QUIZZES;
assert.equal(coreSignals.length, 60);
assert(coreSignals.every((signal) => signal.useWhenZh && signal.avoidWhenZh));
assert.equal(new Set(coreSignals.map((signal) => signal.useWhenZh)).size, 60);
assert.equal(new Set(coreSignals.map((signal) => signal.avoidWhenZh)).size, 60);
assert.equal(staticQuizzes.length, 120);
assert(staticQuizzes.every((question) => question.explanationZh && question.explanationZh !== (coreSignals.find((signal) => signal.id === question.signalId) || {}).meaningZh));

const notion = read('js/notion-sync.js');
assert(notion.includes('originalSignalId') && notion.includes('normalizedSignalId'));
assert(notion.includes('invalidRecords'));
assert(notion.includes('toLowerCase()'));

const me = read('me.html');
assert(me.includes('CONTENT LIBRARY') && me.includes('NOTION SYNC') && me.includes('DATA &amp; BACKUP'));
assert(read('js/ui-copy.js').includes('meCollapsible'));

class FakeClassList {
  constructor() { this.values = new Set(); }
  contains(value) { return this.values.has(value); }
  add(value) { this.values.add(value); }
}
class FakeElement {
  constructor(tag, text = '', classes = []) { this.tagName = tag.toUpperCase(); this.textContent = text; this.childNodes = [{ nodeType: 3, textContent: text }]; this.children = []; this.classList = new FakeClassList(); classes.forEach((value) => this.classList.add(value)); this.attributes = {}; this.dataset = {}; this.hidden = false; this.listeners = {}; Object.defineProperty(this, 'className', { get: () => Array.from(this.classList.values).join(' '), set: (value) => String(value).split(/\s+/).filter(Boolean).forEach((item) => this.classList.add(item)) }); }
  appendChild(child) { if (child.parent) child.parent.children = child.parent.children.filter((item) => item !== child); child.parent = this; this.children.push(child); return child; }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  querySelectorAll(selector) {
    const all = this.children.flatMap((child) => [child, ...child.querySelectorAll(selector)]);
    if (selector === ':scope > .section-label') return this.children.filter((child) => child.classList.contains('section-label'));
    if (selector === '.zh-helper') return all.filter((child) => child.classList.contains('zh-helper'));
    if (selector === '.me-collapse-toggle') return all.filter((child) => child.classList.contains('me-collapse-toggle'));
    return all;
  }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  addEventListener(name, fn) { this.listeners[name] = fn; }
  click() { if (this.listeners.click) this.listeners.click({ preventDefault() {} }); }
}
class FakeDocument extends FakeElement {
  constructor() { super('document'); this.readyState = 'complete'; }
  createElement(tag) { return new FakeElement(tag); }
  addEventListener() {}
  querySelectorAll(selector) {
    const all = this.children.flatMap((child) => [child, ...child.querySelectorAll(selector)]);
    if (selector.includes('.side-nav')) return all.filter((child) => child.classList.contains('nav-item'));
    if (selector.includes('.mobile-nav')) return all.filter((child) => child.classList.contains('mobile-link'));
    if (selector === '.section-label, .block-label, .eyebrow') return all.filter((child) => child.classList.contains('section-label') || child.classList.contains('block-label') || child.classList.contains('eyebrow'));
    if (selector === '.me-section') return all.filter((child) => child.classList.contains('me-section'));
    if (selector.includes('button')) return all.filter((child) => child.tagName === 'BUTTON');
    return all;
  }
}
const dom = new FakeDocument();
const nav = new FakeElement('a', 'Today', ['nav-item']); nav.setAttribute('href', './index.html'); dom.appendChild(nav);
const mobile = new FakeElement('a', 'Today', ['mobile-link']); mobile.setAttribute('href', './index.html'); dom.appendChild(mobile);
const action = new FakeElement('button', 'Start Library Session'); dom.appendChild(action);
['CONTENT LIBRARY', 'NOTION SYNC', 'PREFERENCES', 'DATA & BACKUP'].forEach((title) => { const section = new FakeElement('section', '', ['me-section']); const label = new FakeElement('div', title, ['section-label']); const content = new FakeElement('div'); content.appendChild(new FakeElement('button', 'Save settings')); section.appendChild(label); section.appendChild(content); dom.appendChild(section); });
const uiContext = { document: dom, window: {}, console };
vm.runInNewContext(copy, uiContext);
assert.equal(nav.children.find((child) => child.classList.contains('zh-helper')).textContent, '今日学习');
assert.equal(action.children.find((child) => child.classList.contains('zh-helper')).textContent, '开始学习');
assert(read('js/session.js').includes('暂无标准中文标签'));
const compactSections = dom.querySelectorAll('.me-section');
assert.equal(compactSections.length, 4);
compactSections.forEach((section) => { const button = section.querySelector('.me-collapse-toggle'); assert.equal(button.getAttribute('aria-expanded'), 'false'); assert.equal(section.children[1].hidden, true); assert(button.getAttribute('aria-controls')); button.click(); assert.equal(section.children[1].hidden, false); assert.equal(button.getAttribute('aria-expanded'), 'true'); assert.equal(button.textContent, 'Collapse · 收起'); assert(section.children[1].querySelector('button')); });

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
