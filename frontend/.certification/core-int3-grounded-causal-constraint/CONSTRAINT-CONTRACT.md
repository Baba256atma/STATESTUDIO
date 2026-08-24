# CORE-INT:3 — Constraint Contract

Identity: `CORE-INT:3/GroundedCausalConstraintIntelligence`  
Epistemic authority: `CORE-INT:2/SharedEpistemicUncertaintyFoundation`  
Frozen MVP: `MVP:1/NexoraManagerMVPReleaseBaseline` **1.2.0**

## Law

A recorded constraint is never silently promoted into a binding constraint.

Constraint intelligence answers: **What may be preventing us from succeeding?**  
That is distinct from causal intelligence: **Why may this be happening?**

## Qualification

Only these recorded relations qualify as constraints:

| Relation | Qualification | Notes |
|---|---|---|
| `constrained-by` | recorded-limit | Canonical limit |
| inbound `blocks` | recorded-blocker | Stronger wording only because the recorded kind is `blocks`, not because Core ranked severity |

Do **not** treat as constraints:

- `related-to` / `related`
- `associated-with`
- `affected-by`
- `depends-on` (dependency ≠ constraint)
- outgoing `blocks` / `affects` (effects on another subject)

## Binding

`bindingConstraint` requires explicit canonical authority.

Live `/executive` fixtures do not provide that authority.

Therefore:

```
bindingConstraint = null
```

Manager meaning:

> Nexora has identified the recorded constraints, but does not yet have enough evidence to determine which one is binding.

A single recorded constraint is still not binding.

## Relief

`relief = null` unless upstream evidence explicitly records that a scenario relieves a constraint.  
No invented “if relieved, KPI improves by X%”.

## Unresolved

When binding is unknown, all recorded constraints remain `unresolvedConstraints`.  
They are not ranked. Ranking is CORE-INT:4 debt.
