# APP-11:6 — Executive Inbox Scheduling Engine

## Purpose

APP-11:6 is the **deterministic scheduling intent engine** for the Executive Inbox platform.

It converts eligible reminder intent records (APP-11:5) into immutable scheduling intent records with window metadata. This phase defines when executive matters should return to attention — not how schedules are executed or delivered.

## Platform identity

| Field | Value |
| --- | --- |
| App ID | APP-11 |
| Phase | APP-11/6 |
| Engine ID | `executive-inbox-scheduling-engine` |
| Contract version | APP-11/6 |
| Prerequisites | APP-11/1 through APP-11/5 |

## Scheduling contracts

### ExecutiveScheduleIntent
Immutable scheduling intent with trigger, window, summary, evidence, and provenance.

### ExecutiveScheduleProfile
Full schedule profile with eligibility, trigger, window metadata, and supporting evidence.

### ScheduleEvidence
Explainable signal supporting scheduling qualification.

### ScheduleWindow
Metadata-only attention window descriptor (no calendar events).

### ScheduleTrigger
Deterministic schedule trigger type with label and reason.

### ScheduleEligibility
Eligibility evaluation result with evaluated rules.

### ScheduleGenerationResult
Pipeline output including registered schedule intents and ineligible counts.

### ScheduleValidationResult
Validation envelope for schedule intents and batches.

## Schedule window types (metadata only)

`immediate`, `today`, `tomorrow`, `this_week`, `next_week`, `this_month`, `custom_metadata`

## Scheduling pipeline (deterministic)

1. Load reminder records
2. Validate dependencies
3. Evaluate scheduling eligibility
4. Determine schedule trigger
5. Resolve schedule window metadata
6. Build scheduling intent records
7. Attach provenance
8. Validate contracts
9. Register schedule intents
10. Produce immutable scheduling results

## Registry API

- `registerScheduleIntent()`
- `unregisterScheduleIntent()`
- `getScheduleIntent()`
- `getScheduleIntents()`
- `scheduleIntentExists()`
- `getScheduleRegistrySnapshot()`

## Public API

- `generateExecutiveScheduleIntents()`
- `buildExecutiveScheduleIntents()`
- `validateExecutiveScheduleIntents()`
- `registerScheduleIntent()`
- `getScheduleIntents()`
- `initializeExecutiveInboxSchedulingEngine()`
- `runExecutiveInboxSchedulingCertification()`
- `ExecutiveInboxSchedulingEngine` namespace

## Architecture rules

- Does **not** modify APP-11:1 through APP-11:5 or APP-1 through APP-10
- Consumer-only over reminder and notification records
- No calendar events, background jobs, timers, delivery, execution state, workflow, ML, or UI
- Schedule windows are metadata-only — no real scheduling behavior
- Every schedule intent includes complete provenance and supporting evidence

## Next phase

APP-11:7 — Executive Inbox Platform Certification
