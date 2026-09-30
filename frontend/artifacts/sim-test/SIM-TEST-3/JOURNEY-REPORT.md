# Journey report

## Manufacturing — real-manager-manufacturing-primary

INGESTION. DATA_DRIVEN_MANAGER. 21 turns. Ticks 0, 7, and 21. Signature `fnv1a32:b817801d`.

Turn 01 — Orientation
Subject: forming
Data: Production v1
Result: PASS

Turn 03 — Problem focus
Subject: Capacity / obj-capacity
Stage and L1 match
Result: PASS

Turn 04 — Evidence
Response cites Production.csv
Result: PASS

Turn 05 — Cause
Response says the evidence does not establish a confirmed cause
Result: PASS

Turn 06 — Challenge
Data: Production v2
Result: PASS

Turn 09 — Options
Result: PASS
Decision was not committed

Turn 10 — Subject switch
Capacity → Delivery (`obj-delivery`)
Stage and L1 remain `obj-capacity`
Result: FAIL

Turn 13 — Subject switch
Delivery → Customer (`obj-customer`)
Stage and L1 remain `obj-capacity`
Result: FAIL

Turn 15 — Compare
Executive subject `obj-customer`; conversation context `obj-capacity`
Result: FAIL

Turn 16 — Return
Utterance: go back to the capacity problem
Executive subject stays `obj-customer`
Data: Production v3
Response: the problem is not seen; listed problems are Capacity Gap and Margin Pressure
Result: FAIL

Turn 17 — Data refresh question
Answer stays on Customer after Production v3
Result: FAIL

Turn 18 — Parent context
Focused label moves Capacity → Customer on “How does this affect operations?”
Result: FAIL

Turn 21 — Reassess
Subject returns to Capacity on a later capacity question
Result: PASS for that turn
The turn-16 return had already failed

## Project — real-manager-project-primary

INGESTION. STANDARD_MANAGER. 15 turns. Signature `fnv1a32:51decce2`.

Turn 01 — Project orientation
Result: PASS

Turn 03 — Delivery focus
Subject: Delivery / obj-delivery
Stage and L1 match
Result: PASS

Turn 04 — Evidence
Result: PASS

Turn 06 — Challenge
Data: PMO v2, Project Control v2
Result: PASS

Turn 07 — Context question
Resource question stays on Delivery and asks which object is meant
Result: PASS

Turn 10 — Return
Delivery subject remains obj-delivery
Result: PASS

Turn 11 — Fresh data
PMO v3, Project Control v3
Subject unchanged
Result: PASS

Turn 13 — Options
Decision was not committed
Result: PASS

## Logistics — real-manager-logistics-parity

FAST. IMPATIENT_MANAGER. 6 turns. Signature `fnv1a32:dd7d7658`.

Orientation, delivery focus, evidence, challenge, and reassess stayed on Delivery after focus.
Result: PASS

## Service — real-manager-service-parity

FAST. STANDARD_MANAGER. 6 turns. Signature `fnv1a32:e2bea6a4`.

Orientation, capacity focus, evidence, challenge, and reassess stayed on Capacity after focus.
Result: PASS
