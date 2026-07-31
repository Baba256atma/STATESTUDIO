# AD-EX2-11 — Establish the Tier-0 Synthetic Preview Local Route Architecture

## Decision

| Field | Value |
| --- | --- |
| ID | `AD-EX2-11` |
| Status | `Accepted` |
| Result | `Tier0SyntheticPreviewRouteArchitectureAccepted` |
| Lint classification | `RouteArchitectureAcceptedWithProjectLintBlockerDisclosed` |
| Authority | `Bahadoor` |
| Authority role | `Nexora Product and Architecture Authority` |
| Decision date | `2026-07-29` |
| Selected option | `DevelopmentOnlyAppRouterPreviewWithFailClosedEnvironmentGate` |
| Scope | `Tier0SyntheticPreviewRouteArchitectureOnly` |
| Creates route | `false` |
| Grants implementation authorization | `false` |
| Grants local-access authorization | `false` |
| Production authorization | `false` |
| Deployment authorization | `false` |

This decision establishes architecture only. A separate human authorization completion remains required before implementation.

## Preconditions

`AD-EX2-00` through `AD-EX2-10` remain Accepted, and `AD-EX2-11` was unused before this decision. The historical `AD-EX2-08/RouteAssessment` remains `DeferredSupportingEvidence`; its pre-decision `routeArchitectureDecisionAccepted` value remains historical evidence rather than being rewritten.

The Tier-0 metadata and UI certifications remain valid, all 16 `UI-T0` gates remain Pass, and the certified synthetic preview and harness remain present. No preview route or navigation exposure exists. Real RTC-2, network, persistence, telemetry, cloud, production, deployment, and public access remain unauthorized.

The blocked authorization record `EX2-ROUTE-AUTH-T0-2026-07-29-01` remains historically preserved as `RouteAuthorizationBlockedByMissingArchitectureDecision`.

No repository conflict blocks this architecture decision.

## Existing route structure

The root layout is `frontend/app/layout.tsx`. There are no nested route layouts.

| Filesystem route | Public path |
| --- | --- |
| `app/page.tsx` | `/` |
| `app/executive/page.tsx` | `/executive` |
| `app/pipeline/page.tsx` | `/pipeline` |
| `app/psych/page.tsx` | `/psych` |
| `app/(landing)/sycho/page.tsx` | `/sycho` |
| `app/type-c/page.tsx` | `/type-c` |

The repository uses lower-case, hyphenated path segments where necessary and route groups that do not affect the public URL. It has no development-only route, established `notFound()` environment gate, or feature-flag framework.

`/executive/journal-preview` conflicts with no current or reserved route. The certified harness and preview already own a `"use client"` boundary. Their dependency chain introduces no prohibited RTC, APP-8, EX-1 Public Index, network, persistence, telemetry, or cloud runtime.

## Canonical route

The exact canonical path is:

`/executive/journal-preview`

It is immutable unless a later architecture decision supersedes it. No alias is reserved. This decision does not create the path.

## Host and access architecture

- Host class: `DevelopmentTestHarnessOnly`
- Access class: `LocalDevelopmentOnly`
- permitted later environments: development and test only
- unauthorized behavior: server-side `notFound()`
- production availability: false
- public availability: false
- navigation exposure: false
- EX-1 Public Index exposure: false
- search/indexing: prohibited
- deployment: prohibited

The future route must fail closed outside its authorized environment.

## Feature-flag architecture

The exact flag is:

`EX2_TIER0_PREVIEW_ENABLED`

It is server-only because the App Router page owns the environment gate. A public build-time variable is unnecessary for the certified client component and would expose boundary state to the client bundle.

Only the exact value `true` permits later evaluation to continue. Missing, malformed, whitespace-modified, case-modified, false, or any other value denies access.

- default: disabled
- production enablement: prohibited
- remote configuration: prohibited
- persistence: prohibited
- telemetry: prohibited
- created by this decision: false

## Dependency direction

The only accepted direction is:

```text
App Router page
  → certified Tier-0 synthetic UI/harness
  → read-only UI facade
  → certified synthetic metadata package
```

The page may import the certified harness. It may not bypass the facade to import provider or fixture internals.

RTC-1/2/3 runtime, APP-8, EX-1 Public Index, production providers, network clients, persistence, telemetry, and cloud SDK imports are prohibited.

## Presentation and security

The route must always display `Synthetic / Tier 0 / Non-production`, including in screenshots and demonstrations. It may expose only the certified read-only behavior and nine certified states.

Mutation controls, operational commands, confirmation or authority actions, disclosure/export controls, arbitrary payloads, upload, remote fetch, private-reflection indicators, evidence content, actor PII, and debug payload dumps are prohibited.

Localhost is not authentication. The route makes no production-security, authorization, identity, or security-through-obscurity claim. Only synthetic data may enter it. External sharing is unauthorized. Production-like configuration reopens this architecture decision.

## Relationship to blocked authorization

The missing architecture blocker is resolved, but human route authorization is still required. This decision does not silently convert or rewrite `EX2-ROUTE-AUTH-T0-2026-07-29-01`.

A later authorization-completion task may create a linked completion record or supersede the blocked result according to the established authorization-record convention.

## Gate and lint treatment

The 16 EX-2 gates remain unchanged; `G-EX2-04`, `G-EX2-07`, and `G-EX2-12` remain Pending. All 16 UI-T0 gates remain Pass. Metadata and UI certifications remain valid, and production applicability remains false. No route-specific gate catalogue is required by this architecture-only decision.

TypeScript, Scene, and the disclosed network-enabled build remain clean. Full-project ESLint remains blocked by 21 formally parked React Compiler errors, so the project classification remains `CiStillBlockedByParkedReactCompilerDebt`. `CiLintGateClean` is not claimed. Future route files must independently pass ESLint with zero errors and warnings; production release and deployment remain blocked.

## Explicit non-authorizations

This decision does not implement a route, grant implementation or local-access authorization, create a flag, add navigation, expose the preview, connect real RTC-2, add network/persistence/telemetry/cloud/deployment behavior, modify parked React clusters, implement EX-2:3, or weaken TypeScript or lint gates.

## Verification

Verification completed on `2026-07-29`:

| Check | Result |
| --- | --- |
| EX-2 architecture | 144 passed, 0 failed |
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
| Route/navigation/flag absence scan | No preview route, mount, navigation entry, or flag |
| Suppression scan | No suppression in changed files |
| Production build | Pass in the explicitly network-enabled environment |

The build emitted the existing stale `baseline-browser-mapping` data advisory. Hosted CI was not executed and is not claimed.

## Next task

`NPA-T — EX-2 Tier-0 Synthetic Preview Route and Local Access Human Authorization Completion`
