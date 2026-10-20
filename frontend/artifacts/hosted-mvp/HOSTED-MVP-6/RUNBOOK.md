# Hosted Nexora operator runbook

This runbook is for the single-instance Public Hosted MVP. It does not create a cloud account, a domain, or a provider key.

## Deploy

1. Confirm `NEXORA_DEPLOYMENT_MODE=hosted`.
2. Set the server-only values listed in `LAUNCH-CHECKLIST.md`. Do not put them in Git or in any `NEXT_PUBLIC_` variable.
3. Build the web app with `npm run build` in `frontend`.
4. Start the web app with `npm run start`.
5. Configure the Render Private FastAPI service with Root Directory `backend`, Python `3.12.11` from the repository-root `.python-version`, and Build Command `pip install -r requirements.txt`.
6. Start the FastAPI runtime on a private network address that only the web app can reach with `uvicorn main:app --host 0.0.0.0 --port $PORT`.
7. Confirm `GET /api/health` returns `{"ok":true,"database":"ready"}`.

The Web Service must set `NEXORA_PRIVATE_API_BASE` to the same-region Render private-service origin (for example, `http://<private-service-address>`). Hosted production rejects a missing or loopback value and never falls back to a browser-exposed API base.

### Private FastAPI production build

`backend/requirements.txt` is the production dependency authority. Do not replace it with a local `.venv`, `pip freeze`, or an unbounded install. Render must use the repository-owned `.python-version` value rather than its moving default Python version.

The first Render Private FastAPI deployment at commit `a9b1a32c` failed during Build because `backend/requirements.txt` did not exist. It did not reach application startup.

For a clean local build check, create a temporary Python 3.12 virtual environment outside the repository, run `pip install -r requirements.txt` from `backend`, then verify `python -c "import main; assert main.app is not None"`, `python -c "import openai"`, and the production-equivalent Uvicorn command. Use an empty provider key and test-only gateway/ledger values; do not make a live provider call.

If Render reports that `requirements.txt` is missing, verify that the file is committed and the service Root Directory is exactly `backend`. If Render selects Python 3.14, verify that the repository-root `.python-version` is committed and contains `3.12.11`, and that no higher-precedence `PYTHON_VERSION` service variable overrides it.

### Private FastAPI persistent usage ledger

Attach one Render Persistent Disk to the private FastAPI service and configure:

- Persistent Disk mount path: `/var/data`
- `NEXORA_LLM_USAGE_STORE_PATH=/var/data/nexora_llm/usage.json`

Only files below `/var/data` persist across Render deploys and restarts. The disk is required for the current single-instance Hosted MVP LLM usage authority; a missing, invalid, or unusable configured ledger path fails closed before a provider call. The service remains single-instance because an attached Render disk prevents horizontal multi-instance scaling. A future multi-instance architecture must move the usage authority to a shared durable store rather than treating this filesystem ledger as distributed.

This disk stores only the operational LLM usage ledger. Manager Workspace, Data, Decision, Execution, and Scene truth remain in the Hosted PostgreSQL authority.

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
