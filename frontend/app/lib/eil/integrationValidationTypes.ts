/**
 * EIL-1:4 — Integration Validation Types.
 *
 * Readonly contracts and closed vocabularies for Integration Validation.
 * Metadata-only. No validation engine.
 *
 * Ownership: owned exclusively by EIL-1:4.
 */

/** Validation status for EIL-1:4. */
export type IntegrationValidationStatus = "Validation";

/** Immediate downstream readiness — Manifest only. */
export type IntegrationValidationReadiness = "ReadyForManifest";

/** Closed validation-category vocabulary. */
export type IntegrationValidationCategoryId =
  | "Identity"
  | "Namespace"
  | "Dependency"
  | "Registry"
  | "Model"
  | "Contract"
  | "Capability"
  | "Responsibility"
  | "Topology"
  | "Lifecycle"
  | "Compatibility"
  | "Boundary"
  | "Inventory"
  | "Export"
  | "Immutability"
  | "Determinism";

/** Closed severity vocabulary — descriptive only. */
export type IntegrationValidationSeverity =
  | "Error"
  | "Warning"
  | "Info";

/** Closed finding-state vocabulary — descriptive only. */
export type IntegrationValidationFindingState =
  | "Pass"
  | "Warning"
  | "Error"
  | "Skipped"
  | "NotApplicable";

/** Closed expected-outcome vocabulary. */
export type IntegrationValidationExpectedOutcome =
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
export type IntegrationValidationOwnership =
  | "EIL-1:4"
  | "EIL-1 Integration Validation";

/** Immutable model reference — never duplicates model values. */
export interface IntegrationModelReference {
  readonly modelId: "EIL-1:3/IntegrationModel";
  readonly modelNamespace: "nexora.eil.integration.model";
  readonly entryPoint: "integrationModel.ts";
  readonly sourcePath: string;
  readonly preservesCanonicalReference: true;
  readonly duplicatesModelValue: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable validation category. */
export interface IntegrationValidationCategory {
  readonly categoryId: `EIL-1:4/Category/${IntegrationValidationCategoryId}`;
  readonly key: IntegrationValidationCategoryId;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: IntegrationValidationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable validation rule. */
export interface IntegrationValidationRule {
  readonly ruleId: `EIL-1:4/Rule/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly category: IntegrationValidationCategoryId;
  readonly description: string;
  readonly severity: IntegrationValidationSeverity;
  readonly expectedOutcome: IntegrationValidationExpectedOutcome;
  readonly sourceReference: IntegrationModelReference;
  readonly ownership: IntegrationValidationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable finding-state declaration. */
export interface IntegrationValidationFinding {
  readonly findingId: `EIL-1:4/Finding/${IntegrationValidationFindingState}`;
  readonly state: IntegrationValidationFindingState;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: IntegrationValidationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable readiness metadata. */
export interface IntegrationValidationReadinessDescriptor {
  readonly readinessId: "EIL-1:4/Readiness";
  readonly validationStatus: IntegrationValidationStatus;
  readonly readinessState: IntegrationValidationReadiness;
  readonly completionCriteria: readonly string[];
  readonly blockingCriteria: readonly string[];
  readonly readinessSummary: string;
  readonly nextPhase: "EIL-1:5 — Integration Manifest";
  readonly executesGates: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Validation result vocabulary envelope (metadata only). */
export interface IntegrationValidationResult {
  readonly resultId: "EIL-1:4/Result/Declared";
  readonly declaredFindingStates: readonly IntegrationValidationFindingState[];
  readonly runtimeExecuted: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Validation inventory. */
export interface IntegrationValidationInventory {
  readonly inventoryId: "EIL-1:4/Inventory";
  readonly validationRuleCount: number;
  readonly categoryCount: number;
  readonly findingStateCount: number;
  readonly totalValidationEntryCount: number;
  readonly countsDerivedFromCollections: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Canonical validation identity. */
export interface IntegrationValidationIdentityDescriptor {
  readonly phaseId: "EIL-1:4";
  readonly canonicalId: "EIL-1:4/IntegrationValidation";
  readonly name: "Integration Validation";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration.validation";
  readonly layer: "EIL";
  readonly platform: "EIL-1";
  readonly phaseType: "Validation";
  readonly status: IntegrationValidationStatus;
  readonly readiness: IntegrationValidationReadiness;
  readonly modelDependency: "EIL-1:3/IntegrationModel";
  readonly modelEntryPoint: "integrationModel.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Aggregate validation summary. */
export interface IntegrationValidationSummaryDescriptor {
  readonly validationId: "EIL-1:4/IntegrationValidation";
  readonly version: "1.0.0";
  readonly name: "Integration Validation";
  readonly namespace: "nexora.eil.integration.validation";
  readonly status: IntegrationValidationStatus;
  readonly readiness: IntegrationValidationReadiness;
  readonly modelId: "EIL-1:3/IntegrationModel";
  readonly validationRuleCount: number;
  readonly categoryCount: number;
  readonly findingStateCount: number;
  readonly totalValidationEntryCount: number;
  readonly nextPhase: "EIL-1:5 — Integration Manifest";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
