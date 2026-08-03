(function () {
  'use strict';

  var registry = window.EnglishRadarContent;
  if (!registry || typeof registry.getImportedSignals !== 'function') return;

  var signals = registry.getImportedSignals();
  if (!signals.length) return;

  var PLACEHOLDERS = ['—', '-', 'n/a', 'na', 'none', 'unknown', 'tbd'];
  var GENERIC_USE = 'use it in informal online conversation when this community meaning fits the context.';
  var GENERIC_AVOID = 'avoid it in formal writing or with audiences unfamiliar with internet slang.';

  function text(value) {
    return String(value === undefined || value === null ? '' : value).trim();
  }

  function usable(value) {
    var normalized = text(value).toLowerCase();
    return !!normalized && PLACEHOLDERS.indexOf(normalized) === -1;
  }

  function specificUsage(value) {
    var normalized = text(value).toLowerCase();
    return usable(value) && normalized !== GENERIC_USE && normalized !== GENERIC_AVOID;
  }

  function candidateValues(signal, field, predicate) {
    var test = predicate || usable;
    var sameCategory = signals.filter(function (item) {
      return item.id !== signal.id && item.category === signal.category && test(item[field]);
    });
    var allOthers = signals.filter(function (item) {
      return item.id !== signal.id && test(item[field]);
    });
    return sameCategory.concat(allOthers).map(function (item) {
      return text(item[field]);
    }).filter(function (value, index, list) {
      return value && value !== text(signal[field]) && list.indexOf(value) === index;
    });
  }

  function buildOptions(correctText, distractors, correctIndex, fallbacks) {
    var selected = distractors.slice(0, 3);
    (fallbacks || []).forEach(function (fallback) {
      if (selected.length < 3 && fallback !== correctText && selected.indexOf(fallback) === -1) selected.push(fallback);
    });
    while (selected.length < 3) selected.push('This interpretation does not match the expression in context.');
    selected.splice(correctIndex, 0, correctText);
    return selected.map(function (value, index) {
      return { id: String.fromCharCode(97 + index), text: value };
    });
  }

  function correctId(index) {
    return String.fromCharCode(97 + index);
  }

  var generated = [];
  var stats = { importedSignals: signals.length, meaningQuizzes: 0, usageQuizzes: 0, skippedSignals: 0 };

  signals.forEach(function (signal, index) {
    var display = text(signal.displayTerm || signal.term);
    var meaningEn = text(signal.meaningEn);
    var meaningZh = text(signal.meaningZh);
    var exampleEn = text(signal.exampleEn);
    var useWhen = text(signal.useWhen);
    var avoidWhen = text(signal.avoidWhen);
    var chineseFeeling = text(signal.chineseFeeling);
    var meaningIndex = index % 4;
    var useIndex = (index + 1) % 4;
    var createdForSignal = 0;

    if (usable(display) && usable(meaningEn) && usable(meaningZh) && usable(exampleEn)) {
      generated.push({
        id: 'quiz-auto-' + signal.id + '-meaning-01',
        signalId: signal.id,
        type: 'meaning-in-context',
        question: 'What does “' + display + '” mean here?',
        context: exampleEn,
        options: buildOptions(
          meaningEn,
          candidateValues(signal, 'meaningEn', usable),
          meaningIndex,
          [
            'It describes a formal approval process.',
            'It refers only to the literal dictionary meaning.',
            'It means the speaker has no reaction to the situation.'
          ]
        ),
        correctOptionId: correctId(meaningIndex),
        explanationEn: 'Here, “' + display + '” means ' + meaningEn + '.' + (specificUsage(useWhen) ? ' ' + useWhen : ''),
        explanationZh: '这里表示：' + meaningZh + (usable(chineseFeeling) ? '。中文语感：' + chineseFeeling : '。'),
        difficulty: 'easy'
      });
      stats.meaningQuizzes += 1;
      createdForSignal += 1;
    }

    if (usable(display) && specificUsage(useWhen) && specificUsage(avoidWhen) && usable(meaningZh)) {
      generated.push({
        id: 'quiz-auto-' + signal.id + '-usage-02',
        signalId: signal.id,
        type: 'natural-usage',
        question: 'Which guidance best fits “' + display + '”?',
        context: 'Choose the most accurate usage boundary for this expression.',
        options: buildOptions(
          useWhen,
          candidateValues(signal, 'useWhen', specificUsage),
          useIndex,
          [
            'Use it as a neutral term in every formal document.',
            'Use it only for the literal physical meaning of the words.',
            'Use it whenever the audience has no shared context.'
          ]
        ),
        correctOptionId: correctId(useIndex),
        explanationEn: useWhen + ' ' + avoidWhen,
        explanationZh: '核心含义是“' + meaningZh + '”。' + (usable(chineseFeeling) ? '中文语感：' + chineseFeeling : '请结合具体平台和关系判断语气。'),
        difficulty: 'medium'
      });
      stats.usageQuizzes += 1;
      createdForSignal += 1;
    }

    if (!createdForSignal) stats.skippedSignals += 1;
  });

  var existing = Array.isArray(window.ENGLISH_RADAR_QUIZZES) ? window.ENGLISH_RADAR_QUIZZES : [];
  var seen = {};
  window.ENGLISH_RADAR_QUIZZES = existing.concat(generated).filter(function (quiz) {
    if (!quiz || !quiz.id || seen[quiz.id]) return false;
    seen[quiz.id] = true;
    return true;
  });
  stats.generatedQuizzes = generated.length;
  window.ENGLISH_RADAR_GENERATED_QUIZ_STATS = stats;
}());
