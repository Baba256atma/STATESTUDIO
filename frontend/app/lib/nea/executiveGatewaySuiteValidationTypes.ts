/**
 * NEA-8:4 — Executive Gateway Suite Validation Types.
 *
 * Readonly contracts for declarative Executive Gateway Suite validation architecture.
 * Metadata-only. No validation engine.
 *
 * Ownership: owned exclusively by NEA-8:4.
 */

/** Validation status for NEA-8:4. */
export type ExecutiveGatewaySuiteValidationStatus = "Validation";

/** Immediate downstream readiness — Manifest only. */
export type ExecutiveGatewaySuiteValidationReadiness = "ReadyForManifest";

/** Validation category identifiers — 20 model kinds + CrossModel + PlatformIntegrity. */
export type ExecutiveGatewaySuiteValidationCategoryId =
  | "SuiteIdentity"
  | "SuiteComponent"
  | "SuiteComponentIdentity"
  | "SuiteComposition"
  | "SuiteDependency"
  | "SuiteCapability"
  | "SuiteContract"
  | "SuiteLifecycle"
  | "SuitePolicy"
  | "SuiteInventory"
  | "SuiteMetadata"
  | "SuiteStatus"
  | "SuiteVersion"
  | "SuiteReadiness"
  | "SuiteRelationship"
  | "SuiteValidationTarget"
  | "SuitePlatformReference"
  | "SuitePublicApiInventory"
  | "SuiteSummary"
  | "ExecutiveGatewaySuite"
  | "CrossModel"
  | "PlatformIntegrity";

/** Target model kinds aligned to NEA-8:3 domain models. */
export type ExecutiveGatewaySuiteValidationTarget =
  | "SuiteIdentity"
  | "SuiteComponent"
  | "SuiteComponentIdentity"
  | "SuiteComposition"
  | "SuiteDependency"
  | "SuiteCapability"
  | "SuiteContract"
  | "SuiteLifecycle"
  | "SuitePolicy"
  | "SuiteInventory"
  | "SuiteMetadata"
  | "SuiteStatus"
  | "SuiteVersion"
  | "SuiteReadiness"
  | "SuiteRelationship"
  | "SuiteValidationTarget"
  | "SuitePlatformReference"
  | "SuitePublicApiInventory"
  | "SuiteSummary"
  | "ExecutiveGatewaySuite"
  | "CrossModel"
  | "Platform";

/** Declarative severity levels — no runtime enforcement. */
export type ExecutiveGatewaySuiteValidationSeverity =
  | "Error"
  | "Warning"
  | "Info";

/** Declarative validation rule. */
export interface ExecutiveGatewaySuiteValidationRule {
  readonly ruleId: string;
  readonly ruleName: string;
  readonly categoryId: ExecutiveGatewaySuiteValidationCategoryId;
  readonly targetModelKind: ExecutiveGatewaySuiteValidationTarget;
  readonly description: string;
  readonly severity: ExecutiveGatewaySuiteValidationSeverity;
  readonly modelReference: string;
  readonly validationIntent: "DeclarativeStructureOnly";
  readonly executionStatus: "None";
  readonly ownership: "NEA-8:4";
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Validation category descriptor. */
export interface ExecutiveGatewaySuiteValidationCategory {
  readonly categoryId: ExecutiveGatewaySuiteValidationCategoryId;
  readonly categoryName: string;
  readonly description: string;
  readonly targetModelKind: ExecutiveGatewaySuiteValidationTarget;
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Validation relationship between categories. */
export interface ExecutiveGatewaySuiteValidationRelationship {
  readonly relationshipId: string;
  readonly relationshipName: string;
  readonly sourceCategoryId: ExecutiveGatewaySuiteValidationCategoryId;
  readonly targetCategoryId: ExecutiveGatewaySuiteValidationCategoryId;
  readonly description: string;
  readonly executesValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Declarative validation policy. */
export interface ExecutiveGatewaySuiteValidationPolicy {
  readonly policyId: string;
  readonly policyName: string;
  readonly statement: string;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical validation identity. */
export interface ExecutiveGatewaySuiteValidationIdentity {
  readonly validationId: string;
  readonly validationName: string;
  readonly validationVersion: string;
  readonly validationNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-8:4";
  readonly stage: "Validation";
  readonly sourcePhase: "NEA-8:4";
  readonly owner: string;
  readonly status: ExecutiveGatewaySuiteValidationStatus;
  readonly readiness: ExecutiveGatewaySuiteValidationReadiness;
  readonly modelId: string;
  readonly modelVersion: string;
  readonly suiteName: "Executive Gateway Suite";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic validation summary. */
export interface ExecutiveGatewaySuiteValidationSummary {
  readonly validationId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-8:4";
  readonly status: ExecutiveGatewaySuiteValidationStatus;
  readonly readiness: ExecutiveGatewaySuiteValidationReadiness;
  readonly modelId: string;
  readonly suiteName: "Executive Gateway Suite";
  readonly categoryCount: number;
  readonly domainCategoryCount: number;
  readonly ruleCount: number;
  readonly crossModelRuleCount: number;
  readonly platformIntegrityRuleCount: number;
  readonly relationshipCount: number;
  readonly policyCount: number;
  readonly ownershipCount: number;
  readonly nonOwnershipCount: number;
  readonly prohibitedSurfaceCount: number;
  readonly publicApiInventoryTotal: number;
  readonly publicExportCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
