# BCA:3 relationship intelligence contract

Public: `app/lib/business-context-awareness/index.ts` → `resolveBusinessProjectRelationships`.

`BusinessProjectConceptRelationship` records ids, canonical meanings, `relationshipType` (also exposed as `kind`), context kinds, families, directionality, scope, knowledge scopes, evidence, provenance, confidence, confirmation, source refs, ambiguity, `currentRealityEstablished: false`, `causalityEstablished: false`, `causal: false`, `suppressedForCurrentContext`, and rejected inferences.

Unknown pairs are first-class: `{ state: "UNKNOWN" }`.

Handoff:

```text
BCA:1 context + BCA:2 concepts [+ manager-confirmed pair records]
                         |
                         v
              BCA:3 relationship registry
                         |
                         v
     immutable projection + diagnostics
```

Safety:

```text
Concept relationship ≠ causal relationship
General relationship ≠ current business truth
Relationship knowledge ≠ executive object edge
Managerial relevance ≠ permission
```
