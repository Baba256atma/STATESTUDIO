/**
 * EIL-5:7 — Integration Policy & Governance Certification Types.
 *
 * Readonly contracts and closed vocabularies for Integration Policy & Governance Certification.
 * Metadata-only. No certification engine.
 *
 * Ownership: owned exclusively by EIL-5:7.
 */

/** Certification status for EIL-5:7. */
export type PolicyGovernanceCertificationStatus = "Certification";

/** Immediate downstream readiness — Freeze only. */
export type PolicyGovernanceCertificationReadinessState = "ReadyForFreeze";

/** Closed criterion-key vocabulary. */
export type PolicyGovernanceCertificationCriterionKey =
  | "CanonicalIdentity"
  | "NamespaceIntegrity"
  | "VersionIntegrity"
  | "DependencyIntegrity"
  | "InventoryIntegrity"
  | "ValidationIntegrity"
  | "ManifestIntegrity"
  | "PlatformIntegrity"
  | "CompatibilityIntegrity"
  | "MetadataImmutability"
  | "DeterministicOrdering"
  | "ArchitecturalConsistency"
  | "AggregateEntryPointIntegrity"
  | "ComplianceIntegrity"
  | "ReleaseConsistency"
  | "ReadinessCompliance";

/** Closed criterion-category vocabulary. */
export type PolicyGovernanceCertificationCriterionCategory =
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
export type PolicyGovernanceCertificationGateKey =
  | "Identity"
  | "Namespace"
  | "Dependency"
  | "Inventory"
  | "Validation"
  | "Manifest"
  | "Platform"
  | "Compatibility"
  | "Architecture"
  | "Readiness"
  | "Compliance"
  | "Release";

/** Closed compliance-key vocabulary. */
export type PolicyGovernanceComplianceKey =
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
export type PolicyGovernanceCertificationSeverity =
  | "Error"
  | "Warning"
  | "Info";

/** Closed expected-outcome vocabulary. */
export type PolicyGovernanceCertificationExpectedOutcome =
  | "Present"
  | "Valid"
  | "Complete"
  | "Immutable"
  | "Deterministic"
  | "Compliant"
  | "Pass";

/** Closed ownership vocabulary. */
export type PolicyGovernanceCertificationOwnership =
  | "EIL-5:7"
  | "EIL-5 Integration Policy & Governance Certification";

/** Immutable Platform reference. */
export interface PolicyGovernancePlatformReference {
  readonly platformId: "EIL-5:6/IntegrationPolicyGovernancePlatform";
  readonly platformNamespace: "nexora.eil.integration-policy-governance.platform";
  readonly entryPoint: "integrationPolicyGovernancePlatform.ts";
  readonly sourcePath: string;
  readonly preservesCanonicalReference: true;
  readonly duplicatesPlatformValue: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Canonical certification identity. */
export interface IntegrationPolicyGovernanceCertificationIdentity {
  readonly phaseId: "EIL-5:7";
  readonly canonicalId: "EIL-5:7/IntegrationPolicyGovernanceCertification";
  readonly name: "Integration Policy & Governance Certification";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-policy-governance.certification";
  readonly layer: "EIL";
  readonly platform: "EIL-5";
  readonly phaseType: "Certification";
  readonly status: PolicyGovernanceCertificationStatus;
  readonly readiness: PolicyGovernanceCertificationReadinessState;
  readonly platformDependency: "EIL-5:6/IntegrationPolicyGovernancePlatform";
  readonly platformEntryPoint: "integrationPolicyGovernancePlatform.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Certification criterion. */
export interface IntegrationPolicyGovernanceCertificationCriterion {
  readonly criterionId: `EIL-5:7/Criterion/${PolicyGovernanceCertificationCriterionKey}`;
  readonly canonicalKey: PolicyGovernanceCertificationCriterionKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: PolicyGovernanceCertificationCriterionCategory;
  readonly expectedOutcome: PolicyGovernanceCertificationExpectedOutcome;
  readonly severity: PolicyGovernanceCertificationSeverity;
  readonly sourceReference: PolicyGovernancePlatformReference;
  readonly ownership: PolicyGovernanceCertificationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesCertification: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Certification gate. */
export interface IntegrationPolicyGovernanceCertificationGate {
  readonly gateId: `EIL-5:7/Gate/${PolicyGovernanceCertificationGateKey}`;
  readonly canonicalKey: PolicyGovernanceCertificationGateKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly passCondition: string;
  readonly sourceReference: PolicyGovernancePlatformReference;
  readonly ownership: PolicyGovernanceCertificationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesGate: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Compliance declaration. */
export interface IntegrationPolicyGovernanceComplianceDeclaration {
  readonly complianceId: `EIL-5:7/Compliance/${PolicyGovernanceComplianceKey}`;
  readonly canonicalKey: PolicyGovernanceComplianceKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: PolicyGovernanceCertificationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly runtimeEnforced: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Certification readiness. */
export interface IntegrationPolicyGovernanceCertificationReadiness {
  readonly readinessId: "EIL-5:7/Readiness";
  readonly certificationStatus: PolicyGovernanceCertificationStatus;
  readonly readinessState: PolicyGovernanceCertificationReadinessState;
  readonly completionSummary: string;
  readonly certificationSummary: string;
  readonly blockingConditions: readonly string[];
  readonly readinessDeclaration: string;
  readonly nextPhase: "EIL-5:8 — Integration Policy & Governance Freeze";
  readonly executesGates: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Certification inventory. */
export interface IntegrationPolicyGovernanceCertificationInventory {
  readonly inventoryId: "EIL-5:7/Inventory";
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
export interface IntegrationPolicyGovernanceCertificationCollections {
  readonly collectionsId: "EIL-5:7/Collections";
  readonly sourcePhase: "EIL-5:7";
  readonly criteria: readonly IntegrationPolicyGovernanceCertificationCriterion[];
  readonly gates: readonly IntegrationPolicyGovernanceCertificationGate[];
  readonly compliance: readonly IntegrationPolicyGovernanceComplianceDeclaration[];
  readonly criteriaCount: number;
  readonly gateCount: number;
  readonly complianceCount: number;
  readonly totalCertificationEntryCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Certification summary. */
export interface IntegrationPolicyGovernanceCertificationSummary {
  readonly certificationId: "EIL-5:7/IntegrationPolicyGovernanceCertification";
  readonly version: "1.0.0";
  readonly name: "Integration Policy & Governance Certification";
  readonly namespace: "nexora.eil.integration-policy-governance.certification";
  readonly status: PolicyGovernanceCertificationStatus;
  readonly readiness: PolicyGovernanceCertificationReadinessState;
  readonly platformId: "EIL-5:6/IntegrationPolicyGovernancePlatform";
  readonly criteriaCount: number;
  readonly gateCount: number;
  readonly complianceCount: number;
  readonly totalCertificationEntryCount: number;
  readonly nextPhase: "EIL-5:8 — Integration Policy & Governance Freeze";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
