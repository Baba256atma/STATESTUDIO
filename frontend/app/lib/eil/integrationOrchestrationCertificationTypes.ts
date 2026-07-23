/**
 * EIL-4:7 — Integration Orchestration Certification Types.
 *
 * Readonly contracts and closed vocabularies for Integration Orchestration Certification.
 * Metadata-only. No certification engine.
 *
 * Ownership: owned exclusively by EIL-4:7.
 */

/** Certification status for EIL-4:7. */
export type OrchestrationCertificationStatus = "Certification";

/** Immediate downstream readiness — Freeze only. */
export type OrchestrationCertificationReadinessState = "ReadyForFreeze";

/** Closed criterion-key vocabulary. */
export type OrchestrationCertificationCriterionKey =
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
export type OrchestrationCertificationCriterionCategory =
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
export type OrchestrationCertificationGateKey =
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
export type OrchestrationComplianceKey =
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
export type OrchestrationCertificationSeverity = "Error" | "Warning" | "Info";

/** Closed expected-outcome vocabulary. */
export type OrchestrationCertificationExpectedOutcome =
  | "Present"
  | "Valid"
  | "Complete"
  | "Immutable"
  | "Deterministic"
  | "Compliant"
  | "Pass";

/** Closed ownership vocabulary. */
export type OrchestrationCertificationOwnership =
  | "EIL-4:7"
  | "EIL-4 Integration Orchestration Certification";

/** Immutable Platform reference. */
export interface OrchestrationPlatformReference {
  readonly platformId: "EIL-4:6/IntegrationOrchestrationPlatform";
  readonly platformNamespace: "nexora.eil.integration-orchestration.platform";
  readonly entryPoint: "integrationOrchestrationPlatform.ts";
  readonly sourcePath: string;
  readonly preservesCanonicalReference: true;
  readonly duplicatesPlatformValue: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Canonical certification identity. */
export interface IntegrationOrchestrationCertificationIdentity {
  readonly phaseId: "EIL-4:7";
  readonly canonicalId: "EIL-4:7/IntegrationOrchestrationCertification";
  readonly name: "Integration Orchestration Certification";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-orchestration.certification";
  readonly layer: "EIL";
  readonly platform: "EIL-4";
  readonly phaseType: "Certification";
  readonly status: OrchestrationCertificationStatus;
  readonly readiness: OrchestrationCertificationReadinessState;
  readonly platformDependency: "EIL-4:6/IntegrationOrchestrationPlatform";
  readonly platformEntryPoint: "integrationOrchestrationPlatform.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Certification criterion. */
export interface IntegrationOrchestrationCertificationCriterion {
  readonly criterionId: `EIL-4:7/Criterion/${OrchestrationCertificationCriterionKey}`;
  readonly canonicalKey: OrchestrationCertificationCriterionKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: OrchestrationCertificationCriterionCategory;
  readonly expectedOutcome: OrchestrationCertificationExpectedOutcome;
  readonly severity: OrchestrationCertificationSeverity;
  readonly sourceReference: OrchestrationPlatformReference;
  readonly ownership: OrchestrationCertificationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesCertification: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Certification gate. */
export interface IntegrationOrchestrationCertificationGate {
  readonly gateId: `EIL-4:7/Gate/${OrchestrationCertificationGateKey}`;
  readonly canonicalKey: OrchestrationCertificationGateKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly passCondition: string;
  readonly sourceReference: OrchestrationPlatformReference;
  readonly ownership: OrchestrationCertificationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesGate: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Compliance declaration. */
export interface IntegrationOrchestrationComplianceDeclaration {
  readonly complianceId: `EIL-4:7/Compliance/${OrchestrationComplianceKey}`;
  readonly canonicalKey: OrchestrationComplianceKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: OrchestrationCertificationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly runtimeEnforced: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Certification readiness. */
export interface IntegrationOrchestrationCertificationReadiness {
  readonly readinessId: "EIL-4:7/Readiness";
  readonly certificationStatus: OrchestrationCertificationStatus;
  readonly readinessState: OrchestrationCertificationReadinessState;
  readonly completionSummary: string;
  readonly certificationSummary: string;
  readonly blockingConditions: readonly string[];
  readonly readinessDeclaration: string;
  readonly nextPhase: "EIL-4:8 — Integration Orchestration Freeze";
  readonly executesGates: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Certification inventory. */
export interface IntegrationOrchestrationCertificationInventory {
  readonly inventoryId: "EIL-4:7/Inventory";
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
export interface IntegrationOrchestrationCertificationCollections {
  readonly collectionsId: "EIL-4:7/Collections";
  readonly sourcePhase: "EIL-4:7";
  readonly criteria: readonly IntegrationOrchestrationCertificationCriterion[];
  readonly gates: readonly IntegrationOrchestrationCertificationGate[];
  readonly compliance: readonly IntegrationOrchestrationComplianceDeclaration[];
  readonly criteriaCount: number;
  readonly gateCount: number;
  readonly complianceCount: number;
  readonly totalCertificationEntryCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Certification summary. */
export interface IntegrationOrchestrationCertificationSummary {
  readonly certificationId: "EIL-4:7/IntegrationOrchestrationCertification";
  readonly version: "1.0.0";
  readonly name: "Integration Orchestration Certification";
  readonly namespace: "nexora.eil.integration-orchestration.certification";
  readonly status: OrchestrationCertificationStatus;
  readonly readiness: OrchestrationCertificationReadinessState;
  readonly platformId: "EIL-4:6/IntegrationOrchestrationPlatform";
  readonly criteriaCount: number;
  readonly gateCount: number;
  readonly complianceCount: number;
  readonly totalCertificationEntryCount: number;
  readonly nextPhase: "EIL-4:8 — Integration Orchestration Freeze";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
