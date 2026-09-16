# SYS:1 — Architecture integration map

Inspection date: 2026-09-15. Audit only. Production source unchanged.

## Live conversational path

Manager message
→ NCA meaning / conversation kernel
→ ECA working context (referent, mode, confirmation)
→ NPS:2→3→4→5→6→7→8 composition in `conversationalExperienceOrchestrator.ts`
→ Canonical readers (MO, Data Reality, CC:8–11, CORE-OUT)
→ Director plan + `projectNexoraDecisionTheatreFoundation`
→ Advisor response + Stage/Theatre projection
→ Manager

NPS path selection: NPS:8 when `OUTCOME_REVIEW` / `REASSESSMENT` / `RESOLVED`; else NPS:7 if that path has a state; else NPS:6. No NPS:6→NPS:8 bypass.

## Data-dependent path

CSV / Data Source
→ Data Reality parse + semantic mapping
→ DATA-ADV / confirmation (`CAP_AV`, `BKL` remain unconfirmed until confirmed)
→ CC:8 Evidence
→ NPS:3 contributor/cause projection
→ Advisor
→ Stage/Theatre (presentation)

## Action path

Recommendation (ECA:7 / NCA:4 / NPS:5)
→ Manager preference / commitment (ECA:8)
→ CC:10 Decision
→ ECA:9 / NPS:7 readiness
→ Manager start
→ CC:11 Execution
→ ECA:10 monitoring
→ CORE-OUT / ECA:11 Outcome
→ NPS:8 / ECA:12 Learning (non-durable on `/executive`)

## Identity crossing points

| Boundary | What must stay stable | Observed in SYS:1 |
| --- | --- | --- |
| ECA ↔ NPS | `npsProblemId` / active Problem | Holds on named + deictic NPS follow-ups (`Investigate it`, `Why?`, options, compare) |
| Stage click → conversation | Focused Object = Advisor subject | **Breaks** after Problems collection: Stage = Capacity Gap, Advisor/ECA/NPS = Margin Pressure |
| Executive snapshot → conversation | `currentSubjectId` vs `presentedSetKind` | Click syncs `currentProblem` to Capacity Gap but `presentedSetKind` remains `problems` with both members |
| NPS → Theatre | Path purpose vs `sceneIntent` | No `COMPARING_OPTIONS` as `REVIEW_EXECUTION` without Execution on audited conversational turns |
| Decision → Execution | CC:10 success ≠ CC:11 start | Holds on live conversational journey |
