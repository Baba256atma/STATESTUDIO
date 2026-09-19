# NPA-T DTH-EXP:7A — Advisor Scene Awareness & Deictic Grounding

**Status: CERTIFIED**

Date: 2026-09-18.

Stop. Do not start DTH-EXP:7B.

## Status

**NPA-T DTH-EXP:7A — CERTIFIED**

## 1. Architecture inspected

DTH-EXP:1–6, DTH:1–12, DIR:1, CC:5, ECA, NCA, NPS, SYS:1-FIX1/FIX2/RECERT, PRE-RMS:FIX1, MRA referent repairs, NEX-MVP:3/4, MO, NMI, VAI, CC:8/10/11, CORE-OUT. See `ARCHITECTURE-INSPECTION.md`.

## 2. Advisor Scene Awareness contract

`projectDthExpAdvisorSceneAwareness` emits a frozen snapshot: family, conversational subject, Theatre focal (context only), visible/primary/supporting/contextual actors, visual roles, relationship refs, CC:8 Evidence refs, grounding, ambiguity. Not a second Scene model.

## 3. Referent authority reuse

Identity owner remains CC:5 / ECA / NCA / MO. 7A consumes `DthExpConversationReferentState` (`conversation-named`, `click`, `conversation-deictic`). No TheatreReferentResolver.

## 4. Canonical-ID grounding

Grounding uses canonical Object IDs only. Labels, coordinates, size, animation, and first-visible actors are never identity.

## 5. Visual-focus / selection rules

Theatre focal/emphasis is descriptive. Named subject outranks focal actor. Legitimate `selectedCanonicalObjectId` from existing click ownership may ground deixis. No DTH-EXP-only selection memory.

## 6. Deictic Object grounding

Follow-up and investigation reuse conversation subject. 7A does not switch to NEXO_CAUSE.

## 7. Relationship / Evidence awareness

Presented NMI semantics are exposed without upgrade. Evidence refs remain CC:8 and are not MO Objects. Expanded Evidence is not automatic subject.

## 8. Ambiguity / collection safety

Multiple equally plausible Risks/Evidence/relationships without conversation selection → ambiguity, no nearest/largest/first guess. Named collection member (Project Beta) is not replaced by the collection or first member.

## 9. Scene-change / stale-context safety

Flow→Cause preserves subject. Visual-role change, entering/exiting, and animation do not rewrite subject. Newer conversation generation outranks stale Theatre snapshots.

## 10. Reduced-motion / missing Theatre

Grounding is identical with reduced motion. Missing Theatre still returns conversation subject (`theatreAvailable: false`).

## 11. Authority boundaries

Stage NEX-MVP:3/4. Director DIR:1. Advisor CC:5. `requestsSceneChange: false`. `startsDthExp7B: false`. No Decision/Execution/Outcome/VAI writes.

## 12. Certification journey

Named Product Line A → deictic follow-up → Flow→Cause subject continuity → Evidence supports-it → named Margin Pressure → investigate-it stays Margin Pressure without Nexo switch → two-Risk ambiguity → existing click selection → stale snapshot loses to newer referent → reduced-motion equivalent.

## 13. Files

Created: advisor-scene-awareness identity/boundary/contract/projector/tests and `artifacts/dth-exp/DTH-EXP-7A/*`.

Modified: `dthExpPublicIndex.ts`.

## 14. Focused tests

DTH-EXP:7A + :1–6 — **297 pass / 0 fail**. ESLint 0. Typecheck pass.

## 15. Regressions

None observed in DTH-EXP:1–6 focused suite.

## 16. Remaining debt

See `KNOWN-DEBT.md`. DTH-EXP:7B not started.
