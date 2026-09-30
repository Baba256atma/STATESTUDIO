# Advisor context trace (T89)

| Input | Pre-FIX9 | Post-FIX9 |
| --- | --- | --- |
| canonical subject | obj-inventory | obj-inventory |
| canonical referent | obj-inventory | obj-inventory |
| resolved ordinal target | Capacity Gap (`lastCollection[0]`) | none |
| active collection | stale lastCollection treated as active | lastCollection stored, not ordinal-referable |
| Advisor bundle subject (NXA:1) | Capacity Gap via NCA:2 `activeSubject` | obj-inventory |
| Advisor collection | lastCollection memberIds | unused |
| Advisor selected context | Capacity Gap | Inventory |
| Advisor response focus | Understood — Capacity Gap. | ordered-list clarification |
| Stage | obj-inventory persist | obj-inventory persist |

First Advisor divergence: **before NXA:1**. NXA:1 consumed NCA:2 `activeSubject` after the stale ordinal write. No NXA:1 production change.
