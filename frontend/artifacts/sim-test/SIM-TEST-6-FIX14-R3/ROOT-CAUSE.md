# SIM-TEST:6-FIX14-R3 Root Cause

## Stop condition

R3 is certifiable only if one proven semantic owner removes false Runtime commits from all three Scenario explanation/read cases, preserves unchanged Runtime state and at least one legitimate Scenario presentation write, introduces no Level 2 regression, and leaves only independently classified `why?` debt. Levels 3 and 4 must not run while Level 2 is red.

## Pre-repair trace

| Case | CC:1 intent / operation | Scenario semantic action | Expected commit | Actual commit | First wrong seam |
| --- | --- | --- | --- | --- | --- |
| `What is Demand Surge Scenario?` | `explain-scenario` / `describe` | resolve and explain named Scenario | false | true | final semantic-presentation composition promoted explicit Scenario explanation to `FOCUS` |
| Scenario explanation mutation guard | `explain-scenario` / `describe` | resolve and explain named Scenario | false | true | same explicit-advisor-subject promotion |
| `explain DEMAND SURGE` | `explain-scenario` / `describe` | resolve and explain named Scenario | false | true | same explicit-advisor-subject promotion |

All three exact cases reproduced before repair: 0 pass / 3 fail, each `shouldCommitRuntime=true` versus expected `false`.

## Existing authority and root

- `shouldCommitRuntime` is the final conversation handoff indicating that the returned Runtime/Stage state should be adopted for the turn.
- `directNexoraPresentation` remains the presentation-mutation authority. It produces `mutationRequired=true` only for supported Stage effects such as an explicit focus or collection presentation that is not already satisfied.
- Scenario identity and explanation were already correctly resolved by CC:1 and CC:9 as `explain-scenario` / `describe`.
- Shared root: **YES**.
- Root cause: final composition classified any explicit canonical `EXPLAIN` subject as an explicit singular Stage focus. That converted a resolved Scenario read into a `FOCUS` presentation request. The Director then correctly returned `FOCUS_OBJECT` with `mutationRequired=true`, and final assembly correctly incorporated that mutation into `shouldCommitRuntime`.
- Owning seam: the existing semantic-to-presentation handoff in `conversationalExperienceOrchestrator.ts`, before the Director mutation decision.
- Why explanation became mutation: Scenario identity resolution was conflated with an explicit presentation request; successful resolution itself was not the mutation authority.
- Repair: `explain-scenario` no longer participates in the generic explicit-advisor-subject focus promotion. The existing Director now receives `presentationRequest=NONE`, returns `NO_CHANGE`, and leaves Runtime unchanged.
- Read/write authority preserved: **YES**.
- New authority/store introduced: **NO**.

## Remaining `why?` classification

- Delayed Delivery modeled-relationship response fidelity: **independent**. The same response assertion fails unchanged after the Runtime repair.
- `why?` after `explain DEMAND SURGE` retaining `describe`: **independent**. The semantic-operation assertion fails unchanged after the Runtime repair.
- Additional `why?` code added in R3: **NO**.

