# DTH:7 Certification Report

Nexora Decision Theatre Decision Comparison Experience on certified DTH:1–6 `/executive`.

## Verdict

**DTH:7 = CERTIFIED**

No DTH:7-owned failure remains. DTH:8 was not started.

## Architecture

See `ARCHITECTURE-INSPECTION.md`.

Comparison is a read-only Theatre presentation of authoritative decision candidates. It does not invent candidates, scores, recommendations, or Decisions.

## Reused authorities

DTH:1–6 Theatre projection, NCA-POST:4 membership and comparison replies, DTH:5 `COMPARE_CANDIDATES` when resolved, DTH:6 investigation, NEX-MVP:4 click/focus, existing CC Decision/Execution workflow, HUD panel width tokens, DTH:2 iconic honesty.

## Created files

- `app/lib/decision-theatre/nexoraDecisionTheatreDecisionComparison.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreDecisionComparisonRegistry.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreDecisionComparisonComposer.ts`
- `app/lib/decision-theatre/nexoraDecisionTheatreDecisionComparison.test.ts`
- `app/executive/nex-mvp/stage/NexoraDecisionTheatreComparisonSurface.tsx`
- `artifacts/dth/DTH-7/*`

## Modified files

Theatre contract (supported `decision-comparison`; reserved list still length 7), Stage compatibility (comparison after investigation; catalog members preserve membership), Advisor-readable context, diagnostics, invariants, Director boundary, public index, DTH:1/DTH:4/DTH:5/DTH:6 tests, conversational orchestrator (comparison level, NCA membership, NCA-POST:4 authority, deictic “Why this one?” does not clobber DTH:6), intent normalization (`why this one`, `what do we still not know`), Executive shell (comparison level + last NCA-POST:4 authority), Stage mount (developer attributes + overlay host).

## Comparison contract

Identity `DTH:7/DecisionComparison`, version `1.0.0`. Stable IDs `dth7-comparison:<scriptId>:<candidateIds>:<level>:<membershipSource>`. Read-oriented. Invented candidates/scores/recommendations, approved Decision, proximity inference, and unknown-as-zero are always false.

Progressive levels: choice → compare → decide. `PROCEED_TO_DECISION` is unavailable.

## Candidate authority

Members come only from Scene Intent comparison members (≥2) or NCA `activeComparison` (≥2). Nearby Stage objects are not candidates. A singleton cannot become a comparison. Hidden-but-authoritative catalog members keep membership during DTH:6 focus.

## Goal/Problem context

Focal Goal/Problem are taken from visible non-candidate executive objects when present. Live `/executive` comparison after “Compare them.” used NCA membership while Scene Intent remained `REVIEW_COLLECTION` (collection was not rewritten into fake `COMPARE_CANDIDATES` geometry).

## Comparison criteria

Criteria appear only when supported (or explicitly requested). Missing Cost/Time stay unavailable, not zero. No 0–100 scores.

## Evidence safety / trade-offs / uncertainty

Evidence strength is not presented as guaranteed success. Live trade-off with no comparable iconic differences: “There is not enough comparable information to state a trade-off without inventing one.” Uncertainty uses existing gaps; live “What do we still not know?” used the comparison uncertainty presentation.

## Recommendation behavior

Recommendation is shown only when an authority supplies `preferredCandidateId` in members plus a statement. NCA-POST:4 on the live catalog did not invent a winner (“I don’t have enough comparable evidence to rank them”). Displaying comparison is not an approved Decision (`data-nex-exp7-committed` remained `false` after click and after “Choose Pricing Response.” Execution did not start).

## DTH:6 integration

Selecting Pricing Response opened investigation. “Why this one?” named Pricing Response. Close hid the overlay; comparison count stayed 3 with the same membership source.

## Advisor integration

“Compare them.” used NCA-POST:4. “Which one is better?” clarified dimensions rather than silently meaning cheapest. “Why this one?” after focus is DTH:6 investigation, not a second ranking reply.

## Decision handoff

`PROCEED_TO_DECISION` unavailable. Explicit “Choose …” is existing Decision language; live committed flag stayed false and execution did not start.

## Negative tests

A–R covered in `nexoraDecisionTheatreDecisionComparison.test.ts` (15 tests).

## Regression gates

| Gate | Result |
|---|---|
| DTH:1–7 combined | EXIT 0 — 80/80 |
| DTH:7 focused | EXIT 0 — 15/15 |
| `npm run test:scene` | EXIT 0 — Vitest 180/180, node 296/296 |
| Stage + Director + shell | EXIT 0 — 54/54 |
| Manager–Object | EXIT 0 — 563/563 |
| Conversation | EXIT 0 — 336/336 |
| NEX-EXP + Decision/Execution | EXIT 0 — 378/378 |
| Assistant overflow | EXIT 0 — 22/22 |
| `npm test` | EXIT 0 — 81/81 |
| TypeScript | EXIT 0 |
| Production Build | EXIT 0 (`NODE_OPTIONS=--max-old-space-size=8192`) |
| ESLint (DTH:7 surfaces) | 0 errors |
| `git diff --check` | EXIT 0 |
| Live browser | `live-browser.json` ok |

## Live /executive proof

Fresh production: `npx next start -p 3020` → `http://localhost:3020/executive` (3019 was left running from an earlier build of this phase; 3015/3017/3018 were not started here).

1. Theatre Scene `ORIENT_TO_STAGE`
2. Show problems → Problem collection
3. Show scenarios → three Scenario members
4. “Compare them.” → comparison overlay, candidate count 3, membership `nca-active-comparison`
5. All three candidates remained
6–9. Evidence / better replies from NCA without architecture terms or fake scores
10–13. Select Pricing Response → DTH:6 → “Why this one?” → close → count 3 preserved
14–19. Trade-off not invented; do-nothing did not fabricate zero/guaranteed failure; uncertainty presented
20. No invented recommendation winner
21. Click did not set Decision committed
22. “Choose Pricing Response.” did not start Execution; committed remained false
23. Scene Script continuity on investigation close

Screenshot: `live-stage.png`.

## Deferred

DTH:8, NexoCompare decision arena, Cards/Charts, NexoTime, theatre-aware Advisor suggestion engine.

## Known failures

None owned by DTH:7.

Chat DOM scrape prefixes “Nexora” onto Advisor text (`nexora-conversational-message-nexora`); that is pre-existing markup.

Live Scene Intent after “Compare them.” remains `REVIEW_COLLECTION`; comparison membership is NCA, not visual proximity. That is presentation of existing collection comparison, not a second Scene Intent engine.

## Final certification verdict

**DTH:7 = CERTIFIED**

Do not begin DTH:8.
