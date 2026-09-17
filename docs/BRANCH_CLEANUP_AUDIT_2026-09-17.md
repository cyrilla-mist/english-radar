# English Radar Branch Cleanup Audit — 2026-09-17

This audit classifies every non-`main` branch currently present in the repository.

English Radar accumulated release branches during v1.x development and later became the working foundation for Sideglance Radar migration. Those two kinds of branches must not be treated the same way.

## Safety Rule

A branch is a **verified safe cleanup candidate** only when comparison against current `main` reports:

```text
ahead_by = 0
```

This means the branch contains no commits that are unique relative to `main`.

A branch with `ahead_by > 0` is **not safe for routine deletion**. Some historical branches may only appear unique because earlier work was squash-merged or rebased, but commit ancestry alone is not enough to prove that nothing worth preserving remains. Such branches should be kept until their content has been intentionally reviewed.

## Verified Safe Cleanup Candidates

The following branches were compared directly with `main` and contain **0 unique commits**:

| Branch | Result |
| --- | --- |
| `chore/v1.8.1-release-hygiene` | `ahead_by=0` |
| `feat/v1.5-interface-structure-overlays` | `ahead_by=0` |
| `feat/v1.6-community-discourse` | `ahead_by=0` |
| `feat/v1.7-product-naming` | `ahead_by=0` |
| `feat/v1.8-archive-mode` | `ahead_by=0` |
| `fix/v1.5-pack03-remove-state` | `ahead_by=0` |
| `fix/v1.8-mobile-ux-polish` | `ahead_by=0` |
| `fix/v1.8.1-abbreviation-full-form` | `ahead_by=0` |
| `fix/v1.8.2-learn-title-readability` | `ahead_by=0` |
| `fix/v1.8.3-mobile-me-audio-ux` | `ahead_by=0` |
| `feat/sideglance-radar-v0.1` | `ahead_by=0` |
| `feat/sideglance-radar-v0.1-radar-home` | `ahead_by=0` |

These can be removed manually after a final GitHub UI sanity check.

## Preserve / Review — Unique Commits Remain

### Historical v1.x branches

| Branch | Unique commits vs `main` | Action |
| --- | ---: | --- |
| `feat/v1.1-learning-engine` | 34 | Preserve pending historical-content review |
| `fix/v1.1.1-bilingual-ux-sync` | 5 | Preserve pending review |
| `feat/v1.2-interface-learning` | 8 | Preserve pending review |
| `fix/v1.2.1-release-hygiene` | 4 | Preserve pending review |
| `feat/v1.3-content-pack-foundation` | 3 | Preserve pending review |
| `feat/v1.4-ai-foundations` | 2 | Preserve pending review |

These are old release branches, but their commit graphs diverge from current `main`. Do not delete them only because the product has moved beyond those versions.

### Sideglance Radar migration branches

| Branch | Unique commits vs `main` | Action |
| --- | ---: | --- |
| `feat/sideglance-radar-v0.1-daily-mix-context-cues` | 10 | Preserve — migration assets remain |
| `feat/sideglance-radar-v0.2-signal-v2-foundation` | 3 | Preserve — Signal v2 / Context Collections foundation |
| `feat/sideglance-radar-v0.2-context-content-expansion` | 2 | Preserve — context knowledge expansion |
| `feat/sideglance-radar-v0.2-daily-radar-selection` | 2 | Preserve — Daily Radar selection logic |
| `feat/sideglance-radar-v0.2-radar-home-experience` | 1 | Preserve — Radar home experience work |
| `feat/sideglance-radar-v0.2-phase3a1-high-context-signals` | 2 | Preserve — high-context Signal assets |
| `feat/sideglance-radar-v0.2-phase3a2-pragmatics` | 3 | Preserve — active/open Phase 3A.2 work |

The Sideglance Radar branches are especially important because English Radar is the learning-system foundation for the future Sideglance Radar surface. Their unique content should be migrated intentionally rather than cleaned up as generic branch history.

See [`SIDEGLANCE_RADAR_MIGRATION_ASSETS.md`](SIDEGLANCE_RADAR_MIGRATION_ASSETS.md) for the product-level migration context.

## Current Branch Inventory Result

At audit time:

```text
main
+ 12 verified safe cleanup candidates
+ 13 branches requiring preservation or review
= 26 total branches
```

Every non-`main` branch present at the time of this audit has been classified.

## Recommended Cleanup Order

1. Delete the 12 verified `ahead_by=0` branches through GitHub UI.
2. Keep all Sideglance Radar branches with unique commits until their assets have an explicit destination.
3. Review v1.1–v1.4 historical branches separately; squash/rebase history means `ahead_by > 0` does not automatically imply the functionality is absent from `main`.
4. Do not mix Radar migration cleanup with old release-branch cleanup.
5. After any major Radar migration, re-run branch comparisons and update this document.

## Future Branch Hygiene

For completed work, prefer one of these end states:

```text
merged into main
or
captured in docs / data assets
or
explicitly preserved as migration work
```

Long-lived branches should not become an undocumented archive.

For ordinary short-lived PR branches, consider enabling GitHub's **Automatically delete head branches** setting after merged pull requests. Keep long-lived migration branches only when their role is explicit.
