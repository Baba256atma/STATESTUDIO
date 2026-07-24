/**
 * NEX-3:8 — Certification-derived Freeze inventory and metadata.
 */

import { FeaturesModulesCertification } from "./featuresModulesCertification.ts";

export const FeaturesModulesFreezeMetadata = Object.freeze({
  inventory: Object.freeze({
    id: "NEX-3:8/FreezeInventory",
    frozenBaselineCount: FeaturesModulesCertification.freezeSeedMetadata.baselineSubjects.length,
    architecturalLockCount: FeaturesModulesCertification.freezeSeedMetadata.lockSubjects.length,
    extensionPolicyCount: FeaturesModulesCertification.freezeSeedMetadata.extensionPolicySubjects.length,
    compatibilityCount: FeaturesModulesCertification.freezeSeedMetadata.compatibilityDeclarations.length,
    publicApiCount: FeaturesModulesCertification.publicApiRegistry.length,
    freezeEntryCount: FeaturesModulesCertification.freezeSeedMetadata.freezeEntrySubjects.length,
    sourceCertificationId: FeaturesModulesCertification.identity.id,
    upstreamDerived: true,
    hardcodedInventoryValues: false,
    metadataOnly: true,
    immutable: true,
  }),
  guarantees: Object.freeze([
    Object.freeze({ id: "NEX-3:8/Guarantee/FrozenMetadata", name: "Frozen Metadata", description: "Certified Features & Modules metadata is declared frozen.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-3:8/Guarantee/CanonicalBaseline", name: "Canonical Baseline", description: "Freeze identifies the canonical NEX-3 baseline.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-3:8/Guarantee/CertificationDerived", name: "Certification Derived", description: "Freeze metadata derives only from Certification.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-3:8/Guarantee/NonExecutable", name: "Non-Executable", description: "Freeze implements no locking runtime.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  ]),
  compatibility: FeaturesModulesCertification.compatibility,
  dependencies: Object.freeze({ id: "NEX-3:8/FrozenDependencies", upstreamId: FeaturesModulesCertification.identity.id, upstreamPhase: "NEX-3:7", certificationOnly: true, runtimeDependency: false, otherDependenciesAllowed: false, metadataOnly: true, immutable: true }),
  readiness: Object.freeze({ id: "NEX-3:8/FreezeReadiness", status: "ReadyForPublicIndex", readyForPublicIndex: true, executesReadinessGate: false, metadataOnly: true, immutable: true }),
  publication: Object.freeze({ id: "NEX-3:8/FrozenPublication", publicationType: "FrozenFeaturesModulesMetadata", publicIndexPending: true, executablePublication: false, metadataOnly: true, immutable: true }),
  versioning: Object.freeze({ id: "NEX-3:8/FrozenVersioning", freezeVersion: "1.0.0", certificationVersion: FeaturesModulesCertification.identity.certificationVersion, versionLocked: true, versionResolution: false, metadataOnly: true, immutable: true }),
  frozenMetadata: Object.freeze({ id: "NEX-3:8/FrozenMetadata", lockIdentifier: "NEX-3-FEATURES-MODULES-LOCKED", inventoryDerivedFromCertification: true, metadataOnly: true, immutable: true }),
  lifecycle: Object.freeze({ id: "NEX-3:8/FreezeLifecycle", stage: "FrozenForPublicIndex", executesTransitions: false, metadataOnly: true, immutable: true }),
} as const);

export const FeaturesModulesFreezePublicApiRegistry = Object.freeze([
  Object.freeze({ id: "NEX-3:8/PublicFreezeExport/01/Id", order: 1, exportName: "FeaturesModulesFreezeId", artifact: "Identity", sourceCertificationId: FeaturesModulesCertification.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:8/PublicFreezeExport/02/Name", order: 2, exportName: "FeaturesModulesFreezeName", artifact: "Identity", sourceCertificationId: FeaturesModulesCertification.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:8/PublicFreezeExport/03/Namespace", order: 3, exportName: "FeaturesModulesFreezeNamespace", artifact: "Identity", sourceCertificationId: FeaturesModulesCertification.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:8/PublicFreezeExport/04/Version", order: 4, exportName: "FeaturesModulesFreezeVersion", artifact: "Identity", sourceCertificationId: FeaturesModulesCertification.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:8/PublicFreezeExport/05/CanonicalLock", order: 5, exportName: "FeaturesModulesCanonicalLockIdentifier", artifact: "CanonicalLock", sourceCertificationId: FeaturesModulesCertification.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:8/PublicFreezeExport/06/Readiness", order: 6, exportName: "FeaturesModulesFreezeReadiness", artifact: "Readiness", sourceCertificationId: FeaturesModulesCertification.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:8/PublicFreezeExport/07/PublicApiRegistry", order: 7, exportName: "FeaturesModulesFreezePublicApiRegistry", artifact: "PublicApiRegistry", sourceCertificationId: FeaturesModulesCertification.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-3:8/PublicFreezeExport/08/Freeze", order: 8, exportName: "FeaturesModulesFreeze", artifact: "Aggregate", sourceCertificationId: FeaturesModulesCertification.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
] as const);
