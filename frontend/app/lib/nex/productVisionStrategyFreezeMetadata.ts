/**
 * NEX-1:8 — Frozen inventory, architecture, guarantees, compatibility,
 * dependencies, readiness, publication, versioning, metadata, lifecycle,
 * and public API declarations.
 */

import { ProductVisionStrategyCertification } from "./productVisionStrategyCertification.ts";

export const ProductVisionStrategyFreezeMetadata = Object.freeze({
  inventory: Object.freeze({
    id: "NEX-1:8/FrozenInventory",
    baselineCount: 8,
    architecturalLockCount: 12,
    extensionPolicyCount: 8,
    publicApiCount: 8,
    frozenSectionCount: 16,
    sourceCertificationId: ProductVisionStrategyCertification.identity.id,
    metadataOnly: true,
    immutable: true,
  }),
  architecture: Object.freeze({
    id: "NEX-1:8/FrozenArchitecture",
    architecture: "NPA v2",
    platform: "Vision & Product Strategy",
    lockIdentifier: "NEX-1-VISION-PRODUCT-STRATEGY-LOCKED",
    locked: true,
    metadataOnly: true,
    immutable: true,
  }),
  guarantees: Object.freeze([
    Object.freeze({ id: "NEX-1:8/Guarantee/FrozenMetadata", name: "Frozen Metadata", description: "Certified metadata is declared frozen.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-1:8/Guarantee/CanonicalBaseline", name: "Canonical Baseline", description: "The Freeze identifies the canonical NEX-1 baseline.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-1:8/Guarantee/NonExecutable", name: "Non-Executable", description: "Freeze implements no locking runtime.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-1:8/Guarantee/CertificationDerived", name: "Certification Derived", description: "Freeze metadata is derived solely from Certification.", runtimeGuarantee: false, metadataOnly: true, immutable: true }),
  ]),
  compatibility: Object.freeze({
    id: "NEX-1:8/FrozenCompatibility",
    backwardCompatible: true,
    forwardExtendable: true,
    metadataCompatible: true,
    versionCompatible: true,
    metadataOnly: true,
    immutable: true,
  }),
  dependencies: Object.freeze({
    id: "NEX-1:8/FrozenDependencies",
    upstreamId: ProductVisionStrategyCertification.identity.id,
    upstreamPhase: "NEX-1:7",
    certificationOnly: true,
    runtimeDependency: false,
    otherDependenciesAllowed: false,
    metadataOnly: true,
    immutable: true,
  }),
  readiness: Object.freeze({
    id: "NEX-1:8/FrozenReadiness",
    status: "ReadyForPublicIndex",
    readyForPublicIndex: true,
    executesReadinessGate: false,
    metadataOnly: true,
    immutable: true,
  }),
  publication: Object.freeze({
    id: "NEX-1:8/FrozenPublication",
    publicationType: "FrozenMetadata",
    publicIndexPending: true,
    executablePublication: false,
    metadataOnly: true,
    immutable: true,
  }),
  versioning: Object.freeze({
    id: "NEX-1:8/FrozenVersioning",
    freezeVersion: "1.0.0",
    certificationVersion: ProductVisionStrategyCertification.identity.certificationVersion,
    versionLocked: true,
    versionResolution: false,
    metadataOnly: true,
    immutable: true,
  }),
  frozenMetadata: Object.freeze({
    id: "NEX-1:8/FrozenMetadata",
    lockIdentifier: "NEX-1-VISION-PRODUCT-STRATEGY-LOCKED",
    preservationType: "MetadataBaseline",
    metadataOnly: true,
    immutable: true,
  }),
  lifecycle: Object.freeze({
    id: "NEX-1:8/FreezeLifecycle",
    stage: "FrozenForPublicIndex",
    executesTransitions: false,
    metadataOnly: true,
    immutable: true,
  }),
} as const);

export const ProductVisionStrategyFreezePublicApiRegistry = Object.freeze([
  Object.freeze({ id: "NEX-1:8/PublicFreezeExport/Id", exportName: "ProductVisionStrategyFreezeId", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:8/PublicFreezeExport/Name", exportName: "ProductVisionStrategyFreezeName", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:8/PublicFreezeExport/Namespace", exportName: "ProductVisionStrategyFreezeNamespace", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:8/PublicFreezeExport/Version", exportName: "ProductVisionStrategyFreezeVersion", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:8/PublicFreezeExport/CanonicalLockIdentifier", exportName: "ProductVisionStrategyCanonicalLockIdentifier", artifact: "CanonicalLock", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:8/PublicFreezeExport/Readiness", exportName: "ProductVisionStrategyFreezeReadiness", artifact: "Readiness", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:8/PublicFreezeExport/PublicApiRegistry", exportName: "ProductVisionStrategyFreezePublicApiRegistry", artifact: "PublicApiRegistry", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:8/PublicFreezeExport/Freeze", exportName: "ProductVisionStrategyFreeze", artifact: "Aggregate", executableApi: false, metadataOnly: true }),
] as const);
