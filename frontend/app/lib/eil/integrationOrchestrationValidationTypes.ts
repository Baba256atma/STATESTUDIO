/**
 * EIL-4:4 — Integration Orchestration Validation Types.
 *
 * Readonly contracts and closed vocabularies for Integration Orchestration Validation.
 * Metadata-only. No validation engine.
 *
 * Ownership: owned exclusively by EIL-4:4.
 */

/** Validation status for EIL-4:4. */
export type OrchestrationValidationStatus = "Validation";

/** Immediate downstream readiness — Manifest only. */
export type OrchestrationValidationReadinessState = "ReadyForManifest";

/** Closed validation-category vocabulary. */
export type OrchestrationValidationCategoryId =
  | "Identity"
  | "Namespace"
  | "Registry"
  | "DomainModel"
  | "Relationship"
  | "Topology"
  | "Lifecycle"
  | "Dependency"
  | "Compatibility"
  | "Inventory"
  | "Export"
  | "Immutability"
  | "Determinism"
  | "Readiness"
  | "Architecture"
  | "Documentation";

/** Closed severity vocabulary — descriptive only. */
export type OrchestrationValidationSeverity = "Error" | "Warning" | "Info";

/** Closed finding-state vocabulary — descriptive only. */
export type OrchestrationValidationFindingState =
  | "Pass"
  | "Warning"
  | "Error"
  | "Skipped"
  | "NotApplicable";

/** Closed expected-outcome vocabulary. */
export type OrchestrationValidationExpectedOutcome =
  | "Present"
  | "Valid"
  | "Complete"
  | "Unique"
  | "Deterministic"
  | "Immutable"
  | "Absent"
  | "Derived"
  | "Pass";

/** Closed ownership vocabulary. */
export type OrchestrationValidationOwnership =
  | "EIL-4:4"
  | "EIL-4 Integration Orchestration Validation";

/** Immutable model reference — never duplicates model values. */
export interface OrchestrationModelReference {
  readonly modelId: "EIL-4:3/IntegrationOrchestrationModel";
  readonly modelNamespace: "nexora.eil.integration-orchestration.model";
  readonly entryPoint: "integrationOrchestrationModel.ts";
  readonly sourcePath: string;
  readonly preservesCanonicalReference: true;
  readonly duplicatesModelValue: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Canonical validation identity. */
export interface IntegrationOrchestrationValidationIdentity {
  readonly phaseId: "EIL-4:4";
  readonly canonicalId: "EIL-4:4/IntegrationOrchestrationValidation";
  readonly name: "Integration Orchestration Validation";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-orchestration.validation";
  readonly layer: "EIL";
  readonly platform: "EIL-4";
  readonly phaseType: "Validation";
  readonly status: OrchestrationValidationStatus;
  readonly readiness: OrchestrationValidationReadinessState;
  readonly modelDependency: "EIL-4:3/IntegrationOrchestrationModel";
  readonly modelEntryPoint: "integrationOrchestrationModel.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable validation category. */
export interface IntegrationOrchestrationValidationCategory {
  readonly categoryId: `EIL-4:4/Category/${OrchestrationValidationCategoryId}`;
  readonly key: OrchestrationValidationCategoryId;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: OrchestrationValidationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable validation rule. */
export interface IntegrationOrchestrationValidationRule {
  readonly ruleId: `EIL-4:4/Rule/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly category: OrchestrationValidationCategoryId;
  readonly description: string;
  readonly severity: OrchestrationValidationSeverity;
  readonly expectedOutcome: OrchestrationValidationExpectedOutcome;
  readonly sourceReference: OrchestrationModelReference;
  readonly ownership: OrchestrationValidationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable finding-state declaration. */
export interface IntegrationOrchestrationValidationFinding {
  readonly findingId: `EIL-4:4/Finding/${OrchestrationValidationFindingState}`;
  readonly state: OrchestrationValidationFindingState;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: OrchestrationValidationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable readiness metadata. */
export interface IntegrationOrchestrationValidationReadiness {
  readonly readinessId: "EIL-4:4/Readiness";
  readonly validationStatus: OrchestrationValidationStatus;
  readonly readinessState: OrchestrationValidationReadinessState;
  readonly upstreamDependency: "EIL-4:3/IntegrationOrchestrationModel";
  readonly completionCriteria: readonly string[];
  readonly blockingCriteria: readonly string[];
  readonly readinessSummary: string;
  readonly validationDeclaration: string;
  readonly nextPhase: "EIL-4:5 — Integration Orchestration Manifest";
  readonly executesGates: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Aggregate validation collections. */
export interface IntegrationOrchestrationValidationCollections {
  readonly collectionsId: "EIL-4:4/Collections";
  readonly sourcePhase: "EIL-4:4";
  readonly rules: readonly IntegrationOrchestrationValidationRule[];
  readonly categories: readonly IntegrationOrchestrationValidationCategory[];
  readonly findings: readonly IntegrationOrchestrationValidationFinding[];
  readonly ruleCount: number;
  readonly categoryCount: number;
  readonly findingCount: number;
  readonly totalValidationEntryCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Validation inventory. */
export interface IntegrationOrchestrationValidationInventory {
  readonly inventoryId: "EIL-4:4/Inventory";
  readonly ruleCount: number;
  readonly categoryCount: number;
  readonly findingCount: number;
  readonly totalValidationEntryCount: number;
  readonly countsDerivedFromCollections: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Aggregate validation summary. */
export interface IntegrationOrchestrationValidationSummary {
  readonly validationId: "EIL-4:4/IntegrationOrchestrationValidation";
  readonly version: "1.0.0";
  readonly name: "Integration Orchestration Validation";
  readonly namespace: "nexora.eil.integration-orchestration.validation";
  readonly status: OrchestrationValidationStatus;
  readonly readiness: OrchestrationValidationReadinessState;
  readonly modelId: "EIL-4:3/IntegrationOrchestrationModel";
  readonly ruleCount: number;
  readonly categoryCount: number;
  readonly findingCount: number;
  readonly totalValidationEntryCount: number;
  readonly nextPhase: "EIL-4:5 — Integration Orchestration Manifest";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
