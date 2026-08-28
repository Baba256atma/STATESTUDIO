# NXA:5-FIX3B-DIAG2 — Manager correction vs assertion

## Turn B / D6 (meta-correction, misclassified)

| Field | `I am asking of Executions` | `I mean Executions` |
| --- | --- | --- |
| CC:1 | unknown | unknown |
| NLU communicativeIntent | UNKNOWN | UNKNOWN |
| Collection query | null | null |
| Canonical Executions resolved? | no | no |
| 6.3 | unmatched pending → ask() | same |
| NCA:2 | ANSWER_NEXORA FREE_TEXT | same |
| POST:2 situation assertion (`is\|are\|was…`) | no (`am` not listed) | no |
| managerObservations | unchanged [] | unchanged |
| Advisor | capacity-pressure hypothesis copy | same |

NLU CORRECT cues (`i meant` / `was talking about`) and NCA:2 `isCorrectionUtterance` (`i was asking about`) do **not** match `I am asking of` or `I mean Executions` as a prefix of the full correction regex. Even `I mean Executions` never reaches 6.3 `isCorrection` because the pending block returns first.

## D9 (legitimate observation)

| Field | `orders increased 20%` |
| --- | --- |
| After | investigation-style question on Capacity Gap |
| CC:1 | evidence |
| NCA:2 | ANSWER_NEXORA with PERCENTAGE payload |
| Advisor | `That 20% increase makes persistent demand pressure more likely.` + orders vs throughput follow-up |
| Observations writer | eligible if NLU OBSERVE/SUPPLY_INFORMATION (distinct from turn B UNKNOWN) |

Structural differences: numeric evidence intent, pending investigation question about Capacity Gap, percent extractAnswer, no 6.3 Problems-choice pending.

Do **not** remove manager-assertion handling. Do **not** treat every `I mean…` as navigation without a resolved reference. Do **not** hide capacity copy without reclassification.
