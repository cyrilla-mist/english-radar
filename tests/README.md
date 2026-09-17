# English Radar Test Suite

This directory contains regression tests from both the standalone English Radar product line and the later Sideglance Radar foundation work.

Version numbers in filenames describe when a contract was introduced. They do **not** mean the test is obsolete.

## Test Groups

### Standalone learning system

Tests around the learning engine, quiz engine, interface learning, content packs, archive behavior, storage, performance, and maintenance hygiene protect the current `v1.8.3` standalone maintenance release.

Older `v1.x` names remain useful where later releases still depend on the same behavior.

### Radar foundation

Files prefixed with `v0.1-` and related Radar names cover the early Sideglance Radar product surface, including Radar Home, review behavior, Archive integration, personal Radar behavior, and the Sideglance-branded shell.

These tests are part of the migration history between English Radar and the future Sideglance Radar surface. Do not delete them solely because the version prefix looks older than `v1.8.3`.

### Fixtures

`fixtures/` contains controlled inputs used by tests. Treat these as test data rather than canonical learning content.

## Maintenance Rule

Before removing a historical-looking test:

1. identify which current source or migration asset it still exercises;
2. check [`../docs/BRANCH_CLEANUP_AUDIT_2026-09-17.md`](../docs/BRANCH_CLEANUP_AUDIT_2026-09-17.md) and [`../docs/SIDEGLANCE_RADAR_MIGRATION_ASSETS.md`](../docs/SIDEGLANCE_RADAR_MIGRATION_ASSETS.md) when Radar work is involved;
3. confirm a newer test truly supersedes the same contract;
4. run the full maintenance checks after the change.

The goal is to retire obsolete contracts, not to erase useful regression coverage just to make version numbers look newer.
