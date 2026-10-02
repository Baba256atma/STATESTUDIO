# SIM-TEST:10-R3 findings

## First divergence

Evaluation → CORE-OUT:2 **supported** Learning.

CORE-OUT:1 is live (40 evaluations). Typical live assessment: `comparison-incomplete`, `comparison.result = unknown`, `comparable = false`, expected direction from Scenario (often `maintain`), actual KPI present, `numericTarget = null`, missing `baseline`.

CORE-OUT:2 **is invoked** on the live MVP-OUT:1 path. It emits `outcome-learning` candidates with status `inconclusive` and `not-promotion-eligible`. It does **not** emit supported/durable Learning. `createsLearning` on CORE-OUT:1 remains false by design.

This is **not** §21 capability gap (Evaluation never reaches CORE-OUT:2).  
This is **not** a CORE-OUT:2 product defect on these cases.  
This is §22 / §79 Case 3: **insufficient exercised evidence** plus **correct no-learning** for promoted Learning.

## `comparison-incomplete` is not an evaluation failure

OUT-EVAL-LIVE:1 already established live evaluations without fabricated numeric targets. R3 confirms CORE-OUT:2 correctly withholds supported Learning until `outcomeReady` (`comparison-ready` + comparable expected and actual).

## Loop / NPS

Family L’s second Decision after Options. / Go with A. is **not** Learning-loop closure.  
NPS BOUNDED is not canonical Learning (`writesLearning = false`).

## Do not repair in R3
