# T50 Focused Reproduction

Original long-run signature: `fnv1a32:0e17a1c6`

Focused journey: `sim-test-6-t50-focused` (first 52 Manager turns of `sim-test-6-manufacturing-long`)

Post-FIX focused signature: `fnv1a32:5b01c71b`

A separate pre-FIX focused hash was not recorded as its own journey. Pre-FIX behavior was captured from the discovery long run at the same utterances.

## Pre-FIX (discovery long run)

| turn | utterance | clarificationRequired | subject | pending/response |
| --- | --- | --- | --- | --- |
| 47 | That risk — what is driving it? | false | ctx-problem-margin | Outcome-dimension prompt; not 6.3 status |
| 48 | Return to the capacity pressure we started with. | true | ctx-problem-margin | First incorrect transition. 6.3 `MISSING_SUBJECT` with empty candidates: “Which one do you want me to show?” Historical return failed. |
| 49 | This decision — is it still the active one? | true | ctx-problem-margin | Same empty-candidate pending re-asked |
| 50 | That option we compared earlier — remind me of the difference. | true | ctx-problem-margin | Comparison candidates answered, but `clarificationRequired` stayed true → `JOURNEY/REPEATED_CLARIFICATION` |

First incorrect transition: T48 (`PENDING` created / continued as empty-candidate `MISSING_SUBJECT` instead of `SUPERSEDED`/`RESOLVED` by named historical return).

## Post-FIX

| turn | utterance | clarificationRequired | subject | result |
| --- | --- | --- | --- | --- |
| 48 | Return to the capacity pressure we started with. | false | obj-capacity | Named return resolves Capacity |
| 49 | This decision — is it still the active one? | false | obj-capacity | Decision query not captured |
| 50 | That option we compared earlier — remind me of the difference. | false | obj-capacity | Comparison answered; no repeated-clarification finding |

Post-repair manufacturing long signature: `fnv1a32:d7f9bf97`
