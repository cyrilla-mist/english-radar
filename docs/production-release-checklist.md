# English Radar Production Release Checklist

## Before merge

- Worktree clean
- Correct branch and expected base SHA
- Full automated test suite passes
- PR HEAD matches tested commit
- No Worker or Notion changes unless explicitly planned
- LocalStorage compatibility confirmed
- Version and cache identifiers consistent
- Release notes updated

## After merge

- main contains expected merge commit
- GitHub Actions on main succeeds
- GitHub Pages deployment succeeds
- Live HTML reports expected version
- CSS and JavaScript resources return HTTP 200
- No stale cached version appears in a fresh browser
- Worker Health Check succeeds
- CORS allows the GitHub Pages origin
- No Notion write is performed during smoke testing

## Browser smoke test

- Today
- Standard Learn
- UI Vocabulary Learn
- Review
- Dictionary
- Inbox
- Quick Check
- Interface Check
- My Radar
- UI Vocabulary Pack installation
- Pack removal and reinstallation
- Interface Learning Mode

## Mobile widths

- 360px
- 390px
- 430px

## Desktop widths

- 1024px
- 1366px

## Final record

- Release version
- Commit SHA
- Actions Run
- Deployment time
- Known limitations
