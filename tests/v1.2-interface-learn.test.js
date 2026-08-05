const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

class ClassList {
  constructor() { this.values = new Set(); }
  toggle(name, force) { const next = force === undefined ? !this.values.has(name) : force; if (next) this.values.add(name); else this.values.delete(name); return next; }
  add(name) { this.values.add(name); }
  remove(name) { this.values.delete(name); }
  contains(name) { return this.values.has(name); }
}
class Element {
  constructor(tag = 'div') { this.tagName = tag.toUpperCase(); this.children = []; this.parentNode = null; this.attributes = {}; this.dataset = {}; this.hidden = false; this.disabled = false; this.classList = new ClassList(); this.style = {}; this.textContent = ''; this.listeners = {}; this.value = ''; }
  appendChild(child) { child.parentNode = this; this.children.push(child); return child; }
  setAttribute(name, value) { this.attributes[name] = String(value); if (name.startsWith('data-')) this.dataset[name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = String(value); }
  getAttribute(name) { return this.attributes[name] === undefined ? null : this.attributes[name]; }
  addEventListener(name, fn) { (this.listeners[name] ||= []).push(fn); }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  querySelectorAll(selector) {
    const all = this.children.flatMap((child) => [child, ...child.querySelectorAll(selector)]);
    if (selector === '.signal-heading h1') return all.filter((node) => node.tagName === 'H1' && node.parentNode && node.parentNode.classList.contains('signal-heading'));
    if (selector === '.learn-progress span') return all.filter((node) => node.tagName === 'SPAN' && node.parentNode && node.parentNode.classList.contains('learn-progress'));
    if (selector === '[data-interface-field]') return all.filter((node) => node.getAttribute('data-interface-field'));
    if (selector === '[data-interface-section]') return all.filter((node) => node.getAttribute('data-interface-section'));
    if (selector === '[data-mastery]') return all.filter((node) => node.getAttribute('data-mastery'));
    if (selector === '[data-session-feedback]') return all.filter((node) => node.getAttribute('data-session-feedback') !== null);
    if (selector === '.side-nav .nav-item, .mobile-nav a') return [];
    if (selector.startsWith('[data-field="')) { const key = selector.match(/="([^"]*)"/)[1]; return all.filter((node) => node.getAttribute('data-field') === key); }
    if (selector.startsWith('[data-profile-zh="')) { const key = selector.match(/="([^"]*)"/)[1]; return all.filter((node) => node.getAttribute('data-profile-zh') === key); }
    if (selector.startsWith('[data-interface-list="')) { const key = selector.match(/="([^"]*)"/)[1]; return all.filter((node) => node.getAttribute('data-interface-list') === key); }
    if (selector.startsWith('[data-interface-section="')) { const key = selector.match(/="([^"]*)"/)[1]; return all.filter((node) => node.getAttribute('data-interface-section') === key); }
    if (selector.startsWith('[data-interface-') && selector.endsWith(']') && selector.indexOf('=') === -1) { const key = selector.slice(1, -1); return all.filter((node) => node.getAttribute(key) !== null); }
    if (selector.startsWith('[') && selector.endsWith(']')) { const match = selector.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/); if (match) return all.filter((node) => node.getAttribute(match[1]) !== null && (match[2] === undefined || node.getAttribute(match[1]) === match[2])); }
    if (selector.startsWith('.')) return all.filter((node) => node.classList.contains(selector.slice(1)));
    if (/^[a-z]+$/i.test(selector)) return all.filter((node) => node.tagName === selector.toUpperCase());
    return [];
  }
}
class Document extends Element {
  constructor() { super('document'); this.body = new Element('body'); this.appendChild(this.body); this.listeners = {}; }
  createElement(tag) { return new Element(tag); }
  createTextNode(value) { const node = new Element('#text'); node.textContent = String(value); return node; }
  addEventListener(name, fn) { (this.listeners[name] ||= []).push(fn); }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
}

function buildDocument() {
  const document = new Document();
  const add = (selector, element = new Element()) => { if (selector.includes(' ')) { const [parentSelector, childSelector] = selector.split(' '); const parent = add(parentSelector); const child = new Element(childSelector); parent.appendChild(child); return child; } if (selector.startsWith('.')) selector.slice(1).split(' ').forEach((name) => element.classList.add(name)); if (selector.startsWith('[')) { const match = selector.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/); if (match) element.setAttribute(match[1], match[2] || ''); } if (/^[a-z]+$/i.test(selector)) element = new Element(selector); document.body.appendChild(element); return element; };
  add('title', new Element('title'));
  ['.signal-detail', '.session-summary', '.empty-state', '.learn-progress', '.signal-stamp', '.signal-heading', '.signal-heading h1', '.pronunciation', '[data-session-meta]', '[data-field="category"]', '[data-speak-signal]', '[data-speak-example]', '[data-signal-favorite]', '[data-practice-signal]', '[data-back-link]', '[data-back-label]', '[data-summary-kicker]', '[data-empty-title]', '[data-empty-message]', '[data-session-quiz]', '[data-review-mistakes-empty]', '[data-review-mistakes-summary]'].forEach((selector) => add(selector));
  const standard = add('[data-standard-signal-section]');
  ['meaningEn', 'meaningZh', 'exampleEn', 'exampleZh', 'platforms', 'tone', 'status', 'formality', 'useWhen', 'avoidWhen', 'useWhenZh', 'avoidWhenZh', 'chineseFeeling'].forEach((key) => { const item = new Element('p'); item.setAttribute('data-field', key); standard.appendChild(item); });
  ['platforms', 'tone', 'status', 'formality'].forEach((key) => { const item = new Element('small'); item.setAttribute('data-profile-zh', key); standard.appendChild(item); });
  const interfaceSection = add('[data-interface-signal-section]'); interfaceSection.setAttribute('data-interface-signal-section', '');
  ['originalMeaningEn', 'originalMeaningZh', 'productMeaningEn', 'productMeaningZh', 'whyProductsUseItEn', 'whyProductsUseItZh', 'usageBoundaryEn', 'usageBoundaryZh'].forEach((key) => { const item = new Element('p'); item.setAttribute('data-interface-field', key); interfaceSection.appendChild(item); });
  ['original', 'product', 'why', 'where', 'examples', 'confused', 'related', 'boundary'].forEach((key) => { const item = new Element('div'); item.setAttribute('data-interface-section', key); item.hidden = true; interfaceSection.appendChild(item); });
  ['commonInterfaces', 'examples', 'confused', 'related'].forEach((key) => { const item = new Element('div'); item.setAttribute(key === 'commonInterfaces' ? 'data-interface-list' : 'data-interface-' + key, key === 'commonInterfaces' ? 'commonInterfaces' : ''); interfaceSection.appendChild(item); });
  ['new', 'fuzzy', 'clear'].forEach((value) => { const button = new Element('button'); button.setAttribute('data-mastery', value); document.body.appendChild(button); });
  document.body.appendChild(new Element('div')).setAttribute('data-session-feedback', '');
  return document;
}

function run(signalList, lookupId) {
  const document = buildDocument();
  const context = {
    window: {
      location: { search: '?mode=lookup&signal=' + lookupId },
      EnglishRadarContent: { getActiveLearningSignals: () => signalList, getSignalById: (id) => signalList.find((signal) => signal.id === id) || null },
      EnglishRadarLearningEngine: { getFilteredSignals: () => signalList, getProgress: () => ({}) },
      EnglishRadarStorage: { keys: { settings: 'settings' }, read: () => ({ dataVersion: 1, contentVersion: 1 }), setSettings: () => true, getCurrentSession: () => null, getInbox: () => [], setCurrentSession: () => true },
      EnglishRadarSpeech: { supported: false, cancel: () => {} },
      EnglishRadarReview: null,
      ENGLISH_RADAR_QUIZZES: [],
      EnglishRadarSession: {}
    },
    document,
    URLSearchParams,
    console,
    Date,
    setTimeout,
    clearTimeout
  };
  context.window.matchMedia = () => ({ matches: true });
  vm.runInNewContext(read('js/session.js'), context, { filename: 'js/session.js' });
  return { document, context };
}

const dataContext = { window: {} };
vm.runInNewContext(read('data/signals.js'), dataContext);
vm.runInNewContext(read('data/ui-vocabulary-core-pack.js'), dataContext);
const standardSignal = dataContext.window.ENGLISH_RADAR_SIGNALS[0];
const interfaceSignals = dataContext.window.ENGLISH_RADAR_UI_VOCABULARY_PACK.signals.slice(0, 2);
const allInterfaceSignals = dataContext.window.ENGLISH_RADAR_UI_VOCABULARY_PACK.signals;

const standardRun = run([standardSignal], standardSignal.id);
assert.equal(standardRun.document.querySelector('[data-standard-signal-section]').hidden, false);
assert.equal(standardRun.document.querySelector('[data-interface-signal-section]').hidden, true);
assert.equal(standardRun.document.querySelector('[data-field="meaningEn"]').textContent, standardSignal.meaningEn);

const interfaceRun = run(allInterfaceSignals, interfaceSignals[0].id);
assert.equal(interfaceRun.document.querySelector('[data-standard-signal-section]').hidden, true);
assert.equal(interfaceRun.document.querySelector('[data-interface-signal-section]').hidden, false);
assert.equal(interfaceRun.document.querySelector('[data-interface-field="productMeaningEn"]').textContent, interfaceSignals[0].productMeaningEn);
assert.equal(interfaceRun.document.querySelector('[data-interface-field="productMeaningZh"]').textContent, interfaceSignals[0].productMeaningZh);
assert.equal(interfaceRun.document.querySelector('[data-interface-list="commonInterfaces"]').children.length, interfaceSignals[0].commonInterfaces.length);
assert.equal(interfaceRun.document.querySelector('[data-interface-examples]').children.length, 1);
assert.equal(interfaceRun.document.querySelector('[data-interface-confused]').children.length, 1);
assert.equal(interfaceRun.document.querySelector('[data-interface-related]').querySelectorAll('a').length, interfaceSignals[0].relatedTerms.length);
assert(interfaceRun.document.querySelector('[data-interface-related]').querySelector('a').href.includes('ui-session'));
assert.equal(interfaceRun.document.querySelector('[data-practice-signal]').hidden, true);
assert.equal(interfaceRun.document.querySelector('.signal-stamp').textContent, 'UI / 01');
assert.equal(interfaceRun.document.querySelector('[data-field="category"]').textContent, 'UI VOCABULARY');
assert(interfaceRun.document.querySelector('[data-speak-example]').dataset.speakExample.includes('Your Daily Mix'));
assert(!interfaceRun.document.querySelector('[data-interface-related]').textContent.includes('ui-session'));

const emptyInterfaces = Object.assign({}, interfaceSignals[0], { commonInterfaces: [], realInterfaceExamples: [], confusedWith: [], relatedTerms: ['missing-ui-term'] });
const emptyRun = run([emptyInterfaces], emptyInterfaces.id);
assert.equal(emptyRun.document.querySelector('[data-interface-section="where"]').hidden, true);
assert.equal(emptyRun.document.querySelector('[data-interface-section="examples"]').hidden, true);
assert.equal(emptyRun.document.querySelector('[data-interface-section="confused"]').hidden, true);
assert.equal(emptyRun.document.querySelector('[data-interface-section="related"]').hidden, true);
assert.equal(emptyRun.document.querySelector('[data-speak-example]').dataset.speakExample, emptyInterfaces.exampleEn);

const sessionSource = read('js/session.js');
assert(sessionSource.includes('function renderStandardSignal(signal)'));
assert(sessionSource.includes('function renderInterfaceSignal(signal)'));
assert(!sessionSource.includes('interfaceFields[enKey].innerHTML'));
assert(sessionSource.includes('getSignalById'));
console.log('PASS: V1.2 interface Learn template rendering and fallback checks');
