# Root cause

**Did CC:1 understand switch?** Pre-repair: no. `matchSwitchWorkspace(/^switch to (.+)$/)` ran before `matchFocusOrOpen` and treated Inventory as a workspace because `findRegisteredExperiencesForHint` soft-matched aliases (e.g. Delivery ⊂ `delivery review`). Bare Object switches must be FOCUS unless the hint is an exact registered experience name.

**Did canonical meaning contain Inventory?** Isolated meaning could; long-session 6.1 dropped FOCUS when operation cues omitted `switch to` after resume forced `unknown`. Cue `{ cue: "switch to", family: "FOCUS" }` restores navigation evidence.

**Was Inventory a referent candidate?** In continuity, yes when meaning had Inventory. It was not *committed* as current subject because no FOCUS command executed.

**Was Inventory filtered?** Not by ranking filters. It was dropped by intent/pending-resume before selection.

**Did Capacity outrank it?** Only as leftover active subject after a missing command. Not a legitimate explicit-switch ranking loss.

**Did resolver select Inventory?** After intent+6.3 repair, yes (`EXPLICIT_CURRENT_TURN`).

**Did CC:5 commit Inventory?** Yes after FOCUS command (`Focused on Inventory.`). Not a CC5_STATE_COMMIT_DEFECT.

**Why presentation succeeded while conversation failed?** FIX7 `topicSwitchCue` / NXA:5-FIX4 is a one-way presentation consumer. CC:1 workspace + 6.3 pending capture never issued the conversational FOCUS command.

**First incorrect transition:** CC:1 `matchSwitchWorkspace` classified `Switch to inventory.` as `switch-workspace` instead of `focus` with an Inventory target hint.

**Why long-session sticky context exposed it:** T87 `Look at that.` left TYPE_AMBIGUITY pending. Even after CC:1 FOCUS, 6.3 treated Inventory as a pending candidate and resumed unknown, so CC:5 never committed the switch. Isolated Capacity→Inventory without pending passed earlier.

**Why this owner:** Stage already presented Inventory. Patching Stage or `referent = presentationTarget` would create a second authority. Repair CC:1 first, then the proven 6.3/6.1/6.2 seams that blocked the same FOCUS from committing.
