(function () {
  'use strict';

  var settings = window.EnglishRadarStorage && window.EnglishRadarStorage.getSettings ? window.EnglishRadarStorage.getSettings() : { speechRate: 1 };
  var currentRate = [0.75, 1, 1.25].indexOf(Number(settings.speechRate)) !== -1 ? Number(settings.speechRate) : 1;
  var supported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  var listenButton = document.querySelector('[data-speak-signal]');
  var exampleButton = document.querySelector('[data-speak-example]');
  var note = document.querySelector('[data-speech-note]');

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
    utterance.onstart = function () { button.classList.add('is-speaking'); };
    utterance.onend = function () { button.classList.remove('is-speaking'); };
    utterance.onerror = function () { button.classList.remove('is-speaking'); };
    try { window.speechSynthesis.speak(utterance); } catch (error) { button.classList.remove('is-speaking'); }
  }

  window.EnglishRadarSpeech = { cancel: cancel, speak: speak, supported: supported };

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
