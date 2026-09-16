# NPA-T VAI:5 — Theatre Symbol Language

**Status: CERTIFIED**

Date: 2026-09-16.

Stop. Do not start VAI:6.

## Status

**NPA-T VAI:5 — CERTIFIED**

## Architecture inspected

DTH:1–12 Decision Theatre, DTH:2 visual families, NEX-STAGE-CARD:1 presentation roles, DIR:1 Director boundary, NEX-MVP Stage 2D + object interaction, VAI:1–4, CC:5 Advisor overlay, existing relationship grammar (association ≠ causality).

## VAI:1–4 contracts reused

VAI:1 Variable identity/semantics; VAI:2 trusted relevance + contextual roles; VAI:3 ladder/causal gate; VAI:4 `composeVaiAdvisorAnalysis` on inspect.

## Theatre/Director authorities reused

DTH visual-family discriminator (`VARIABLE_SYMBOL`), Stage entity role `ANALYTICAL_SYMBOL` (identity-only, not an Object card), DTH:1 foundation unchanged for executive Objects. No second Stage/Director/graph.

## Files created

- `frontend/app/lib/vai/vaiTheatreIdentity.ts`
- `frontend/app/lib/vai/vaiTheatreContract.ts`
- `frontend/app/lib/vai/vaiTheatreProjector.ts`
- `frontend/app/lib/vai/vaiTheatreInspection.ts`
- `frontend/app/lib/vai/vaiTheatreDiagnostics.ts`
- `frontend/app/lib/vai/vaiTheatreSymbolLanguage.test.ts`
- `frontend/artifacts/vai/VAI-5/*`

## Files modified

- `nexoraDecisionTheatreVisualFamily.ts` — `VARIABLE_SYMBOL` family and `var-symbol:` prefix
- `nexoraStageEntityPresentationRole.ts` — `ANALYTICAL_SYMBOL`
- `nexoraDecisionTheatrePublicIndex.ts` / DTH:2 family assertion
- `conversationalExperience.ts` / `conversationalExperienceOrchestrator.ts` — optional `vaiTheatreProjection` from supplied `vaiAdvisorBundle` only

## Variable Symbol contract

`VaiVariableSymbol`: symbol/variable/analysis IDs, label, role(s), role/semantic status, focal Object, evidence/causal presentation, connector, subordinate 2D overlay tokens, inspect-only interaction, accessibility label.

## Six-role visual grammar

Geometry + icon + micro-label (not color alone): knob/adjust, target/watch, bridge/path, gate/filter, lock/stable, caution/alternative.

## Object-vs-Symbol boundary proof

`isExecutiveObject: false`, `isStageObject: false`, catalog unchanged, classified `VARIABLE_SYMBOL` / `ANALYTICAL_SYMBOL`.

## 2D Stage compatibility

`dimensionalTreatment: "2d-overlay-token"`; focal Object remains `established-object` / `size-dominant`.

## Object attachment behavior

Trusted VAI:2 relevance only. Name-similarity untrusted Variables are not attached.

## Association/causal connector behavior

ASSOCIATED → `association-neutral`. Manager assertion → `manager-view`. `causal-confirmed` only when VAI:3 `EVIDENCE_SUPPORTED_CAUSAL`.

## Ambiguity/unknown presentation

LEVER|MODERATOR → `Lever / Moderator ?`. CAP_AV stays CAP_AV with “Meaning unresolved”.

## Conflicting-evidence presentation

`evidencePresentation: mixed`.

## Manager-assertion presentation

Attributed accessibility copy; not the same connector as evidence-supported causal.

## Causal-visual gate proof

Test K: associated bundle has no causal-confirmed connector; CORE-INT:3 gated relationship does.

## Density-control behavior

Limit 6 visible; remainder collapsed and retained.

## Compact/inspection behavior

Default compact; inspect expands, inspect-only, no mutation.

## Advisor-handoff behavior

Reuses VAI:4 intents/composition. `secondAdvisorState: false`.

## Missing-VAI-input behavior

Null bundle → no symbols, `invented: false`. Live turn without bundle → `vaiTheatreProjection` null.

## Accessibility behavior

Manager-readable labels; no VAI/CC/CORE terms.

## Architecture-leakage proof

Test Q on labels, micro-labels, and accessibility.

## Mutation-safety proof

Variables JSON and Object catalog unchanged; write flags false.

## Existing-Theatre-integrity proof

DTH:1 foundation + click/focus regressions pass; executive Objects remain `EXECUTIVE_OBJECT`.

## Focused test results

A–S + boundary: **20 pass / 0 fail**.

## Regression results

VAI:1–4 + DTH:1 + DTH:2 iconic language + NEX-STAGE-CARD:1: **98 pass / 0 fail**.

## ESLint

Touched files: 0 errors.

## TypeScript

`NODE_OPTIONS='--max-old-space-size=16384' npm run typecheck` — pass.

## Production build

`NODE_OPTIONS='--max-old-space-size=16384' npm run build` — pass.

## Remaining bounded debt

See `KNOWN-DEBT.md`. No Object/Symbol, causal-visual, Stage-authority, or mutation failure classified as debt.

## Final status

**NPA-T VAI:5 — CERTIFIED**
