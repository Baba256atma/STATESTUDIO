/**
 * DKL-8:4 — Knowledge Governance Validation Types.
 *
 * Categories, severities, outcomes, finding/report/gate contracts.
 * Metadata-only. No enforcement or runtime governance.
 *
 * Ownership: owned exclusively by DKL-8:4.
 */

export type KnowledgeGovernanceValidationStatus = "ValidationDefined";

export type KnowledgeGovernanceValidationReadiness = "ReadyForManifest";

export type KnowledgeGovernanceValidationSeverity =
  | "Info"
  | "Warning"
  | "Error"
  | "Critical";

export type KnowledgeGovernanceValidationOutcome =
  | "Pass"
  | "Fail"
  | "NotApplicable"
  | "NotEvaluated";

export type KnowledgeGovernanceValidationCategory =
  | "Identity"
  | "Dependency"
  | "RegistryReference"
  | "Subject"
  | "Scope"
  | "ActorRole"
  | "Ownership"
  | "Stewardship"
  | "Classification"
  | "Sensitivity"
  | "Access"
  | "Usage"
  | "Retention"
  | "Disposition"
  | "Audit"
  | "Compliance"
  | "PolicyApplicability"
  | "Lifecycle"
  | "Evidence"
  | "DecisionReference"
  | "Exception"
  | "Boundary"
  | "Profile"
  | "Snapshot"
  | "Record"
  | "Relationship"
  | "Finding"
  | "Issue"
  | "Conflict"
  | "Ambiguity"
  | "Result"
  | "Immutability"
  | "Determinism"
  | "RuntimeProhibition"
  | "Readiness";

export type KnowledgeGovernanceValidationRuleStatus = "Active";

export type KnowledgeGovernanceValidationReadinessImpact =
  | "Blocking"
  | "NonBlocking"
  | "None";

export type KnowledgeGovernanceValidationGateName =
  | "IdentityValid"
  | "DependencyValid"
  | "RegistryReferencesValid"
  | "SubjectsValid"
  | "AssignmentsValid"
  | "PoliciesValid"
  | "LifecycleValid"
  | "EvidenceValid"
  | "ExceptionsValid"
  | "BoundariesValid"
  | "ProfilesValid"
  | "CompositeModelsValid"
  | "RelationshipsValid"
  | "ImmutabilityValid"
  | "DeterminismValid"
  | "RuntimeProhibitionsValid"
  | "ReadyForManifest";

export interface KnowledgeGovernanceValidationCategoryDescriptor {
  readonly categoryId: string;
  readonly category: KnowledgeGovernanceValidationCategory;
  readonly description: string;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeGovernanceValidationSeverityDescriptor {
  readonly severityId: string;
  readonly severity: KnowledgeGovernanceValidationSeverity;
  readonly description: string;
  readonly triggersNotification: false;
  readonly enforcesPermissions: false;
  readonly startsWorkflows: false;
  readonly deterministicOrder: number;
}

export interface KnowledgeGovernanceValidationOutcomeDescriptor {
  readonly outcomeId: string;
  readonly outcome: KnowledgeGovernanceValidationOutcome;
  readonly description: string;
  readonly isAuthorizationOutcome: false;
  readonly deterministicOrder: number;
}

export interface KnowledgeGovernanceValidationRule {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: KnowledgeGovernanceValidationCategory;
  readonly severity: KnowledgeGovernanceValidationSeverity;
  readonly targetModelKinds: readonly string[];
  readonly sourcePhase: "DKL-8:4";
  readonly deterministic: true;
  readonly runtimeBehavior: "None";
  readonly status: KnowledgeGovernanceValidationRuleStatus;
  readonly outcome: KnowledgeGovernanceValidationOutcome;
  readonly requirement: string;
  readonly expected: string;
  readonly actual: string;
  readonly prohibited: string;
  readonly readinessImpact: KnowledgeGovernanceValidationReadinessImpact;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

export interface KnowledgeGovernanceValidationFinding {
  readonly findingId: string;
  readonly ruleId: string;
  readonly category: KnowledgeGovernanceValidationCategory;
  readonly severity: KnowledgeGovernanceValidationSeverity;
  readonly outcome: KnowledgeGovernanceValidationOutcome;
  readonly targetKind: string;
  readonly targetReference: string;
  readonly message: string;
  readonly expected: string;
  readonly actual: string;
  readonly evidenceReferences: readonly string[];
  readonly readinessImpact: KnowledgeGovernanceValidationReadinessImpact;
  readonly remediationCallback: false;
  readonly notificationBehavior: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeGovernanceValidationReport {
  readonly reportId: string;
  readonly validationId: string;
  readonly targetReference: string;
  readonly ruleCount: number;
  readonly evaluatedRuleCount: number;
  readonly passedRuleCount: number;
  readonly failedRuleCount: number;
  readonly notApplicableRuleCount: number;
  readonly notEvaluatedRuleCount: number;
  readonly findings: readonly KnowledgeGovernanceValidationFinding[];
  readonly outcome: KnowledgeGovernanceValidationOutcome;
  readonly readiness: KnowledgeGovernanceValidationReadiness;
  readonly generatesTimestamps: false;
  readonly persists: false;
  readonly sendsExternally: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeGovernanceValidationGate {
  readonly id: string;
  readonly name: KnowledgeGovernanceValidationGateName;
  readonly requiredRuleIds: readonly string[];
  readonly status: "Active";
  readonly outcome: KnowledgeGovernanceValidationOutcome;
  readonly blocking: boolean;
  readonly sourcePhase: "DKL-8:4";
  readonly executesExternalBehavior: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

export interface KnowledgeGovernanceValidationSummary {
  readonly id: string;
  readonly version: string;
  readonly namespace: string;
  readonly status: KnowledgeGovernanceValidationStatus;
  readonly validationOutcome: KnowledgeGovernanceValidationOutcome;
  readonly readiness: KnowledgeGovernanceValidationReadiness;
  readonly ruleCount: number;
  readonly categoryCount: number;
  readonly gateCount: number;
  readonly failedRuleCount: number;
  readonly runtimeBehavior: "None";
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface KnowledgeGovernanceModelDescriptorInput {
  readonly modelId?: string;
  readonly modelVersion?: string;
  readonly modelNamespace?: string;
  readonly status?: string;
  readonly readiness?: string;
  readonly modelKindCount?: number;
  readonly relationshipKindCount?: number;
  readonly metadataOnly?: boolean;
  readonly runtimeEnforcement?: boolean;
  readonly validatesGovernance?: boolean;
  readonly enforcesGovernance?: boolean;
}
