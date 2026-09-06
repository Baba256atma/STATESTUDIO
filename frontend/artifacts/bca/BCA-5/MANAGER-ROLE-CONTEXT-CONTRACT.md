# BCA:5 manager role & decision-context contract

Identity: `BCA:5/ManagerRoleAndDecisionContext`.

Resolver: `resolveManagerDecisionContext` — pure, deterministic, deeply frozen. No persistence.

## Handoff: BCA:4 → BCA:5

BCA:4 process placements may be attached. Role-relevant process ids are those whose `conceptIds` intersect role-relevant concepts. Process context is not rewritten. Concepts and relationships remain BCA:2/3 truth; BCA:5 only selects relevance.

## Manager identity vs manager role

`managerId` / `managerName` are optional identity. `roles[]` hold role records. Both may be present (Alex + Operations Manager) or either may be unknown.

## Raw title vs canonical role

`rawTitle` is preserved. Canonical family comes from exact title registry or manager-confirmed family. No substring matching (`Finance Transformation Project Manager` is not CFO).

## Role vs responsibility

`roleFamily` is the canonical family. `responsibilityAreas` are contextual relevance areas from the role-relevance registry (e.g. Delivery, Capacity). They are not permissions.

## Role vs current decision context

`roleFamily` is stable for the projection. `decisionContextAreas` may add conversation/Goal/hybrid BUSINESS+PROJECT areas without overwriting role. Example: CEO + “project schedule delay” stays `EXECUTIVE` with PROJECT/SCHEDULE areas.

## Role vs permission / Decision authority

`permissionsKnown` and `decisionAuthorityKnown` stay false. `permissions` and `decisionAuthorities` are always `null`. `roleBasedAuthorityInferenceRejected` is always true.

## Role relevance vs importance / recommendation

`attentionPriorities` is empty. `mostImportantClaimed: false`. `recommendationGenerated: false`. Relevance is a set of concept/relationship/process ids, not a ranking and not an action.

## Stable vs session

`durableRoleUnchangedBySession: true`. Conversation interest is recorded as a rejected inference when it would invent a finance role. The resolver has no store, so session cannot mutate a durable profile.

## Business / Project / Hybrid

`businessProjectContextId` is the BCA:1 context. Hybrid adds both BUSINESS and PROJECT to `decisionContextAreas`. Current operations Capacity and project Capacity remain separate BCA:2/4 concepts; BCA:5 does not merge them.

## Unknown / ambiguous / multiple roles

Unknown role still uses Goal/context for concept relevance. `Delivery Manager` is `AMBIGUOUS` with candidates, family `UNKNOWN`. Multiple confirmed roles stay in `roles[]` without permission merging.

## Manager-confirmed role

Confirmed families outrank title inference. BCA:5 does not write confirmation (`writesManagerConfirmation: false`).

## Advisor / Stage / Theatre

Boundary flags: `ownsAdvisor`, `ownsNca`, `mutatesStage`, `mutatesDecisionTheatre` are all false. No Object focus, scene, overlay, or role dashboard.
