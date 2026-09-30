# Root Cause

T50 was the first Observer `REPEATED_CLARIFICATION` (third consecutive `clarificationRequired`).

The stale pending was created at T48, not T50.

T48 “Return to the capacity pressure we started with.” is a named historical return. FINAL:6.2 required every leftover token to match the catalog haystack. Tokens included `pressure`, `started`, and `with`, so Capacity did not match. Provenance stayed `UNRESOLVED`. FINAL:6.3 then asked `MISSING_SUBJECT` with an empty candidate set (“Which one do you want me to show?”).

T49–T50 were captured by that empty pending. T50 still produced a comparison answer (CC:9 candidates) while CC:5 status remained `clarification-required`.

Earliest owner: FINAL:6.2 named-return token matching, with FINAL:6.3 failing to supersede the resulting empty-candidate pending.

Repair:

1. 6.2 strips temporal/pressure fillers so “capacity pressure we started with” tokens to `capacity`.
2. 6.3 treats independently resolvable comparison, evidence/data-change, and empty-candidate decision/return turns as supersession, not another ask.
