# Material Stage transitions (Manufacturing long, post-FIX7)

Canonical IDs only. Ordinary no-op turns omitted.

| Turn | Canonical subject | Director action | Stage before | Stage after | MLEVEL L1 | Expected | Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 3 | obj-capacity | FOCUS | (none) | obj-capacity | obj-capacity | YES | PASS |
| 22 | obj-customer | FOCUS (what about) | ctx-problem-capacity | obj-customer | obj-customer | YES | PASS |
| 23 | obj-delivery | FOCUS (what about) | obj-customer | obj-delivery | obj-delivery | YES | PASS |
| 34 | obj-capacity | FOCUS (go back) | obj-delivery | obj-capacity | obj-capacity | YES | PASS |
| 71 | obj-delivery | FOCUS (named issue) | obj-capacity | obj-delivery | obj-delivery | YES | PASS |
| 84 | obj-inventory | FOCUS (what about) | obj-delivery | obj-inventory | obj-inventory | YES | PASS |
| 85 | obj-capacity | FOCUS (historical return) | obj-inventory | obj-capacity | obj-capacity | YES | PASS |
| 86 | obj-capacity | NONE (knowledge) | obj-capacity | obj-capacity | obj-capacity | preserve | PASS |
| 87 | obj-capacity | look-at current | obj-capacity | obj-capacity | obj-capacity | preserve | PASS |
| 88 | obj-capacity (stale referent) | FOCUS (switch to) | obj-capacity | obj-inventory | obj-inventory | Stage YES | Stage PASS; referent independent |
| 89 | obj-capacity | NONE (ordinal deictic) | obj-inventory | obj-inventory | obj-inventory | preserve | PASS |
| 90 | obj-delivery | FOCUS (return to) | obj-inventory | obj-delivery | obj-delivery | YES | PASS |
