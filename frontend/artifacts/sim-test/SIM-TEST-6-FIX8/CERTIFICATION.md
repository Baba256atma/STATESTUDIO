# SIM-TEST:6-FIX8 Certification

Status: **CERTIFIED**

SIM-TEST:6 recertification: **STILL NOT CERTIFIED**

- T88 `Switch to inventory.` now commits canonical subject/referent `obj-inventory` while Stage remains `obj-inventory` without Stage→conversation feedback
- First conversational divergence: CC:1 treated bare `switch to X` as `switch-workspace` via soft experience-alias match, so no FOCUS command reached CC:5; NXA:5-FIX4 still presented Inventory
- Long-session second seam: T87 TYPE_AMBIGUITY pending captured T88 until FINAL:6.3 treated an explicit named switch as a new complete request; resume overlay must not force `unknown` over an already-resolved `focus` intent; FINAL:6.1/6.2 keep FOCUS + EXPLICIT_CURRENT_TURN
- T92 WRONG_REFERENT and T102 ADVISOR remain independent; T89 ADVISOR_DIVERGENCE is a new earlier independent Advisor/ordinal finding after the switch succeeds
- Decision/Execution identity unchanged
- Production build / browser: NOT RUN — final certification deferred
