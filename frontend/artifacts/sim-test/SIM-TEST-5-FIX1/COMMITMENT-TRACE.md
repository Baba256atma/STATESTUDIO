# Commitment trace

Shared root: empty CC:9 `candidateScenarioIds` on the commit turn. Manufacturing and Project both reach CC:10 after retain + ordinal/named-plan resolution.

Visible collection after alternatives (CC:5 default catalog / RMS manufacturing seed):

- A = Investigate Capacity (intervention)
- B = No Action on Capacity (do-nothing)

## Manufacturing (post-repair) — turns 12–17 equivalent

| Stage | Manager utterance | Commitment intent | Active collection | Resolved candidate | Clarification | Pending | CC:10 | Decision ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T12 | What about option A? | DISCUSS | Investigate \| No Action (retained) | none | no | none | not a commit | none |
| T13 | Let's go with option B. | COMMIT | same | No Action on Capacity (ordinal B) | no | n/a (explicit → applied) | yes `applied` | `cc10:decision:cc9:scenario:do-nothing:do-nothing:v1` |
| T14 | Yes, make that the decision. | CONFIRM | same | same candidate | no | already Approved | yes `already-committed` | same (count=1) |
| T15 | Yes, that's the decision. | CONFIRM | same | same | no | — | `already-committed` | same |
| T17 | Start it. | EXECUTE | — | Decision visible to CC:11 | no | — | not CC:10 | Execution started; count still 1 Decision |

Pre-repair T13: collection empty, CC:10 `clarification-required`, Decision none. Signature `fnv1a32:b92137ed`.

Post-repair signature `fnv1a32:418b0673`. Decision count 0 before T13, 1 after T13. No duplicate.

## Project (post-repair) around turn 9

| Stage | Manager utterance | Intent | Collection | Resolved | CC:10 | Decision ID |
| --- | --- | --- | --- | --- | --- | --- |
| T8 | Compare them. | COMPARE | Investigate Delivery \| No Action | none | no | none |
| T9 | Approve the delivery recovery plan. | COMMIT | same | Investigate Delivery (unique intervention + “delivery” token) | no | `applied` | `cc10:decision:cc9:scenario:intervention:obj-delivery:v1` |
| T10 | Yes, make that the decision. | CONFIRM | same | same | already-committed | same |

Pre-repair signature `fnv1a32:d958dc7f`. Post-repair `fnv1a32:28ecdf3f`.

Same CC:5 retain + CC:10 candidate resolution. No Project-specific Decision path.
