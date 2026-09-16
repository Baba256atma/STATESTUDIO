# NPA-T VAI:1 — Variable Intelligence Foundation

**Status: CERTIFIED**

Date: 2026-09-16.

Stop. Do not start VAI:2.

## Status

**NPA-T VAI:1 — CERTIFIED**

## Architecture inspected

Variable Intelligence is a read-only analytical layer over existing Nexora authorities. It does not expand the Object universe, write semantics, or conclude causality.

See `ARCHITECTURE-INSPECTION.md`.

## Existing authorities reused

MO:1 Objects (IDs only), Data Reality / RDI, DATA-ADV / DATA-UX:3 / manager confirmation, CC:8 Evidence, existing KPI observations, CC:9/10/11 as source kinds only, BCA, NXA/NCA/ECA/Advisor/Stage as non-owners.

## Files created

- `frontend/app/lib/vai/vaiIdentity.ts`
- `frontend/app/lib/vai/vaiContract.ts`
- `frontend/app/lib/vai/vaiAuthorityBoundary.ts`
- `frontend/app/lib/vai/vaiResolver.ts`
- `frontend/app/lib/vai/vaiDiagnostics.ts`
- `frontend/app/lib/vai/vaiFoundation.ts`
- `frontend/app/lib/vai/vaiFoundation.test.ts`
- `frontend/artifacts/vai/VAI-1/*`

## Files modified

TypeScript-only test typing so the VAI:1 TypeScript gate can pass (no production NPS/ECA/SYS behavior change):

- `frontend/app/lib/nexora-problem-solving/npsProblemUnderstanding.test.ts`
- `frontend/app/lib/nexora-problem-solving/npsOptionGeneration.test.ts`
- `frontend/app/lib/nexora-system/sys1RecertExecutiveIntelligenceIntegration.runtime.test.ts`

## Canonical Variable contract

`NPA-T VAI:1/VariableIntelligenceFoundation`

A Variable is a bounded analytical representation of something that may vary in an analysis context. Stable `variableId`, display name, analysis context, contextual role, known-or-UNKNOWN value/unit/direction, confidence, semantic status, provenance, related Object IDs. Missing fields stay UNKNOWN. Not an executive Object.

## Six contextual roles

LEVER, OUTCOME, PATH_OF_EFFECT, MODERATOR, CONTROL, CONFOUNDER.

Roles are applied per analysis context. Same `variableId` can be LEVER in one context and CONTROL in another.

## Object/Variable boundary proof

Test B: catalog Object IDs unchanged; `objectsCreated: false`; `isExecutiveObject: false`.

## Truth/provenance behavior

Resolver consumes CSV confirmation and trusted observations. Provenance keeps `authority` + `sourceRef` (test G).

## Unknown/ambiguity behavior

Tests D–F: missing value/direction remain UNKNOWN; unresolved `CAP_AV` is not renamed Available Capacity.

## Causal-safety proof

Test H: Demand and Capacity Gap may share a context; `causalAssertion: false`, `causalClaim: null`.

## Mutation-safety proof

Test I: input JSON and catalog size unchanged; `canonicalMutation: false`.

## Focused test results

`tsx --test app/lib/vai/vaiFoundation.test.ts` — A–J: 10 pass / 0 fail.

ESLint on `app/lib/vai`: 0 errors.

## Relevant regression results

DATA-UX:3 semantic suite + NPS:3 evidence/cause suite: 22 pass / 0 fail (includes CAP_AV G/H).

NPS:2 and NPS:4 suites after typing-only edits: pass.

## TypeScript result

`NODE_OPTIONS='--max-old-space-size=16384' npm run typecheck` — pass (exit 0).

## Production build result

Default `npm run build` OOM during Next’s TypeScript step (~4GB).  
`NODE_OPTIONS='--max-old-space-size=16384' npm run build` — pass (compiled, typed, 13 static pages).

## Remaining bounded debt

No live Advisor Variable speech, no Theatre visualization, no causal VAI, resolver is application-driven. See `KNOWN-DEBT.md`. None of these violate VAI:1 invariants.

## Final status

**NPA-T VAI:1 — CERTIFIED**
