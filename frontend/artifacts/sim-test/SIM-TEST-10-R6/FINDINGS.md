# SIM-TEST:10-R6 findings

## Product

- S1 = 0.
- S2 (blocking): Learning-informed reassessment does not carry canonical continuity into subsequent Scenario/Decision work. Family L consumes CORE-OUT:2 on reassessment (`consumedSupportedLearning=true`, `coreOut2LearningIds` present, `reassessFocused=obj-capacity`). Later `Options.` / `Go with A.` / D2 Investigate Capacity exist, but Decision/Scenario ledgers do not carry Learning identity. D2 is temporal-only. ECA session `lastLearningNote` survives those later turns (level-3-ish session residue) and is **not** treated as Learning-informed Decision linkage.
- S3: Family J still asks “Which item do you mean?” while also overlaying the CORE-OUT:2 Learning statement (clarification safety preserved; wording overlay). NPS PARTIAL/BOUNDED vs CORE-OUT not-met remains known Advisor/NPS debt.

## Correct safety

- Learning → Reassessment recertified at population scale: 5 reassessment asks, 5 `consumedSupportedLearning=true`, 5 with `coreOut2LearningIds`, wrong-subject consumption = 0.
- Family J clarification retained (does not guess a named subject).
- Family K consumes Learning on `What should we reconsider?` and then stops (no unauthorized Decision/Execution).
- Family L D2 is classified temporal-only, not Learning-informed.
- Delivery RDI observedDirection null on Family H; no Capacity Learning injected into Delivery.
- `establishesCausation=false` on all 40 inspections.
- Ground Truth leaks = 0.
- Family A upstream control unchanged: baseline ≈ 90.91, actual 100, RDI increase, expectedDirection maintain, comparison-ready, not-met, supported Learning.

## Coverage / continuity

- Full positive loop (P1→S1→D1→E1→O1→EV1→L1→R1 consuming L1→M2 with canonical continuity) = **0**.
- Correct incomplete loops exist (Family A: no reassessment; Family K: Learning-aware reassessment with no subsequent Scenario/Decision).
- No new Learning→Decision relationship type was created. Existing Decision records still have no `learn:` identity.

## Observer / known debt (not product S1)

Raw S1 141, S3 1. Same Observer classes as R5: Decision identity drift, duplicate Decision/Execution, Operator observation-gap, premature-outcome labels. These are not used as Learning-informed linkage.
