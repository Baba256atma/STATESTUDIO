# AI Policy Diff, Validation, and Approval

## Purpose

This layer ensures policy changes are diffed, validated, approval-checked, and explicitly activated before they affect runtime AI behavior.

## Workflow Boundaries

- policy diff: shows what changed between current and proposed policy state
- policy validation: checks structural and logical safety before activation
- policy approval: determines whether the change can auto-approve or needs manual approval
- policy activation: applies an approved change and preserves last-known-good safety

## Diffing

- diffs are field-level and typed
- each changed field records before and after values
- each changed field receives a deterministic risk level
- risk rolls up to the overall change

## Change Lifecycle

1. propose
2. diff
3. validate
4. approve or reject
5. activate

## Validation

- structural validation checks candidate policy shape
- logical validation checks protected policy invariants
- overlay conflicts are surfaced alongside validation results
- restricted sensitivity protections remain mandatory

## Approval Rules

- low risk: auto-approved
- medium risk: operator approval required
- high or critical risk: policy admin approval required
- forbidden unsafe changes fail validation before approval

## Last-Known-Good

- active policy is not overwritten before validation completes
- failed activation keeps the previous active policy change
- reload revalidates active changes and falls back safely when needed

## Activation

- only approved changes can be activated
- activation revalidates against current control-plane state
- failed activation does not replace the last-known-good active change
- activated changes are applied in memory for the MVP

## Diagnostics Endpoints

- `POST /ai/local/control-plane/policy/diff`
- `POST /ai/local/control-plane/policy/validate`
- `POST /ai/local/control-plane/policy/propose`
- `POST /ai/local/control-plane/policy/approve?change_id=...`
- `POST /ai/local/control-plane/policy/reject?change_id=...`
- `GET /ai/local/control-plane/policy/pending`
- `GET /ai/local/control-plane/policy/history`
- `GET /ai/local/control-plane/policy/diff/{change_id}`
- `GET /ai/local/control-plane/policy/approval/{change_id}`
- `GET /ai/local/control-plane/policy/audit/{change_id}`
- `POST /ai/local/control-plane/policy-changes/preview`
- `POST /ai/local/control-plane/policy-changes`
- `GET /ai/local/control-plane/policy-changes`
- `GET /ai/local/control-plane/policy-changes/{change_id}`
- `POST /ai/local/control-plane/policy-changes/{change_id}/approve`
- `POST /ai/local/control-plane/policy-changes/{change_id}/reject`
- `POST /ai/local/control-plane/policy-changes/{change_id}/activate`
- `GET /ai/local/control-plane/policy-changes/diagnostics/state`
- `POST /ai/local/control-plane/policy-changes/diagnostics/reload`

## Audit Integration

- policy change submission, approval, rejection, and activation emit audit events
- audit metadata includes scope, risk level, and resulting policy version

## Future Extension Points

- admin UI
- multi-approver workflows
- signed approvals
- database-backed change history
- policy promotion across environments
