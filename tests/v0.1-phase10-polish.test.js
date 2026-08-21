const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const expectedNav = ['Radar', 'Review', 'Dictionary', 'Archive', 'Inbox', 'Me'];

for (const page of ['index.html', 'signal-entry.html', 'learn.html', 'archive.html', 'me.html']) {
  const html = read(page);
  const links = [...html.matchAll(/<a class="nav-item[^>]*href="([^"]+)"[^>]*>\s*<span class="nav-index">(\d+)<\/span>\s*<span>([^<]+)<\/span>/g)];
  assert.deepEqual(links.map(match => match[3]), expectedNav, `${page} desktop navigation should expose all primary routes`);
  assert.deepEqual(links.map(match => match[2]), expectedNav.map((_, index) => String(index + 1).padStart(2, '0')), `${page} desktop navigation indexes should be stable`);
}

assert.match(read('learn.html'), /nav-item is-active[^>]*aria-current="page" href="\.\/learn\.html\?mode=review"/);
assert.match(read('me.html'), /nav-item is-active[^>]*aria-current="page" href="\.\/me\.html"/);
assert.match(read('js/session.js'), /No reviews due/);
assert.match(read('js/archive.js'), /No matching signals found/);
assert.match(read('me.html'), /You have not built your radar yet/);
console.log('v0.1 Phase 10 polish tests: PASS');
