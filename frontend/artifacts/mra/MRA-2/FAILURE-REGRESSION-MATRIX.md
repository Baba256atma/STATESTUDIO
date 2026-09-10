# MRA:2 — Failure Regression Matrix

Date: 2026-09-09

Source: MRA:1 `FAILURE-MAP.md` (unchanged) vs MRA:2 `runtime-turns.json` (33 journeys, 150 turns) and `mra2ManagerReadiness.runtime.test.ts`.

Status keys: **Closed** (S1/S2 behavior restored on the shared path) · **Partial** · **Deferred** (later architectural phase required) · **Open**.

| MRA:1 ID | Sev | Cluster | Previous | New (MRA:2 corpus) | Owning fix | Regression |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | S1 | C7 | Approve applied then later “no committed Decision” | Approve `applied`, canonical approved=1; `start it` starts Execution (canonical executions=1) | Thread Decision/Execution runtime | Closed |
| 002 | S1 | C7 | Explicit Approve skips ECA:8 challenge | Still `EXPLICIT_COMMITMENT`, confirmation not required | None — CC:10 policy | **Deferred** |
| 003 | S1 | C3 | Unknown Problem empties collection | “I don't see that Problem. Current Problems are Capacity Gap, Margin Pressure.” | POST:3 unknown member | Closed |
| 004 | S1 | C8 | delete → add “Margin” | REMOVE; refuse delete; not add | ECA:1 typed operation | Closed |
| 005 | S1 | C2 | SHOW Stage → object clarification | After Focus on Risk: Stage membership (Risk focused + visible actors) | WORKSPACE_STATE + skip 6.3 | Closed |
| 006 | S1 | C3 | Count grammar unknown | `Current Problems: … There are 2 Problems.` | POST:2 count | Closed |
| 007 | S1 | C1 | `and the other one?` → Outcome questionnaire | Margin Pressure explanation | 6.2 other-referent + CC ordinal | Closed |
| 008 | S1 | C1 | `investigate it` after Demand Surge → “Which item?” | Still “Which item do you mean?” | Incomplete: knowledge turn does not commit Stage/MO target | **Deferred** |
| 009 | S1 | C4/C1 | first problem → architecture leak / miss | “The first Problem is Capacity Gap.” | Ordinal member + leak strip | Closed |
| 010 | S1 | C6 | CSV support Capacity Gap → Problem investigation | Data relationship, not cause | DATA-ADV evidence-relevance | Closed |
| 011 | S1 | C6 | Field follow-ups → Outcome / which item | Unresolved fields on current source | DATA-ADV follow-up | Closed |
| 012 | S1 | C3 | Goals/KPI/Evidence/Outcomes/Data Objects wrong | Goals honest empty. KPI/Evidence still mis-kinded vs catalog | POST:3 kinds partial | **Partial / Deferred** |
| 013 | S1 | C5 | unnamed temporary capacity as standing rec | Advisory suggestion, not a catalog Scenario; leftover rec cleared on SHOW | NCA:4 identity + restoreTruth | Partial (identity closed; option still advisory) |
| 014 | S2 | C1 | Scenario A/B unmatched | Still no letter alias | Not in this repair | Open S2 |
| 015 | S2 | C1 | Correction to execution mixed | Not re-certified as closed | — | Open S2 |
| 016 | S2 | C2 | `explian it` UNKNOWN | CC:1 still recovers `explain` on DATA path; business `explian it` not re-proven | — | Open S2 |
| 017 | S2 | C3 | `now risks` unknown | Interpreter maps `now risks` → RISK | POST:2 | Closed (interpreter); live copy not separately scored |
| 018 | S2 | C1 | `explain it` after SHOW Problems → Margin Pressure | Not fully re-proven | — | Open S2 |
| 019 | S2 | C8 | Add this as Risk copies “this” | Deictic resolves to active subject in ECA:1 | C8 | Closed in focused tests |
| 021 | S2 | C5 | SHOW leftover rec | SHOW does not re-attach leftover rec | C5 | Closed in focused tests |
| 031 | S1 | C7 | Decision/Stage count split | Canonical Decision exists after Approve when runtime is threaded | C7 | Closed for canonical parity |
| 032 | S1 | C5 | leftover recommendation overlay | SHOW/list suppress leftover | C5 | Closed on SHOW path |

## S1 before / after

MRA:1: S0=0, **S1=15**, S2=14, S3=3.

MRA:2 S1: **11 closed**, **1 partial (013)**, **3 deferred (002, 008, 012 remainder)**. No new S0. Severity was not downgraded to obtain certification.

## Deferred S1 (required fields)

### MRA-1-002

- **Reason:** CC:10 treats explicit Approve as `confirmation-not-required`. ECA:8 does not block. Changing this is a Decision-confirmation policy change, not a routing bug.
- **Owner:** CC:10 `executiveDecisionCommitmentPolicy` + ECA:8 overlay.
- **Risk:** Managers can commit with incomplete evidence.
- **Future phase:** MRA:3 or a named CC:10 confirmation-policy milestone. Not silently “fixed” in MRA:2.

### MRA-1-008

- **Reason:** `now tell me about Demand Surge` is knowledge (`shouldCommitRuntime=false`), so MO/Stage focus can remain on Capacity Gap. `investigate it` still asks which item. Binding `it` to an uncommitted knowledge subject would change the certified knowledge-vs-navigation contract.
- **Owner:** CC:1/2 + MO:1 session vs knowledge-no-commit.
- **Risk:** Investigation of the wrong object if we auto-focus on every named mention.
- **Future phase:** MRA:3 reference handoff for knowledge-without-Stage-commit.

### MRA-1-012 (KPI / Evidence / Outcomes / Data Objects remainder)

- **Reason:** Default catalog has no first-class KPI/Evidence/Outcome/Data Object collections. Evidence queries still collide with Execution/KPI presentation. Goals empty is catalog-true.
- **Owner:** NCA-POST:3 membership vs NEX-MVP catalog kinds.
- **Risk:** Inventing KPI objects would violate one-authority and catalog truth.
- **Future phase:** Catalog/collection kind milestone, not phrase patches.
