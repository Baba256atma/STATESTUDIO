# Expected versus actual

## A — exlpain Demand Surge

| Field | Expected | Actual |
|---|---|---|
| normalized | explain demand surge (if verb recovery exists) | exlpain demand surge |
| CC:1 | explain / explain-scenario | unknown |
| NLU operation | EXPLAIN | FOCUS |
| overlay | explain | focus |
| command | request-explanation / explain-scenario | focus-subject |
| NXA:1 | KNOW or UNDERSTAND, navigationAllowed false | NAVIGATE true |
| DIR | NO_CHANGE | FOCUS_OBJECT (CC already wrote focus) |
| Stage | collection / scenarios / 3 | object-focus Demand Surge |
| response | Scenario explanation | Focused on Demand Surge. |

Control `explain Demand Surge`: explain-scenario, UNDERSTAND, DIR NO_CHANGE, collection preserved.

## B — which one of prolems is important?

| Field | Expected | Actual |
|---|---|---|
| collection bind | Problems | ACTIVE_COLLECTION Capacity Gap, Margin Pressure |
| ranking invented | no | no (preferred null) |
| criterion | disambiguated or overall with next step | OVERALL_SIGNIFICANCE |
| Stage | unchanged Problems collection | unchanged collection |
| response | safe; optionally criterion/next-step | certified terminal insufficiency |

## C — show me all goals

| Field | Expected | Actual |
|---|---|---|
| invent Goal | no | no |
| empty copy | truthful | I don't see any Goals in the current context. |
| DIR | NO_CHANGE | NO_CHANGE canonical-collection-empty |
| Stage | preserve Demand Surge | focus ctx-scenario-demand remains |
| Queue Goals | none in MVP | no goal row |
| continuation | optional NEX-EXP:2 | not offered |
