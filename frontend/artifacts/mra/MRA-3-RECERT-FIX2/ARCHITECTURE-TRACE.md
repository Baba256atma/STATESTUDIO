# Architecture trace

Working path (after `Demand Surge`):

1. Manager utterance: `tell me more about it`
2. CC:1 operation: unknown (not FOCUS)
3. Overlay / FINAL:6.2: INVESTIGATE/EXPLAIN knowledge follow-up on the established referent
4. Current referent / active subject: Demand Surge (`ctx-scenario-demand`)
5. Stage focus: Demand Surge (when Stage is showing that Scenario)
6. Collection: Scenario collection remains context, not owner
7. Attention / recommended Problem: Margin Pressure may be ranked highest
8. Investigation subject: Demand Surge
9. Intervention / urgency ranking: advisory only
10. Composition subject: Demand Surge
11. Final manager response: Demand Surge

Failing path before this repair (after `Demand Surge`):

1. Manager utterance: `investigate it`
2. CC:1 operation: FOCUS (`investigate` + object token `it`)
3. `requiresTarget` / empty named hints (deictic)
4. Live-enriched `isSafeActionNavigation`: FOCUS + `/^(?:review|investigate)\b/`
5. Recommendation overlay (`resolveRecommendationForTurn`) with Advisor grounding / MO:6 `recommendedPaths[0]`
6. `investigationSubjectId` fallback: `session.investigationSubjectId ?? recommendedPaths[0].targetObjectId`
7. Attention target: Margin Pressure (`ctx-problem-margin`)
8. Composition subject: Margin Pressure
9. Stage command / MO active: often still Demand Surge
10. Final manager response: Margin Pressure (silent subject replacement)

First divergence: CC:1 `matchFocusOrOpen` classified deictic `investigate it` as FOCUS navigation. Live then treated that FOCUS as safe investigation navigation and composed the attention-ranked Problem. Isolated CC:5 did not always apply the same live Advisor/attention overlay, so Demand Surge was preserved.

Repair boundary (existing authorities only):

- Do not treat `investigate` + ambiguous referent (`it` / `this` / `that`) as FOCUS. Named `Investigate Margin Pressure` remains FOCUS.
- Do not treat targeted deictic investigation as `isSafeActionNavigation`.
- Do not run recommendation overlay for targeted deictic investigation.
- For targeted deictic investigation, `investigationSubjectId` consumes the resolved conversational subject, not `recommendedPaths[0]`.
- Backup: FINAL:6.2 remaps leftover FOCUS + targeted deictic investigation to explain of the established subject.

Trace contract for the blocker:

`Demand Surge` → referent Demand Surge → targeted investigation (not selection) → attention may still name Margin Pressure → investigation subject Demand Surge → Stage subject Demand Surge → composition Demand Surge
