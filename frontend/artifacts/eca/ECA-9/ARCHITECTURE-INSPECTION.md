# NPA-T ECA:9 — Architecture Inspection

Date: 2026-09-08

## Stop condition

ECA:9 may be certified only when a read-only post-Decision execution-readiness judgment consumes canonical Decision/Execution plus ECA:1–8; never writes Execution/Decision/Outcome; distinguishes create from start according to CC:11; surfaces at most one material gap; preserves CAP_AV safety; and passes focused A–T, sequences 1–8, seven live `/executive` proofs, NXA Level 4, TypeScript, ESLint, production build, and `git diff --check`.

## Exact canonical Execution writer

**CC:11 Canonical Execution Runtime** (`createNexoraCanonicalExecutionRuntime` in `executiveExecutionRuntimeAdapter.ts`) is the sole product writer:

- `createExecution({ decisionId, title?, workspaceId?, modelId? })`
- `transitionExecution({ executionId, action })`

Conversation façade: **`CC:11/ExecutionFollowUp`** (`resolveNexoraExecutiveExecutionFollowUp`). Boundary: `canonicalExecutionWriter: false`, `delegatesMutationsToCanonicalRuntime: true`.

ECA:9 must not call `createExecution` / `transitionExecution`, and must not create `EcaExecutionStore`.

## Exact create vs start contracts

| Conversational request | Canonical effect |
| --- | --- |
| Create | `createExecution` → status `planned` (or `reused` if one already exists for that Decision) |
| Prepare | `transitionExecution({ action: "prepare" })` → `planned` → `ready` |
| Start | Follow-up `action: "start"` **intentionally** creates if missing, then `prepare`, then `start` → `in-progress` |

**Documented atomic start:** CC:11 start is allowed to create when no Execution exists. That is canonical, not an ECA:9 collapse. ECA:9 still distinguishes manager *intent* (create vs start vs review) and must not treat “Are we ready?” or “What’s next?” as start.

Statuses: `planned | ready | in-progress | blocked | at-risk | completed | cancelled`.

Dedupe: one Execution per Decision (`findExecutionByDecisionId`, id `execution-${decisionId}`).

## DTH:9 ownership

`DTH:9/ExecutionReadiness` — Theatre **presentation** after a committed Decision. Does not create or start Execution (`inventedExecution: false`, `clickStartedExecution: false`). `REQUEST_START_EXECUTION` routes to CC:11.

## DTH:10 ownership

`DTH:10/LiveExecution` — Theatre for live statuses (`in-progress | blocked | at-risk | completed`). Does not mutate Execution. `planned` / `ready` remain DTH:9.

## Existing readiness logic

DTH:9 projects owner/timing/resources/dependencies/constraints/risk as known/unknown/blocked. **Unknown owner is not a start blocker** on `/executive`. Authoritative CC:11 blockers are the only Theatre start blockers.

NEX-EXP:8 has separate entrance plan readiness (`MISSING_OWNER` there). That is not a second `/executive` Execution store. ECA:9 must not absorb NEX-EXP:8.

## Execution-required vs optional fields

**Required to mutate:** Approved Decision `decisionId`; legal status path for transitions; complete/cancel need confirmation.

**Written on create, not required to start:** `ownerIds` (often `[]`), `blockers`, `risks`, `milestones`, `progress`.

Missing owner → follow-up uncertainty `execution-owner-missing`, not a legal CC:11 start veto.

## What ECA:9 uniquely adds

Post-Decision conversational classification (review / readiness / create / start / inspect / defer / reconsider), one material readiness gap, session overlay (acknowledgement / defer), and handoff *flags* to CC:11 — without becoming the writer, DTH:9/10, or a PM checklist.

## How duplicate Execution engines are avoided

No second store, no `ecaCreateExecution`, no Theatre clone. Judge → session overlay → speech overlay → `data-eca-9-*`. Mutations remain `resolveNexoraExecutiveExecutionFollowUp` / adapter only. Overlay speaks only on execution-relevant turns.

## Decision → Execution → Outcome

Committed Decision ≠ Execution created. Execution created ≠ started. Started ≠ Outcome. ECA:9 never writes Outcome or Learning.

## ECA:1–8

ECA:9 consumes them after ECA:8. Post-Decision mode requires a real Approved Decision (`listDecisions` status `Approved`), not ECA:7 recommendation or ECA:8 commitment intent.

## Session durability

Session overlay is Manager–Object session-only (acknowledgement fingerprint, deferred-start flag, last Decision/Execution ids). Refresh clears it. Readiness is recomputed each turn from CC:11 facts.

## CAP_AV / Data

Unconfirmed CAP_AV must not be treated as confirmed capacity readiness. ECA:9 consumes the existing semantic-pending / ECA:4 fingerprint; it does not promote CAP_AV.
