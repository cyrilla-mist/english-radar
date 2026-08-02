# Notion Sync Schema

Notion is the candidate-content management center. English Radar is the learning and review client. Candidate and Rejected records never enter the website; only Approved records are read by the Worker. Imported means a successful website sync, not a replacement for local learning progress.

## Recommended database properties

| Property | Notion type | Required | Notes |
| --- | --- | --- | --- |
| Expression | Title | Yes | The expression being reviewed |
| Signal ID | Rich text | No | Stable lowercase-hyphen ID; Worker generates one when absent |
| IPA | Rich text | No | Pronunciation |
| Category | Select | Yes | Internet Culture, AI Builder, Product Design, GitHub, GitHub / Development, Fandom, Gaming Community, Sports Community, Sports / Everyday |
| Platforms | Multi-select | No | Communities or platforms |
| Tone | Multi-select | No | Tone labels |
| Formality | Select | No | Formality boundary |
| Meaning EN | Rich text | No | Short English explanation |
| Meaning ZH | Rich text | Yes | Chinese feeling / meaning |
| Example EN | Rich text | Yes | Natural example |
| Example ZH | Rich text | No | Chinese interpretation |
| Use When | Rich text | No | Usage boundary |
| Avoid When | Rich text | No | Avoidance boundary |
| Chinese Feeling | Rich text | No | Non-literal Chinese feeling |
| Status | Status or Select | Yes | Candidate, Approved, Rejected, Imported |
| Source Type | Select | No | Daily Radar, Personal Capture, Community Observation, Official Documentation, Notion Archive, Editorial |
| Source | URL or Rich text | No | Source label or URL |
| Source Context | Rich text | No | Original sentence or discovery context |
| Confidence | Select | No | High, Medium, Experimental |
| Change Risk | Select | No | Stable, Evolving, Trend |
| Quiz Status | Select | No | None, Draft, Ready |
| Added At | Date | No | Initial record date |
| Approved At | Date | No | Editorial approval date |
| Imported At | Date | No | Worker write-back date |
| Import Batch | Rich text | No | Sync batch identifier |

The Worker maps these fields into the English Radar Signal shape. Missing IDs use `notion-{categorySlug}-{termSlug}`. IDs are deterministic, lowercase, and contain only letters, numbers and hyphens. A supplied ID is used only when it passes the same format validation; Core-like IDs are rejected by the Worker boundary.

The Worker never returns the raw Notion page object and never writes learning progress, mastery, review dates or Quiz history back to Notion.
