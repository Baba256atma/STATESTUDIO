# Collection scope contract

Separate:

- `collectionKind` (PROBLEM, RISK, SCENARIO, …)
- `scope` (ALL, CURRENT, FILTERED, …)
- `filter` (related-to subject or null)
- conversational context (not a silent filter)

Default for `show problems`: current **canonical Problems collection** (same as Menu). Menu and Advisor agree for that scope.

Precedence: explicit collection scope/filter **beats** conversational subject.

- `show all problems` → ALL, filter null, even if Margin Pressure is active
- `show problems related to Margin Pressure` → FILTERED
- `show its Problems` / `related` → context may filter (deictic)

Active subject must not silently filter ALL or the default unfiltered Problems query.
