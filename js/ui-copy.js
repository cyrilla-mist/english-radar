(function () {
  'use strict';

  var copy = {
    Today: '今日学习', Review: '复习', Dictionary: '词典', Inbox: '生词收集箱', Me: '我的雷达',
    'Daily Mix': '每日组合', 'Discovery mode': '发现模式', 'Spaced review': '间隔复习',
    'LEARNING ENGINE': '学习引擎', 'LIBRARY SESSION': '学习 Session', 'TODAY PROGRESS': '今日进度',
    'LIBRARY STATUS': '词库状态', 'CONTEXT CHECK': '语境测试', 'WEAK SIGNALS': '薄弱表达',
    'RADAR INBOX': '雷达收集箱', 'CATEGORY FOCUS': '分类学习', 'SIGNAL PROFILE': '表达档案',
    'USAGE BOUNDARY': '使用边界', 'CHINESE FEELING': '中文语感', 'CORE MEANING': '核心含义',
    'IN CONTEXT': '真实语境', 'MASTERY': '掌握状态', 'MY RADAR': '我的雷达',
    'OVERVIEW': '总览', 'LAST 7 DAYS': '最近 7 天', 'MASTERY': '掌握状态',
    'CATEGORY COVERAGE': '分类覆盖', 'RECENT ACTIVITY': '最近活动', 'CONTEXT INSIGHTS': '语境洞察',
    'CONTENT LIBRARY': '内容库', 'NOTION SYNC': 'Notion 同步', 'PREFERENCES': '偏好设置', 'DATA & BACKUP': '数据与备份'
  };

  function addHelper(element, value) {
    if (!element || !value || element.querySelector('.zh-helper')) return;
    var helper = document.createElement('small'); helper.className = 'zh-helper'; helper.textContent = value; element.appendChild(helper);
  }
  function navKey(link) {
    var href = link.getAttribute('href') || '';
    return href.indexOf('dictionary') !== -1 ? 'Dictionary' : href.indexOf('inbox') !== -1 ? 'Inbox' : href.indexOf('me') !== -1 ? 'Me' : href.indexOf('learn') !== -1 ? 'Review' : 'Today';
  }
  function apply() {
    document.querySelectorAll('.side-nav .nav-item, .mobile-nav a').forEach(function (link) {
      var key = navKey(link); addHelper(link, copy[key]);
    });
    document.querySelectorAll('.section-label, .block-label, .eyebrow').forEach(function (label) {
      var first = label.childNodes[0]; var text = first && first.nodeType === 3 ? first.textContent.trim() : label.textContent.trim().split(/\s*\n/)[0];
      var key = text.toUpperCase(); Object.keys(copy).some(function (candidate) { if (candidate.toUpperCase() === key) { addHelper(label, copy[candidate]); return true; } return false; });
    });
    document.querySelectorAll('.me-section').forEach(function (section) {
      var label = section.querySelector(':scope > .section-label'); if (!label) return;
      var title = (label.childNodes[0] && label.childNodes[0].textContent || '').trim().toUpperCase();
      var key = { 'CONTENT LIBRARY': 'content-library', 'NOTION SYNC': 'notion-sync', 'PREFERENCES': 'preferences', 'DATA & BACKUP': 'backup' }[title];
      if (!key || section.querySelector('.me-collapse-toggle')) return;
      section.dataset.meCollapsible = key;
      var button = document.createElement('button'); button.type = 'button'; button.className = 'me-collapse-toggle'; button.textContent = 'Expand'; button.setAttribute('aria-expanded', 'false');
      var content = Array.prototype.filter.call(section.children, function (child) { return child !== label; });
      content.forEach(function (child) { child.hidden = true; });
      button.addEventListener('click', function () { var expanded = button.getAttribute('aria-expanded') === 'true'; button.setAttribute('aria-expanded', expanded ? 'false' : 'true'); button.textContent = expanded ? 'Expand' : 'Collapse'; content.forEach(function (child) { child.hidden = expanded; }); });
      label.appendChild(button);
    });
  }
  window.ENGLISH_RADAR_UI_COPY = copy;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply); else apply();
}());
