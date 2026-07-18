/**
 * DKL-9:4 — Data Knowledge Suite Validation Types.
 *
 * Categories, severities, outcomes, rule/gate/report contracts.
 * Metadata-only. No enforcement or runtime validation execution.
 *
 * Ownership: owned exclusively by DKL-9:4.
 */

export type DataKnowledgeSuiteValidationStatus = "ValidationDefined";

export type DataKnowledgeSuiteValidationReadiness = "ReadyForManifest";

export type DataKnowledgeSuiteValidationSeverity =
  | "Info"
  | "Warning"
  | "Error"
  | "Critical";

export type DataKnowledgeSuiteValidationOutcome =
  | "Pass"
  | "Fail"
  | "Warning"
  | "NotApplicable";

export type DataKnowledgeSuiteValidationCategory =
  | "Identity"
  | "Dependency"
  | "Composition"
  | "Capability"
  | "Ordering"
  | "ReferenceIntegrity"
  | "Platform"
  | "ApiRegistry"
  | "Ownership"
  | "Boundaries"
  | "Inventory"
  | "Readiness";

export type DataKnowledgeSuiteValidationGateName =
  | "IdentityGate"
  | "DependencyGate"
  | "CompositionGate"
  | "CapabilityCatalogGate"
  | "ReferenceIntegrityGate"
  | "PlatformGate"
  | "ApiRegistryGate"
  | "OwnershipGate"
  | "BoundaryGate"
  | "InventoryGate"
  | "ReadinessGate"
  | "CompatibilityGate"
  | "DeterminismGate"
  | "ImmutabilityGate"
  | "CanonicalInventoryGate"
  | "ManifestReadinessGate";

export interface DataKnowledgeSuiteValidationCategoryDescriptor {
  readonly categoryId: string;
  readonly category: DataKnowledgeSuiteValidationCategory;
  readonly description: string;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DataKnowledgeSuiteValidationSeverityDescriptor {
  readonly severityId: string;
  readonly severity: DataKnowledgeSuiteValidationSeverity;
  readonly description: string;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DataKnowledgeSuiteValidationOutcomeDescriptor {
  readonly outcomeId: string;
  readonly outcome: DataKnowledgeSuiteValidationOutcome;
  readonly description: string;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DataKnowledgeSuiteValidationRule {
  readonly id: string;
  readonly name: string;
  readonly category: DataKnowledgeSuiteValidationCategory;
  readonly severity: DataKnowledgeSuiteValidationSeverity;
  readonly required: true;
  readonly description: string;
  readonly sourceReference: string;
  readonly status: "Active";
  readonly outcome: DataKnowledgeSuiteValidationOutcome;
  readonly expected: string;
  readonly actual: string;
  readonly readinessImpact: "Blocking" | "NonBlocking" | "None";
  readonly sourcePhase: "DKL-9:4";
  readonly deterministic: true;
  readonly runtimeBehavior: "None";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

export interface DataKnowledgeSuiteValidationGate {
  readonly id: string;
  readonly name: DataKnowledgeSuiteValidationGateName;
  readonly requiredRuleIds: readonly string[];
  readonly status: "Active";
  readonly outcome: DataKnowledgeSuiteValidationOutcome;
  readonly blocking: boolean;
  readonly readinessResult?: "ReadyForManifest";
  readonly sourcePhase: "DKL-9:4";
  readonly executesExternalBehavior: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

export interface DataKnowledgeSuiteValidationFinding {
  readonly findingId: string;
  readonly ruleId: string;
  readonly category: DataKnowledgeSuiteValidationCategory;
  readonly severity: DataKnowledgeSuiteValidationSeverity;
  readonly outcome: DataKnowledgeSuiteValidationOutcome;
  readonly message: string;
  readonly expected: string;
  readonly actual: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DataKnowledgeSuiteValidationReport {
  readonly reportId: string;
  readonly validationId: string;
  readonly targetReference: string;
  readonly ruleCount: number;
  readonly passedRuleCount: number;
  readonly failedRuleCount: number;
  readonly warningRuleCount: number;
  readonly notApplicableRuleCount: number;
  readonly findings: readonly DataKnowledgeSuiteValidationFinding[];
  readonly outcome: DataKnowledgeSuiteValidationOutcome;
  readonly readiness: DataKnowledgeSuiteValidationReadiness;
  readonly generatesTimestamps: false;
  readonly persists: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DataKnowledgeSuiteValidationSummary {
  readonly id: string;
  readonly version: string;
  readonly namespace: string;
  readonly status: DataKnowledgeSuiteValidationStatus;
  readonly validationOutcome: DataKnowledgeSuiteValidationOutcome;
  readonly readiness: DataKnowledgeSuiteValidationReadiness;
  readonly upstreamDependency: string;
  readonly ruleCount: number;
  readonly gateCount: number;
  readonly categoryCount: number;
  readonly passedRuleCount: number;
  readonly failedRuleCount: number;
  readonly capabilityModelCount: number;
  readonly modelKindCount: number;
  readonly publicApiInventoryTotal: number;
  readonly runtimeBehavior: "None";
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
