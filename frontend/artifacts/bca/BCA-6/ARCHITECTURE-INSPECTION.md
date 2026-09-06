# BCA:6 architecture inspection

## Partial work

No BCA:6 files existed. BCA:1–5 already live in `frontend/app/lib/business-context-awareness/`. This phase extends that module only.

## What detects ambiguity today

| Layer | Ambiguity |
| --- | --- |
| DATA-ADV / `csvSemanticUnderstanding` | Unconfirmed or rejected field meaning; manager unknown/defer |
| DATA-ADV:2 semantic candidates | Candidate meanings before confirmation |
| NCA:2 pending question | Session dialogue gap (`pendingQuestion`) |
| FINAL:6.3 / conversational control | Object/collection clarification |
| BCA:1 | UNKNOWN/AMBIGUOUS context |
| BCA:2 | Unknown/ambiguous established meaning |
| BCA:5 | Ambiguous raw titles (`Delivery Manager`) |

## What asks clarification questions today

NCA / Advisor wording. DATA-UX CSV path uses NCA purpose `csv-semantic-clarification`. BCA:6 does not ask.

## What writes and persists confirmation

| Writer | Scope | Durable? |
| --- | --- | --- |
| `applyCsvSemanticClarification` | CSV field meaning | Mapping review (semantic) |
| ManagerConversation (consumed by BCA:1/4/5 as `managerConfirmed*` inputs) | Role, process placement, organization-specific context | Only if that existing path persists; BCA has no store |
| NCA:2 `pendingQuestion` | Session-only dialogue | Session |

BCA:6 must never write. It names those writers on `confirmationHandoffAuthority`.

## What BCA may consume / must never write

Consume: BCA:1–5 projections, existing confirmation records, current request, declined/unresolved answers, current role perspective, stated measurements without time scope.

Never write: NCA state, CSV semantics, role profile, Decisions, Execution, Stage, Theatre.
