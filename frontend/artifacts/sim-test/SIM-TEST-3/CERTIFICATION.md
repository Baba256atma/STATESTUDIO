# NPA-T SIM-TEST:3 — Real Manager Journey Testing

**Status: RECERTIFIED after SIM-TEST:3-FIX1**

Original 2026-09-27 result was NOT CERTIFIED (10 S1). The Stage/referent repair in `frontend/artifacts/sim-test/SIM-TEST-3-FIX1/` restored the Manager Journey gate. Successor manufacturing signature: `fnv1a32:b8d64026`.

Date: 2026-09-27.

The original run produced 10 S1 findings (Stage lag after topic switch; named return missed Capacity). Those are repaired in SIM-TEST:3-FIX1. SIM-TEST:4 was not started.

## What was exercised

The existing RMS Manager Agent spoke through `executeNexoraConversationalExperience`. Journeys declare management intent and visible utterances only. STANDARD, IMPATIENT, and DATA_DRIVEN profiles change wording style through the existing profile authority and do not receive Ground Truth or Observer knowledge.

| Journey | Scenario | Mode | Profile | Turns | Ticks | Harness | Product |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Manufacturing primary | manufacturing-capacity-pressure@1.0 | INGESTION | DATA_DRIVEN | 21 | 21 | PASS | PASS (after FIX1) |
| Project primary | project-delivery-pressure@1.0 | INGESTION | STANDARD | 15 | 15 | PASS | PASS |
| Logistics parity | logistics-delivery-pressure@1.0 | FAST | IMPATIENT | 6 | 4 | PASS | PASS |
| Service parity | service-capacity-pressure@1.0 | FAST | STANDARD | 6 | 4 | PASS | PASS |

Aggregate: 48 Manager turns, 44 simulation ticks, cross-run isolation PASS, harness failures 0, auto-repair false.

## Original failure (preserved)

The first certification run failed with 10 S1 findings. Evidence remains in `FINDINGS.md`. FIX1 repaired Stage topic-switch FOCUS and named historical return. Manufacturing now PASSes with successor signature `fnv1a32:b8d64026`.

## Observer protection

SIM-TEST:2-FIX1 negation coverage was extended in the existing RMS Observer so “do not establish a confirmed cause” and “not a measured impact” stay uncertainty. Those phrases are not product causal overclaims. The six FIX1 false-positive traces remain absent.

## Validation

- SIM-TEST:3 focused: 9 pass / 0 fail.
- SIM-TEST:1: 11 pass / 0 fail.
- SIM-TEST:2: 13 pass / 0 fail.
- SIM-TEST:2-FIX1: 7 pass / 0 fail.
- RMS focused regression: 60 pass / 0 fail.
- Changed-path ESLint: pass / 0 errors.
- TypeScript: pass.
- Production build: pass. `/executive/watch` prerendered.
- Browser runtime: pass on the production server. See `BROWSER-RUNTIME-EVIDENCE.md`.

## Final status

**NPA-T SIM-TEST:3 — RECERTIFIED** (via SIM-TEST:3-FIX1)

STOP. Do not start SIM-TEST:4 until the program explicitly opens that phase.
