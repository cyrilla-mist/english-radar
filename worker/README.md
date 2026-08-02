# English Radar Notion Sync Worker

This Worker is the only component allowed to call the Notion API. The public English Radar site calls this Worker only after the user explicitly starts a connection test or sync.

## Configuration

Copy `wrangler.toml.example` to a local Wrangler configuration, set `ALLOWED_ORIGINS` to the deployed site origin, and configure secrets:

```text
wrangler secret put NOTION_TOKEN
wrangler secret put NOTION_DATA_SOURCE_ID
wrangler secret put SYNC_ADMIN_TOKEN
```

Do not place real tokens in this repository, frontend JavaScript, Wrangler vars, README files, or logs. `NOTION_DATA_SOURCE_ID` is treated as a secret because it identifies the configured source.

## Authentication modes

The current English Radar deployment uses a Notion **Personal Access Token** named `English Radar Sync`. It is used as the Worker secret `NOTION_TOKEN` and accesses Notion with the token owner's permissions. A Personal Access Token does not require adding a database to a page's Connections menu and does not require creating an Internal Connection.

An **Internal Connection** is an alternative for team-owned bots. It requires explicitly sharing the relevant page or database with that connection. Do not perform that step for the current Personal Access Token deployment.

The Worker queries only the configured data source and only returns records whose Status is Approved for the normal Signals endpoint.

## Endpoints

- `GET /api/health` returns a local configuration-independent health response.
- `GET /api/signals?status=Approved&limit=100&cursor=...&since=...` reads Approved records and returns normalized Signals without raw Notion page objects.
- `POST /api/imported` requires `Authorization: Bearer <SYNC_ADMIN_TOKEN>` and accepts at most 100 `{ notionPageId, signalId }` records. It only changes Approved records to Imported and writes Imported At, Import Batch and Signal ID where those properties exist.

## Deploy

From this directory, use a locally installed Wrangler or the Cloudflare dashboard. The main project intentionally has no npm dependency and does not install Worker dependencies.
