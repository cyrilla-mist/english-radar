(function () {
  'use strict';

  var registry = window.EnglishRadarContent;
  if (!registry || typeof registry.getImportedSignals !== 'function') return;
  var signals = registry.getImportedSignals();
  var placeholders = ['-', '\u2014', '\u2013', 'n/a', 'na', 'none', 'unknown', 'tbd', 'generic placeholder'];
  var pools = { meaning: [], meaningZh: [], useWhen: [], avoidWhen: [] };
  var capabilities = {};
  var generatedBySignal = {};

  function text(value) { return String(value === undefined || value === null ? '' : value).trim(); }
  function usable(value) { var valueText = text(value); return !!valueText && placeholders.indexOf(valueText.toLowerCase()) === -1; }
  function specific(value) { var valueText = text(value).toLowerCase(); return usable(value) && valueText.indexOf('use it in informal online conversation') !== 0 && valueText.indexOf('avoid it in formal writing') !== 0; }
  function allValues(field, predicate) { var result = []; signals.forEach(function (item) { var value = text(item[field]); if (predicate(value) && result.indexOf(value) === -1) result.push(value); }); return result; }
  function distractors(pool, correct) { return pool.filter(function (value) { return value !== correct; }); }
  function makeOptions(correct, values, offset) { var options = values.slice(0, 3); if (options.length < 3) return null; options.splice(offset % 4, 0, correct); return options.map(function (value, index) { return { id: String.fromCharCode(97 + index), text: value }; }); }
  function push(list, signal, type, difficulty, prompt, correct, values, explanationEn, explanationZh, offset) {
    var options = makeOptions(correct, values, offset); if (!options) return;
    var correctOption = options.find(function (option) { return option.text === correct; });
    list.push({ id: 'quiz-imported-' + signal.id + '-' + type + '-01', signalId: signal.id, questionType: type, difficulty: difficulty, type: type === 'meaning' ? 'meaning-in-context' : type === 'context' ? 'natural-usage' : 'usage-boundary', prompt: prompt, question: prompt, context: text(signal.exampleEn), options: options, correctOptionId: correctOption.id, explanation: explanationEn, explanationEn: explanationEn, explanationZh: explanationZh });
  }
  function buildPools() {
    pools.meaning = allValues('meaningEn', usable).concat(allValues('meaningZh', usable));
    pools.useWhen = allValues('useWhen', specific);
    pools.avoidWhen = allValues('avoidWhen', specific);
    signals.forEach(function (signal) {
      var meaning = text(signal.meaningEn || signal.meaningZh); var useWhen = text(signal.useWhen); var avoidWhen = text(signal.avoidWhen);
      capabilities[signal.id] = {
        meaning: usable(signal.term || signal.displayTerm) && usable(meaning) && usable(signal.exampleEn),
        context: usable(signal.term || signal.displayTerm) && usable(signal.exampleEn) && specific(useWhen) && distractors(pools.useWhen, useWhen).length >= 3,
        boundary: usable(signal.term || signal.displayTerm) && specific(avoidWhen) && distractors(pools.avoidWhen, avoidWhen).length >= 3
      };
    });
  }
  function createForSignals(requested) {
    var result = [];
    (requested || []).forEach(function (signal) {
      if (!signal || !capabilities[signal.id]) return;
      if (generatedBySignal[signal.id]) { result.push.apply(result, generatedBySignal[signal.id]); return; }
      var created = []; var term = text(signal.displayTerm || signal.term); var meaning = text(signal.meaningEn || signal.meaningZh); var meaningZh = text(signal.meaningZh); var useWhen = text(signal.useWhen); var avoidWhen = text(signal.avoidWhen);
      if (capabilities[signal.id].meaning) push(created, signal, 'meaning', 'easy', 'What does \u201c' + term + '\u201d mean in this context?', meaning, distractors(pools.meaning, meaning), 'The expression means: ' + meaning + '.', meaningZh ? '\u8fd9\u91cc\u7684\u542b\u4e49\u662f\uff1a' + meaningZh + '\u3002' : '\u8bf7\u7ed3\u5408\u4f8b\u53e5\u7406\u89e3\u8fd9\u4e2a\u8868\u8fbe\u3002', 0);
      if (capabilities[signal.id].context) push(created, signal, 'context', 'medium', 'Which situation is the most natural use of \u201c' + term + '\u201d?', useWhen, distractors(pools.useWhen, useWhen), 'This context fits because: ' + useWhen, '\u8fd9\u4e2a\u573a\u666f\u7b26\u5408\u5b83\u7684\u4f7f\u7528\u8fb9\u754c\uff1a' + useWhen, 1);
      if (capabilities[signal.id].boundary) push(created, signal, 'boundary', 'hard', 'When should you avoid using \u201c' + term + '\u201d?', avoidWhen, distractors(pools.avoidWhen, avoidWhen), 'Avoid it when: ' + avoidWhen + ' The expression is better used when: ' + useWhen, '\u5e94\u907f\u514d\u5728\u4ee5\u4e0b\u60c5\u51b5\u4e2d\u4f7f\u7528\uff1a' + avoidWhen + '\uff1b\u66f4\u9002\u5408\u5728\u7b26\u5408\u4f7f\u7528\u8fb9\u754c\u65f6\u4f7f\u7528\u3002', 2);
      generatedBySignal[signal.id] = created; result.push.apply(result, created);
    });
    return result;
  }
  if (window.EnglishRadarPerformanceDebug) window.EnglishRadarPerformanceDebug.measure('quiz.distractorPools', buildPools); else buildPools();
  window.EnglishRadarImportedQuizGenerator = { getCapabilities: function (signal) { return capabilities[signal.id] || { meaning: false, context: false, boundary: false }; }, createForSignals: createForSignals, stats: function () { var count = Object.keys(generatedBySignal).reduce(function (total, id) { return total + generatedBySignal[id].length; }, 0); return { importedSignals: signals.length, generatedQuizzes: count, cachedSignals: Object.keys(generatedBySignal).length }; } };
}());
