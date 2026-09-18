# NPA-T NMI:3 — Relationship intelligence contract

`ManagementRelationshipIntelligence` interprets one existing NMI:1 relationship.

Composer: `interpretNmiRelationship` / `interpretNmiRelationships`.

Identity: `NPA-T NMI:3/ManagementRelationshipIntelligence`.

Each interpretation includes:

- relationship ID
- source / target canonical refs
- NMI:1 kind
- management class and meaning
- evidence / provenance references
- epistemic status (copied)
- `causal: false` at the NMI layer
- causal communication class (does not upgrade VAI)
- certainty only when canonical epistemic / VAI overlay justifies it
- `numericStrength: null`
- unresolved reason when applicable
