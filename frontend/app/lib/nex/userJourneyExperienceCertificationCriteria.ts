/**
 * NEX-4:7 — Exactly sixteen immutable Certification criteria.
 */

import { UserJourneyExperiencePlatform } from "./userJourneyExperiencePlatform.ts";

const Subjects = UserJourneyExperiencePlatform.certificationSeedMetadata.criteriaSubjects;

export const UserJourneyExperienceCertificationCriteria = Object.freeze([
  Object.freeze({ id: "NEX-4:7/Criterion/CanonicalIdentity", name: "Canonical Identity Verified", category: "Identity", sourceSubject: Subjects[0], declaredResult: "Verified", executesCertification: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/Criterion/PlatformInventory", name: "Platform Inventory Verified", category: "Inventory", sourceSubject: Subjects[1], declaredResult: "Verified", executesCertification: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/Criterion/ManifestTraceability", name: "Manifest Traceability Verified", category: "Traceability", sourceSubject: Subjects[2], declaredResult: "Verified", executesCertification: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/Criterion/RegistryTraceability", name: "Registry Traceability Verified", category: "Traceability", sourceSubject: Subjects[3], declaredResult: "Verified", executesCertification: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/Criterion/ModelTraceability", name: "Model Traceability Verified", category: "Traceability", sourceSubject: Subjects[4], declaredResult: "Verified", executesCertification: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/Criterion/ValidationTraceability", name: "Validation Traceability Verified", category: "Traceability", sourceSubject: Subjects[5], declaredResult: "Verified", executesCertification: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/Criterion/MetadataIntegrity", name: "Metadata Integrity Verified", category: "Integrity", sourceSubject: Subjects[6], declaredResult: "Verified", executesCertification: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/Criterion/PublicationIntegrity", name: "Publication Integrity Verified", category: "Publication", sourceSubject: Subjects[7], declaredResult: "Verified", executesCertification: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/Criterion/DependencyIntegrity", name: "Dependency Integrity Verified", category: "Dependency", sourceSubject: Subjects[8], declaredResult: "Verified", executesCertification: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/Criterion/Compatibility", name: "Compatibility Verified", category: "Compatibility", sourceSubject: Subjects[9], declaredResult: "Verified", executesCertification: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/Criterion/CapabilityCompleteness", name: "Capability Completeness Verified", category: "Capability", sourceSubject: Subjects[10], declaredResult: "Verified", executesCertification: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/Criterion/GuaranteeCompleteness", name: "Guarantee Completeness Verified", category: "Guarantee", sourceSubject: Subjects[11], declaredResult: "Verified", executesCertification: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/Criterion/PublicApiRegistry", name: "Public API Registry Verified", category: "Publication", sourceSubject: Subjects[12], declaredResult: "Verified", executesCertification: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/Criterion/MetadataOnlyArchitecture", name: "Metadata-Only Architecture Verified", category: "Architecture", sourceSubject: Subjects[13], declaredResult: "Verified", executesCertification: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/Criterion/VersionConsistency", name: "Version Consistency Verified", category: "Versioning", sourceSubject: Subjects[14], declaredResult: "Verified", executesCertification: false, metadataOnly: true, immutable: true }),
  Object.freeze({ id: "NEX-4:7/Criterion/PlatformCompleteness", name: "Platform Completeness Verified", category: "Completeness", sourceSubject: Subjects[15], declaredResult: "Verified", executesCertification: false, metadataOnly: true, immutable: true }),
] as const);
