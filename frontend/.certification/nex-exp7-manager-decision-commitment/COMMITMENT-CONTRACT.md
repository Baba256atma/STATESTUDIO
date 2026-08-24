# NEX-EXP:7 Commitment Contract

Preference is not commitment.

Recommendation is not commitment.

Commitment language opens confirmation. Only manager confirmation may call CC:10R `transitionDecision`.

Flow:

RECOMMENDATION → PREFERENCE → COMMITMENT INTENT → CONFIRMATION → CC:10R → DECISION RUNTIME

Not:

RECOMMENDATION → AUTO-APPROVE

Not:

DECISION → AUTO-EXECUTE

Deictic “Yes / Confirm / Approve this” resolves against pending confirmation. Bare confirmation without pending does not guess.

If comparison fingerprint changes while awaiting confirmation, confirmation is paused.

Override of the recommendation is allowed. Rationale is not invented unless the manager stated a reason (`because …`).
