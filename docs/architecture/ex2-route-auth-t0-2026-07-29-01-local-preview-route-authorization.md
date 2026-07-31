# EX2-ROUTE-AUTH-T0-2026-07-29-01 — Tier-0 synthetic preview route and local-access authorization decision

## Decision record

| Field | Recorded value |
| --- | --- |
| Record ID | `EX2-ROUTE-AUTH-T0-2026-07-29-01` |
| Record status | `Recorded` |
| Result | `RouteAuthorizationBlockedByMissingArchitectureDecision` |
| Requested result | `AuthorizedForTier0SyntheticPreviewRouteAndLocalAccess` — not recorded |
| Authorizing human | `Bahadoor` |
| Authority role | `Nexora Product and Architecture Authority` |
| Decision date | `2026-07-29` |
| Requested scope | `Tier0SyntheticPreviewRouteLocalDevelopmentOnly` |
| Implementation authorization | `false` |
| Local access authorization | `false` |
| Production access authorization | `false` |
| Deployment authorization | `false` |
| Public access authorization | `false` |
| Real RTC-2 consumption authorization | `false` |

This record captures the requested human decision and the blocking authority conflict. It does not authorize or implement a route.

## Preconditions and conflict

The repository contains accepted records for `AD-EX2-00` through `AD-EX2-10`. `AD-EX2-07` accepts the Tier-0 read-only synthetic UI architecture. The existing authorization and certifications are present:

- UI implementation authorization: `EX2-UI-AUTH-T0-2026-07-27-01`
- metadata package certification: `EX2-CERT-T0-2026-07-26-01`
- UI certification: `EX2-UI-CERT-T0-2026-07-27-01`
- consumer identity: `EX-2:T0/ExecutiveJournalSyntheticPreviewUI`
- source classification: `SyntheticSourceOnly`
- certified host: `DevelopmentTestHarnessOnly`

The preview, facade, metadata provider, hand-authored fixtures, and harness remain present. Their certification is explicitly non-production and states `routeAuthorized: false`, `newDecisionRequiredBeforeRoute: true`, `productionApplicability: false`, and `realRtc2Applicability: false`.

The precise conflict is that no accepted route architecture decision or completed “Tier-0 Synthetic Preview Route and Local Access Authorization Assessment” exists. The canonical evidence ledger contains only `AD-EX2-08/RouteAssessment`, whose disposition is:

- `routeAssessment: "DeferredSupportingEvidence"`
- `routeImplementationAuthorized: false`
- `routeArchitectureDecisionAccepted: false`
- `noRoutePathReservedAsAuthoritativeProductSurface: true`
- `routeWorkMayResumeOnlyAtPlatformOrLocalAccessDecisionPoint: true`

`RouteAndNavigationAuthorization` also remains an unresolved open issue under `AD-EX2-08`. Human authorization metadata cannot truthfully replace the missing architecture decision. Recording the requested authorization would contradict the accepted certification and route-assessment records.

## Previous route-assessment evidence

| Assessment field | Evidence-supported value |
| --- | --- |
| Canonical evidence ID | `AD-EX2-08/RouteAssessment` |
| Assessment status | `DeferredSupportingEvidence` |
| Proposed route path | None selected |
| Proposed host | None selected for a route; the certified UI host remains `DevelopmentTestHarnessOnly` and explicitly “not App Router route” |
| Environment restriction | No route environment contract was accepted |
| Access restrictions | Route and navigation remain unauthorized |
| Feature-flag requirement | Not decided |
| Navigation restrictions | No App Router mount, primary navigation, or EX-1 Public Index integration is authorized |
| Unresolved blockers | Missing accepted route architecture decision; unresolved `RouteAndNavigationAuthorization` |
| Additional architecture decision required | Yes |

Existing Next.js conventions were inspected, but this blocked authorization record does not select or reserve a path. Doing so would contradict `noRoutePathReservedAsAuthoritativeProductSurface: true`. The missing architecture decision must select the narrow local-preview path and define its host, environment, access, and feature-flag contract.

## Scope and behavior disposition

No route behavior is authorized by this decision. The proposed bounded behavior remains input to the required architecture decision:

- exactly one development/test-only local route;
- existing certified preview, synthetic UI facade, and hand-authored fixtures only;
- mandatory `Synthetic / Tier 0 / Non-production` marker;
- read-only deterministic access to the nine certified UI states;
- existing harness-authorized state selection, filters, and selection only;
- no arbitrary payloads, user-supplied files, production-like API data, URL payload parameters, remote resources, browser storage, debug payload dumps, mutations, confirmations, disclosures, exports, executions, or operational commands;
- no private-reflection existence or content, evidence content, authority evidence, or actor PII;
- no network, persistence, telemetry, analytics, cloud, RTC-2, RTC-3, or APP-8 runtime;
- no EX-2:1 or EX-2:3 functionality, EX-1 Public Index change, primary navigation, production route, or deployment.

Local access likewise remains unauthorized. A future architecture decision must limit any proposed access to development/test on localhost or the repository’s established local development host, with no production domain, external publication, deployment, authentication/authorization claim, or security-through-obscurity claim.

No feature flag is authorized or created. If the required architecture decision mandates one, it must be local-development-only, off outside development/test, not remotely configurable, and impossible to enable in production.

## Lint and gate disposition

The evidence-supported project classification remains `CiStillBlockedByParkedReactCompilerDebt`. The requested `LocalTier0RouteAuthorizedWithProjectLintBlockerDisclosed` classification is not recorded because no route is authorized.

The 21 formally parked React Compiler errors remain disclosed; `CiLintGateClean` is not certified. The existing Tier-0 preview package and UI remain certified for their current development/test harness scope only. Any later route files would have to pass ESLint with zero errors and zero warnings and must not increase a parked finding.

No existing gate definition or result changes:

- the 16 EX-2 gates remain unchanged;
- `G-EX2-04`, `G-EX2-07`, and `G-EX2-12` remain `Pending`;
- the 16 `UI-T0-01` through `UI-T0-16` gates remain `Pass` and unchanged;
- the separate `UC-01` through `UC-27` certification evidence catalogue remains valid and unchanged;
- production applicability remains `false`;
- no route-specific gate catalogue is created because the prerequisite route architecture decision is absent.

## Preservation and explicit non-authorizations

This decision preserves all accepted EX-2 architecture decisions, the formal nine-phase sequence, metadata and UI certifications, allowlist and denylist, telemetry-disabled policy, privacy and authority review conditions, local-only/non-production marker, RTC and APP boundaries, parked React Compiler debt records, and TypeScript and Scene baselines.

It does not authorize a route, local access, navigation, public exposure, production, release, merge as a release-ready surface, deployment, real RTC-2, RTC-3, APP-8, network, persistence, telemetry, analytics, cloud, authentication claims, a production provider, EX-2:1 functionality, or EX-2:3 implementation. EX-2:3 retains its existing metadata-only authorization status.

## Verification evidence

Verification completed on `2026-07-29`:

| Check | Result |
| --- | --- |
| EX-2 product architecture | Pass |
| Tier-0 synthetic metadata | Pass |
| Tier-0 synthetic UI | 35 passed, 0 failed through the repository’s TSX-capable `vite-node` runner |
| EX-1 and RTC-2:9 / RTC-3:9 regressions | 146 passed, 0 failed |
| Scene runtime | 296 passed, 0 failed |
| Targeted strict TypeScript | 0 diagnostics |
| Production-source TypeScript | 0 diagnostics with 8 GB heap |
| Full-project TypeScript | 0 diagnostics with 8 GB heap |
| EX-2 focused ESLint | 0 errors, 0 warnings with `--max-warnings 0` |
| Full-project ESLint | 21 errors, 288 warnings; unchanged parked blocker posture |
| Production build | Pass in the explicitly network-enabled environment |
| Dependency-boundary scan | No prohibited runtime dependency or side-effect API; matches were safety declarations only |
| Route/artifact absence scan | No preview route or mount; only the six pre-existing application `page.tsx` files |
| Suppression scan | No suppression in the added decision record |
| Patch integrity | `git diff --check` pass |

The build emitted only the existing stale `baseline-browser-mapping` data advisory. Hosted CI was not executed and is not claimed.

This documentation-only decision adds no React/Next implementation, route folder, `page.tsx`, component, provider, adapter, fixture, flag, middleware, network code, persistence code, navigation entry, or lint suppression.

## Required next decision

The next task is:

`NPA-T — EX-2 Tier-0 Synthetic Preview Route and Local Access Architecture Decision`

Only after that decision is accepted and its conflicts are resolved may human route authorization be reconsidered. The implementation-and-verification task is not authorized by this record.
