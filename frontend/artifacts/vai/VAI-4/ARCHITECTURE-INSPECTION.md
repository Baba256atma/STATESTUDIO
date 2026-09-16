# NPA-T VAI:4 — Architecture Inspection

Inspection date: 2026-09-16.

Stop condition: Advisor Variable Analysis only. Do not start VAI:5.

## Smallest integration

VAI:4 is a read-only conversational overlay on certified CC:5 `executeNexoraConversationalExperience`. It consumes VAI:1 Variables, VAI:2 contextual roles, and VAI:3 evidence/causal safety, then composes manager-facing text. It is not a second Advisor, intent authority, or referent resolver.

## Reused authorities

| Concern | Owner | VAI:4 |
| --- | --- | --- |
| Conversation / Advisor | CC:5 / NXA / NCA / ECA | Overlay `presentedResponse` only when a bounded Variable-analysis sub-intent matches and a VAI bundle is supplied |
| Referent / Stage focus | existing CC referent + Stage `focusedSubject` | Focal override; no VAI pronoun resolver |
| Variables | VAI:1 | Consume |
| Contextual roles | VAI:2 | Consume |
| Evidence / causal claims | VAI:3 + CC:8 + CORE-INT:3 | Consume; never upgrade |
| NPS | NPS:1–8 | Not replaced; no solution path created |
| Recommendation / Decision / Execution / Stage | existing | Unchanged |

## Not introduced

Second Advisor, NLU, referent resolver, Variable store, Evidence authority, causal engine, Data Reality, Stage mutation, Theatre Variable symbols, intervention prediction, scenario simulation, recommendation engine.
