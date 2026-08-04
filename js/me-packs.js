(function () {
  'use strict';

  var list = document.querySelector('[data-packs-list]');
  if (!list) return;

  function installStyles() {
    if (document.querySelector('[data-me-packs-style]')) return;
    var style = document.createElement('style');
    style.setAttribute('data-me-packs-style', '');
    style.textContent = [
      '.pack-manager-toolbar{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;margin:24px 0 8px;padding:16px 0;border-top:1px solid var(--line-light);border-bottom:1px solid var(--line-light)}',
      '.pack-manager-toolbar strong{display:block;color:var(--forest);font:20px var(--serif)}',
      '.pack-manager-toolbar span{display:block;margin-top:4px;color:var(--ink-soft);font-size:12px}',
      '.pack-manager-actions{display:flex;gap:14px;flex-wrap:wrap}',
      '.pack-manager-actions button{border:0;border-bottom:1px solid transparent;padding:4px 0;color:var(--forest);background:transparent;cursor:pointer;font-size:12px}',
      '.pack-manager-actions button:hover,.pack-manager-actions button:focus-visible{color:var(--clay);border-bottom-color:var(--clay)}',
      '.pack-row [data-pack-copy]{min-width:0;cursor:pointer;outline:none}',
      '.pack-row [data-pack-copy]:focus-visible{outline:2px solid var(--clay);outline-offset:4px}',
      '.pack-row [data-pack-copy] strong::after{content:"  −";color:var(--clay);font:12px var(--mono)}',
      '.pack-row.is-collapsed [data-pack-copy] strong::after{content:"  +"}',
      '.pack-row.is-collapsed [data-pack-description]{display:none}',
      '@media(max-width:767px){.pack-manager-toolbar{align-items:flex-start;flex-direction:column;gap:10px}.pack-manager-actions{gap:18px}.pack-row [data-pack-copy] strong{overflow-wrap:anywhere}}'
    ].join('');
    document.head.appendChild(style);
  }

  function createToolbar() {
    var existing = document.querySelector('[data-pack-manager-toolbar]');
    if (existing) return existing;

    var toolbar = document.createElement('div');
    toolbar.className = 'pack-manager-toolbar';
    toolbar.setAttribute('data-pack-manager-toolbar', '');

    var copy = document.createElement('div');
    var count = document.createElement('strong');
    count.setAttribute('data-pack-manager-count', '');
    count.textContent = '0 installed packs';
    var note = document.createElement('span');
    note.setAttribute('data-pack-manager-signals', '');
    note.textContent = '0 imported Signals';
    copy.appendChild(count);
    copy.appendChild(note);

    var actions = document.createElement('div');
    actions.className = 'pack-manager-actions';
    var expand = document.createElement('button');
    expand.type = 'button';
    expand.textContent = 'Expand all';
    expand.setAttribute('data-packs-expand', '');
    var collapse = document.createElement('button');
    collapse.type = 'button';
    collapse.textContent = 'Collapse all';
    collapse.setAttribute('data-packs-collapse', '');
    actions.appendChild(expand);
    actions.appendChild(collapse);

    toolbar.appendChild(copy);
    toolbar.appendChild(actions);
    list.parentNode.insertBefore(toolbar, list);

    expand.addEventListener('click', function () { setAll(false); });
    collapse.addEventListener('click', function () { setAll(true); });
    return toolbar;
  }

  function setCollapsed(row, collapsed) {
    var copy = row.querySelector('[data-pack-copy]');
    row.classList.toggle('is-collapsed', collapsed);
    if (copy) copy.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
  }

  function toggleRow(row) {
    setCollapsed(row, !row.classList.contains('is-collapsed'));
  }

  function enhanceRow(row, index, total) {
    if (!row || row.dataset.packManaged === 'true') return;
    var copy = row.querySelector('div');
    var description = copy && copy.querySelector('span');
    if (!copy) return;

    row.dataset.packManaged = 'true';
    copy.setAttribute('data-pack-copy', '');
    copy.setAttribute('role', 'button');
    copy.setAttribute('tabindex', '0');
    if (description) description.setAttribute('data-pack-description', '');

    var collapsed = total > 3 || window.matchMedia('(max-width: 767px)').matches;
    setCollapsed(row, collapsed);

    copy.addEventListener('click', function () { toggleRow(row); });
    copy.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      toggleRow(row);
    });
  }

  function setAll(collapsed) {
    list.querySelectorAll('.pack-row').forEach(function (row) {
      setCollapsed(row, collapsed);
    });
  }

  function signalCountFromRow(row) {
    var description = row.querySelector('[data-pack-description], div span');
    var match = description && description.textContent.match(/(\d+)\s+Signals/i);
    return match ? Number(match[1]) : 0;
  }

  function refresh() {
    var rows = Array.prototype.slice.call(list.querySelectorAll('.pack-row'));
    rows.forEach(function (row, index) { enhanceRow(row, index, rows.length); });

    var count = document.querySelector('[data-pack-manager-count]');
    var signalTotal = document.querySelector('[data-pack-manager-signals]');
    var totalSignals = rows.reduce(function (sum, row) { return sum + signalCountFromRow(row); }, 0);
    if (count) count.textContent = rows.length + (rows.length === 1 ? ' installed pack' : ' installed packs');
    if (signalTotal) signalTotal.textContent = totalSignals + ' imported Signals across content packs';
  }

  installStyles();
  createToolbar();
  refresh();

  var observer = new MutationObserver(function () { refresh(); });
  observer.observe(list, { childList: true });
}());
