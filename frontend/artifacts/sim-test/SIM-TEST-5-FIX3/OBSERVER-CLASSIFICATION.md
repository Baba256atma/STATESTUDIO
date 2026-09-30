# Observer classification

Observer remains read-only. It may read Execution status.

Repeated clarification still fires when `clarificationRequired` is true for more than `maxRepeatedClarificationAttempts` consecutive turns.

Exception: if the product response acknowledges an already-active in-progress Execution (`already has an active Execution` / `Execution has started` with `executionStatus === in-progress` and an execution id), that turn does not increment the streak.

T31 before: product was already-active (legitimate) but status was still clarification-required → Observer S1. After: either status is not clarification or Observer skips the ack. Classification was mixed PRODUCT + OBSERVER; both seams repaired.

Observer was not patched to hide remaining which-issue loops; those were repaired in 6.3/6.2/CC:5.
