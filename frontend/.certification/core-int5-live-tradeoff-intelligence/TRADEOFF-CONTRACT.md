# CORE-INT:5 — Live Trade-off Contract

Identity: `CORE-INT:5/LiveTradeoffIntelligence`  
Epistemic authority: `CORE-INT:2`  
Cause/constraint authority: `CORE-INT:3`  
Priority authority: `CORE-INT:4` (issue context only — does not rank options)  
EI:4 reuse: `createScenarioTradeoff` / `ScenarioTradeoff` records only  
EI:4 certification trace: **unwired**. `createScenarioPriorityTradeoffTrace` is not live.

Frozen MVP: `MVP:1/NexoraManagerMVPReleaseBaseline` **1.2.0**

## Law

Trade-off Intelligence is a Core-owned, evidence-bounded comparison of real alternatives.

EXI presents. EXI does not extract gains/sacrifices, decide comparability, or choose a preferred option.

## Statuses

| Status | Meaning |
|---|---|
| `multi-option` | 2+ same-scope alternatives |
| `single-option` | Describe trade-offs; do not pretend to compare |
| `no-options` | No evaluated option is currently available |
| `not-comparable` | Multiple options exist but scopes differ |

## Unknown ≠ zero

Missing sacrifice is not “no sacrifice.”  
Missing cost is not cost = 0.  
Missing time is not faster/slower.

## Preferred option

Core does not independently choose. `preferredOptionId` is populated only from an existing recommendation authority that names a real option ID.

## Numeric score

`numericalScore = null`. No utility/weighted ranking.
