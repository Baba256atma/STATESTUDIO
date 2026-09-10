# MRA:3-FIX2-FIX1 — Root cause

## Live failure

1. `show me scenarios` → Current Scenarios: Capacity Expansion Plan, Demand Surge, Pricing Response.
2. `is there any CSV files?` → Yes. I currently have 1 CSV source: data-ux3-ambiguous.csv.
3. `explain it.` → explained Capacity Expansion Plan.

Expected: `it` = the CSV Nexora just introduced.

## Earliest incorrect transition

The CSV inventory turn (DATA-ADV `csv-availability`) listed the resolved source in `listedSourceContextIds` but **did not bind** `sourceContextId`.

It also **did not** write an assistant-introduced data referent onto existing FINAL:6.2 continuity (`activeSubjectKind` stayed on the prior Scenario collection).

`classifyAdvisorDataConversation("explain it")` is null. Isolated `explain it` is a deictic knowledge follow-up, not a new CSV keyword query.

Pronoun resolution therefore kept the previous collection context. The first presented Scenario (Capacity Expansion Plan) outranked the newer valid Data source.

The live shell early-return for DATA-ADV answers compounded this: inventory could complete without updating 6.2 continuity at all.

This is not an `explain it` phrase bug. It is a missing **assistant-introduced canonical referent** plus **cross-domain recency**.

## What was not the cause

- A missing second reference resolver.
- Hard-coded CSV filenames.
- Stage focus vs collection SHOW (those remain distinct).
- Intent rewrite (EXPLAIN stayed EXPLAIN; the wrong object was selected).
