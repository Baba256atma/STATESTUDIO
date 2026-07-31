# AD-EX2-14 — Authorize Metadata-Only EX-2:6 Executive Journal Experience Platform Contract

- Status: Accepted
- Decision date: 2026-07-30
- Decision authority: Bahadoor
- Authority role: Nexora Product and Architecture Authority
- Selected option: `MetadataOnlyManifestBoundPlatformContract`
- Scope: `Ex26PlatformContractImplementationAndVerificationOnly`

## Context

The finalized EX-2:5 Executive Journal Experience Manifest is
`ReadyForPlatform`, binds the exact canonical `Valid` EX-2:4 evidence, and
passes final verification 111/111. The formal nine-phase EX-2 sequence in
AD-EX2-08 places Platform at EX-2:6.

AD-EX2-09 through AD-EX2-13 retain their exact authority. All 13 open issues
remain unresolved, and G-EX2-04, G-EX2-07, and G-EX2-12 remain `Pending`.

EX-1:6 exposes operational service methods. That convention is intentionally
not copied: EX-2:6 is restricted to metadata-only Platform contracts and may
perform no operations.

## Decision

Authorize later implementation and verification of:

- Identity: `EX-2:6/ExecutiveJournalExperiencePlatform`
- Namespace: `nexora.ex.executive.journal.experience.platform`
- Status: `Platform`
- Readiness: `ReadyForCertification`
- Previous phase: `EX-2:5 — Executive Journal Experience Manifest`
- Next-phase metadata: `EX-2:7 — Executive Journal Experience Certification`
- Metadata-only, contract-only, deterministic, immutable, side-effect-free,
  and fail-closed

`ReadyForCertification` does not create or authorize EX-2:7.

## Authorized package

The later implementation is limited to exactly:

1. `frontend/app/lib/ex/executiveJournalExperiencePlatform.ts`
2. `frontend/app/lib/ex/executiveJournalExperiencePlatformTypes.ts`
3. `frontend/app/lib/ex/executiveJournalExperiencePlatformIdentity.ts`
4. `frontend/app/lib/ex/executiveJournalExperiencePlatformLifecycle.ts`
5. `frontend/app/lib/ex/executiveJournalExperiencePlatformContracts.ts`
6. `frontend/app/lib/ex/executiveJournalExperiencePlatformBindings.ts`
7. `frontend/app/lib/ex/executiveJournalExperiencePlatformMetadata.ts`
8. `frontend/app/lib/ex/executiveJournalExperiencePlatform.test.ts`

`Bindings` is the canonical Platform-specific sixth file under the binding
EX-2 convention. This decision does not create any of these files.

## Dependency and eligibility boundary

The only authorized runtime dependency direction is:

```text
EX-2:6 Platform
  → EX-2:5 Manifest
  → EX-2:4 Validation
  → EX-2:3 Model
  → EX-2:2 Registry
  → EX-2:1 Foundation
  → architecture metadata
```

Construction requires the exact EX-2:5 aggregate, identity, canonical
`Eligible` result, sealed `ReadyForPlatform` lifecycle, complete 16-capability,
19-non-capability, and nine-prerequisite catalogues, and exact upstream
references. Missing, ineligible, malformed, cloned, stale, mismatched,
incomplete, or unauthorized input fails closed.

## Contract surface

The Platform may declare metadata contracts for Manifest and consumer binding,
capability exposure, non-capability enforcement, compatibility, access,
source/provider classification, isolation, availability, integrity, failure,
certification evidence, dependency boundaries, governance carry-forward, and
deterministic summaries.

Each of the 16 Manifest capabilities receives exactly one ordered,
metadata-only exposure binding. Each of the 19 Manifest non-capabilities
receives exactly one ordered `Prohibited` enforcement declaration.

The closed consumer contract records identity, allowed and prohibited
references, access/source classification, isolation, compatibility,
authorization evidence, and certification requirements. Unknown consumers
fail closed.

## Provider and source boundary

Only `NoProvider`, synthetic-provider reference metadata, and synthetic-source
evidence metadata are permitted. Tier-0 evidence may be referenced exactly as
supporting evidence but is not Platform runtime behavior.

No provider execution, live provider selection, real RTC-2 source, production
source, network, persistence, storage, telemetry, or production access is
authorized.

## Lifecycle and phase decisions

The authorized lifecycle is:

```text
Declared
→ ManifestBound
→ PlatformContractsDeclared
→ Sealed
→ ReadyForCertification
```

Only immediate forward transitions are valid. EX-2:6 phase decisions continue
as EX-2:6/D-21 through EX-2:6/D-26 and are not injected into sealed upstream
decision ledgers.

## Explicit authorization flags

- `ex26MetadataOnlyPlatformContractAuthorized: true`
- `ex26ImplementationAuthorized: true`
- `ex27Authorized: false`
- `platformRuntimeAuthorized: false`
- `providerExecutionAuthorized: false`
- `realRtc2ConsumptionAuthorized: false`
- `uiExpansionAuthorized: false`
- `routeAuthorizedByThisDecision: false`
- `networkAuthorized: false`
- `persistenceAuthorized: false`
- `telemetryAuthorized: false`
- `publicIndexAuthorized: false`
- `deploymentAuthorized: false`
- `productionAuthorized: false`

Existing Tier-0 metadata, UI, and route authorizations are preserved without
expansion.

## CI classification

- Project: `CiStillBlockedByParkedReactCompilerDebt`
- Authorization:
  `AllowMetadataOnlyEx26WithLintBlockerRecorded`
- Parked baseline: 21 errors, 288 warnings, 64 affected files,
  `no-explicit-any: 0`, unused variables: 0

This decision adds no suppression, weakens no lint rule, and does not claim a
clean CI lint gate.

## Consequences

EX-2:6 metadata-only Platform-contract implementation and verification is
authorized. EX-2:6 is not created by this decision. EX-2:7, runtime behavior,
providers, real RTC-2 consumption, UI, routes, network, persistence,
telemetry, production, public access, and deployment remain unauthorized.

Recommended next task:
`NPA-T — EX-2:6 Executive Journal Experience Platform`
