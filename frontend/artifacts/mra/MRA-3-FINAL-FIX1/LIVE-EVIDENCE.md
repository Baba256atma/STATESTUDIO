# Live evidence

## MRA-3-FINAL-001 (required blocker)

Live `/executive` sequence:

1. `show me scenarios`
2. `is there any CSV files?` (real CSV import)
3. `Capacity Gap`
4. `explain it`

**Actual:** `Capacity Gap is constraining delivery performance...`

Not Capacity Expansion Plan. Focused subject `ctx-problem-capacity`. Page errors: none on this capture.

See `live-audit.json` tests.A.

## Tests B–G

Captured in the same `live-audit.json` run (this file was written before the Stage assertion).

## Stage interaction

After Capacity Gap, click `obj-revenue`, then `look at Capacity Gap`:

- Stage and MO:1 reconverge to `ctx-problem-capacity` (`Focused on Capacity Gap`).
- Click does **not** leave Revenue as Stage focus after the named return.

Then `explain it` currently presents Capacity Expansion Plan (scenario projection) while Stage remains on Capacity Gap.

That remaining mismatch is why FINAL-FIX1 is not certified. It is not a silent Stage overwrite of focus; it is leftover Scenario-assessment composition on deictic `explain it`.
