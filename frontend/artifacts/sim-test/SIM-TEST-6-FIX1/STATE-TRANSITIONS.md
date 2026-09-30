# State Transitions (focused)

## T48 historical return

BEFORE: Margin Pressure current; no successful Capacity return.
Manager: Return to the capacity pressure we started with.
Interpretation: previous-referent named return.
Transition: UNRESOLVED/`MISSING_SUBJECT` → RESOLVED (Capacity).
AFTER: `obj-capacity`; `clarificationRequired=false`.

## T50 comparison

BEFORE: Capacity current; no empty-candidate pending from T48.
Manager: That option we compared earlier — remind me of the difference.
Interpretation: comparison reminder.
Transition: NONE / SUPERSEDED if empty-candidate pending were still live.
AFTER: comparison answered; `clarificationRequired=false`; Decision count 1; Execution count 1.

## Unit: empty-candidate pending + comparison

BEFORE: `MISSING_SUBJECT` pending, no candidates.
Manager: That option we compared earlier — remind me of the difference.
Transition: PENDING → SUPERSEDED (`proceed`, cancelled).
AFTER: `pending=null`.

## Unit: empty-candidate pending + decision query

BEFORE: `MISSING_SUBJECT` pending, no candidates.
Manager: This decision — is it still the active one?
Transition: PENDING → SUPERSEDED.
AFTER: `pending=null`.

## Unit: genuine unknown + “that one”

BEFORE: supplier unknown pending.
Manager: That one.
Transition: PENDING → PENDING (not blindly cleared).
