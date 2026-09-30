# Collection lifecycle (T89-relevant)

| Collection | Origin | Members (conceptual) | Order | Activation | Supersession | Reopen | T89 eligibility | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| NCA `lastCollection` PROBLEM/SCENARIO list | Earlier show-problems / alternatives (NCA-POST:3 / POST:2) | includes Capacity Gap as first label | deterministic listed order | ACTIVE while `establishedAtTurn` set or current subject ∈ members | T88 `Switch to inventory.` when Inventory ∉ members (omit `establishedAtTurn`, keep items) | `interpretExecutiveCollectionQuery` re-sets `establishedAtTurn` | **not eligible** | explicit Object switch after establishment |
| `lastOfferedOptions` | Decision/scenario option labels | Option A/B history | certified option order (unchanged) | only when lastCollection has no items | not used when lastCollection items remain | n/a | **not eligible** at T89 (stale lastCollection still has items) | must not steal T89 |
| T87 TYPE_AMBIGUITY candidates | Look at that | problem vs KPI | clarification, not Advisor ordinal | superseded by T88 named switch (FIX8) | consumed/cancelled | no | **not eligible** | FIX6/FIX8 |
| `previousSubjects` | Capacity after T88 | Capacity in history | not an ordinal list | n/a | n/a | n/a | **not eligible** | not an ordered collection |
| Stage visible Objects | Director presentation | Inventory focused | visual order | presentation only | n/a | n/a | **not eligible** | Stage is not ordinal authority |
| Scenario alternatives from FIX5 | T76 Show alternatives / compare | Option B = No Action mapping preserved | unchanged | revisit via collection query | T88 does not delete items | allowed | **not ordinal-active at T89** | switch superseded eligibility without global clear |

Old scenario/options collection remains stored for revisit; it is not ordinal-referable at T89 after the Inventory switch.
