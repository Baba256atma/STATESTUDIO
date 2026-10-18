# NPA-T HOSTED-MVP:6-DEPLOY:3A — CERTIFIED

The existing `LLM-MVP:4/UsageStore` remains the sole operational LLM usage authority. This repair adds one server-only path configuration seam; it does not change provider, usage, budget, rate, concurrency, authentication, authorization, workspace, or manager truth.

## First divergence and repair

Before the repair, `default_usage_store_path()` always resolved to `backend/data/nexora_llm/usage.json`. Hosted mode therefore had no way to select a Render Persistent Disk and could silently use the ephemeral application filesystem.

The repaired resolution rule is:

1. A non-empty `NEXORA_LLM_USAGE_STORE_PATH` must be absolute and is used exactly.
2. If it is missing, empty, or relative while `NEXORA_DEPLOYMENT_MODE=hosted`, construction fails into the existing `USAGE_UNAVAILABLE` guard result before provider dispatch.
3. If it is absent outside Hosted mode, the existing `backend/data/nexora_llm/usage.json` default remains unchanged.
4. Explicit `Path` constructor injection remains supported for bounded tests and existing callers.

The existing store lock/write pipeline creates only the configured parent hierarchy and ledger/temp files. An unusable target fails closed. Store reconstruction reads the same persisted attempt and record authority.

## Proof

- Focused and owning Python LLM usage/runtime/security/path suite: 38 passed.
- All `test_nexora_llm*.py` modules with paid live access disabled: 38 passed, 4 live tests skipped, 0 failed.
- Hosted production-config, workspace-authorization, gateway, and LLM-context tests: 4 passed.
- Python compile/import and `main:app` start-target validation: passed.
- Missing, empty, relative, and unusable Hosted paths: `USAGE_UNAVAILABLE`, zero fake-provider calls.
- Configured nested absolute path: parent created, ledger written at that exact path, and a reconstructed store/runtime observed the prior attempt.
- Existing usage record privacy assertions remain green; no manager message, answer, raw CSV, API key, or gateway secret was added to the ledger.

A broad live-test probe initially reported 4 environmental failures because the developer environment configured a provider key while the OpenAI SDK was absent. Each stopped at `NOT_CONFIGURED`; no provider completion occurred. The bounded certification suite then ran with paid live access disabled and had zero failures. Installing dependencies, using a provider credential, or making a paid call was outside this repair.

## Render owner configuration

- Private FastAPI service Root Directory: `backend`
- Persistent Disk mount path: `/var/data`
- Environment variable: `NEXORA_LLM_USAGE_STORE_PATH=/var/data/nexora_llm/usage.json`
- Deployment mode: `NEXORA_DEPLOYMENT_MODE=hosted`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

The disk is required for this single-instance Hosted MVP usage authority. It does not store manager workspace truth; Manager Workspace, Data, Decision, Execution, and Scene truth remain in Hosted PostgreSQL. The attached disk is not a distributed authority and prevents horizontal multi-instance scaling for this service. A future multi-instance design must move usage accounting to a shared durable store.

## Remaining boundary

No Render deployment or infrastructure provisioning was performed. No PostgreSQL, Next.js, authentication, or authorization behavior changed. HOSTED-MVP:6 final recertification was not started.
