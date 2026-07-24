/**
 * NEX-4:7 — Supporting Certification and public API metadata.
 */

import { UserJourneyExperiencePlatform } from "./userJourneyExperiencePlatform.ts";

export const UserJourneyExperienceCertificationMetadata = Object.freeze({
  compatibility: UserJourneyExperiencePlatform.compatibility,
  dependencies: Object.freeze({ id: "NEX-4:7/CertificationDependencies", upstreamId: UserJourneyExperiencePlatform.identity.id, upstreamPhase: "NEX-4:6", platformOnly: true, runtimeDependency: false, otherDependenciesAllowed: false, metadataOnly: true, immutable: true }),
  readiness: Object.freeze({ id: "NEX-4:7/CertificationReadiness", status: "ReadyForFreeze", readyForFreeze: true, executesReadinessGate: false, metadataOnly: true, immutable: true }),
  lifecycle: Object.freeze({ id: "NEX-4:7/CertificationLifecycle", stage: "CertifiedForFreeze", executesTransitions: false, metadataOnly: true, immutable: true }),
  publication: Object.freeze({ id: "NEX-4:7/CertificationPublication", publicationType: "UserJourneyExperienceCertificationMetadata", executablePublication: false, metadataOnly: true, immutable: true }),
  versioning: Object.freeze({ id: "NEX-4:7/CertificationVersioning", certificationVersion: "1.0.0", platformVersion: UserJourneyExperiencePlatform.identity.platformVersion, versionResolution: false, metadataOnly: true, immutable: true }),
  compliance: Object.freeze({ id: "NEX-4:7/CertificationCompliance", architecture: "NPA v2", complianceType: "DeclarativeMetadata", enforcement: false, metadataOnly: true, immutable: true }),
  constraints: Object.freeze([
    Object.freeze({ id: "NEX-4:7/Constraint/MetadataDeclarationOnly", name: "Metadata declaration only", description: "Certification executes no assessment.", metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-4:7/Constraint/PlatformDependencyOnly", name: "Platform dependency only", description: "Certification consumes only NEX-4:6 Platform.", metadataOnly: true, immutable: true }),
  ]),
  assumptions: Object.freeze([
    Object.freeze({ id: "NEX-4:7/Assumption/CanonicalPlatform", name: "Canonical Platform", description: "NEX-4:6 is the canonical Certification input.", metadataOnly: true, immutable: true }),
    Object.freeze({ id: "NEX-4:7/Assumption/FreezeConsumer", name: "Freeze consumer", description: "NEX-4:8 consumes Certification metadata without altering it.", metadataOnly: true, immutable: true }),
  ]),
  certificationMetadata: Object.freeze({ id: "NEX-4:7/CertificationMetadata", sourcePlatformId: UserJourneyExperiencePlatform.identity.id, inventoryDerivedFromPlatform: true, metadataOnly: true, immutable: true }),
} as const);

export const UserJourneyExperienceCertificationPublicApiRegistry = Object.freeze([
  Object.freeze({ id: "NEX-4:7/PublicCertificationExport/01/Id", order: 1, exportName: "UserJourneyExperienceCertificationId", artifact: "Identity", sourcePlatformId: UserJourneyExperiencePlatform.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/PublicCertificationExport/02/Name", order: 2, exportName: "UserJourneyExperienceCertificationName", artifact: "Identity", sourcePlatformId: UserJourneyExperiencePlatform.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/PublicCertificationExport/03/Namespace", order: 3, exportName: "UserJourneyExperienceCertificationNamespace", artifact: "Identity", sourcePlatformId: UserJourneyExperiencePlatform.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/PublicCertificationExport/04/Version", order: 4, exportName: "UserJourneyExperienceCertificationVersion", artifact: "Identity", sourcePlatformId: UserJourneyExperiencePlatform.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/PublicCertificationExport/05/Status", order: 5, exportName: "UserJourneyExperienceCertificationStatus", artifact: "Identity", sourcePlatformId: UserJourneyExperiencePlatform.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/PublicCertificationExport/06/Readiness", order: 6, exportName: "UserJourneyExperienceCertificationReadiness", artifact: "Readiness", sourcePlatformId: UserJourneyExperiencePlatform.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/PublicCertificationExport/07/PublicApiRegistry", order: 7, exportName: "UserJourneyExperienceCertificationPublicApiRegistry", artifact: "PublicApiRegistry", sourcePlatformId: UserJourneyExperiencePlatform.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/PublicCertificationExport/08/Certification", order: 8, exportName: "UserJourneyExperienceCertification", artifact: "Aggregate", sourcePlatformId: UserJourneyExperiencePlatform.identity.id, executableApi: false, metadataOnly: true, immutable: true }),
] as const);
