# Sideglance Radar Migration Assets

**Status:** Branch inventory created during repository cleanup on 2026-09-17.

This document records Sideglance Radar work that still exists outside `main` in the English Radar repository. It exists to prevent useful migration assets from being mistaken for stale branches during cleanup.

> Do **not** delete the branches in the “Preserve” section merely because English Radar is now in maintenance mode. Several contain commits and files that are not present on `main`.

## Why this exists

English Radar is now the learning-system foundation for the future Sideglance **Radar** surface. During the Sideglance Radar exploration, work was split across multiple branches rather than consolidated into one migration branch.

A cleanup comparison against the current `main` showed that some older branches are fully absorbed, while several Radar branches remain diverged and contain unique implementation or content work.

## Preserve — unmerged migration assets

### `feat/sideglance-radar-v0.1-daily-mix-context-cues`

**Comparison with current `main`:** diverged — 10 unique commits at audit time.

This is a broad v0.1-era migration asset rather than a disposable feature branch. The unique diff includes work around:

- Radar Home behavior;
- Daily Mix context cues;
- Signal Entry UI / logic;
- Radar Review;
- Personal Radar;
- Archive and Archive Signal polish;
- related mobile / page integration changes;
- v0.1 validation and gate tests.

Notable unique / changed files include:

```text
signal-entry.html
js/signal-entry.js
css/signal-entry.css
js/radar-home.js
css/radar-home.css
js/session.js
js/archive.js
css/archive.css
js/me.js
css/me.css
css/review.css
archive.html
archive-signal.html
learn.html
me.html
quiz.html
```

plus multiple `tests/v0.1-*` files.

### `feat/sideglance-radar-v0.2-signal-v2-foundation`

**Comparison with current `main`:** diverged — 3 unique commits at audit time.

Core data-model asset for a richer Sideglance Radar Signal layer.

Unique work includes:

```text
data/signal-v2.js
data/context-collections.js
js/signal-resolver.js
tests/v0.2-signal-v2-foundation.test.js
```

This branch should be treated as a schema / resolver reference when defining the shared object model between Sideglance Decode and Radar.

### `feat/sideglance-radar-v0.2-context-content-expansion`

**Comparison with current `main`:** diverged — 2 unique commits at audit time.

Content and context expansion work touching:

```text
data/signal-v2.js
data/context-collections.js
data/signals.js
data/quizzes.js
scripts/validate-data.js
scripts/check-project.js
tests/v0.2-phase2a-context-content.test.js
```

It also modifies existing release-validation tests to account for the expanded content model.

### `feat/sideglance-radar-v0.2-daily-radar-selection`

**Comparison with current `main`:** diverged — 2 unique commits at audit time.

Selection-engine work centered on:

```text
js/learning-engine.js
tests/v0.2-phase2b1-daily-radar-selection.test.js
```

with small page/test integration changes.

This is a behavioral asset for deciding what Radar should surface each day; it should not be conflated with the content model itself.

### `feat/sideglance-radar-v0.2-radar-home-experience`

**Comparison with current `main`:** diverged — 1 unique commit at audit time.

Radar Home experience work centered on:

```text
js/radar-home.js
css/radar-home.css
index.html
tests/v0.2-phase2b2-radar-home-experience.test.js
```

Treat this as an interaction / presentation reference when Sideglance receives an integrated Radar surface.

### `feat/sideglance-radar-v0.2-phase3a1-high-context-signals`

**Comparison with current `main`:** diverged — 2 unique commits at audit time.

High-context Signal content work touching:

```text
data/signal-v2.js
data/context-collections.js
data/signals.js
data/quizzes.js
tests/v0.2-phase3a1-high-context-signals.test.js
```

This branch is especially relevant to the content-asset side of the future Radar product.

## Important branch relationship note

The v0.2 branches above are **not one simple linear stack**. At least the Signal v2 foundation and context/content expansion branches were verified to be mutually diverged at audit time.

Therefore, future migration should **not** assume that choosing the branch with the newest-sounding name automatically includes all earlier work.

Recommended migration approach:

1. define the Sideglance shared Decode / Radar context object first;
2. inspect each preserved branch by capability;
3. port or cherry-pick the needed behavior/content intentionally;
4. run English Radar regression checks after each extraction;
5. only delete the preserved source branches after their useful assets are present in a canonical destination.

## Safe historical cleanup candidates

The following branches were explicitly compared with the current `main` and had **0 unique commits** at audit time:

- `fix/v1.8.3-mobile-me-audio-ux`
- `feat/sideglance-radar-v0.1`
- `feat/sideglance-radar-v0.1-radar-home`

The `fix/v1.8.3-mobile-me-audio-ux` branch was 19 commits behind `main` with no unique commits. The two v0.1 branches above were also fully contained in `main`.

Older release branches should still be verified before deletion when possible, but the final v1.8.3 release branch being fully contained strongly indicates that the normal v1.x release chain is historical rather than active migration work.

## Maintenance rule

Until Sideglance Radar migration begins, treat branch categories as follows:

```text
v1.x release / fix branches
  → historical cleanup candidates

sideglance-radar branches with unique commits
  → migration assets; preserve

main
  → current standalone English Radar maintenance line
```

This separation lets the repository become cleaner without accidentally deleting the work that matters for Sideglance Radar.
