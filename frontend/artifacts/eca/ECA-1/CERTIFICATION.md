# NPA-T ECA:1 — Working Conversation Context

**Status: CERTIFIED**

Certification date: 2026-09-07
Runtime: `http://localhost:3015/executive`

## Verdict

**NPA-T ECA:1 — Working Conversation Context: CERTIFIED**

ECA:1, FIX1, and FIX2 are closed. The A–J matrix is 10/10 PASS, required live runtime proofs pass, focused and milestone tests pass, no blocking product failure remains, and all production quality gates pass. ECA:2 was not started and no ECA:1-FIX3 phase was created.

## Architecture boundary

ECA remains a read-oriented projection over the existing NCA/NCA-POST meaning and conversation authorities, NEX-CONV working context, Stage/Director read context, registered Manager–Object subjects, and Data Reality context. It owns no parallel state, presenter, pipeline, writer, or truth.

FIX1 contributes a session-only mutation proposal. FIX2 binds explicit confirmation to that proposal and hands a confirmed Risk request to `DS-6:1/CanonicalRiskWriter`. ECA does not write Stage, Data Reality, Decisions, Executions, Outcomes, Learning, evidence, memory, or durable business state.

## ECA:1 + FIX status

| Scope | Result | Evidence |
| --- | --- | --- |
| ECA:1 working context | PASS | Explicit meaning, active/recent references, Stage context, Data context, and decision comparison are projected without owning them. |
| FIX1 proposal | PASS | Explicit object mutation creates one session proposal; knowledge, Decision, Execution, and execution-plan turns remain outside it. |
| FIX2 Risk handoff | PASS | Proposal-bound confirmation invokes the canonical Risk writer once; cancellation/stale proposals write nothing. |

## A–J behavioral matrix

| Proof | Result | Evidence |
| --- | --- | --- |
| A Simple Continuity | PASS | Capacity Gap remains the subject for a direct follow-up. |
| B Reference Continuity | PASS | Pronoun evidence follows the conversational reference rather than Stage focus. |
| C Subject Switching | PASS | Demand Surge becomes current while valid recent/comparison references remain available. |
| D Stage Separation | PASS | Previously completed live proof: Executions collection intent and explicit Capacity Gap meaning each win without an unintended business write. Not rerun during this continuation. |
| E Ambiguity | PASS | Previously completed live proof: deterministic latest-reference behavior is preserved; the valid Problems importance ambiguity asks for a bounded criterion without Stage mutation. Not rerun during this continuation. |
| F Knowledge Intent | PASS | Knowledge remains READ and does not create a mutation or navigation write. |
| G Mutation Confirmation | PASS | Live proposal → explicit confirmation → canonical Risk writer → one Risk → proposal cleared; cancellation writes zero. |
| H Data Context | PASS | Fresh live CAP_AV proof recorded below. |
| I Decision Comparison | PASS | Comparison membership and criterion remain derived; no Decision is committed. |
| J Refresh Boundary | PASS | Conversation subject, recent references, and pending proposal clear; canonical Risk and confirmed source-scoped field semantics restore through their own authorities; Stage reconstructs to Overview. |

**A–J total: 10/10 PASS.**

## Runtime H — CAP_AV Data Context

Certified fixture: `test-fixtures/data-ux3/data-ux3-ambiguous.csv` (142 B, 4 rows, 5 columns). The CSV remained `Pending review`; it was never accepted as evidence.

| Manager turn | Advisor result | Authority/safety result |
| --- | --- | --- |
| `What does CAP_AV mean?` | CAP_AV identified in `data-ux3-ambiguous.csv`; candidates `Available Capacity` and `Capacity Availability`; neither confirmed. | Field/source continuity established; source still under review and not accepted evidence. |
| `Is it Capacity Availability?` | `Confirmed for this source: CAP_AV means Capacity Availability.` | Canonical manager semantic-confirmation authority promoted only the source-scoped field meaning. |
| `Is that confirmed?` | CAP_AV meaning and filename repeated; meaning confirmed for this source. | Current field/source referent preserved; CSV still under review and not accepted evidence. |
| `Show me the source.` | `CAP_AV is in data-ux3-ambiguous.csv.` | Provenance continuity preserved. |

Result: **PASS**. UNKNOWN/AMBIGUOUS became manager-confirmed only after the explicit canonical confirmation turn. Source acceptance did not change, and ECA performed no write.

## Refresh and durability matrix

| State | Refresh result | Authority |
| --- | --- | --- |
| Conversation subject | Cleared | NCA:2/session conversation state |
| Recent references | Cleared | NCA/NEX-CONV session state |
| Pending proposal | Cleared | Manager–Object session/ECA projection |
| Confirmed Risk | Restored | DS-6:1 workspace Risk store |
| Confirmed Data semantics | Restored source-scoped | DATA-ADV/Data Reality semantic authority |
| Stage projection | Reconstructed to Overview | Stage/Director authorities |
| Business context | Restored | Existing workspace/BCA authorities |

ECA adds no persistence writer.

## Regression and runner matrix

| Group | Canonical result | Classification |
| --- | --- | --- |
| Conversation / NCA / NCA-POST / Manager–Object / Context / BCA / Stage / Decision Theatre | NXA Level 4 executive omnibus: **1,594/1,594 PASS** | Includes repaired NCA4 advisory precedence, NXA3 Goal-aware guidance, NLU walkthrough classification, Stage comparison precedence, and DTH selected-candidate copy. |
| Stage / Director integration | NOL Director scripts: **331/331 PASS** | Earlier `readdirSync(undefined)` failures were invalid-runner/path-environment results. |
| Director inventory | Canonical Node strip-types runner: **58/58 PASS** | PASS. |
| Data / Workspace | Canonical `test:workspace-data-source-foundation-certification`: **63/63 PASS** | Earlier tsx/Vitest-style aggregate classification did not represent the canonical workspace runner. |
| Decision Theatre comparison | Focused suite: **15/15 PASS** | Selected Demand Surge anchor is named in manager-facing explanation. |
| NCA:4 advisory | Focused suite: **24/24 PASS** | Unsupported strong action is challenged; generic clarification no longer steals the turn. |
| ECA + Risk Writer / Handoff | Final combined verification: **47/47 PASS** | Includes focused ECA, canonical Risk store/writer, and proposal-bound handoff. |
| NXA funnel Level 1 | PASS, 0 failed | Focused. |
| NXA funnel Level 2 | PASS, 0 failed | Owning layer. |
| NXA funnel Level 3 | PASS, 0 failed | Integration. |
| NXA funnel Level 4 | **7/7 required tasks PASS** | Milestone run used supported `EXECUTIVE_URL=http://localhost:3015/executive`; no running, failed, uninspected, or skipped required task. |

The first Level 4 attempt passed its six non-live tasks but its live smoke defaulted to inactive port 3000. It was classified ENVIRONMENT, then rerun through the supported URL override against the required single runtime on port 3015; the complete canonical funnel passed.

## Quality gates

| Gate | Result |
| --- | --- |
| TypeScript (`NODE_OPTIONS=--max-old-space-size=8192 npm run typecheck`) | PASS |
| Touched-file ESLint | PASS |
| Repository ESLint | PASS with zero errors; 501 existing warnings are non-blocking debt |
| Production build (`NODE_OPTIONS=--max-old-space-size=8192 npm run build`) | PASS |
| `git diff --check` | PASS, exit 0 |
| NXA milestone certification | PASS, exit 0 |

## Closed failure inventory

- NCA:4 strong-action advice: fixed at response-ownership precedence; no test weakening.
- Decision Theatre selected-candidate explanation: fixed by naming the authoritative investigation anchor in deictic copy.
- NXA3 Goal awareness: Goal state was present; contextual guide now includes the authoritative Goal when available.
- Execution-plan/ECA collision: execution-plan changes are excluded from the generic object-mutation proposal recognizer.
- NLU causal walkthrough: `walk me through` causal questions are no longer downgraded to relevance/attention.
- React callback lint error: dependency list now includes the directly read replacement-source prop.
- Director and Workspace provisional failures: canonical runners pass; invalid-runner/environment results are not product failures.

## Known non-blocking debt

- Repository ESLint reports 501 warnings but zero errors. No broad warning cleanup was included in this closure.
- `baseline-browser-mapping` reports stale compatibility metadata during build; build output is successful.

## Final totals

- A–J: **10/10 PASS**
- Runtime H: **PASS**
- ECA + canonical Risk verification: **47/47 PASS**
- Director integration: **331/331 PASS**
- Workspace canonical runner: **63/63 PASS**
- NXA Level 4 executive omnibus: **1,594/1,594 PASS**
- NXA Level 4 required tasks: **7/7 PASS**
- ECA-introduced regressions: **0 open**
- Blocking product failures: **0**

No ECA:2 work was started.
