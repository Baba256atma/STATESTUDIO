# Referent continuity trace (T69)

Manager: Go back to the supplier problem.
→ CC:1 / 6.1: named historical return tokens `[supplier]`
CORRECT: no fabricated Supplier object

→ FINAL:6.2 previous-referent
CORRECT: provenance UNRESOLVED, objectReference null, namedTargetFailed

→ FINAL:6.3 pending from T68
DIVERGES_HERE (pre-FIX): independently resolvable `go back` cancelled pending and `proceed`ed, skipping the existing namedTargetUnresolved gate
CORRECT after repair: re-enter gate → MISSING_SUBJECT clarify

→ Canonical subject
CORRECT: remains obj-capacity (unknown named target does not steal history)

→ CC:5 response
DOWNSTREAM: clarification prompt, not outcome-investigation on Capacity

→ Advisor / Stage
DOWNSTREAM: still Capacity presentation while clarifying
