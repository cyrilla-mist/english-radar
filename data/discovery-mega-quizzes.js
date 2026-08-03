(function () {
  'use strict';

  var registry = window.EnglishRadarContent;
  if (!registry || typeof registry.getImportedSignals !== 'function') return;

  var packId = 'english-radar-discovery-mega-v1';
  var signals = registry.getImportedSignals().filter(function (signal) {
    return signal && signal.sourcePackId === packId;
  });
  if (!signals.length) return;

  function text(value) {
    return String(value === undefined || value === null ? '' : value).trim();
  }

  function candidatesFor(signal, field) {
    var sameCategory = signals.filter(function (item) {
      return item.id !== signal.id && item.category === signal.category && text(item[field]);
    });
    var allOthers = signals.filter(function (item) {
      return item.id !== signal.id && text(item[field]);
    });
    var values = sameCategory.concat(allOthers).map(function (item) {
      return text(item[field]);
    });
    return values.filter(function (value, index, list) {
      return value && value !== text(signal[field]) && list.indexOf(value) === index;
    });
  }

  function options(correctText, distractors, correctIndex) {
    var selected = distractors.slice(0, 3);
    while (selected.length < 3) selected.push('This interpretation does not match the community context.');
    selected.splice(correctIndex, 0, correctText);
    return selected.map(function (value, index) {
      return { id: String.fromCharCode(97 + index), text: value };
    });
  }

  function correctId(index) {
    return String.fromCharCode(97 + index);
  }

  var generated = [];
  signals.forEach(function (signal, index) {
    var meaningIndex = index % 4;
    var useIndex = (index + 1) % 4;
    var display = text(signal.displayTerm || signal.term);
    var meaningEn = text(signal.meaningEn);
    var meaningZh = text(signal.meaningZh);
    var useWhen = text(signal.useWhen);
    var avoidWhen = text(signal.avoidWhen);
    var chineseFeeling = text(signal.chineseFeeling);

    if (meaningEn && text(signal.exampleEn)) {
      generated.push({
        id: 'quiz-' + signal.id + '-discovery-meaning-01',
        signalId: signal.id,
        type: 'meaning-in-context',
        question: 'What does “' + display + '” mean here?',
        context: text(signal.exampleEn),
        options: options(meaningEn, candidatesFor(signal, 'meaningEn'), meaningIndex),
        correctOptionId: correctId(meaningIndex),
        explanationEn: 'Here, “' + display + '” means ' + meaningEn + '. ' + useWhen,
        explanationZh: '这里表示：' + meaningZh + '。中文语感：' + chineseFeeling,
        difficulty: 'easy'
      });
    }

    if (useWhen) {
      generated.push({
        id: 'quiz-' + signal.id + '-discovery-usage-02',
        signalId: signal.id,
        type: 'natural-usage',
        question: 'Which guidance best fits “' + display + '”?',
        context: 'Choose the most accurate usage boundary for this expression.',
        options: options(useWhen, candidatesFor(signal, 'useWhen'), useIndex),
        correctOptionId: correctId(useIndex),
        explanationEn: useWhen + (avoidWhen ? ' ' + avoidWhen : ''),
        explanationZh: '核心含义是“' + meaningZh + '”。使用时要保留这种语感：' + chineseFeeling,
        difficulty: 'medium'
      });
    }
  });

  var existing = Array.isArray(window.ENGLISH_RADAR_QUIZZES) ? window.ENGLISH_RADAR_QUIZZES : [];
  var seen = {};
  window.ENGLISH_RADAR_QUIZZES = existing.concat(generated).filter(function (quiz) {
    if (!quiz || !quiz.id || seen[quiz.id]) return false;
    seen[quiz.id] = true;
    return true;
  });
}());
