# NPA-T DTH-EXP:7B — Advisor → Theatre Scene Response

**Status: CERTIFIED**

Date: 2026-09-18.

Stop. Do not start DTH-EXP:8.

## Status

**NPA-T DTH-EXP:7B — CERTIFIED**

## 1. Architecture inspected

DTH-EXP:1–7A, DTH:1–12, DIR:1, CC:5, ECA, NCA, NPS, SYS/MRA referent repairs, NEX-MVP:3/4, MO, NMI, VAI, CC:8/10/11, CORE-OUT. See `ARCHITECTURE-INSPECTION.md`.

## 2. Theatre Scene Response contract

`orchestrateDthExpTheatreSceneResponse` returns composed / same-family-refined / preserved / unresolved / insufficient-context, with subject, need, families, 4A–6 results, management reason, and reduced-motion flag. Not a Scene store.

## 3. Existing intent/referent reuse

Input is `DthExpInterpretedConversationTurn` plus optional 7A awareness. Raw utterance, if present, is ignored. No Theatre keyword router.

## 4. Canonical-subject continuity

7A grounding / conversation referent IDs flow through 4A, 4B, Scene, 5A, 5B, and 6. Theatre focal never replaces subject.

## 5. Responsibility boundaries

Advisor converses. DIR:1/4A selects Nexo. 4B selects context. 5A layouts. 5B plans motion. 6 projects Evidence. `advisorToSceneShortcut: false`.

## 6. Perspective-change behavior

Bars→Cause, Cause→Impact, Impact→Risk change family around the same subject unless conversation switches subject.

## 7. Same-family / no-change behavior

Flow→bottleneck stays NEXO_FLOW with refined layout. Preserve/evidence-inspection does not recompose for Advisor text alone.

## 8. Evidence-aware response

Evidence inspection keeps the current family/scene and exposes CC:8 refs. It does not auto-switch to NexoCause.

## 9. Stale-context / ambiguity safety

Named Margin Pressure outranks Product Line A visuals. Ambiguous deixis yields unresolved with no guessed scene. Collection member identity is preserved.

## 10. Causal / VAI / Risk / Execution / Outcome

Cause keeps `associated`. Impact consumes VAI LEVER. Risk is not calculated. Execution/Outcome authorities unchanged. No canonical writes.

## 11. Transition / interruption / reduced-motion

5B plans source→target. Latest plan supersedes via `supersedesPlanId`. Reduced-motion keeps subject, family, actors, and Evidence meaning.

## 12. Initial-scene / missing-context

First compose works without a prior scene (no 5B plan). Missing 4B context returns insufficient-context without invented actors.

## 13. Certification journey

Compare (Bars, no prior scene) → deictic why (Cause) → what supports it (preserve) → what can I change (Impact) → how risky (Risk) → Show Margin Pressure → investigate it (Cause on Margin) → Flow bottleneck refinement → ambiguous explain-this unresolved → reduced-motion Cause.

## 14. Files

Created: theatre-scene-response identity/boundary/contract/orchestrator/tests and `artifacts/dth-exp/DTH-EXP-7B/*`.

Modified: `dthExpPublicIndex.ts`.

## 15. Focused tests

DTH-EXP:7B + :1–7A — **343 pass / 0 fail**. ESLint 0. Typecheck pass.

## 16. Regressions

None observed in DTH-EXP:1–7A focused suite.

## 17. Remaining debt

See `KNOWN-DEBT.md`. No live Stage wiring. DTH-EXP:8 not started.
