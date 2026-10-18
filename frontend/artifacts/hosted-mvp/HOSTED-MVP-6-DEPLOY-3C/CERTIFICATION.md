# NPA-T HOSTED-MVP:6-DEPLOY:3C — Render Private FastAPI Live Verification

## Verdict

**NPA-T HOSTED-MVP:6-DEPLOY:3C — CERTIFIED**

Certification date: 2026-10-18 (America/Vancouver)

This certificate covers only the deployed Render Private FastAPI production boundary. It does not certify the Next.js production service, public Nexora, PostgreSQL integration, GitHub OAuth, a custom domain, full HOSTED-MVP:6, or PUBLIC-MVP:FINAL.

## Stop condition

Certification required direct evidence of the live deployment identity, production Python/build/start behavior, Hosted route and gateway boundaries, server-side secret handling, the exact persistent-ledger path, survival of a harmless ledger marker across a real same-service restart, post-restart health, and fail-closed usage behavior. Every required gate was directly observed on the Render service.

## Render service and deployment identity

- Service: `nexora-backend`
- Render service ID: `srv-dbai6a3bc2fs73bg5dd0`
- Service type: **Private Service**
- Region: **Oregon (US West)**
- Active deploy: `dep-dbaioq8m7kps7390rai0`
- Status observed in Render: **Deploy succeeded | Live**
- Source commit: `30e1c4b4a9f48d245bce0a9389730563c574f536`
- GitHub source/branch: `Baba256atma/STATESTUDIO`, `main`
- Local `HEAD` and `origin/main` also resolved to the same full commit.

The commit contains the DEPLOY:3A/3B production inputs: repository Python selection, pinned `backend/requirements.txt`, the persistent usage-store contract, and the deployment documentation.

## Python, build, and startup evidence

- A command in the running Render instance returned `Python 3.12.11`; the historical Python 3.14.8 default is not in use.
- Render settings showed Root Directory `backend/` and Build Command `pip install -r requirements.txt`.
- The deploy log showed dependencies being resolved from `requirements.txt`, CPython 3.12 wheels (`cp312`), successful installation (including FastAPI, Uvicorn, OpenAI, Pydantic, and HTTPX), and `Build successful`.
- Render settings and both initial and post-restart logs showed the exact start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
- The initial log reached `Application startup complete`, `Uvicorn running on http://0.0.0.0:10000`, and `Your service is live`.
- After the bounded restart, the new instance reached `Application startup complete` and served `/health` successfully.

### Ollama startup warning classification

The logs contain `ollama_request_unavailable` and `local_ai_unavailable_on_startup provider=ollama`. These are harmless optional local-provider probes for this boundary:

- startup continued immediately to `Application startup complete`;
- Uvicorn remained healthy on port 10000;
- the production process loaded the independent configured adapter with provider `openai`;
- `/health` remained successful before and after restart.

No localhost Ollama dependency prevented the Hosted OpenAI adapter from loading. No repair is warranted under this mission.

## Hosted mode and health

The running production process reported:

- `NEXORA_DEPLOYMENT_MODE=hosted`
- `ENV=production`

The canonical source-owned health endpoint is `GET /health`. From the actual Render Web Shell, against the running instance:

- endpoint: `http://127.0.0.1:$PORT/health`
- status: HTTP 200
- minimal response: `{"ok":true}`

The same response and status were observed after the real restart. A 404 for `/` is expected because root is not an allowed Hosted endpoint.

## Private-service boundary

Render identifies the service as a **Private Service**, with no public Internet URL displayed. Its private HTTP service address is:

`nexora-backend-91el:10000`

That is the address the future same-region Next.js Web Service can use over Render's private network. No public FastAPI endpoint or Next.js service was created during this mission.

## Hosted route closure

Internal requests against the actual service produced:

- `GET /` -> HTTP 404, `{"error":"not_found"}`
- `GET /debug` -> HTTP 404, `{"error":"not_found"}`

The source-owned Hosted allowlist remains `/health` and `/nexora/llm/runtime`; legacy, debug, and development surfaces remain fail-closed.

## Gateway protection

Safe POST probes were made only over the Render instance's loopback interface. No provider request was dispatched.

- Missing gateway credential -> HTTP 401, `not_authorized`
- Intentionally incorrect test credential -> HTTP 401, `not_authorized`
- Correct server-side credential -> HTTP 200 and policy result `LLM_DISABLED`

The correct-credential command referenced the server environment variable by name; the secret value was never printed, copied into the browser, returned by the endpoint, or written to this artifact. The 200 result proves the correct credential crossed the gateway layer, while the disabled policy terminated before provider dispatch.

`NEXORA_LLM_ENABLED` is currently unset, so the existing policy intentionally defaults to safe disabled mode. This is non-blocking for the DEPLOY:3C private-boundary certificate and must be changed only through an explicit later production enablement decision.

## OpenAI secret boundary

- The running service reported `OPENAI_API_KEY` configured as a boolean only; its value was never read or displayed.
- `configured_adapter()` returned a loadable adapter with provider `openai` in the actual production process.
- No paid provider call was made.
- The endpoint responses contained no API key or secret material.
- A tracked-source scan found no production OpenAI key. The only `sk-...` value found in relevant backend source is the intentional test sentinel `sk-secret-must-not-round-trip` in `backend/tests/test_nexora_llm_runtime.py`.
- The Render log searches described below found no key or key-like value.

The provider key remains server-side and is not exposed to browser code.

## Persistent usage ledger

The Render disk and runtime directly established:

- disk mount: `/var/data`
- disk size: 10 GB
- configured/resolved ledger: `/var/data/nexora_llm/usage.json`
- resolved path was absolute and matched exactly;
- `NexoraLlmUsageStore()` selected this path;
- the directory was created and writable by the running service;
- no repository-filesystem fallback was used.

A harmless marker was created through the deployed `NexoraLlmUsageStore.try_reserve()` mechanism and then released, creating the operational ledger without provider spend. The resulting file existed at the configured path, was 368 bytes, and contained the marker. A non-sensitive scan of the ledger found none of these forbidden field/key names: API key, gateway secret, raw CSV, deterministic response, management context, or contribution. No ledger content was copied into this artifact.

This file remains the sole deployed usage authority. The architecture is intentionally single-instance; this certificate does not claim horizontal scaling support.

## Persistence across real restart

1. Before restart, instance suffix `mfslb` created and observed marker `cert-3c-restart-20261018` in `/var/data/nexora_llm/usage.json` (368 bytes).
2. Render's **Restart service** action was used on the same service. The disk was not replaced, detached, deleted, or recreated.
3. Logs showed the old `mfslb` process shut down cleanly.
4. Render started replacement instance suffix `8wrfc`, which reached `Application startup complete`.
5. On `8wrfc`, the ledger still existed at the same path, retained the marker, and remained 368 bytes.
6. `GET /health` on the replacement instance returned HTTP 200 with `{"ok":true}`.

This is direct production evidence that the Render persistent disk preserves the usage ledger across a real restart.

## Usage guard fail-closed evidence

The deployed code was exercised inside the replacement Render instance with:

- an explicitly unwritable ledger path under `/proc`;
- a fake adapter whose `complete()` method would raise if invoked;
- an enabled synthetic usage policy;
- no network/provider request.

Result: `status=skipped`, `reason=USAGE_UNAVAILABLE`, `provider_not_called=true`.

This proves the deployed guard does not fall back to ephemeral storage or dispatch a provider when usage authority is unavailable. Existing rate, budget, concurrency, and usage checks continue to share this ledger authority.

## Production log and secret audit

The relevant deploy, request-probe, restart, and post-restart logs were inspected. Normal entries contained only status, route, latency, provider-category, and process lifecycle data. Render log searches over the observed production window returned no matches for:

- `OPENAI_API_KEY`
- `NEXORA_LLM_GATEWAY_SECRET`
- `sk-`
- `csvText`
- `manager`
- `postgres`

No manager message, LLM answer, raw CSV, API key, gateway secret, or database credential was observed in normal logs. The request logs recorded only routes and HTTP statuses.

## Resource/runtime sanity

- Region: Oregon (US West)
- Compute: 0.5 CPU / 512 MB RAM
- Persistent disk: 10 GB mounted at `/var/data`
- Render defaulted `WEB_CONCURRENCY=1`
- Service remained healthy through bounded verification and restart
- No load test or scaling action was performed

The persistent-file ledger intentionally limits this MVP to a single FastAPI instance.

## Warnings and non-blocking debt

- Optional Ollama health probes warn at startup because no local Ollama daemon exists. They do not block startup or the OpenAI adapter.
- `NEXORA_LLM_ENABLED` is unset, so correct authenticated LLM requests currently fail closed as `LLM_DISABLED`. Explicit enablement belongs to a later controlled production decision; no silent semantic fallback occurs.
- A supplemental local pytest attempt was unavailable because this checkout has no Python virtual environment and the system Python does not have pytest installed. This is an environmental tooling limitation, not a production failure, and was not used as a substitute for any required Render proof.

No production failure remains unexplained. No application source repair was indicated or made.

## Source hygiene

Before this artifact was created, `git status --short` was clean at commit `30e1c4b4a9f48d245bce0a9389730563c574f536`. This mission changes only this certification artifact. No environment file, credential, usage ledger, virtual environment, cache, or production log was added to the repository.

## Exact next deployment step

Next:
`NPA-T HOSTED-MVP:6-DEPLOY:4 — Next.js Production Web Service`

DEPLOY:4 was not started. No Render Web Service, PostgreSQL change, GitHub OAuth configuration, full HOSTED-MVP:6 certification, or PUBLIC-MVP:FINAL work was performed.
