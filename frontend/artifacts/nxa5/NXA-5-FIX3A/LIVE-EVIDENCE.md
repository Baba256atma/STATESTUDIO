# Live Stage and Advisor evidence

Live target: freshly built production `/executive` on task-owned `127.0.0.1:3001`.

Sequence:

1. `show scenarios`
2. `exlpain Demand Surge`
3. `show Demand Surge`

Observed after step 1:

- Stage subject: Scenarios
- Queue: Scenarios · 3
- visible members: Capacity Expansion Plan, Demand Surge, Pricing Response

Observed after step 2:

- Advisor returned the existing Scenario explanation beginning `Scenario: Demand Surge.`
- Stage subject remained Scenarios.
- Queue remained Scenarios · 3.
- all three Scenario members remained visible.
- no Demand Surge focus transition or navigation-trail entry occurred for the explanation.
- no architecture-language leakage was visible.

Observed after step 3:

- Stage focused Demand Surge.
- navigation trail became Overview / Scenarios / Demand Surge.
- Advisor response was `Focused on Demand Surge.`

Page errors: 0. See `page-errors.json` and the three PNG captures in this directory.

The production server started for this proof was stopped after capture. A pre-existing dev lock was not removed and no pre-existing process was terminated.
