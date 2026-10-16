# NPA-T HOSTED-MVP:5 — CERTIFIED

Paid Hosted LLM calls stay on the existing gateway. A request reaches the provider only after authentication, workspace authorization, payload bounds, rate, burst, concurrency, and budget checks. HOSTED-MVP:6 was not started.

## Authority

Browser → `POST /api/nexora/llm` → authenticated principal → `authorizeNexoraWorkspace` → server-built workspace context → usage and security policy → FastAPI `POST /nexora/llm/runtime` with the gateway secret → one OpenAI text adapter.

The browser does not hold the provider key or the gateway secret. There is no second gateway.

## Defaults

| Control | Default |
| --- | --- |
| User rate | 20 requests / 60 seconds |
| Workspace rate | 12 requests / 60 seconds |
| Burst | 3 requests / 10 seconds |
| User concurrency | 1 |
| Workspace concurrency | 1 |
| User attempt allowance | 40 / usage period |
| Workspace attempt allowance | existing `NEXORA_LLM_USAGE_LIMIT` |
| User budget | 2.00 USD / period |
| Workspace budget | 1.00 USD / period |
| Unpriced request floor | 0.01 USD |
| Usage detail retention | 30 days |
| Provider timeout | 8 seconds |
| Automatic retries | 0 |

Exceeded rate or burst returns `rate_limit_exceeded`. Exhausted budget returns `BUDGET_EXHAUSTED`. A second active request returns `concurrency_exceeded`. Oversized input or raw CSV text returns `payload_too_large`. A ledger that cannot decide returns `USAGE_UNAVAILABLE`. None of those start a provider call.

## Context and retention

The manager message is clipped to 240 characters. Observations, the Decision, and the Execution in the provider payload are read from the authorized workspace. A browser-supplied KPI, Decision, or other workspace value is not copied into that payload.

Settled records keep scope, period, turn id, provider, model, status, latency, token counts, and cost. They do not keep the manager message, the model answer, or raw CSV. Detailed records older than 30 days are removed on the next guarded request. The period attempt counter remains.

Account deletion removes Hosted workspace rows. Operational usage records follow the 30-day retention and are not customer content.

## Proof

- `test_nexora_llm_hosted_security.py`, `test_nexora_llm_usage.py`, and `test_nexora_llm_runtime.py`: 31 passed.
- Hosted authorization and lifecycle tests passed.
- Context projection keeps one workspace value and drops raw CSV and another workspace value.
- Anonymous `POST /api/nexora/llm` returned HTTP 401 `authentication_required`.
- Direct FastAPI calls without the gateway secret remain HTTP 401.
- Hydration mismatch 0, React hydration errors 0, uncaught errors 0. First client `data-core-int4-ranked` was `false`.
- TSC_EXIT:0. BUILD_EXIT:0.

The live certification did not call the paid provider. Allow, refusal, timeout, provider error, network error, invalid response, concurrency release, and retention were proven with a fake adapter.

## Server

Hosted server process 86263 on port 3010. `GET /executive` returned HTTP 200. The local server on port 3000, process 84225, was left running.
