# Live evidence

Source: `scripts/mra-3-recert-fix2-live-audit.mjs`

Machine-readable result: `live-audit.json`  
Visual proof: `live-proofs.png`

Live `/executive` result: **PASS**

- Checks: 9/9 passed
- Page errors: 0
- Architecture-copy leaks: 0

## Targeted investigation trace

| Layer | `Demand Surge` | `investigate it` |
| --- | --- | --- |
| NLU operation | FOCUS | INVESTIGATE |
| Continuity subject | Demand Surge | Demand Surge |
| Active subject | `ctx-scenario-demand` | `ctx-scenario-demand` |
| Investigation subject | `ctx-scenario-demand` | `ctx-scenario-demand` |
| Manager–Object active | `ctx-scenario-demand` | `ctx-scenario-demand` |
| Experience lane | advisor | explain |
| Attention state | MISSING_GOAL | DECISION_REQUIRED |
| Final response subject | Demand Surge | Demand Surge |

Attention changed while the subject did not. This proves that attention remains advisory and does not become referential authority for the deictic investigation.

## Selection and explicit-change controls

- With no established subject, `What should I investigate?` stayed in the advisor lane and requested clarification rather than inventing a referent. Existing investigation-selection intelligence remained available.
- After Demand Surge, `Investigate Margin Pressure` explicitly changed continuity, investigation, and Manager–Object active subject to `ctx-problem-margin`, and the response concerned Margin Pressure.

## Mandatory live proof set

`investigate it`, `look deeper into it`, `what else do we know about it?`, `tell me more about it`, `how sure are you?`, and `what impact could it have?` all remained on Demand Surge. The historical `explain it` then `investigate it` sequence also remained on Demand Surge.
