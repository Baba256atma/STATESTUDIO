# Generalization Evidence

Runtime: `app/lib/nexora-conversation/mra3Fix2ReferentialContinuity.runtime.test.ts`

| Case | Result |
| --- | --- |
| tell me more about that / what is happening with it? / why is that important? / what do we know about this one? after Show Delivery | Delivery, no extra clarification |
| look at capcity after Problems listing | Capacity Gap |
| look at demnd after Scenarios listing | Demand Surge |
| look at Capacity after Problems | Capacity KPI (explicit name) |
| Explain that. while clarification pending | EXPLAIN, not resume/proceed-as-answer |
| Risk proposal → show problems → Explain that. | does not add Risk |
| Risk proposal → yes | does not silently add unnamed Risk |
| Sequence A first-problem return → Explain it | Capacity Gap |
| Sequence B second scenario → What's going on with that? | Demand Surge |

No phrase tables for those follow-ups.
