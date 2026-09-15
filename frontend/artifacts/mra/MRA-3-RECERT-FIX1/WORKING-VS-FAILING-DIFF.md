# Working vs failing diff

Both turns follow Demand Surge as the newest named/focused Scenario.

| Dimension | `explain it` (working) | `tell me more about it` (was failing) |
| --- | --- | --- |
| CC:1 kind | explain | unknown |
| Overlay | none | EXPLAIN + primary hint from contextual object |
| Primary target hint | none | Capacity Expansion Plan (J4) |
| Continuity ranking | unused for composition (no hint) | CONTEXT_RECENT_SUBJECT leftover Scenario |
| Resolved composition subject | Demand Surge from previous continuity | Demand Surge still in trace, unused |
| Command | explain-scenario describe | request-explanation |
| Response subject | Demand Surge | Capacity Expansion Plan investigation |

Same NLU family (EXPLAIN). Different CC:1 coverage. Overlay + ranking changed **subject**, not only operation.
