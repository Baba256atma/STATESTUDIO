# NPA-T DTH-EXP:6 — Evidence in Scene

**Status: CERTIFIED**

Date: 2026-09-18.

Stop. Do not start DTH-EXP:7.

## Status

**NPA-T DTH-EXP:6 — CERTIFIED**

## 1. Architecture inspected

DTH-EXP:1–5B, DTH:1–12, DIR:1, NEX-MVP:3/4 Stage, CC:8 Evidence, RDI / Data Reality, DATA-ADV:2 semantic candidates, NMI, VAI:1–8, NPS causal safety, CC:10 Decision, CC:11 Execution, CORE-OUT. See `ARCHITECTURE-INSPECTION.md`.

## 2. Evidence Scene contract

`projectDthExpEvidenceScene` projects existing CC:8 records into Theatre participants: identity, provenance, support/semantic/freshness/causal-support metadata, attachment, disclosure, 5A position, scene relevance. Missing Evidence is a separate safe record, not invented Evidence.

## 3. Identity / authority

Evidence ID remains the CC:8 ref. Participants are not Theatre Actors and not MO catalog members. One shared engine: `DTH-EXP:6/SharedEvidenceProjection`. `startsDthExp7: false`.

## 4. Attachment grammar

Actor / relationship / investigation / scene. Scene-level only when the record is scene-attached. Specific attachment preferred. 4B `evidenceAttachments` remain the selected ref set.

## 5. Provenance / support / uncertainty

Reuse DATA-ADV:2 and Data Reality states. Missing provenance is `null` (`provenanceInvented: false`). Scene relevance is not strength. Prominence and Evidence count do not create confidence.

## 6. Missing / insufficient

Explicit missing states (insufficient, under-review, unresolved meaning, unavailable). Insufficient causal Evidence stays `insufficient`. No fake Evidence.

## 7. Family-aware behavior

One projector. Disclosure varies by family (Flow indicator/summary, Cause summary/expanded, Impact/Risk contextual). Families do not rank, recalculate, assign VAI, calculate Risk, create Timeline, upgrade causality, or write Decision/Execution/Outcome.

## 8. Spatial / transition integration

5A `evidenceHints` positions reused. 5B persistent Evidence refs keep identity (`5b-identity-preserved:`). Reduced-motion lists attachment, disclosure, support, provenance, uncertainty without movement.

## 9. Data Reality / semantic ambiguity

Under-review is not promoted to accepted. Historical/removed/stale do not supply current reality. Field `BKL` remains unresolved.

## 10. Causal / Decision / Execution / Outcome

No causal upgrade from proximity, count, disclosure, or animation metadata. No Decision/Execution/Outcome writes.

## 11. Determinism

Same scene + selected refs + records + family + 5A projection → same Evidence Scene Projection.

## 12. Certification journey

Product Line A: Flow indicators → bottleneck Flow (prominence without truth change) → Cause expand with provenance → staffing causal challenge insufficient → BKL unresolved → Cause→Impact identity + reduced-motion meaning.

## 13. Files

Created: `dthExpEvidenceSceneIdentity.ts`, `dthExpEvidenceSceneBoundary.ts`, `dthExpEvidenceSceneContract.ts`, `dthExpProjectEvidenceScene.ts`, `dthExpEvidenceScene.test.ts`, `artifacts/dth-exp/DTH-EXP-6/*`.

Modified: `dthExpPublicIndex.ts`.

## 14. Focused tests

DTH-EXP:6 + :5B + :5A + :4B + :4A + :3B + :3A + :2 + :1 — **254 pass / 0 fail**. ESLint 0. Typecheck pass.

## 15. Regressions

None observed in DTH-EXP:1–5B focused suite.

## 16. Remaining debt

See `KNOWN-DEBT.md`. No live UI, Stage wiring, or Advisor Evidence dialogue.
