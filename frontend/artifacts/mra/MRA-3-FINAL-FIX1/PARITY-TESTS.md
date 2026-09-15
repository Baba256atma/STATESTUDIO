# Parity tests

Isolated: `app/lib/nexora-conversation/mra3FinalFix1Parity.runtime.test.ts`  
Live: `scripts/mra-3-final-fix1-live-audit.mjs`  
Shell invariant: `NexoraExecutiveShell.test.tsx` test 21 (no DATA-ADV early-return before CC:5).

| Test | Sequence | Expected |
| --- | --- | --- |
| A | Scenarios → CSV → Capacity Gap → explain it | Capacity Gap |
| B | Scenarios → CSV → Margin Pressure → explain it | Margin Pressure |
| C | CSV → KPI (`look at Capacity`) → explain it | KPI Capacity |
| D | Problem → Scenario → explain it | Scenario |
| E | Scenario → CSV inventory → explain it | CSV (FIX2-FIX1) |
| F | Decision → Execution → explain it | newest Execution |
| G | CSV → Problem → HELP → ambiguous it | clarification |
| Stage | A + click another Stage object + `look at Capacity Gap` + explain it | Capacity Gap; Stage reconverges |

FIX2-FIX1 suite remains required: `mra3Fix2Fix1CrossDomain.runtime.test.ts`.
