# CORE-INT:3 — Causal Contract

Identity: `CORE-INT:3/GroundedCausalConstraintIntelligence`  
Epistemic authority: `CORE-INT:2/SharedEpistemicUncertaintyFoundation`  
Relationship authority: `EI:3/EvidenceBoundedRelationship`  
Frozen MVP: `MVP:1/NexoraManagerMVPReleaseBaseline` **1.2.0**

## Law

A recorded relationship is never silently promoted into causation.

Core owns: relation semantics, contributor identity, epistemic kind, evidence, provenance, confidence, primary/root designation.  
EXI owns: manager wording and presentation order only.

## Semantics

| Kind | Meaning | Live example |
|---|---|---|
| RELATED | Unlabeled or generic recorded link | Stage `related` edges |
| ASSOCIATED | Explicit association, not contribution | Risk `associated-with` Margin Pressure |
| DEPENDENCY | Recorded depends-on | Delivery `depends-on` Capacity |
| CONTRIBUTOR | Evidence supports treating the factor as potentially contributing | Capacity `constrained-by` Capacity Gap |
| CAUSAL | Requires `supported-causal` + `causeEstablished` | Not present on live fixtures |
| UNKNOWN | Unlabeled / insufficient | Inventory; generic relations |

## Dual truth

Relationship existence may be a **FACT**.  
Causal interpretation remains **ASSUMPTION** or **UNKNOWN** unless explicit causal authority exists.

## Contributor

A contributor is not a proven root cause.

- One contributor ≠ primary contributor
- Multiple contributors are listed, not ranked
- `rootCause = null` unless explicit upstream causal authority exists
- Causal confidence is EI:3 `SemanticConfidence` from CORE-INT:2 claims. No CausalConfidenceV2.

## Chain

Only recorded edges. No inferred middle nodes.  
`A → B` and `B → C` does **not** imply `A causes C`.
