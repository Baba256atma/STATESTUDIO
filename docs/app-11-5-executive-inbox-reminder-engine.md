# APP-11:5 — Executive Inbox Reminder Engine

## Purpose

APP-11:5 is the **deterministic reminder intent engine** for the Executive Inbox platform.

It evaluates eligibility and generates immutable executive reminder records from notification records (APP-11:4) and prioritized inbox items. This phase defines what should be remembered and cadence metadata — not how or when reminders are delivered or scheduled.

## Platform identity

| Field | Value |
| --- | --- |
| App ID | APP-11 |
| Phase | APP-11/5 |
| Engine ID | `executive-inbox-reminder-engine` |
| Contract version | APP-11/5 |
| Prerequisites | APP-11/1, APP-11/2, APP-11/3, APP-11/4 |

## Reminder contracts

### ExecutiveReminder
Immutable reminder intent record with trigger, cadence, summary, evidence, and provenance.

### ExecutiveReminderProfile
Full reminder profile with eligibility, trigger, cadence metadata, and supporting evidence.

### ReminderEvidence
Explainable signal supporting reminder qualification.

### ReminderTrigger
Deterministic reminder trigger type with label and reason.

### ReminderCadence
Metadata-only cadence descriptor (no real scheduling).

### ReminderEligibility
Eligibility evaluation result with evaluated rules.

### ReminderGenerationResult
Pipeline output including registered reminders and ineligible counts.

### ReminderValidationResult
Validation envelope for reminders and batches.

## Reminder trigger types

`critical_follow_up`, `decision_deadline`, `timeline_deadline`, `risk_review`, `strategy_review`, `recommendation_follow_up`, `workspace_follow_up`, `report_review`, `assistant_follow_up`

## Reminder cadence types (metadata only)

`immediate`, `same_day`, `next_day`, `weekly`, `monthly`, `custom_metadata`

## Reminder pipeline (deterministic)

1. Load notification records
2. Validate dependencies
3. Evaluate reminder eligibility
4. Determine reminder trigger
5. Resolve cadence metadata
6. Build reminder records
7. Attach provenance
8. Validate contracts
9. Register reminders
10. Produce immutable reminder results

## Registry API

- `registerReminder()`
- `unregisterReminder()`
- `getReminder()`
- `getReminders()`
- `reminderExists()`
- `getReminderRegistrySnapshot()`

## Public API

- `generateExecutiveReminders()`
- `buildExecutiveReminders()`
- `validateExecutiveReminders()`
- `registerReminder()`
- `getReminders()`
- `initializeExecutiveInboxReminderEngine()`
- `runExecutiveInboxReminderCertification()`
- `ExecutiveInboxReminderEngine` namespace

## Architecture rules

- Does **not** modify APP-11:1 through APP-11:4 or APP-1 through APP-10
- Consumer-only over notification and priority records
- No delivery, calendar scheduling, background jobs, push, email, SMS, workflow, ML, or UI
- No read/unread, completed, or snooze state
- Cadence is metadata-only — no real scheduling behavior
- Every reminder includes complete provenance and supporting evidence

## Next phase

APP-11:6 — Executive Inbox Scheduling Engine
