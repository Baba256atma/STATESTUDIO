# NPA-T DTH-EXP:8A — Multi-Nexo Composition Foundation

**Status: CERTIFIED**

Date: 2026-09-18.

Stop. Do not start DTH-EXP:8B.

## Status

**NPA-T DTH-EXP:8A — CERTIFIED**

## 1. Architecture inspected

DTH-EXP:1–7B, DTH:1–12, DIR:1, NEX-MVP:3/4, MO, NMI, VAI, NPS, CC:5/8/10/11, CORE-OUT. See `ARCHITECTURE-INSPECTION.md`.

## 2. Multi-Nexo contract

`planDthExpMultiNexoComposition` emits a frozen eligibility plan: primary family, supporting entries, actor annotations, shared relationship/Evidence refs, compatibility, conflicts, disclosure, attention hierarchy. Not a Scene store.

## 3. Primary/supporting model

Exactly one primary. Supporting families enrich the same canonical world and never become primary authority.

## 4. Director/primary-selection authority

DIR:1 / DTH-EXP:4A remains the only primary selector. 8A consumes `primaryFamily`. No MultiNexoDirector.

## 5. Shared identity

One Theatre Actor per canonical Object (`theatreActorCount: 1`). Shared NMI relationship IDs and CC:8 Evidence refs. No per-family Evidence copies.

## 6. Primary/supporting visual roles

Primary family supplies the base visual role (e.g. `flow-node`). Supporting roles are annotations (`risk-context`, `impact-context`) and do not replace primary identity.

## 7. Compatibility model

Semantic pairs only (e.g. FLOW+RISK compatible, FLOW+IMPACT conditional, FLOW+BUBBLE incompatible). States: compatible / conditionally-compatible / incompatible / insufficient-context. Not decorative.

## 8. Relevance / attention / disclosure

Each eligible support has a management reason. Hierarchy: subject → primary Nexo → focal actors → supporting meaning → Evidence. Disclosure: contextual / available-on-demand / omitted. Presentation-only.

## 9. Conflict / fallback

Conflicts include grammar, unrelated subject, unsupported/authority, stale, causal-safety. Unsafe/empty support falls back to the certified single-primary scene.

## 10. Causal and authority safety

Composition does not create causality. No Risk calculation, VAI assignment, or Evidence/Execution/Outcome writes. No NEXO_EVIDENCE.

## 11. Stale-context / perspective-change

Stale supports are rejected. Primary family change sets `supportsReevaluatedForPrimaryChange`. Same-family bottleneck refinement keeps only still-relevant support.

## 12. Reduced-motion / determinism

Plan is complete without animation. Same inputs produce the same plan.

## 13. Certification journey

4A Flow primary → RISK/IMPACT eligibility on Production → shared ev-capacity-17 → unrelated Bubble rejected → no causal implication → Cause reevaluation → Margin Pressure stale Risk → unsafe fallback → reduced-motion completeness.

## 14. Files

Created: multi-nexo identity/boundary/contract/planner/tests and `artifacts/dth-exp/DTH-EXP-8A/*`.

Modified: `dthExpPublicIndex.ts`.

## 15. Focused tests

DTH-EXP:8A + :1–7B — **394 pass / 0 fail**. ESLint 0. Typecheck pass.

## 16. Regressions

None observed in DTH-EXP:1–7B focused suite.

## 17. Remaining debt

See `KNOWN-DEBT.md`. DTH-EXP:8B not started.
