/**
 * DKL-5:3 — Knowledge Validation Model Types.
 *
 * Readonly contracts for canonical Knowledge Validation model structures.
 * Architectural declarations only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-5:3.
 */

export type KnowledgeValidationModelKind =
  | "KnowledgeValidation"
  | "ValidationTarget"
  | "ValidationScope"
  | "ValidationRule"
  | "ValidationCriterion"
  | "ValidationEvidence"
  | "EvidenceReference"
  | "ValidationFinding"
  | "ValidationIssue"
  | "ValidationConflict"
  | "ValidationAmbiguity"
  | "ValidationLimitation"
  | "ValidationResult"
  | "ValidationSummary"
  | "ValidationStatus"
  | "ValidationSeverity"
  | "KnowledgeQualitySignal"
  | "KnowledgeTrustDeclaration"
  | "ValidationReadiness"
  | "ValidationProvenance"
  | "ValidationBoundary"
  | "ValidationSession"
  | "ValidationSubjectSet"
  | "ValidationRuleSet"
  | "ValidationEvidenceSet"
  | "ValidationFindingSet"
  | "ValidationIssueSet"
  | "ValidationConsumerSuitability"
  | "ValidationExecutiveUsability"
  | "ValidationVersion";

export type ModelLifecycleState =
  | "Defined"
  | "Draft"
  | "Bound"
  | "Structured"
  | "Ready"
  | "Stable"
  | "Deprecated"
  | "Superseded";

export type ModelStatus =
  | "Declared"
  | "Complete"
  | "Incomplete"
  | "Blocked"
  | "Retired";

export interface KnowledgeValidationModelPhaseIdentity {
  readonly modelPhaseId: string;
  readonly modelPhaseVersion: string;
  readonly modelPhaseName: string;
  readonly modelPhaseNamespace: string;
  readonly owner: string;
  readonly sourcePhase: "DKL-5:3";
  readonly platformId: "DKL-5";
  readonly platformVersion: string;
  readonly status: "ModelComplete";
  readonly readiness: "ReadyForValidation";
}

export interface ModelFieldDescriptor {
  readonly fieldName: string;
  readonly fieldKind: string;
  readonly required: true;
  readonly readonly: true;
  readonly executableBehaviorImplied: false;
  readonly description: string;
}

export interface CanonicalModelDescriptor {
  readonly modelId: string;
  readonly modelKind: KnowledgeValidationModelKind;
  readonly modelName: string;
  readonly namespace: string;
  readonly description: string;
  readonly owner: string;
  readonly sourcePhase: "DKL-5:3";
  readonly registryCategoryReferences: readonly string[];
  readonly fields: readonly ModelFieldDescriptor[];
  readonly fieldCount: number;
  readonly lifecycleStates: readonly ModelLifecycleState[];
  readonly statuses: readonly ModelStatus[];
  readonly metadataOnly: true;
  readonly runtimeInstanceForbidden: true;
  readonly factoryForbidden: true;
  readonly executionForbidden: true;
  readonly scoreCalculationForbidden: true;
  readonly trustCalculationForbidden: true;
  readonly immutable: true;
}

export interface ModelRelationshipDeclaration {
  readonly id: string;
  readonly from: KnowledgeValidationModelKind;
  readonly to: KnowledgeValidationModelKind;
  readonly kind: string;
  readonly description: string;
}
