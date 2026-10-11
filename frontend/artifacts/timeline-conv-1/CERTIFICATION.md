# NPA-T TIMELINE-CONV:1 — NOT CERTIFIED

Date: 2026-10-11

## 1–4. Result, previous debt, architecture, implementation seam

Result: **NOT CERTIFIED**. `HISTORICAL_CONVERSATION_ROUTE_ABSENT` was reproduced (`executiveAdvisoryPurposeOf(...) === null`) and a bounded implementation now closes that behavior in focused/owning tests, but the Zero-Failure gate is blocked by three independently reproduced SIM-TEST:6-FIX1 failures. Level 4, build, and live browser proof were not started after that blocker.

The pre-implementation architecture audit, exact owners, symbols, call paths, and insertion seam are recorded in `ARCHITECTURE-AUDIT.md`.

Production seam:

- `conversationalIntentResolver.ts`: distinct `historical-query` plus context-only `historical-follow-up`; `historical-review` remains separate.
- `historicalConversationQuery.ts`: read-only query/time/operation adapter and deterministic answer projection.
- `conversationalExperienceOrchestrator.ts`: existing clarification/referent/final response seam consumes the read-only adapter and disables optional LLM participation for governed historical answers.
- `NexoraExecutiveShell.tsx`: supplies the existing canonical `readCanonicalHistoricalPresentation` boundary with the same canonical sources used by Timeline/Activity.

## 5–8. Intent, subject/referent, time, and history boundary

- Intent: clear history, first/latest, before/after, calendar-period, Decision/Execution history, unsupported chronology, and causal-history forms use the existing CC purpose classifier. `historical-review` retains “return to an earlier issue” semantics.
- Subject/referent: existing `interpretManagerTurnMeaning` → `interpretContextualManagerTurn` → `updateConversationContinuity`; no alias map or CMSI language resolver was added.
- Time: relative periods use `resolveContextWindow`; explicit named months become a bounded custom range using the caller-supplied existing turn timestamp. No wall-clock call was added to the query adapter. `new Date(...)` there parses supplied/derived boundaries only. The shell samples its existing turn clock once and reuses it for Decision and historical time.
- Read: `HistoricalConversationRead` is supplied by the host and calls `readCanonicalHistoricalPresentation`; the query layer never reads Data Reality arrays, legacy Timeline fixtures, journals, CMSI maps, or DOM.

## 9–14. Query behavior

- Capacity direct: focused and full CC-path tests return 87%, 25%, and 2.2222222222222223% in canonical order, with no Gap, Decision, Execution, or throughput contamination.
- Timeline/Activity agreement: the conversation fact projection keys equal `HistoricalManagerHistory.timeline`; existing presentation tests prove Timeline/Activity membership agreement.
- Time bounded: August 2026 and inferred-current-year August select 87% and 25%; last month at frozen `2026-10-11T12:00:00.000Z` selects the September 2.2222222222222223% observation; this week returns outside-period.
- Empty/outside: Revenue → “No supported history yet.” Capacity this week → “No supported history in this period.”
- First/latest/before/after: placeable ordering only; first=87%, latest=2.2222222222222223%, before latest=87%+25%, after 87%=25%+2.2222222222222223%. “Before that” without a resolvable prior period is ambiguous.
- Current/history: “What is Capacity now?” does not select `historical-query`; “What happened with Capacity?” does.

## 15–21. Safety boundaries

- Unsupported chronology: Problem, Scenario review, Outcome evaluation, and Learning time return explicit unsupported-time answers.
- Causation: why/caused/fixed questions return `CAUSATION_NOT_ESTABLISHED`; no facts are selected as causal evidence.
- Granularity: `kpi.production.throughput` is excluded from Capacity history by canonical projection/CMSI membership.
- Provenance: “How do you know?” reports bounded Data Reality/canonical-history provenance without exposing CMSI identifiers in manager copy.
- Legacy/RMS: the existing historical manager-journey tests pass legacy exclusion, raw RMS firewall, and published-observation admission.
- LLM boundary: **DETERMINISTIC_ONLY** for historical responses. The optional participant is not invoked; provider-independent fallback is the deterministic response.

## 22–24. Live proof, mutation, journey population

- Live `/executive`: **NOT RUN — BLOCKED BEFORE LEVEL 4/LIVE GATE**. No live claim is made.
- Mutation: integration tests snapshot observations, assert `shouldCommitRuntime === false`, and prove inquiry does not change the supplied canonical records.
- Population: existing TIMELINE-TEST:1 A–N journeys passed; new focused tests add 8 query groups and 7 full CC journeys across direct, temporal, ambiguity, follow-up, switching, provenance, and provider failure. The requested 55–70 live/product turns were not completed because certification stopped at the regression blocker.

## 25. Findings

Raw phase-local failures found and repaired:

1. `before latest` initially selected `LATEST` due operation precedence. Fixed at the query-operation layer.
2. `What about last month?` was intercepted by generic clarification. Fixed by letting only a resolved historical query reuse existing continuity.
3. `What happened with Demand Surge?` was initially remapped from existing `execution-status` to `change`. Fixed by preserving its CC intent and applying historical presentation only when the live host supplies the canonical history reader.

Blocking regression result:

- Explicit regression batch: 250 tests, 247 pass, 3 fail.
- Isolated reproduction: SIM-TEST:6-FIX1, 4 tests, 1 pass, 3 fail.
- Failures: stale clarification at T48/T50, missing expected Decision/Execution counts, and two `JOURNEY/REPEATED_CLARIFICATION` findings.
- Static path classification: turns 38–53 contain no historical query. The new optional history path is disabled when no `historicalRead` is supplied, and these SIM harnesses do not supply it. The failures are therefore classified as pre-existing/unrelated, not repaired in CONV:1. They still block Zero-Failure certification.

Severity for CONV:1 focused/owning behavior: S1=0, S2=0, S3=0. Required-regression blocker remains unresolved.

## 26–27. Production changes and verification

Production files/symbols:

- `app/lib/conversational-control/historicalConversationQuery.ts`: `answerHistoricalConversation`, query/result/read contracts.
- `app/lib/conversational-control/conversationalIntentResolver.ts`: `NexoraExecutiveAdvisoryPurpose`, `executiveAdvisoryPurposeOf`, `matchExecutiveQuestion`.
- `app/lib/conversational-control/conversationalExperienceOrchestrator.ts`: CC input/read seam, clarification precedence, deterministic final route, LLM bypass.
- `app/executive/nex-mvp/NexoraExecutiveShell.tsx`: live canonical historical reader supplied to CC.

Verification completed:

- Focused query tests: 8/8 pass.
- CC integration tests: 7/7 pass.
- Focused query + integration + Scenario semantic regression: 36/36 pass.
- TIMELINE-TEST:1 historical owner tests: 5/5 pass in the focused owning run.
- NXA Level 1: pass, no skips/running/uninspected tasks.
- NXA Level 2: first run exposed the Scenario hijack; after repair, 586/586 pass, no skips/running/uninspected tasks.
- NXA Level 3: pass, no skips/running/uninspected tasks.
- Typecheck: first run environmental OOM at default heap; established 8 GB rerun passed. Final post-change 8 GB typecheck passed.
- `git diff --check`: pass.
- Required explicit regression batch: 247/250 pass; blocking failures listed above.
- Level 4: not run after known failure.
- Production build: not run after known failure.
- Browser/live: not run after known failure.

## 28. E2E6 classification

The named `ctx-scenario-pricing` versus `obj-revenue` E2E6 case could not be located as a current named test or source assertion and was not separately rerun before the earlier SIM blocker stopped progression. Status: **KNOWN PRE-EXISTING, NOT REPAIRED, NOT RE-VERIFIED IN THIS PHASE**.

## 29–31. Authority and debt ledgers

Authority re-audit:

- Conversation consumes history; it does not own facts.
- Historical Truth owns no language aliases.
- CMSI owns evidence membership, not conversational aliases.
- Timeline, Activity, and Conversation consume canonical Historical Presentation membership.
- No store, persistence, production clock, alias map, duplicate measurement, DOM read, legacy fallback, or causation authority was added.

Debt: `HISTORICAL_CONVERSATION_ROUTE_ABSENT` is **IMPLEMENTED BUT NOT CLOSED** because live/browser and all certification gates are incomplete.

Historical gaps remain exactly as owned by `HISTORICAL_TRUTH_GAPS`:

- HT-GAP-01 CLOSED.
- HT-GAP-02 OPEN.
- HT-GAP-03 OPEN.
- HT-GAP-04 OPEN.
- HT-GAP-05 CLOSED.
- HT-GAP-06 OPEN.
- HT-GAP-07 OPEN.
- HT-GAP-08 PARTIALLY CLOSED / still open.
- HT-GAP-09 OPEN.
- HT-GAP-10 OPEN.

## 32–33. Manager usability and entry gate

Manager usability target: **PROVEN IN FOCUSED/CC TESTS, NOT PROVEN LIVE**.

**ENTRY GATE BLOCKED.** Do not start `NPA-T TIMELINE:FINAL`. Required repair/decision: resolve or formally baseline the three isolated SIM-TEST:6-FIX1 failures, then rerun the stopped explicit regression set, Level 4, production build, and live `/executive` browser journeys.
