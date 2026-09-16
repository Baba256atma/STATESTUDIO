# NPA-T VAI:3 — Evidence & Causal Safety

**Status: CERTIFIED**

Date: 2026-09-16.

Stop. Do not start VAI:4.

## Status

**NPA-T VAI:3 — CERTIFIED**

## Architecture inspected

VAI:3 is a read-only analytical relationship layer. CC:8 remains Evidence owner. CORE-INT:3 remains the only causal-implication gate (`recordedRelationshipImpliesCause`). VAI:1/VAI:2 remain Variable and role owners.

## VAI:1/VAI:2 contracts reused

Variable identity, semantic status, provenance; VAI:2 CONFOUNDER, MODERATOR, PATH_OF_EFFECT, LEVER; analysis context IDs.

## Existing Evidence/Data authorities reused

CC:8 evidence references, DATA-ADV/Data Reality semantics, CORE-INT:3 causal implication.

## Files created

- `frontend/app/lib/vai/vaiCausalIdentity.ts`
- `frontend/app/lib/vai/vaiCausalContract.ts`
- `frontend/app/lib/vai/vaiCausalResolver.ts`
- `frontend/app/lib/vai/vaiCausalDiagnostics.ts`
- `frontend/app/lib/vai/vaiCausalSafety.test.ts`
- `frontend/artifacts/vai/VAI-3/*`

## Files modified

None in VAI:1/VAI:2 production contracts.

## Analytical relationship contract

`VaiAnalyticalRelationship`: relationship ID, analysis context, source/target, ladder, association, direction, causal status, evidence refs, provenance, manager assertion, alternatives/confounders, moderators, path/lever flags, scope, safe statement, reason codes, `causalAssertion: false`.

## Evidence ladder

OBSERVED_TOGETHER, ASSOCIATED, DIRECTIONALLY_ASSOCIATED, CAUSAL_HYPOTHESIS, MANAGER_ASSERTED_CAUSE, EVIDENCE_SUPPORTED_CAUSAL, INSUFFICIENT.

## Proofs

- Observation vs association: A vs B
- Association vs causality: B remains UNCONFIRMED
- Temporal: C
- Manager assertion: D
- Confounder: E
- Moderator: `moderationProven: false`
- PATH_OF_EFFECT: F
- LEVER: G
- Semantic: H CAP_AV
- Contradiction: I
- Context scope: J Plant A ↛ Plant B
- EVIDENCE_SUPPORTED_CAUSAL gate: N fails each shortcut; O requires CORE-INT:3 and is blocked by confounders
- Mutation: L/M

## Focused tests

A–O + boundary: 16 pass / 0 fail.

## Regression

VAI:1, VAI:2, DATA-UX:3, NPS:3: 45 pass.

## ESLint

`app/lib/vai`: 0 errors.

## TypeScript

`NODE_OPTIONS='--max-old-space-size=16384' npm run typecheck` — pass.

## Production build

`NODE_OPTIONS='--max-old-space-size=16384' npm run build` — pass.

## Remaining bounded debt

See `KNOWN-DEBT.md`. No causal-safety invariant classified as debt.

## Final status

**NPA-T VAI:3 — CERTIFIED**
