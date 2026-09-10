# MRA:3-FIX1 — Mutation Evidence

## Exact blocker (MRA-3-004)

`Add this as a Risk.` without a named item → clarification, not ADD named “Risk”.

`forget that for now` is cancellation (`isEcaMutationCancellation`).

`show me problems` then `yes` does not emit “Risk has been added as a Risk.”

Proof: `runtime-turns.json` unnamed ADD + forget + yes; unit `MRA:3-FIX1 mutation topic change does not confirm an unnamed add`.

## Typed operations

REMOVE/delete still propose REMOVE (`C8 delete never degrades into add`). Named `Add Supplier Delay as a Risk` + `yes` still confirms ADD (supported path).

No second canonical writer.
