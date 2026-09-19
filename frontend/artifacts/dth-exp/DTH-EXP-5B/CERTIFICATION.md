# NPA-T DTH-EXP:5B — Meaningful Animation & Scene Transitions

**Status: CERTIFIED**

Date: 2026-09-18.

Stop. Do not start DTH-EXP:6.

## Status

**NPA-T DTH-EXP:5B — CERTIFIED**

## 1. Architecture inspected

DTH-EXP:1–5A, DTH:1–12, DIR:1, NEX-MVP:3/4 Stage, existing reduced-motion/visual-role transition primitives, MO, NMI, VAI:1–8, CC:8, CC:11, CORE-OUT. See `ARCHITECTURE-INSPECTION.md`.

## 2. Transition contract

`planDthExpSceneTransition` describes source/target families, actor classes, motion operations, relationship/Evidence transitions, sequence, timing categories, reduced-motion equivalent, and replacement policy. Presentation metadata only.

## 3. Actor continuity / classification

Canonical IDs classify persistent / entering / exiting / context-promoted / context-reduced. Persistent actors never exit+enter. Entering does not create Objects; exiting does not delete them.

## 4. Semantic motion vocabulary

Shared operations: reposition, promote, de-emphasize, enter, exit, expand, regroup, role-transform. One engine. Every operation has a management reason.

## 5. Cross-Nexo transitions

Flow→Cause, Cause→Impact, Impact→Risk, Risk→Time preserve `obj-product-line-a`. No VAI/Risk/Timeline authority created.

## 6. Same-family transitions

Flow → bottleneck focus remains NEXO_FLOW. Production promoted; Market reduced/collapsed.

## 7. Evidence / relationship behavior

Evidence remains CC:8 and does not increase certainty. `associated` stays non-causal.

## 8. Sequencing / timing

Fixed 7-step sequence. Timing: immediate / short / standard / deliberate. No family-specific durations.

## 9. Interruption safety

`latest-valid-target-supersedes-incomplete-plan`. Obsolete plans must not override new subject, Director selection, composition, or canonical truth.

## 10. Reduced-motion behavior

Applies target 5A projection directly (`movement: false`). Meaning lists: became focal, secondary, entered, left, role-changed, relationships, Evidence.

## 11. Determinism

Same source/target projections produce the same plan.

## 12. Authority boundaries

Stage NEX-MVP:3/4. Director DIR:1. `animationPlayback: false`. `liveStageWiring: false`. `startsDthExp6: false`.

## 13. Certification journey

Product Line A: Flow → bottleneck Flow → Cause → Impact → Risk → Time, plus reduced-motion equivalents. Identity survives.

## 14. Files

Created: scene-transition identity/boundary/contract/planner/tests and `artifacts/dth-exp/DTH-EXP-5B/*`.

Modified: `dthExpPublicIndex.ts`.

## 15. Focused tests

DTH-EXP:5B + :5A + :4B + :4A + :3B + :3A + :2 + :1 — **209 pass / 0 fail**. ESLint 0. Typecheck pass.

## 16. Regressions

None observed in DTH-EXP:1–5A focused suite.

## 17. Remaining debt

See `KNOWN-DEBT.md`.
