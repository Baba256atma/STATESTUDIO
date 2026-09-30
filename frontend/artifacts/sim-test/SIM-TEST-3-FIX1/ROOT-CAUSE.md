# Root cause

## Stage

Certified NXA:5-FIX4 treated named topic switches such as “What about delivery?” as `STAGE_COMPATIBLE` knowledge turns. DIR:1 therefore received `presentationRequest: NONE`, and `applyDirectorPlanToStage` was skipped. CC:7 still moved `currentSubject` (`obj-capacity` → `obj-delivery` → `obj-customer`). Stage `focusedSubject` stayed on Capacity.

MLEVEL L1 is projected from Stage focus, so L1 lagged with Stage. That is not an independent MLEVEL owner.

Repair: treat `what about` as an explicit presentation cue; when the resolved catalog subject differs from Stage focus, DIR:1 issues `FOCUS_OBJECT` through `selectNexoraMVPInteractionSubject`. Definitional `what is` and collection/ordinal `go back` remain non-mutating.

## Referent

POST:2 rewrote every `go back to …` into a collection SHOW. “Go back to the capacity problem” became `show the capacity problem`, missed Capacity Gap / Capacity, and answered “I don't see that Problem.” FINAL:6.2 also classified only bare `go back`, not a named historical return, and only consulted `previousSubjects[0]`.

Repair: rewrite `go back to` into SHOW only for collection kinds and ordinals. Named returns (`go back to`, `return to`, `show me … again`) resolve against existing executive `previousSubjects` and conversation continuity. Unique typed match wins; genuine ambiguity stays unresolved; unknown names are not invented.
