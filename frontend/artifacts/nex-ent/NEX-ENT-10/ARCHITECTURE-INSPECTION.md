# NEX-ENT:10 — Architecture inspection (before implementation)

Inspection date: 2026-09-05.

ENT:10 is a handoff conductor. It must not own identity, BCA, Goal, Data, Decision, or Stage.

## Canonical writers ENT:10 may invoke only by falling through

| Concern | Canonical owner | Writer? | Files |
| --- | --- | --- | --- |
| Manager identity | NEX-EXP:1 `applyManagerIdentityUtterance` | yes (session + `writeStoredEntranceIdentity` when SUFFICIENT) | `nexoraEntranceIdentity.ts`, `nexoraEntranceExperience.ts` |
| Identity persistence | `NEXORA_ENTRANCE_SESSION_STORAGE_KEY` | sessionStorage, sufficiency SUFFICIENT only | `nexoraEntranceExperience.ts` |
| Business/Project context | BCA:1 `resolveBusinessProjectContext` | **no** (`persistsState: false`) | `businessProjectContextContract.ts` |
| Context kind on manager | NEX-EXP:1 `extractContextKind` → `identity.contextKind` (COMPANY/PROJECT/TEAM/…) | identity only, not BCA store | `nexoraEntranceIdentity.ts` |
| Role | NEX-EXP:1 / BCA:5 attachment | identity `role`; BCA role grants no permissions | identity + `BusinessProjectManagerContext` |
| Central workspace object | `NEXORA_EXECUTIVE_CONTEXT_OBJECT_ID` (`obj-executive-context`) | created when identity is sufficient; displayName from identity | `nexoraEntranceExperience.ts` `toIdentityObject` |
| Generic object rename | none | **do not add** | — |
| Goal | NEX-EXP:2 `applyGoalUtterance` / goal discovery | yes when `READY_FOR_GOAL_DISCOVERY` | `nexoraGoalDiscoveryExperience.ts` |
| Goal values | NEX-EXP:2 boundary `inventsTargets: false` | must not invent 96% | `nexoraGoalDiscoveryTypes.ts` |
| Data | DATA-UX / RDI Use/Cancel | yes on explicit Use | DATA-UX |
| Example ENT:6 data | educational, `acceptedIntoDataReality: false` | must not become manager Data | ENT:6 |
| Issue/Scenario/Decision/Execution/Outcome/Learning | NEX-EXP / CC:10R / CC:11 / DTH | ENT:10 must not start these | existing |
| Stage | Director / entrance catalog projection | identity/Goal overlay | `projectNexoraEntranceCatalog` |
| Skip education (ENT:1) | `skipGuidedEntrance` | **wipes identity** — ENT:10 skip must **not** reuse that path | `nexoraGuidedEntranceExperience.ts` |

## Central workspace authority

**REUSED CANONICAL AUTHORITY:** `obj-executive-context` from NEX-EXP:1 when identity is sufficient. Display name is `resolveDisplayName` (organizationName, else manager · role, else managerName).

No manager-nameable root object family beyond this. No generic rename-any-object.

If the manager names an organization through identity (“the company is BAHA Doors”), the executive context label updates. ENT:10 does not write a second store.

## BCA gate

BCA interprets BUSINESS/PROJECT/HYBRID/UNKNOWN and does not persist. ENT:10 must not add a BCA writer. “A business” / “A project” fall through to NEX-EXP:1 `contextKind`. “I’m not sure” may remain unset/UNKNOWN without blocking.

## Goal gate

Goal creation on first-time `/executive` is NEX-EXP:2 after identity is sufficient and `state === READY_FOR_GOAL_DISCOVERY`. ENT:10 must not own “Improve delivery.”

## Educational skip vs business reset

`?entrance=1&reset=1` re-enters education. It must not delete identity/Goal/Data. ENT:10 skip must exit interceptors without calling `skipGuidedEntrance` (that function currently empties identity).

Do not start NEX-ENT:11.
