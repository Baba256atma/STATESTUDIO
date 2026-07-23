/**
 * EIL-3:4 — Integration Routing Validation Types.
 *
 * Readonly contracts and closed vocabularies for Integration Routing Validation.
 * Metadata-only. No validation engine.
 *
 * Ownership: owned exclusively by EIL-3:4.
 */

/** Validation status for EIL-3:4. */
export type RoutingValidationStatus = "Validation";

/** Immediate downstream readiness — Manifest only. */
export type RoutingValidationReadinessState = "ReadyForManifest";

/** Closed validation-category vocabulary. */
export type RoutingValidationCategoryId =
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
export type RoutingValidationSeverity = "Error" | "Warning" | "Info";

/** Closed finding-state vocabulary — descriptive only. */
export type RoutingValidationFindingState =
  | "Pass"
  | "Warning"
  | "Error"
  | "Skipped"
  | "NotApplicable";

/** Closed expected-outcome vocabulary. */
export type RoutingValidationExpectedOutcome =
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
export type RoutingValidationOwnership =
  | "EIL-3:4"
  | "EIL-3 Integration Routing Validation";

/** Immutable model reference — never duplicates model values. */
export interface RoutingModelReference {
  readonly modelId: "EIL-3:3/IntegrationRoutingModel";
  readonly modelNamespace: "nexora.eil.integration-routing.model";
  readonly entryPoint: "integrationRoutingModel.ts";
  readonly sourcePath: string;
  readonly preservesCanonicalReference: true;
  readonly duplicatesModelValue: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Canonical validation identity. */
export interface RoutingValidationIdentity {
  readonly phaseId: "EIL-3:4";
  readonly canonicalId: "EIL-3:4/IntegrationRoutingValidation";
  readonly name: "Integration Routing Validation";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-routing.validation";
  readonly layer: "EIL";
  readonly platform: "EIL-3";
  readonly phaseType: "Validation";
  readonly status: RoutingValidationStatus;
  readonly readiness: RoutingValidationReadinessState;
  readonly modelDependency: "EIL-3:3/IntegrationRoutingModel";
  readonly modelEntryPoint: "integrationRoutingModel.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable validation category. */
export interface RoutingValidationCategory {
  readonly categoryId: `EIL-3:4/Category/${RoutingValidationCategoryId}`;
  readonly key: RoutingValidationCategoryId;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: RoutingValidationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable validation rule. */
export interface RoutingValidationRule {
  readonly ruleId: `EIL-3:4/Rule/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly category: RoutingValidationCategoryId;
  readonly description: string;
  readonly severity: RoutingValidationSeverity;
  readonly expectedOutcome: RoutingValidationExpectedOutcome;
  readonly sourceReference: RoutingModelReference;
  readonly ownership: RoutingValidationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable finding-state declaration. */
export interface RoutingValidationFinding {
  readonly findingId: `EIL-3:4/Finding/${RoutingValidationFindingState}`;
  readonly state: RoutingValidationFindingState;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: RoutingValidationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable readiness metadata. */
export interface RoutingValidationReadiness {
  readonly readinessId: "EIL-3:4/Readiness";
  readonly validationStatus: RoutingValidationStatus;
  readonly readinessState: RoutingValidationReadinessState;
  readonly completionCriteria: readonly string[];
  readonly blockingCriteria: readonly string[];
  readonly readinessSummary: string;
  readonly validationDeclaration: string;
  readonly nextPhase: "EIL-3:5 — Integration Routing Manifest";
  readonly executesGates: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Aggregate validation collections. */
export interface RoutingValidationCollections {
  readonly collectionsId: "EIL-3:4/Collections";
  readonly sourcePhase: "EIL-3:4";
  readonly rules: readonly RoutingValidationRule[];
  readonly categories: readonly RoutingValidationCategory[];
  readonly findings: readonly RoutingValidationFinding[];
  readonly ruleCount: number;
  readonly categoryCount: number;
  readonly findingCount: number;
  readonly totalValidationEntryCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Validation inventory. */
export interface RoutingValidationInventory {
  readonly inventoryId: "EIL-3:4/Inventory";
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
export interface RoutingValidationSummary {
  readonly validationId: "EIL-3:4/IntegrationRoutingValidation";
  readonly version: "1.0.0";
  readonly name: "Integration Routing Validation";
  readonly namespace: "nexora.eil.integration-routing.validation";
  readonly status: RoutingValidationStatus;
  readonly readiness: RoutingValidationReadinessState;
  readonly modelId: "EIL-3:3/IntegrationRoutingModel";
  readonly ruleCount: number;
  readonly categoryCount: number;
  readonly findingCount: number;
  readonly totalValidationEntryCount: number;
  readonly nextPhase: "EIL-3:5 — Integration Routing Manifest";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
