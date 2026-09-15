# Live `/executive` audit

Authority: `scripts/mra-3-final-recert-2-live-simulation.mjs`  
Machine evidence: `live-audit.json`, `live-proofs.png`  
Identity: `NPA-T MRA:3-RECERT-2/LiveManagerSimulation`

Prior FIX artifacts were not used as a pass. This run used the current integrated product (`next start` after NXA L4 production build).

## Headline

- Live page errors: **0**
- Architecture-name leakage (NCA/NXA/ECA/CC codes/internal IDs in manager replies): **0**
- Long session: **57** manager turns, no conversational reset
- Mandatory Capacity Gap `explain it` / `tell me more about it` after Stage click-away: **PASS**
- Mandatory Demand Surge `explain it` / `tell me more about it`: **PASS**
- Demand Surge how-sure / impact: **PASS** (Demand Surge)
- Explicit `Tell me more about Capacity Expansion Plan.`: **PASS** (Expansion Plan)
- Isolated vs live: isolated deictic `investigate it` stayed Demand Surge; **live dedicated deictic journey did not**

## Automated live checks

| ID | Result | Independent classification |
| --- | --- | --- |
| S1-HIST-problem | PASS | Capacity Gap after Stage click |
| S1-HIST-problem-more | PASS | Capacity Gap |
| S1-HIST-scenario | PASS | Demand Surge |
| S1-HIST-scenario-more | PASS | Demand Surge |
| A-csv | PASS | CSV inventory then `explain it` describes the file |
| B-problem | PASS | Capacity Gap |
| C-surge | PASS | Demand Surge `tell me more` |
| D-kpi | FAIL (script) | Clarified Problem vs KPI — **not S1**; honest homonym |
| E-execution | PASS | Capacity Expansion |
| F-clarify | FAIL (script) | Reply was “Are you asking about the KPI or the execution?” — **clarification held**; regex miss |
| deictic-explain / more / why / sure / impact / explicit-change | PASS | |
| deictic-investigate / deeper / what-else | FAIL | **S1** — Margin Pressure while Stage/MO still Demand Surge |
| typo-capacity | FAIL (script) | Disambiguation of “Capcity” — **S2** |

## Page errors

`errors`: `[]`  
`zeroPageErrors`: true
