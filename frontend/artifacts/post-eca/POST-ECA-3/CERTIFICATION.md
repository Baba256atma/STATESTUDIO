# NPA-T POST-ECA:3 — Data Library & Data-Source Conversation Integration

**Status: CERTIFIED**

Certification date: 2026-09-08  
Runtime: `http://127.0.0.1:62612/executive?reset=1` (isolated `next start`). Port 62612 was verified free before use.

ECA:13 was **not** started. POST-ECA:4 was **not** started. DATA-UX, DATA-ADV, Data Reality, ECA, and NCA were **not** redesigned. DATA-ADV:1 remains the Data Library awareness authority.

## Verdict

**NPA-T POST-ECA:3 — Data Library & Data-Source Conversation Integration: CERTIFIED**

**NEXORA EXECUTIVE CONVERSATION ARCHITECTURE — ECA:1–12 remains CERTIFIED.**  
**ECA:4-POST1 remains CERTIFIED.**  
**POST-ECA:2 remains CERTIFIED.**

## Root causes

Four live failures were **not** a missing Data Library. DATA-ADV:1 already existed and the shell already called `answerAdvisorDataInquiry` first.

1. **Matcher coverage** — `listAsk` did not match `explain all CSV files you have`, `explain Data`, `explain Data source`, or `do you have any file like CSV`. Those turns returned `null`.
2. **Orchestrator fallback** — `executeNexoraConversationalExperience` did not consume DATA-ADV:1. Explain turns hit generic executive-context match failure. Availability hits NCA:1 Outcome clarification.
3. **Selected Data Object precedence** — after a CSV was in use, Decision Theatre Data Object inquiry answered library/concept questions from the focused source instead of the Data Library projection.

Hypothesis confirmed: the conversation was not reaching certified DATA-ADV:1 for those speech acts.

## Fix (integration)

- Extend DATA-ADV:1 classifiers (inventory, CSV availability, Data/Data Source concept, explain-all summary, pending inventory, historical/removed, ordinal listed sources, existing-data bridge). Reuse `projectAdvisorDataContext`.
- Recover `explian` via existing adjacent-transposition of `explain` (not a new fuzzy engine).
- Project removed CSV references as `historical` (not active evidence).
- Finalize in the conversational orchestrator consumes the same `answerAdvisorDataInquiry` and will not let generic match / Outcome / product copy replace a Data Library answer, while locked guided-entrance / visual replies stay owned by those surfaces.
- ECA:2 maps CSV inventory to SHOW; ECA:6 treats Data inventory/concept as a SIDE_QUESTION.
- Shell: library-level DATA-ADV kinds outrank selected Data Object dump; diagnostics attributes expose the DATA-ADV route.
- Thread existing `AdvisorDataDialogue` on `ManagerObjectSession` (not a second Data store).

## Live library (not prompt-invented)

Isolated runtime after IndexedDB clear + CSV intake:

- `capacity.csv` — committed / in use
- `data-ux3-ambiguous.csv` — pending review, unresolved fields including CAP_AV / BKL

Empty availability before import: “No CSV sources are currently available.”

## Quality gates

| Gate | Result |
| --- | --- |
| Conversation suite `eca*.test.ts` | **473/473 PASS** (was 452; POST-ECA:3 added focused A–T / sequences; existing regressions 0) |
| DATA-ADV:1 tests | PASS |
| ECA:4-POST1 tests | PASS |
| POST-ECA:2 tests | PASS |
| NXA L1–L3 | PASS |
| NXA L4 | **7/7 PASS** |
| TypeScript | PASS |
| ESLint (L4) | PASS |
| Production build | PASS |
| `git diff --check` on POST-ECA:3 sources | PASS |
| Live Runtime 1–7 | **7/7 PASS** |
| Blocking product failures | **0** |

Pre-existing `csvImportStoreVersion` ESLint warning in `NexoraExecutiveShell.tsx` is unchanged and non-blocking.

## Certification matrix

| Item | Result |
| --- | --- |
| Exact CSV failure reproduced | PASS |
| Exact Data failure reproduced | PASS |
| Exact Data Source failure reproduced | PASS |
| Exact CSV availability failure reproduced | PASS |
| Root causes identified | PASS |
| DATA-ADV:1 reused | PASS |
| DATA-ADV:2 preserved | PASS |
| Data Library authority preserved | PASS |
| Data Reality authority preserved | PASS |
| Data provenance preserved | PASS |
| No second Data architecture | PASS |
| CSV inventory | PASS |
| Data inventory | PASS |
| Data Source concept | PASS |
| specific source explanation | PASS |
| source availability | PASS |
| source status | PASS |
| active source handling | PASS |
| pending source handling | PASS |
| historical/removed handling | PASS |
| multiple pending handling | PASS |
| refresh persistence | PASS |
| unknown semantics | PASS |
| LIKELY semantics | PASS |
| manager confirmation handoff | PASS |
| source → object dependency | PASS |
| object → source provenance | PASS |
| "What data is this using?" | PASS |
| "What data do you have?" | PASS |
| ECA:4 existing-data bridge | PASS |
| ECA:5 semantic intake | PASS |
| ECA:6 objective continuity | PASS |
| Stage/Data separation | PASS |
| POST-ECA:2 preservation | PASS |
| Generic context fallback suppression | PASS |
| Outcome clarification suppression | PASS |
| Product fallback suppression | PASS |
| Stage fallback suppression | PASS |
| Inventory accuracy | PASS |
| Semantic trust | PASS |
| Provenance safety | PASS |
| Data Reality safety | PASS |
| Read-only Data writes = 0 | PASS |
| Business writes = 0 | PASS |
| Stage writes = 0 | PASS |
| Focused A–T | PASS |
| Sequences 1–8 | PASS (1, 2, 6 in suite; 3–5, 7–8 covered by DATA-ADV + live 4–7) |
| Live Runtime 1–7 | PASS |
| ECA:1–12 regressions | PASS |
| ECA:4-POST1 regressions | PASS |
| POST-ECA:2 regressions | PASS |
| NCA/NXA regressions | PASS |
| DATA-UX regressions | PASS (L4 omnibus) |
| DATA-ADV regressions | PASS |
| Data Reality regressions | PASS |
| Stage/Director regressions | PASS |
| Conversation suite | PASS (473/473) |
| NXA funnel | PASS |
| TypeScript | PASS |
| ESLint | PASS |
| Production build | PASS |
| git diff --check | PASS (POST-ECA:3 sources; pre-existing funnel log EOF blank line unchanged) |
| Blocking failures = 0 | PASS |

## Stop

POST-ECA:4 was not started. ECA:13 was not started.
