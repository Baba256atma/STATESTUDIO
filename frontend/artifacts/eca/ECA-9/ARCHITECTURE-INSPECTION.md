# NPA-T ECA:9 — Architecture Inspection

**Phase:** Post-Decision Dialogue & Execution Readiness
**Date:** 2026-09-14
**Stop condition:** Inspect + reuse; certify ECA:9 only. Do not start ECA:10.

## Existing ownership (reuse)

| Concept | Authority | Role for ECA:9 |
| --- | --- | --- |
| Subject / context | ECA:1 | Consume |
| Intent / next action | ECA:2 | Consume |
| Initiative | ECA:3 | Consume; ECA:9 is not an alert engine |
| Information need / ask | ECA:4 | Blocker may feed ask; ECA:4 owns question |
| Answer meaning | ECA:5 | Readiness Yes / owner answers |
| Dialogue objective | ECA:6 | May PREPARE_EXECUTION; ECA:9 owns readiness judgment |
| Recommendation | ECA:7 | Historical advisory only after Decision |
| Commitment dialogue | ECA:8 | Pre-Decision only; cannot replace CC:10 |
| Decision create/approve | CC:10 / CC:10R | Sole Decision writer |
| Execution create/start | CC:11 | Sole Execution writer |
| Readiness theatre | DTH:9 | Not replaced |
| Live Execution theatre | DTH:10 | Not replaced; ECA:10 not started |
| Data semantics | DATA-ADV | CAP_AV unconfirmed stays unconfirmed |
| Risk / Outcome / Learning | Canonical owners | Read-only; no ECA write |

## ECA:9 module

- `frontend/app/lib/nexora-conversation/ecaExecutiveExecutionReadiness.ts`
- Entry: `judgeEcaExecutiveExecutionReadiness`
- Session: ephemeral `EcaExecutionReadinessSession` (no persistence store)
- Overlay: `applyEcaExecutionReadinessToPresentedResponse`

## Models (existing terms)

**Post-Decision states:** `NOT_APPLICABLE` | `DECISION_CONFIRMED` | `EXECUTION_REVIEW` | `EXECUTION_PREPARATION` | `EXECUTION_READY` | `EXECUTION_NOT_READY` | `EXECUTION_CREATE_INTENT` | `EXECUTION_START_INTENT` | `EXECUTION_ALREADY_ACTIVE` | `EXECUTION_BLOCKED`

**Execution readiness:** `READY` | `READY_WITH_CONDITIONS` | `NOT_READY` | `BLOCKED` | `ALREADY_EXECUTING` | `NOT_APPLICABLE`

**Manager intents:** includes `READINESS` | `START` | `CREATE` | `DEFER` | `RECONSIDER` | `OWNER` | `STOPPERS` | …

## Boundaries (hard)

- Canonical approved Decision required for post-Decision mode
- Recommendation / preference / ECA:8 commitment alone ≠ Execution readiness
- Decision ≠ Execution · readiness ≠ Start · READY ≠ auto-start
- One primary gap/blocker; no invented requirements
- Ambiguous phrases (e.g. “move forward”) are not Start
- Risk acceptance ≠ Risk resolution; CAP_AV acceptance ≠ DATA write
- No second Execution engine / store / readiness authority
- ECA:9 Execution mutations = 0; CC:11 only
- Do not implement ECA:10 live monitoring

## Not introduced

- Second Execution engine or store
- Parallel owner/blocker/milestone store
- Generic action runner / autonomous task executor
- ECA-specific Execution status
