# S1 finding ledger

Original SIM-TEST:4 S1 = 4. All four triaged with evidence after exact INGESTION reruns.

## STRESS-M-25 — Advisor

| Field | Value |
| --- | --- |
| findingId | `sim-test-1:stress-manager-manufacturing-mlevel-stage:cert-0:journey:ADVISOR_DIVERGENCE:25:0` |
| scenario | manufacturing-capacity-pressure |
| journey | stress-manager-manufacturing-mlevel-stage |
| turn / tick | 25 / 7 |
| manager utterance | What is the problem? |
| current canonical subject | obj-delivery |
| expected | Advisor consumes Delivery (current management context), not stale Capacity Gap |
| actual referent (original) | ctx-problem-capacity |
| actual executive / NMI / MLEVEL L1 / Stage | Delivery / (identity follow) / Delivery / Delivery |
| Advisor subject (original) | Capacity Gap |
| earliest owner | CC:7 typed-reference + NXA:1 deictic (Advisor consumed upstream typed problem) |
| root cause | Generic “the problem” ranked last investigation over current object |
| repair | Current-subject typed question; NXA:1 treats “what is the problem?” as current-context deictic |
| final disposition | **REPAIRED_AND_PASS** |
| repaired checkpoint | Advisor = obj-delivery; scene NO_CHANGE; not Capacity Gap |

## STRESS-M-30 — Unknown Supplier

| Field | Value |
| --- | --- |
| findingId | `sim-test-1:stress-manager-manufacturing-mlevel-stage:cert-0:journey:SUBJECT_LOSS:30:1` |
| turn / tick | 30 / 7 |
| manager utterance | Go back to the supplier problem. |
| expected | Acknowledge unknown target; do not invent Supplier; do not select Margin Pressure |
| actual (original) | Focused ctx-problem-margin |
| earliest owner | CC:5 + FINAL:6.1/6.2/6.3 (named return unresolved then NLU/FOCUS fallthrough) |
| root cause | Unresolved named return used NLU kind/fuzzy `problem` and skipped clarification |
| repair | Kind-token not used for fuzzy identity; named-return unresolved blocks FOCUS rewrite and topic-switch fallthrough; clarification gate MISSING_SUBJECT |
| final disposition | **REPAIRED_AND_PASS** |
| repaired checkpoint | Stay obj-delivery; clarification-required; “Which one do you want me to look at?”; not Margin Pressure |

## STRESS-P-5 — Resources

| Field | Value |
| --- | --- |
| findingId | `sim-test-1:stress-manager-project-mlevel-stage:cert-1:journey:WRONG_REFERENT:5:0` |
| turn / tick | 5 / 5 |
| manager utterance | What about resources? |
| current canonical subject | obj-delivery |
| catalog candidates | revenue, capacity, budget, customer, delivery, risk, inventory, demand, Capacity Gap, Margin Pressure — **no Resource Object** |
| expected | Do not silently treat Delivery as a successful Resource switch; clarify or unknown |
| actual (original) | Remained Delivery as if named switch succeeded |
| earliest owner | REFERENT / CC:5 topic-switch fallthrough |
| root cause | Named `what about X` with no identity candidate still presented current primary |
| repair | `what about` named target uses previous-referent; unresolved → clarification; no fabricated Resource |
| final disposition | **REPAIRED_AND_PASS** (legitimate clarification; INFORMATION_BOUNDARY for missing Resource Object) |
| repaired checkpoint | obj-delivery preserved; clarification-required; scene NO_CHANGE |

## STRESS-P-10 — Schedule

| Field | Value |
| --- | --- |
| findingId | `sim-test-1:stress-manager-project-mlevel-stage:cert-1:journey:WRONG_REFERENT:10:1` |
| turn / tick | 10 / 5 |
| manager utterance | What about the schedule? |
| catalog | **no Schedule Object** |
| earliest owner | Same seam as Resources |
| repair | Same named-target unresolved path |
| final disposition | **REPAIRED_AND_PASS** (legitimate clarification; no fabricated Schedule) |
| repaired checkpoint | obj-delivery preserved; clarification-required |

No TEST_EXPECTATION_ERROR: the Observer was right that silent Delivery retain after an explicit named target is a product defect. The missing catalog Objects are an information boundary, not a license to invent subjects.
