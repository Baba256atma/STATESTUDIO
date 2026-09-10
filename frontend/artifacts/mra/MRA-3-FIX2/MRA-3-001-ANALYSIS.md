# MRA-3-001 — `look at capcity`

## Reproduction

Prior: `What are the main problems?` (now a PROBLEM collection listing).

Exact: `look at capcity`.

Previous: `Focused on Capacity.` (KPI `obj-capacity`).

Expected: Capacity Gap Problem, or clarification between Problem and KPI.

## Scoring

NCA-POST:1 fuzzy now matches every catalog key whose **token** is within distance 1 of `capcity` (`capacity` in Capacity, Capacity Gap, Capacity Expansion Plan, …). Unique shortest-name selection previously committed the KPI because NLU collapsed multiple kinds to the single `object` hit.

## Repair (not hardcoded)

- Fuzzy matches key **parts**, so siblings stay same-distance / AMBIGUOUS at the catalog layer.
- NLU may still pick Capacity in isolation (FINAL:6.1 `explain capacit` preserved).
- With last-collection PROBLEM members, CC:2 and 6.2 rank `ctx-problem-capacity` (Capacity Gap) over the KPI.
- Explicit `look at Capacity` still selects the KPI.

Generalization: `look at demnd` after Scenarios → Demand Surge, not the Demand KPI.

Status: **closed**.
