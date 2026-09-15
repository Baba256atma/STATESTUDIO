# Failure map

## Certification blockers

| ID | Severity | Exact journey / turn | Expected | Actual | Surface | Reproducibility | Likely owner | Manager impact |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| MRA3-R3-001 | S1 | Scenario collection → Demand Surge → turn 25 `Investigate it`; repeated turns 47, 54, 60, 89 | investigate current subject | collection/comparison response despite current-subject traces | live; short isolated passes | repeated across five subjects in one session | final investigation reasoning/composition eligibility after collection state | manager cannot trust what is being investigated |
| MRA3-R3-002 | S1 | turns 28–29, 40–43, 98–99 | explicit subject becomes Stage and composition subject | referent changes but Stage/composition stays or returns to stale Scenario/Problem | live | repeated before and after refresh | explicit-focus handoff across continuity, Stage, MO, final composition | explicit navigation does not reliably control the answer |
| MRA3-R3-003 | S1 | CSV identified → turn 33 `What's in this one?` | describe current CSV | Demand Surge Scenario reasoning | live | observed once; next explicit explain recovered | Data/conversation handoff precedence | normal Data follow-up answers the wrong domain |
| MRA3-R3-004 | S1 | Capacity/Risk turns 52–60 | analyze active KPI/Risk | Scenario reasoning/comparison replaces KPI/Risk reasoning | live | repeated for KPI and Risk | analytical routing/composition subject precedence | cross-object investigation is materially unreliable |
| MRA3-R3-005 | S1 | Demand Surge recommendation turns 64–69 | stable, grounded Demand Surge advice | subject switches to Risk; mixed comparison and recommendation | live | repeated follow-ups | recommendation identity/continuity | manager cannot rely on the recommendation's subject |
| MRA3-R3-006 | S1 | approve/start turns 72–82; refresh | Advisor, collections, Stage and canonical state agree and persist | writes occur safely, but confirmation/status/collection disagree; refresh loses 1/1 counts | live | multiple immediate follow-ups plus refresh | Decision/Execution projections and durability | manager cannot reliably verify committed work |

S0: 0. No unsafe mutation, fabricated material evidence, premature Decision, or premature Execution was observed.

## Future backlog

| ID | Severity | Observation |
| --- | --- | --- |
| MRA3-R3-101 | S2 | Problem count follow-up returned “No change” rather than a count. |
| MRA3-R3-102 | S2 | Demand Surge evidence/confidence/uncertainty follow-ups asked unnecessary clarification. |
| MRA3-R3-103 | S2 | Common typo recovery was inconsistent: `senarios` worked; `capcity`, `desicion`, and `investigte it` did not reliably recover. |
| MRA3-R3-104 | S2 | `UNSPECIFIED` reached recommendation copy. |
| MRA3-R3-201 | S3 | Several responses had duplicated punctuation or awkward grammar. |
| MRA3-R3-202 | S3 | Some answers repeated uncertainty boilerplate. |
| MRA3-R3-203 | S3 | Orientation response to “What's happening today?” was unnecessarily vague. |

