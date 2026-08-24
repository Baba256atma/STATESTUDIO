# Decision Outcome Commitment

Identity: `MVP-OUT:1-R3/DecisionOutcomeCommitment` 1.0.0

`commitmentId` = `outcome-commit:{decisionId}:{expectedOutcomeId}:{bindingId}`

A commitment is recorded only when:

- canonical Decision exists and is Approved
- genuine `committedAt` is present
- R2 binding is `bound` (metric, dimension, unit, rule/target/direction)
- provenance exists

Otherwise: `incomplete` or `missing`. No invented 80%, no hindsight from later KPI.

Historical Under Review fixtures remain `committedAt = null`.
