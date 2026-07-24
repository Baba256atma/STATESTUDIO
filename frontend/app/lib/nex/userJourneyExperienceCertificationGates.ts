/**
 * NEX-4:7 — Exactly twelve immutable Certification gates.
 */

import { UserJourneyExperiencePlatform } from "./userJourneyExperiencePlatform.ts";

const Subjects = UserJourneyExperiencePlatform.certificationSeedMetadata.gateSubjects;

export const UserJourneyExperienceCertificationGates = Object.freeze([
  Object.freeze({ id: "NEX-4:7/Gate/Identity", name: "Identity Gate", sourceSubject: Subjects[0], criterionReference: "NEX-4:7/Criterion/CanonicalIdentity", declaredResult: "Pass", executesGate: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/Gate/Inventory", name: "Inventory Gate", sourceSubject: Subjects[1], criterionReference: "NEX-4:7/Criterion/PlatformInventory", declaredResult: "Pass", executesGate: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/Gate/Dependency", name: "Dependency Gate", sourceSubject: Subjects[2], criterionReference: "NEX-4:7/Criterion/DependencyIntegrity", declaredResult: "Pass", executesGate: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/Gate/Relationship", name: "Relationship Gate", sourceSubject: Subjects[3], criterionReference: "NEX-4:7/Criterion/MetadataIntegrity", declaredResult: "Pass", executesGate: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/Gate/Capability", name: "Capability Gate", sourceSubject: Subjects[4], criterionReference: "NEX-4:7/Criterion/CapabilityCompleteness", declaredResult: "Pass", executesGate: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/Gate/Guarantee", name: "Guarantee Gate", sourceSubject: Subjects[5], criterionReference: "NEX-4:7/Criterion/GuaranteeCompleteness", declaredResult: "Pass", executesGate: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/Gate/Compatibility", name: "Compatibility Gate", sourceSubject: Subjects[6], criterionReference: "NEX-4:7/Criterion/Compatibility", declaredResult: "Pass", executesGate: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/Gate/Publication", name: "Publication Gate", sourceSubject: Subjects[7], criterionReference: "NEX-4:7/Criterion/PublicationIntegrity", declaredResult: "Pass", executesGate: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/Gate/Metadata", name: "Metadata Gate", sourceSubject: Subjects[8], criterionReference: "NEX-4:7/Criterion/MetadataIntegrity", declaredResult: "Pass", executesGate: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/Gate/Architecture", name: "Architecture Gate", sourceSubject: Subjects[9], criterionReference: "NEX-4:7/Criterion/MetadataOnlyArchitecture", declaredResult: "Pass", executesGate: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/Gate/Readiness", name: "Readiness Gate", sourceSubject: Subjects[10], criterionReference: "NEX-4:7/Criterion/PlatformCompleteness", declaredResult: "Pass", executesGate: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/Gate/Release", name: "Release Gate", sourceSubject: Subjects[11], criterionReference: "NEX-4:7/Criterion/VersionConsistency", declaredResult: "Pass", executesGate: false, metadataOnly: true, immutable: true }),
] as const);
