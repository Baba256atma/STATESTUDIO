/**
 * NEX-2:7 — Immutable declarative Certification gates.
 */

import { ProductRoadmapPlatform } from "./productRoadmapPlatform.ts";

export const ProductRoadmapCertificationGates = Object.freeze([
  Object.freeze({ id: "NEX-2:7/Gate/Identity", name: "Identity Gate", sourceSubject: ProductRoadmapPlatform.certificationSeedMetadata.gateSubjects[0], criterionReference: "NEX-2:7/Criterion/CanonicalIdentity", declaredResult: "Pass", executesGate: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:7/Gate/Inventory", name: "Inventory Gate", sourceSubject: ProductRoadmapPlatform.certificationSeedMetadata.gateSubjects[1], criterionReference: "NEX-2:7/Criterion/PlatformInventory", declaredResult: "Pass", executesGate: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:7/Gate/Dependency", name: "Dependency Gate", sourceSubject: ProductRoadmapPlatform.certificationSeedMetadata.gateSubjects[2], criterionReference: "NEX-2:7/Criterion/DependencyIntegrity", declaredResult: "Pass", executesGate: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:7/Gate/Relationship", name: "Relationship Gate", sourceSubject: ProductRoadmapPlatform.certificationSeedMetadata.gateSubjects[3], criterionReference: "NEX-2:7/Criterion/MetadataIntegrity", declaredResult: "Pass", executesGate: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:7/Gate/Capability", name: "Capability Gate", sourceSubject: ProductRoadmapPlatform.certificationSeedMetadata.gateSubjects[4], criterionReference: "NEX-2:7/Criterion/CapabilityCompleteness", declaredResult: "Pass", executesGate: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:7/Gate/Guarantee", name: "Guarantee Gate", sourceSubject: ProductRoadmapPlatform.certificationSeedMetadata.gateSubjects[5], criterionReference: "NEX-2:7/Criterion/GuaranteeCompleteness", declaredResult: "Pass", executesGate: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:7/Gate/Compatibility", name: "Compatibility Gate", sourceSubject: ProductRoadmapPlatform.certificationSeedMetadata.gateSubjects[6], criterionReference: "NEX-2:7/Criterion/Compatibility", declaredResult: "Pass", executesGate: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:7/Gate/Publication", name: "Publication Gate", sourceSubject: ProductRoadmapPlatform.certificationSeedMetadata.gateSubjects[7], criterionReference: "NEX-2:7/Criterion/PublicationIntegrity", declaredResult: "Pass", executesGate: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:7/Gate/Metadata", name: "Metadata Gate", sourceSubject: ProductRoadmapPlatform.certificationSeedMetadata.gateSubjects[8], criterionReference: "NEX-2:7/Criterion/MetadataIntegrity", declaredResult: "Pass", executesGate: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:7/Gate/Architecture", name: "Architecture Gate", sourceSubject: ProductRoadmapPlatform.certificationSeedMetadata.gateSubjects[9], criterionReference: "NEX-2:7/Criterion/MetadataOnlyArchitecture", declaredResult: "Pass", executesGate: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:7/Gate/Readiness", name: "Readiness Gate", sourceSubject: ProductRoadmapPlatform.certificationSeedMetadata.gateSubjects[10], criterionReference: "NEX-2:7/Criterion/PlatformCompleteness", declaredResult: "Pass", executesGate: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-2:7/Gate/Release", name: "Release Gate", sourceSubject: ProductRoadmapPlatform.certificationSeedMetadata.gateSubjects[11], criterionReference: "NEX-2:7/Criterion/VersionConsistency", declaredResult: "Pass", executesGate: false, metadataOnly: true, immutable: true }),
] as const);
