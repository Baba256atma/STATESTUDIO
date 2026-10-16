# Hosted Nexora operator runbook

This runbook is for the single-instance Public Hosted MVP. It does not create a cloud account, a domain, or a provider key.

## Deploy

1. Confirm `NEXORA_DEPLOYMENT_MODE=hosted`.
2. Set the server-only values listed in `LAUNCH-CHECKLIST.md`. Do not put them in Git or in any `NEXT_PUBLIC_` variable.
3. Build the web app with `npm run build` in `frontend`.
4. Start the web app with `npm run start`.
5. Start the FastAPI runtime on a private network address that only the web app can reach.
6. Confirm `GET /api/health` returns `{"ok":true,"database":"ready"}`.

The production web process refuses to start when the required production configuration is missing. It does not fall back to the development directory database or the development sign-in.

## Verify

1. Open the canonical HTTPS origin.
2. Confirm an anonymous visitor can open Manufacturing Demo and Project Demo.
3. Sign in with GitHub. Confirm the development sign-in is absent.
4. Create a workspace, upload a small CSV, accept it, save a Decision, an Execution, and a Scene, then reload.
5. Confirm `GET /api/health` stays minimal: no host, password, or connection string.

## Rollback

1. Deploy the previous web build.
2. Leave the production database in place.
3. Schema changes in this phase use `CREATE TABLE IF NOT EXISTS` and do not delete customer rows.
4. This is not a zero-downtime deployment.

## Rotate secrets

Set the new value in the host's secret store, restart the process that reads it, then revoke the old value.

- GitHub OAuth client secret: GitHub OAuth app settings, then `GITHUB_SECRET`.
- NextAuth secret: `NEXTAUTH_SECRET`. Existing sessions end.
- LLM gateway secret: `NEXORA_LLM_GATEWAY_SECRET` on both the web app and the private FastAPI runtime, changed together.
- Provider API key: provider dashboard, then `OPENAI_API_KEY` on the private runtime only.
- Database credential: managed database user rotation, then `DATABASE_URL` on the web app.

## Database backup

Use the managed Postgres backup for the production database. Keep the documented retention window. Deleting a workspace or account removes the active rows. It does not erase backup copies until that retention expires.

## Database restore

Restore into a new database. Point a recovery instance at that database. Do not restore over the live customer database to test a backup. Compare Workspace, Observation, Decision, Execution, and Saved Scene rows with the snapshot.

## Health

`GET /api/health` on the web app. `ok: false` with `database: unavailable` means customer data is not being served from a fallback. The FastAPI `/health` route stays on the private network.

## Logs

Read status, latency, and error category. Do not copy CSV text, manager messages, prompts, answers, cookies, or secret values out of a log viewer.

## Disable the provider

Set `NEXORA_LLM_ENABLED=false` on the private runtime and restart it. The web app and customer data remain available. LLM requests fail closed.
