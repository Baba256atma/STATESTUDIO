# NPA-T HOSTED-MVP:6-DEPLOY:3B — CERTIFIED

This repair establishes the missing Python production build contract. It does not deploy or retry Render, change application behavior, or certify HOSTED-MVP:6.

## Original failure

The first Render Private FastAPI deployment reached commit `a9b1a32c` and failed during Build. With Root Directory `backend` and Build Command `pip install -r requirements.txt`, Render reported that `requirements.txt` did not exist. Render had selected Python 3.14.8 because the repository had no Python runtime pin. The deployment did not reach application startup.

## Dependency audit and resulting manifest

Import audit covered `main.py`, every registered router, startup middleware and services, the Hosted LLM route/runtime/usage authority, and the OpenAI adapter. Hosted mode closes legacy routes at request time, but `main.py` imports and registers them before that middleware runs; their import-time requirements therefore remain part of production startup.

`backend/requirements.txt` pins the direct production surface:

- `fastapi==0.135.1` — application and router framework
- `httpx==0.28.1` — directly imported local-provider HTTP client used by startup/runtime modules
- `openai==3.35.1` — Hosted OpenAI adapter SDK
- `pydantic==2.12.5` — directly imported request/domain models
- `pydantic-settings==2.16.0` — directly imported startup settings
- `starlette==1.9.0` — directly imported production middleware
- `uvicorn==0.42.0` — ASGI production server

No test package, local path, editable install, credential, or package token is in the production manifest.

## Python selection

The existing backend virtual environment uses Python 3.12.7. Render documents a repository-root `.python-version` as a supported repository-owned selector and identifies 3.12.11 as a supported Python 3.12 release. The repository-root `.python-version` contains exactly `3.12.11`. No `PYTHON_VERSION` environment override is required; if one already exists in Render, it must be removed or set to the same fully qualified version because it has higher precedence.

References:

- https://render.com/docs/python-version
- https://render.com/docs/deploy-fastapi
- https://render.com/docs/monorepo-support

## Clean-environment evidence

A fresh temporary virtual environment was created outside the repository with Python 3.12.7 and no system-site packages. Installation from only `backend/requirements.txt` completed successfully. Before any test dependency was added:

- `import main; assert main.app is not None` passed.
- `import openai` passed.
- Importing `OpenAITextAdapter` passed.
- The configured temporary usage ledger created its nested parent and survived store reconstruction.
- Missing Hosted usage-ledger configuration returned `USAGE_UNAVAILABLE` with zero fake-provider calls.
- Uvicorn reached `Application startup complete` using the production-equivalent command.
- Hosted `/health` returned HTTP 200 with `{"ok":true}`.
- Hosted `/debug/system-state-schema` returned HTTP 404.
- Hosted `/nexora/llm/runtime` without the gateway secret returned HTTP 401.
- The test server was shut down after inspection.

The clean proof used an empty `OPENAI_API_KEY`, a test-only gateway value, and a temporary ledger path. No provider request was made.

## Regression evidence

After the production proof, `pytest==9.0.3` was installed only in the temporary certification environment so the exact production package versions could be tested without adding pytest to `requirements.txt`.

- Focused usage/runtime/security/DEPLOY:3A path suite: 38 passed.
- All `test_nexora_llm*.py`: 38 passed, 4 paid-live tests skipped, 0 failed.
- Hosted production-config, workspace-authorization, gateway, and LLM-context integration: 4 passed.
- Python compilation: passed.

## Dependency security audit

`pip-audit==2.10.1` was installed in a separate temporary audit environment and run against `backend/requirements.txt`.

The first audit found 11 advisory rows across two pinned packages: `pydantic-settings==2.13.1` and `starlette==0.52.1`. The audit output did not assign severities, so all findings were treated as certification blockers rather than assumed low risk. Both packages were upgraded to the audit-specified fixed release lines, the clean environment and regression suites were rebuilt/re-run, and the final audit reported: `No known vulnerabilities found`.

This result is evidence for the audited dependency resolution on 2026-10-18, not a permanent claim about future advisories.

## Render retry contract

- Service: existing Private FastAPI service
- Root Directory: `backend`
- Runtime: Python 3
- Repository-root Python selector: `.python-version` containing `3.12.11`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Region: Oregon (US West)
- Persistent Disk Mount Path: `/var/data`
- `NEXORA_DEPLOYMENT_MODE=hosted`
- `ENV=production`
- `OPENAI_API_KEY=<Render secret>`
- `OPENAI_MODEL=gpt-4o-mini`
- `NEXORA_LLM_GATEWAY_SECRET=<Render secret>`
- `NEXORA_LLM_USAGE_STORE_PATH=/var/data/nexora_llm/usage.json`

`DATABASE_URL` is not required by this FastAPI service. Manager PostgreSQL truth remains owned by the Hosted Next.js server.

## Changed files and remaining boundary

DEPLOY:3B changes only:

- `.python-version` — repository-owned Render Python 3.12.11 selector
- `backend/requirements.txt` — pinned production dependencies
- `frontend/artifacts/hosted-mvp/HOSTED-MVP-6/RUNBOOK.md` — build, startup, clean-proof, and troubleshooting contract
- `frontend/artifacts/hosted-mvp/HOSTED-MVP-6/LAUNCH-CHECKLIST.md` — owner configuration gates
- `frontend/artifacts/hosted-mvp/HOSTED-MVP-6-DEPLOY-3B/CERTIFICATION.md` — this evidence record

No Python application runtime or frontend product code changed for 3B.

The owner must still review, commit/push, verify the Render settings, retry the existing service deployment, and inspect the real Render build/runtime result. No infrastructure was provisioned and PUBLIC-MVP:FINAL was not started.
