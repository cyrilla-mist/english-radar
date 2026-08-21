const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const learn = read('learn.html');
const entry = read('signal-entry.html');
const entryScript = read('js/signal-entry.js');
const session = read('js/session.js');

assert.match(learn, /css\/review\.css/);
assert.match(learn, /data-context-review/);
assert.match(learn, /data-review-context-reveal/);
assert.match(learn, /data-review-context-return/);
assert.match(entry, /data-entry-review/);
assert.match(entryScript, /mode=review/);
assert.match(entryScript, /source=signal-entry/);
assert.ok(!/radarReviewQueue|savedSignals|contextMemory/.test(entryScript), 'Phase 6 must not add a new storage concept');
assert.match(session, /sourceParam/);
assert.match(session, /getReviewQueue/);
assert.match(session, /data-context-review/);

const context = {
  window: { addEventListener() {} },
  document: { querySelector() { return null; } }
};
vm.runInNewContext(entryScript, context);
const reviewApi = context.window.SideglanceSignalEntry;
assert.ok(reviewApi && typeof reviewApi.queueReviewState === 'function');

const now = '2026-08-21T00:00:00.000Z';
const fresh = reviewApi.queueReviewState({}, { id: 'lowkey' }, new Date(now));
assert.strictEqual(fresh.lowkey.nextReviewAt, now);
assert.strictEqual(fresh.lowkey.mastery, 'new');
assert.strictEqual(fresh.lowkey.firstLearnedAt, null);
assert.strictEqual(fresh.lowkey.favorite, false);

const existing = {
  lowkey: {
    signalId: 'lowkey', mastery: 'fuzzy', firstLearnedAt: '2026-08-01T00:00:00.000Z',
    lastReviewedAt: '2026-08-10T00:00:00.000Z', nextReviewAt: '2026-08-30T00:00:00.000Z',
    reviewCount: 2, errorCount: 1, favorite: true
  }
};
const preserved = reviewApi.queueReviewState(existing, { id: 'lowkey' }, new Date(now));
assert.strictEqual(preserved.lowkey.nextReviewAt, existing.lowkey.nextReviewAt);
assert.strictEqual(preserved.lowkey.favorite, true);
assert.strictEqual(preserved.lowkey.reviewCount, 2);
assert.deepStrictEqual(existing.lowkey, {
  signalId: 'lowkey', mastery: 'fuzzy', firstLearnedAt: '2026-08-01T00:00:00.000Z',
  lastReviewedAt: '2026-08-10T00:00:00.000Z', nextReviewAt: '2026-08-30T00:00:00.000Z',
  reviewCount: 2, errorCount: 1, favorite: true
});

console.log('v0.1 radar review tests: PASS');
