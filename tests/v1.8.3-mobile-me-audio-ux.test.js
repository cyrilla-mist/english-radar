const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const me = read('me.html');
const meJs = read('js/me.js');
const learn = read('learn.html');
const speech = read('js/speech.js');

assert.match(me, /class="me-section section-grid me-overview"/);
assert.match(me, /data-me-disclosure="weak-signals"/);
for (const key of ['last-7-days', 'mastery', 'recent-activity', 'context-insights', 'content-library', 'notion-sync', 'preferences', 'data-backup']) {
  assert.match(me, new RegExp(`data-me-disclosure="${key}"`));
}
assert.match(me, /data-me-weak-toggle/);
assert.match(meJs, /document\.createElement\('details'\)/);
assert.match(meJs, /details\.open = key === 'weak-signals'/);
assert.match(meJs, /index >= 4/);
assert.doesNotMatch(meJs, /\.slice\(0, 6\)/);
assert.match(meJs, /setExpanded\(false\)/);
assert.doesNotMatch(meJs, /localStorage/);

assert.match(learn, /class="example-copy"/);
assert.match(learn, /class="example-quote-row"/);
assert.match(learn, /data-speak-example aria-label="Listen to example \/ 朗读例句"/);
assert.match(learn, /class="sr-only">Listen to example<\/span>/);
assert.doesNotMatch(learn, /<div><blockquote data-field="exampleEn">—<\/blockquote><button/);
assert.match(learn, /example-quote-row[\s\S]*data-field="exampleZh"/);

class Button {
  constructor() { this.classList = { add() {}, remove() {} }; }
}
const voiceEvents = {};
const voices = [
  { name: 'A Basic Voice', lang: 'en-US', default: false, localService: true },
  { name: 'Z Natural Voice', lang: 'en-US', default: false, localService: false },
  { name: 'Google 普通话', lang: 'zh-CN', default: true, localService: true }
];
let spoken = null;
const consoleErrors = [];
function Utterance(text) { this.text = text; }
const speechSynthesis = {
  getVoices: () => voices.slice(),
  addEventListener: (name, handler) => { voiceEvents[name] = handler; },
  cancel: () => {},
  speak: (utterance) => { spoken = utterance; }
};
const document = { querySelector: () => null, querySelectorAll: () => [] };
const context = {
  window: { speechSynthesis, SpeechSynthesisUtterance: Utterance, EnglishRadarStorage: { getSettings: () => ({ speechRate: 0.75 }) } },
  document,
  SpeechSynthesisUtterance: Utterance,
  console: { error: (...args) => consoleErrors.push(args) },
  Number,
  String,
  RegExp,
  Object,
  Array
};
vm.runInNewContext(speech, context, { filename: 'js/speech.js' });
function setVoices(next) {
  voices.splice(0, voices.length, ...next);
  spoken = null;
}
function diagnostics() { return context.window.EnglishRadarSpeech.getVoiceDiagnostics(); }
function speak() { context.window.EnglishRadarSpeech.speak('signal', new Button()); return spoken; }

let current = diagnostics();
assert.equal(current.totalVoices, 3);
assert.equal(current.englishVoices.length, 2);
assert.equal(current.selected.name, 'Z Natural Voice');
assert.equal(speak().voice.name, 'Z Natural Voice');
assert.equal(spoken.rate, 0.75);

setVoices([
  { name: 'A Plain Voice', lang: 'en-US', default: false, localService: true },
  { name: 'Z Default Voice', lang: 'en-US', default: true, localService: false }
]);
assert.equal(diagnostics().selected.name, 'Z Default Voice');

setVoices([
  { name: 'A Plain Voice', lang: 'en-US', default: false, localService: false },
  { name: 'Z Local Voice', lang: 'en-US', default: false, localService: true }
]);
assert.equal(diagnostics().selected.name, 'Z Local Voice');

setVoices([
  { name: 'A Basic Voice', lang: 'en-US', default: false, localService: false },
  { name: 'Z Natural Voice', lang: 'en-GB', default: true, localService: true }
]);
assert.equal(diagnostics().selected.lang, 'en-US');

setVoices([
  { name: 'A Basic Voice', lang: 'en-GB', default: false, localService: false },
  { name: 'Z Natural Voice', lang: 'en-AU', default: false, localService: true }
]);
assert.equal(diagnostics().selected.name, 'Z Natural Voice');

setVoices([{ name: 'French', lang: 'fr-FR', default: true, localService: true }]);
current = diagnostics();
assert.equal(current.totalVoices, 1);
assert.equal(current.englishVoices.length, 0);
assert.equal(current.selected, null);
assert.equal(speak().voice, undefined);
assert.equal(spoken.lang, 'en-US');
assert.equal(consoleErrors.length, 0);

setVoices([{ name: 'Initial Voice', lang: 'en-US', default: false, localService: true }]);
assert.equal(diagnostics().selected.name, 'Initial Voice');
setVoices([{ name: 'Refreshed Natural Voice', lang: 'en-US', default: false, localService: false }]);
voiceEvents.voiceschanged();
assert.equal(diagnostics().selected.name, 'Refreshed Natural Voice');

assert.match(speech, /speechSynthesis\.getVoices/);
assert.match(speech, /voiceschanged/);
assert.match(speech, /\^en\(\?:-\|\$\)/i);
assert.match(speech, /totalVoices/);
assert.match(speech, /englishVoices/);
assert.match(read('js/session.js'), /speechText \|\| signal\.term/);
assert.match(read('js/session.js'), /dataset\.speakExample = text\(interfaceExample \? interfaceExample\.exampleEn : signal\.exampleEn\)/);
console.log('PASS: v1.8.3 mobile Me disclosure, Weak Signals and context audio checks');
