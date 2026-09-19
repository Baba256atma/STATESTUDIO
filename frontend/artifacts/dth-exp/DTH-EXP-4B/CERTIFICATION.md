# NPA-T DTH-EXP:4B — Director Scene Composition & Context

**Status: CERTIFIED**

Date: 2026-09-18.

Stop. Do not start DTH-EXP:5.

## Status

**NPA-T DTH-EXP:4B — CERTIFIED**

## 1. Architecture inspected

DIR:1, DTH:1–12 (DTH:5 as scene-intent context), DTH-EXP:1–4A, NEX-MVP:3/4, MO catalog, NMI, VAI:1–8, NPS, CC:5/8/10/11, CORE-OUT. See `ARCHITECTURE-INSPECTION.md`.

## 2. 4B context-composition contract

`DthExpDirectorSceneComposition`: selected family, canonical subject, actors with participation/attention/reason, existing relationships, Evidence refs, analytical bindings, omitted-context IDs, composition state, optional 3A resolution. Not a Scene store. `copiesManagementTruth: false`.

## 3. Canonical-subject anchoring

`canonicalSubjectId` is taken from 4A/referent input. Collection members are not substituted with the first member.

## 4. Actor selection

Actors are existing canonical Objects resolved through DTH-EXP:2. Focal / primary / supporting / contextual. No invented actors.

## 5. Relationship / Evidence selection

Relationships keep NMI `semanticRelation` and source refs. NexoCause does not rewrite association as CAUSES. Evidence is CC:8 refs; unrelated Evidence is omitted.

## 6. Analytical-binding selection

Family-aware value refs keep source authority. `calculatesTruth: false`. Missing required bindings fail safely.

## 7. Family-aware composition

4A family drives relevance: Flow path vs bottleneck neighborhood vs Cause candidates vs VAI Impact vs Risk vs Time vs Bars vs Bubble vs Execution vs Outcome. Same Object IDs survive perspective change.

## 8. Stale-context / collection safety

Previous-scene portfolio members do not leak into Cause. Selected collection member ID is the composition anchor.

## 9. Missing-context behavior

States: `no-selection`, `insufficient-context`, `missing-required-actor`, `missing-required-binding`, `unsupported-relationship`. No invented substitutes. No Advisor workflow inside 4B.

## 10. Authority boundaries

DIR:1 only Director. Stage NEX-MVP:3/4. VAI roles copied, not assigned. Execution/Outcome read-only. No Timeline store. No NexoBottleneck. `startsDthExp5: false`. Pipeline: 4A → 4B → 3B → 3A.

## 11. Certification journey

Product Line A: FLOW (full chain) → FLOW bottleneck (Production + neighbors) → CAUSE + Evidence → IMPACT VAI LEVER → RISK. `obj-product-line-a` survives. No causal invention.

## 12. Files

Created: scene-composition identity/boundary/contract/composer/tests and `artifacts/dth-exp/DTH-EXP-4B/*`.

Modified: `dthExpPublicIndex.ts`.

## 13. Focused tests

DTH-EXP:4B + :4A + :3B + :3A + :2 + :1 — **136 pass / 0 fail**. ESLint 0. Typecheck pass.

## 14. Regressions

None observed in DTH-EXP:1–4A focused suite.

## 15. Remaining debt

See `KNOWN-DEBT.md`.
