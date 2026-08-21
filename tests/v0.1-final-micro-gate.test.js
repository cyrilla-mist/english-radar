const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const html = read('signal-entry.html');
const css = read('css/signal-entry.css');

assert.match(html, /<a class="skip-link" href="#main-content">Skip to content<\/a>/);
assert.match(css, /\.signal-entry-page \.skip-link\s*\{[^}]*transform:\s*translateY\(-150%\)/s);
assert.match(css, /\.signal-entry-page \.skip-link\s*\{[^}]*position:\s*fixed/s);
assert.match(css, /\.signal-entry-page \.skip-link:focus, \.signal-entry-page \.skip-link:focus-visible\s*\{[^}]*transform:\s*translateY\(0\)/s);
assert.match(css, /\.signal-entry-page \.skip-link:focus, \.signal-entry-page \.skip-link:focus-visible\s*\{[^}]*outline:/s);
assert.equal((html.match(/class="skip-link"/g) || []).length, 1);

console.log('v0.1 final micro gate tests: PASS');
