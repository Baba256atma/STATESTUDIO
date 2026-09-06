# NPA-T ECA:1 — Working Conversation Context

**Status: NOT CERTIFIED**

## Current-state matrix

| Capability | Status | Evidence |
| --- | --- | --- |
| Working context | PASS | Immutable ECA projection and diagnostics. |
| Reference continuity | PASS | A-J focused tests and existing NCA/NEX-CONV coverage. |
| Stage/context separation | PASS | Focused tests; broader live Stage sequence not completed in this run. |
| Ambiguity handling | PASS | Explicit bounded candidates and clarification tests. |
| Knowledge intent | PASS | Explanation remains READ; NCA-POST:3 capability regression restored. |
| Mutation proposal | PASS | FIX1 proposal projection and live proposal response. |
| Confirmation binding | PASS | FIX2 session proposal slot and proposal-ID-bound handoff. |
| Canonical Risk handoff | PASS | DS-6:1 Canonical Risk Writer certified in FIX2. |
| Data context | PASS in focused projection tests | Required live CSV sequence not completed. |
| Decision comparison | PASS | Existing comparison context is projected without commitment. |
| Refresh/session boundary | PASS for session reset | Durable-authority reconstruction not fully rerun here. |
| Runtime proof | PARTIAL | Risk flow proven; required Stage, ambiguity, and data runtime sequences remain incomplete. |
| Regression gates | NOT CERTIFIED | Known non-ECA failures remain. |

## Architecture and authority boundaries

ECA is a read-oriented projection over NCA/NCA-POST meaning and references, NCA:2 session state, NEX-CONV working context, NXA Stage read context, Manager-Object subjects, and optional Data Reality context. It does not own Stage, Data Reality, business truth, Decision, Execution, Outcome, Learning, or durable memory.

FIX1 adds proposal recognition and session-only proposal state. FIX2 adds `DS-6:1/CanonicalRiskWriter` and the ECA handoff adapter. Risk persistence remains owned by `workspaceRiskContract.ts`; ECA never writes Risk records directly. Decision and Execution confirmations remain on their existing authorities.

## A-J behavioral matrix

| Proof | Result | Evidence |
| --- | --- | --- |
| A Simple Continuity | PASS | Focused test: Capacity Gap survives `Why is it important?`. |
| B Reference Continuity | PASS | Pronoun evidence follows recent subject instead of Stage focus; `Why?` continuity covered. |
| C Subject Switching | PASS | Demand Surge becomes current; prior reference and comparison IDs remain available. |
| D Stage Separation | PASS automated / NOT RUN live | Collection query does not inherit focused object; reverse explicit meaning wins. |
| E Ambiguity | PASS automated / NOT RUN live | Explicit candidate clarification is bounded; live ambiguity resolution was not completed. |
| F Knowledge Intent | PASS | Knowledge remains READ and the NCA-POST:3 capability regression is fixed. |
| G Mutation Confirmation | PASS | Proposal -> confirmation -> canonical writer; cancellation produces zero writes. |
| H Data Context | PASS automated / NOT RUN live | Candidate status/provenance preserved in projection tests; live CSV sequence remains incomplete. |
| I Decision Comparison | PASS | Existing comparison context and criterion are projected without Decision commitment. |
| J Refresh Boundary | PASS partial | Browser refresh clears session chat context; durable Risk authority is local-storage-backed. Full two-sided runtime proof remains incomplete. |

## Focused test evidence

- ECA working context, mutation proposal, handoff, and direct runtime tests: **34 passed / 0 failed**.
- Canonical Risk writer and handoff validation: **21 passed / 0 failed**.
- Writer + ECA + conversation integration: **57 passed / 0 failed**.
- NXA funnel level 1: **passed / 0 failed**.

## Regression matrix

| Suite | Result | Classification |
| --- | --- | --- |
| Conversation/NCA/NEX-CONV group | 362 passed / 2 failed of 364 | NCA:4 M is PRE_EXISTING. NCA-POST:3 capability failure was INTRODUCED_BY_ECA and fixed; its targeted rerun passes. |
| BCA/Stage/Director/manager context | 284 passed / 9 failed of 293 | PRE_EXISTING/ENVIRONMENT path-resolution failures in Director tests; no ECA stack involvement observed. |
| Data Reality/data-source/workspace | 1,373 passed / 9 failed of 1,382 | PRE_EXISTING/REAL_UNRELATED_REGRESSION workspace presentation/runtime failures; no ECA stack involvement observed. |
| Decision Theatre/lifecycle | 345 passed / 1 failed of 346 | PRE_EXISTING DTH comparison test K; no ECA stack involvement observed. |
| Focused DTH sub-gate | NOT RUN | Tool call was skipped; no PASS claimed. |

### Conversation failure details

- `nexoraNca4AdvisoryIntelligence.test.ts` M: expected unsupported strong-action caution, received an existing comparison clarification. This failure predates ECA and does not import or execute ECA code.
- The initially failing NCA-POST:3 “answers product capability honestly” test was caused by broad ECA ADD recognition (`Add a Risk object.`). ECA was narrowed to require resolvable target semantics; targeted rerun passes. This was an ECA regression and is closed.

## Runtime matrix

Runtime URL: `http://localhost:3000/executive`.

| Sequence | Result | Evidence |
| --- | --- | --- |
| 1 Continuity | PASS | Earlier live session: Capacity Gap -> `Why is it important?` retained subject and Stage. |
| 2 Subject switch | PASS | Earlier live session: Capacity Gap -> Demand Surge; Stage did not hijack context. |
| 3 Stage separation | NOT RUN | Attempted after reload, but shared page interaction became stale before submission. |
| 4 Ambiguity | NOT RUN | No live bounded-ambiguity session captured in this closure run. |
| 5 Mutation | PASS | Live proposal and `Add it.` produced canonical success; cancellation is covered by direct runtime test. |
| 6 Data | NOT RUN | No live CSV source sequence captured in this closure run. |

## Refresh and durability

| Context/state | Survives refresh? | Authority |
| --- | --- | --- |
| Conversation subject | No, session reset observed | NCA:2 / existing conversation session |
| Recent references | No, session reset observed | NCA/NEX-CONV session state |
| Pending proposal | No, session-scoped | ManagerObject session / ECA proposal projection |
| Confirmed Risk | Yes, through existing persistence | DS-6:1 Risk store |
| Confirmed Data semantics | Existing authority-dependent; not fully rerun here | DATA-ADV/Data Reality |
| Stage projection | Existing runtime/local state behavior | Stage/Director authorities |
| Business context | Existing workspace authority behavior | BCA/workspace authorities |

ECA adds no durable persistence writer.

## Production quality

- TypeScript: passed with `NODE_OPTIONS=--max-old-space-size=8192`.
- Touched-file ESLint: passed.
- Production build: passed with `NODE_OPTIONS=--max-old-space-size=8192 npm run build`.
- `git diff --check`: reports pre-existing trailing whitespace in `frontend/app/lib/nexora-certification/nxaTestFunnel.ts`, outside ECA changes.

## Exact certification blockers

1. Required live runtime sequences 3, 4, and 6 were not completed and therefore cannot be marked PASS.
2. The DTH focused sub-gate was skipped in this run.
3. Relevant repository regression groups still contain known failures, including the pre-existing NCA:4, Director, workspace, and DTH failures.

Do not start ECA:2. Do not create ECA:1-FIX3 automatically.

## Architecture

ECA remains a read-oriented projection. It consumes NCA canonical meaning and conversation state, NEX-CONV working context, NXA Stage read context, registered Manager-Object subjects, and optional Data Reality context. It does not own Stage, business truth, Data Reality, Decisions, Executions, Outcomes, Learning, durable memory, or manager-confirmed writers.

The existing authorities remain in place:

- NCA:1-7 and NCA-POST own meaning, speech acts, references, ambiguity, pending questions, and collection semantics.
- NEX-CONV:1/2 own conversation progression and thread projections.
- NXA:5-FIX4, Director, and Decision Theatre own Stage/presentation read models and writers.
- Data Reality/DATA-ADV own evidence, source, field semantics, and advisory truth.
- Existing object-approval and domain runtimes own confirmed mutations.
- NCA:2 and existing entrance continuity own session-scoped conversation state; APP-4 owns durable memory.

No duplicate conversation state machine or mutation writer was introduced.

## Behavioral proof

| Proof | Status | Evidence |
| --- | --- | --- |
| A Simple Continuity | PASS | ECA focused suite, individually named test. |
| B Pronoun Continuity | PASS | Explicit recent subject outranks Stage focus for evidence follow-up. |
| C Subject Switch | PASS | Recent references and existing comparison context remain available. |
| D Stage Separation | PASS | Collection questions do not inherit focused object; reverse explicit subject wins. |
| E Ambiguity | PASS | Explicit candidates produce bounded clarification options. |
| F Knowledge Intent | PASS | Explanation remains READ and does not propose navigation. |
| G Mutation Confirmation | PARTIAL | Projection creates an unexecuted proposal, but live `/executive` has no conversational proposal/confirmation route to the canonical object-approval writer. |
| H Data Context | PASS | Source, field, candidate semantic status, and evidence refs remain unchanged. |
| I Decision Comparison | PASS | Existing comparison candidate IDs/criterion are projected without commitment. |
| J Refresh Boundary | PASS | Browser reload cleared chat/session context and preserved existing overview state. |

Additional WHO -> WHAT -> WHERE -> HOW -> WHY -> NOW -> NEXT diagnostics pass; unknown WHY remains `null` rather than being fabricated.

## Regression gates

| Gate | Result |
| --- | --- |
| ECA focused tests | 18 passed / 0 failed |
| Conversation/NCA group | 428 passed / 1 failed; existing NCA:4 advisory test M, unrelated to ECA |
| BCA/Stage/Director/manager context | 284 passed / 9 failed; Director path-resolution failures, unrelated to ECA |
| Data Reality/data-source/workspace group | 1,373 passed / 9 failed; existing workspace suite failures, unrelated to ECA |
| Decision Theatre/lifecycle group | 345 passed / 1 failed; existing Decision Theatre comparison test K, unrelated to ECA |
| NXA funnel level 1 | Passed, 0 failed |

The zero-failure rule prevents certification while these known relevant regression failures remain unresolved, even though their observed failures are outside the ECA files.

## Runtime proof

Runtime URL: `http://localhost:3000/executive`.

- Sequence 1 continuity: PASS for `Explain Capacity Gap.` followed by `Why is it important?`; manager-facing response remained grounded in Capacity Gap and Stage stayed Overview.
- Sequence 2 subject switch: PASS for `Now tell me about Demand Surge.`; context changed to Demand Surge without Stage mutation. `Compare them.` correctly refused to invent a comparison because fewer than two evaluated scenarios were available.
- Sequence 3 Stage separation: NOT RUN in this session.
- Sequence 4 ambiguity: NOT RUN in this session.
- Sequence 5 proposed change: BLOCKED. `Add Supplier Delay as a Risk.` produced the existing generic unsupported-context response rather than a bounded ECA proposal. No object or Stage write occurred. The existing manual object-approval writer is a separate UI path.
- Sequence 6 data: NOT RUN in this session.

## Refresh and durability

- Session-only: chat transcript, active conversational subject, and comparison working context disappear on refresh because existing NCA/entrance continuity is session-scoped and ECA adds no persistence.
- Durable state: existing workspace/data state remains available after refresh through its existing local storage/runtime authorities. ECA is not the writer and does not claim ownership of that durability.

## Build quality

- TypeScript: passed with `NODE_OPTIONS=--max-old-space-size=8192`.
- Touched-file ESLint: passed.
- Production build: passed with `NODE_OPTIONS=--max-old-space-size=8192 npm run build` after the latest projection edits.
- `git diff --check`: blocked by pre-existing trailing whitespace in `frontend/app/lib/nexora-certification/nxaTestFunnel.ts`, outside ECA changes.

## Certification blockers

1. The live `/executive` path does not surface ECA's bounded mutation proposal or route explicit confirmation through the existing canonical object-approval writer.
2. Required regression groups contain known failures listed above.
3. Required runtime sequences 3, 4, and 6 were not completed in this run.

Do not start ECA:2.