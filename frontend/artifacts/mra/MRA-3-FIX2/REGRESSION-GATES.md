# Regression Gates

## FIX1 behaviors still passing

`mra2ManagerReadiness.runtime.test.ts` MRA:3-FIX1 cases:

- first problem → explain it → Capacity Gap
- compare → explain the second one → Demand Surge
- unnamed add Risk → topic change → yes does not write Risk
- leak suppression
- Overview Problems SHOW Stage membership (no leftover Watch labels)
- Stage click Margin Pressure → explain it (existing click case)

## Other gates

| Gate | Result |
| --- | --- |
| FINAL:6.2 | PASS |
| FINAL:6.3 | PASS |
| NXA L1 | PASS |
| NXA L2 | PASS |
| NXA L3 | PASS |
| NXA L4 omnibus + dir + typecheck + eslint + diff-check + production build + live-smoke | PASS (after final TS repair) |
| ECA mutation proposal suite | PASS (22 tests with FIX2 file) |
| TypeScript | PASS as L4 `l4-typecheck` after last production edit |
| Production build | PASS as L4 `l4-build` |

New S0/S1 from these gates: none.
