# Theatre Integration

The existing Scene Intent vocabulary already supports orientation, focal review, collection review, relationship review, investigation, comparison, commitment, execution, outcome, and learning flows. DATA-UX:1 adds no new intent because no source-specific rendered scene is implemented yet.

Director integration path:

```text
committed RDI source
  → read-only DATA_OBJECT projection
  → resolved Director reference (`kind=data-source`)
  → existing Director plan boundary
  → existing Stage compatibility/renderer in a future explicit scene
```

The projection exposes a Stage participant identity but sets `rendererRequired=false` and `navigationEligible=false`; therefore current Stage behavior is unchanged. DATA-UX:2 may wire selection/rendering through existing Stage object-click and safe-zone contracts after defining the visual and interaction grammar.

Relationships are deliberately empty in DATA-UX:1. Later relationships must use explicit canonical semantics such as `supplies`, `supports`, or `source-for`, carry provenance, and remain `impliesCausality=false` unless a causal authority exists. Distance, direction, weight, animation, or prominence cannot manufacture causality.

Advisor path remains RDI:3 source context → existing Advisor region and NCA clarification. Current UI can summarize source content, mapped objects, state, metrics, provenance and comparisons through explicit source actions. Free-form questions about arbitrary columns/source dependencies are not yet a complete canonical NLU path.

