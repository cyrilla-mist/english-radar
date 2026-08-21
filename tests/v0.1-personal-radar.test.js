const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const me = read('me.html');
const script = read('js/me.js');
const css = read('css/me.css');

assert.match(me, /css\/me\.css/);
assert.match(me, /data-personal-radar/);
assert.match(me, /Signals noticed/);
assert.match(me, /Signals reviewed/);
assert.match(me, /Signals cleared/);
assert.match(me, /You have not built your radar yet\./);
assert.match(me, /Your first signal starts here\./);
assert.match(script, /personalRadarData/);
assert.match(script, /radarCategoryLabel/);
assert.match(script, /getProgress/);
assert.match(script, /mastery === 'clear'/);
assert.ok(!/personalRadar|radarPatterns|categoryDistribution/.test(read('js/storage.js')));
assert.match(css, /personal-radar-category/);
assert.match(css, /@media \(max-width: 767px\)/);
assert.doesNotMatch(css, /streak|points|badge/i);
console.log('v0.1 personal radar tests: PASS');
