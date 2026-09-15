# NPA-T NPS:FINAL — Architecture freeze

Inspection date: 2026-09-15.

Runtime composition in `conversationalExperienceOrchestrator.ts` is sequential:

NPS:2 understanding → NPS:3 evidence/cause → NPS:4 options → NPS:5 comparison/recommendation → NPS:6 commitment → NPS:7 execution/monitoring → NPS:8 outcome/learning.

`npsPath` is taken from NPS:8 only for `OUTCOME_REVIEW` / `REASSESSMENT` / `RESOLVED`; otherwise NPS:7 path. NPS:6 does not skip to NPS:8.

## Authority map (actual)

| Concern | Owner |
| --- | --- |
| Problem truth | EI / Manager–Object canonical Problem |
| Path | NPS:1–8 composition |
| Conversation | ECA:1–12 |
| Investigation | FINAL:5 / CORE-INT |
| Evidence | Data Reality / CC:8 |
| Contributors | CORE-INT:3 |
| Scenario write | CC:9 |
| Comparison | NCA-POST:4 |
| Recommendation | ECA:7 / NCA:4 |
| Commitment | ECA:8 |
| Decision | CC:10 / CC:10R |
| Execution readiness | ECA:9 |
| Execution | CC:11 |
| Monitoring | ECA:10 |
| Outcome | CORE-OUT / ECA:11 |
| Learning | CORE-OUT:2 / ECA:12 (`writesMemory: false`) |
| Theatre | DTH / Director |

NPS remains READ / COMPOSE / ROUTE / PROJECT.
