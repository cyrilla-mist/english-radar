(function () {
  'use strict';
  function applyInterfaceControl() {
    var toggle = document.querySelector('[data-interface-mode-toggle]');
    if (!toggle) return;
    var en = toggle.querySelector('[data-interface-mode-en]');
    var zh = toggle.querySelector('[data-interface-mode-zh]');
    var status = toggle.querySelector('[data-interface-mode-state]');
    if (en) en.textContent = 'UI vocabulary';
    if (zh) zh.textContent = '界面词';
    toggle.setAttribute('aria-label', 'Interface vocabulary mode / 界面词模式');
    toggle.setAttribute('title', 'Interface vocabulary mode / 界面词模式');
    if (status) status.setAttribute('aria-hidden', 'true');
    if (!toggle.getAttribute('data-mobile-ux-bound')) {
      toggle.setAttribute('data-mobile-ux-bound', 'true');
      toggle.addEventListener('click', function () { window.setTimeout(applyInterfaceControl, 0); });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyInterfaceControl); else applyInterfaceControl();
}());
