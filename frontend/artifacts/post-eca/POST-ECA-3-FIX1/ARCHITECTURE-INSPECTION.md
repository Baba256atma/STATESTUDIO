# POST-ECA:3-FIX1 architecture inspection

## Reproduction

Exact manager text:

`Nexora, check your Data Library. How many CSV files are currently in this project? List all CSV file names and their current status.`

DATA-ADV:1 `classifyAdvisorDataConversation` returned `null` before this fix. `answerAdvisorDataInquiry` therefore returned `null`. Orchestrator finalize had no Data Library owner, so NXA/scenario/attention composition answered from current business context (Capacity Expansion Plan + Review Capacity Gap).

## First divergent layer

DATA-ADV:1 classification, not ECA:1 working context, not a second Advisor, and not a missing Data Library store.

POST-ECA:3 matchers covered short forms (`explain all CSV`, `do you have any file like CSV`, `what CSV files`). They did not treat a multi-clause inventory as one DATA operation when the turn also contained `project`, `how many`, `list all`, `status`, and a leading `Nexora`.

## Fix

Reuse DATA-ADV:1:

- Semantic library/CSV target (filenames stripped so `capacity.csv` stays a specific source).
- Inventory acts: count / list / names / status / check.
- Exclusions: Problems/Scenarios/Risks collections; provenance (`what CSV is X using`); investigate-this-file asks.
- Census copy from `projectAdvisorDataContext` lifecycle (`in use` / `pending review`), workspace-scoped Data Library language.
- ECA:2 COUNT/SHOW when CSV/Data Library is the target.
- Orchestrator already prefers DATA-ADV text in finalize; that path now receives a non-null answer.

No second Data Advisor, router, or phrase equality on the blocking sentence.
