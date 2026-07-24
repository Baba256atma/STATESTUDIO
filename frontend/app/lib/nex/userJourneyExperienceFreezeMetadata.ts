/**
 * NEX-4:8 — Certification-derived Freeze inventory and metadata.
 */

import { UserJourneyExperienceCertification } from "./userJourneyExperienceCertification.ts";

export const UserJourneyExperienceFreezeMetadata = Object.freeze({
  inventory: Object.freeze({
    id: "NEX-4:8/FreezeInventory",
    frozenBaselineCount: UserJourneyExperienceCertification.freezeSeedMetadata.baselineSubjects.length,
    architecturalLockCount: UserJourneyExperienceCertification.freezeSeedMetadata.lockSubjects.length,
    extensionPolicyCount: UserJourneyExperienceCertification.freezeSeedMetadata.extensionPolicySubjects.length,
    compatibilityCount: UserJourneyExperienceCertification.freezeSeedMetadata.compatibilityDeclarations.length,
    publicApiCount: UserJourneyExperienceCertification.publicApiRegistry.length,
    freezeEntryCount: UserJourneyExperienceCertification.freezeSeedMetadata.freezeEntrySubjects.length,
    sourceCertificationId: UserJourneyExperienceCertification.identity.id,
    upstreamDerived: true,
    hardcodedInventoryValues: false,
    metadataOnly: true,
    immutable: true,
  }),
  guarantees: Object.freeze([
    Object.freeze({ id: "NEX-4:8/Guarantee/FrozenMetadata", name: "Frozen Metadata", description: "Certified User Journey & Experience metadata is declared frozen.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-4:8/Guarantee/CanonicalBaseline", name: "Canonical Baseline", description: "Freeze identifies the canonical NEX-4 baseline.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-4:8/Guarantee/CertificationDerived", name: "Certification Derived", description: "Freeze metadata derives only from Certification.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-4:8/Guarantee/NonExecutable", name: "Non-Executable", description: "Freeze implements no locking runtime.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  ]),
  compatibility: UserJourneyExperienceCertification.compatibility,
  dependencies: Object.freeze({ id: "NEX-4:8/FrozenDependencies", upstreamId: UserJourneyExperienceCertification.identity.id, upstreamPhase: "NEX-4:7", certificationOnly: true, runtimeDependency: false, otherDependenciesAllowed: false, metadataOnly: true, immutable: true }),
  readiness: Object.freeze({ id: "NEX-4:8/FreezeReadiness", status: "ReadyForPublicIndex", readyForPublicIndex: true, executesReadinessGate: false, metadataOnly: true, immutable: true }),
  publication: Object.freeze({ id: "NEX-4:8/FrozenPublication", publicationType: "FrozenUserJourneyExperienceMetadata", publicIndexPending: true, executablePublication: false, metadataOnly: true, immutable: true }),
  versioning: Object.freeze({ id: "NEX-4:8/FrozenVersioning", freezeVersion: "1.0.0", certificationVersion: UserJourneyExperienceCertification.identity.certificationVersion, versionLocked: true, versionResolution: false, metadataOnly: true, immutable: true }),
  frozenMetadata: Object.freeze({ id: "NEX-4:8/FrozenMetadata", lockIdentifier: "NEX-4-USER-JOURNEY-EXPERIENCE-LOCKED", inventoryDerivedFromCertification: true, metadataOnly: true, immutable: true }),
  lifecycle: Object.freeze({ id: "NEX-4:8/FreezeLifecycle", stage: "FrozenForPublicIndex", executesTransitions: false, metadataOnly: true, immutable: true }),
} as const);

export const UserJourneyExperienceFreezePublicApiRegistry = Object.freeze([
  Object.freeze({ id: "NEX-4:8/PublicFreezeExport/01/Id", order: 1, exportName: "UserJourneyExperienceFreezeId", artifact: "Identity", sourceCertificationId: UserJourneyExperienceCertification.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:8/PublicFreezeExport/02/Name", order: 2, exportName: "UserJourneyExperienceFreezeName", artifact: "Identity", sourceCertificationId: UserJourneyExperienceCertification.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:8/PublicFreezeExport/03/Namespace", order: 3, exportName: "UserJourneyExperienceFreezeNamespace", artifact: "Identity", sourceCertificationId: UserJourneyExperienceCertification.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:8/PublicFreezeExport/04/Version", order: 4, exportName: "UserJourneyExperienceFreezeVersion", artifact: "Identity", sourceCertificationId: UserJourneyExperienceCertification.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:8/PublicFreezeExport/05/CanonicalLock", order: 5, exportName: "UserJourneyExperienceCanonicalLockIdentifier", artifact: "CanonicalLock", sourceCertificationId: UserJourneyExperienceCertification.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:8/PublicFreezeExport/06/Readiness", order: 6, exportName: "UserJourneyExperienceFreezeReadiness", artifact: "Readiness", sourceCertificationId: UserJourneyExperienceCertification.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:8/PublicFreezeExport/07/PublicApiRegistry", order: 7, exportName: "UserJourneyExperienceFreezePublicApiRegistry", artifact: "PublicApiRegistry", sourceCertificationId: UserJourneyExperienceCertification.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:8/PublicFreezeExport/08/Freeze", order: 8, exportName: "UserJourneyExperienceFreeze", artifact: "Aggregate", sourceCertificationId: UserJourneyExperienceCertification.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
] as const);
