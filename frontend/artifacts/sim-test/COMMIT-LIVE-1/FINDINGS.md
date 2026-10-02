# COMMIT-LIVE:1 findings

## Root (S2, repaired)

CC:5 live turns threw `ReferenceError: answerNexoraExiUtterance is not defined` after OUT-LIVE replaced the EXI import with the capture import. Catch swallowed the throw → no current subject, no CC:9 collection, no CC:10 Decision, no CC:11 Execution.

## Preserved

FIX1 wrong-thread Execution = 0.  
FIX2 stale Capacity Scenario set under Delivery = 0.  
Ambiguous Go with B. without a presented collection writes 0 Decisions.

## Independent / existing

Do-nothing Scenario ID `cc9:scenario:do-nothing:do-nothing:v1` is shared across Capacity and Delivery. Repeating Go with B. after a prior do-nothing commitment is idempotent, not a second Decision.

## Not in scope

Observation evaluation, Learning, SIM-TEST:10-R2.
