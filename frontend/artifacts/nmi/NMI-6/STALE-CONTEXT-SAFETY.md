# NPA-T NMI:6 — Stale-context safety

Ignored when a newer explicit NMI selection exists:

- stale Queue selection
- stale collection / comparison
- stale Stage focus
- stale Advisor subject
- stale roadmap state

`resolveNmiExplicitSelection` always returns `explicitCanonicalId`.

No second focus registry.
