/**
 * EIL-3:7 — Integration Routing Certification Types.
 *
 * Readonly contracts and closed vocabularies for Integration Routing Certification.
 * Metadata-only. No certification engine.
 *
 * Ownership: owned exclusively by EIL-3:7.
 */

/** Certification status for EIL-3:7. */
export type RoutingCertificationStatus = "Certification";

/** Immediate downstream readiness — Freeze only. */
export type RoutingCertificationReadinessState = "ReadyForFreeze";

/** Closed criterion-key vocabulary. */
export type RoutingCertificationCriterionKey =
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
export type RoutingCertificationCriterionCategory =
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
export type RoutingCertificationGateKey =
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
export type RoutingComplianceKey =
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
export type RoutingCertificationSeverity = "Error" | "Warning" | "Info";

/** Closed expected-outcome vocabulary. */
export type RoutingCertificationExpectedOutcome =
  | "Present"
  | "Valid"
  | "Complete"
  | "Immutable"
  | "Deterministic"
  | "Compliant"
  | "Pass";

/** Closed ownership vocabulary. */
export type RoutingCertificationOwnership =
  | "EIL-3:7"
  | "EIL-3 Integration Routing Certification";

/** Immutable Platform reference. */
export interface RoutingPlatformReference {
  readonly platformId: "EIL-3:6/IntegrationRoutingPlatform";
  readonly platformNamespace: "nexora.eil.integration-routing.platform";
  readonly entryPoint: "integrationRoutingPlatform.ts";
  readonly sourcePath: string;
  readonly preservesCanonicalReference: true;
  readonly duplicatesPlatformValue: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Canonical certification identity. */
export interface RoutingCertificationIdentity {
  readonly phaseId: "EIL-3:7";
  readonly canonicalId: "EIL-3:7/IntegrationRoutingCertification";
  readonly name: "Integration Routing Certification";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-routing.certification";
  readonly layer: "EIL";
  readonly platform: "EIL-3";
  readonly phaseType: "Certification";
  readonly status: RoutingCertificationStatus;
  readonly readiness: RoutingCertificationReadinessState;
  readonly platformDependency: "EIL-3:6/IntegrationRoutingPlatform";
  readonly platformEntryPoint: "integrationRoutingPlatform.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Certification criterion. */
export interface RoutingCertificationCriterion {
  readonly criterionId: `EIL-3:7/Criterion/${RoutingCertificationCriterionKey}`;
  readonly canonicalKey: RoutingCertificationCriterionKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: RoutingCertificationCriterionCategory;
  readonly expectedOutcome: RoutingCertificationExpectedOutcome;
  readonly severity: RoutingCertificationSeverity;
  readonly sourceReference: RoutingPlatformReference;
  readonly ownership: RoutingCertificationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesCertification: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Certification gate. */
export interface RoutingCertificationGate {
  readonly gateId: `EIL-3:7/Gate/${RoutingCertificationGateKey}`;
  readonly canonicalKey: RoutingCertificationGateKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly passCondition: string;
  readonly sourceReference: RoutingPlatformReference;
  readonly ownership: RoutingCertificationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesGate: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Compliance declaration. */
export interface RoutingComplianceDeclaration {
  readonly complianceId: `EIL-3:7/Compliance/${RoutingComplianceKey}`;
  readonly canonicalKey: RoutingComplianceKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: RoutingCertificationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly runtimeEnforced: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Certification readiness. */
export interface RoutingCertificationReadiness {
  readonly readinessId: "EIL-3:7/Readiness";
  readonly certificationStatus: RoutingCertificationStatus;
  readonly readinessState: RoutingCertificationReadinessState;
  readonly completionSummary: string;
  readonly certificationSummary: string;
  readonly blockingConditions: readonly string[];
  readonly readinessDeclaration: string;
  readonly nextPhase: "EIL-3:8 — Integration Routing Freeze";
  readonly executesGates: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Certification inventory. */
export interface RoutingCertificationInventory {
  readonly inventoryId: "EIL-3:7/Inventory";
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
export interface RoutingCertificationCollections {
  readonly collectionsId: "EIL-3:7/Collections";
  readonly sourcePhase: "EIL-3:7";
  readonly criteria: readonly RoutingCertificationCriterion[];
  readonly gates: readonly RoutingCertificationGate[];
  readonly compliance: readonly RoutingComplianceDeclaration[];
  readonly criteriaCount: number;
  readonly gateCount: number;
  readonly complianceCount: number;
  readonly totalCertificationEntryCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Certification summary. */
export interface RoutingCertificationSummary {
  readonly certificationId: "EIL-3:7/IntegrationRoutingCertification";
  readonly version: "1.0.0";
  readonly name: "Integration Routing Certification";
  readonly namespace: "nexora.eil.integration-routing.certification";
  readonly status: RoutingCertificationStatus;
  readonly readiness: RoutingCertificationReadinessState;
  readonly platformId: "EIL-3:6/IntegrationRoutingPlatform";
  readonly criteriaCount: number;
  readonly gateCount: number;
  readonly complianceCount: number;
  readonly totalCertificationEntryCount: number;
  readonly nextPhase: "EIL-3:8 — Integration Routing Freeze";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
