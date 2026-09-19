# NPA-T DTH-EXP:9 — Theatre Scale & Performance

**Status: CERTIFIED**

Date: 2026-09-18.

Stop. Do not start DTH-EXP:10 or DTH-EXP:FINAL.

## Status

**NPA-T DTH-EXP:9 — CERTIFIED**

## 1. Architecture inspected

DTH-EXP:1–8B, DTH:1–12, DIR:1, NEX-MVP:3/4, MO, NMI, VAI, NPS, CC:5/8/10/11, CORE-OUT. See `ARCHITECTURE-INSPECTION.md`.

## 2. Theatre scale / working-set contract

`applyDthExpTheatreScale` consumes certified 4B/6/8A admission classes plus explicit budgets and emits a frozen working-set projection. Not a canonical store.

## 3. LOD model

LOD-0 essential, LOD-1 focused, LOD-2 contextual, LOD-3 expanded. Presentation-only. Not business importance.

## 4. Actor / relationship / Evidence budgets

Configurable `maxActiveActors`, `maxActiveRelationships`, `maxActiveEvidencePresentations`. Required classes admit as whole classes; overflow of an optional class is deferred rather than arbitrary first-N.

## 5. Multi-Nexo scale policy

Supporting families degrade before primary meaning. Support budget is independent. Presentation priority is not business ranking.

## 6. Family-specific scale safety

Bounded Bubble/Flow/Cause/Impact/Risk/Time/Execution/Outcome projections. No top-N ranking, causal upgrade, VAI assignment, Risk scoring, Timeline store, invented aggregates, CC:11 writes, or CORE-OUT success inference.

## 7. Grouping / progressive disclosure

Contextual groups preserve member IDs and do not invent canonical group Objects. Comparison members are not grouped. Disclosure remains presentation-only.

## 8. Density / complexity / performance-budget metadata

Density and complexity classify presentation load. Budgets are architecture limits, not measured FPS/ms.

## 9. Transition / interruption / reduced-motion

Transition participants are bounded; focal persistent actors stay protected; contextual actors may snap. Latest valid target supersedes obsolete planning. Reduced motion retains equivalent management meaning.

## 10. Deterministic admission / degradation / fallback

Same inputs produce the same working set. Degradation follows the certified ladder. Unsafe Multi-Nexo falls back to single-primary; oversized richness falls to lower LOD / minimal primary.

## 11. Subject / perspective / recomposition

Subject switch, primary-family change, same-family refinement, and Multi-Nexo recomposition recompute the working set. Stale members do not leak.

## 12. Observability and benchmark boundary

Diagnostics include candidate/admitted/deferred/omitted counts, LOD, density, complexity, budgetExceeded, degradation, fallback. Runtime browser performance is not certified.

## 13. Large-world certification journey

Synthetic 1,000 Objects / 3,000 relationships / 5,000 Evidence refs with Product Line A Flow. Active working set stays bounded; LOD varies presentation only; Evidence clusters preserve refs; FLOW+RISK+IMPACT survive while TIME defers; Cause recomputes; Margin Pressure does not leak Flow; unrelated growth is scale-invariant; overload and reduced motion preserve primary meaning.

## 14. Files

Created: theatre-scale identity/boundary/contract/applier/tests and `artifacts/dth-exp/DTH-EXP-9/*`.

Modified: `dthExpPublicIndex.ts`.

## 15. Focused tests

DTH-EXP:9 + :1–8B — **515 pass / 0 fail**. ESLint 0. Typecheck pass.

## 16. Regressions

None observed in DTH-EXP:1–8B focused suite.

## 17. Remaining debt

See `KNOWN-DEBT.md`. DTH-EXP:10 and DTH-EXP:FINAL not started.
