# Root cause

**Was canonical subject correct?** Yes. T85 canonical = `obj-capacity`.

**Was referent correct?** Yes at T85. T88/T92 referent defects are independent.

**Should Stage have changed at T85?** YES. Historical return is an explicit topic-switch presentation (NXA:5-FIX4 / SIM-TEST:3-FIX1 class), not a definitional `what is`.

T86: NO (knowledge about current Capacity).
T87: NO replacement (look-at current Stage object).
T88: YES (`Switch to inventory.`).
T89: NO (`The first one.` is not a presentation command).

**Did Director emit the correct action?** Pre-repair: no. `topicSwitchCue` omitted `what were we saying about`; generic `^what` made `isExplicitPresentationRequest` false; `explicitSingularFocus` false; `presentationRequest` NONE; STAGE_COMPATIBLE skipped `applyDirectorPlanToStage`.

**Did Stage bridge receive it?** Pre-repair: no instruction. Not STAGE_BRIDGE_STALE_INPUT of a correct plan.

**Did Stage state apply it?** Could not; no FOCUS. After cue repair, existing `applyDirectorPlanToStage` applied FOCUS.

**Did MLEVEL reflect it?** MLEVEL L1 followed Stage through existing integration. Not a second selection authority.

**Did render reflect it?** Harness Stage state is the simulated production Stage; no separate render-only defect.

**First incorrect transition:** canonical Capacity CORRECT → Director emitted no required FOCUS (`DIRECTOR_INTENT_DEFECT` via missing CC:5/NXA5 topic-switch cue).

**Why long-session exposed it:** T84 `What about inventory?` legitimately moved Stage to Inventory. T85 historical return is a later, less-templated phrasing than `What about` / `Go back to`. Short journeys never left Inventory then returned with saying-about.

**Why this seam:** Stage renderer was obeying “no FOCUS ⇒ persist.” Repairing Stage to `stageSubject = canonicalSubject` would violate NXA:5-FIX4. The missing instruction is owned by the existing topic-switch presentation cue that already drives Director FOCUS for `What about X?`.
