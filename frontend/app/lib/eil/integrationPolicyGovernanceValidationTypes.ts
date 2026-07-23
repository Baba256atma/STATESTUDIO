/**
 * EIL-5:4 — Integration Policy & Governance Validation Types.
 *
 * Readonly contracts and closed vocabularies for Integration Policy & Governance Validation.
 * Metadata-only. No validation engine.
 *
 * Ownership: owned exclusively by EIL-5:4.
 */

/** Validation status for EIL-5:4. */
export type PolicyGovernanceValidationStatus = "Validation";

/** Immediate downstream readiness — Manifest only. */
export type PolicyGovernanceValidationReadinessState = "ReadyForManifest";

/** Closed validation-category vocabulary. */
export type PolicyGovernanceValidationCategoryId =
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
export type PolicyGovernanceValidationSeverity = "Error" | "Warning" | "Info";

/** Closed finding-state vocabulary — descriptive only. */
export type PolicyGovernanceValidationFindingState =
  | "Pass"
  | "Warning"
  | "Error"
  | "Skipped"
  | "NotApplicable";

/** Closed expected-outcome vocabulary. */
export type PolicyGovernanceValidationExpectedOutcome =
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
export type PolicyGovernanceValidationOwnership =
  | "EIL-5:4"
  | "EIL-5 Integration Policy & Governance Validation";

/** Immutable model reference — never duplicates model values. */
export interface PolicyGovernanceModelReference {
  readonly modelId: "EIL-5:3/IntegrationPolicyGovernanceModel";
  readonly modelNamespace: "nexora.eil.integration-policy-governance.model";
  readonly entryPoint: "integrationPolicyGovernanceModel.ts";
  readonly sourcePath: string;
  readonly preservesCanonicalReference: true;
  readonly duplicatesModelValue: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Canonical validation identity. */
export interface IntegrationPolicyGovernanceValidationIdentity {
  readonly phaseId: "EIL-5:4";
  readonly canonicalId: "EIL-5:4/IntegrationPolicyGovernanceValidation";
  readonly name: "Integration Policy & Governance Validation";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-policy-governance.validation";
  readonly layer: "EIL";
  readonly platform: "EIL-5";
  readonly phaseType: "Validation";
  readonly status: PolicyGovernanceValidationStatus;
  readonly readiness: PolicyGovernanceValidationReadinessState;
  readonly modelDependency: "EIL-5:3/IntegrationPolicyGovernanceModel";
  readonly modelEntryPoint: "integrationPolicyGovernanceModel.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable validation category. */
export interface IntegrationPolicyGovernanceValidationCategory {
  readonly categoryId: `EIL-5:4/Category/${PolicyGovernanceValidationCategoryId}`;
  readonly key: PolicyGovernanceValidationCategoryId;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: PolicyGovernanceValidationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable validation rule. */
export interface IntegrationPolicyGovernanceValidationRule {
  readonly ruleId: `EIL-5:4/Rule/${string}`;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly category: PolicyGovernanceValidationCategoryId;
  readonly description: string;
  readonly severity: PolicyGovernanceValidationSeverity;
  readonly expectedOutcome: PolicyGovernanceValidationExpectedOutcome;
  readonly sourceReference: PolicyGovernanceModelReference;
  readonly ownership: PolicyGovernanceValidationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable finding-state declaration. */
export interface IntegrationPolicyGovernanceValidationFinding {
  readonly findingId: `EIL-5:4/Finding/${PolicyGovernanceValidationFindingState}`;
  readonly state: PolicyGovernanceValidationFindingState;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: PolicyGovernanceValidationOwnership;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable readiness metadata. */
export interface IntegrationPolicyGovernanceValidationReadiness {
  readonly readinessId: "EIL-5:4/Readiness";
  readonly validationStatus: PolicyGovernanceValidationStatus;
  readonly readinessState: PolicyGovernanceValidationReadinessState;
  readonly upstreamDependency: "EIL-5:3/IntegrationPolicyGovernanceModel";
  readonly completionCriteria: readonly string[];
  readonly blockingCriteria: readonly string[];
  readonly readinessSummary: string;
  readonly validationDeclaration: string;
  readonly nextPhase: "EIL-5:5 — Integration Policy & Governance Manifest";
  readonly executesGates: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Aggregate validation collections. */
export interface IntegrationPolicyGovernanceValidationCollections {
  readonly collectionsId: "EIL-5:4/Collections";
  readonly sourcePhase: "EIL-5:4";
  readonly rules: readonly IntegrationPolicyGovernanceValidationRule[];
  readonly categories: readonly IntegrationPolicyGovernanceValidationCategory[];
  readonly findings: readonly IntegrationPolicyGovernanceValidationFinding[];
  readonly ruleCount: number;
  readonly categoryCount: number;
  readonly findingCount: number;
  readonly totalValidationEntryCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Validation inventory. */
export interface IntegrationPolicyGovernanceValidationInventory {
  readonly inventoryId: "EIL-5:4/Inventory";
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
export interface IntegrationPolicyGovernanceValidationSummary {
  readonly validationId: "EIL-5:4/IntegrationPolicyGovernanceValidation";
  readonly version: "1.0.0";
  readonly name: "Integration Policy & Governance Validation";
  readonly namespace: "nexora.eil.integration-policy-governance.validation";
  readonly status: PolicyGovernanceValidationStatus;
  readonly readiness: PolicyGovernanceValidationReadinessState;
  readonly modelId: "EIL-5:3/IntegrationPolicyGovernanceModel";
  readonly ruleCount: number;
  readonly categoryCount: number;
  readonly findingCount: number;
  readonly totalValidationEntryCount: number;
  readonly nextPhase: "EIL-5:5 — Integration Policy & Governance Manifest";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
