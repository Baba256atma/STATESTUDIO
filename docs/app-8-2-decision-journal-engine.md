# APP-8:2 — Decision Journal Engine

## Purpose

APP-8:2 is the **immutable runtime engine** for the Decision Journal platform.

Where APP-6 (Decision Timeline) records **what** decision occurred, APP-8 records **why** — executive reasoning, alternatives, assumptions, evidence, risks, and expected outcomes.

This phase implements entry creation, validation, normalization, append-only registry, controlled metadata updates, archive policy, and filtering. No UI, editor, dashboard, assistant, visualization, persistence, or APP-6 integration.

## Prerequisites

- APP-8:1 Decision Journal Foundation (certified)

## Engine identity

| Field | Value |
| --- | --- |
| Stage ID | APP-8/2 |
| Contract version | APP-8/2 |
| Runtime path | library-only |

## Public API

| Function | Purpose |
| --- | --- |
| `initializeDecisionJournalEngine()` | Bootstrap engine (requires APP-8:1) |
| `createDecisionJournalEntry()` | Create and register immutable journal entry |
| `normalizeDecisionJournalEntry()` | Trim, dedupe lists, normalize metadata |
| `validateDecisionJournalEntry()` | Validate entry input |
| `registerDecisionJournalEntry()` | Append-only registry insert |
| `getDecisionJournalEntryById()` | Retrieve entry by id |
| `getDecisionJournalEntries()` | List entries for workspace |
| `filterDecisionJournalEntries()` | Filter by status, source, confidence, author, reviewer, tag, date |
| `updateDecisionJournalMetadata()` | Controlled metadata update (+1 revision) |
| `archiveDecisionJournalEntry()` | Archive entry (no hard delete) |
| `runDecisionJournalEngineCertification()` | Full certification runner |

## Entry lifecycle

1. **Create** — normalize → validate → generate stable id → register at `revisionVersion: 1`
2. **Update** — only updatable fields change; identity and link fields preserved; `revisionVersion + 1`
3. **Archive** — status set to `archived`; entry remains queryable with `includeArchived: true`
4. **Filter** — archived excluded by default

## Immutable fields

Always immutable: `id`, `workspaceId`, `createdAt`, `author`, `source`

Link fields immutable once assigned: `decisionId`, `scenarioId`

## Updatable fields

`title`, `summary`, `rationale`, `assumptions`, `alternatives`, `evidenceReferences`, `acceptedRisks`, `expectedOutcome`, `confidence`, `tradeoffs`, `constraints`, `reviewers`, `tags`, `metadata`, `status`

## Architecture rules

- Does **not** modify APP-8:1 or any prior APP platform
- No dashboard, assistant, visualization, persistence, or APP-6 coupling
- Append-only registry — no hard delete
- Workspace isolation enforced

## Certification groups (A–R)

Foundation available, engine initialized, entry creation, strict validation, workspace isolation, append-only registry, identity immutable, link fields immutable, metadata versioning, archive policy, filtering, no hard delete, no dashboard/assistant/visualization/persistence coupling, no APP-6 integration, prior platforms untouched.

## File layout

```
decisionJournalEngineTypes.ts
decisionJournalEngineNormalization.ts
decisionJournalEngineValidation.ts
decisionJournalEngineRegistry.ts
decisionJournalEngineFilters.ts
decisionJournalEngineMutations.ts
decisionJournalEngine.ts
decisionJournalEngineRunner.ts
decisionJournalEngine.test.ts
```

## Next phase

When APP-8:2 passes certification, proceed to **APP-8:3 — Decision Journal Query + Ordering Layer**.
