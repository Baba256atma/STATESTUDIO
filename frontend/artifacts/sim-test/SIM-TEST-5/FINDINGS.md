# SIM-TEST:5 findings

S0 = 0. Material S1 = 15 across five journeys. Harness failures = 0.

## Blocking (primary)

### ST5-S1-01 MISSING_DECISION

- Scenario: manufacturing-capacity-pressure INGESTION
- Turn / tick: 13 / 7
- Utterance: “Let's go with option B.”
- Canonical IDs: Decision = none; Execution = none
- Data version: ERP/Production/Inventory/Maintenance v2
- Hidden Ground Truth: Observer-only variables; not used in the reply
- Nexora-visible: `decisionStatus=clarification-required`; npsPath `AWAITING_COMMITMENT`
- Reproduction: `fnv1a32:b92137ed` journey `sim-test-5-manufacturing-lifecycle`
- Earliest owner: CC5_CONVERSATION
- Evidence: CC:10 asked which option; subsequent “Yes, make that the decision.” became Capacity Gap vs Capacity clarification. No Approved record in `listDecisions()`.

### ST5-S1-02 REPEATED_CLARIFICATION

- Turn / tick: 14 / 7
- Reproduction: same manufacturing signature
- Earliest owner: CC5_CONVERSATION
- Evidence: “Which do you mean, the Capacity Gap problem or the Capacity?” after commitment confirmation.

### ST5-S1-03 / ST5-S1-04 REPEATED_CLARIFICATION

- Turns 28 and 31 (tick 21)
- Earliest owner: CC5_CONVERSATION
- Evidence: unresolved “which issue” / supplier recovery after subject switches.

### ST5-S1-05 ADVISOR_DIVERGENCE

- Turn / tick: 38 / 21
- Utterance: unsupported teleport
- Earliest owner: ADVISOR
- Evidence: Advisor referent Inventory vs conversation Capacity. Product refused the unsupported action (no fabricated operational change).

## Secondary journeys (same commitment seam)

| ID | Journey | Turn | Type | Owner |
| --- | --- | --- | --- | --- |
| ST5-S1-06 | project | 9 | MISSING_DECISION | CC5_CONVERSATION |
| ST5-S1-07 | project | 11 | REPEATED_CLARIFICATION | CC5_CONVERSATION |
| ST5-S1-08 | logistics | 7 | MISSING_DECISION | CC5_CONVERSATION |
| ST5-S1-09 | logistics | 9 | REPEATED_CLARIFICATION | CC5_CONVERSATION |
| ST5-S1-10 | logistics | 4 | EVIDENCE_MISMATCH | ADVISOR |
| ST5-S1-11 | service | 7 | MISSING_DECISION | CC5_CONVERSATION |
| ST5-S1-12 | service | 9 | REPEATED_CLARIFICATION | CC5_CONVERSATION |
| ST5-S1-13 | service | 4 | EVIDENCE_MISMATCH | ADVISOR |
| ST5-S1-14 | FAST | 7 | MISSING_DECISION | CC5_CONVERSATION |
| ST5-S1-15 | FAST | 9 | REPEATED_CLARIFICATION | CC5_CONVERSATION |

ST5-S1-10/13: Advisor cited Production.csv outside that scenario’s ingested files. Not Ground Truth leak.

## Non-findings (held)

- Execute before Decision refused.
- Execution start did not become Outcome success (`TOO_EARLY` / insufficient evidence).
- NPS Learning durable write remained false.
- Unsupported teleport: “I can't do that from this workspace.”
- No GROUND_TRUTH_LEAK S0.
- No harness authority bypass.
