# NPA-T STAGE-PROD:6C — Architecture inspection

## Reproduced divergence

The live `Compare Demand Surge and Pricing Response.` command produced the authoritative two-candidate Decision Comparison surface, but `/executive` remained in the Capacity Gap Investigation composition. The first divergence was DTH:1 reconstruction: `ncaActiveComparison` was consumed by the comparison panel but not by Scene intent. After that handoff was repaired, STAGE-PROD:3 still selected Investigation ahead of the active Comparison, and STAGE-PROD:5 tested stale disclosure against DTH's broad object set instead of the actual rendered composition.

## Bounded repair

- DTH:1 reconstructs `COMPARE_CANDIDATES` from the existing authoritative `ncaActiveComparison`; it does not add an intent or Scene authority.
- STAGE-PROD:3 gives an active Decision Comparison precedence over an accompanying investigation disclosure and renders the exact comparison candidate membership.
- STAGE-PROD:5 checks disclosure visibility against the existing STAGE-PROD:3 composition projection.
- STAGE-MOTION:1 exposes read-only live position/opacity/scale samples through host diagnostics so browser certification can distinguish start, intermediate, and target values.

The runtime path remains Director/Theatre → STAGE-PROD:3 → STAGE-PROD:6B target projection → STAGE-MOTION:1 → existing Stage Objects. No store, semantic composer, clock, frame loop, or interpolation authority was added.

