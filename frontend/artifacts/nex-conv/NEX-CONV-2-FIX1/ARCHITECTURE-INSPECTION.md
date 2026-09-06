# NEX-CONV:2-FIX1 — Architecture inspection

Inspection date: 2026-09-06.

## 1. Exact source of `NEXORA is stable.`

Legitimate educational fixture status for `obj-nexora-entrance` (`label: NEXORA`, `status: "stable"`) in `entranceEducationCatalog` (`nexoraGuidedEntranceExperience.ts`).

Composer: `composeSituation` in `managerObjectExplainEngine.ts` (`MO:2/GenericExplainEngine`) emits `{label} is {state}.`

Previously, a **relevance** question reached that composer because:

1. Guided Entrance `classifyGuidedEntranceMove` did not treat NCA `GOAL_RELEVANCE` as a guided move (WHY_HERE was only exact `"why is this"` / `"why am i here"`).
2. The turn fell through to CC **explain**.
3. `resolveExplanationLens` mapped importance phrasing to focus `significance`.
4. `composeSignificance` is null for the educational NEXORA actor (no associated Goal/Problem).
5. Older `composeManagerFacingText` for significance **prepended** `currentSituation`, so the manager-facing sentence collapsed to `NEXORA is stable.`

`stable` is a legitimate educational **status** value. It was intended for status/state questions (`Is this stable?` / `ASK_STATUS`), not for relevance/importance.

## 2. Exact routing path (before)

Manager utterance → NCA meaning (often `CAUSE` from cue `"why"` weight 4 beating `"important"` weight 2) → Entrance did not own the turn → CC explain → MO:2 significance lens → situation sentence.

CONV:1 and CONV:2 were bypassed.

## 3. NCA meaning (after)

`isManagerRelevanceNeed` + `refineOperationForManagerNeed` map CAUSE/EXPLAIN → `ATTENTION` when the utterance is importance/matter/relevant/worth and is **not** causal, on-stage, investigate, recommend, or first.

`interpretCanonicalManagerMeaning` then sets `questionType: GOAL_RELEVANCE`.

Presence WHY (`on stage` / `why is this here`) is **not** relevance: `questionType` stays `EXPLANATION` with `ASK_WHY`.

Causal WHY keeps `questionType: CAUSE`.

Status uses cue `stable` / operation `STATUS` → `ASK_STATUS`.

## 4. Subject resolution

Entrance relevance uses existing deictic/educational subject `NEXORA_ENTRANCE_OBJECT_ID` (`obj-nexora-entrance`). Not pushed into the business object store. Object education uses the active educational object, not a NEXORA-only router.

## 5. Purpose resolution

`conversationPurposeFromMeaning`:

- `questionType === CAUSE` → `CAUSE`
- `questionType === GOAL_RELEVANCE` → `WHY_RELEVANT`
- `ASK_WHY` → `WHY_PRESENT`

Causal is not collapsed into presence. Relevance is not collapsed into status or WHY_PRESENT.

## 6. CONV:1 participation

Guided move `RELEVANCE` calls `resolveConversationalMove` with purpose `WHY_RELEVANT`. Initial move `EXPLAIN_WHY`. Repeated turns progress coverage (`DEEPEN` / `CONNECT` / `OFFER_NEXT` / `CLARIFY` per existing policy). No Entrance-only ladder.

## 7. CONV:2 participation

`resolveThreadIntelligence` with objective `LEARN_CAPABILITY`. Covered purpose `WHY_RELEVANT` is recorded on the thread. No CONV:3.

## 8. Content authority

Entrance relevance copy is the certified product-capability projection already used for introduction (`composeRelevanceCopy` in `nexoraEntranceConversationContinuity.ts`). Object-education relevance copy explains educational role, not business priority. MO:2 significance remains for business objects when EI/context supports it. CONV does not invent importance.

## 9. Composer

- Relevance (Entrance): `composeRelevanceCopy`
- Relevance (Object education): `composeObjectProgressionCopy` purpose `WHY_RELEVANT`
- Status: MO:2 `composeExecutiveObjectExplanation` / `composeSituation`
- Business explain: MO:2, significance no longer prepends status

## 10. Suggested-action path

Relevance sets continuity `subject: CAPABILITY` and uses existing `suggestedActionsForContinuity` (Show me / Skip). Previously the explain/status path never set that continuity, so chips were absent. No second chip engine. No CSS.

Show me remains `NEXORA_GUIDED_ENTRANCE_AFTER_CAPABILITY_ACTIONS` → utterance `Show me` → existing Continue/Stage handoff → Director/Stage. Failed SHOW is not marked demonstrated (CONV:1/2 policy unchanged).

## 11. Routing precedence (corrected)

1. Skip / explicit repeat / lesson-owned utterances
2. NCA `GOAL_RELEVANCE` → CONV relevance (Entrance or object education)
3. Follow-up Why? / What do you mean? / How? when last purpose is `WHY_RELEVANT`
4. NCA `ASK_STATUS` → MO:2 status/situation (Entrance)
5. Capability / Stage education / identity
6. CC / Advisor / EI for investigation, recommendation, causality, collections
7. Generic fallback last

Semantic meaning wins over template order.

## 12. Chosen fix

Integration repair: NCA relevance vs presence vs cause vs status; CONV purpose mapping; Entrance consumes CONV:1/2; MO:2 status composition separated from significance; suggested-action handoff via existing continuity subject `CAPABILITY`.

## 13. Duplicate-authority audit

No second NLU, object registry, Entrance conversation engine, suggested-action engine, Advisor, Stage/Director, CONV:3, transcript DB, or extra LLM hop.

## Authority matrix

| Concern | Canonical owner | FIX1 |
| --- | --- | --- |
| Manager meaning | NCA | consumes / refines operation+questionType |
| Subject/reference | NCA/NXA/MO/educational context | consumes `obj-nexora-entrance` / active object |
| Turn progression | CONV:1 | uses `WHY_RELEVANT` |
| Thread progression | CONV:2 | uses `LEARN_CAPABILITY` |
| Relevance content | product/educational copy + MO:2/EI when supported | routes; does not invent |
| Business importance | EI/Advisor | never invents |
| Suggested actions | existing continuity composer | integrates CAPABILITY subject |
| Presentation | Director/Stage | requests via Show me / Continue |
| Data semantics | DATA-ADV / Data Reality | never writes |
| Decision | CC:10/10R | never writes |
| Execution | CC:11 | never writes |
