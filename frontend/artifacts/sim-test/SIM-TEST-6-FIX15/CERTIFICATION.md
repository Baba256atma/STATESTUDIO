# NPA-T SIM-TEST:6-FIX15 — CERTIFIED

- The Impatient T8 MISSING_DECISION is traced to two CC:1 grammar roots: T6 (earliest) and T8 (independent). T7 and T9 are downstream.
- The repair uses the existing option-request predicate, the explicit-commitment rule, CC:9 seeding and the CC:10 ordinal mapping. CC:10 remains the only Decision writer.
- B is accepted only when the CC:9 collection was established for the current subject. Cold, unmapped and stale references clarify, and confirmation never invents a candidate.

## Gates (actual counts)

- Focused:
  - FIX15: 11/11.
  - CC:1 / CC:9 / CC:10 / SIM-TEST:5-FIX1 / DecisionFix5 (FAST) / OrdinalFix9 / NCA:2: 161/161.
  - R5 / R6 / R7 / Smart Clarification / 6.1–6.4 / NXA:1 / NCA-POST1 / ECA working context: 139/139.
- SIM-TEST: 177/177 (166 baseline plus 11 FIX15). S0 = 0.
- Journey S1 differential across all 28 journeys, before vs after:
  - The only change is Impatient, which goes from S1 4 to 3 (T8 removed); its signature moves from `7b53995b` to `3270d743`.
  - The other 27 journeys, including FAST `3aa7cfc6`, are identical, so there are 0 new S1.
- Typecheck: 0 errors.
- eslint (changed files): 0. `git diff --check`: clean.
- NXA funnel:
  - L1 PASS.
  - L2 453/453.
  - L3 48/48.
  - L4 PASS, with all 7 required commands passed and an empty barrier: omnibus 1681/1681, dir-inventory 58/58, typecheck, eslint, diff-check, build (compiled successfully), live-smoke (`ok: true`, zero page errors).

## Status

- SIM-TEST:6-FIX15: CERTIFIED.
- SIM-TEST:6-FIX14 and R5–R9: remain CERTIFIED (guards green, typecheck 0).
- SIM-TEST:6: not recertified. Impatient T16 STALE_REFERENT and T30/T31 ADVISOR_DIVERGENCE remain as measured, unchanged at the same turns. Neither disappeared, and neither was started.
- Next finding: Impatient T16 STALE_REFERENT (not started).

## Pre-existing failures outside the required funnel (not caused by FIX15)

Five `app/lib/nexora-conversation` runtime files fail the same 12 tests with and without FIX15 (identical failing set on a pre-FIX15 scratch copy):
- `ecaPostEca2StageAwareness`
- `mra2ManagerReadiness.runtime`
- `mra3Fix2ReferentialContinuity.runtime`
- `mra3RecertFix1DeicticFidelity.runtime`
- `mra3RecertFix2InvestigationFidelity.runtime`

No NXA funnel level includes these files. They are recorded, not repaired.

## Remaining debt (observed, not repaired)

- **ECA:8 label fabrication (presentation).** `namedTarget()` falls back to a synthetic `Scenario B`. With no option set, a following "Yes." answers "Confirm Scenario B as the Decision through the existing Decision authority." No Decision is created, and it did not cause T8 (§17).
- **T9 "Yes. Decide." response.** After the explicit T8 commitment, CC:1 still returns `unknown`, and ECA answer intake reads it as an answer to the T5 backlog question. The Decision count stays 1.
- **T10 "Start it." (newly reachable).** Execution starts for the committed Decision, but the canonical subject becomes the preferred intervention scenario, and the response mixes "Execution has started" with "nothing has started running yet".
- **CC:9 option seeding.** Seeding does not re-seed for a new subject: "Options." on Delivery re-presents the Capacity set. The CC:10 anchor guard makes B clarify there instead of committing.
- **Presentation mismatch.** The Advisor's option prose (Capacity Expansion Plan / external capacity) differs from the CC:9 candidates that A/B map to in the standard journey.
- **Prior out-of-scope items.** S1-06 T3 status, S1-06 T1 no-match, "Give me the details.", Delivery walkthrough drift, ECA "How sure are you?", "..", and the pre-R9 package.json build flag.
