# Notion Sync Setup

1. Create a Notion database using the fields in `NOTION_SYNC_SCHEMA.md`.
2. For the current personal deployment, use the existing Notion Personal Access Token named `English Radar Sync`. It accesses content as the token owner; do not add the database to a page's Connections menu and do not create a new connection.
3. Copy the database's Data Source ID into the Worker secret `NOTION_DATA_SOURCE_ID`.
4. Create a Worker from `worker/src/index.js` and configure `worker/wrangler.toml.example` locally.
5. Set secrets:

   ```text
   wrangler secret put NOTION_TOKEN
   wrangler secret put NOTION_DATA_SOURCE_ID
   wrangler secret put SYNC_ADMIN_TOKEN
   ```

6. Set `ALLOWED_ORIGINS` to the exact GitHub Pages origin, without a wildcard.
7. Deploy the Worker and test `GET /api/health`.
8. Open My Radar, enable Notion Sync, enter the Worker URL and the local Admin token, then save settings.
9. Use Test connection before the first Sync approved signals action.
10. Review the preview and explicitly confirm local import. The website then attempts the limited Approved → Imported write-back.

## Troubleshooting

- **Worker URL missing**: enter the deployed Worker origin, not a Notion URL.
- **401**: the Worker did not receive an Admin token for the write-back endpoint.
- **403**: check the local Admin token or `ALLOWED_ORIGINS`.
- **502 / Notion unavailable**: confirm the Notion token, Data Source ID and integration sharing.
- **Invalid response**: check that the Worker returned JSON and that the deployed version matches the repository.

Sync is manual and preview-first. The page never requests the Worker on load and the Worker never exposes the Notion token.

## Alternative team authentication

An Internal Connection can be used for a team-owned bot instead of the current Personal Access Token. In that mode, the relevant Notion page or database must be explicitly shared with the connection. This is not required for the current English Radar deployment.
