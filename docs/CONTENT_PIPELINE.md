# English Radar Content Pipeline

## Sources

- **Core**: the checked-in `data/signals.js` archive. These IDs and the 120 Core Quiz records are release content and are not overwritten by imports.
- **Imported**: Signals stored in `englishRadar_customSignals`. They participate in Today, Learn, Review and Dictionary, but they do not become Quiz questions automatically.
- **Personal**: decoded Inbox entries. They remain personal archive material and are available through Dictionary and Personal Lookup.

## Content Pack format

```json
{
  "app": "English Radar Content Pack",
  "schemaVersion": 1,
  "pack": { "id": "my-pack", "name": "My Pack", "description": "..." },
  "signals": [
    {
      "id": "optional-stable-id",
      "term": "lowkey",
      "category": "Internet Culture",
      "meaningEn": "...",
      "meaningZh": "...",
      "exampleEn": "...",
      "exampleZh": "...",
      "quizStatus": "none",
      "contentStatus": "active"
    }
  ]
}
```

Required Signal fields are `term`, `category`, `meaningZh` and `exampleEn`. Missing IDs receive a deterministic imported ID based on category and term. Unknown fields are preserved when the Signal is normalized and stored.

Validate a pack before importing:

```text
node scripts/validate-content-pack.js path/to/pack.json
```

## Import behavior

My Radar > Content Library checks JSON structure, a 5MB file limit, required fields, status values and duplicate IDs. The browser shows a preview before writing. Exact duplicates (same ID or normalized term/category) are skipped. Same-term Signals in another category are shown as possible duplicates and may be imported after review. Only valid active Signals are used for learning; archived Signals remain stored but inactive.

Removing an installed pack removes only its imported Signal records. Progress, favorites, review history and Quiz history are retained.

## Quiz boundary

The Quiz bank remains Core-only and is validated as 60 Signals × 2 questions. Imported Signals can be learned and reviewed without a Quiz. Session Summary only links to Context Check when the session contains Quiz-backed Signal IDs.

## Future publishing workflow

Notion or CSV can be used as an authoring source. File-based exports remain portable: review a Content Pack, run the validator, and import it on another local copy.

Phase 9 adds an optional manual Notion pipeline: Candidate → Approved → Worker preview → local Imported Pack → Notion status write-back. The Worker is the only Notion API client. Page-load sync, scheduled sync, automatic approval and learning-progress write-back remain disabled.
