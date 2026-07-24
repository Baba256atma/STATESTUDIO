/**
 * NEX-1:7 — Supporting Certification declarations and public API metadata.
 */

import { ProductVisionStrategyPlatform } from "./productVisionStrategyPlatform.ts";

export const ProductVisionStrategyCertificationMetadata = Object.freeze({
  compatibility: Object.freeze({
    id: "NEX-1:7/CertificationCompatibility",
    backwardCompatible: true,
    forwardExtendable: true,
    metadataCompatible: true,
    versionCompatible: true,
    metadataOnly: true,
    immutable: true,
  }),
  dependencies: Object.freeze({
    id: "NEX-1:7/CertificationDependencies",
    upstreamId: ProductVisionStrategyPlatform.identity.id,
    upstreamPhase: "NEX-1:6",
    platformOnly: true,
    runtimeDependency: false,
    otherDependenciesAllowed: false,
    metadataOnly: true,
    immutable: true,
  }),
  readiness: Object.freeze({
    id: "NEX-1:7/CertificationReadiness",
    status: "ReadyForFreeze",
    readyForFreeze: true,
    executesReadinessGate: false,
    metadataOnly: true,
    immutable: true,
  }),
  lifecycle: Object.freeze({
    id: "NEX-1:7/CertificationLifecycle",
    stage: "CertifiedForFreeze",
    executesTransitions: false,
    metadataOnly: true,
    immutable: true,
  }),
  publication: Object.freeze({
    id: "NEX-1:7/CertificationPublication",
    publicationType: "CertificationMetadata",
    executablePublication: false,
    metadataOnly: true,
    immutable: true,
  }),
  versioning: Object.freeze({
    id: "NEX-1:7/CertificationVersioning",
    certificationVersion: "1.0.0",
    platformVersion: ProductVisionStrategyPlatform.identity.platformVersion,
    versionResolution: false,
    metadataOnly: true,
    immutable: true,
  }),
  compliance: Object.freeze({
    id: "NEX-1:7/CertificationCompliance",
    architecture: "NPA v2",
    complianceType: "DeclarativeMetadata",
    enforcement: false,
    metadataOnly: true,
    immutable: true,
  }),
  constraints: Object.freeze([
    Object.freeze({ id: "NEX-1:7/Constraint/MetadataDeclarationOnly", name: "Metadata declaration only", description: "Certification declares metadata and executes no assessment.", metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-1:7/Constraint/PlatformDependencyOnly", name: "Platform dependency only", description: "Certification consumes only NEX-1:6 Platform.", metadataOnly: true, immutable: true }),
  ]),
  assumptions: Object.freeze([
    Object.freeze({ id: "NEX-1:7/Assumption/CanonicalPlatform", name: "Canonical Platform", description: "NEX-1:6 is the canonical input to Certification.", metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-1:7/Assumption/FreezeConsumer", name: "Freeze consumer", description: "NEX-1:8 consumes Certification metadata without changing it.", metadataOnly: true, immutable: true }),
  ]),
  certificationMetadata: Object.freeze({
    id: "NEX-1:7/CertificationMetadata",
    platformId: ProductVisionStrategyPlatform.identity.id,
    certificationType: "MetadataDeclaration",
    metadataOnly: true,
    immutable: true,
  }),
} as const);

export const ProductVisionStrategyCertificationPublicApiRegistry = Object.freeze([
  Object.freeze({ id: "NEX-1:7/PublicCertificationExport/Id", exportName: "ProductVisionStrategyCertificationId", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:7/PublicCertificationExport/Name", exportName: "ProductVisionStrategyCertificationName", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:7/PublicCertificationExport/Namespace", exportName: "ProductVisionStrategyCertificationNamespace", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:7/PublicCertificationExport/Version", exportName: "ProductVisionStrategyCertificationVersion", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:7/PublicCertificationExport/Status", exportName: "ProductVisionStrategyCertificationStatus", artifact: "Identity", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:7/PublicCertificationExport/Readiness", exportName: "ProductVisionStrategyCertificationReadiness", artifact: "Readiness", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:7/PublicCertificationExport/PublicApiRegistry", exportName: "ProductVisionStrategyCertificationPublicApiRegistry", artifact: "PublicApiRegistry", executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-1:7/PublicCertificationExport/Certification", exportName: "ProductVisionStrategyCertification", artifact: "Aggregate", executableApi: false, metadataOnly: true }),
] as const);
