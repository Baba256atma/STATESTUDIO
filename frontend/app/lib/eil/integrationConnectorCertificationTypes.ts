/**
 * EIL-2:7 — Integration Connector Certification Types.
 *
 * Readonly contracts and closed vocabularies for Integration Connector Certification.
 * Metadata-only. No certification engine.
 *
 * Ownership: owned exclusively by EIL-2:7.
 */

/** Certification status for EIL-2:7. */
export type IntegrationConnectorCertificationStatus = "Certification";

/** Immediate downstream readiness — Freeze only. */
export type IntegrationConnectorCertificationReadiness = "ReadyForFreeze";

/** Closed criterion-key vocabulary. */
export type IntegrationConnectorCertificationCriterionKey =
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
export type IntegrationConnectorCertificationCriterionCategory =
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
export type IntegrationConnectorCertificationGateKey =
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
export type IntegrationConnectorComplianceKey =
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
export type IntegrationConnectorCertificationSeverity =
  | "Error"
  | "Warning"
  | "Info";

/** Closed expected-outcome vocabulary. */
export type IntegrationConnectorCertificationExpectedOutcome =
  | "Present"
  | "Valid"
  | "Complete"
  | "Immutable"
  | "Deterministic"
  | "Compliant"
  | "Pass";

/** Closed ownership vocabulary. */
export type IntegrationConnectorCertificationOwnership =
  | "EIL-2:7"
  | "EIL-2 Integration Connector Certification";

/** Immutable Platform reference. */
export interface IntegrationConnectorPlatformReference {
  readonly platformId: "EIL-2:6/IntegrationConnectorPlatform";
  readonly platformNamespace: "nexora.eil.integration-connector.platform";
  readonly entryPoint: "integrationConnectorPlatform.ts";
  readonly sourcePath: string;
  readonly preservesCanonicalReference: true;
  readonly duplicatesPlatformValue: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Canonical certification identity. */
export interface IntegrationConnectorCertificationIdentityDescriptor {
  readonly phaseId: "EIL-2:7";
  readonly canonicalId: "EIL-2:7/IntegrationConnectorCertification";
  readonly name: "Integration Connector Certification";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-connector.certification";
  readonly layer: "EIL";
  readonly platform: "EIL-2";
  readonly phaseType: "Certification";
  readonly status: IntegrationConnectorCertificationStatus;
  readonly readiness: IntegrationConnectorCertificationReadiness;
  readonly platformDependency: "EIL-2:6/IntegrationConnectorPlatform";
  readonly platformEntryPoint: "integrationConnectorPlatform.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Certification criterion. */
export interface IntegrationConnectorCertificationCriterion {
  readonly criterionId: `EIL-2:7/Criterion/${IntegrationConnectorCertificationCriterionKey}`;
  readonly canonicalKey: IntegrationConnectorCertificationCriterionKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: IntegrationConnectorCertificationCriterionCategory;
  readonly expectedOutcome: IntegrationConnectorCertificationExpectedOutcome;
  readonly severity: IntegrationConnectorCertificationSeverity;
  readonly sourceReference: IntegrationConnectorPlatformReference;
  readonly ownership: IntegrationConnectorCertificationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesCertification: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Certification gate. */
export interface IntegrationConnectorCertificationGate {
  readonly gateId: `EIL-2:7/Gate/${IntegrationConnectorCertificationGateKey}`;
  readonly canonicalKey: IntegrationConnectorCertificationGateKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly passCondition: string;
  readonly sourceReference: IntegrationConnectorPlatformReference;
  readonly ownership: IntegrationConnectorCertificationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesGate: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Compliance declaration. */
export interface IntegrationConnectorComplianceDeclaration {
  readonly complianceId: `EIL-2:7/Compliance/${IntegrationConnectorComplianceKey}`;
  readonly canonicalKey: IntegrationConnectorComplianceKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: IntegrationConnectorCertificationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly runtimeEnforced: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Certification readiness. */
export interface IntegrationConnectorCertificationReadinessDescriptor {
  readonly readinessId: "EIL-2:7/Readiness";
  readonly certificationStatus: IntegrationConnectorCertificationStatus;
  readonly readinessState: IntegrationConnectorCertificationReadiness;
  readonly completionSummary: string;
  readonly certificationSummary: string;
  readonly blockingConditions: readonly string[];
  readonly readinessDeclaration: string;
  readonly nextPhase: "EIL-2:8 — Integration Connector Freeze";
  readonly executesGates: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Certification inventory. */
export interface IntegrationConnectorCertificationInventory {
  readonly inventoryId: "EIL-2:7/Inventory";
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
export interface IntegrationConnectorCertificationCollectionsDescriptor {
  readonly collectionsId: "EIL-2:7/Collections";
  readonly sourcePhase: "EIL-2:7";
  readonly criteria: readonly IntegrationConnectorCertificationCriterion[];
  readonly gates: readonly IntegrationConnectorCertificationGate[];
  readonly compliance: readonly IntegrationConnectorComplianceDeclaration[];
  readonly criteriaCount: number;
  readonly gateCount: number;
  readonly complianceCount: number;
  readonly totalCertificationEntryCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Certification summary. */
export interface IntegrationConnectorCertificationSummaryDescriptor {
  readonly certificationId: "EIL-2:7/IntegrationConnectorCertification";
  readonly version: "1.0.0";
  readonly name: "Integration Connector Certification";
  readonly namespace: "nexora.eil.integration-connector.certification";
  readonly status: IntegrationConnectorCertificationStatus;
  readonly readiness: IntegrationConnectorCertificationReadiness;
  readonly platformId: "EIL-2:6/IntegrationConnectorPlatform";
  readonly criteriaCount: number;
  readonly gateCount: number;
  readonly complianceCount: number;
  readonly totalCertificationEntryCount: number;
  readonly nextPhase: "EIL-2:8 — Integration Connector Freeze";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
