# SIM-TEST:9-FIX1 findings

## Repaired: ST9-S1-WRONG-EXECUTION-BINDING

- Classification: FIX1-owned, same-root across the two CC:5 execution-request paths.
- First divergent layer: CC:5 Decision selection before CC:11.
- Expected: a deictic execution command requires one uniquely safe Approved Decision target.
- Post-FIX actual: Delivery remains canonical across subject, L1, Stage, and Advisor; the unrelated Capacity Decision is not executed; clarification is returned.
- Deterministic repaired replay: `fnv1a32:c5462932` = `fnv1a32:c5462932`.

## Focused regression discovery

The first repair iteration exposed three same-root historical-return failures. The generic turn projection could reinterpret `it` as a Scenario before execution selection. The final repair uses the pre-turn canonical referent and permits Scenario → Decision selection only when the Decision is the active Scenario's primary canonical subject. The affected regression set then passed 115/115.

## Preserved independent findings

- `ST9-S2-SCENARIO-SET-CONFUSION`: unchanged; not repaired.
- Known NPS S3 Capacity-label mismatch: unchanged.
- Known Advisor Delivery/Capacity debt: unchanged.

No independent S1, Ground Truth leak, new authority, or observer write was introduced.
