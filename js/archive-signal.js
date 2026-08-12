(function () {
  'use strict';
  function text(value) { return typeof value === 'string' ? value.trim() : ''; }
  function list(value) { return Array.isArray(value) ? value.filter(function (item) { return text(item); }) : []; }
  function escapeHtml(value) { return String(value == null ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); }
  function pair(signal, heading, zhHeading, en, zh, wide) { if (!text(signal[en]) && !text(signal[zh])) return ''; return '<section class="archive-detail-block' + (wide ? ' wide' : '') + '"><h2>' + heading + '<small>' + zhHeading + '</small></h2>' + (text(signal[en]) ? '<p>' + escapeHtml(signal[en]) + '</p>' : '') + (text(signal[zh]) ? '<p class="archive-zh-body">' + escapeHtml(signal[zh]) + '</p>' : '') + '</section>'; }
  function listBlock(heading, zhHeading, values, links) { if (!values.length) return ''; return '<section class="archive-detail-block"><h2>' + heading + '<small>' + zhHeading + '</small></h2><ul class="archive-detail-list">' + values.map(function (value) { return '<li>' + (links ? '<a href="./archive-signal.html?id=' + encodeURIComponent(value) + '">' + escapeHtml(value) + '</a>' : escapeHtml(value)) + '</li>'; }).join('') + '</ul></section>'; }
  function objectBlock(heading, zhHeading, values) { if (!values.length) return ''; return '<section class="archive-detail-block wide"><h2>' + heading + '<small>' + zhHeading + '</small></h2>' + values.map(function (item) { return '<p><strong>' + escapeHtml(item.term || item.surface || '') + '</strong> ' + escapeHtml(item.differenceEn || item.exampleEn || '') + (text(item.differenceZh || item.exampleZh) ? '<br><span class="archive-zh-body">' + escapeHtml(item.differenceZh || item.exampleZh) + '</span>' : '') + '</p>'; }).join('') + '</section>'; }
  function variantsBlock(group, primary) { if (!group || group.variants.length < 2) return ''; var variants = group.variants.filter(function (signal) { return signal.id !== primary.id; }); return '<section class="archive-detail-block wide"><h2>ARCHIVE SOURCES<small>档案来源 / 记录变体</small></h2><p class="archive-variant-note">' + group.variants.length + ' records share the normalized term “' + escapeHtml(primary.term) + '”. The richest record is shown above; the registry remains unchanged.</p><ul class="archive-detail-list">' + variants.map(function (signal) { return '<li><a href="./archive-signal.html?id=' + encodeURIComponent(signal.id) + '">' + escapeHtml(signal.category) + ' / ' + escapeHtml(signal.id) + '</a></li>'; }).join('') + '</ul></section>'; }
  function render(signal, archive) {
    if (!signal) return '<section class="archive-detail-block wide"><h2>RECORD NOT FOUND<small>未找到记录</small></h2><p>This identifier is not in the current Signal Registry.</p></section>';
    var group = archive && typeof archive.findGroup === 'function' ? archive.findGroup(signal.id) : null;
    var metadata = '<section class="archive-detail-block"><h2>RECORD METADATA<small>记录信息</small></h2><p>ID / ' + escapeHtml(signal.id) + '<br>TERM / ' + escapeHtml(signal.term) + '<br>PRONUNCIATION / ' + escapeHtml(signal.pronunciation || signal.ipa || '-') + '<br>CATEGORY / ' + escapeHtml(signal.category) + '<br>STATUS / ' + escapeHtml(signal.status || signal.contentStatus || 'indexed') + '</p></section>';
    var sections = [metadata, listBlock('NETWORK / CONTEXT', '网络 / 语境', list(signal.platforms)), listBlock('TONE', '语气', list(signal.tone)), pair(signal, 'MEANING', '含义', 'meaningEn', 'meaningZh', true), pair(signal, 'ORIGINAL MEANING', '原始含义', 'originalMeaningEn', 'originalMeaningZh', true), pair(signal, 'PRODUCT MEANING', '产品含义', 'productMeaningEn', 'productMeaningZh', true), pair(signal, 'CULTURAL CONTEXT', '文化语境', 'culturalContextEn', 'culturalContextZh', true), pair(signal, 'WHY PRODUCTS USE IT', '产品为何使用', 'whyProductsUseItEn', 'whyProductsUseItZh', true), pair(signal, 'EXAMPLE', '示例', 'exampleEn', 'exampleZh', true), pair(signal, 'USAGE NOTES', '使用提示', 'useWhen', 'useWhenZh', false), pair(signal, 'AVOID WHEN', '避免场景', 'avoidWhen', 'avoidWhenZh', false), listBlock('RELATED SIGNALS', '相关表达', list(signal.relatedTerms), true), objectBlock('CONFUSED WITH', '易混淆表达', Array.isArray(signal.confusedWith) ? signal.confusedWith : []), variantsBlock(group, signal)];
    return sections.filter(function (section) { return section; }).join('');
  }
  function boot() {
    var archive = window.EnglishRadarArchive;
    var signal = archive && typeof archive.findSignal === 'function' ? archive.findSignal(new URLSearchParams(window.location.search).get('id') || '') : null;
    var title = document.querySelector('[data-archive-detail-title]');
    var type = document.querySelector('[data-archive-detail-type]');
    var note = document.querySelector('[data-archive-detail-term-note]');
    var content = document.querySelector('[data-archive-detail-content]');
    if (title) title.textContent = signal ? (signal.displayTerm || signal.term) : 'UNKNOWN RECORD';
    if (type) type.textContent = signal ? archive.recordType(signal) : 'ARCHIVE ERROR';
    if (note) note.textContent = signal ? ((signal.pronunciation || signal.ipa || '') + (signal.category ? ' · ' + signal.category : '')) : '';
    if (content) content.innerHTML = render(signal, archive);
  }
  window.EnglishRadarArchiveDetail = { render: render };
  document.addEventListener('DOMContentLoaded', boot);
}());
