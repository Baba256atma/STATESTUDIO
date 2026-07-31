# EX2-ROUTE-AUTH-T0-2026-07-29-02 — Tier-0 synthetic preview route authorization completion

## Authorization record

| Field | Value |
| --- | --- |
| ID | `EX2-ROUTE-AUTH-T0-2026-07-29-02` |
| Status | `Recorded` |
| Result | `AuthorizedForTier0SyntheticPreviewRouteAndLocalAccess` |
| Lint classification | `LocalTier0RouteAuthorizedWithProjectLintBlockerDisclosed` |
| Authorizing human | `Bahadoor` |
| Authority role | `Nexora Product and Architecture Authority` |
| Decision date | `2026-07-29` |
| Scope | `Tier0SyntheticPreviewRouteLocalDevelopmentImplementationAndTestsOnly` |
| Parent architecture decision | `AD-EX2-11` |
| Prior blocked record | `EX2-ROUTE-AUTH-T0-2026-07-29-01` |
| Route implementation authorized | `true` |
| Local access authorized | `true` |
| Tests authorized | `true` |
| Route implementation complete | `false` |

This record authorizes a later bounded implementation task. It does not implement the route.

## Preconditions

`AD-EX2-11` exists exactly once and is Accepted as `Tier0SyntheticPreviewRouteArchitectureAccepted`. It establishes:

- canonical route `/executive/journal-preview`;
- host `DevelopmentTestHarnessOnly`;
- access `LocalDevelopmentOnly`;
- server-only flag `EX2_TIER0_PREVIEW_ENABLED`;
- exact enabled value `true`, with every other value denied;
- server-side `notFound()` outside the authorized environment.

Metadata and UI certifications remain valid. All 16 UI-T0 gates remain Pass, existing EX-2 gates are unchanged, and no route, flag, or navigation artifact exists. The architecture prerequisite that blocked the earlier authorization is now resolved.

No conflict blocks this authorization completion.

## Historical record preservation

`EX2-ROUTE-AUTH-T0-2026-07-29-01` remains unchanged as historical evidence with result `RouteAuthorizationBlockedByMissingArchitectureDecision`. This linked completion record does not rewrite or silently convert it.

## Authorized artifacts

The later implementation may create only:

- one App Router page at `/executive/journal-preview`;
- minimum route-local tests;
- the minimum server-side environment gate;
- an optional route-local loading or error boundary only if required by established App Router conventions.

The route must mount the already certified Tier-0 synthetic harness/UI.

New providers, adapters, fixtures, metadata contracts, view models, production services, navigation entries, middleware, and authentication systems are not authorized.

## Environment gate

The later route may read `EX2_TIER0_PREVIEW_ENABLED` on the server only.

- exact `true`: continue only in a non-production development/test environment;
- missing, `false`, case variants, whitespace variants, malformed values, or any other value: deny;
- production: always deny, even when the flag is `true`;
- denied access: return `notFound()`;
- client exposure, remote configuration, persistence, and telemetry: prohibited.

The flag is not created by this authorization record.

## Local-access contract

Access is limited to local development, local test execution, localhost or the established local development host, synthetic data, and non-production demonstrations.

This authorization makes no authentication, user-authorization, production-security, public-availability, release-readiness, or deployment-readiness claim.

## Presentation and dependency contracts

The route must always display `Synthetic / Tier 0 / Non-production`. It may render the certified preview, nine certified states, deterministic local harness controls, and existing read-only filtering and selection.

Create/update/delete, confirm/approve/close, commands, export/disclosure, upload, URL-provided payloads, remote data, private-reflection information, evidence content, actor PII, and debug payload dumps are prohibited.

The required dependency direction is:

```text
route page
  → certified Tier-0 synthetic harness
  → certified read-only UI facade
  → certified synthetic metadata package
```

RTC runtime modules, APP-8, EX-1 Public Index, production providers, network clients, persistence, telemetry, and cloud SDK imports are prohibited.

## Gate, lint, and release treatment

Existing EX-2 gate definitions remain unchanged. `G-EX2-04`, `G-EX2-07`, and `G-EX2-12` remain Pending; all 16 UI-T0 gates remain Pass. Route implementation remains incomplete and production applicability remains false.

Full-project ESLint remains blocked by 21 formally parked errors and 288 warnings, so the project classification remains `CiStillBlockedByParkedReactCompilerDebt`; `CiLintGateClean` is not claimed. The later route and tests must independently pass ESLint with zero warnings, and the parked count may not increase.

This authorization does not certify merge, release, production, or deployment readiness.

## Explicit non-authorizations

Navigation integration, public access, production access, deployment, real RTC-2, network, persistence, telemetry, cloud, new production services, and EX-2:3 implementation are unauthorized.

## Verification

Verification completed on `2026-07-29`:

| Check | Result |
| --- | --- |
| EX-2 architecture | 149 passed, 0 failed |
| Tier-0 metadata | 158 passed, 0 failed |
| Tier-0 UI | 35 passed, 0 failed |
| EX-1 and RTC-2:9 / RTC-3:9 | 146 passed, 0 failed |
| Scene runtime | 296 passed, 0 failed |
| Targeted strict TypeScript | 0 diagnostics |
| Production-source TypeScript, 8 GB heap | 0 diagnostics |
| Full-project TypeScript, 8 GB heap | 0 diagnostics |
| Changed TypeScript ESLint, `--max-warnings 0` | 0 errors, 0 warnings |
| Full-project ESLint disclosure | 21 errors, 288 warnings; parked baseline unchanged |
| Dependency-boundary scan | No prohibited dependency or side-effect API |
| Route/flag/navigation absence scan | No preview route, evaluated flag, or navigation entry |
| Suppression scan | No suppression in changed files |
| Production build | Pass in the explicitly network-enabled environment |

The build emitted the existing stale `baseline-browser-mapping` data advisory. Hosted CI was not executed and is not claimed.

This authorization task creates no route, flag, navigation, React component, provider, adapter, fixture, middleware, network code, persistence code, telemetry code, or cloud integration.

## Next task

`NPA-T — EX-2 Tier-0 Synthetic Preview Route and Local Access Implementation and Verification`
