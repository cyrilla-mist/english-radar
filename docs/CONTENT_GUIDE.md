# English Radar Content Guide

## Signal fields

Each base Signal uses `id`, `term`, `displayTerm`, `speechText`, `pronunciation`, `category`, `platforms`, `tone`, `status`, `formality`, `meaningEn`, `meaningZh`, `exampleEn`, `exampleZh`, `useWhen`, `avoidWhen`, and `chineseFeeling`.

Use stable lowercase-hyphen IDs. Keep English meanings to one or two clear sentences, write natural Chinese feeling notes, and use examples that make the community or work context visible. Set `speechText` explicitly for abbreviations such as RAG, PMF, PoC, fr, ngl, and tbh.

## Boundaries

Describe tone and usage boundaries rather than inventing origins, dates, popularity claims, or cultural history. Flag expressions that can sound teasing, dismissive, confrontational, or community-specific. Product, AI Builder, and GitHub terms should remain technical concepts, not be rewritten as internet slang.

## Quiz writing

Each Signal has two questions. Every question has exactly four unique options, one correct option, an explanation in English and Chinese, and a clear context. Distractors should be plausible without relying on outside facts. Prefer testing use, tone, boundaries, and concept context over isolated translation.

Run `node scripts/validate-data.js` after editing either data file.

## Imported Signals

Imported content uses the same normalized Signal fields, with `contentStatus` (`active` or `archived`), `quizStatus` (`none`, `draft`, or `ready`), `sourceType: "imported"`, and `sourcePackId`. Core IDs remain authoritative. Imported Signals without Quiz records are still available in learning and review queues; they are not included in Context Quiz validation.

Content Packs use `app: "English Radar Content Pack"` and `schemaVersion: 1`. Validate them with `node scripts/validate-content-pack.js path/to/pack.json`. Keep pack IDs and Signal IDs stable so exports can be compared and duplicates can be skipped safely.
