# APP-8:7 — Decision Journal API + Consumer Contract Layer

## Purpose

APP-8:7 is the official public access layer for Decision Journal. Future Workspace, Dashboard, Assistant, Report, Export, and Visualization consumers must use this facade only.

## Public Entry Points

- `createDecisionJournalApi()`
- `getDecisionJournalApi()`
- `getDecisionJournalApiManifest()`
- `validateDecisionJournalApiContract()`
- `getDecisionJournalConsumerContract()`
- `validateDecisionJournalConsumerAccess()`
- `runDecisionJournalApiCertification()`

## API Groups

| Group | Delegates To | Operations |
|-------|--------------|------------|
| `entries` | APP-8:2 | createEntry, getEntryById, getEntries, updateEntryMetadata, archiveEntry |
| `query` | APP-8:3 | queryJournal, getOrderedEntries, getRange, getSummary |
| `reflection` | APP-8:4 | buildReflection, extractInsights, getReflectionSummary |
| `quality` | APP-8:5 | buildEvidenceAssumptionModel, evaluateEvidence, evaluateAssumptions, detectQualityFlags |
| `retrospective` | APP-8:6 | buildRetrospectiveModel, evaluateOutcome, evaluateRetrospective |
| `certification` | APP-8:7 | runCertification |

## Consumer Contract Matrix

| Consumer | Read-Only | Mutation | Allowed Groups | Forbidden Groups |
|----------|-----------|----------|----------------|------------------|
| WorkspaceConsumer | No | Yes | entries, query, reflection, quality, retrospective | certification |
| DashboardConsumer | Yes | No | query, reflection, quality, retrospective | entries, certification |
| AssistantConsumer | Yes | No | query, reflection | entries, quality, retrospective, certification |
| VisualizationConsumer | Yes | No | query, reflection | entries, quality, retrospective, certification |
| ReportConsumer | Yes | No | query, reflection, quality, retrospective | entries, certification |
| ExportConsumer | Yes | No | query, reflection, quality, retrospective, certification | entries |
| FutureAppConsumer | Yes | No | query | entries, reflection, quality, retrospective, certification |

## Direct Import Guard

Consumers MUST import APP-8:7 public APIs only. Direct imports from internal APP-8 modules are forbidden.

## Constraints

- No UI, dashboard, assistant, or visualization implementation
- No persistence
- No APP-6 integration
- No AI generation
- Prior APP-8:1–8:6 platforms remain untouched

## Certification

Certification verifies foundation through retrospective availability, facade delegation, manifest validity, consumer enforcement, and architecture boundaries (checks A–Y).
