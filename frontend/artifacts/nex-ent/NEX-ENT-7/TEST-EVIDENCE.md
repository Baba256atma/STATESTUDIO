# NEX-ENT:7 — Test evidence

## Focused (L1)

`tsx --test` visual intelligence, visual guidance intent, visual education.

Result: 32+ visual-focused tests passing in isolation; entrance pack **253/253** including ENT:1–7 and EXP/E2E after routing fixes.

## Owning layer

- `DIR:VI/NexoraVisualIntelligence` — resolver, example evidence, copy, runtime apply
- `resolveNexoraVisualGuidanceIntent` — visual vs collection/object/GA/scenario-compare
- `NEX-ENT:7/VisualIntelligenceEducation` — lesson only

## Routing fixes required during certification

1. `/prove/` must not match **improve**.
2. Inspect-without-view must not swallow EXP causality.
3. `Compare them` / `Compare these scenarios` remain DTH/EXP, not visual, unless evidence-language is present. ENT:7 still owns `Compare these` during the lesson.

## Live

`scripts/nex-ent7-visual-intelligence-certify.mjs` against production `/executive` on the cert port.

## Funnel

L4 omnibus now includes `nexoraVisualIntelligence.test.ts` and `nexoraGuidedAttentionPresentation.test.ts`.
