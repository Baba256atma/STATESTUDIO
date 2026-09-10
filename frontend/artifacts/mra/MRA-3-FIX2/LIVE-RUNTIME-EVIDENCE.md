# Live Runtime Evidence

## NXA L4 live smoke (`l4-live-smoke`)

- URL: `/executive`
- Page errors: 0
- `ok: true`
- Artifact: `frontend/.certification/nxa-6-prep-conversation-diagnostics/live-smoke.json`

## Sequences A–E (runtime orchestrator, same catalog as /executive)

Recorded in `mra3Fix2ReferentialContinuity.runtime.test.ts` after L4. All PASS.

| Seq | Path | Result |
| --- | --- | --- |
| A | Problems → Capacity Gap → Explain Delivery → first problem → Explain it | Capacity Gap, EXPLAIN |
| B | Scenarios → compare → second one → What's going on with that? | Demand Surge, EXPLAIN |
| C | Show Delivery → Show Capacity → Explain that. (clarify) → Explain that. | stays EXPLAIN, not resume |
| D | Problems listing → look at capcity | Capacity Gap, not Capacity KPI |
| E | Scenarios listing → look at demnd | Demand Surge |

Browser live-smoke did not replay A–E click-by-click; it proved `/executive` loads with zero page errors after the final repair. Sequence proofs are the orchestrator runtime used by that shell.
