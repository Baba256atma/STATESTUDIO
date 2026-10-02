# NPA-T SIM-TEST:9-FIX1 — Context-Safe Decision → Execution Handoff

## A. Status

**CERTIFIED.** This certification is limited to the known SIM-TEST:9 Decision → Execution handoff S1. It does not certify or resume the full SIM-TEST:9 population.

## B. Root cause

The first divergent production layer was CC:5 in `conversationalExperienceOrchestrator.ts`. Both execution-request paths selected the first globally Approved Decision and passed its ID to CC:11 without proving that it was the manager's current execution referent. CC:11 correctly executed the Decision ID it received; it was not the source of the cross-thread binding.

## C. Production repair

CC:5 now resolves execution commands through one pure selector over existing canonical Decision, executive-context, and Scenario-session authorities.

- Explicit Decision references resolve only when an Approved Decision identity/title match is unique.
- Deictic commands use the canonical context established before the execution turn.
- An active Decision must match by exact Decision ID.
- An active Scenario may select only a Decision that is the Scenario's primary canonical subject.
- An active business subject may select only a unique Decision whose primary subject or Decision title identifies that context.
- Zero or multiple candidates produce clarification and no CC:11 write.
- Generic related/evidence subjects are not execution authorization.
- Existing CC:11 eligibility and duplicate-Execution protection remain authoritative.

`executiveExecutionFollowUp.ts` recognizes the required bounded execution vocabulary without classifying ordinary deictics or reassessment language as execution.

New authority: **none**.

## D. Original S1 replay

- Original immutable evidence: `fnv1a32:61197640`, 8 turns, deterministic replay match.
- Pre-FIX: the Capacity Decision incorrectly produced `execution-cc10:decision:cc9:scenario:do-nothing:do-nothing:v1` after the manager switched to Delivery.
- Post-FIX deterministic signature: `fnv1a32:c5462932` = `fnv1a32:c5462932`.
- Post-FIX canonical subject / L1 / Stage / Advisor: `obj-delivery` / `obj-delivery` / `obj-delivery` / `obj-delivery`.
- Decision ledger: the one approved Capacity Decision remains present and unchanged.
- Execution ledger: no Execution ID; count remains 0.
- Response: `Which approved Decision do you want to start?`

The original evidence remains separately preserved under `SIM-TEST-9/`; the repaired replay is in `post-fix-blocker-replay.json`.

## E. Focused tests

- T1–T16: **16 passed, 0 failed**.
- Supporting micro-funnel and vocabulary tests: **2 passed, 0 failed**.
- Immutable pre-FIX evidence check: **1 passed, 0 failed**.

## F. Multi-Decision micro-funnel

Three Approved Decisions were present: Capacity D1, Delivery D2, and Margin/Revenue D3. The manager switched to Delivery and started D2, switched to Revenue and started D3, then explicitly returned to Capacity context and started D1. Correct Decision → Execution links: 3. Wrong executions: 0. Clarifications: 0.

## G. Decision / Execution integrity

- Wrong Decision binding: 0.
- Wrong Execution: 0.
- Duplicate Execution: 0.
- Premature Execution: 0.
- Decision mutation during the blocker command: 0.
- Silent Decision replacement: 0.

## H. Regression

The directly affected suite passed **115/115**: CC:5/CC:11 execution follow-up, Decision commitment, Decision FIX15, FIX18 referent regressions, SIM-TEST:8-FIX1 reassessment, FIX16 named/historical returns, named-issue/active-Execution behavior, lifecycle integration, FIX1 T1–T16, micro-funnel, vocabulary, and immutable original evidence.

The test funnel passed Level 1 (Focused), Level 2 (Layer), and Level 3 (Integration), each with 0 failures and no unresolved required tasks. Level 4 and the full SIM-TEST:9 population were not run.

## I. Remaining findings

- Original SIM-TEST:9 S2 Scenario-set confusion remains preserved and was not repaired.
- Known NPS S3 Capacity-label debt remains outside FIX1.
- Known Advisor Delivery/Capacity debt remains outside FIX1.
- No new independent S1 was found.

## J. Architecture integrity

No second Decision authority, Execution authority, context authority, referent engine, management-thread store, conversation authority, NMI, Stage, Advisor, or Object authority was introduced. Ground Truth was not consulted for execution selection.

NPA-T SIM-TEST:9-FIX1 — CERTIFIED
