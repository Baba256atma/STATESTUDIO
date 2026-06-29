# APP-8:1 — Decision Journal Foundation

## Purpose

APP-8:1 is the **metadata-only architecture foundation** for the Decision Journal platform.

Decision Timeline (APP-6) records **what** decision happened. Decision Journal records **why** that decision happened — preserving executive thinking as institutional memory.

This phase provides contracts, registry, validation, and certification only. No runtime, engine, editor, UI, timeline, AI reasoning, persistence, or integrations.

## Platform identity

| Field | Value |
| --- | --- |
| App ID | APP-8 |
| Platform ID | `decision-journal-platform` |
| Contract version | APP-8/1 |
| Status | build (foundation) |

## Journal entry contract

Every journal entry supports:

`id`, `workspaceId`, `decisionId` (optional), `scenarioId` (optional), `title`, `summary`, `rationale`, `assumptions`, `alternatives`, `evidenceReferences`, `acceptedRisks`, `expectedOutcome`, `confidence`, `tradeoffs`, `constraints`, `author`, `reviewers`, `tags`, `metadata`, `createdAt`, `updatedAt`, `version`

## Vocabulary

### Journal status
`draft`, `active`, `reviewed`, `archived`

### Journal source
`manual`, `assistant`, `imported`, `workspace`, `api`

### Confidence level
`very_low`, `low`, `medium`, `high`, `very_high`

## Public API shell

- `createDecisionJournal()`
- `getDecisionJournal()`
- `registerDecisionJournal()`
- `validateDecisionJournal()`
- `isDecisionJournalReady()`

## Architecture rules

- Does **not** modify APP-1 through APP-7 or other certified platforms
- No APP-6 Decision Timeline integration in this phase
- No dashboard, assistant, visualization, persistence, or runtime execution
- Workspace isolation contracts enforced at metadata level

## Certification groups (A–N)

Platform identity, contracts, registry, constants, manifest, metadata completeness, public API, no runtime, no dashboard/assistant/visualization/persistence coupling, prior platforms untouched, workspace isolation.

## Next phase

When APP-8:1 passes certification, proceed to **APP-8:2 — Decision Journal Engine**.
