# APP-11:1 — Executive Inbox Foundation

## Purpose

APP-11:1 is the **metadata-only architecture foundation** for the Executive Inbox platform.

The Executive Inbox is Nexora's unified executive attention platform. It aggregates important executive items from certified platforms into one deterministic, explainable inbox. This phase provides contracts, registry, dependency validation, and certification only — no aggregation, prioritization, notifications, or runtime delivery.

## Platform identity

| Field | Value |
| --- | --- |
| App ID | APP-11 |
| Platform ID | `executive-inbox-platform` |
| Contract version | APP-11/1 |
| Status | build (foundation) |

## Inbox contracts

### ExecutiveInboxSource
Reference to a certified platform artifact used as a deterministic inbox source. Consumer-only — never modifies source platforms.

### ExecutiveInboxItem
Registered executive attention item linking session, source type, and certified reference.

### ExecutiveInboxContext
Workspace-scoped inbox scope with selected source types and session binding.

### ExecutiveInboxSession
Container for executive inbox registration within a workspace.

### ExecutiveInboxMetadata
Version-safe metadata envelope for all inbox artifacts.

## Inbox source vocabulary (metadata only)

`scenario`, `decision`, `timeline`, `risk`, `strategy`, `recommendation`, `workspace`, `report`, `assistant`

## Certified dependencies (consumer-only)

| App | Platform |
| --- | --- |
| APP-1 | executive-time-platform |
| APP-2 | scenario-intelligence-platform |
| APP-3 | executive-intent-platform |
| APP-4 | executive-memory-platform |
| APP-5 | scenario-timeline-platform |
| APP-6 | decision-timeline-platform |
| APP-7 | business-timeline-platform |
| APP-8 | decision-journal-platform |
| APP-9 | confidence-evolution-platform |
| APP-10 | cross-scenario-learning-platform |
| DS | ds-platform |
| INT | int-platform |

## Public API

- `buildExecutiveInboxFoundation()`
- `validateExecutiveInboxFoundation()`
- `getExecutiveInboxManifest()`
- `runExecutiveInboxFoundation()`

## Reserved extension points (metadata only)

- Aggregation Engine (APP-11:2)
- Prioritization Engine
- Notification Engine
- Reminder Engine
- Scheduling Engine

## Architecture rules

- Does **not** modify APP-1 through APP-10 or other certified platforms
- Consumer-only — reads certified platform releases, never mutates them
- No inbox aggregation, prioritization, notification delivery, or workflow execution in foundation
- No ML, dashboard, assistant, visualization, persistence, or runtime processing
- Workspace isolation contracts enforced at metadata level
- All inbox outputs must be deterministic and explainable

## Certification groups (A–N+)

Platform identity, contracts, registry, constants, manifest, metadata, public API, source vocabulary, no aggregation, no notification/workflow, consumer-only, dependency gates, prior platforms untouched, workspace isolation.

## Next phase

When APP-11:1 passes certification, proceed to **APP-11:2 — Executive Inbox Aggregation Engine**.
