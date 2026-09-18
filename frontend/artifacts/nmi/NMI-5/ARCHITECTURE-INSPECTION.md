# NPA-T NMI:5 — Architecture Inspection

Inspection date: 2026-09-17.

Stop condition: Management Navigation + Executive Attention over certified NMI:1–4 and STAGE-PROD:1 Queue. Do not start NMI:6. Do not create a second Queue.

## Queue authority discovered

| Question | Finding |
| --- | --- |
| Who owns Queue items | STAGE-PROD:1 `resolveExecutiveQueueEntries` from catalog context subjects. Entries are presentation collection controls, never semantic Objects. |
| Priority / order | Category order is `problem → scenario → decision → execution`. Collection *density* ranking exists for visible subset; it is not an executive-priority authority. |
| Interactions | Category select opens collection disclosure; member click focuses CENTER; toggle/back/forward/escape remain STAGE-PROD:1. |
| Runtime vs canonical | Queue is a presentation projection over catalog subjects. Not a canonical Object store. |
| Queue ↔ Stage | Queue discloses collections onto Stage; it does not own Stage identity. NMI:6 will later project map branches. |

## Disposition

NMI:5 reads Queue object IDs into Attention and reads NMI:2 into Management Map navigation. STAGE-PROD:1 remains the Queue writer/aggregator. Overlay UI is evolved in place.
