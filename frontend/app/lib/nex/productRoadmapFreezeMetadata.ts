/**
 * NEX-2:8 — Certification-derived Freeze inventory and supporting metadata.
 */

import { ProductRoadmapCertification } from "./productRoadmapCertification.ts";

export const ProductRoadmapFreezeMetadata = Object.freeze({
  inventory: Object.freeze({
    id: "NEX-2:8/FreezeInventory",
    frozenBaselineCount:
      ProductRoadmapCertification.freezeSeedMetadata.baselineSubjects.length,
    architecturalLockCount:
      ProductRoadmapCertification.freezeSeedMetadata.lockSubjects.length,
    extensionPolicyCount:
      ProductRoadmapCertification.freezeSeedMetadata.extensionPolicySubjects.length,
    compatibilityCount:
      ProductRoadmapCertification.freezeSeedMetadata.compatibilityDeclarations.length,
    publicApiCount:
      ProductRoadmapCertification.publicApiRegistry.length,
    freezeEntryCount:
      ProductRoadmapCertification.freezeSeedMetadata.freezeEntrySubjects.length,
    sourceCertificationId: ProductRoadmapCertification.identity.id,
    upstreamDerived: true,
    hardcodedInventoryValues: false,
    metadataOnly: true,
    immutable: true,
  }),
  guarantees: Object.freeze([
    Object.freeze({ id: "NEX-2:8/Guarantee/FrozenMetadata", name: "Frozen Metadata", description: "Certified roadmap metadata is declared frozen.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-2:8/Guarantee/CanonicalBaseline", name: "Canonical Baseline", description: "Freeze identifies the canonical NEX-2 baseline.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-2:8/Guarantee/CertificationDerived", name: "Certification Derived", description: "Freeze metadata derives only from Certification.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-2:8/Guarantee/NonExecutable", name: "Non-Executable", description: "Freeze implements no locking runtime.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  ]),
  compatibility: ProductRoadmapCertification.compatibility,
  dependencies: Object.freeze({
    id: "NEX-2:8/FrozenDependencies",
    upstreamId: ProductRoadmapCertification.identity.id,
    upstreamPhase: "NEX-2:7",
    certificationOnly: true,
    runtimeDependency: false,
    otherDependenciesAllowed: false,
    metadataOnly: true,
    immutable: true,
  }),
  readiness: Object.freeze({
    id: "NEX-2:8/FreezeReadiness",
    status: "ReadyForPublicIndex",
    readyForPublicIndex: true,
    executesReadinessGate: false,
    metadataOnly: true,
    immutable: true,
  }),
  publication: Object.freeze({
    id: "NEX-2:8/FrozenPublication",
    publicationType: "FrozenRoadmapMetadata",
    publicIndexPending: true,
    executablePublication: false,
    metadataOnly: true,
    immutable: true,
  }),
  versioning: Object.freeze({
    id: "NEX-2:8/FrozenVersioning",
    freezeVersion: "1.0.0",
    certificationVersion: ProductRoadmapCertification.identity.certificationVersion,
    versionLocked: true,
    versionResolution: false,
    metadataOnly: true,
    immutable: true,
  }),
  frozenMetadata: Object.freeze({
    id: "NEX-2:8/FrozenMetadata",
    lockIdentifier: "NEX-2-PRODUCT-ROADMAP-LOCKED",
    inventoryDerivedFromCertification: true,
    metadataOnly: true,
    immutable: true,
  }),
  lifecycle: Object.freeze({
    id: "NEX-2:8/FreezeLifecycle",
    stage: "FrozenForPublicIndex",
    executesTransitions: false,
    metadataOnly: true,
    immutable: true,
  }),
} as const);

export const ProductRoadmapFreezePublicApiRegistry = Object.freeze([
  Object.freeze({ id: "NEX-2:8/PublicFreezeExport/01/Id", order: 1, exportName: "ProductRoadmapFreezeId", artifact: "Identity", sourceCertificationId: ProductRoadmapCertification.identity.id, executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:8/PublicFreezeExport/02/Name", order: 2, exportName: "ProductRoadmapFreezeName", artifact: "Identity", sourceCertificationId: ProductRoadmapCertification.identity.id, executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:8/PublicFreezeExport/03/Namespace", order: 3, exportName: "ProductRoadmapFreezeNamespace", artifact: "Identity", sourceCertificationId: ProductRoadmapCertification.identity.id, executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:8/PublicFreezeExport/04/Version", order: 4, exportName: "ProductRoadmapFreezeVersion", artifact: "Identity", sourceCertificationId: ProductRoadmapCertification.identity.id, executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:8/PublicFreezeExport/05/CanonicalLock", order: 5, exportName: "ProductRoadmapCanonicalLockIdentifier", artifact: "CanonicalLock", sourceCertificationId: ProductRoadmapCertification.identity.id, executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:8/PublicFreezeExport/06/Readiness", order: 6, exportName: "ProductRoadmapFreezeReadiness", artifact: "Readiness", sourceCertificationId: ProductRoadmapCertification.identity.id, executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:8/PublicFreezeExport/07/PublicApiRegistry", order: 7, exportName: "ProductRoadmapFreezePublicApiRegistry", artifact: "PublicApiRegistry", sourceCertificationId: ProductRoadmapCertification.identity.id, executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:8/PublicFreezeExport/08/Freeze", order: 8, exportName: "ProductRoadmapFreeze", artifact: "Aggregate", sourceCertificationId: ProductRoadmapCertification.identity.id, executableApi: false, metadataOnly: true }),
] as const);
