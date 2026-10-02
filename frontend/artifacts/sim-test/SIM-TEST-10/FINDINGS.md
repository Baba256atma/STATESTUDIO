# SIM-TEST:10 findings (measurement only)

Evidence: `population-run.json`. No production repair.

## Architecture (discovered, not assumed)

| Concern | Owner | Writes in CC:5 / RMS conversation? |
| --- | --- | --- |
| Execution identity/state | CC:11 | yes (start / in-progress) |
| Decision → Execution | CC:10 → CC:11 | yes |
| Expected Outcome binding | MVP-OUT:1-R2 | **not invoked from CC:5** |
| Observed capture | CORE-OUT:1A | **store empty in this path** (`listCapturedObservations` max = 0) |
| Expected vs actual evaluation | CORE-OUT:1 | not reached (no captured actuals) |
| Execution → Outcome link | CORE-OUT:1A window/link | not opened from CC:5 |
| Conversation Outcome | ECA:11 | projects empty evidence → too early / unknown |
| NPS Outcome/Learning | NPS:8 | **read-only**; `writesOutcome: false`; statuses TOO_EARLY / UNKNOWN |
| Learning | CORE-OUT:2 / ECA:12 | `learningDurable: false`; status NONE |
| Reassessment | NPS:8 / ECA:12 / SIM-TEST:8-FIX1 | path available without Outcome objects |
| Data Reality | existing RDI / Operator CSV | **does update** after publication |
| Ground Truth | RMS | unpublished asks did not leak |
| EI:6 | not the live Outcome writer (`CORE-OUT:1` `reusesEi6Learning: false`) | not used as capture |

CC:5 **reads** `listCapturedObservations()` for ECA/DTH. It does **not** call `integrateNexoraOutcomeLearningRuntime` / `registerPostDecisionCaptureContext`. That coordinator is used by EXI (`nexoraExecutiveIntelligenceExperience.ts`), not the RMS manager conversation entry.

## Central measurement

After Execution + RMS world step + Operator publication + `Did it work?`:

- CORE-OUT:1A captured observations: **0**
- NPS established Outcome rows (PARTIAL/MEETS/MIXED/etc.): **0**
- NPS observed numeric: **0**
- NPS learning durable: **0**
- Family E after tick-15 publication: still `UNKNOWN` / “not enough Outcome evidence”

World and Data Reality changed. Nexora Outcome knowledge did not. That is the SIM-TEST:10 question, and the answer is: **the conversation path never receives CORE-OUT observations**.

## Safety that did hold

- Ground Truth leak hits: **0** (13 unpublished Outcome/Learning asks)
- Premature success claims (product): **0** — unpublished and post-publication answers stayed too-early / unknown
- Durable Learning invented: **0**
- Family F causal question: **correct denial** of isolated causation (test regex over-fired on the word “caused” inside the denial)
- Two Execution chains coexisted (H/G/B): D1/E1 and D2/E2, max 2
- FIX1/FIX2/8-FIX1 focused suites: pass

## Observer noise

Raw S1 125 / S3 1. Same class as SIM-TEST:9: DUPLICATE_DECISION / DECISION_IDENTITY_DRIFT / DUPLICATE_EXECUTION when a second legitimate chain appears. Not product duplicates.

## Capability gap (not implemented here)

**Missing in the certified conversation loop:** Data Reality publication after CC:11 Execution does not open a CORE-OUT:1A window or capture linked KPI observations, so ECA:11/NPS:8 cannot evaluate expected vs observed.

Expected owner of the **seam**: MVP-OUT:1 runtime integration consumed by CC:5, still writing only through CORE-OUT:1A. Not a new Outcome engine.

Simulation cannot legitimately mint Outcome IDs without that seam.
