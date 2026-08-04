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
  var actionCopy = {
    'Start Library Session': '开始学习', 'Quick Scan': '快速浏览', Standard: '标准学习', 'Deep Dive': '深入学习', Custom: '自定义',
    'New signals': '新表达', 'Reviews waiting': '待复习', 'Signals explored': '已学习表达', 'clearly understood': '已清楚理解', 'still fuzzy': '还不太清楚',
    Listen: '朗读', Favorite: '收藏', 'Practice this signal': '练习这个表达', Previous: '上一个', Skip: '跳过', 'New to me': '第一次接触', 'Still fuzzy': '还不太清楚', Clear: '已经理解',
    Search: '搜索', All: '全部', Core: '核心', Imported: '导入', Personal: '个人', Favorites: '收藏', 'Load more': '加载更多', Signals: '表达',
    Expression: '表达', Source: '来源', 'Original sentence': '原句', 'Personal note': '个人笔记', 'Save to Inbox': '保存到收集箱', Undecoded: '未解码', Decoded: '已解码',
    Expand: '展开', Collapse: '收起', 'Save preferences': '保存偏好', 'Export backup': '导出备份', 'Import backup': '导入备份', 'Reset all local data': '重置本地数据'
  };

  function addHelper(element, value) {
    if (!element || !value || element.querySelector('.zh-helper')) return;
    var helper = document.createElement('small'); helper.className = 'zh-helper'; helper.textContent = value; element.appendChild(helper);
  }
  function decorateActions() {
    document.querySelectorAll('button, a.primary-button, .context-check-list > a, .signal-actions button, .audio-controls button').forEach(function (element) {
      if (element.classList.contains('me-collapse-toggle')) return;
      var visible = element.textContent.replace(/[→↗←▶×]/g, ' ').replace(/\s+/g, ' ').trim();
      var key = Object.keys(actionCopy).find(function (candidate) { return visible === candidate || visible.indexOf(candidate) === 0; });
      if (key) addHelper(element, actionCopy[key]);
    });
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
      section.dataset.meCollapsible = key; section.classList.add('me-collapsible');
      var button = document.createElement('button'); button.type = 'button'; button.className = 'me-collapse-toggle'; button.textContent = 'Expand · 展开'; button.setAttribute('aria-expanded', 'false');
      var content = Array.prototype.filter.call(section.children, function (child) { return child !== label; });
      var wrapper = document.createElement('div'); wrapper.className = 'me-collapsible-content'; wrapper.id = key + '-content'; content.forEach(function (child) { wrapper.appendChild(child); }); section.appendChild(wrapper); content = [wrapper]; content.forEach(function (child) { child.hidden = true; });
      var status = document.createElement('small'); status.className = 'me-collapse-status'; status.textContent = getPanelStatus(key, wrapper); label.appendChild(status);
      button.setAttribute('aria-controls', wrapper.id);
      button.addEventListener('click', function () { var expanded = button.getAttribute('aria-expanded') === 'true'; button.setAttribute('aria-expanded', expanded ? 'false' : 'true'); button.textContent = expanded ? 'Expand · 展开' : 'Collapse · 收起'; status.textContent = getPanelStatus(key, wrapper); wrapper.hidden = expanded; });
      label.appendChild(button);
    });
    decorateActions();
  }
  function getPanelStatus(key, content) {
    if (key === 'content-library') { var packs = content.querySelector('[data-library="packs"]'); return packs ? (packs.textContent || '0') + ' installed packs' : 'Installed packs'; }
    if (key === 'notion-sync') { var enabled = content.querySelector('[data-sync-enabled]'); return enabled && enabled.checked === true ? 'Notion sync enabled' : 'Notion sync disabled'; }
    if (key === 'preferences') { var session = content.querySelector('[name="defaultSessionSize"]'); return session ? 'Session ' + session.value : 'Local preference'; }
    return 'Local backup';
  }
  function refreshPanelStatuses() {
    document.querySelectorAll('.me-section.me-collapsible').forEach(function (section) {
      var key = section.dataset.meCollapsible;
      var content = section.querySelector('.me-collapsible-content');
      var status = section.querySelector('.me-collapse-status');
      if (key && content && status) status.textContent = getPanelStatus(key, content);
    });
  }
  window.ENGLISH_RADAR_UI_COPY = copy;
  window.EnglishRadarUI = window.EnglishRadarUI || {};
  window.EnglishRadarUI.refreshMePanelStatuses = refreshPanelStatuses;
  document.addEventListener('english-radar:me-ready', refreshPanelStatuses);
  document.addEventListener('change', function (event) {
    var target = event && event.target;
    if (target && typeof target.closest === 'function' && (target.closest('[data-notion-sync]') || target.closest('[data-preferences-form]') || target.closest('[data-content-library]'))) refreshPanelStatuses();
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply); else apply();
}());
