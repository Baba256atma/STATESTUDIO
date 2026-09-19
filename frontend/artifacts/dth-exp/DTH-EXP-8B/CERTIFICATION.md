# NPA-T DTH-EXP:8B — Multi-Nexo Scene Composition & Conflict Resolution

**Status: CERTIFIED**

Date: 2026-09-18.

Stop. Do not start DTH-EXP:9.

## Status

**NPA-T DTH-EXP:8B — CERTIFIED**

## 1. Architecture inspected

DTH-EXP:1–8A, DTH:1–12, DIR:1, NEX-MVP:3/4, MO, NMI, VAI, NPS, CC:5/8/10/11, CORE-OUT. See `ARCHITECTURE-INSPECTION.md`.

## 2. Multi-Nexo composed-scene contract

`composeDthExpMultiNexoScene` consumes an 8A eligibility plan, 5A spatial projection, optional 6 Evidence projection, and optional primary Theatre Scene. It emits one frozen `DthExpMultiNexoComposedScene`. Not a Scene store.

## 3. Primary-scene / spatial authority

Primary 5A positions remain the skeleton. Supporting families cannot rearrange the base scene. Local offsets only.

## 4. Actor / relationship / Evidence identity

One Theatre Actor per canonical Object (`theatreActorCount: 1`). Shared relationship IDs retain canonical semantics. Shared CC:8 Evidence refs are not copied per family.

## 5. Supporting attachment / layering

Supporting meaning attaches to existing actors with local offset metadata. Semantic layers: primary structure → focal attention → supporting Nexo → Evidence → deferred detail.

## 6. Conflict-resolution model

Deterministic priority from authority/subject/primary meaning through causal safety, focal readability, relationships, supporting meaning, Evidence, and decorative richness. Lower-priority presentation defers/collapses/omits.

## 7. Density / progressive disclosure

Density is presentation-only (`sparse`/`normal`/`dense`/`overloaded`). Eligible TIME can be deferred when RISK+IMPACT already occupy visible slots. No business ranking.

## 8. Family composition behavior

FLOW+RISK, FLOW+IMPACT, FLOW+TIME, CAUSE+IMPACT, BUBBLE+RISK, EXECUTION+TIME, OUTCOME+TIME compose without replacing primary grammar or inventing Timeline/Risk/VAI/CC:11/CORE-OUT authority.

## 9. Combined-support safety

Pairwise eligibility does not imply combined safety. FLOW+RISK+IMPACT can coexist with causal-separation hints; TIME is deferred under combined attention load.

## 10. Causal / authority safety

Composition does not create causality, calculate Risk, assign VAI roles, rank Bubble candidates, or write Decision/Execution/Outcome. Authority conflicts reject unsafe support.

## 11. Perspective-change / same-family / stale-context

New primary family recomposes from a new 8A plan. Same-family bottleneck refinement reevaluates support. Stale/unrelated support is omitted.

## 12. Transition / Advisor / reduced-motion

5B remains transition authority. 7A can consume composed family/subject/actor/Evidence metadata. 8B does not parse manager text; 7B/DIR:1/4A remain the primary-change path. Reduced motion retains equivalent management meaning.

## 13. Safe fallback

Unsafe 8A plans fall back to the certified single-primary scene with no supporting enrichment.

## 14. Certification journey

Flow skeleton → FLOW+RISK → FLOW+RISK+IMPACT → shared `cc8:ev-capacity-17` → density deferral of TIME → unrelated Bubble omitted → no causal confirmation → Cause recomposition → Margin Pressure stale Risk omitted → unsafe fallback → reduced motion.

## 15. Files

Created: multi-nexo scene identity/boundary/contract/composer/tests and `artifacts/dth-exp/DTH-EXP-8B/*`.

Modified: `dthExpPublicIndex.ts`.

## 16. Focused tests

DTH-EXP:8B + :1–8A — **451 pass / 0 fail**. ESLint 0. Typecheck pass.

## 17. Regressions

None observed in DTH-EXP:1–8A focused suite.

## 18. Remaining debt

See `KNOWN-DEBT.md`. DTH-EXP:9 not started.
