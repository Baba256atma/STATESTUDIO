/**
 * EIL-1:7 — Integration Certification Types.
 *
 * Readonly contracts and closed vocabularies for Integration Certification.
 * Metadata-only. No certification engine.
 *
 * Ownership: owned exclusively by EIL-1:7.
 */

/** Certification status for EIL-1:7. */
export type IntegrationCertificationStatus = "Certification";

/** Immediate downstream readiness — Freeze only. */
export type IntegrationCertificationReadiness = "ReadyForFreeze";

/** Closed criterion-key vocabulary. */
export type IntegrationCertificationCriterionKey =
  | "CanonicalIdentity"
  | "NamespaceIntegrity"
  | "VersionIntegrity"
  | "DependencyIntegrity"
  | "InventoryIntegrity"
  | "ValidationCompleteness"
  | "ManifestCompleteness"
  | "PlatformCompleteness"
  | "CompatibilityIntegrity"
  | "MetadataImmutability"
  | "DeterministicOrdering"
  | "ArchitecturalConsistency"
  | "AggregateEntryPointIntegrity"
  | "MetadataOnlyCompliance"
  | "ReleaseConsistency"
  | "ReadinessCompliance";

/** Closed criterion-category vocabulary. */
export type IntegrationCertificationCriterionCategory =
  | "Identity"
  | "Namespace"
  | "Version"
  | "Dependency"
  | "Inventory"
  | "Validation"
  | "Manifest"
  | "Platform"
  | "Compatibility"
  | "Immutability"
  | "Determinism"
  | "Architecture"
  | "Export"
  | "Compliance"
  | "Release"
  | "Readiness";

/** Closed gate-key vocabulary. */
export type IntegrationCertificationGateKey =
  | "IdentityGate"
  | "NamespaceGate"
  | "DependencyGate"
  | "InventoryGate"
  | "ValidationGate"
  | "ManifestGate"
  | "PlatformGate"
  | "CompatibilityGate"
  | "ArchitectureGate"
  | "ReadinessGate"
  | "ComplianceGate"
  | "ReleaseGate";

/** Closed compliance-key vocabulary. */
export type IntegrationComplianceKey =
  | "MetadataOnlyCompliance"
  | "CanonicalNamingCompliance"
  | "DependencyCompliance"
  | "CompatibilityCompliance"
  | "InventoryCompliance"
  | "ImmutabilityCompliance"
  | "DeterministicOrderingCompliance"
  | "AggregateEntryCompliance"
  | "ArchitecturalCompliance"
  | "CertificationCompliance";

/** Closed severity vocabulary. */
export type IntegrationCertificationSeverity =
  | "Error"
  | "Warning"
  | "Info";

/** Closed expected-outcome vocabulary. */
export type IntegrationCertificationExpectedOutcome =
  | "Present"
  | "Valid"
  | "Complete"
  | "Immutable"
  | "Deterministic"
  | "Compliant"
  | "Pass";

/** Closed ownership vocabulary. */
export type IntegrationCertificationOwnership =
  | "EIL-1:7"
  | "EIL-1 Integration Certification";

/** Immutable platform reference. */
export interface IntegrationPlatformReference {
  readonly platformId: "EIL-1:6/IntegrationPlatform";
  readonly platformNamespace: "nexora.eil.integration.platform";
  readonly entryPoint: "integrationPlatform.ts";
  readonly sourcePath: string;
  readonly preservesCanonicalReference: true;
  readonly duplicatesPlatformValue: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Canonical certification identity. */
export interface IntegrationCertificationIdentityDescriptor {
  readonly phaseId: "EIL-1:7";
  readonly canonicalId: "EIL-1:7/IntegrationCertification";
  readonly name: "Integration Certification";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration.certification";
  readonly layer: "EIL";
  readonly platform: "EIL-1";
  readonly phaseType: "Certification";
  readonly status: IntegrationCertificationStatus;
  readonly readiness: IntegrationCertificationReadiness;
  readonly platformDependency: "EIL-1:6/IntegrationPlatform";
  readonly platformEntryPoint: "integrationPlatform.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Certification criterion. */
export interface IntegrationCertificationCriterion {
  readonly criterionId: `EIL-1:7/Criterion/${IntegrationCertificationCriterionKey}`;
  readonly canonicalKey: IntegrationCertificationCriterionKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: IntegrationCertificationCriterionCategory;
  readonly expectedOutcome: IntegrationCertificationExpectedOutcome;
  readonly severity: IntegrationCertificationSeverity;
  readonly sourceReference: IntegrationPlatformReference;
  readonly ownership: IntegrationCertificationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesCertification: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Certification gate. */
export interface IntegrationCertificationGate {
  readonly gateId: `EIL-1:7/Gate/${IntegrationCertificationGateKey}`;
  readonly canonicalKey: IntegrationCertificationGateKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly passCondition: string;
  readonly sourceReference: IntegrationPlatformReference;
  readonly ownership: IntegrationCertificationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesGate: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Compliance declaration. */
export interface IntegrationComplianceDeclaration {
  readonly complianceId: `EIL-1:7/Compliance/${IntegrationComplianceKey}`;
  readonly canonicalKey: IntegrationComplianceKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: IntegrationCertificationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly runtimeEnforced: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Certification readiness. */
export interface IntegrationCertificationReadinessDescriptor {
  readonly readinessId: "EIL-1:7/Readiness";
  readonly certificationStatus: IntegrationCertificationStatus;
  readonly readinessState: IntegrationCertificationReadiness;
  readonly completionSummary: string;
  readonly certificationSummary: string;
  readonly blockingConditions: readonly string[];
  readonly readinessDeclaration: string;
  readonly nextPhase: "EIL-1:8 — Integration Freeze";
  readonly executesGates: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Certification inventory. */
export interface IntegrationCertificationInventory {
  readonly inventoryId: "EIL-1:7/Inventory";
  readonly criteriaCount: number;
  readonly gateCount: number;
  readonly complianceCount: number;
  readonly totalCertificationEntryCount: number;
  readonly countsDerivedFromCollections: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Certification collections. */
export interface IntegrationCertificationCollectionsDescriptor {
  readonly collectionsId: "EIL-1:7/Collections";
  readonly sourcePhase: "EIL-1:7";
  readonly criteria: readonly IntegrationCertificationCriterion[];
  readonly gates: readonly IntegrationCertificationGate[];
  readonly compliance: readonly IntegrationComplianceDeclaration[];
  readonly criteriaCount: number;
  readonly gateCount: number;
  readonly complianceCount: number;
  readonly totalCertificationEntryCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Certification summary. */
export interface IntegrationCertificationSummaryDescriptor {
  readonly certificationId: "EIL-1:7/IntegrationCertification";
  readonly version: "1.0.0";
  readonly name: "Integration Certification";
  readonly namespace: "nexora.eil.integration.certification";
  readonly status: IntegrationCertificationStatus;
  readonly readiness: IntegrationCertificationReadiness;
  readonly platformId: "EIL-1:6/IntegrationPlatform";
  readonly criteriaCount: number;
  readonly gateCount: number;
  readonly complianceCount: number;
  readonly totalCertificationEntryCount: number;
  readonly nextPhase: "EIL-1:8 — Integration Freeze";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
