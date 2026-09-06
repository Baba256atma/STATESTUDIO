# NEX-ENT:2 Stage education contract

Identity: `NEX-ENT:2/StageWorkspaceEducation` `1.0.0`

## Manager meaning

Stage is the active executive workspace. Nexora uses it to bring what matters to the current situation into view. It is not a fixed dashboard. Presentation changes are not business mutations.

## Flow

1. Certified NEX-ENT:1 introduction on `/executive?entrance=1`.
2. Manager **Show me** (no navigation): Advisor introduces Stage; Stage uses existing investigate atmosphere and keeps NEXORA present.
3. Manager may ask what the Stage is, whether it is a dashboard, what appears, how focus works, or skip.
4. **Show me how focus works** uses existing `selectNexoraMVPInteractionSubject` on `obj-nexora-entrance`.
5. Manager selecting that Stage presence can be acknowledged by Advisor.
6. Handoff copy may note that what appears on Stage can be shown later. Object families are not taught.

## Conversation actions

Suggested **answers** (`kind: "answer"`) vs suggested **questions** (`kind: "question"`) share the existing suggested-action buttons. Questions use a dashed treatment; answers stay solid. No second action system.

## State

`NexoraEntranceSession.guidedIntroduction.stageEducation`:

`INACTIVE` → `INTRODUCING` → `AWAITING_FOCUS` (after focus demo) → `FOCUS_DEMONSTRATED` (after manager select) | `SKIPPED`.

Educational focus is presentation state only.

## Reserved

- Object language education (NEX-ENT:3)
- Guided Attention (`Advisor understands → Director selects presentation target → Stage guides attention`)
- Data / CSV / Chart / Scenario / Decision Loop / Trust / Quick Review / Personal Demo
