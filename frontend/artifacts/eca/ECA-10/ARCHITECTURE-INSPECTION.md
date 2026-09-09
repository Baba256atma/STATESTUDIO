# NPA-T ECA:10 — Architecture Inspection

Date: 2026-09-08

## Stop condition

ECA:10 may be certified only when a read-only live-Execution and deviation judgment consumes canonical CC:11 Execution plus ECA:1–9; never writes Execution/Risk/Outcome/Learning/Stage; never invents on-track/off-track without a valid baseline; never becomes a second DTH:10, ECA:3, or monitoring daemon; and passes focused A–T, sequences 1–8, seven live `/executive` proofs, NXA Level 4, TypeScript, ESLint, production build, and `git diff --check`.

## Exact canonical Execution truth and mutation authority

**Truth:** `NexoraCanonicalExecution` via `createNexoraCanonicalExecutionRuntime` (`executiveExecutionRuntimeAdapter.ts`).

**Mutation:** `createExecution` / `transitionExecution` only. Conversation façade: `CC:11/ExecutionFollowUp`.

Live statuses used by DTH:10: `in-progress | blocked | at-risk | completed`. `planned` / `ready` remain ECA:9 / DTH:9.

CC:11 start may legally create if none exists. That is not an ECA:10 concern except that live mode still requires a **live** status after start, not merely a created `planned` record.

There is **no** `setProgress` / `addBlocker` API on the adapter. Manager “set progress / add blocker” is mutation intent; ECA:10 hands off conceptually to CC:11 and writes nothing. If the writer cannot apply that field, ECA:10 states the boundary rather than inventing a writer.

## DTH:10 / DTH:11 / DTH:12

- **DTH:10** Live Execution Theatre. Presentation only. Does not fabricate progress. Missing progress ≠ 0%.
- **DTH:11** Outcome Observation. Execution complete ≠ Outcome.
- **DTH:12** Learning / Reassessment. ECA:10 may suggest reassessment; it does not write Learning or Decision.

## Blocker / Risk / progress / milestone authority

All are fields on the canonical Execution record (`blockers`, `risks`, `progress?`, `milestones`). Risk objects elsewhere remain the Risk writer. ECA:10 must not convert Risk ↔ blocker.

**Progress authority:** optional `progress` on the Execution record. Absence is unknown, not 0%.

**Baseline authority:** none on the canonical record. Milestone `deadline` exists but is not a planned-progress baseline. ECA:10 must not invent expected %. Track status is **UNKNOWN** unless an explicit expected-progress reference is supplied by a future canonical field or a test fixture. Session last-observation supports “what changed,” not “on track.”

**Deviation primitive:** none in repository. ECA:10 introduces a **read-only conversational judgment**, not a store.

## NCA / NXA live language

CC:11 follow-up already maps “how is it going / on track / show progress / blockers / owner.” ECA:2 `REVIEW_EXECUTION` / `REQUEST_EXECUTION_ACTION`. ECA:10 adds live interpretation and deviation discipline; it does not replace those parsers.

## What ECA:10 uniquely adds

Live-mode gate, track-status safety (no fake on-track), change vs plan distinction, one primary attention item, blocker/Risk separation in manager language, completion ≠ Outcome, session-only acknowledgement suppression.

## How duplicate engines are avoided

Judge after ECA:9. Overlay speech only on live-relevant turns. No timers, polling, or stores. ECA:3 remains initiative: ECA:10 does **not** call ECA:3. Certified order stays ECA:3 → … → ECA:9 → ECA:10. Initiative may consume ECA:10 on a **later** turn. Acyclic.

## Live-mode gate

`NOT_LIVE` unless Execution status is `in-progress | blocked | at-risk | completed`. Decision-only or `planned`/`ready` stays ECA:9.

## Session / refresh

Session overlay: last execution id, last observed progress, last blocker fingerprint, acknowledged attention id. Refresh clears overlay; canonical Execution remains. Do not reconstruct fake historical deviation.

## CAP_AV / Data

Unconfirmed CAP_AV cannot ground capacity delay or off-track claims.
