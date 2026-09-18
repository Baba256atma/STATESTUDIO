# NPA-T NMI:5 — Attention reasons

Bounded vocabulary: EXISTING_QUEUE_ITEM, CRITICAL_PROBLEM, ACTIVE_RISK, EVIDENCE_GAP, RELATIONSHIP_GAP, DECISION_PENDING, EXECUTION_ACTIVE, EXECUTION_BLOCKED, OUTCOME_REVIEW, REASSESSMENT_AVAILABLE.

Used only when Queue semantics or canonical NMI state on that Queue item support them.

CRITICAL_PROBLEM requires existing Queue `attention: critical`. Urgency is not manufactured.
