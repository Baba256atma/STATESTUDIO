# NXA L4 protection

Scenario assessment remains available when Scenario is the subject or the turn is a Scenario-assessment follow-up.

Protected suites (also inside L4 omnibus):

- `mvpOut1Fix2ScenarioFollowup.test.ts` — named Scenario explain; what-if continuity
- `mvpOut1Fix4GroundedScenarioImpact.test.ts` — Delivery what-if; what could be affected; which KPI; what risks; how sure; why
- `mvpOut1Fix5ExplainSemanticFidelity.test.ts` — Demand Surge explain; how sure; why

Mechanism:

- Do **not** skip Scenario remap merely because Stage/current subject is an Object
- Do **not** stamp pronoun/recent collection members as explicit CC:2 targets
- Deictic explain of a **non-scenario** resolved subject cannot take a stale Scenario composition candidate
- How-sure / why / evidence / risk after an active assessment still use CC:9

NXA L4 funnel: PASS (`durationMs` 514939; 7/7 required commands).
