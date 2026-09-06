# NPA-T ECA:1-FIX2 — Canonical Risk Writer Rules & Conversational Handoff

**Status: CERTIFIED**

## Authority

`DS-6:1/CanonicalRiskWriter` in `frontend/app/lib/risk/canonicalRiskWriter.ts` is the single governed Risk mutation boundary. It delegates persistence to the existing `workspaceRiskContract.ts` store, which remains the Risk authority. ECA only creates a proposal and invokes the handoff adapter; it does not write Risk state.

## Certification gates

| Gate | Result | Evidence |
| --- | --- | --- |
| Canonical Risk authority identified | PASS | Existing DS-6:1 Risk store formalized behind one writer. |
| Single writer rule | PASS | ECA calls `handoffEcaRiskMutation`; no ECA Risk store exists. |
| Create rules | PASS | Valid name, workspace, provenance, and proposal-bound confirmation required. |
| Confirmation binding | PASS | Confirmation proposal ID must match provenance and active session proposal. |
| Duplicate protection | PASS | Canonical normalized title identity returns `ALREADY_EXISTS`. |
| Unknown-field safety | PASS | Risk contract has no fabricated probability/severity/owner fields. |
| Causality safety | PASS | No `CAUSES` relationship is created; unsupported RELATE is rejected. |
| Data uncertainty preservation | PASS | Evidence refs are preserved as provenance; semantic status is not promoted. |
| Update rules | PASS | Existing Risk ID required; untouched fields are preserved. |
| Remove rules | PASS | Existing ID required; dependencies block removal pending review. |
| Relationship rules | PASS | RELATE is rejected until an existing ontology relationship writer is available. |
| Stage reconciliation | PASS | Writer never writes Stage; runtime continues through existing projections. |
| ECA handoff | PASS | Proposal-bound adapter invokes the canonical writer exactly once. |
| Decision isolation | PASS | Non-Risk target types are rejected by the handoff adapter. |
| Execution isolation | PASS | Non-Risk target types are rejected by the handoff adapter. |
| Problem isolation | PASS | Problem target types are rejected by the handoff adapter. |
| Live runtime | PASS | `/executive` proposal -> `Add it.` -> canonical success response verified. |

## Focused evidence

- Canonical writer and handoff tests: **22 passed / 0 failed**.
- Writer + handoff + ECA + conversation integration: **57 passed / 0 failed**.
- Direct orchestration proposal/confirmation/cancellation tests: **2 passed / 0 failed**.
- Existing Risk contract tests: included in the writer validation slice and remained green.

## Live `/executive` proof

Runtime: `http://localhost:3000/executive`.

1. `Add Supplier Delay as a Risk.` returned `I can add “Supplier Delay” as a RISK. Add it?`; Risk state remained unchanged before confirmation.
2. `Add it.` returned `Supplier Delay has been added as a Risk.`; the canonical writer created the Risk once and cleared the session proposal.
3. Cancellation is covered by direct orchestration proof: `Never mind.` clears the proposal and creates no Risk.

## Boundaries

- Risk persistence and identity remain owned by DS-6:1.
- Detection, severity, object binding, Stage, Advisor, Decision Theatre, Decision, Execution, Outcome, and Learning remain separate authorities.
- Proposal and confirmation metadata are session-scoped; the Risk record's manager provenance is durable only because the canonical Risk store owns it.
- No ECA-specific duplicate registry, Stage writer, Risk database, or generic imperative router was introduced.

## Remaining parent ECA:1 gates

FIX2 does not certify the parent ECA:1 phase. Existing unrelated regression failures and the remaining broader ECA runtime/data/Stage certification sequences must still be addressed under ECA:1-GATES.

Do not start ECA:2.