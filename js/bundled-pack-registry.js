(function () {
  'use strict';

  var packs = [];
  var quizzes = {};

  function replacePack(list, value) {
    if (!value || !value.pack || !value.pack.id) return value;
    var index = list.findIndex(function (item) { return item && item.pack && item.pack.id === value.pack.id; });
    if (index === -1) list.push(value);
    else list[index] = value;
    return value;
  }

  function registerPack(payload) { return replacePack(packs, payload); }
  function registerQuizPack(packId, list) {
    if (!packId || !Array.isArray(list)) return list;
    quizzes[packId] = list.slice();
    return list;
  }
  function getBundledPacks() { return packs.slice(); }
  function getBundledQuizPacks() { return Object.keys(quizzes).map(function (packId) { return { packId: packId, quizzes: quizzes[packId].slice() }; }); }
  function getQuizPack(packId) { return quizzes[packId] ? quizzes[packId].slice() : []; }

  window.EnglishRadarBundledPackRegistry = {
    registerPack: registerPack,
    registerQuizPack: registerQuizPack,
    getBundledPacks: getBundledPacks,
    getBundledQuizPacks: getBundledQuizPacks,
    getQuizPack: getQuizPack
  };
}());
