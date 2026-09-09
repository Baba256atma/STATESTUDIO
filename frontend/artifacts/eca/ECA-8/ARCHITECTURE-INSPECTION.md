# NPA-T ECA:8 — Architecture Inspection

Date: 2026-09-08

## Stop condition

ECA:8 may be certified only when a read-only commitment-dialogue and pre-Decision challenge judgment consumes ECA:1–7 plus CC:10 / CC:10R / DTH:8; never writes Decision/Execution/Stage/Data; distinguishes preference from commitment; challenges only material blockers; preserves stale-Yes safety; and passes focused A–T, sequences 1–8, seven live `/executive` proofs, NXA Level 4, TypeScript, ESLint, production build, and `git diff --check`.

## Exact canonical Decision writer

**CC:10** (`CC:10/DecisionCommitment`) plans commitment. It does not mutate Runtime.

**CC:10R** (`CC:10R/DecisionRuntimeConvergence`) is the sole product writer via `transitionDecision` (`executiveDecisionRuntimeAdapter.ts`), reached only through `resolveNexoraExecutiveDecisionCommitment`.

ECA:8 must not call `transitionDecision`, create `EcaDecisionStore`, or implement `ecaCommitDecision()`.

## Exact Decision commitment contract

CC:10 policy (`executiveDecisionCommitmentPolicy.ts`):

| Strength | Outcome |
| --- | --- |
| `preference` | `preference-only` — no write |
| `soft` | `confirmation-required` — pending on Decision session |
| `explicit` | may apply via CC:10R |

Pending confirmation lives on `NexoraExecutiveDecisionSession`, not Manager–Object ECA overlays. Dedupe / already-committed is CC:10R.

## Existing commitment intent interpretation

ECA:2 maps `I choose` / `choose` / `approve` / `commit to` / `decide on` → `COMMIT_DECISION` → `HANDOFF_TO_CANONICAL_AUTHORITY` with `authorityTarget: "CC:10 Decision Commitment"` and `commitsDecision: false`.

`I prefer` is **not** ECA:2 `COMMIT_DECISION`. CC:10 treats prefer as `preference-only`.

ECA:5 stale Yes never mutates. Bare Yes is not CC:10 intent unless a pending Decision confirmation exists.

## Existing confirmation mechanism

CC:10 pending confirmation + DTH:8 Approve control. DTH:8 (`DTH:8/DecisionCommitment`) is Theatre **experience**: REVIEWING / READY_TO_COMMIT / COMMITTED / BLOCKED. It does not invent Decisions (`inventedDecision: false`, `clickCommitted: false`).

## How DTH:8 hands off to CC:10 / CC:10R

DTH:7 comparison → DTH:8 review → explicit Approve → CC:10 → one CC:10R Decision. Execution remains CC:11 / DTH:9.

## What ECA:8 uniquely adds

Conversational **commitment classification**, **one material pre-Decision challenge**, **acknowledgement**, **pending confirmation overlay** (session-only), and **handoff-allowed** diagnostics — without becoming the writer or a second confirm UI.

CC:10 still runs on the existing command path. ECA:8 does not reorder or replace it. Overlay speech frames preference / challenge / confirmation / “what am I approving?” after ECA:7.

## How duplicate confirmation/approval engines are avoided

No second confirm widget. Session overlay stores pending target fingerprint + acknowledged challenge id only (same durability as ECA:3–7). Refresh empties the overlay; later Yes cannot commit through ECA:8.

## Preference vs commitment

Preference (`I prefer A`) ≠ Decision. Recommendation acceptance (`I agree`) ≠ Decision. Navigation / Stage focus ≠ pending confirmation.

## Target binding

Reuse ECA:1 + ECA:7 considered options. Explicit named target > pending overlay target > single resolved ECA:1 reference. Two candidates + “it” → AMBIGUOUS. No Stage-focus fallback.

## Challenge policy

Challenge only when commitment intent exists and a **material** issue is present: ECA:7 BLOCKED/NOT_READY, ECA:4 blocking need, ECA:5 conflict, target ambiguity, stale recommendation after criterion change. One primary challenge. After explicit acknowledgement, do not repeat unless fingerprint changes.

## Stale confirmation / durability

Pending overlay is session-only. Hard refresh: empty session + Yes = no ECA:8 handoff. Canonical CC:10 pending, if any, remains CC:10’s stale policy (`isPendingDecisionConfirmationStale`).

## Decision / Execution

`canonicalHandoffAllowed` is a judgment flag. Execution writes remain false. Confirming a Decision does not start Execution.

## Acyclic relationship

ECA:1 → 2 → 3 → 4 → 5 → 6 → 7 → **ECA:8**. ECA:8 does not call those judges. Actual Decision mutation remains CC:10R only.
