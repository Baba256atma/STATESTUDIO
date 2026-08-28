# NXA:5-FIX3B-DIAG2 — Execution Collection Correction, Pending-Question Hijack & False Evidence-Claim

## Verdict

**NXA:5-FIX3B-DIAG2 = COMPLETE**

- No Fix was implemented
- FIX3B remains **uncertified**
- Production files modified by DIAG2: **0**
- Test files modified by DIAG2: **0**
- FIX3C / FIX3D were not started
- NXA:6 was not started
- Previous certifications were not revoked or silently changed (NXA:5, FIX1, FIX2, NXA:6-PREP remain CERTIFIED; FIX3-DIAG and FIX3D-DIAG remain COMPLETE; FIX3A remains CERTIFIED)

This is **not** `NXA:5-FIX3B = CERTIFIED` and **not** final NXA:5-FIX3 certification.

---

## Observed vs reproduced copy

Live `/executive` after a healthy Stage (one listener, PID 62339, page errors 0) reproduced the **same semantic sequence** as the isolated executor.

| Turn | Manager | Reported original | This diagnosis (executor + live) |
| --- | --- | --- | --- |
| A | `show all executive` | `Are you asking about the problem or the KPI?` | `Do you mean Margin Pressure or Capacity Gap?` |
| B | `I am asking of Executions` | capacity-pressure hypothesis copy | **exact match** (punctuation included) |
| C | `show me execution` | `I'm not sure which issue you mean. Name the one you want to investigate.` | **exact match**; Stage Queue became `Executions · 2` |

Turn A’s original mixed-kind wording was **not** reproduced on the current demo catalog. Source still contains `KIND_LABEL.object = "KPI"` and the `Are you asking about the ${labels[0]} or the ${labels[1]}?` composer when candidates have mixed kinds and count > 2. This session used two same-kind Problem members, so the two-name template ran. Defect A is still **REPRODUCED** as an irrelevant Problems clarification after `show problems`. Exact original KPI wording: **INSUFFICIENT_EVIDENCE** for this catalog (not ENVIRONMENT_BLOCKED; Stage was healthy).

This conversation is **not** the prior stale-server PREPARING STAGE incident.

---

## Per-defect results

### 1. Irrelevant Problem/KPI clarification (`show all executive`)

- **Reproduction:** REPRODUCED (irrelevant Problems members). Exact “problem or the KPI” copy: INSUFFICIENT_EVIDENCE on this catalog.
- **Impact:** IRRELEVANT_CLARIFICATION, REFERENCE_RESOLUTION_DEFECT, UNCOVERED_CAPABILITY_GAP, PRE_EXISTING_REGRESSION
- **Severity:** P2 (wrong candidates; no evidence mutation)
- **Actual route:** CC:1 `focus` (hints `all executive`) → NLU FOCUS / `missing-referent` / empty candidates → POST:2 collection query null (`executive` ≠ `executions?`) → FINAL:6.3 `MISSING_SUBJECT` with candidates Capacity Gap, Margin Pressure → Advisor ASK_MANAGER → DIR `NO_CHANGE` → Stage stays Problems
- **Expected:** resolve Executions only with high-confidence collection grammar, **or** clarify among actual plausible referents (Executions vs Executive Overview), not Problem members / KPI
- **First divergent layer:** CC:1 collection noun list (`executions?` only) plus 6.3 candidate fill from active Problems / failed-turn subjects
- **Owner:** CC:1 + FINAL:6.3 gate/composer (not FIX3B criterion)
- **FIX3B attribution:** unrelated / pre-existing. FIX3B did not run (`activeComparison` false; expected answer is 6.3 `choice`, NCA:2 infers `FREE_TEXT`)
- **Smallest repair:** relevant candidates from current input + workspace collections; do **not** map every `executive` → Executions

### 2. Correction-to-Executions misclassification (`I am asking of Executions`)

- **Reproduction:** REPRODUCED (also D6 `I mean Executions`)
- **Impact:** MANAGER_CORRECTION_MISCLASSIFICATION, PENDING_QUESTION_HIJACK, STALE_DIALOGUE_STATE, PRE_EXISTING_REGRESSION
- **Severity:** P1 (epistemic copy + unauthorized **dialogue** consumption; not P0 because business evidence stores did not change)
- **Actual route:** CC:1 `unknown`; NLU `NONE`/`UNKNOWN`; collection query null; 6.3 pending unmatched → `ask()` loopCount 1, action still `clarify`; `isContextualShortAnswer` true (`I am asking` is not a `show|…` prefix); `inferExpectedInformation` of “Do you mean … or …?” is **FREE_TEXT** (`which` absent; `\bor\b` is not the OPTION cue); `extractAnswer` accepts any non-empty FREE_TEXT; NCA:2 `ANSWER_NEXORA`; orchestrator clarify `finish()` sets `preservePresentedResponse` but **not** `lockPresentedResponse`, so NCA:2 overwrites the 6.3 re-ask
- **Expected:** meta-correction / collection resolve to Executions; no business assertion
- **First divergent layer:** NCA:2 pending consumption (`isContextualShortAnswer` + FREE_TEXT) **and** missing lock on the 6.3 clarify finish path. 6.3 `isCorrection` never runs because the pending block returns first. `isCorrectionUtterance` requires `i was asking about`, not `i am asking of`.
- **Owner:** NCA:2 + orchestrator lock on clarify
- **FIX3B attribution:** **exposed / interaction**, not caused. FIX3B’s PRIORITY allowlist would **reject** this utterance; that path was not active. POST:2 assertion regex does not match (`am` is not `is|are|was|were…`).
- **Smallest repair:** treat typed collection/object corrections as incompatible with a subject-choice pending question; lock NCA:2 when 6.3 owns the turn; do not hard-code Executions phrases

### 3. False capacity-hypothesis statement

- **Reproduction:** REPRODUCED
- **Impact:** FALSE_EVIDENCE_CLAIM, PRE_EXISTING_REGRESSION
- **Severity:** P1 (false epistemic claim to the manager). Not P0: no hypothesis store write
- **Actual route:** `composeNca2ContinuityResponse` hard-coded `ANSWER_NEXORA` copy: “That helps. It strengthens the capacity-pressure hypothesis.” plus the investigating-capacity sentence. Writer is **NCA:2 composer**, not Data Reality / evidence authority
- **Expected:** no causal/hypothesis language for a meta-correction
- **First divergent layer:** NCA:2 continuity composer after unauthorized ANSWER_NEXORA
- **Owner:** NCA:2
- **FIX3B attribution:** pre-existing copy; FIX3B did not introduce it

### 4. Potential evidence / state mutation

- **Reproduction:** REPRODUCED for **NCA:2 dialogue state only**; **NOT_REPRODUCED** for evidence/hypothesis/observations/collection/DIR
- **Impact:** STALE_DIALOGUE_STATE (dialogue). Not UNAUTHORIZED_STATE_MUTATION of evidence
- **Severity:** P2 for dialogue (pending consumed, lastAnswer stored). Evidence/hypothesis: no mutation → do not elevate to P0
- **State audit (turn B):**

| Authority | Before | After | Changed? | Authorized? |
| --- | --- | --- | --- | --- |
| NCA:2 pending | Do you mean Margin Pressure or Capacity Gap? FREE_TEXT ACTIVE | null | YES | NO (wrong answer type) |
| NCA:2 lastAnswer | null | FREE_TEXT raw `I am asking of Executions` | YES | NO |
| NCA:2 answeredMissing | [] | `advisory-context` | YES | NO |
| FINAL:6.3 pendingClarification | same question, loopCount 0 | same candidates, loopCount 1 | YES (loop) | 6.3 re-ask yes; not a collection resolve |
| Trusted claims / hypothesis texts | 7 claims (Margin Pressure facts/hypotheses) | identical | NO | n/a |
| Investigation thread | null | null | NO | n/a |
| managerObservations | [] | [] | NO | n/a |
| Active collection / members / focus | problem / Capacity+Margin / null | same | NO | n/a |
| Executive problem/execution context | Margin Pressure / null | same | NO | n/a |
| DIR | — | NO_CHANGE | NO | yes |
| shouldCommitRuntime | — | false | NO | yes |
| navigationGoal.persisted | false | false | NO | n/a |

- **Did authoritative evidence state change?** NO
- **Did hypothesis state change?** NO (composer claims capacity; stored hypothesis texts unchanged)
- **Did durable memory change?** NO (executor `persisted: false`; no observation/evidence ID written). Live refresh/session-reset survival: not separately proven; no durable writer fired → no containment blocker
- **Did only Advisor copy change?** NO — NCA:2 lastAnswer/pending/answeredMissing changed. YES for evidence/hypothesis/Data Reality/Executions
- **Containment:** do not wipe session. Safest recovery if a live session still shows the false sentence: start a **new** overview session (non-destructive). Do not delete stores.

### 5. Explicit `show me execution` hijack

- **Reproduction:** REPRODUCED (Advisor copy)
- **Impact:** PENDING_QUESTION_HIJACK, EXPLICIT_COMMAND_PRECEDENCE_DEFECT, ADVISOR_STAGE_DIVERGENCE, UNCOVERED_CAPABILITY_GAP, PRE_EXISTING_REGRESSION
- **Severity:** P1
- **Actual route:** CC:1 `show-execution`; POST:2 `EXECUTION` ALL; 6.3 pending still the Problems choice; `isNewCompleteRequest` false (no `objectReference`; collection intents omitted); `show-execution` is **not** in the pending-cancel intent list (`commit|prefer-option|start-execution|confirm-decision`); unmatched → `ask()` loopCount 2 → **fail** copy. `isContextualShortAnswer` already excludes `show…` (NCA:2 did not consume this turn)
- **Expected:** explicit collection command outranks stale 6.3 pending; Executions collection copy
- **First divergent layer:** FINAL:6.3 `isNewCompleteRequest` / pending fallthrough `ask()`
- **Owner:** FINAL:6.3 resolver; orchestrator `finish()` still runs POST:3+DIR
- **FIX3B attribution:** unrelated. B9 covers NCA:2 PRIORITY vs `show decisions`, not 6.3 `pendingClarification`

### 6. Executions collection presentation failure

- **Reproduction:** **partial**. Advisor failed; **Stage succeeded** (DIR `SHOW_COLLECTION`, members Capacity Expansion + Pricing Rollout, live Queue `Executions · 2`, `shouldCommit: true`)
- **Impact:** ADVISOR_STAGE_DIVERGENCE (not a DIR miss). User-visible Advisor failure remains COLLECTION_PRESENTATION_FAILURE on the Advisor surface
- **Severity:** P1 Advisor; Stage path is working
- **Actual:** `finish()` line `shouldCommitRuntime: args.shouldCommitRuntime || directorPlan.mutationRequired` ORs the fail path (`shouldCommitRuntime: false`) with DIR mutation → Stage commits while Advisor keeps fail copy
- **Expected:** both Advisor and Stage show Executions **or** both hold until clarification is cancelled by the command
- **First divergent layer:** orchestrator shouldCommit OR after 6.3 fail (downstream of defect 5)
- **Owner:** conversationalExperienceOrchestrator `finish` + 6.3
- **FIX3B attribution:** pre-existing OR; not FIX3B

---

## Independent matrix (D1–D10)

See `D1-D10-MATRIX.md`. Summary:

| Case | Clean session | Result |
| --- | --- | --- |
| D1 `show executions` | yes | CC:1 `show-execution` + DIR SHOW_COLLECTION. Advisor: `Which decision do you want to approve?` (6.3 `show-execution` mapped to COMMITMENT). Live same Advisor miss; Stage Executions |
| D2 `show execution` | yes | Executor: same COMMITMENT overlay. **Live:** `Current Executions: Capacity Expansion, Pricing Rollout.` INTERMITTENT Advisor copy vs executor |
| D3 `show me all executions` | yes | Same as D1 (executor + live) |
| D4 `show all executive` | overview, no Problems | not-found `All Executive`; **not** Problem/KPI. Problems context is required for defect A |
| D5 after Problems | | same as turn A |
| D6 `I mean Executions` | | **same capacity-pressure copy** as turn B. 6.3 pending still blocks `isCorrection` |
| D7 FIX3B pending + `show executions` | | Criterion question works; `show executions` **does** change Stage to Executions but Advisor asks `Which decision do you mean — Margin Pressure or Capacity Gap?` (COMMITMENT + stale Problem names). Explicit command does **not** become ANSWER_NEXORA (FIX3B B9 still holds for NCA:2) |
| D8 `urgency` | | FIX3B intended path **works** |
| D9 `orders increased 20%` | | Genuine evidence: intent `evidence`, magnitude copy about 20%, follow-up about orders vs throughput. Structurally unlike turn B (no percent, unknown intent, FREE_TEXT lastAnswer of meta-text) |
| D10 `exlpain Demand Surge` | | FIX3A read-only Explain; DIR NO_CHANGE; Stage stays Scenarios. Live full scenario explanation |

---

## Regression attribution (FIX3B)

Inspected uncommitted FIX3B (`nexoraNxa5Fix3B*` tests + NCA:2 PRIORITY `extractAnswer` + orchestrator resume guard). **Not reverted.**

1. FIX3B added a **narrower** PRIORITY pending answer (allowlist). It did **not** broaden FREE_TEXT.
2. Interruption: B9 asserts `show decisions` is not ANSWER_NEXORA. It does **not** cover 6.3 `pendingClarification` vs `show-execution`.
3. Arbitrary text cannot satisfy PRIORITY; it **can** satisfy FREE_TEXT. Turn B is FREE_TEXT.
4. Stale 6.3 pending survives turn B because 6.3 `ask()` increments loopCount instead of cancelling.
5. Assertion classification: not changed by FIX3B for this utterance (NLU UNKNOWN; POST:2 collection null).
6. Active comparison was **false** on turns A–C.
7. Pre-FIX3B: capacity copy, 6.3 KIND_LABEL, `show-execution`→COMMITMENT, `isNewCompleteRequest`, and shouldCommit OR all exist on the current sources independently of FIX3B’s criterion allowlist. Would diverge on pre-FIX3B for A/B/C.
8. Safe establishment: source/diff + executor; no stash/checkout.
9. Suite lacked this live sequence (executive noun, `I am asking of`, 6.3 loop fail vs collection).
10. Tests passed because they never combined Problems-context `executive` + FREE_TEXT pending + 6.3 loop≥2 + Advisor/Stage split.

**Defects A–C are not a FIX3B regression.** FIX3B remains incomplete to certify because this live sequence fails.

---

## Future principles (already exist / failed / owner)

1. Explicit commands outrank unrelated pending — **failed** at FINAL:6.3 `isNewCompleteRequest` (NCA:2 already excludes `show`).
2. Correction must not become business evidence — **failed** at NCA:2 composer + FREE_TEXT; evidence stores **did** hold.
3. `I mean X` / `I am asking about X` as meta-correction when X resolves — **failed**; `I mean Executions` same as `I am asking of`. NLU CORRECT cues too narrow; 6.3 pending runs first.
4. Meta-correction must not create facts/evidence — **held** for stores; **failed** for copy.
5. Pending accepts only compatible answer types — **failed** for NCA:2 FREE_TEXT mirroring 6.3 choice; FIX3B PRIORITY **holds** on D8.
6. Incompatible answer should interrupt/escape — **failed** (consumed as evidence-copy).
7. Singular/plural collection — **partial**: CC:1 `executions?` works; `executive` does not; Advisor COMMITMENT overlay often hides success.
8. Clarification candidates relevant to input — **failed** after Problems.
9. Resolved collection must reach DIR/Stage — **held** on turn C / D1–D3 / D7 Stage; Advisor often diverges.
10. No Executions special-case — **must remain**. Repair via generic collection + meta-correction + pending type.

---

## Fix partition

**3 future Fix prompts** (do not implement now):

1. **NXA:5-FIX3B-FIX1 — Meta-Correction & False Assertion Prevention**  
   Owner: NCA:2 + orchestrator `lockPresentedResponse` on 6.3 clarify. Defects 2–4 (copy + dialogue). Focused: `I am asking of Executions`, `I mean Executions` after 6.3 choice; D9 still genuine evidence.

2. **NXA:5-FIX3B-FIX2 — Explicit Collection Command vs 6.3 Pending**  
   Owner: FINAL:6.3 `isNewCompleteRequest` + orchestrator shouldCommit OR. Defects 5–6. Focused: pending 6.3 + `show me execution` / `show executions`; Advisor and Stage both Executions.

3. **NXA:5-FIX3B-FIX3 — Relevant Clarification & Collection-vs-Commitment**  
   Owner: CC:1/POST:2 nouns + FINAL:6.3 candidates / `clarificationConsequence` (do not treat `show-execution` as COMMITMENT). Defects 1, D1–D4, D7 Advisor. Focused: `show all executive` clean vs after Problems; `show executions` collection copy.

Do **not** revert FIX3B wholesale. Do **not** hard-code Executions phrases. Do **not** hide the capacity sentence without reclassifying the turn.

After these repairs, FIX3B may **resume** certification (automated + live). DIAG2 does not resume it.

Details: `FIX-PARTITION.md`.

---

## Gates

| Gate | Result |
| --- | --- |
| Executor | `npx tsx artifacts/nxa5/NXA-5-FIX3B-DIAG2/reproduce-nxa5-fix3b-diag2.ts` inspected |
| Live `/executive` | `node artifacts/nxa5/NXA-5-FIX3B-DIAG2/live-nxa5-fix3b-diag2.mjs`; page errors **0**; Stage not PREPARING |
| Harness | `node scripts/nxa-conversation-harness.mjs` 10/10 PASS |
| Funnel | Level **1** only PASS (no L4, no FIX3 milestone) |
| nxaConversation | enabled for executor, **default-off after** (`scopes.nxaConversation: false`) |
| Server | single `node` PID **62339** on :3000; not started or killed by DIAG2 |
| Production/test files by DIAG2 | **0** / **0** |
| FIX3B worktree | preserved |

Artifacts: `frontend/artifacts/nxa5/NXA-5-FIX3B-DIAG2/`
