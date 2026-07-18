/**
 * DKL-6:4 — Knowledge Repository Validation Types.
 *
 * Readonly contracts for architectural validation of DKL-6:1–6:3.
 * Metadata-only. No runtime data validation.
 *
 * Ownership: owned exclusively by DKL-6:4.
 */

export type KnowledgeRepositoryValidationStatus = "Pass" | "Fail";

export type KnowledgeRepositoryValidationCategory =
  | "Foundation"
  | "Registry"
  | "Model"
  | "Ownership"
  | "Boundaries"
  | "Dependencies"
  | "Traceability"
  | "Immutability"
  | "Determinism"
  | "RuntimeProhibition";

export type KnowledgeRepositoryValidationSeverity = "Critical" | "Required";

export type KnowledgeRepositoryValidationRule = Readonly<{
  id: string;
  name: string;
  category: KnowledgeRepositoryValidationCategory;
  description: string;
  subjectReference: string;
  expected: string;
  actual: string;
  status: KnowledgeRepositoryValidationStatus;
  severity: KnowledgeRepositoryValidationSeverity;
  owner: "DKL-6";
  runtimeBehavior: "None";
  deterministicOrder: number;
}>;

export type KnowledgeRepositoryValidationGate = Readonly<{
  id: string;
  name: string;
  category: KnowledgeRepositoryValidationCategory;
  ruleReferences: readonly string[];
  passedRuleCount: number;
  failedRuleCount: number;
  status: KnowledgeRepositoryValidationStatus;
  owner: "DKL-6";
  runtimeBehavior: "None";
  deterministicOrder: number;
}>;

export type KnowledgeRepositoryValidationResult = Readonly<{
  validationId: string;
  status: "Validated";
  totalRules: number;
  passedRules: number;
  failedRules: number;
  gateStatus: "Pass" | "Fail";
  readiness: "ReadyForDKL6Manifest" | "Blocked";
  gateCount: number;
  passedGates: number;
  failedGates: number;
}>;

export type KnowledgeRepositoryValidationCategoryDescriptor = Readonly<{
  category: KnowledgeRepositoryValidationCategory;
  name: string;
  ruleCount: number;
  deterministicOrder: number;
}>;

export interface KnowledgeRepositoryValidationIdentityDescriptor {
  readonly validationId: "DKL-6:4/KnowledgeRepositoryValidation";
  readonly validationName: "Knowledge Repository Validation";
  readonly validationVersion: string;
  readonly validationNamespace: "nexora.dkl.repository.validation";
  readonly phase: "DKL-6:4";
  readonly owner: "DKL-6";
  readonly status: "Validated";
  readonly readiness: "ReadyForDKL6Manifest";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeRepositoryValidationSummaryDescriptor {
  readonly validationId: "DKL-6:4/KnowledgeRepositoryValidation";
  readonly version: string;
  readonly name: "Knowledge Repository Validation";
  readonly namespace: "nexora.dkl.repository.validation";
  readonly status: "Validated";
  readonly foundationDependencyId: string;
  readonly registryDependencyId: string;
  readonly modelDependencyId: string;
  readonly categoryCount: number;
  readonly ruleCount: number;
  readonly passedRuleCount: number;
  readonly failedRuleCount: number;
  readonly gateCount: number;
  readonly passedGateCount: number;
  readonly failedGateCount: number;
  readonly criticalRuleCount: number;
  readonly requiredRuleCount: number;
  readonly overallGateStatus: "Pass" | "Fail";
  readonly readiness: "ReadyForDKL6Manifest";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
