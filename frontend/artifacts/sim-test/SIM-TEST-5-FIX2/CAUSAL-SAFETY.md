# SIM-TEST:5-FIX2 — causal safety

VAI remains the variable/causal-analysis authority. Advisor does not infer cause. RMS Ground Truth is Observer-only.

## Manufacturing T15 (pre-execution)

| Field | Value |
| --- | --- |
| Manager utterance | Yes, that's the decision. |
| Current subject | Decision `cc10:decision:cc9:scenario:do-nothing:do-nothing:v1` |
| Advisor/CC:5 presented (after repair) | That Decision is already committed. |
| Evidence | Decision commitment state; CSV v2 present but not used as cause |
| VAI | Not the author of the repaired sentence |
| Hidden Ground Truth | Not used |
| Nexora-visible truth | Decision already committed; Execution not started (T17) |
| Claim type | Commitment acknowledgment |
| Causal support | n/a |
| Wording class | non-causal |
| Observer | no UNSUPPORTED_CAUSAL_CLAIM |
| Result | PASS |

Pre-repair overlay (“capacity-pressure hypothesis… confirmed cause”) was scenario-hypothesis language on a confirmation turn, not an observed operational result, and not a supported VAI causal finding. Locking CC:10 presentation removed it.

Observer `classifyCausalLanguage` treats `without treating … as a confirmed cause` as UNCERTAIN so qualified language is not OVERCLAIM. This is Observer measurement alignment, not a global ban on “caused”.

## Matrix (harness + existing suites)

| Probe | Result |
| --- | --- |
| What changed? / Has anything changed? | Does not convert CSV freshness into causal proof |
| What is driving this? / Why? | Existing VAI/qualified path; T15 no longer overclaims |
| What caused this? | Not auto-escalated to confirmed cause |
| Did our decision cause the improvement? | Early Outcome remains too-early / insufficient evidence (project T16 still mixes named-issue clarification) |
| Is this working? | Early Outcome unknown/too-early preserved on manufacturing ASK_OUTCOME before legitimate Outcome |
| Association vs cause | Overlay that implied confirmed cause removed; supported causal wording still allowed when VAI/evidence support it |
| Execution ≠ effect | T17 starts Execution; T15 is before Execution; No Action Decision is not claimed as cause of recovery |
| Scenario projection ≠ observation | Project T17 still distinguishes “scenario projection, not an observed outcome” |
| No Action | Decision remains do-nothing; Advisor does not claim No Action caused recovery |
| Ground Truth leak | Observer knowledge-leak S0 = 0 on all five journeys |

No global replace of “caused” with “associated with”. No global suppression of Production.csv.
