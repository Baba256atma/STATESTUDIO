# Root cause and implementation

## Why the original result was safe

POST:4/NXA:5 refused to rank Capacity Gap vs Margin Pressure without comparable evidence. Stage stayed on Problems. No false preferred Problem.

## Why it was conversationally incomplete

`important` was collapsed to overall significance and answered with a terminal insufficiency. No criterion clarification. No executable next step.

## Correction

1. POST:4 treats `important` / `more important` / `matters most` / `higher priority` as **materially ambiguous** unless a named criterion or `overall` is present, or an active comparison already has a criterion.
2. Orchestrator hands off to existing NCA:3 comparison-criterion clarification **before** NXA:5 ranking copy.
3. NCA:2 stores pending PRIORITY and `activeComparison` IDs.
4. NXA:5 insufficiency names the selected criterion and offers another **explicit** criterion (risk exposure or evidence strength), which the continuation test executes.
5. PRIORITY `extractAnswer` accepts only supported criterion phrases so `show decisions` is not consumed as an answer.

`prolems` remains uncorrected. Binding is via `which one` + active collection.
