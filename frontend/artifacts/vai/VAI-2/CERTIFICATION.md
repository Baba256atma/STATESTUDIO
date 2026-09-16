# NPA-T VAI:2 — Object–Variable Role Resolution

**Status: CERTIFIED**

Date: 2026-09-16.

Stop. Do not start VAI:3.

## Status

**NPA-T VAI:2 — CERTIFIED**

## Architecture inspected

VAI:2 is a read-only Object→Variable relevance and contextual-role resolver. It consumes certified VAI:1 Variables and trusted existing relationships. No causal graph, Object store, or semantic writer.

## VAI:1 contracts reused

Six roles, Variable identity, semantic status, provenance, related Object IDs, `resolveVaiVariables`, unknown/ambiguity, `causalAssertion: false`. VAI:1 meaning unchanged; VAI:2 ignores VAI:1 application role as a permanent property.

## Existing Nexora authorities reused

MO:1 Object IDs, Data Reality / DATA-ADV semantics, KPI/Evidence/Scenario/Execution/BCA as relevance bases only.

## Files created

- `frontend/app/lib/vai/vaiObjectRoleIdentity.ts`
- `frontend/app/lib/vai/vaiObjectRoleContract.ts`
- `frontend/app/lib/vai/vaiObjectRoleResolver.ts`
- `frontend/app/lib/vai/vaiObjectRoleDiagnostics.ts`
- `frontend/app/lib/vai/vaiObjectRoleResolution.test.ts`
- `frontend/artifacts/vai/VAI-2/*`

## Files modified

None in VAI:1 production contracts.

## Analysis-context contract

`VaiObjectRoleAnalysisContext`: analysisContextId, purpose, focal Object ID/family, related Object IDs, available Variable IDs, trusted source refs, manager-confirmed constraints.

## Object → Variable relevance

Trusted only via Object references or trusted links (Data Reality, manager semantics, KPI, Evidence, Scenario, Execution, BCA). Name similarity is `UNRESOLVED_CANDIDATE` and is not attached as trusted relevance.

## Role-resolution behavior

Candidates carry role, confidence, basis, status, reason code. Unique CONFIRMED/SUPPORTED may become primary. Multiple undistinguished candidates stay AMBIGUOUS. No evidence stays UNKNOWN.

## Contextual-role proof

Test B: `vai:staffing` is LEVER in WHAT_CAN_MANAGEMENT_CHANGE and CONTROL in HOLD_STABLE_FOR_COMPARISON.

## Ambiguity/unknown

D: Machine Availability LEVER|MODERATOR AMBIGUOUS. E: Backlog UNKNOWN. G: CAP_AV no invented role.

## Manager-confirmation

H: Staffing LEVER CONFIRMED with `manager:treat-staffing-as-lever`, scoped to analysis context.

## Conflict

L: manager CONTROL vs supported LEVER → CONFLICTING, both candidates kept, no last-write-wins.

## Object-type safety

C: KPI-associated OTD % is relevant but not automatically OUTCOME. `objectTypeDeterminedRole: false`.

## Causal safety

K: `causalAssertion: false`. PATH_OF_EFFECT/LEVER are not causal chains. VAI:3 not started.

## Mutation safety

I: VAI:1 Variable JSON unchanged. J: catalog Object IDs unchanged.

## Focused tests

A–L + boundary: 13 pass / 0 fail. ESLint `app/lib/vai`: 0 errors.

## Regression

VAI:1 A–J: 10 pass. DATA-UX:3 semantic: 8 pass.

## TypeScript

`NODE_OPTIONS='--max-old-space-size=16384' npm run typecheck` — pass.

## Production build

`NODE_OPTIONS='--max-old-space-size=16384' npm run build` — pass.

## Remaining bounded debt

See `KNOWN-DEBT.md`. None violate VAI:2 invariants.

## Final status

**NPA-T VAI:2 — CERTIFIED**
