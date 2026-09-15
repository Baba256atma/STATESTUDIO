# NPA-T ECA:10 — Architecture Inspection

**Phase:** Live Execution Dialogue & Deviation Intelligence
**Date:** 2026-09-14
**Stop condition:** Inspect + reuse; certify ECA:10 only. Do not start ECA:11 / Outcome.

## Existing ownership (reuse)

| Concept | Authority | Role for ECA:10 |
| --- | --- | --- |
| Subject / context | ECA:1 | Consume |
| Intent / next action | ECA:2 | Consume |
| Initiative | ECA:3 | Owns proactive speak; ECA:10 is not a notification engine |
| Information need / ask | ECA:4 | Gap may feed ask |
| Answer meaning | ECA:5 | Estimates / reported progress |
| Dialogue objective | ECA:6 | May REVIEW_EXECUTION; ECA:10 supplies live judgment |
| Recommendation | ECA:7 | Not live progress authority |
| Commitment | ECA:8 | Pre-Decision only |
| Execution readiness | ECA:9 | Pre-start only; ECA:10 requires live Execution |
| Execution create/start/status | CC:11 | Sole Execution writer |
| Live Execution theatre | DTH:10 | Not replaced |
| Outcome | DTH:11 / Outcome authority | Boundary only; ECA:11 not started |
| Data semantics | DATA-ADV | CAP_AV unconfirmed preserved |
| Risk / Goal / blockers / milestones | Canonical owners | Read-only |

## ECA:10 module

- `frontend/app/lib/nexora-conversation/ecaLiveExecution.ts`
- Entry: `judgeEcaLiveExecution`
- Session: ephemeral `EcaLiveExecutionSession` (prior progress/blocker fingerprint only)
- Overlay: `applyEcaLiveExecutionToPresentedResponse`

## Models (existing terms)

**Live states:** `NOT_LIVE` | `ACTIVE` | `BLOCKED` | `COMPLETED` | `UNKNOWN`

Maps to prompt NOT_APPLICABLE when no canonical live Execution.

**Track / deviation:** `ON_TRACK` | `OFF_TRACK` | `AHEAD` | `POSSIBLE_DEVIATION` | `UNKNOWN`
Deviation kinds: `NO_MATERIAL_DEVIATION` | `FAVORABLE_DEVIATION` | `UNFAVORABLE_DEVIATION` | `MIXED_DEVIATION` | `POSSIBLE_DEVIATION` | `UNKNOWN`

WATCH ≈ `POSSIBLE_DEVIATION`; DEVIATING ≈ `OFF_TRACK` / `UNFAVORABLE_DEVIATION`; INSUFFICIENT_EVIDENCE ≈ `UNKNOWN`.

## Boundaries (hard)

- Canonical live Execution required (`in-progress` | `blocked` | `at-risk` | `completed`)
- Decision / READY / preference alone ≠ live Execution
- Observed ≠ inferred; deviation ≠ cause; Risk ≠ blocker
- Attention ≠ intervention; mutation requests hand off, do not write
- No second monitor / progress / Risk / blocker / attention / Outcome authority
- ECA:10 Execution / Outcome / Decision mutations = 0
- Do not implement ECA:11 Outcome/Learning

## Not introduced

- Second Execution monitor or progress store
- Monitoring daemon / second initiative engine
- Parallel Outcome or intervention writer
