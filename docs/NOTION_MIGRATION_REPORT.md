# English Radar Notion Migration Report

## Migration result

- Pack: `Cyrilla Notion Archive v1`
- Generated: `2026-08-02T16:09:15Z`
- Import-ready Signals: **140**
- Quiz status: all Imported Signals use `quizStatus: "none"`
- Core library remains unchanged: **60 Signals / 120 Quizzes**

## Source scope

The migration used the existing English Radar Notion vocabulary structure:

1. Internet Slang｜网络文化
2. AI Builder & Developer｜创造者英语
3. AI Builder English：GitHub & Open Source Community
4. Fandom & Pop Culture｜饭圈与流行文化
5. Gaming Community｜游戏社区
6. Sports Community English｜运动社区

The Notion pages contained approximately **221 source rows/occurrences** before normalization. Repeated additions and duplicated summary rows were consolidated into approximately **186 distinct term/category candidates**. After Core coverage and near-duplicate consolidation, **140 Imported Signals** remain in this pack.

## Imported category counts

- Fandom & Pop Culture: **53**
- Internet Culture: **36**
- AI Builder & Developer: **25**
- Gaming Community: **13**
- Sports Community: **13**

## Core-covered or near-Core entries not re-imported

These expressions were already represented by the 60 Core Signals, or were a direct phrase-level duplicate of an existing Core meaning:

- lowkey
- cooked
- no cap
- fr / frfr
- based
- locked in
- touch grass
- IYKYK
- NGL
- TBH
- TL;DR
- rent free
- we are so back
- I'm cooked
- ship
- MVP
- prototype
- PoC
- PMF
- commit
- branch
- PR
- issue
- fork
- merge
- open source
- LGTM
- agent
- workflow
- tool calling
- RAG
- context window
- memory
- breaking change
- bias
- ult
- solo stan
- comeback
- ate
- ratio
- clutch

## Consolidated duplicates and sense decisions

- skill issue — retained once under Gaming Community
- underrated — retained once under Internet Culture
- overrated — retained once under Internet Culture
- OT — consolidated into the more concrete OT9 entry
- ship / blocker / workaround / edge case / flaky / regression / nit — repeated summary rows consolidated

Two different `OP` entries were intentionally retained because the meanings are genuinely different:

- Internet Culture: **Original Poster**
- Gaming Community: **Overpowered**

## Field policy

### Preserved from Notion

- Term/expression
- IPA where present
- Chinese core meaning
- Source context or community
- English example sentence
- Source page and section

### Normalized migration drafts

- `meaningEn`
- `exampleZh` (currently a concise context hint rather than a literal sentence translation)
- `platforms`
- `tone`
- `formality`
- `useWhen`
- `avoidWhen`
- `chineseFeeling`
- Stable imported IDs

Every signal includes a `draftFields` array so these normalized fields are distinguishable from source-preserved fields.

## Import behavior

After importing through **My Radar → Content Library → Import content pack**:

- Imported Signals enter Dictionary, Daily Session, Lookup, mastery tracking, My Radar and Review.
- They do not require changes to `data/signals.js`.
- They do not enter Context Quiz because `quizStatus` is `none`.
- The website should show duplicate warnings for any term already present in the current browser's Core, Imported or Personal libraries.

## Validation performed

- `app` and `schemaVersion` are present and correct.
- 140 Signals are included.
- All IDs are stable and unique.
- All `term + category` pairs are unique.
- Required fields are non-empty.
- `contentStatus` and `quizStatus` use allowed values.
- JSON parses successfully.

## Recommended import check

1. Export a full English Radar backup first.
2. Select this Content Pack in My Radar.
3. Review the preview totals and duplicate warnings.
4. Import valid Signals.
5. Confirm Dictionary source counts: Core 60, Imported up to 140, plus existing Personal Signals.
6. Test one Imported Signal in Daily Session and one in Review.
7. Confirm Imported Signals without Quiz do not show a broken Practice entry.
