# Launch checklist

No secret values belong in this list. Mark an item only after the operator confirms it in the hosting account.

- [ ] Production domain selected and DNS pointed at the web service
- [ ] HTTPS active, with HTTP redirected to HTTPS
- [ ] GitHub OAuth callback is the HTTPS production callback
- [ ] `NEXTAUTH_SECRET` set on the web service
- [ ] `DATABASE_URL` set on the web service only
- [ ] Managed Postgres backups enabled, with retention recorded
- [ ] `NEXORA_LLM_GATEWAY_SECRET` set on the web service and the private runtime
- [ ] Provider API key set on the private runtime only
- [ ] `NEXORA_DEPLOYMENT_MODE=hosted`
- [ ] `NEXORA_AUTH_DEV_SIGN_IN` is not `true`
- [ ] FastAPI is reachable only from the web service
- [ ] Web service and FastAPI are each one instance
- [ ] Private FastAPI Root Directory is `backend`
- [ ] Repository-root `.python-version` selects Python `3.12.11` (no conflicting `PYTHON_VERSION` override)
- [ ] Private FastAPI Build Command is `pip install -r requirements.txt`
- [ ] Private FastAPI Start Command is `uvicorn main:app --host 0.0.0.0 --port $PORT`
- [ ] Render Persistent Disk is attached to the private FastAPI service at `/var/data`
- [ ] `NEXORA_LLM_USAGE_STORE_PATH=/var/data/nexora_llm/usage.json` is set on the private FastAPI service
- [ ] `GET /api/health` returns ready
- [ ] Rate, burst, concurrency, and budget limits are the HOSTED-MVP:5 values
- [ ] Manufacturing Demo, Project Demo, and Reset Demo work without a paid provider call
- [ ] One synthetic customer workspace journey was verified and then deleted
- [ ] Next.js production dependency audit has no unresolved critical finding
