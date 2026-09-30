# SIM-TEST:4 findings

S0 = 0. Material S1 = 4. No auto-repair.

## STRESS-M-25 — Advisor diverged on “What is the problem?”

- findingId: `sim-test-1:stress-manager-manufacturing-mlevel-stage:cert-0:journey:ADVISOR_DIVERGENCE:25:0`
- journey: `stress-manager-manufacturing-mlevel-stage`
- turn / tick: 25 / 7
- reproduction: `fnv1a32:09407f0e`
- earliest owner: **ADVISOR** (NPS problem overlay is adjacent, not independently proven first)
- type: ADVISOR_DIVERGENCE

Canonical subject, conversation, Stage, and MLEVEL L1 were `obj-delivery`. Advisor referent was `ctx-problem-capacity` / Capacity Gap. Reply: could not match “Problem” in executive context.

Trace: Manager intent → CC:5 kept Delivery → NMI/MLEVEL/Stage stayed Delivery → Advisor/NPS jumped to Capacity Gap.

## STRESS-M-30 — Unknown supplier return

- findingId: `sim-test-1:stress-manager-manufacturing-mlevel-stage:cert-0:journey:SUBJECT_LOSS:30:1`
- turn / tick: 30 / 7
- reproduction: `fnv1a32:09407f0e`
- earliest owner: **CC5_CONVERSATION** (session then focused `ctx-problem-margin` / Margin Pressure; no Supplier Object exists)
- type: SUBJECT_LOSS

Manager: “Go back to the supplier problem.” Expected: unknown/clarification, no invented historical Object. Observed: named supplier was not acknowledged; production focused Margin Pressure.

## STRESS-P-5 — “What about resources?” stayed on Delivery

- findingId: `sim-test-1:stress-manager-project-mlevel-stage:cert-1:journey:WRONG_REFERENT:5:0`
- journey: `stress-manager-project-mlevel-stage`
- turn / tick: 5 / 5
- reproduction: `fnv1a32:8fe47a26`
- earliest owner: **REFERENT**
- type: WRONG_REFERENT

Canonical/Stage/L1 remained `obj-delivery`. Scene intent was FOCUS_OBJECT, but the reply did not take Resource as the subject.

## STRESS-P-10 — “What about the schedule?” stayed on Delivery

- findingId: `sim-test-1:stress-manager-project-mlevel-stage:cert-1:journey:WRONG_REFERENT:10:1`
- turn / tick: 10 / 5
- reproduction: `fnv1a32:8fe47a26`
- earliest owner: **REFERENT**
- type: WRONG_REFERENT

Same pattern as STRESS-P-5 for Schedule.

## Not S1

Live NMI default map has no `belongs_to`, so L2/L3 are NOT_APPLICABLE. That is graceful missing-parent behavior, not a fabricated hierarchy.

SIM-TEST:3-FIX1 Capacity → Delivery → Customer → Capacity remained PASS on the original manufacturing primary journey.
