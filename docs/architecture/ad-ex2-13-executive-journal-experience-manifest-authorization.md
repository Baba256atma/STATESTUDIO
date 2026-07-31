# AD-EX2-13 — Authorize Metadata-Only EX-2:5 Executive Journal Experience Manifest

- Status: Accepted
- Authority: Bahadoor
- Authority role: Nexora Product and Architecture Authority
- Decision date: 2026-07-30
- Date source: repository-supplied
- Selected option: `MetadataOnlyValidatedExperienceCapabilityManifest`
- Scope: `Ex25ManifestImplementationAndVerificationOnly`

## Decision

The finalized EX-2:4 Validation is `ReadyForManifest`. A closed, deterministic, immutable, side-effect-free, fail-closed, metadata-only EX-2:5 Manifest package is authorized for later implementation and verification from exact `Valid` EX-2:4 evidence.

This decision neither creates EX-2:5 artifacts nor authorizes or creates EX-2:6. It does not rewrite, renumber, supersede, or weaken AD-EX2-00 through AD-EX2-12.

## Preconditions and inspected convention conflict

AD-EX2-08 through AD-EX2-12 remain Accepted in canonical order. EX-2:4 final verification passed 121/121 tests with identity `EX-2:4/ExecutiveJournalExperienceValidation`, namespace `nexora.ex.executive.journal.experience.validation`, status `Validation`, and readiness `ReadyForManifest`. All 13 issues remain unresolved; G-EX2-04, G-EX2-07, and G-EX2-12 remain Pending.

EX-1:5 uses the older split `Capabilities`, `Dependencies`, `Guarantees`, `Identity`, `Metadata`, and `Registry`, with no explicit lifecycle file. EX-2:4 uses the EX-2 eight-file `Types`, `Identity`, `Lifecycle`, `Contracts`, phase-specific content, and `Metadata` convention. The canonical EX-2:5 sixth file is therefore `executiveJournalExperienceManifestEntries.ts`: Entries is the Manifest-specific replacement for Validation Rules, while retaining the binding EX-2 identity/lifecycle/contracts structure.

## Authorized identity and package

- Identity: `EX-2:5/ExecutiveJournalExperienceManifest`
- Namespace: `nexora.ex.executive.journal.experience.manifest`
- Status: `Manifest`
- Readiness: `ReadyForPlatform`
- Previous: `EX-2:4 — Executive Journal Experience Validation`
- Next metadata: `EX-2:6 — Executive Journal Experience Platform`
- Metadata-only, deterministic, immutable, side-effect-free, and fail-closed: true

The authorized future package is exactly:

1. `frontend/app/lib/ex/executiveJournalExperienceManifest.ts`
2. `frontend/app/lib/ex/executiveJournalExperienceManifestTypes.ts`
3. `frontend/app/lib/ex/executiveJournalExperienceManifestIdentity.ts`
4. `frontend/app/lib/ex/executiveJournalExperienceManifestLifecycle.ts`
5. `frontend/app/lib/ex/executiveJournalExperienceManifestContracts.ts`
6. `frontend/app/lib/ex/executiveJournalExperienceManifestEntries.ts`
7. `frontend/app/lib/ex/executiveJournalExperienceManifestMetadata.ts`
8. `frontend/app/lib/ex/executiveJournalExperienceManifest.test.ts`

These files are not created by this decision.

## Dependency and validated input

The only authorized runtime dependency direction is:

```text
EX-2:5 Manifest
  → EX-2:4 Validation
  → EX-2:3 Model
  → EX-2:2 Registry
  → EX-2:1 Foundation
  → architecture metadata
```

EX-2:5 may import only EX-2:4 Validation at runtime. Earlier phases are reached through exact Validation references only.

Manifest construction requires the exact EX-2:4 Validation aggregate and result `Valid`, bound to the exact validated EX-2:3 Model identity. Invalid, missing, malformed, cloned, stale, mismatched, or unknown evidence is ineligible. Validation confirms metadata conformance only; it neither satisfies production gates nor authorizes EX-2:6.

## Closed declaration surface

Closed vocabularies are:

- Eligibility: `Eligible`, `Ineligible`
- Capability: `Declared`, `NotDeclared`, `Prohibited`
- Compatibility: `Compatible`, `Incompatible`, `NotEvaluated`
- Requirement: `Satisfied`, `Unsatisfied`, `Pending`
- Entry kinds, reason codes, and lifecycle states are closed catalogues recorded in the canonical architecture metadata.

Unknown, malformed, partial, case-modified, whitespace-modified, and cross-vocabulary values fail closed.

The authorized capability catalogue contains the 16 validated metadata surfaces from metadata-only composition through fail-closed consumer-boundary metadata, each with stable identity and order. The explicit non-capability catalogue contains all 19 prohibited surfaces, including journal narrative, private-reflection signals, evidence content, PII, commands, real RTC-2, UI/routes, network, persistence, telemetry, clock/randomness, cloud/deployment, and EX-2:6 implementation. Declaration is not implementation.

## Lifecycle, prerequisites, and phase decisions

Only immediate forward transitions are authorized:

```text
Declared
→ ValidationBound
→ CapabilitiesDeclared
→ Sealed
→ ReadyForPlatform
```

Self, reverse, skipped, malformed, case-modified, whitespace-modified, and unknown transitions must fail closed.

The nine declared Platform prerequisites require exact EX-2:5 identity, exact EX-2:4 Valid evidence, intact dependencies, sealed entries, no prohibited capability, carried issues, Pending production gates, separate EX-2:6 authorization, and no inference from Tier-0 evidence to production.

EX-2:5 may later implement immutable, ordered, directly tested decisions EX-2:5/D-15 through D-20. They are phase decisions, not AD-EX2 records, and must not be injected into sealed upstream ledgers.

## Preservation and non-authorization

All upstream identities, validation rules and issues, Model catalogues, Foundation boundaries, architecture decisions, Tier-0 evidence, authorization records, 13 unresolved issues, and three Pending gates remain exact-reference preserved. Manifest eligibility resolves none of them. Existing Tier-0 UI and route authorization is preserved without expansion.

Explicit authorization flags:

```text
ex25MetadataOnlyManifestAuthorized: true
ex25ImplementationAuthorized: true
ex26Authorized: false

platformBehaviorAuthorized: false
runtimeBehaviorAuthorized: false
uiExpansionAuthorized: false
routeAuthorizedByThisDecision: false
realRtc2ConsumptionAuthorized: false
productionProviderAuthorized: false
networkAuthorized: false
persistenceAuthorized: false
telemetryAuthorized: false
publicIndexAuthorized: false
deploymentAuthorized: false
```

`ReadyForPlatform` is readiness metadata only and does not authorize or create EX-2:6.

## CI classification

- Project: `CiStillBlockedByParkedReactCompilerDebt`
- Authorization: `AllowMetadataOnlyEx25WithLintBlockerRecorded`
- Parked baseline: 21 errors, 288 warnings, 64 affected files, zero `no-explicit-any`, zero unused variables

This decision adds no suppression, changes no parked React Compiler cluster, weakens no ESLint rule, and does not claim `CiLintGateClean`.

## Consequence

EX-2:5 metadata-only Manifest implementation and verification is authorized as the next task. EX-2:5 is not created here. EX-2:6, runtime behavior, UI, routes, real RTC-2 consumption, provider access, production, public access, and deployment remain unauthorized.
