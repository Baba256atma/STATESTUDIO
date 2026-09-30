# Browser runtime evidence

Production build after FIX1 served at `http://127.0.0.1:3002/executive/watch` (`next start`; existing 3001 left running and unused).

1. Watch loaded. Scenario picker showed Manufacturing / Project / Logistics / Service.
2. Manufacturing Under Capacity Pressure → Start simulation. Timeline, Conversation, Visible data, and “a Decision is still required” honesty from the simulated manager path remained. No fake Approved Decision card on idle start.
3. Take Control opened the live composer (textbox + Send to Nexora). Simulation pause control is present.
4. Bounded interactive send of “Let's go with option B.” through the Watch composer was **not completed** in this run (browser send action was not approved). Canonical Decision proof is therefore the deterministic CC:5 / SIM-TEST harness:

   - After alternatives + “What about option A?” + “Let's go with option B.”: CC:10 `applied`, `listDecisions().length = 1`.
   - Manufacturing journey T13: “No Action on Capacity is now the Approved decision.” (visible option B).
   - T17 “Start it.”: Execution started. UI must not imply Outcome complete while later S1s remain (FIX1 preserves honesty).

No visual redesign. No fabricated Decision chrome.
