# NXA:5-FIX3B-DIAG2R — Collection recovery, pending escape, meta-correction, deixis

## Final status

**NXA:5-FIX3B-DIAG2R = CERTIFIED**

(Written after gates; live transcript is in `live-stage.json`.)

## 1. Root cause(s)

1. **Collection-noun recovery inflected valid singulars.** Bounded edit-distance recovery mapped `scenario` → `scenarios` and `decision` → `decisions` because those pairs are distance 1. That broke `Simulate this scenario` and `What decision is required?`. Misspellings were also interpreted only on CC:1, so POST:2 `interpretExecutiveCollectionQuery("show prolems")` stayed null.

2. **Pending 6.3 / NCA:2 consumed incompatible later acts.** `isNewCompleteRequest` required a resolved object on FOCUS/EXPLAIN and omitted collection `show-*`. `show-execution` was treated as COMMITMENT. Meta-correction cues (`I am asking of`, `that's not what I asked`) were too narrow, so NCA:2 treated them as FREE_TEXT answers and composed capacity-hypothesis copy.

3. **Observation writer treated questions/commands as manager-reported evidence** when NLU labeled them OBSERVE/SUPPLY_INFORMATION.

4. **Deictic `compare them` seeded an investigation Scenario pair** when `candidateScenarioIds.length === 1` (after focusing Demand Surge), inventing `Investigate {attention}` instead of using the presented Scenario collection.

## 2. First semantic divergence (diagnosed defects)

| Input | Expected | Actual (pre-fix) | First divergence | Authority | Downstream |
| --- | --- | --- | --- | --- | --- |
| `show prolems` | Problems collection | POST:2 null / CC:1 recovered only after normalize | POST:2 prepared text lacked noun recovery | POST:2 + CC:1 normalize | Could fail collection overlay |
| `scenario` inside `this scenario` | leave singular | recovered to `scenarios` | `recoverBoundedCollectionNouns` | CC:1 | wrong intent (`requiresContext` dropped) |
| pending clarification then `show executions` | escape pending | 6.3 fail / NCA:2 answer | `isNewCompleteRequest` | FINAL:6.3 | imprisoned turn |
| `I am asking of Executions` | meta-correction → Executions | ANSWER_NEXORA hypothesis copy | NCA:2 `isContextualShortAnswer` + cue list | NCA:2 | false evidence claim in Advisor |
| `compare them` after one Scenario focus then collection | compare presented Scenarios | `Investigate Margin Pressure` | 6.3/CC:9 `seedInvestigationScenarioPair` on length===1 | CC:9 scenario resolver | Stage stayed Scenarios; Advisor ranked invented pair |
| `how many …` | knowledge, no observation write | `managerObservations` grew | observation gate | CC:5 finalize | conversation evidence pollution |

## 3. Precedence problem

Repaired toward: **explicit current act > compatible continuation > stale pending > fallback**.

- Explicit collection/show/count/explain-named-object supersedes incompatible pending clarification.
- Genuine criterion answers still complete pending.
- Registered collection nouns are not inflected; only misspellings recover.
- Presented Stage/runtime collection outranks stale NCA `lastCollection` for whether a non-Scenario collection owns a compare follow-up.
- Plural deixis (`them`/`those`/`these`) on a presented Scenario collection binds compare candidates to that collection, not a leftover singleton Scenario session.

## 4. Files inspected

CC:1 normalize/resolver, CC:5 orchestrator, POST:2 collection query, 6.3 gate/resolver, NCA:2, canonical meaning interpreter, POST:4 comparison, NXA:3/5 tests, executive scenario resolver, `/executive` shell session wiring, DIAG2 artifacts.

## 5. Files changed (this repair class)

- `conversationalIntentNormalization.ts` — skip already-registered nouns; export recovery; include risks.
- `nexoraNcaPost2ManagerAssertionsPendingQuestionPrecedenceCollectionQuery.ts` — recover nouns in `preparedManagerUtterance`; broader CORRECTION_LEAD.
- `nexoraNca2ConversationState.ts` — `that's` / asking-of correction class.
- `conversationalExperienceOrchestrator.ts` — observation gate; presented collection for scenario follow-up; deictic compare ids; no singleton investigation-pair seed.
- `nexoraNxa5Fix3BDiag2rConversationalControl.test.ts` — required semantic tests.
- Prior DIAG2R work already in: resolver collection shapes, 6.3 `isNewCompleteRequest`, overlay, `show-execution` not COMMITMENT, canonical CORRECT cues.

## 6–11. Semantic rules

**Collection recovery:** recover misspelled registered collection nouns (edit distance 1); never inflect an already-registered singular/plural; POST:2 and CC:1 share that recovery; `what`/`how many`/`show` map to collection kinds without picking a member.

**Pending escape:** explicit complete collection/navigation/explain-object acts `proceed` and cancel incompatible pending; polar/criterion/short answers still bind.

**Meta-correction:** CORRECTION speech act / CORRECT communicative intent is conversational repair; skip observation writes; overlay collection after stripping correction leads.

**Contextual reference:** `it` remains focused object; plural deixis uses last/presented collection; `how many are there` uses last collection; compare-them uses presented Scenario member ids when Stage is that collection.

**Stage safety:** count on already-presented matching collection does not force a new mutation; clarify/fail do not OR `mutationRequired`; knowledge/correction do not write observations.

## 12–13. Automated / TypeScript / build

- Funnel L1, L2, L3: passed.
- DIAG2R tests: 17 passed.
- FIX3B, FIX3A, POST:2/3, NXA:1–5, 6.1, 6.3, CC:1/4/5: passed in this task’s regression sets.
- `tsc --noEmit`: passed.
- `next build`: passed (final rebuild after last compare-them fix).
- L4 milestone omnibus was **not** run (Stop Condition is DIAG2R, not NXA:6 / final FIX3).

## 14. Live `/executive`

Existing listener PID **62339** on :3000 was left running (pre-fix `next-server`). Live proof of **this source** used a task-started `next start -p 3001` after production rebuild. Playwright: `live-nxa5-fix3b-diag2r.mjs`, `live-stage.json`, screenshots. Page errors: 0. PREPARING STAGE: false.

## 15. Regression

Named-object focus, Explain `it`, Problems/Scenarios/Executions collections, FIX3B criterion pending + urgency completion, NXA:3 assertion invalidation, simulate/decision-status, Queue collection presentation tests.

## 16. Remaining debt

- Unspecified `that's not what I asked` may still ask a bounded clarification among recent referents (live: Margin Pressure vs Demand Surge) instead of silently guessing. Stage stayed on Problems; no observation write. Allowed when the intended subject is not recoverable.
- `compare them` on Scenarios that are not evaluated reports insufficient comparison data rather than inventing a ranking (`Investigate Margin Pressure` no longer appears). Ranking remains owned by existing Scenario evaluation / NXA:5 criterion paths.
- `show all executive` is still not mapped to Executions (intentional; `executive` ≠ `executions`).
- Port 3000 listener PID 62339 was not recycled; live proof used :3001 after rebuild.

## 17. Status

NXA:5-FIX3B-DIAG2R = CERTIFIED
