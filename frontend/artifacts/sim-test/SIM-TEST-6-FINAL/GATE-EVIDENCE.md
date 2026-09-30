# SIM-TEST:6 FINAL (post-FIX18) — Command and Gate Evidence

All runs use `frontend/`, `NODE_OPTIONS=--max-old-space-size=8192` and `./node_modules/.bin/tsx`.

| Gate | Command | Result |
| --- | --- | --- |
| Integrity | content-hash snapshot of 15,497 `app/**/*.ts(x)` at start and end | identical: FINAL changed no production file |
| FIX18 and restored hunks | presence check plus byte comparison with the pre-rewrite snapshot | all 4 FIX18 hunks present; R7 ×2 and FIX15 hunks identical |
| External MRA/ECA | `tsx --test app/lib/nexora-conversation/*.test.ts` | 1058/1061; failures N, F, H (`HEAD`: 1055/1060) |
| SIM-TEST folder | `tsx --test app/lib/sim-test/*.test.ts` | 216/216, 0 skipped |
| SIM-TEST:6 journeys | `nexoraSimulationLongSessionJourney.test.ts` (7 journeys) | 3/3; S0 0, S1 0, S2 0, S3 2; harness failures 0; isolation PASS |
| Determinism replay | second run of the journeys; `diff -r` of the regenerated `SIM-TEST-6/` | identical except the wall-clock note (8468 ms vs 4655 ms) |
| FIX18 journey differential | journeys on a `/tmp` copy without the 4 FIX18 hunks | all 6 signatures and all findings identical |
| manager-object | `tsx --test app/lib/manager-object/*.test.ts` | 659/659 |
| CC / NPS / NMI / RMS | `tsx --test app/lib/{conversational-control,nexora-problem-solving,nmi,rms}/*.test.ts` | 767/767 |
| data-reality / decision / nex-mvp | `tsx --test …` | 1198/1215; the 17 failures are all pre-program (`HEAD`: 1174/1193) |
| director | `tsx --test` and `node --test` on `app/lib/director/*.test.ts` | 74/83 and 77/78: the recorded runner debt, unchanged |
| Typecheck | `npm run typecheck` | 0 errors |
| eslint | `npx eslint` on all program-changed `app` files | 0 errors, 1 warning (test file) |
| diff-check | `git diff --check HEAD -- app`, plus a trailing-whitespace scan of untracked files | clean |
| Leakage / escape scan | added lines in program production files | no Ground Truth import into Nexora code; no `@ts-ignore`, `@ts-expect-error`, `console.log`, `.skip` or `.only` |
| NXA L1 | `npm run nxa:funnel -- --level 1` | 19/19 |
| NXA L2 | `--level 2` | 453/453 |
| NXA L3 | `--level 3` | 48/48 |
| NXA L4 | `--level 4` | 7/7 required, barrier allowed, 0 running, 0 uninspected: omnibus 1681/1681, dir-inventory 58/58, typecheck, eslint, diff-check, build, live-smoke (`ok`, zero page errors, `/executive`) |

## Impatient turn evidence (current run)

| Turn | Utterance | Canonical subject | Advisor | Stage | Decisions | Executions |
| --- | --- | --- | --- | --- | --- | --- |
| T3 | Capacity. Details. | obj-capacity | obj-capacity | obj-capacity | 0 | 0 |
| T6 | Options. | obj-capacity | — | obj-capacity | 0 | 0 |
| T8 | Go with B. | cc10:decision:…do-nothing:v1 | obj-capacity | obj-capacity | 1 | 0 |
| T9 | Yes. Decide. | same Decision | obj-capacity | obj-capacity | 1 | 0 |
| T10 | Start it. | cc9 intervention Scenario (T10 debt) | obj-capacity | obj-capacity | 1 | 1 |
| T14 | Back to capacity. | obj-capacity | obj-capacity | obj-capacity | 1 | 1 |
| T16 | Capacity again. | obj-capacity | obj-capacity | obj-capacity | 1 | 1 |
| T30 | The previous one. | obj-inventory | obj-inventory | obj-inventory | 1 | 1 |
| T31 | Anything else? | obj-inventory | obj-inventory | obj-inventory | 1 | 1 |

Findings: S0 0, S1 0, S2 0, S3 0. Signature `fnv1a32:a5d79e5e`.

## FAST turn evidence (current run)

- T3 "Tell me more about the capacity issue." → obj-capacity.
- T9 "Let's go with option B." → exactly one Decision.
- T11 "Start it." → one Execution.
- T16 "Go back to the capacity issue.", T19 "Return to capacity." and T30 "Go back to capacity." → obj-capacity, with the Advisor and Stage aligned (R9/FIX11).
- T21 "What does the production data show?" → obj-capacity: the FIX10 defect is absent.
- T22 "What about Capacity Theatre?" → clarification.

Findings: S0 0, S1 0, S2 0, S3 0. Signature `fnv1a32:3aa7cfc6`.
