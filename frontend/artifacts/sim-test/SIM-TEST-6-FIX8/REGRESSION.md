# Regression

Focused funnel before long rerun: T88 focused, explicit-switch matrix in `nexoraSimulationReferentFix8.test.ts`, CC:1 `conversationalIntent.test.ts`, FIX7 T85–T89 Stage, FIX6 T83, FIX5 T77/T78, FIX4 T71, FIX3 T69, FIX2 T64, FIX1 T50, SIM-TEST:5 manufacturing lifecycle, FAST.

| Gate | Result |
| --- | --- |
| T85 historical Capacity | PASS |
| T86–T87 Stage persist Capacity | PASS |
| T88 Stage Inventory | PASS |
| T89 Stage persist Inventory | PASS |
| T83 FIX6 | PASS |
| T77/T78 FIX5 | PASS |
| T71 FIX4 `The delivery issue.` → obj-delivery | PASS |
| T69 FIX3 unknown Supplier clarify | PASS |
| T64 FIX2 Delivery problem | PASS |
| T50 FIX1 | PASS |
| SIM-TEST:5-FIX3 lifecycle | S0=0 |
| FAST | S1=0 |
| TypeScript | PASS (`tsc --noEmit`, 8GB heap) |
| Changed-path ESLint | PASS |
| Production build | NOT RUN — final certification deferred |
| Browser | NOT RUN — conversation/referent state proven in deterministic tests |
