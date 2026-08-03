# Release Notes

## English Radar v1.1.0

Status: Release Candidate on `feat/v1.1-learning-engine`. PR #1 remains Draft and `main` has not been modified or merged.

### Learning Engine

- Added Daily Mix with five Signals selected from unseen, personal-interest, weak or due, and older learned items.
- Added Unseen Discovery mode.
- Added Category Focus for Internet, Builder, Product Design, Fandom and Sports.
- Added a Daily Mix preview to Today.
- Added a Library Status dashboard showing total installed, unseen, learning, clear, due and quiz-ready Signals.
- Added Dictionary pagination with a 50-item initial render and Load more behavior.
- Added Installed Packs expand/collapse management.
- Added a shared Today snapshot for Signals, Progress, Daily Mix and statistics.
- Added the Dynamic Quiz Engine for Meaning Recognition, Context Choice and Usage Boundary.

### Review scheduling

- New: review again after 1 day.
- Fuzzy: 2, 3, 7 and then 14 days.
- Clear: 7, 14, 30 and then 60 days.
- Existing progress records remain compatible; future reviews use the expanded schedule when a Signal is rated again.

### Validation

- Added `tests/learning-engine-v1.1.test.js`.
- Added pull-request checks for content validation, project structure, Learning Engine, Quiz Engine and performance structure.
- Validated the full-library mobile path with 796 Active Signals, one customSignals read, one Active Signals read, one Progress read, 3.4ms Daily Mix calculation and 55.1ms first usable content.
- The feature remains isolated on `feat/v1.1-learning-engine` and Draft PR #1.
- Merge remains subject to final browser regression review for Daily Mix composition, unseen filtering, category filtering, review dates and mobile layout.

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
