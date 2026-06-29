# APP-11:2 — Executive Inbox Aggregation Engine

## Purpose

APP-11:2 is the **deterministic aggregation engine** for the Executive Inbox platform.

It collects executive inbox items from certified Nexora platforms into a unified, immutable Executive Inbox representation. This phase performs aggregation only — no prioritization, notifications, reminders, scheduling, or upstream platform modification.

## Platform identity

| Field | Value |
| --- | --- |
| App ID | APP-11 |
| Phase | APP-11/2 |
| Engine ID | `executive-inbox-aggregation-engine` |
| Contract version | APP-11/2 |
| Prerequisite | APP-11/1 Executive Inbox Foundation |

## Aggregation contracts

### ExecutiveInboxItem
Immutable aggregated inbox representation with source reference, provenance, and engine metadata.

### ExecutiveInboxAggregate
Workspace-scoped collection of aggregated inbox items for a session.

### ExecutiveInboxSourceReference
Certified source linkage (platform, app, record, version).

### ExecutiveInboxAggregationResult
Immutable pipeline output including session, aggregate, registered IDs, and stage trace.

### ExecutiveInboxAggregationSession
Aggregation session metadata with source type vocabulary.

### ExecutiveInboxAggregationValidation
Validation envelope for items, provenance, and aggregation batches.

## Supported source types

`scenario`, `decision`, `timeline`, `risk`, `strategy`, `recommendation`, `workspace`, `report`, `assistant`

Additional reserved source types are supported through metadata extensions.

## Aggregation pipeline (deterministic)

1. Load certified source records
2. Validate dependencies
3. Normalize source records
4. Build inbox items
5. Attach provenance
6. Validate contracts
7. Register inbox items
8. Produce immutable aggregation result

## Registry API

- `registerInboxItem()`
- `unregisterInboxItem()`
- `getInboxItem()`
- `getInboxItems()`
- `inboxItemExists()`
- `getInboxAggregationSnapshot()`

## Public API

- `aggregateExecutiveInbox()`
- `buildExecutiveInboxItems()`
- `validateExecutiveInboxAggregation()`
- `registerInboxItem()`
- `getInboxItems()`
- `initializeExecutiveInboxAggregation()`
- `runExecutiveInboxAggregationCertification()`
- `ExecutiveInboxAggregationEngine` namespace

## Architecture rules

- Does **not** modify APP-11:1 or APP-1 through APP-10
- Consumer-only — reads certified platform releases, never mutates them
- No prioritization, notification delivery, reminders, scheduling, or workflow execution
- No ML, persistence, or UI logic
- All inbox items are immutable and fully traceable via provenance
- Deterministic ordering by item ID only

## Provenance requirements

Every inbox item must include:

- originating platform
- originating record ID
- workspace ID
- source version
- aggregation version
- engine version
- foundation version (APP-11/1)
- certified source apps

Incomplete provenance is rejected.

## Next phase

APP-11:3 — Executive Inbox Prioritization Engine
