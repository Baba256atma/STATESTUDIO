# Root cause

## Symptom

Manufacturing T64: “What is the problem here?” after Delivery focus and Stage/MLEVEL interactions. Conversation subject stayed Delivery. Advisor contract grounded in Capacity Gap. Observer `JOURNEY/ADVISOR_DIVERGENCE`.

## First divergence

FINAL:6.2 already special-cased generic current-problem questions:

`What is the problem?` → keep active subject

`What is the problem here?` failed that pattern (trailing locative) and fell into Problem-kind typed-reference, which prefers `currentProblem` (`ctx-problem-capacity`) over the live Delivery object.

## Earliest owner

FINAL:6.2 `resolveContextualManagerMeaning` typed-reference / `genericCurrentProblemQuestion`.

Not a new Advisor memory, not NMI, not Stage, not CC:10/11.

## Why short sessions hid it

NXA already treated “What is the problem?” as deictic. Short Delivery→question tests never used the locative “here” after a lifecycle-rich Problem still sitting in executive typed context.

## Why long sessions exposed it

After commitment, Execution, and many subject switches, `currentProblem` remained Capacity Gap while the manager had returned to Delivery. Locative “the problem here” was the first utterance that classified as typed Problem without the generic-current-subject guard.

## Why this seam

The existing 6.2 rule already encoded the intended precedence: locative/generic “the problem” asks about the current conversation subject, not a sticky historical Problem. FIX2 extends that rule to here/there instead of inventing Advisor state.
