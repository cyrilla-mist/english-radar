(function () {
  'use strict';
  var core = Array.isArray(window.ENGLISH_RADAR_QUIZZES) ? window.ENGLISH_RADAR_QUIZZES : [];
  var ui = Array.isArray(window.ENGLISH_RADAR_UI_VOCABULARY_QUIZZES) ? window.ENGLISH_RADAR_UI_VOCABULARY_QUIZZES : [];
  var contentPack01 = Array.isArray(window.ENGLISH_RADAR_CONTENT_PACK_01_QUIZZES) ? window.ENGLISH_RADAR_CONTENT_PACK_01_QUIZZES : [];
  var contentPack02 = Array.isArray(window.ENGLISH_RADAR_CONTENT_PACK_02_QUIZZES) ? window.ENGLISH_RADAR_CONTENT_PACK_02_QUIZZES : [];
  var contentPack03 = Array.isArray(window.ENGLISH_RADAR_CONTENT_PACK_03_QUIZZES) ? window.ENGLISH_RADAR_CONTENT_PACK_03_QUIZZES : [];
  function valid(question) { return question && question.id && question.signalId && Array.isArray(question.options) && question.options.length === 4 && question.correctOptionId && question.options.some(function (option) { return option && option.id === question.correctOptionId; }); }
  function clean(list) { var seen = {}; return list.filter(valid).filter(function (question) { if (seen[question.id]) return false; seen[question.id] = true; return true; }).map(function (question) { return Object.assign({}, question); }); }
  var coreQuizzes = clean(core); var contentPack01Quizzes = clean(contentPack01); var contentPack02Quizzes = clean(contentPack02); var contentPack03Quizzes = clean(contentPack03); var interfaceQuizzes = clean(ui.concat(contentPack01Quizzes.filter(function (question) { return /^ui-/.test(question.signalId); }), contentPack03Quizzes)); var staticQuizzes = clean(coreQuizzes.concat(interfaceQuizzes, contentPack01Quizzes, contentPack02Quizzes, contentPack03Quizzes));
  window.EnglishRadarQuizRegistry = {
    getCoreQuizzes: function () { return coreQuizzes.slice(); },
    getInterfaceQuizzes: function () { return interfaceQuizzes.slice(); },
    getContentPack01Quizzes: function () { return contentPack01Quizzes.slice(); },
    getContentPack02Quizzes: function () { return contentPack02Quizzes.slice(); },
    getContentPack03Quizzes: function () { return contentPack03Quizzes.slice(); },
    getStaticQuizzes: function () { return staticQuizzes.slice(); },
    getQuizzesForSignal: function (signalId) { return staticQuizzes.filter(function (question) { return question.signalId === signalId; }); }
  };
}());
