const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

class Element {
  constructor(tag = 'div') { this.tagName = tag.toUpperCase(); this.children = []; this.attributes = {}; this.dataset = {}; this.hidden = false; this.textContent = ''; this.style = {}; this.listeners = {}; this.className = ''; }
  appendChild(child) { this.children.push(child); child.parentNode = this; return child; }
  setAttribute(name, value) { this.attributes[name] = String(value); if (name.startsWith('data-')) this.dataset[name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = String(value); }
  getAttribute(name) { return this.attributes[name] === undefined ? null : this.attributes[name]; }
  addEventListener(name, handler) { (this.listeners[name] ||= []).push(handler); }
  querySelector(selector) { if (selector === '[data-category-toggle-en]') return this.toggleEn; if (selector === '[data-category-toggle-zh]') return this.toggleZh; if (selector === '.category-toggle-mark') return this.mark; return null; }
  querySelectorAll() { return []; }
  click() { (this.listeners.click || []).forEach((handler) => handler({ preventDefault() {} })); }
}

const section = new Element('section');
const toggle = new Element('button');
toggle.setAttribute('data-category-toggle', '');
toggle.setAttribute('aria-expanded', 'true');
toggle.toggleEn = new Element('span');
toggle.toggleZh = new Element('small');
toggle.mark = new Element('span');
const list = new Element('div');
list.setAttribute('data-category-list', '');
const count = new Element('strong');
const document = {
  activeElement: null,
  querySelector(selector) {
    if (selector === '[data-category-coverage-section]') return section;
    if (selector === '[data-category-toggle]') return toggle;
    if (selector === '[data-category-list]') return list;
    if (selector === '[data-category-count]') return count;
    return null;
  },
  querySelectorAll() { return []; },
  createElement(tag) { return new Element(tag); },
  addEventListener() {},
  dispatchEvent() {}
};

const writes = [];
const signals = [
  { id: 'one', category: 'Internet Culture' },
  { id: 'two', category: 'Product Design' },
  { id: 'three', category: 'Product Design' }
];
const context = {
  window: {
    EnglishRadarContent: { getActiveLearningSignals: () => signals, getCoreSignals: () => signals, getImportedSignals: () => [], getPersonalSignals: () => [] },
    EnglishRadarStorage: {
      getProgress: () => ({}),
      getQuizHistory: () => ({ attempts: [], byQuiz: {} }),
      getInbox: () => [],
      getQuizMistakeIds: () => [],
      getCustomSignals: () => ({ packs: [], signals: {} })
    },
    matchMedia: () => ({ matches: true, addEventListener() {} })
  },
  document,
  Event: function Event() {},
  console,
  Date,
  Intl,
  Number,
  String,
  Math,
  Object,
  Array,
  encodeURIComponent
};
context.window.Event = context.Event;
vm.runInNewContext(read('js/me.js'), context, { filename: 'js/me.js' });

assert.equal(toggle.getAttribute('aria-expanded'), 'false');
assert.equal(list.hidden, true);
assert.equal(toggle.toggleEn.textContent, 'Show categories');
assert.equal(toggle.toggleZh.textContent, '展开分类');
assert.equal(count.textContent, '2 categories');
toggle.click();
assert.equal(toggle.getAttribute('aria-expanded'), 'true');
assert.equal(list.hidden, false);
assert.equal(toggle.toggleEn.textContent, 'Hide categories');
assert.equal(toggle.toggleZh.textContent, '收起分类');
assert.equal(writes.length, 0);
const source = read('js/me.js');
assert(source.includes('toggle.dataset.initialized'));
assert(source.includes("aria-expanded"));
assert(source.includes("(max-width: 767px)"));
console.log('PASS: V1.2 mobile Category Coverage collapse checks');
