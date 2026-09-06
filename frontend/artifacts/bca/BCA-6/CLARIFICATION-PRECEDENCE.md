# BCA:6 clarification precedence

NCA already owns conversational pending-question precedence. BCA:6 does not compete with NCA turn-taking. It only ranks **business-context** ambiguities for the current request.

Deterministic rank (lower number first):

1. Hybrid / scope ambiguity needed for the current task (Capacity current vs project)
2. Temporal ambiguity when current-state reasoning is requested
3. Role ambiguity when responsibility/relevance depends on the role
4. Process-placement ambiguity when process relevance is requested
5. Organization-specific placement when that process question is active
6. Optional / unknown-but-nonblocking — never selected as a manager question

Within a rank, keys sort lexicographically.

Confirmed, declined, and unresolved records suppress the same `clarificationKey`.

NCA remaining pending (`pendingClarificationKey`) sets `alreadyAsked` without inventing a second pending-question engine.
