# English Radar

**Real internet English, learned through context.**

English Radar is a **local-first learning system for real internet English**. Instead of treating expressions as isolated vocabulary, it organizes them around meaning, context, tone, usage boundaries, pronunciation, and personal mastery.

- **Current release:** `v1.8.3`
- **Standalone status:** maintenance
- **Long-term role:** learning-system foundation for the future Sideglance **Radar** surface

[Live site](https://cyrilla-mist.github.io/english-radar/) · [Documentation](docs/README.md) · [Release notes](docs/RELEASE_NOTES.md)

## What It Does

English Radar is built around **Signals**: expressions, abbreviations, interface language, community phrasing, and other pieces of English that are easier to understand when their social and practical context is visible.

The product combines:

- contextual meanings and examples;
- tone and usage boundaries;
- pronunciation support;
- personal mastery states;
- spaced review;
- quizzes and mistake practice;
- unfamiliar-expression capture;
- optional content packs;
- local backup and restore;
- optional Notion-backed content workflows.

## Core Learning Loop

```text
Discover a Signal
  → understand meaning + context + tone
  → practice recognition and usage boundaries
  → mark personal mastery
  → review when due
  → preserve or expand the personal library
```

The goal is not to maximize a vocabulary count. It is to build faster **context recognition** for the language people actually encounter in interfaces, communities, social media, fandom, product work, and everyday online communication.

## Main Features

### Daily Learning

- Daily Mix assembled from unseen, weak, due, interest-based, and older learned Signals
- Quick Scan, Standard, Deep Dive, and Custom session modes
- unfinished-session recovery
- mastery-aware review intervals

### Signal Library

- searchable dictionary
- favorites and source filters
- context, tone, pronunciation, and usage-boundary fields
- support for abbreviations, acronyms, and initialisms with Full Form metadata
- Personal Signals for user-added expressions

### Practice

- Meaning Recognition
- Context Choice
- Usage Boundary quizzes
- mistake practice
- quiz history
- interface-vocabulary checks

### Content System

- built-in Core Signals
- optional audited Content Packs
- import / export validation
- bundled local archive support
- preview-first Notion content sync through a Cloudflare Worker

## Local-First Data Model

Learning data stays in the current browser unless the user explicitly exports or syncs supported content.

Local data includes items such as:

- mastery state;
- review timing;
- Imported Signals;
- Personal Signals;
- Quiz History;
- installed Content Packs;
- local preferences.

The public frontend does not call Notion directly. Optional Notion sync goes through a Cloudflare Worker, and private credentials are not stored in the repository.

See [Notion Sync Setup](docs/NOTION_SYNC_SETUP.md) and the [Notion migration report](docs/NOTION_MIGRATION_REPORT.md) for implementation details.

## Relationship to Sideglance

English Radar remains a separate, independently usable product today.

The long-term Sideglance direction is:

```text
Sideglance
├── Decode   Understand this moment.
├── Radar    Build context instinct over time.
└── Archive  Preserve and revisit context knowledge.
```

English Radar is the main existing learning-system foundation for the future **Radar** surface.

This relationship is a product direction, not a claim that the codebases, user data, or learning flows have already been integrated.

Migration should preserve working learning behavior and data meaning rather than mechanically copy pages into Sideglance. Key reusable assets include the Signal model, Daily Mix and review logic, mastery states, quizzes, Personal Signals, content-pack validation, and local backup compatibility.

See [Sideglance Radar migration assets](docs/SIDEGLANCE_RADAR_MIGRATION_ASSETS.md) for the current migration inventory.

## Technology

- Native HTML, CSS, and JavaScript
- Web Speech API
- Cloudflare Worker for optional Notion sync
- LocalStorage-based learning state
- Node-based validation and test scripts
- GitHub Pages

The main frontend intentionally has no framework dependency.

## Local Run

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

## Checks

```bash
node scripts/validate-data.js
node scripts/check-project.js
node scripts/validate-content-pack.js path/to/pack.json
node tests/learning-engine-v1.1.test.js
node tests/quiz-engine-v1.1.test.js
node tests/performance-v1.1.test.js
```

## Repository Structure

```text
english-radar/
├── index.html, learn.html, dictionary.html, inbox.html, quiz.html, me.html
├── archive.html, archive-signal.html
├── assets/
├── css/
├── js/
├── data/
├── docs/
├── scripts/
├── tests/
└── worker/
```

`diagnostics.html` is a development-only storage metadata page and is not part of normal user navigation.

## Documentation

Start with [`docs/README.md`](docs/README.md). Release history is maintained in [`docs/RELEASE_NOTES.md`](docs/RELEASE_NOTES.md) rather than duplicated in this README.

## Status

English Radar `v1.8.3` is a maintenance release of the standalone product line. New standalone feature expansion is not the current priority; future work should focus on preserving and migrating the strongest learning-system assets into the broader Sideglance direction when that integration is intentionally resumed.
