(function () {
  'use strict';

  if (window.__ENGLISH_RADAR_INTERFACE_LEARNING_INITIALIZED) return;
  window.__ENGLISH_RADAR_INTERFACE_LEARNING_INITIALIZED = true;

  var MODE_KEY = 'englishRadar.interfaceLearningMode';
  var registry = window.EnglishRadarContent;
  var pack = window.ENGLISH_RADAR_UI_VOCABULARY_PACK;
  var packSignals = pack && Array.isArray(pack.signals) ? pack.signals : [];
  var targets = {};
  packSignals.forEach(function (signal) { if (signal && signal.id) targets[signal.id] = signal; });
  var targetState = [];
  var enabled = readMode();
  var previousFocus = null;
  var panel;
  var closeButton;

  function readMode() { try { return window.sessionStorage && window.sessionStorage.getItem(MODE_KEY) === 'on'; } catch (error) { return false; } }
  function writeMode(value) { try { if (!window.sessionStorage) return; if (value) window.sessionStorage.setItem(MODE_KEY, 'on'); else window.sessionStorage.removeItem(MODE_KEY); } catch (error) {} }
  function hasText(value) { return typeof value === 'string' && value.trim() && value.trim() !== '—'; }
  function text(value) { return hasText(value) ? value.trim() : ''; }
  function create(tag, className, value) { var node = document.createElement(tag); if (className) node.className = className; if (value !== undefined) node.textContent = value; return node; }
  function append(parent, child) { if (parent && child) parent.appendChild(child); return child; }
  function buttonLabel(button, on) { var en = button.querySelector('[data-interface-mode-en]'); var zh = button.querySelector('[data-interface-mode-zh]'); var state = button.querySelector('[data-interface-mode-state]'); if (en) en.textContent = on ? 'Interface mode on' : 'Learn the interface'; if (zh) zh.textContent = on ? '界面学习中' : '学习界面词'; if (state) state.textContent = on ? 'ON' : 'OFF'; button.setAttribute('aria-pressed', on ? 'true' : 'false'); }

  function makeControl() {
    var existing = document.querySelector('[data-interface-mode-control]'); if (existing) return existing;
    var host = document.querySelector('.page-header') || document.querySelector('.learn-header') || document.querySelector('.quiz-header'); if (!host) return null;
    var control = create('div', 'interface-mode-control'); control.setAttribute('data-interface-mode-control', '');
    var toggle = create('button', 'interface-mode-toggle'); toggle.type = 'button'; toggle.setAttribute('data-interface-mode-toggle', ''); toggle.setAttribute('aria-pressed', 'false');
    append(toggle, create('span', 'interface-mode-en', 'Learn the interface')); append(toggle, create('small', 'interface-mode-zh', '学习界面词')); append(toggle, create('span', 'interface-mode-state', 'OFF'));
    toggle.querySelector('.interface-mode-en').setAttribute('data-interface-mode-en', ''); toggle.querySelector('.interface-mode-zh').setAttribute('data-interface-mode-zh', ''); toggle.querySelector('.interface-mode-state').setAttribute('data-interface-mode-state', '');
    append(control, toggle); append(host, control);
    toggle.addEventListener('click', function () { setMode(!enabled); });
    return control;
  }

  function resolveSignal(id) { return targets[id] || null; }
  function installedSignal(id) { return registry && typeof registry.getSignalById === 'function' ? registry.getSignalById(id, { dictionary: true }) : null; }
  function restoreAttribute(element, name, value) { if (value === null) element.removeAttribute(name); else element.setAttribute(name, value); }

  function bindTargets() {
    targetState = [];
    document.querySelectorAll('[data-ui-term]').forEach(function (element) {
      var id = element.getAttribute('data-ui-term'); if (!resolveSignal(id)) return;
      var state = { element: element, id: id, role: element.getAttribute('role'), tabindex: element.getAttribute('tabindex'), ariaLabel: element.getAttribute('aria-label'), className: element.className };
      targetState.push(state);
      element.addEventListener('click', function (event) { if (!enabled) return; event.preventDefault(); openPanel(id, element); });
      element.addEventListener('keydown', function (event) { if (!enabled || (event.key !== 'Enter' && event.key !== ' ')) return; event.preventDefault(); openPanel(id, element); });
    });
  }
  function ensureTargetMarkers() {
    [['ui-archive', '[data-bundled-pack] .bundled-kicker'], ['ui-sync', '[data-notion-sync] > p'], ['ui-profile', '.profile-block .block-label']].forEach(function (item) { var element = document.querySelector('[data-ui-term="' + item[0] + '"]') || document.querySelector(item[1]); if (element && !element.getAttribute('data-ui-term')) element.setAttribute('data-ui-term', item[0]); });
    if (window.location && /(?:^|[?&])mode=review(?:&|$)/.test(window.location.search || '')) { var reviewTarget = document.querySelector('[data-field="category"]'); if (reviewTarget) reviewTarget.setAttribute('data-ui-term', 'ui-review'); }
    var bundled = document.querySelector('[data-bundled-pack]'); if (bundled && bundled.parentNode) { bundled.parentNode.id = 'content-library'; if (window.location && window.location.hash === '#content-library' && typeof bundled.parentNode.scrollIntoView === 'function') bundled.parentNode.scrollIntoView(); }
  }
  function setTargetState(on) {
    targetState.forEach(function (state) {
      var element = state.element;
      if (on) { element.classList.add('interface-term-target'); element.setAttribute('role', 'button'); element.setAttribute('tabindex', '0'); element.setAttribute('aria-label', 'Learn ' + text((resolveSignal(state.id) || {}).term)); }
      else { element.className = state.className; restoreAttribute(element, 'role', state.role); restoreAttribute(element, 'tabindex', state.tabindex); restoreAttribute(element, 'aria-label', state.ariaLabel); }
    });
  }

  function makePanel() {
    if (panel) return panel;
    panel = create('aside', 'interface-learning-panel'); panel.hidden = true; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); panel.setAttribute('aria-labelledby', 'interface-learning-title');
    var backdrop = create('button', 'interface-learning-backdrop'); backdrop.type = 'button'; backdrop.setAttribute('aria-label', 'Close interface vocabulary panel');
    var sheet = create('div', 'interface-learning-sheet'); var heading = create('div', 'interface-learning-heading');
    var kicker = create('span', 'interface-learning-kicker', 'UI VOCABULARY · 界面词'); var title = create('h2', '', ''); title.id = 'interface-learning-title'; closeButton = create('button', 'interface-learning-close', 'Close ×'); closeButton.type = 'button'; closeButton.setAttribute('aria-label', 'Close interface vocabulary panel'); var titleGroup = create('div'); append(titleGroup, kicker); append(titleGroup, title); append(heading, titleGroup); append(heading, closeButton);
    var body = create('div', 'interface-learning-body'); var pronunciation = create('p', 'interface-learning-pronunciation'); var feeling = createBlock('CHINESE FEELING', ''); var product = createPairBlock('IN PRODUCT INTERFACES'); var why = createPairBlock('WHY PRODUCTS USE IT'); var confused = createBlock('DON’T CONFUSE IT WITH', ''); var actions = create('div', 'interface-learning-actions'); var link = create('a', 'interface-learning-link');
    append(body, pronunciation); append(body, feeling.section); append(body, product.section); append(body, why.section); append(body, confused.section); append(actions, link); append(body, actions); append(sheet, heading); append(sheet, body); append(panel, backdrop); append(panel, sheet); append(document.body, panel);
    closeButton.addEventListener('click', closePanel); backdrop.addEventListener('click', closePanel); document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !panel.hidden) closePanel(); });
    return panel;
  }
  function createBlock(label, value) { var section = create('section', 'interface-learning-block'); var heading = create('span', 'interface-learning-label', label); var copy = create('p', 'interface-learning-copy', value); append(section, heading); append(section, copy); return { section: section, copy: copy }; }
  function createPairBlock(label) { var section = create('section', 'interface-learning-block'); var heading = create('span', 'interface-learning-label', label); var en = create('p', 'interface-learning-copy'); var zh = create('p', 'interface-learning-copy zh-text zh-meaning'); append(section, heading); append(section, en); append(section, zh); return { section: section, en: en, zh: zh }; }
  function setBlock(block, values) { var visible = values.some(hasText); block.section.hidden = !visible; if (block.copy) block.copy.textContent = text(values[0]); if (block.en) block.en.textContent = text(values[0]); if (block.zh) block.zh.textContent = text(values[1]); }
  function openPanel(id, source) {
    var signal = resolveSignal(id); if (!signal) return; makePanel(); var title = panel.querySelector('#interface-learning-title'); title.textContent = text(signal.displayTerm || signal.term).toUpperCase(); panel.querySelector('.interface-learning-pronunciation').textContent = text(signal.pronunciation);
    var blocks = panel.querySelectorAll('.interface-learning-block'); var feeling = blocks[0]; var product = blocks[1]; var why = blocks[2]; var confused = blocks[3];
    setBlock({ section: feeling, copy: feeling.querySelector('.interface-learning-copy') }, [signal.chineseFeeling]); setBlock({ section: product, en: product.querySelectorAll('.interface-learning-copy')[0], zh: product.querySelectorAll('.interface-learning-copy')[1] }, [signal.productMeaningEn, signal.productMeaningZh]); setBlock({ section: why, en: why.querySelectorAll('.interface-learning-copy')[0], zh: why.querySelectorAll('.interface-learning-copy')[1] }, [signal.whyProductsUseItEn, signal.whyProductsUseItZh]); var confusion = Array.isArray(signal.confusedWith) ? signal.confusedWith[0] : null; setBlock({ section: confused, copy: confused.querySelector('.interface-learning-copy') }, [confusion && ((confusion.term || '') + ' · ' + (confusion.differenceZh || ''))]);
    var link = panel.querySelector('.interface-learning-link'); var installed = installedSignal(id); link.href = installed ? './learn.html?mode=lookup&signal=' + encodeURIComponent(id) : './me.html#content-library'; link.textContent = installed ? 'Open full entry · 查看完整词条' : 'Install UI Vocabulary Core · 安装界面词包';
    previousFocus = source || document.activeElement; panel.hidden = false; document.body.classList.add('interface-learning-active'); closeButton.focus();
  }
  function closePanel() { if (!panel || panel.hidden) return; panel.hidden = true; document.body.classList.remove('interface-learning-active'); if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus(); previousFocus = null; }
  function setMode(on) { enabled = !!on; writeMode(enabled); document.body.classList.toggle('interface-learning-active-mode', enabled); setTargetState(enabled); var control = document.querySelector('[data-interface-mode-toggle]'); if (control) buttonLabel(control, enabled); var status = document.querySelector('[data-interface-mode-status]'); if (status) status.textContent = enabled ? 'Interface mode on · 界面学习中' : 'Interface mode off · 普通浏览'; if (!enabled) closePanel(); }

  makeControl(); var status = document.querySelector('[data-interface-mode-status]'); if (!status) { var control = document.querySelector('[data-interface-mode-control]'); if (control) { status = create('span', 'interface-mode-status'); status.setAttribute('data-interface-mode-status', ''); status.setAttribute('aria-live', 'polite'); append(control, status); } }
  ensureTargetMarkers(); bindTargets(); setMode(enabled);
}());
