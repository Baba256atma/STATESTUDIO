# NPA-T NMI:1 — Management relationship contract

Bounded kinds: supports, measures, affects, depends_on, belongs_to, threatens, addresses, evidenced_by, evaluated_by, selected_as, executed_by, observed_by, reassesses.

Every relationship is `causal: false` at the NMI layer. Epistemic status is declared (`UNKNOWN` | `DECLARED` | `ASSOCIATION` | `MANAGER_ASSERTED` | `EVIDENCE_REFERENCED`) and is not upgraded by composition.

Missing relationships stay missing (`unresolvedRelationshipIds`).
