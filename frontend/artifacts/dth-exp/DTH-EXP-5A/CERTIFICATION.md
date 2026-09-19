# NPA-T DTH-EXP:5A — Dynamic Scene Layout & Spatial Grammar

**Status: CERTIFIED**

Date: 2026-09-18.

Stop. Do not start DTH-EXP:5B.

## Status

**NPA-T DTH-EXP:5A — CERTIFIED**

## 1. Architecture inspected

DTH-EXP:1–4B, DTH:1–12 / DTH:3 visual projection, DIR:1, NEX-MVP:3/4 Stage layout (STAGE-2D normalized space), MO, NMI, VAI:1–8, CC:8, CC:11, CORE-OUT. See `ARCHITECTURE-INSPECTION.md`.

## 2. Spatial-grammar contract

`DthExpSpatialLayoutProjection`: actor position/size/lane/depth/disclosure, relationship paths, Evidence hints, density, layout reason. Presentation only.

## 3. Normalized coordinate model

`DTH_EXP_NORMALIZED_STAGE_SPACE`: x/y in [0,1], origin bottom-left, pixel-independent, focal zone at (0.5, 0.5). Not viewport pixels.

## 4. Focal / proximity / size / depth

Focal attention is larger, foreground, high emphasis. Size always has an explicit reason. Proximity does not imply causality. Depth is presentation-only.

## 5. Nine-family layout behavior

One engine `DTH-EXP:5A/SharedSpatialGrammar`. Families request lanes (flow, baseline, portfolio-field, past/now/future, candidates, etc.). No nine layout engines. No NexoBottleneck. No Timeline authority.

## 6. Evidence / relationship placement

Evidence attaches to actor or relationship midpoint (CC:8). Paths copy NMI semantics; association stays candidate, not cause.

## 7. Progressive-disclosure / density

States: visible, contextual, de-emphasized, collapsed, hidden. Density sparse/normal/dense. Distant bottleneck context collapses. Objects are not removed from management context.

## 8. Deterministic layout

Same scene + family + constraints → identical projection.

## 9. Animation-readiness metadata

Each actor has `animationTarget` (position, size, emphasis, disclosure, grouping) with `interpolationImplemented: false`, `durationMs: null`, `easing: null`. Future semantic reasons recorded; no motion.

## 10. Authority boundaries

Stage NEX-MVP:3/4. Director DIR:1. Scene and Objects unmutated. `startsDthExp5B: false`. `liveStageWiring: false`.

## 11. Certification journey

Product Line A: Flow (Supplier → … → Market) → bottleneck (Market collapsed) → Cause investigation + attached Evidence → Impact VAI → Time Past→Now. Identity `obj-product-line-a` survives.

## 12. Files

Created: spatial-layout identity/boundary/contract/projector/tests and `artifacts/dth-exp/DTH-EXP-5A/*`.

Modified: `dthExpPublicIndex.ts`.

## 13. Focused tests

DTH-EXP:5A + :4B + :4A + :3B + :3A + :2 + :1 — **170 pass / 0 fail**. ESLint 0. Typecheck pass.

## 14. Regressions

None observed in DTH-EXP:1–4B focused suite.

## 15. Remaining debt

See `KNOWN-DEBT.md`.
