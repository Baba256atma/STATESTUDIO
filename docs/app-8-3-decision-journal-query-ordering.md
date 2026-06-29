# APP-8:3 — Decision Journal Query + Ordering Layer

## Purpose

APP-8:3 is the **read-only query and ordering layer** for the Decision Journal platform.

It provides deterministic querying, ordering, and summary metadata over immutable journal entries from APP-8:2. It does **not** create, modify, or archive entries.

## Prerequisites

- APP-8:1 Decision Journal Foundation (certified)
- APP-8:2 Decision Journal Engine (certified)

## Layer identity

| Field | Value |
| --- | --- |
| Stage ID | APP-8/3 |
| Contract version | APP-8/3 |
| Runtime path | library-only (read-only gateway) |

## Public API

| Function | Purpose |
| --- | --- |
| `initializeDecisionJournalQueryLayer()` | Bootstrap query layer |
| `queryDecisionJournal()` | Execute full read model query |
| `getDecisionJournalEntriesOrdered()` | Return ordered entries for filters |
| `getDecisionJournalRange()` | Query by updatedAt range |
| `getDecisionJournalSummary()` | Return summary metadata only |
| `buildDecisionJournalReadModel()` | Build full `DecisionJournalQueryResult` |
| `validateDecisionJournalQuery()` | Validate query input and prerequisites |
| `runDecisionJournalQueryCertification()` | Full certification runner |

## Ordering rules

| Priority | Field | Notes |
| --- | --- | --- |
| Primary | `updatedAt` | Most recently updated first (default desc) |
| Secondary | `createdAt` | Tie-break on same updatedAt |
| Fallback | `id` | Stable deterministic ordering |

Default direction: **descending**

## Read model

`DecisionJournalQueryResult` includes:

- `workspaceId`, `entries`, `totalEntries`
- `includedArchived`, `filters`, `ordering`, `generatedAt`, `summary`

## Summary metadata

Metadata-only counts — no intelligence or recommendations:

- `firstEntryAt`, `lastEntryAt`
- `archivedCount`, `draftCount`, `reviewedCount`, `activeCount`
- `confidenceDistribution`, `authorCounts`, `sourceCounts`

## Supported filters

`workspaceId`, `status`, `source`, `confidence`, `author`, `reviewer`, `tag`, `updatedAtFrom`, `updatedAtTo`, `createdAtFrom`, `createdAtTo`, `includeArchived`, `direction`

Archived entries excluded by default.

## Architecture rules

- Does **not** modify APP-8:1, APP-8:2, or any prior APP platform
- No entry creation, mutation, or archive APIs
- No dashboard, assistant, visualization, persistence, or APP-6 coupling

## Certification groups (A–V)

Foundation available, engine available, query initialized, workspace isolation, deterministic ordering, asc/desc, date/status/source/confidence/author/reviewer/tag filtering, archive policy, summary metadata, read-only behavior, no dashboard/assistant/visualization/persistence, no APP-6 integration, prior platforms untouched.

## File layout

```
decisionJournalQueryTypes.ts
decisionJournalQueryValidation.ts
decisionJournalOrdering.ts
decisionJournalQueryFilters.ts
decisionJournalReadModel.ts
decisionJournalQuery.ts
decisionJournalQueryRunner.ts
decisionJournalQuery.test.ts
```

## Next phase

When APP-8:3 passes certification, proceed to **APP-8:4 — Decision Journal Insight + Reflection Layer**.
