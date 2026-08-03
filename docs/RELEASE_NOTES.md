# Release Notes

## English Radar v1.1 Preview

Status: development branch only. The public site remains on v1.0 until the Learning Engine passes functional, responsive and regression testing.

### Learning Engine

- Added Daily Mix with five Signals selected from unseen, personal-interest, weak or due, and older learned items.
- Added Unseen Discovery mode.
- Added Category Focus for Internet, Builder, Product Design, Fandom and Sports.
- Added a Daily Mix preview to Today.
- Added a Library Status dashboard showing total installed, unseen, learning, clear, due and quiz-ready Signals.

### Review scheduling

- New: review again after 1 day.
- Fuzzy: 2, 3, 7 and then 14 days.
- Clear: 7, 14, 30 and then 60 days.
- Existing progress records remain compatible; future reviews use the expanded schedule when a Signal is rated again.

### Validation

- Added `tests/learning-engine-v1.1.test.js`.
- Added pull-request checks for content validation, project structure and Learning Engine behavior.
- The feature remains isolated on `feat/v1.1-learning-engine` and Draft PR #1.
- Merge is blocked until local browser testing confirms Daily Mix composition, unseen filtering, category filtering, review dates and mobile layout.

### Unchanged boundaries

- No Worker or Notion Sync behavior changes.
- No automatic Content Pack installation or removal.
- No LocalStorage reset or schema replacement.
- No cross-device account or cloud-progress feature.

## English Radar v1.0

English Radar v1.0 is the first public release.

### Included

- 60 Core Signals and 120 Core Context Quizzes.
- 140 bundled Cyrilla Notion Archive Signals.
- Learning Sessions, Review, Dictionary, Inbox, Context Quiz and My Radar.
- Local backup import and export.
- Content Pack validation, preview, import, export and removal.
- Manual Notion Continuous Content Pipeline through a Cloudflare Worker.

### Privacy

- Learning progress and imported vocabulary remain in the current browser's LocalStorage.
- Admin tokens and private Notion configuration are not stored in the public repository or exported backups.
