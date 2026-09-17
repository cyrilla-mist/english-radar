# English Radar Documentation

This directory contains product-release notes, content-system documentation, Notion sync documentation, QA / release checklists, migration assets, branch-maintenance records, and historical implementation reports for English Radar.

## Project Status

English Radar `v1.8.3` is the current maintenance release.

`v1.8.0` remains the final feature release of the original standalone English Radar product line. Later `v1.8.x` releases are maintenance and compatibility improvements rather than a new expansion phase.

English Radar is also the main **learning-system foundation** for the future Sideglance **Radar** surface. This does not mean the two repositories have already been merged. The current English Radar app remains independently usable and its local-first data model should be preserved during any future migration.

See the Sideglance direction document:

[`cyrilla-mist/sideglance — docs/product-direction.md`](https://github.com/cyrilla-mist/sideglance/blob/master/docs/product-direction.md)

## Release Channels

GitHub release chronology and product version chronology are not the same thing in this repository.

- `English Radar v1.8.3` is the current standalone maintenance release.
- `Sideglance Radar v0.1.0 — Context Learning Loop` was published later as a **historical migration / product-direction preview** from work hosted in this repository.
- The Sideglance Radar `v0.1.0` release does **not** supersede English Radar `v1.8.3`, does not mean the repositories have been physically merged, and should not be used as the current English Radar version.

Until Radar migration has a canonical destination, treat the `v0.x` Sideglance Radar tag/release as preserved migration history and the `v1.x` line as the standalone English Radar release line.

## Start Here

1. [`../README.md`](../README.md) — current release overview and feature inventory.
2. [`BRANCH_CLEANUP_AUDIT_2026-09-17.md`](BRANCH_CLEANUP_AUDIT_2026-09-17.md) — complete classification of every non-`main` branch; use this before routine branch deletion.
3. [`SIDEGLANCE_RADAR_MIGRATION_ASSETS.md`](SIDEGLANCE_RADAR_MIGRATION_ASSETS.md) — product-level inventory of unmerged Sideglance Radar assets; use this before migration work.
4. [`RELEASE_NOTES.md`](RELEASE_NOTES.md) — release history.
5. [`CONTENT_GUIDE.md`](CONTENT_GUIDE.md) — Signal/content authoring guidance.
6. [`CONTENT_PIPELINE.md`](CONTENT_PIPELINE.md) — content ingestion and maintenance workflow.
7. [`QA_CHECKLIST.md`](QA_CHECKLIST.md) — quality checks for the standalone app.

## Documentation Classes

### Branch Cleanup Audit

`BRANCH_CLEANUP_AUDIT_2026-09-17.md` records the current branch inventory using a conservative cleanup rule:

```text
ahead_by = 0
  → verified safe cleanup candidate

ahead_by > 0
  → preserve until intentionally reviewed
```

The audit covers both historical release branches and Sideglance Radar migration branches. It is the operational reference for branch deletion.

### Sideglance Radar Migration Assets

`SIDEGLANCE_RADAR_MIGRATION_ASSETS.md` explains what the Sideglance Radar branches contain and why their product assets matter.

Use it alongside the branch audit. Several v0.1 / v0.2 Radar branches still contain commits that are not present on `main` and must be preserved until their useful behavior and content are migrated into a canonical destination.

### Current Content System

- `CONTENT_GUIDE.md`
- `CONTENT_PIPELINE.md`
- `DAILY_RADAR_WORKFLOW.md`

These documents remain useful because the Signal model, learning content, review behavior, and content packs are likely to inform any future Sideglance Radar migration.

### Notion / Personal Archive Integration

- `NOTION_SYNC_SCHEMA.md`
- `NOTION_SYNC_SETUP.md`
- `NOTION_MIGRATION_REPORT.md`

These describe the existing optional Notion-backed personal content workflow. They should be treated as English Radar implementation documentation, not as a promise that Sideglance will use the same sync architecture.

### Release and QA History

- `RELEASE_NOTES.md`
- version-specific release notes
- `production-release-checklist.md`
- `QA_CHECKLIST.md`

Version-specific plans and release notes are historical records once their release is complete.

### Content Pack Import Reports

Files named `content-pack-*-import-report.md` record individual pack imports and validation results. They are provenance / migration records rather than current product specifications.

### Historical Product Plans

Documents such as `v1.2-interface-learning-plan.md` describe a past implementation phase. Keep them for design history, but prefer the current README and release notes when describing the present product.

## Development Utility

The repository root includes `diagnostics.html`, a **development-only storage diagnostics page**. It reports storage metadata and aggregate counts rather than learning content. It is not part of the normal user navigation or the long-term product identity.

## Future Migration Principle

If English Radar is migrated into Sideglance Radar, preserve product behavior and data meaning before reorganizing files or UI.

The assets most worth protecting are:

- Signal semantics and rich context fields;
- Daily Mix and review logic;
- mastery / due-state behavior;
- quiz contracts;
- personal Signals and inbox records;
- content-pack validation;
- local backup / import-export compatibility;
- existing personal archive data.

A future Sideglance integration should not silently break these assets merely to make the repositories look unified.
