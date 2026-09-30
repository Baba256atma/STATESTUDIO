# SIM-TEST:6-FIX14-R6 Root Cause

## Stop condition

R6 is certifiable only if the four Level 4 FINAL:6.3 failures are traced layer by layer and causally classified, each proven root is repaired at its existing 6.3 owner, current-turn ambiguity cannot be skipped merely because continuity exists, creation/resume/reset behave correctly, independent requests and navigation still supersede non-commitment clarification, commitment protection holds, R5 6.1 semantics are untouched, and no new clarification store or R6-attributable L1–L4 regression appears. FINAL:6.4 stays out of scope.

## Pre-repair trace

| Case | CC:1 | 6.1 | 6.2 / context | Clarification state before | 6.3 gate | Expected | Actual | First wrong seam |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `Show Risk.` → `Show the risk problem.` | `focus` | FOCUS, unresolved `multiple-objects`, `[obj-risk:object, ctx-problem-margin:problem, ctx-problem-capacity:problem]`, ref null | FOCUS, `UNRESOLVED`, `typed-reference`, LOW, ref null | none; continuity `active=obj-risk`, thread `[obj-risk@1]` | `TYPE_AMBIGUITY` → skipped because a thread exists | clarify | proceed | `evaluateClarificationGate` TYPE_AMBIGUITY continuity skip (SIM-TEST-5-FIX3) |
| `Show Delivery.` → `Show Capacity.` → `Explain that.` | `explain` | EXPLAIN, no ref, no ambiguity | EXPLAIN, `obj-capacity` via `CONTEXT_ACTIVE_SUBJECT`, `pronoun`, MEDIUM; Delivery is `CONTEXT_PREVIOUS_SUBJECT` | none; continuity `active=obj-capacity`, `previous=obj-delivery`, thread `[obj-delivery@1, obj-capacity@2]`, turnIndex 2 | `that` + two thread subjects rule suppressed by `deicticFollowsActiveSubject` (SIM-TEST-6-FIX6) | clarify | proceed | `evaluateClarificationGate` FIX6 knowledge-op exemption |
| Resume (`Capacity.` after the above) | `focus` | FOCUS, `obj-capacity` explicit | FOCUS, `EXPLICIT_CURRENT_TURN` | **none**; no pending was ever created | n/a | resume → `explain` on Capacity | proceed | Downstream of `Explain that.`. After the creation repair, a hidden seam appeared: resume returned `focus`, not `explain` (see Cluster C) |
| Reset (fresh session after the above) | n/a | n/a | n/a | precondition fails: `pendingClarification` is null before reset | n/a | pending exists, then reset clears it | assertion on the precondition fails | Downstream of `Explain that.`. Reset itself was never reached |

## Classification

- **Cluster A — after-Risk:** independent within 6.3. The FIX3 skip treats any existing continuity as permission to ignore TYPE_AMBIGUITY. An audit of every certified SIM-TEST journey showed that every turn relying on that skip has 6.1 ambiguity `none` with zero current-turn candidates. Those candidates come from 6.2 context for typed references such as `This decision`, `That risk`, and `What's the outcome?`. The after-Risk turn is the only one where the current utterance itself names several canonical candidates and 6.2 does not reduce them.
- **Cluster B — `Explain that.`:** independent within 6.3. FIX6 exempted every knowledge operation with an active subject from the `that` + thread rule to fix T81 `What supports that now?`. At T81 the thread was `[…, obj-capacity@64, obj-delivery@71]`, so Delivery had been sustained for seven turns. In `Explain that.` the two most recent turns each engaged a different subject (`@1`, `@2`), so a bare distal `that` genuinely has two live referents.
- **Resume / reset:** downstream of Cluster B. Neither had pending state to act on.
- **Cluster C — resume operation:** independent within 6.3 and exposed only after Cluster B was repaired. The FIX8 overlay in `applyResumedMeaningToIntent` kept CC:1 `focus` for every resume. In FIX8 the pending came from `Look at that.` (FOCUS), so that was correct there. For a pending EXPLAIN, it replaced the resumed operation with `focus`.
- The shared hypothesis that one broad "continuity exists → proceed" rule suppresses everything was **rejected**. A and B are two different skips with different origins and different correct conditions.
- Test-expectation errors: none. Observer/harness errors: none.

## Lifecycle (existing owners, unchanged)

| Transition | Owner |
| --- | --- |
| NONE → CREATED/PENDING | `evaluateClarificationGate` decides; `ask()` in `nexoraMvpFinal63ClarificationResolver.ts` builds `PendingClarification` via `freezePendingClarification` |
| PENDING state | `ManagerObjectSession.pendingClarification` (`managerObjectActive.ts`) |
| RESOLVED (resume) | `interpretClarificationTurn` candidate/ordinal/named match → `action: "resume"`; intent overlay `applyResumedMeaningToIntent` |
| SUPERSEDED | `isNewCompleteRequest` / `isIndependentlyResolvableWhilePending`, unmatched `what about`/`switch to` re-evaluation, commitment-intent cancel |
| CANCELLED | `isCancel` → `action: "cancel"` |
| RESET | New session boundary: `createEmptyManagerObjectSession()` sets `pendingClarification: null` |
| EXPIRED/lifetime | `loopCount` and question signature in `ask()` (repeat → fail), `park`/`unpark` |

Canonical subject state (`ManagerObjectSession.activeObjectId`, executive context), 6.2 conversation continuity (`conversationContinuity` snapshot), NCA/Advisor state (`ncaConversationState`), and clarification state (`pendingClarification`) are separate fields. R6 reads continuity and writes none of them.
