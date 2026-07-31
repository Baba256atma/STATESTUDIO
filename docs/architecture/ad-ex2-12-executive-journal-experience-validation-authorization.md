# AD-EX2-12 — Authorize Metadata-Only EX-2:4 Executive Journal Experience Validation

## Decision

| Field | Value |
| --- | --- |
| ID | `AD-EX2-12` |
| Status | `Accepted` |
| Authority | `Bahadoor` |
| Authority role | `Nexora Product and Architecture Authority` |
| Decision date | `2026-07-30` |
| Selected option | `MetadataOnlyFailClosedExperienceValidation` |
| Scope | `Ex24ValidationImplementationAndVerificationOnly` |
| Creates EX-2:4 | `false` |
| Authorizes EX-2:5 | `false` |
| CI lint status | `CiStillBlockedByParkedReactCompilerDebt` |
| Lint authorization | `AllowMetadataOnlyEx24WithLintBlockerRecorded` |

This architecture decision authorizes a later metadata-only EX-2:4 Validation implementation and its verification. It does not create the Validation package.

## Preconditions

`AD-EX2-08` remains Accepted and preserves the formal nine-phase EX-2 sequence. `AD-EX2-09` remains EX-2:2 Registry authority. `AD-EX2-10` remains EX-2:3 Model authority. `AD-EX2-11` remains allocated to the Tier-0 synthetic preview-route architecture and is unchanged.

EX-2:3 is finalized as `EX-2:3/ExecutiveJournalExperienceModel`, namespace `nexora.ex.executive.journal.experience.model`, status `Model`, and readiness `ReadyForValidation`. Its final verification passes 51 of 51 tests.

No EX-2:4 or EX-2:5 implementation artifact exists. All 13 EX-2:1 open issues remain unresolved. `G-EX2-04`, `G-EX2-07`, and `G-EX2-12` remain `Pending`.

## Authorized identity

- Identity: `EX-2:4/ExecutiveJournalExperienceValidation`
- Namespace: `nexora.ex.executive.journal.experience.validation`
- Status: `Validation`
- Readiness: `ReadyForManifest`
- Previous phase: `EX-2:3 — Executive Journal Experience Model`
- Next phase metadata: `EX-2:5 — Executive Journal Experience Manifest`
- Metadata-only, side-effect free, deterministic, immutable, and fail-closed

`ReadyForManifest` does not create or authorize EX-2:5.

## Authorized future package

A later implementation task may create exactly:

1. `frontend/app/lib/ex/executiveJournalExperienceValidation.ts`
2. `frontend/app/lib/ex/executiveJournalExperienceValidationTypes.ts`
3. `frontend/app/lib/ex/executiveJournalExperienceValidationIdentity.ts`
4. `frontend/app/lib/ex/executiveJournalExperienceValidationLifecycle.ts`
5. `frontend/app/lib/ex/executiveJournalExperienceValidationContracts.ts`
6. `frontend/app/lib/ex/executiveJournalExperienceValidationRules.ts`
7. `frontend/app/lib/ex/executiveJournalExperienceValidationMetadata.ts`
8. `frontend/app/lib/ex/executiveJournalExperienceValidation.test.ts`

None of these files is created by this decision.

## Dependency direction

```text
EX-2:4 Validation
  → EX-2:3 Model
  → EX-2:2 Registry
  → EX-2:1 Foundation
  → architecture metadata
```

EX-2:4 may import only the EX-2:3 Model as its upstream runtime dependency. Registry and Foundation are reached through the Model, and all upstream object references must remain exact.

Direct Registry, Foundation, product-architecture, RTC-1/2/3, APP-8, EX-1 Public Index, React, Next.js, route, UI, provider, adapter, fixture, and Tier-0 runtime imports are prohibited. Network, persistence, telemetry, browser storage, clocks, randomness, cloud, mutation, and deployment behavior are prohibited.

## Validation authority

The later validator may validate the EX-2:3 identity and structure, 14 entities, 13 relationships, 11 vocabularies, lifecycle metadata, metadata/privacy/authority boundaries, provenance, correction and supersession structure, projection and filter constraints, and Tier-0 evidence-reference metadata.

It may return immutable validation results and issue descriptors. It may not repair, normalize, trim, coerce, infer, silently strip, or mutate input.

The closed result surface includes:

- validation result: `Valid | Invalid`
- severity: `Info | Warning | Error | Critical`
- closed subject kinds, rule families, issue codes, and validation lifecycle states

A `Valid` result means only that metadata conforms to EX-2:3 contracts. It grants no production, UI, routing, RTC consumption, disclosure, integration, public-access, or deployment authority.

## Rule and lifecycle authority

The required rule families are Identity, Structure, EntityCatalogue, RelationshipCatalogue, Lifecycle, Vocabulary, MetadataBoundary, PrivacyBoundary, AuthorityBoundary, Provenance, CorrectionSupersession, Projection, FilterModel, Tier0EvidenceReference, Determinism, Immutability, and DependencyBoundary.

Every rule must have stable identity, deterministic order, immutable metadata, direct evidence, a coverage table, and a completeness assertion.

The authorized lifecycle is:

```text
Declared
→ UpstreamBound
→ RulesConstructed
→ Sealed
→ ReadyForManifest
```

Only immediate forward transitions are permitted.

## Preservation and non-authorization

AD-EX2-00 through AD-EX2-11 are not rewritten, renumbered, superseded, or weakened. EX-2:3 phase decisions remain intact. This decision is not injected into sealed Foundation or Registry ledgers.

All open issues, owners, descriptions, and `carriedByPhase` values remain unchanged. The three pending production gates continue to block production claims without blocking metadata-only EX-2:4 implementation.

The existing Tier-0 preview-route authorization remains independent and unchanged. This decision neither revokes nor expands it.

The parked lint baseline remains 21 errors and 288 warnings across 64 files, with zero `no-explicit-any` and zero unused-variable findings. No suppression or ESLint weakening is authorized.

## Outcome

```text
EX-2:4 authorization decision: Accepted
Decision ID: AD-EX2-12
EX-2:4 implementation authorized: Yes
EX-2:4 created: No
EX-2:5 authorized: No
CI lint status: CiStillBlockedByParkedReactCompilerDebt
Readiness: ReadyForMetadataOnlyEx24ValidationImplementation
```
