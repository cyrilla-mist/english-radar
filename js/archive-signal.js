(function () {
  'use strict';
  function text(value) { return typeof value === 'string' ? value.trim() : ''; }
  function list(value) { return Array.isArray(value) ? value.filter(function (item) { return text(item); }) : []; }
  function humanLabel(value) { return text(value).toLowerCase().replace(/\b[a-z]/g, function (letter) { return letter.toUpperCase(); }); }
  function escapeHtml(value) { return String(value == null ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); }
  function pair(signal, heading, zhHeading, en, zh, className) { if (!text(signal[en]) && !text(signal[zh])) return ''; return '<section class="archive-detail-block ' + (className || '') + '"><h2>' + heading + '<small>' + zhHeading + '</small></h2>' + (text(signal[en]) ? '<p>' + escapeHtml(signal[en]) + '</p>' : '') + (text(signal[zh]) ? '<p class="archive-zh-body">' + escapeHtml(signal[zh]) + '</p>' : '') + '</section>'; }
  function usageGuide(signal) { if (!text(signal.useWhen) && !text(signal.useWhenZh) && !text(signal.avoidWhen) && !text(signal.avoidWhenZh)) return ''; return '<section class="archive-detail-block archive-usage wide"><h2>USAGE GUIDE<small>使用指南</small></h2><div class="archive-usage-grid">' + (text(signal.useWhen) || text(signal.useWhenZh) ? '<div><h3>USE WHEN <small>适合</small></h3>' + (text(signal.useWhen) ? '<p>' + escapeHtml(signal.useWhen) + '</p>' : '') + (text(signal.useWhenZh) ? '<p class="archive-zh-body">' + escapeHtml(signal.useWhenZh) + '</p>' : '') + '</div>' : '') + (text(signal.avoidWhen) || text(signal.avoidWhenZh) ? '<div><h3>AVOID WHEN <small>避免场景</small></h3>' + (text(signal.avoidWhen) ? '<p>' + escapeHtml(signal.avoidWhen) + '</p>' : '') + (text(signal.avoidWhenZh) ? '<p class="archive-zh-body">' + escapeHtml(signal.avoidWhenZh) + '</p>' : '') + '</div>' : '') + '</div></section>'; }
  function relatedBlock(values, archive) {
    if (!values.length) return '';
    var items = values.map(function (value) { var signal = archive && archive.index ? archive.index.byId[value] || archive.index.byTerm[archive.normalizeTerm(value)] : null; var label = signal ? humanLabel(signal.term) : value; return '<li>' + (signal ? '<a href="./archive-signal.html?id=' + encodeURIComponent(signal.id) + '">' + escapeHtml(label) + '</a>' : escapeHtml(label)) + '</li>'; }).join('');
    return '<section class="archive-detail-block"><h2>RELATED SIGNALS<small>相关表达</small></h2><ul class="archive-detail-list">' + items + '</ul></section>';
  }
  function confusedBlock(values) {
    if (!values.length) return '';
    return '<section class="archive-detail-block archive-confused wide"><h2>CONFUSED WITH<small>易混淆表达</small></h2><div class="archive-comparison-grid">' + values.map(function (item) { return '<article class="archive-comparison-card"><h3>' + escapeHtml(item.term || item.surface || '') + '</h3>' + (text(item.differenceEn || item.exampleEn) ? '<p>' + escapeHtml(item.differenceEn || item.exampleEn) + '</p>' : '') + (text(item.differenceZh || item.exampleZh) ? '<p class="archive-zh-body">' + escapeHtml(item.differenceZh || item.exampleZh) + '</p>' : '') + '</article>'; }).join('') + '</div></section>';
  }
  function variantsBlock(group) {
    if (!group || group.variants.length < 2) return '';
    return '<details class="archive-detail-block archive-disclosure wide"><summary>ARCHIVE RECORDS <span>档案记录</span></summary><p class="archive-variant-note">' + group.variants.length + ' records</p><div class="archive-variant-list">' + group.variants.map(function (signal) { return '<a href="./archive-signal.html?id=' + encodeURIComponent(signal.id) + '"><strong>' + escapeHtml(signal.displayTerm || signal.term) + '</strong><span>' + escapeHtml(signal.category) + '</span></a>'; }).join('') + '</div><p class="archive-variant-note">Showing the most complete record. / 当前展示信息更完整的记录。</p></details>';
  }
  function recordInfo(signal) { return '<details class="archive-detail-block archive-disclosure wide"><summary>RECORD INFO <span>记录信息</span></summary><dl class="archive-record-info"><div><dt>Signal ID</dt><dd>' + escapeHtml(signal.id) + '</dd></div><div><dt>Source</dt><dd>' + escapeHtml(signal.sourceName || signal.sourceType || 'English Radar registry') + '</dd></div><div><dt>Category</dt><dd>' + escapeHtml(signal.category) + '</dd></div><div><dt>Status</dt><dd>' + escapeHtml(signal.status || signal.contentStatus || 'indexed') + '</dd></div></dl></details>'; }
  function render(signal, archive) {
    if (!signal) return '<section class="archive-detail-block wide"><h2>RECORD NOT FOUND<small>未找到记录</small></h2><p>This identifier is not in the current Signal Registry.</p></section>';
    var group = archive && typeof archive.findGroup === 'function' ? archive.findGroup(signal.id) : null;
    var primary = [pair(signal, 'MEANING', '含义', 'meaningEn', 'meaningZh', 'archive-primary'), pair(signal, 'CULTURAL CONTEXT', '文化语境', 'culturalContextEn', 'culturalContextZh', 'archive-primary'), pair(signal, 'PRODUCT MEANING', '产品含义', 'productMeaningEn', 'productMeaningZh', 'archive-primary'), pair(signal, 'WHY PRODUCTS USE IT', '为何这样命名', 'whyProductsUseItEn', 'whyProductsUseItZh', 'archive-primary'), pair(signal, 'EXAMPLE', '示例', 'exampleEn', 'exampleZh', 'archive-primary')].filter(function (section) { return section; }).join('');
    var deepDive = '<details class="archive-detail-block archive-disclosure wide"><summary>DEEP DIVE <span>深入了解</span></summary>' + pair(signal, 'ORIGINAL MEANING', '原始含义', 'originalMeaningEn', 'originalMeaningZh', '') + relatedBlock(list(signal.relatedTerms), archive) + confusedBlock(Array.isArray(signal.confusedWith) ? signal.confusedWith : []) + '</details>';
    return primary + usageGuide(signal) + deepDive + variantsBlock(group) + recordInfo(signal);
  }
  function boot() {
    var archive = window.EnglishRadarArchive;
    var signal = archive && typeof archive.findSignal === 'function' ? archive.findSignal(new URLSearchParams(window.location.search).get('id') || '') : null;
    var title = document.querySelector('[data-archive-detail-title]');
    var type = document.querySelector('[data-archive-detail-type]');
    var note = document.querySelector('[data-archive-detail-term-note]');
    var chips = document.querySelector('[data-archive-detail-chips]');
    var content = document.querySelector('[data-archive-detail-content]');
    if (title) title.textContent = signal ? (signal.displayTerm || signal.term) : 'UNKNOWN RECORD';
    if (type) type.textContent = signal ? archive.recordType(signal) : 'ARCHIVE ERROR';
    if (note) note.textContent = signal ? ((signal.pronunciation || signal.ipa || '') + (signal.category ? ' · ' + signal.category : '')) : '';
    if (chips && signal) chips.innerHTML = list(signal.platforms).concat(list(signal.tone)).map(function (value) { return '<span class="archive-chip">' + escapeHtml(value) + '</span>'; }).join('');
    if (content) content.innerHTML = render(signal, archive);
  }
  window.EnglishRadarArchiveDetail = { render: render };
  document.addEventListener('DOMContentLoaded', boot);
}());
