(function () {
  'use strict';

  var version = 'v0.1.0';

  function firstText(element, value) {
    if (!element) return;
    for (var index = 0; index < element.childNodes.length; index += 1) {
      if (element.childNodes[index].nodeType === 3) {
        element.childNodes[index].nodeValue = value;
        return;
      }
    }
    element.insertBefore(document.createTextNode(value), element.firstChild || null);
  }

  function apply() {
    document.querySelectorAll('meta[name="version"]').forEach(function (meta) { meta.setAttribute('content', version); });
    document.querySelectorAll('meta[name="description"]').forEach(function (meta) {
      meta.setAttribute('content', String(meta.getAttribute('content') || '').replace(/English Radar v1\.8\.3/g, 'Sideglance Radar ' + version).replace(/English Radar/g, 'Sideglance Radar'));
    });
    document.title = document.title.replace(/English Radar/g, 'Sideglance Radar').replace(/^Today\b/, 'Radar');

    document.querySelectorAll('.brand, .mobile-brand').forEach(function (brand) {
      brand.setAttribute('aria-label', 'Sideglance Radar');
      var copy = brand.querySelector('.brand-copy');
      if (!copy) return;
      var strong = copy.querySelector('strong');
      var small = copy.querySelector('small');
      if (strong) strong.textContent = 'SIDEGLANCE';
      if (small) small.textContent = 'RADAR · Internet Context Intelligence';
    });

    document.querySelectorAll('.side-nav .nav-item, .mobile-nav a').forEach(function (link) {
      if (link.getAttribute('href') !== './index.html') return;
      var desktopLabel = link.querySelector('.nav-index + span');
      if (desktopLabel) firstText(desktopLabel, 'Radar');
      else firstText(link, 'Radar');
    });
    document.querySelectorAll('.header-note').forEach(function (note) {
      if (/PERSONAL LANGUAGE ARCHIVE/i.test(note.textContent)) note.textContent = 'INTERNET CONTEXT INTELLIGENCE';
    });
    document.querySelectorAll('.archive-kicker').forEach(function (kicker) { kicker.textContent = 'SIDEGLANCE RADAR ARCHIVE'; });
    document.querySelectorAll('.archive-archive-footer .archive-link').forEach(function (link) { link.textContent = 'Sideglance Radar'; });
    document.querySelectorAll('.page-footer').forEach(function (footer) {
      footer.querySelectorAll('span').forEach(function (span) {
        span.textContent = span.textContent.replace(/ENGLISH RADAR \/ V1\.8\.3/gi, 'SIDEGLANCE RADAR / ' + version.toUpperCase()).replace(/PERSONAL LANGUAGE ARCHIVE/gi, 'INTERNET CONTEXT INTELLIGENCE');
      });
    });

    var mobileToday = document.querySelector('.mobile-today');
    if (mobileToday) firstText(mobileToday, 'RADAR ');
    var homeHeading = document.querySelector('.today-intro h1');
    if (homeHeading) {
      firstText(homeHeading, 'What should you notice');
      var emphasis = homeHeading.querySelector('em');
      if (emphasis) emphasis.textContent = 'in the radar today?';
    }
    var homeLabel = document.querySelector('.today-intro .section-label');
    if (homeLabel) firstText(homeLabel, 'RADAR');

    var walker = document.createTreeWalker(document.body, 4);
    while (walker.nextNode()) walker.currentNode.nodeValue = walker.currentNode.nodeValue.replace(/v1\.8\.3/gi, version);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply); else apply();
}());
