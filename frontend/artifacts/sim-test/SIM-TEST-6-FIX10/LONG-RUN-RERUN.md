# Long-run rerun

## Manufacturing

| | Pre-FIX10 | Post-FIX10 |
| --- | --- | --- |
| Signature | `fnv1a32:bc1af3ff` | `fnv1a32:be0e4dfd` |
| S1 | 1 | 0 |
| Findings | T92 WRONG_REFERENT | none |

- T88 Inventory canonical + Stage PASS (FIX8)
- T89 Inventory + ordered-list clarification PASS (FIX9)
- T102 not captured as stale collection ordinal PASS (FIX9)
- T92 canonical/Stage `obj-delivery`; not Capacity
- Decision 1 / `cc10:decision:cc9:scenario:do-nothing:do-nothing:v1`
- Execution 1 / `execution-cc10:decision:cc9:scenario:do-nothing:do-nothing:v1`

## Data/evidence source transition

T92 does not replace management subject with PRODUCTION or Capacity. PRODUCTION v4 remains the latest Nexora-visible production family.

## Other journeys

- Project: `fnv1a32:8e136351` S1=2 (T18 ADVISOR, T35 REPEATED_CLARIFICATION) unchanged
- Logistics: `fnv1a32:5c62c131` S1=0 (was `66479d26` T21) — same-root repaired
- Service: `fnv1a32:d6ba4cff` S1=2 (T17 ADVISOR, T18 REPEATED_CLARIFICATION) unchanged
- FAST: `fnv1a32:8a0767d0` S1=0
- Impatient: `fnv1a32:87f35baf` S1=5 unchanged (kept separate)
- Fresh: `fnv1a32:81d72b8a` S1=0
