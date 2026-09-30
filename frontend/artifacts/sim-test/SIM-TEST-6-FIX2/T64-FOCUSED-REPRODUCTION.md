# T64 focused reproduction

## Signatures

- Pre-FIX2 manufacturing long: `fnv1a32:d7f9bf97`
- Post-FIX2 manufacturing long: `fnv1a32:3a9632c8`
- Focused T64 pre-FIX: `fnv1a32:430a0900` (S1 = T64 `ADVISOR_DIVERGENCE`)
- Focused T64 post-FIX: `fnv1a32:93db97f1` (S1 = 0)

## Required prior state

T1–T59 of `sim-test-6-manufacturing-long` are required so T64 inherits:

- Capacity Gap Decision/Execution already committed
- FIX1-cleared comparison/clarification around T48–T50
- subject switches through Inventory, Delivery, Customer, Demand
- T60 return to Delivery
- STAGE_FOCUSED / STAGE_VISIBLE_OTHER / MLEVEL_L2 / MLEVEL_L3 interactions before the deictic question

T56–T63 are the minimum window that still carries that lifecycle; the harness prefix uses turns 1–68 so T64 is reached with the same history.

## T64 pre-FIX

- Manager utterance: What is the problem here?
- Canonical subject: `obj-delivery`
- Canonical referent: Delivery
- NMI: not populated in the observation slice
- Advisor input (6.1): no objectReference after alias skip; 6.2 typed-reference still selected `ctx-problem-capacity`
- Advisor selected context: `ctx-problem-capacity` / Capacity Gap
- Advisor response: `I couldn't find a clear match for “Problem Here” in the current executive context.`
- First divergence: FINAL:6.2 `typed-reference` treated locative “the problem here” as a Problem-kind lookup instead of the generic current-subject question already used for “What is the problem?”
- Earliest owner: FINAL:6.2 conversation continuity (`genericCurrentProblemQuestion`)
- Repair: locative here/there uses active subject; NCA:2 does not topic-shift; NXA/CC:1/6.1 treat the phrase as deictic
- Result: Advisor `obj-delivery`; no `ADVISOR_DIVERGENCE`; Decision count 1; Execution count 1
