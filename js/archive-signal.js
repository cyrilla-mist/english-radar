(function () {
  'use strict';
  function text(value) { return typeof value === 'string' ? value.trim() : ''; }
  function list(value) { return Array.isArray(value) ? value.filter(function (item) { return text(item); }) : []; }
  function escapeHtml(value) { return String(value === undefined || value === null ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); }
  function pair(signal, heading, en, zh, wide) {
    if (!text(signal[en]) && !text(signal[zh])) return '';
    return '<section class="archive-detail-block' + (wide ? ' wide' : '') + '"><h2>' + heading + '</h2>' + (text(signal[en]) ? '<p>' + escapeHtml(signal[en]) + '</p>' : '') + (text(signal[zh]) ? '<p>' + escapeHtml(signal[zh]) + '</p>' : '') + '</section>';
  }
  function listBlock(heading, values, links) {
    if (!values.length) return '';
    return '<section class="archive-detail-block"><h2>' + heading + '</h2><ul class="archive-detail-list">' + values.map(function (value) { return '<li>' + (links ? '<a href="./archive-signal.html?id=' + encodeURIComponent(value) + '">' + escapeHtml(value) + '</a>' : escapeHtml(value)) + '</li>'; }).join('') + '</ul></section>';
  }
  function objectBlock(heading, values) {
    if (!values.length) return '';
    return '<section class="archive-detail-block wide"><h2>' + heading + '</h2>' + values.map(function (item) { return '<p><strong>' + escapeHtml(item.term || item.surface || '') + '</strong> ' + escapeHtml(item.differenceEn || item.exampleEn || '') + (text(item.differenceZh || item.exampleZh) ? '<br>' + escapeHtml(item.differenceZh || item.exampleZh) : '') + '</p>'; }).join('') + '</section>';
  }
  function render(signal, archive) {
    if (!signal) return '<section class="archive-detail-block wide"><h2>RECORD NOT FOUND</h2><p>This identifier is not in the current Signal Registry.</p></section>';
    var platform = list(signal.platforms);
    var tones = list(signal.tone);
    var metadata = '<section class="archive-detail-block"><h2>RECORD METADATA</h2><p>ID / ' + escapeHtml(signal.id) + '<br>TERM / ' + escapeHtml(signal.term) + '<br>PRONUNCIATION / ' + escapeHtml(signal.pronunciation || signal.ipa || '—') + '<br>CATEGORY / ' + escapeHtml(signal.category) + '<br>STATUS / ' + escapeHtml(signal.status || signal.contentStatus || 'indexed') + '</p></section>';
    var network = listBlock('NETWORK / CONTEXT', platform);
    var tone = listBlock('TONE', tones);
    var sections = [
      metadata, tone, network,
      pair(signal, 'MEANING', 'meaningEn', 'meaningZh', true),
      pair(signal, 'ORIGINAL TRACE', 'originalMeaningEn', 'originalMeaningZh', true),
      pair(signal, 'PRODUCT MEANING', 'productMeaningEn', 'productMeaningZh', true),
      pair(signal, 'SEMANTIC / CULTURAL CONTEXT', 'culturalContextEn', 'culturalContextZh', true),
      pair(signal, 'WHY PRODUCTS USE IT', 'whyProductsUseItEn', 'whyProductsUseItZh', true),
      pair(signal, 'EXAMPLE', 'exampleEn', 'exampleZh', true),
      pair(signal, 'USAGE NOTES', 'useWhen', 'useWhenZh', false),
      pair(signal, 'AVOID WHEN', 'avoidWhen', 'avoidWhenZh', false),
      listBlock('RELATED SIGNALS', list(signal.relatedTerms), true),
      objectBlock('CONFUSED WITH', Array.isArray(signal.confusedWith) ? signal.confusedWith : [])
    ];
    return sections.filter(function (section) { return section; }).join('');
  }
  function boot() {
    var archive = window.EnglishRadarArchive;
    var params = new URLSearchParams(window.location.search);
    var signal = archive && typeof archive.findSignal === 'function' ? archive.findSignal(params.get('id') || '') : null;
    var title = document.querySelector('[data-archive-detail-title]');
    var type = document.querySelector('[data-archive-detail-type]');
    var content = document.querySelector('[data-archive-detail-content]');
    if (title) title.textContent = signal ? (signal.displayTerm || signal.term) : 'UNKNOWN RECORD';
    if (type) type.textContent = signal ? archive.recordType(signal) : 'ARCHIVE ERROR';
    if (content) content.innerHTML = render(signal, archive);
  }
  window.EnglishRadarArchiveDetail = { render: render };
  document.addEventListener('DOMContentLoaded', boot);
}());
