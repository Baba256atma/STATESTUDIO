# BCA:4 process context precedence

1. Authoritative BCA:1 organization/project context filters which registry rows apply.
2. Manager-confirmed organization/project placements (`AFFIRMS`) are added as ORGANIZATION_SPECIFIC current-context records.
3. CONTRARY manager records keep general knowledge with `suppressedForCurrentContext`.
4. General BCA process registry knowledge.
5. UNKNOWN when the concept is established but has no process row.

General knowledge is never deleted. Token/substring matching is not used.
