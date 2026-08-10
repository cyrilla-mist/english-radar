(function () {
  'use strict';

  var core = Array.isArray(window.ENGLISH_RADAR_QUIZZES) ? window.ENGLISH_RADAR_QUIZZES : [];
  var ui = Array.isArray(window.ENGLISH_RADAR_UI_VOCABULARY_QUIZZES) ? window.ENGLISH_RADAR_UI_VOCABULARY_QUIZZES : [];
  var registry = window.EnglishRadarBundledPackRegistry;
  var registered = registry && typeof registry.getBundledQuizPacks === 'function' ? registry.getBundledQuizPacks() : [];

  if (!registered.length) {
    registered = Object.keys(window).filter(function (key) { return /^ENGLISH_RADAR_(?:CONTENT_PACK_\d+|UI_VOCABULARY)_QUIZZES$/.test(key); }).map(function (key) {
      var contentMatch = key.match(/^ENGLISH_RADAR_CONTENT_PACK_(\d+)_QUIZZES$/);
      return { packId: contentMatch ? 'english-radar-content-pack-' + contentMatch[1] : 'english-radar-ui-vocabulary-core', quizzes: window[key] };
    });
  }

  function valid(question) { return question && question.id && question.signalId && Array.isArray(question.options) && question.options.length === 4 && question.correctOptionId && question.options.some(function (option) { return option && option.id === question.correctOptionId; }); }
  function clean(list) { var seen = {}; return (Array.isArray(list) ? list : []).filter(valid).filter(function (question) { if (seen[question.id]) return false; seen[question.id] = true; return true; }).map(function (question) { return Object.assign({}, question); }); }
  function quizzesFor(packId) { var item = registered.find(function (entry) { return entry.packId === packId; }); return clean(item ? item.quizzes : []); }
  function methodSuffix(packId) { return packId.replace(/^english-radar-content-pack-/, '').replace(/(^|-)([a-z])/g, function (_, separator, letter) { return letter.toUpperCase(); }); }

  var coreQuizzes = clean(core);
  var packQuizzes = {};
  registered.forEach(function (entry) { packQuizzes[entry.packId] = quizzesFor(entry.packId); });
  var allPackQuizzes = Object.keys(packQuizzes).reduce(function (all, packId) { return all.concat(packQuizzes[packId]); }, []);
  var interfaceQuizzes = clean(ui.concat(Object.keys(packQuizzes).filter(function (packId) { return packId === 'english-radar-ui-vocabulary-core' || packId === 'english-radar-content-pack-01' || packId === 'english-radar-content-pack-03'; }).reduce(function (all, packId) { return all.concat(packQuizzes[packId].filter(function (question) { return packId !== 'english-radar-content-pack-01' || /^ui-/.test(question.signalId); })); }, [])));
  var staticQuizzes = clean(coreQuizzes.concat(interfaceQuizzes, allPackQuizzes));
  var api = {
    getCoreQuizzes: function () { return coreQuizzes.slice(); },
    getInterfaceQuizzes: function () { return interfaceQuizzes.slice(); },
    getBundledQuizPacks: function () { return registered.map(function (entry) { return { packId: entry.packId, quizzes: packQuizzes[entry.packId].slice() }; }); },
    getContentPackQuizzes: function (packId) { return quizzesFor(packId); },
    getStaticQuizzes: function () { return staticQuizzes.slice(); },
    getQuizzesForSignal: function (signalId) { return staticQuizzes.filter(function (question) { return question.signalId === signalId; }); }
  };
  registered.forEach(function (entry) {
    if (/^english-radar-content-pack-/.test(entry.packId)) api['getContentPack' + methodSuffix(entry.packId) + 'Quizzes'] = function () { return quizzesFor(entry.packId); };
  });
  window.EnglishRadarQuizRegistry = api;
}());
