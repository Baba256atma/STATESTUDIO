# SIM-TEST:3 findings

S0: 0. S2: 0. S3: 0. Harness failures: 0. Auto-repair: false.

S1: 10, all on `real-manager-manufacturing-primary` / `manufacturing-capacity-pressure@1.0` / `DATA_DRIVEN_MANAGER` / `INGESTION`.

Signature: `fnv1a32:b817801d`.

No finding was repaired.

## Episode — subject switch leaves Stage behind

Manager turns 10–15 move the executive subject from Capacity to Delivery (`obj-delivery`) and then Customer (`obj-customer`). Stage active subject and MLEVEL L1 stay `obj-capacity` through turn 14. MLEVEL is composed from the Stage focus, so the level path follows Stage. Earliest owner: **STAGE**.

| Turn | Intent | Utterance | Executive subject | Stage / L1 | Classification |
| --- | --- | --- | --- | --- | --- |
| 10 | CHANGE_CONTEXT | What about delivery? | obj-delivery | obj-capacity | STAGE_DIVERGENCE |
| 11 | FOLLOW_UP | Tell me more about it. | obj-delivery | obj-capacity | STAGE_DIVERGENCE |
| 12 | FOLLOW_UP | Does that affect delivery? | obj-delivery | obj-capacity | STAGE_DIVERGENCE |
| 13 | CHANGE_CONTEXT | What about the customer impact? | obj-customer | obj-capacity | STAGE_DIVERGENCE |
| 14 | FOLLOW_UP | Tell me more about it. | obj-customer | obj-capacity | STAGE_DIVERGENCE |
| 15 | COMPARE | Compare them. | obj-customer | obj-capacity | STAGE_DIVERGENCE |

Turn 15 also splits CC:5 internally: conversation context is `obj-capacity` while the executive subject remains `obj-customer`.

- Classification: `JOURNEY/CONTEXT_OVERRIDE`
- Owner: **REFERENT**
- Turn 15, tick 7, Production.csv v2

Advisor names follow the executive subject (Delivery, then Customer) on turns 10–14, so Advisor is not the earliest owner.

## Episode — return does not restore the capacity subject

Turn 16 utterance: “Go back to the capacity problem.”

- Executive subject stays `obj-customer`
- Stage / L1 stay `obj-capacity` (they never left)
- Response: “I don't see that Problem. Current Problems are Capacity Gap, Margin Pressure.”
- Classification: `JOURNEY/STALE_REFERENT`
- Owner: **REFERENT**
- Tick 21, after Production.csv v3

Turn 17, “Has anything changed?”, still answers from Customer (“Customer is connected to Delivery, Revenue…”) while the manager’s visible subject is the capacity problem.

- Classification: `JOURNEY/STALE_REFERENT`
- Owner: **REFERENT**

Turn 18, “How does this affect operations?”, changes the focused label from Capacity to Customer. The existing RMS Observer records `m:referent:18` / `CONVERSATION_ERROR/REFERENT_ERROR`: a deictic follow-up changed the Nexora subject. Owner: **REFERENT**.

Turn 20 later refocuses Capacity while asking about competitor capacity. That is not the return the manager requested at turn 16.

## Reproduction

```text
scenario: manufacturing-capacity-pressure@1.0
journey: real-manager-manufacturing-primary@1.0
profile: DATA_DRIVEN_MANAGER
mode: INGESTION
run: sim-test harness runNexoraSimulationTestJourney
signature: fnv1a32:b817801d
```

Turns 10–18 above. Data versions: ERP/Production/Inventory/Maintenance v2 at tick 7 for the switch, v3 at tick 21 for the return.

## Not classified as product S1

- “Do not establish a confirmed cause” and “not a measured impact” remain Observer uncertainty, not Advisor overclaim.
- Project, logistics, and service produced no S0 or S1.
- L2/L3 stayed null for these catalog objects. No canonical parent was observed and then hidden, so this is not an MLEVEL parent-id failure.
- Decision status stayed unset. The manager was not forced into a Decision.
- Cross-run file ids and publication ids did not overlap.
