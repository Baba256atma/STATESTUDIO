# NPA-T ECA:6 — Architecture Inspection

Date: 2026-09-07

## Stop condition

ECA:6 may be certified only when a read-only dialogue-strategy judgment consumes CONV:2 thread/objective projection plus certified ECA:1–5 outputs; preserves one primary executive dialogue objective across turns without a second objective store; supports side questions, pause/resume, switch, and bounded completion; never writes business/Stage/Data truth; passes focused A–T and sequences 1–8; passes seven live `/executive` proofs; and preserves ECA:1–5, CONV:2, NXA Level 4, TypeScript, ESLint, build, and `git diff --check`.

## What CONV:2 already owns

`NEX-CONV:2/ConversationThreadIntelligence` owns **thread/objective projection**.

- Objectives: `UNDERSTAND_SUBJECT`, `INVESTIGATE_SUBJECT`, `COMPARE_SUBJECTS`, `UNDERSTAND_STAGE`, `LEARN_CAPABILITY`, `RESOLVE_UNCERTAINTY`, `UNDERSTAND_RELATIONSHIP`
- Thread status: `ACTIVE`, `SUFFICIENTLY_COVERED`, `WAITING_FOR_MANAGER`, `SUPERSEDED`
- Thread identity: `objective:primarySubject`
- Policy: `resolveConversationThreadMove` — does **not** own turn progression (CONV:1 does)

ECA:6 **must not** create `EcaConversationObjectiveStore` or compete with this ownership.

## What journey intelligence already owns

MO:5 Executive Journey projects Goal→Learning **business** journey phases. That is not conversational dialogue-objective strategy. NEX-EXP owns entrance/experience progression, not multi-turn executive conversation strategy.

## Existing objective state

| Layer | Owns | ECA:6 relationship |
| --- | --- | --- |
| CONV:2 thread | Canonical conversation objective + coverage | Consumed when present (`threadId`, CONV objective, status) |
| ECA:1 | NOW / subjects | Consumed |
| ECA:2 | Turn intent / next action | Consumed; remains turn planner |
| ECA:3–5 | Initiative / need / intake | Consumed; not duplicated |
| MO:5 | Business journey phase | Optional evidence; not rewritten |
| Session overlay | Primary + paused executive strategy | Session-only interpretation, not a second store |

## What ECA:6 uniquely adds

Executive **strategy interpretation** over multiple manager turns:

- Distinguish turn intent (ECA:2) from a larger dialogue objective
- Lifecycle: created / active / paused / resumed / completed / abandoned / superseded — conversational only
- Side-question vs switch vs progress
- Strategic next **milestone** (one), plus “where are we / what’s next / are we done”
- Progress from **actual** ECA:4/5/2 evidence, not from asking a question

## How duplicate state is avoided

CONV:2 remains the conversation-objective authority. ECA:6 session holds a **strategy overlay** (lifecycle, progress markers, turn relationship, paused reference) keyed to CONV:2 `threadId` when a thread exists, otherwise to subject + executive objective type for `/executive` turns that never entered the educational CONV kernel. It does not persist a parallel thread, coverage engine, or durable memory.

## Durability

Session-only, same as ECA:3–5. Hard refresh / empty session: no fabricated continuity from Stage.

## Dependency direction (acyclic)

ECA:1 → ECA:2 → ECA:3 → ECA:4 → ECA:5 → **ECA:6**. ECA:6 does not call ECA:2 to re-plan. Later turns recompute through existing orchestration.

## Strategy vs workflow

ECA:6 is not a mandatory Goal→Outcome funnel. Explicit manager intent wins. Completion of a dialogue objective is not business success and does not commit Decision or start Execution.

## Implementation (certified)

Canonical judgment: `judgeEcaExecutiveDialogueStrategy` in `app/lib/nexora-conversation/ecaExecutiveDialogueStrategy.ts`.

Session overlay: `ecaDialogueStrategySession` on `ManagerObjectSession` (same freeze/empty/`replaceActive` copies as ECA:3–5). Not `EcaConversationObjectiveStore`.

Orchestrator order remains acyclic: ECA:1 → 2 → 3 → 4 → 5 → 6. Overlay speech is limited to where-are-we / what’s-next / are-we-done / start-over clarify, plus a single useful return-to-comparison note after a CAP_AV side question.

## Architecture questions (certification)

| Q | Required | Result |
| --- | --- | --- |
| Q1 Second conversation-objective store? | NO | NO |
| Q2 Replace CONV:2? | NO | NO |
| Q3 Multi-turn objective? | YES | YES |
| Q4 Side question preserves primary? | YES | YES |
| Q5 Explicit switch? | YES | YES |
| Q6 Pause/resume in session? | YES | YES |
| Q7 Completion judgment? | YES | YES |
| Q8 Completion mutates business? | NO | NO |
| Q9 Recommendation = Decision? | NO | NO |
| Q10 Prepare Decision = commit? | NO | NO |
| Q11 Where-are-we / what’s-next? | YES | YES |
| Q12 Explicit intent override? | YES | YES |

