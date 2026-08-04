# English Radar v1.1.1

English Radar is a local-first learning tool for real internet English. It organizes expressions around meaning, context, tone, usage boundaries, pronunciation and personal mastery rather than a traditional word list.

## Release status

English Radar v1.1.1 is a stability and bilingual UX patch on `fix/v1.1.1-bilingual-ux-sync`. PR #1 remains Draft and `main` has not been modified or merged.

The release includes 60 Core Signals, 120 Core Context Quizzes, 140 Bundled Cyrilla Notion Archive Signals and a manual Notion Continuous Content Pipeline. Additional imported Content Packs remain local to each browser.

## v1.1.1 Learning Engine

- Daily Mix: five Signals selected from unseen, personal-interest, weak or due, and older learned items
- Unseen Discovery mode
- Category Focus for Internet, Builder, Product Design, Fandom and Sports
- Library Status dashboard with installed, unseen, learning, clear, due and quiz-ready counts
- Daily Mix preview on Today
- Expanded spaced-review intervals:
  - New: 1 day
  - Fuzzy: 2 → 3 → 7 → 14 days
  - Clear: 7 → 14 → 30 → 60 days
- Automated Node tests and pull-request validation workflow
- Dynamic Meaning Recognition, Context Choice and Usage Boundary quizzes
- Dictionary pagination with 50-item initial rendering
- Installed Packs management and local Content Pack import/export
- Shared Today snapshot for Signals, Progress, Daily Mix and statistics
- Full-library mobile performance path validated with 796 Active Signals

## Existing features

- Daily learning Sessions with Quick Scan, Standard, Deep Dive and Custom modes
- Signal detail pages with context, tone, usage boundaries and Web Speech API pronunciation
- Mastery states, Review queue and unfinished Session recovery
- Dictionary search, favorites and source filters
- Radar Inbox for unfamiliar expressions and Personal Signals
- Context Quiz, mistake practice and Quiz History
- My Radar profile, preferences and local backup Import / Export
- Content Pack validation, preview, import, export and bundled archive installation
- Notion Continuous Content Pipeline through a Cloudflare Worker
- Preview-first manual sync; the Worker keeps Notion credentials server-side

## Data model and privacy

The app is local-first. Learning records, Imported Signals, Quiz History and Notion Sync settings remain in the current browser's LocalStorage. Backups intentionally exclude the Admin token, and no LocalStorage data is committed to this repository.

The public frontend never calls Notion directly. Notion Sync is manual and requires the user to enter their own local Admin token on My Radar. Tokens and private Notion configuration are not stored in this repository.

The bundled Cyrilla Notion Archive was migrated from the user's existing Notion vocabulary records. See [the migration report](docs/NOTION_MIGRATION_REPORT.md).

## Live release

- Live site: <https://cyrilla-mist.github.io/english-radar/>
- Repository: <https://github.com/cyrilla-mist/english-radar>
- Worker: <https://english-radar-notion-sync.cyyuhiseeu.workers.dev>

## Technology

- Native HTML, CSS and JavaScript
- Web Speech API
- Cloudflare Worker for the optional Notion sync boundary
- No frontend framework and no main-project npm dependency

## Local run

No frontend dependencies are required. From the project directory, run:

```text
python -m http.server 8000
```

Then open <http://localhost:8000/>. The HTML pages also work when opened directly, but a local server is recommended for consistent browser behavior.

## Checks

```text
node scripts/validate-data.js
node scripts/check-project.js
node scripts/validate-content-pack.js path/to/pack.json
node tests/learning-engine-v1.1.test.js
node tests/quiz-engine-v1.1.test.js
node tests/performance-v1.1.test.js
```

## Directory structure

```text
english-radar/
├── index.html, learn.html, dictionary.html, inbox.html, quiz.html, me.html, 404.html
├── assets/
├── css/
├── js/
├── data/
├── docs/
├── scripts/
├── tests/
└── worker/
```
