# NPA-T SIM-TEST:6-FIX18 — Certification

**FIX18: CERTIFIED**

All 14 program-caused MRA/ECA referent-fidelity regressions are removed by generic repairs in the owning layers. FINAL's 13, plus one Cluster B regression that FINAL had counted as shared with `HEAD`. The external suite now fails only the three unchanged pre-program `HEAD` tests.

## External MRA/ECA gate

`tsx --test app/lib/nexora-conversation/*.test.ts`: 1061 tests, 1058 pass, 3 fail, 0 skipped, 0 cancelled.

- **Program-caused failures:** 0.
- **Remaining `HEAD` failures:** 3. Each fails the same assertion as at `HEAD`:
  - "N — Explain visible actor without prior focus": `true !== false`.
  - "H distinguishes listed/planned Execution objects…": the reply is "Current Executions: Capacity Expansion, Pricing Rollout."
  - "F asks the smallest useful clarification…": the named-options clarification is missing. The reply text differs from `HEAD` but has not changed at any FIX18 stage.
- **Former `HEAD` failures that now pass:**
  - "E recovers the uniquely defensible earlier Problem" still passes.
  - "MRA:3-FIX1 C1 first problem then it stays on that Problem" now passes through the generic Cluster B repair. Reverting only B makes it fail again.

## Guards

| Suite | Result |
| --- | --- |
| FIX18 file (A1–A6, B1–B8, C1–C5) | 18/18 |
| R3–R9, FIX9, FIX10, FIX15–FIX17 guard set | 92/92, then 83/83 after the crash check |
| manager-object (FINAL:6.1–6.4, NCA/NCA:2, R5–R7, Smart Clarification, Advisor contracts) | 659/659 |
| sim-test folder (harness, FIX10–FIX18, R2–R9, Observer, long session) | 216/216 |
| conversational-control, NPS, director, RMS (CC:1, CC:10) | 627/636. The 9 failures are the recorded DIRECTOR-1 `import.meta.dirname` runner debt under `tsx`, unchanged. |

## Decision and Execution integrity

- **Decision count, Decision identity, Execution identity:** none changed.
- **Evidence:**
  - The FIX15 guards pass: exactly one CC:10 Decision.
  - A6 asserts no commitment and unchanged Decision and provenance counts.
  - The Impatient signature is unchanged.

## SIM-TEST:6

Regenerated after the crash check:

- `nexoraSimulationLongSessionJourney.test.ts`: 3/3, 7 journeys.
- S0 0, S1 0, S2 0, S3 2 (the known NPS `SUBJECT_LOSS`).
- Harness failures: 0.
- Cross-run isolation: PASS.

## Signatures

| Journey | Before | After |
| --- | --- | --- |
| FAST | `fnv1a32:3aa7cfc6` | `fnv1a32:3aa7cfc6` |
| Impatient | `fnv1a32:a5d79e5e` | `fnv1a32:a5d79e5e` |

No semantic change.

## Static and safety checks

- **Typecheck:** 0 errors.
- **eslint:** clean on the FIX18 and restored files.
- **diff-check:** clean.
- **Ground Truth leakage:** none.
- **Object-, profile- or turn-specific logic:** none.

## NXA funnel

- **L1:** 19/19.
- **L2:** 453/453.
- **L3:** 48/48.
- **L4:** 7/7 required tasks, barrier allowed, 0 running, 0 uninspected.
  - omnibus 1681/1681
  - dir-inventory 58/58
  - typecheck, eslint, diff-check, build: pass
  - live-smoke: `ok`, zero page errors

## Working tree audit

- **Production changes:** the 4 FIX18 files, plus the 3 restored certified hunks, which match their certified content byte-for-byte.
- **Temporary or debug code:** none in `app/`. The probe files were removed.
- **New authority or store:** none.
- **Tests skipped or weakened:** none. A6 was made stricter.
- **Observer changes:** none.
- **Left untouched on purpose:** the concurrent attempt's files, per the user's instruction:
  - `frontend/.tmp-f18-*`
  - `/tmp/f18-diff`

## Remaining debt (unchanged, out of scope)

- The 3 `HEAD` failures above.
- DIRECTOR-1 runner debt.
- Ordered-collection "the other one" read as index 1.
- Scenario explain capture of a contrastive follow-up.

See `ROOT-CAUSE.md` for all of these.

## Next phase

SIM-TEST:6 is ready for its FINAL RECERTIFICATION (NPA-T SIM-TEST:6 — FINAL RECERTIFICATION). That phase has not been started.
