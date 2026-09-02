# Test Evidence

## Baseline reproduction

- Focused RDI:2 + DTH suites: 44/44 passed before implementation.
- Expected: CSV path and Theatre regressions green. Actual: green; first divergence was absence of a source projection, not broken ingestion.

## DATA-UX:1 focused proof

`nexoraDecisionTheatreDataObjectProjection.test.ts` proves:

- one stable projection per canonical source identity across repeated projection;
- canonical source/snapshot/Data Reality references;
- immutable `DATA_OBJECT` family classification;
- Director and Stage compatibility values;
- no automatic Evidence, causality, relationship, business truth, or writes;
- rejection of workspace/source identity divergence.

Focused implementation + CSV + DTH regression run: 44/44 passed.

## Final gates

- Test Funnel Level 1 (Focused): passed; 1/1 required task, 0 failed/skipped/running/uninspected.
- Level 2 (Layer): passed; 1/1 required task, 0 failed/skipped/running/uninspected.
- Level 3 (Integration): passed; 1/1 required task, 0 failed/skipped/running/uninspected.
- Level 4 (Milestone): passed; 7/7 required tasks, including executive omnibus, Director inventory, TypeScript, scoped ESLint, diff check, production build, and live `/executive` smoke. No required or nonessential tasks remain running.
- Explicit TypeScript: passed with an 8 GB Node heap. The first concurrent attempt was environmental `heap out of memory`, not a test/type error.
- Full repository ESLint: passed with 0 errors and 484 existing warnings; DATA-UX:1 files introduced no reported warning.
- Explicit production build: passed after rerun with network access. The sandboxed attempt could not fetch configured Google Fonts.
- `git diff --check`: passed.
