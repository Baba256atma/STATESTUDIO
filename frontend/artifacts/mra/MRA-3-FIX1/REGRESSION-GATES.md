# MRA:3-FIX1 — Regression Gates

No required gate was skipped or weakened.

| Gate | Result | Notes |
| --- | --- | --- |
| FIX1 focused (`mra2ManagerReadiness.runtime.test.ts`) | PASS | C1–C8 plus FIX1 journeys |
| NCA-POST 1–3, DATA-ADV inquiry, ECA mutation, CC:11 execution planning | PASS 95/95 | Combined focused run |
| CC:10 / ECA commitment | PASS 50/50 | `executiveDecisionCommitment` + `ecaExecutiveCommitment` |
| NXA L1 | PASS | 2026-09-10 |
| NXA L2 | PASS | After restricting click/deictic so `Show its problems` stays on Capacity |
| NXA L3 | PASS | |
| NXA L4 omnibus | FAIL | `nexoraMvpFinal62ConversationContinuity.test.ts` CONTEXT_REFERENCE_FAILURE on corpus `Explain it` / `What's going on with that?`; explicit subject vs inherited context; `nexoraMvpFinal63SmartClarification.test.ts` false-negative on `Explain that.` |
| L4 typecheck / eslint / build / live smoke | NOT RUN | Omnibus blocked the level |
| MRA:3 isolated replay | Ran into this folder | 155 turns + 52-turn LONG-50; leak regex empty |
| Live `/executive` | PASS host | `mra-3-live-simulation.mjs` → `live-audit.json`, `errorCount: 0` |

Zero-Failure: FIX1 cannot be certified while L4 required omnibus is failed.
