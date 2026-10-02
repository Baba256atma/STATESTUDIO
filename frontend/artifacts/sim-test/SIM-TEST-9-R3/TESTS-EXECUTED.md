# SIM-TEST:9-R3 tests executed

## Full population

`npx tsx --test app/lib/sim-test/nexoraSimulationMultiThreadR3.test.ts`

- tests 1, pass 1, fail 0
- duration ~17.6s
- journeys 160 from turn 1 (14 A–N + 90 SIM-TEST:7 + 56 SIM-TEST:8)
- FIX1 original blocker replayed twice (`fnv1a32:f371b12f` matched)
- FIX2 family journeys C/D/E/F/J/K replayed; plus B T5 journey; all 7 signatures matched

## Focused regression (section 55)

`npx tsx --test app/lib/sim-test/nexoraSimulationMultiThreadFix1.test.ts app/lib/sim-test/nexoraSimulationMultiThreadFix2.test.ts app/lib/sim-test/nexoraSimulationReassessmentFix1.test.ts`

- tests 51, pass 51, fail 0
- duration ~6.7s
- Covers FIX1, FIX2 T1–T18/micro-funnel/R2 family replays, and SIM-TEST:8-FIX1 reassessment

## Not run

- Level 4 / full-repository funnel: **not run**
- Unrelated FIX14/FIX18/etc. suites: **not run** unless included in the 51-test command above
