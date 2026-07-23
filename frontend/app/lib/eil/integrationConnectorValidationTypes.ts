/**
 * EIL-2:4 — Integration Connector Validation Types.
 *
 * Readonly contracts and closed vocabularies for Integration Connector Validation.
 * Metadata-only. No validation engine.
 *
 * Ownership: owned exclusively by EIL-2:4.
 */

/** Validation status for EIL-2:4. */
export type IntegrationConnectorValidationStatus = "Validation";

/** Immediate downstream readiness — Manifest only. */
export type IntegrationConnectorValidationReadiness = "ReadyForManifest";

/** Closed validation-category vocabulary. */
export type IntegrationConnectorValidationCategoryId =
  | "Identity"
  | "Namespace"
  | "Registry"
  | "DomainModel"
  | "EndpointModel"
  | "ProtocolModel"
  | "Relationship"
  | "Dependency"
  | "Compatibility"
  | "Lifecycle"
  | "Inventory"
  | "Export"
  | "Immutability"
  | "Determinism"
  | "Readiness"
  | "Architecture";

/** Closed severity vocabulary — descriptive only. */
export type IntegrationConnectorValidationSeverity =
  | "Error"
  | "Warning"
  | "Info";

/** Closed finding-state vocabulary — descriptive only. */
export type IntegrationConnectorValidationFindingState =
  | "Pass"
  | "Warning"
  | "Error"
  | "Skipped"
  | "NotApplicable";

/** Closed expected-outcome vocabulary. */
export type IntegrationConnectorValidationExpectedOutcome =
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
export type IntegrationConnectorValidationOwnership =
  | "EIL-2:4"
  | "EIL-2 Integration Connector Validation";

/** Immutable model reference — never duplicates model values. */
export interface IntegrationConnectorModelReference {
  readonly modelId: "EIL-2:3/IntegrationConnectorModel";
  readonly modelNamespace: "nexora.eil.integration-connector.model";
  readonly entryPoint: "integrationConnectorModel.ts";
  readonly sourcePath: string;
  readonly preservesCanonicalReference: true;
  readonly duplicatesModelValue: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable validation category. */
export interface IntegrationConnectorValidationCategory {
  readonly categoryId: `EIL-2:4/Category/${IntegrationConnectorValidationCategoryId}`;
  readonly key: IntegrationConnectorValidationCategoryId;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: IntegrationConnectorValidationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable validation rule. */
export interface IntegrationConnectorValidationRule {
  readonly ruleId: `EIL-2:4/Rule/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly category: IntegrationConnectorValidationCategoryId;
  readonly description: string;
  readonly severity: IntegrationConnectorValidationSeverity;
  readonly expectedOutcome: IntegrationConnectorValidationExpectedOutcome;
  readonly sourceReference: IntegrationConnectorModelReference;
  readonly ownership: IntegrationConnectorValidationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable finding-state declaration. */
export interface IntegrationConnectorValidationFinding {
  readonly findingId: `EIL-2:4/Finding/${IntegrationConnectorValidationFindingState}`;
  readonly state: IntegrationConnectorValidationFindingState;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: IntegrationConnectorValidationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable readiness metadata. */
export interface IntegrationConnectorValidationReadinessDescriptor {
  readonly readinessId: "EIL-2:4/Readiness";
  readonly validationStatus: IntegrationConnectorValidationStatus;
  readonly readinessState: IntegrationConnectorValidationReadiness;
  readonly completionCriteria: readonly string[];
  readonly blockingCriteria: readonly string[];
  readonly readinessSummary: string;
  readonly nextPhase: "EIL-2:5 — Integration Connector Manifest";
  readonly executesGates: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Validation result vocabulary envelope (metadata only). */
export interface IntegrationConnectorValidationResult {
  readonly resultId: "EIL-2:4/Result/Declared";
  readonly declaredFindingStates: readonly IntegrationConnectorValidationFindingState[];
  readonly runtimeExecuted: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Validation inventory. */
export interface IntegrationConnectorValidationInventory {
  readonly inventoryId: "EIL-2:4/Inventory";
  readonly validationRuleCount: number;
  readonly categoryCount: number;
  readonly findingStateCount: number;
  readonly totalValidationEntryCount: number;
  readonly countsDerivedFromCollections: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Aggregate validation collections. */
export interface IntegrationConnectorValidationCollectionsDescriptor {
  readonly collectionsId: "EIL-2:4/Collections";
  readonly sourcePhase: "EIL-2:4";
  readonly rules: readonly IntegrationConnectorValidationRule[];
  readonly categories: readonly IntegrationConnectorValidationCategory[];
  readonly findings: readonly IntegrationConnectorValidationFinding[];
  readonly validationRuleCount: number;
  readonly categoryCount: number;
  readonly findingStateCount: number;
  readonly totalValidationEntryCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Canonical validation identity. */
export interface IntegrationConnectorValidationIdentityDescriptor {
  readonly phaseId: "EIL-2:4";
  readonly canonicalId: "EIL-2:4/IntegrationConnectorValidation";
  readonly name: "Integration Connector Validation";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-connector.validation";
  readonly layer: "EIL";
  readonly platform: "EIL-2";
  readonly phaseType: "Validation";
  readonly status: IntegrationConnectorValidationStatus;
  readonly readiness: IntegrationConnectorValidationReadiness;
  readonly modelDependency: "EIL-2:3/IntegrationConnectorModel";
  readonly modelEntryPoint: "integrationConnectorModel.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Aggregate validation summary. */
export interface IntegrationConnectorValidationSummaryDescriptor {
  readonly validationId: "EIL-2:4/IntegrationConnectorValidation";
  readonly version: "1.0.0";
  readonly name: "Integration Connector Validation";
  readonly namespace: "nexora.eil.integration-connector.validation";
  readonly status: IntegrationConnectorValidationStatus;
  readonly readiness: IntegrationConnectorValidationReadiness;
  readonly modelId: "EIL-2:3/IntegrationConnectorModel";
  readonly validationRuleCount: number;
  readonly categoryCount: number;
  readonly findingStateCount: number;
  readonly totalValidationEntryCount: number;
  readonly nextPhase: "EIL-2:5 — Integration Connector Manifest";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
