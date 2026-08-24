# Collection authority map

Canonical membership for queue categories is `resolveExecutiveQueueEntryForCategory` over `catalog.contextSubjects`. Menu, Advisor unfiltered queries, and Stage collection disclosure consume that same entry.

| Collection | Canonical membership | Menu | Advisor (unfiltered) | Stage |
| --- | --- | --- | --- | --- |
| Problems | queue category `problem` | `nexora-executive-queue-count-problem` | POST:3 `COLLECTION_QUERY` + reveal-problems without inherited primary | queue disclosure |
| Scenarios | queue `scenario` | count-scenario | same collection contract | same |
| Decisions | queue `decision` | count-decision | same | same |
| Executions | queue `execution` | count-execution | CC:3 may still attach a decision subject when the intent is execution-of-decision | same |
| Risks | objects whose label/id matches risk (no queue bucket) | not a queue category | `show risks` maps historically to show-problems; POST:3 membership uses object labels | presentation of those objects |
| Opportunities | object-label match | none | same generic collection query | none |
| Goals | object-label match / show-goals | none as queue | CC:3 may keep a business/goal primary | none |

Intentional difference: unfiltered **Problems** must not inherit conversational subject. Deictic / related-to still filters. Executions may remain decision-anchored in CC mapping when the manager is asking for execution of the current decision.

No second Problem/Risk/Goal store.
