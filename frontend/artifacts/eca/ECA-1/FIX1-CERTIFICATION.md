# NPA-T ECA:1-FIX1 — Conversational Mutation Proposal & Canonical Confirmation Handoff

**Status: NOT CERTIFIED**

## Architecture inspection

See [FIX1-ARCHITECTURE-INSPECTION.md](FIX1-ARCHITECTURE-INSPECTION.md). ECA recognizes and projects intent only. The existing workspace object approval pipeline is not a Risk-domain writer, so FIX1 does not route Risk mutations into it or create a parallel Risk store.

## FIX1 gates

| Gate | Status | Evidence |
| --- | --- | --- |
| Mutation intent recognition | PASS | Explicit ADD/UPDATE/REMOVE/RELATE frame and natural ADD variants tested. |
| Read-only proposal | PASS | Proposal carries target, operation, provenance, confirmation requirement, and `executed: false`. |
| Explicit confirmation | PARTIAL | Confirmation language helpers pass, but no proposal-bound session confirmation state is connected to a Risk writer. |
| Canonical writer handoff | FAIL | No existing conversational canonical Risk writer was found. Workspace object approval is a different authority. |
| Cancellation | PARTIAL | Cancellation helpers pass and no write occurs, but live cancellation currently falls through the existing Decision-confirmation path because proposal state is not persisted. |
| Clarification | PASS | Unresolved Remove target produces `NEEDS_CLARIFICATION` and does not guess. |
| Duplicate protection | PASS | ECA adds no duplicate registry; duplicate validation remains delegated to the canonical authority. |
| Stage safety | PASS | Proposal does not mutate Stage; live Stage remained unchanged before confirmation. |
| Data uncertainty safety | PASS | `PROPOSED` semantic status and evidence refs remain unchanged. |
| Decision isolation | PASS | `Approve Scenario A.` is not classified as an ECA object mutation. |
| Execution isolation | PASS | `Start Execution A.` is not classified as an ECA object mutation. |
| Live `/executive` proof | PARTIAL | Proposal response verified live; confirmation/canonical reconciliation cannot be verified without the missing writer/state handoff. |
| Regression gates | NOT CERTIFIED | Existing unrelated failures remain in conversation, Director/context, data/workspace, and Theatre groups. |

## Focused tests

- FIX1 mutation proposal tests: **10 passed / 0 failed**.
- ECA working-context tests: **18 passed / 0 failed**.
- Combined focused slice: **28 passed / 0 failed**.

## Live proof

Runtime: `http://localhost:3000/executive`.

- `Add Supplier Delay as a Risk.` produced: `I can add “Supplier Delay” as a RISK. Add it?`
- No object or Stage mutation occurred before confirmation.
- `Never mind.` produced no mutation, but returned the existing `No pending Decision confirmation to cancel.` response. This proves no write, but not the required proposal-bound cancellation lifecycle.
- Confirmation, canonical writer execution, failure handling, duplicate reconciliation, and post-success Stage/Advisor reconciliation remain unproven because no conversational Risk writer is available.

## Regression evidence

- Conversation/NCA: 428 passed / 1 pre-existing failure.
- BCA/Stage/Director/manager context: 284 passed / 9 pre-existing path-resolution failures.
- Data/workspace: 1,373 passed / 9 pre-existing workspace failures.
- Decision Theatre/lifecycle: 345 passed / 1 pre-existing comparison failure.
- NXA funnel level 1: passed.

## Build quality

- TypeScript: passed with `NODE_OPTIONS=--max-old-space-size=8192`.
- Touched-file ESLint: passed.
- Production build: passed with the same heap setting.
- `git diff --check`: blocked by existing trailing whitespace in `frontend/app/lib/nexora-certification/nxaTestFunnel.ts`, outside FIX1 files.

## Exact blockers

1. No canonical conversational Risk writer exists in the inspected architecture.
2. No proposal-bound session state connects confirmation/cancellation replies to a future writer.
3. Required canonical confirmation and reconciliation proof cannot be performed without those authorities.
4. Existing unrelated regression failures violate the repository zero-failure certification rule.

Do not start ECA:2. Do not declare the parent ECA:1 certified.