# BCA:5 architecture inspection

## Partial work

No BCA:5 files existed before this phase. BCA:1–4 already live in `frontend/app/lib/business-context-awareness/`. This phase extends that module only. No V2/parallel manager-context files were created.

## What is already authoritative

| Authority | What it owns | BCA:5 relation |
| --- | --- | --- |
| Entrance / `nexoraEntranceIdentity` | Manager display name and company identity at onboarding | Identity may be passed as `managerId`/`managerName`. BCA:5 does not store identity. |
| BCA:1 `managerContext` | Descriptive `roleLabel` + confirmation. `permissions: null`, `decisionAuthority: null` | Consumed as a role hint when no manager-confirmed roles are supplied. |
| NCA:1–7 / NCA-POST | Manager communication model, trust, conversation adaptation | Communication style stays NCA. BCA:5 does not adapt utterances. |
| Domain | `NexoraDomainId` | Not duplicated. Domain is already on BCA:1 context. |
| Goal / KPI / Problem / Risk / Scenario | Canonical objects | Goal *labels* may be read as relevance evidence. No Goal store. |
| CC:10 / CC:10R | Canonical Decision + commitment | Decision Context ≠ Decision. Never commits. |
| CC:11 | Canonical Execution | Not used. Role never starts Execution. |
| Advisor / Director / Stage / DTH | Presentation and conversation | Unwired. No role dashboards or Stage focus. |
| Permissions / RBAC | Not implemented as a product authority for BCA | `permissionsKnown = false`; never inferred from role. |

## Manager identity vs role

Identity is a person (`managerId`, optional `managerName`). Role is a separate `ManagerRoleRecord` (`rawTitle`, `canonicalRoleFamily`, confirmation). Name never establishes role. Title never establishes a person.

## Where role is stored or inferred

Durable role is not a BCA store. Evidence is:

1. `managerConfirmedRoles` from existing manager-conversation/confirmation (consumed, not written).
2. Exact-title map on BCA:1 `managerContext.roleLabel` / `rawTitles`.
3. Otherwise `UNKNOWN`.

A single finance or schedule question does not infer role.

## Decision authority

CC:10R determines Decision commitment. BCA:5 always sets `decisionAuthorityKnown: false` and `decisionAuthorities: null` unless a future caller supplies an existing authority payload (the current input type forbids inventing one). Role-based inference is rejected (`roleBasedAuthorityInferenceRejected: true`).

## Permissions

Not implemented. `permissionsKnown: false`, `permissions: null`.

## Goal ownership

Existing Goal authorities remain owners. BCA:5 may list `relevantGoalLabels` from input; it does not own Goals.

## Advisor communication adaptation

NCA:6 owns communication adaptation. BCA:5 may emit `roleFamily` and relevant concept ids for a future BCA:7 consumer. It does not write Advisor copy.

## Intelligence chain

DATA-ADV → BCA:1 context → BCA:2 concept → BCA:3 relationship → BCA:4 process context → **BCA:5 manager role & decision context**. BCA:6 was not started.

## Safety equations

Identity ≠ Role. Role ≠ Permission. Role ≠ Decision Authority. Responsibility ≠ Authorization. Role Relevance ≠ Importance. Role Relevance ≠ Recommendation. Decision Context ≠ Decision. Session interest ≠ Durable profile. Manager role intelligence ≠ RBAC.
