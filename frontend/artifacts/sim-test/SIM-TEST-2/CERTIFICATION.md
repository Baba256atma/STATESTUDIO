# NPA-T SIM-TEST:2 — CSV / Real Data Ingestion Simulation

**Status: CERTIFIED**

Date: 2026-09-27.

SIM-TEST:2 extends the certified SIM-TEST:1 harness with its reserved INGESTION mode while preserving FAST. The existing RMS Operator projects only observable records into deterministic, versioned CSV files. Those files enter Nexora through `prepareCsvRealDataImport`, the production `RDI:2/NexoraCsvRealDataVerticalSlice` Gate, and are committed only by `commitPreparedCsvRealDataImport`.

No CSV, ERP, CRM, PMO, or File Agent was added. No simulator parser, mapper, Gate, Data Reality writer, semantic confirmation, hidden Ground Truth channel, timer, or refresh race was added.

Architectures certified:

- FAST: Operator → RDI/Data Reality.
- INGESTION: Operator → CSV → existing RDI:2 Gate → RDI:1 → Data Reality → real Nexora.

Four domains ran through one INGESTION harness: Manufacturing, Project, Logistics, and Service. Ten required source files were generated, with 20 version instances across the certification journeys. Nine Manager turns and 34 ticks completed. All four harness runs passed, with no S0 and no auto-repair.

The Observer preserved six S1 product findings: DATA_REALITY 3, OPERATOR 2, and ADVISOR 1. They are documented in `KNOWN-DEBT.md` and do not represent a harness failure or regression of the historical SIM-TEST:1 certification.

Gates:

- SIM-TEST:2 focused: 13 groups pass / 0 fail, covering requirements 1–35.
- SIM-TEST:1 focused: 11 pass / 0 fail.
- Existing RDI:2 CSV Gate: 23 pass / 0 fail.
- RMS:1–10 + FINAL: 59 pass / 0 fail.
- Stage assertion owner: 12 pass / 0 fail.
- NXA Level 1 focused funnel: pass / 0 failed / 0 skipped.
- Changed-path ESLint: pass / 0 errors.
- Full TypeScript: pass / 0 errors with an 8 GB Node heap.
- Production Next.js build: pass.
- Browser runtime proof: pass; no browser warnings or errors.

## Final status

**NPA-T SIM-TEST:2 — CERTIFIED**

STOP. SIM-TEST:3 was not started.
