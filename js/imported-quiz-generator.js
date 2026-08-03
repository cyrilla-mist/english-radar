(function () {
  'use strict';

  var registry = window.EnglishRadarContent;
  if (!registry || typeof registry.getImportedSignals !== 'function') return;

  var signals = registry.getImportedSignals();
  var existing = Array.isArray(window.ENGLISH_RADAR_QUIZZES) ? window.ENGLISH_RADAR_QUIZZES : [];
  var placeholders = ['-', '—', 'n/a', 'na', 'none', 'unknown', 'tbd', 'generic placeholder'];

  function text(value) { return String(value === undefined || value === null ? '' : value).trim(); }
  function usable(value) { var valueText = text(value); return !!valueText && placeholders.indexOf(valueText.toLowerCase()) === -1; }
  function specific(value) {
    var valueText = text(value).toLowerCase();
    return usable(value) && valueText.indexOf('use it in informal online conversation') !== 0 && valueText.indexOf('avoid it in formal writing') !== 0;
  }
  function uniqueValues(items, field, signal) {
    var result = [];
    items.forEach(function (item) {
      var value = text(item[field]);
      if (item.id !== signal.id && usable(value) && value !== text(signal[field]) && result.indexOf(value) === -1) result.push(value);
    });
    return result;
  }
  function makeOptions(correct, distractors, offset) {
    var values = distractors.slice(0, 3);
    if (values.length < 3) return null;
    var correctIndex = offset % 4;
    values.splice(correctIndex, 0, correct);
    return values.map(function (value, index) { return { id: String.fromCharCode(97 + index), text: value }; });
  }
  function pushQuestion(list, signal, type, difficulty, prompt, correct, distractors, explanationEn, explanationZh, offset) {
    if (!usable(correct)) return false;
    var options = makeOptions(correct, distractors, offset);
    if (!options) return false;
    list.push({
      id: 'quiz-imported-' + signal.id + '-' + type + '-01',
      signalId: signal.id,
      questionType: type,
      difficulty: difficulty,
      type: type === 'meaning' ? 'meaning-in-context' : type === 'context' ? 'natural-usage' : 'usage-boundary',
      prompt: prompt,
      question: prompt,
      context: text(signal.exampleEn),
      options: options,
      correctOptionId: options[options.findIndex(function (option) { return option.text === correct; })].id,
      explanation: explanationEn,
      explanationEn: explanationEn,
      explanationZh: explanationZh
    });
    return true;
  }

  var generated = [];
  signals.forEach(function (signal, index) {
    var term = text(signal.displayTerm || signal.term);
    var meaning = text(signal.meaningEn || signal.meaningZh);
    var meaningZh = text(signal.meaningZh);
    var example = text(signal.exampleEn);
    var useWhen = text(signal.useWhen);
    var avoidWhen = text(signal.avoidWhen);
    var meaningOptions = uniqueValues(signals, 'meaningEn', signal).concat(uniqueValues(signals, 'meaningZh', signal));
    var usageOptions = uniqueValues(signals, 'useWhen', signal).filter(specific);
    var boundaryOptions = uniqueValues(signals, 'avoidWhen', signal).filter(specific);

    if (usable(term) && usable(meaning) && usable(example)) {
      pushQuestion(generated, signal, 'meaning', 'easy', 'What does “' + term + '” mean in this context?', meaning, meaningOptions, 'The expression means: ' + meaning + '.', meaningZh ? '这里的含义是：' + meaningZh + '。' : '请结合例句理解这个表达。', index);
    }
    if (usable(term) && usable(example) && specific(useWhen) && usageOptions.length >= 3) {
      pushQuestion(generated, signal, 'context', 'medium', 'Which situation is the most natural use of “' + term + '”?', useWhen, usageOptions, 'This context fits because: ' + useWhen, '这个场景符合它的使用边界：' + useWhen, index + 1);
    }
    if (usable(term) && specific(avoidWhen) && boundaryOptions.length >= 3) {
      pushQuestion(generated, signal, 'boundary', 'hard', 'When should you avoid using “' + term + '”?', avoidWhen, boundaryOptions, 'Avoid it when: ' + avoidWhen + ' The expression is better used when: ' + useWhen, '应避免在以下情况下使用：' + avoidWhen + '；更适合在符合使用边界时使用。', index + 2);
    }
  });

  var seen = {};
  window.ENGLISH_RADAR_QUIZZES = existing.concat(generated).filter(function (quiz) {
    if (!quiz || !quiz.id || seen[quiz.id]) return false;
    seen[quiz.id] = true;
    return true;
  });
  window.ENGLISH_RADAR_GENERATED_QUIZ_STATS = {
    importedSignals: signals.length,
    generatedQuizzes: generated.length,
    meaningQuizzes: generated.filter(function (quiz) { return quiz.questionType === 'meaning'; }).length,
    contextQuizzes: generated.filter(function (quiz) { return quiz.questionType === 'context'; }).length,
    boundaryQuizzes: generated.filter(function (quiz) { return quiz.questionType === 'boundary'; }).length
  };
}());
