const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const pageFiles = ['index.html', 'learn.html', 'dictionary.html', 'inbox.html', 'quiz.html', 'me.html'];
const expectedIds = ['ui-daily-mix', 'ui-signal', 'ui-session', 'ui-inbox', 'ui-dictionary', 'ui-archive', 'ui-sync', 'ui-profile', 'ui-review', 'ui-quiz'];
pageFiles.forEach((file) => {
  const html = read(file);
  assert(html.includes('./data/ui-vocabulary-core-pack.js'), `${file} should load UI Vocabulary data`);
  assert(html.includes('./js/interface-learning.js'), `${file} should load Interface Learning`);
  assert(html.indexOf('./data/ui-vocabulary-core-pack.js') < html.indexOf('./js/content-registry.js'), `${file} should load pack before registry`);
  assert(html.indexOf('./js/content-registry.js') < html.indexOf('./js/interface-learning.js'), `${file} should load interface mode after registry`);
});
const packSource = read('data/ui-vocabulary-core-pack.js');
expectedIds.forEach((id) => assert(packSource.includes(`id: '${id}'`), `UI Vocabulary pack should contain ${id}`));

class ClassList {
  constructor() { this.values = new Set(); }
  add(value) { this.values.add(value); }
  remove(value) { this.values.delete(value); }
  contains(value) { return this.values.has(value); }
  toggle(value, force) { const next = force === undefined ? !this.values.has(value) : force; if (next) this.add(value); else this.remove(value); return next; }
}
class Element {
  constructor(tag = 'div') { this.tagName = tag.toUpperCase(); this.children = []; this.parentNode = null; this.attributes = {}; this.dataset = {}; this.className = ''; this.classList = new ClassList(); this.hidden = false; this.textContent = ''; this.listeners = {}; this.style = {}; this.href = ''; }
  appendChild(child) { this.children.push(child); child.parentNode = this; return child; }
  setAttribute(name, value) { this.attributes[name] = String(value); if (name.startsWith('data-')) this.dataset[name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = String(value); if (name === 'id') this.id = String(value); }
  getAttribute(name) { return this.attributes[name] === undefined ? null : this.attributes[name]; }
  removeAttribute(name) { delete this.attributes[name]; }
  addEventListener(name, handler) { (this.listeners[name] ||= []).push(handler); }
  focus() { this.ownerDocument.activeElement = this; }
  click() { (this.listeners.click || []).forEach((handler) => handler({ preventDefault() {} })); }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  querySelectorAll(selector) {
    const all = this.children.flatMap((child) => [child, ...child.querySelectorAll(selector)]);
    if (selector.startsWith('.')) return all.filter((node) => node.classList.contains(selector.slice(1)) || node.className.split(' ').includes(selector.slice(1)));
    if (selector.startsWith('#')) return all.filter((node) => node.id === selector.slice(1));
    if (selector.startsWith('[')) { const match = selector.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/); return match ? all.filter((node) => node.getAttribute(match[1]) !== null && (match[2] === undefined || node.getAttribute(match[1]) === match[2])) : []; }
    return all.filter((node) => node.tagName === selector.toUpperCase());
  }
}
class Document extends Element {
  constructor() { super('document'); this.body = new Element('body'); this.body.ownerDocument = this; this.appendChild(this.body); this.listeners = {}; this.activeElement = null; }
  createElement(tag) { const node = new Element(tag); node.ownerDocument = this; return node; }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  addEventListener(name, handler) { (this.listeners[name] ||= []).push(handler); }
}

const document = new Document();
const header = document.createElement('header'); header.className = 'page-header'; document.body.appendChild(header);
const target = document.createElement('strong'); target.setAttribute('data-ui-term', 'ui-daily-mix'); target.textContent = 'Daily Mix'; header.appendChild(target);
const sessionStorage = { values: {}, getItem(key) { return this.values[key] || null; }, setItem(key, value) { this.values[key] = value; }, removeItem(key) { delete this.values[key]; } };
let installed = false;
const signal = { id: 'ui-daily-mix', term: 'daily mix', displayTerm: 'DAILY MIX', pronunciation: '/ˈdeɪli mɪks/', chineseFeeling: '每日精选', productMeaningEn: 'A ready-to-use set for today.', productMeaningZh: '今天可以直接使用的一组内容。', whyProductsUseItEn: 'It makes a changing set easy to start.', whyProductsUseItZh: '让不断变化的内容更容易开始。', confusedWith: [{ term: 'playlist', differenceZh: 'Playlist is usually saved; Daily Mix is refreshed.' }] };
const context = {
  window: {
    sessionStorage,
    ENGLISH_RADAR_UI_VOCABULARY_PACK: { app: 'English Radar Content Pack', pack: { id: 'english-radar-ui-vocabulary-core' }, signals: [signal] },
    EnglishRadarContent: { getSignalById: () => installed ? signal : null }
  },
  document,
  encodeURIComponent,
  console
};
vm.runInNewContext(read('js/interface-learning.js'), context, { filename: 'js/interface-learning.js' });

const toggle = document.querySelector('[data-interface-mode-toggle]');
assert(toggle, 'mode toggle should be created');
assert.equal(toggle.getAttribute('aria-pressed'), 'false');
assert.equal(target.getAttribute('role'), null);
toggle.click();
assert.equal(toggle.getAttribute('aria-pressed'), 'true');
assert.equal(sessionStorage.getItem('englishRadar.interfaceLearningMode'), 'on');
assert.equal(target.getAttribute('role'), 'button');
assert.equal(target.getAttribute('tabindex'), '0');
target.click();
const panel = document.querySelector('[role="dialog"]');
assert(panel && panel.hidden === false, 'target should open the learning panel');
assert.equal(panel.querySelector('#interface-learning-title').textContent, 'DAILY MIX');
assert.equal(panel.querySelector('.interface-learning-link').href, './me.html#content-library');
panel.querySelector('.interface-learning-close').click();
assert.equal(panel.hidden, true);
toggle.click();
assert.equal(toggle.getAttribute('aria-pressed'), 'false');
assert.equal(sessionStorage.getItem('englishRadar.interfaceLearningMode'), null);
assert.equal(target.getAttribute('role'), null);
assert.equal(target.getAttribute('tabindex'), null);

const source = read('js/interface-learning.js');
assert(source.includes("querySelectorAll('[data-ui-term]')"));
assert(!source.includes('document.body.querySelectorAll'));
assert(!source.includes('.innerHTML'));
assert(source.includes('sessionStorage'));
assert(source.includes('aria-modal'));
console.log('PASS: V1.2 Interface Learning Mode interaction and safety checks');
