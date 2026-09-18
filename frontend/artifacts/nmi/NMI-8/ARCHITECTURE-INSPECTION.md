# NPA-T NMI:8 — Architecture Inspection

Inspection date: 2026-09-17.

Stop condition: live `/executive` hosts certified NMI:1–7 as a composer. Do not start DTH-EXP. Do not create a second management store.

## Remaining live-host gap (closed)

`/executive` previously listed Management Map sections with empty nodes and omitted `nmiAdvisorBundle` from CC:5. NMI:7 debt A.

## Narrowest existing composition point

`NexoraExecutiveShell` already owns:

- `dataRealityExperience.catalog` (canonical Object + context catalog)
- STAGE-PROD:1 Queue via `deriveNexoraMVPStageInteractionPresentation`
- Stage writer `selectNexoraMVPInteractionSubject`
- Advisor path `executeNexoraConversationalExperience`

That shell is the host. NMI:8 adds `hostNmiLiveManagementIntelligence({ catalog, queueEntries, focusedSubjectId })` as a read composer in the same place. No new application state authority.

## Inspected production path

| Concern | Existing authority | NMI:8 use |
| --- | --- | --- |
| Business/Project | BCA:1 | contextKind defaults UNKNOWN; not guessed |
| Object catalog | NEX-MVP catalog | IDs preserved; generic objects not reclassified as PROCESS |
| Goals | MO:1 registered Goal | included when associated Problem is present |
| Processes/Operations | none classified in live catalog | section count 0 |
| KPI | none in live catalog | MISSING |
| Data Reality | RDI:1 / catalog | observed IDs optional; no NMI writer |
| Problems/Risks/Scenarios/Decisions/Executions | catalog contextSubjects | mapped to NMI kinds |
| VAI | optional `vaiVariables` | omitted unless supplied |
| Queue | STAGE-PROD:1 | Attention source IDs |
| Stage | `selectNexoraMVPInteractionSubject` | NMI:6 projection then existing writer |
| Advisor | CC:5 | live `nmiAdvisorBundle` |
| RMS | sealed Ground Truth | not imported by live host |

## Pipeline

Canonical Authorities → NMI:1 UMM → NMI:2 Map → NMI:3 relationships → NMI:4 roadmap → NMI:5 Attention/Map → NMI:6 Stage projection → NMI:7 Advisor overlay → existing UI/Stage/Advisor.
