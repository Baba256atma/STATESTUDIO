/**
 * NEX-2:7 — Supporting Certification and public API metadata.
 */

import { ProductRoadmapPlatform } from "./productRoadmapPlatform.ts";

export const ProductRoadmapCertificationMetadata = Object.freeze({
  compatibility: ProductRoadmapPlatform.compatibility,
  dependencies: Object.freeze({
    id: "NEX-2:7/CertificationDependencies",
    upstreamId: ProductRoadmapPlatform.identity.id,
    upstreamPhase: "NEX-2:6",
    platformOnly: true,
    runtimeDependency: false,
    otherDependenciesAllowed: false,
    metadataOnly: true,
    immutable: true,
  }),
  readiness: Object.freeze({
    id: "NEX-2:7/CertificationReadiness",
    status: "ReadyForFreeze",
    readyForFreeze: true,
    executesReadinessGate: false,
    metadataOnly: true,
    immutable: true,
  }),
  lifecycle: Object.freeze({
    id: "NEX-2:7/CertificationLifecycle",
    stage: "CertifiedForFreeze",
    executesTransitions: false,
    metadataOnly: true,
    immutable: true,
  }),
  publication: Object.freeze({
    id: "NEX-2:7/CertificationPublication",
    publicationType: "RoadmapCertificationMetadata",
    executablePublication: false,
    metadataOnly: true,
    immutable: true,
  }),
  versioning: Object.freeze({
    id: "NEX-2:7/CertificationVersioning",
    certificationVersion: "1.0.0",
    platformVersion: ProductRoadmapPlatform.identity.platformVersion,
    versionResolution: false,
    metadataOnly: true,
    immutable: true,
  }),
  compliance: Object.freeze({
    id: "NEX-2:7/CertificationCompliance",
    architecture: "NPA v2",
    complianceType: "DeclarativeMetadata",
    enforcement: false,
    metadataOnly: true,
    immutable: true,
  }),
  constraints: Object.freeze([
    Object.freeze({ id: "NEX-2:7/Constraint/MetadataDeclarationOnly", name: "Metadata declaration only", description: "Certification executes no assessment.", metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-2:7/Constraint/PlatformDependencyOnly", name: "Platform dependency only", description: "Certification consumes only NEX-2:6 Platform.", metadataOnly: true, immutable: true }),
  ]),
  assumptions: Object.freeze([
    Object.freeze({ id: "NEX-2:7/Assumption/CanonicalPlatform", name: "Canonical Platform", description: "NEX-2:6 is the canonical Certification input.", metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-2:7/Assumption/FreezeConsumer", name: "Freeze consumer", description: "NEX-2:8 consumes Certification metadata without altering it.", metadataOnly: true, immutable: true }),
  ]),
  certificationMetadata: Object.freeze({
    id: "NEX-2:7/CertificationMetadata",
    sourcePlatformId: ProductRoadmapPlatform.identity.id,
    inventoryDerivedFromPlatform: true,
    metadataOnly: true,
    immutable: true,
  }),
} as const);

export const ProductRoadmapCertificationPublicApiRegistry = Object.freeze([
  Object.freeze({ id: "NEX-2:7/PublicCertificationExport/01/Id", order: 1, exportName: "ProductRoadmapCertificationId", artifact: "Identity", sourcePlatformId: ProductRoadmapPlatform.identity.id, executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:7/PublicCertificationExport/02/Name", order: 2, exportName: "ProductRoadmapCertificationName", artifact: "Identity", sourcePlatformId: ProductRoadmapPlatform.identity.id, executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:7/PublicCertificationExport/03/Namespace", order: 3, exportName: "ProductRoadmapCertificationNamespace", artifact: "Identity", sourcePlatformId: ProductRoadmapPlatform.identity.id, executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:7/PublicCertificationExport/04/Version", order: 4, exportName: "ProductRoadmapCertificationVersion", artifact: "Identity", sourcePlatformId: ProductRoadmapPlatform.identity.id, executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:7/PublicCertificationExport/05/Status", order: 5, exportName: "ProductRoadmapCertificationStatus", artifact: "Identity", sourcePlatformId: ProductRoadmapPlatform.identity.id, executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:7/PublicCertificationExport/06/Readiness", order: 6, exportName: "ProductRoadmapCertificationReadiness", artifact: "Readiness", sourcePlatformId: ProductRoadmapPlatform.identity.id, executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:7/PublicCertificationExport/07/PublicApiRegistry", order: 7, exportName: "ProductRoadmapCertificationPublicApiRegistry", artifact: "PublicApiRegistry", sourcePlatformId: ProductRoadmapPlatform.identity.id, executableApi: false, metadataOnly: true }),
  Object.freeze({ id: "NEX-2:7/PublicCertificationExport/08/Certification", order: 8, exportName: "ProductRoadmapCertification", artifact: "Aggregate", sourcePlatformId: ProductRoadmapPlatform.identity.id, executableApi: false, metadataOnly: true }),
] as const);
