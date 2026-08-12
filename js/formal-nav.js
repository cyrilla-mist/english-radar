(function () {
  'use strict';
  function enhance() {
    document.querySelectorAll('.side-nav').forEach(function (nav) {
      var items = nav.querySelectorAll('.nav-item');
      if (items.length !== 5 || nav.querySelector('a[href="./archive.html"]')) return;
      var archive = document.createElement('a');
      archive.className = 'nav-item';
      archive.href = './archive.html';
      archive.innerHTML = '<span class="nav-index">04</span><span>Archive</span>';
      items[2].after(archive);
      nav.querySelectorAll('.nav-item').forEach(function (item, index) { var number = item.querySelector('.nav-index'); if (number) number.textContent = String(index + 1).padStart(2, '0'); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enhance); else enhance();
}());
