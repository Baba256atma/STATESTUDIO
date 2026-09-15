# Cross-object tests

File: `app/lib/nexora-conversation/mra3RecertFix1DeicticFidelity.runtime.test.ts`

| Family | Setup | Follow-up | Expected |
| --- | --- | --- | --- |
| Scenario A | J4 then Demand Surge | tell me more about it | Demand Surge |
| Scenario B | Capacity Expansion Plan | tell me more about it | Capacity Expansion Plan |
| Scenario C | Pricing Response | tell me more about it | Pricing Response |
| Problem | Capacity Gap | tell me more about it | Capacity Gap |
| KPI | look at Capacity | tell me more about it | Capacity |
| Risk | Risk | investigate it | Risk (not Expansion Plan) |
| Decision | show scenarios → Approve Repricing → explain it | tell me more about it | continuity `ctx-decision-reprice` |
| Execution | Pricing Rollout | what else do we know about it? | continuity `ctx-execution-rollout` |
| Data | unique CSV inventory | tell me more about it | CSV file |
| Historical | Scenario → CSV → Capacity Gap → explain it | explain it | Capacity Gap |
| Ambiguity | scenarios → CSV → what can Nexora do? | tell me more about it | clarify |
