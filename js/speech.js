(function () {
  'use strict';

  var settings = window.EnglishRadarStorage && window.EnglishRadarStorage.getSettings ? window.EnglishRadarStorage.getSettings() : { speechRate: 1 };
  var currentRate = [0.75, 1, 1.25].indexOf(Number(settings.speechRate)) !== -1 ? Number(settings.speechRate) : 1;
  var supported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  var listenButton = document.querySelector('[data-speak-signal]');
  var exampleButton = document.querySelector('[data-speak-example]');
  var note = document.querySelector('[data-speech-note]');
  var voices = [];

  function refreshVoices() {
    if (!supported || !window.speechSynthesis || typeof window.speechSynthesis.getVoices !== 'function') { voices = []; return voices; }
    try { voices = window.speechSynthesis.getVoices().filter(function (voice) { return voice && /^en(?:-|$)/i.test(String(voice.lang || '')); }); } catch (error) { voices = []; }
    return voices;
  }

  function preferredVoice() {
    var suitable = refreshVoices(); if (!suitable.length) return null;
    return suitable.slice().sort(function (a, b) {
      function rank(voice) { var lang = String(voice.lang || '').toLowerCase(); if (lang === 'en-us') return 0; if (voice.default === true) return 1; if (/(natural|neural|enhanced|premium)/i.test(String(voice.name || ''))) return 2; return 3; }
      return rank(a) - rank(b) || String(a.name || '').localeCompare(String(b.name || '')) || String(a.lang || '').localeCompare(String(b.lang || ''));
    })[0] || null;
  }

  function cancel() {
    if (supported) {
      try { window.speechSynthesis.cancel(); } catch (error) { /* Speech is optional. */ }
    }
    if (listenButton) listenButton.classList.remove('is-speaking');
    if (exampleButton) exampleButton.classList.remove('is-speaking');
  }

  function speak(text, button) {
    if (!supported || !text || !button) return;
    cancel();
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = currentRate;
    var voice = preferredVoice();
    if (voice) utterance.voice = voice;
    utterance.onstart = function () { button.classList.add('is-speaking'); };
    utterance.onend = function () { button.classList.remove('is-speaking'); };
    utterance.onerror = function () { button.classList.remove('is-speaking'); };
    try { window.speechSynthesis.speak(utterance); } catch (error) { button.classList.remove('is-speaking'); }
  }

  window.EnglishRadarSpeech = { cancel: cancel, speak: speak, supported: supported, getVoiceDiagnostics: function () { var current = preferredVoice(); return { total: voices.length, english: voices.map(function (voice) { return { name: voice.name || '', lang: voice.lang || '', localService: voice.localService === true, default: voice.default === true }; }), selected: current ? { name: current.name || '', lang: current.lang || '', localService: current.localService === true, default: current.default === true } : null }; } };

  document.querySelectorAll('[data-rate]').forEach(function (button) { button.classList.toggle('is-active', Number(button.getAttribute('data-rate')) === currentRate); });

  if (!supported) {
    [listenButton, exampleButton].forEach(function (button) {
      if (!button) return;
      button.disabled = true;
      button.setAttribute('aria-disabled', 'true');
    });
    if (note) { note.hidden = false; note.textContent = 'Speech unavailable in this browser.'; }
    return;
  }

  refreshVoices();
  if (window.speechSynthesis && typeof window.speechSynthesis.addEventListener === 'function') window.speechSynthesis.addEventListener('voiceschanged', refreshVoices);
  else if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = refreshVoices;

  if (listenButton) listenButton.addEventListener('click', function () { speak(listenButton.dataset.speak, listenButton); });
  if (exampleButton) exampleButton.addEventListener('click', function () { speak(exampleButton.dataset.speakExample, exampleButton); });
  document.querySelectorAll('[data-rate]').forEach(function (button) {
    button.addEventListener('click', function () {
      currentRate = Number(button.getAttribute('data-rate')) || 1;
      document.querySelectorAll('[data-rate]').forEach(function (item) { item.classList.remove('is-active'); });
      button.classList.add('is-active');
    });
  });
}());
