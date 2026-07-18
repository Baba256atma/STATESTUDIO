/**
 * DKL-8:2 — Knowledge Governance Registry Types.
 *
 * Readonly registry-entry contracts and closed vocabularies.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by DKL-8:2.
 */

export type KnowledgeGovernanceRegistryStatus = "RegistryDefined";

export type KnowledgeGovernanceRegistryReadiness = "ReadyForModel";

export type KnowledgeGovernanceRegistryEntryStatus =
  | "Registered"
  | "Declared"
  | "Available";

export type KnowledgeGovernanceRegistryStability =
  | "FoundationAligned"
  | "Stable";

export interface KnowledgeGovernanceRegistryEntryBase {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly status: KnowledgeGovernanceRegistryEntryStatus;
  readonly owner: "DKL-8";
  readonly sourcePhase: "DKL-8:1" | "DKL-8:2";
  readonly version: "1.0.0";
  readonly stability: KnowledgeGovernanceRegistryStability;
  readonly public: true;
  readonly deprecated: false;
  readonly runtimeBehavior: "None";
  readonly metadataOnly: true;
  readonly deterministicOrder: number;
}

export interface KnowledgeGovernanceSubjectRegistration
  extends KnowledgeGovernanceRegistryEntryBase {
  readonly category: "subject";
  readonly subjectType: string;
  readonly foundationSubjectId: string;
}

export interface KnowledgeGovernanceContractRegistration
  extends KnowledgeGovernanceRegistryEntryBase {
  readonly category: "contract";
  readonly contractCategory: string;
  readonly foundationContractId: string;
  readonly purpose: string;
  readonly availability: "FoundationDeclared";
}

export interface KnowledgeGovernanceRoleRegistration
  extends KnowledgeGovernanceRegistryEntryBase {
  readonly category: "role";
  readonly roleKind: string;
  readonly accountability: string;
  readonly prohibitedResponsibilities: readonly string[];
  readonly assignmentStatus: "Unassigned";
  readonly assignsUsers: false;
  readonly assignsOrganizations: false;
}

export interface KnowledgeGovernanceCapabilityRegistration
  extends KnowledgeGovernanceRegistryEntryBase {
  readonly category: "capability";
  readonly capabilityKey: string;
  readonly declarativeOnly: true;
  readonly enforcesPolicy: false;
  readonly authorizesUsers: false;
}

export interface KnowledgeGovernanceClassificationRegistration
  extends KnowledgeGovernanceRegistryEntryBase {
  readonly category: "classification";
  readonly level: string;
  readonly ordinal: number;
  readonly relativeRestriction: number;
  readonly impliesPermissions: false;
}

export interface KnowledgeGovernanceSensitivityRegistration
  extends KnowledgeGovernanceRegistryEntryBase {
  readonly category: "sensitivity";
  readonly dimension: string;
  readonly independentFromClassification: true;
  readonly implementsPrivacyLaw: false;
}

export interface KnowledgeGovernanceAccessIntentRegistration
  extends KnowledgeGovernanceRegistryEntryBase {
  readonly category: "accessIntent";
  readonly intent: string;
  readonly intentCategory: "Access";
  readonly mutatingMeaning: boolean;
  readonly governanceSignificance: string;
  readonly runtimeEnforcementStatus: "Unavailable";
}

export interface KnowledgeGovernanceUsagePolicyRegistration
  extends KnowledgeGovernanceRegistryEntryBase {
  readonly category: "usagePolicy";
  readonly executesPolicy: false;
}

export interface KnowledgeGovernanceRetentionRegistration
  extends KnowledgeGovernanceRegistryEntryBase {
  readonly category: "retention";
  readonly retentionKind: string;
  readonly schedulesDeletion: false;
}

export interface KnowledgeGovernanceDispositionRegistration
  extends KnowledgeGovernanceRegistryEntryBase {
  readonly category: "disposition";
  readonly dispositionKind: string;
  readonly representsIntentOnly: true;
  readonly executesDisposition: false;
}

export interface KnowledgeGovernanceAuditIntentRegistration
  extends KnowledgeGovernanceRegistryEntryBase {
  readonly category: "auditIntent";
  readonly auditCategory: string;
  readonly implementsLogging: false;
}

export interface KnowledgeGovernanceComplianceIntentRegistration
  extends KnowledgeGovernanceRegistryEntryBase {
  readonly category: "complianceIntent";
  readonly complianceCategory: string;
  readonly interpretsLaw: false;
  readonly executesControls: false;
}

export interface KnowledgeGovernanceLifecycleStateRegistration
  extends KnowledgeGovernanceRegistryEntryBase {
  readonly category: "lifecycleState";
  readonly state: string;
  readonly ordinal: number;
  readonly isInitial: boolean;
  readonly isTerminal: boolean;
}

export interface KnowledgeGovernanceLifecycleTransitionRegistration
  extends KnowledgeGovernanceRegistryEntryBase {
  readonly category: "lifecycleTransition";
  readonly fromState: string;
  readonly toState: string;
  readonly executable: false;
}

export interface KnowledgeGovernanceEvidenceKindRegistration
  extends KnowledgeGovernanceRegistryEntryBase {
  readonly category: "evidenceKind";
  readonly evidenceKind: string;
  readonly referenceOnly: true;
}

export interface KnowledgeGovernanceExceptionCategoryRegistration
  extends KnowledgeGovernanceRegistryEntryBase {
  readonly category: "exceptionCategory";
  readonly exceptionCategory: string;
  readonly grantsAutomatically: false;
  readonly implementsWorkflow: false;
}

export interface KnowledgeGovernancePolicyReferenceKindRegistration
  extends KnowledgeGovernanceRegistryEntryBase {
  readonly category: "policyReferenceKind";
  readonly referenceOnly: true;
}

export interface KnowledgeGovernanceDecisionReferenceKindRegistration
  extends KnowledgeGovernanceRegistryEntryBase {
  readonly category: "decisionReferenceKind";
  readonly makesExecutiveDecision: false;
  readonly referenceOnly: true;
}

export interface KnowledgeGovernanceOwnershipRegistration
  extends KnowledgeGovernanceRegistryEntryBase {
  readonly category: "ownership";
  readonly owned: boolean;
}

export interface KnowledgeGovernanceBoundaryRegistration
  extends KnowledgeGovernanceRegistryEntryBase {
  readonly category: "boundary";
  readonly owningLayer: string;
  readonly prohibited: true;
}

export interface KnowledgeGovernanceRegistrySummary {
  readonly registryId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly status: KnowledgeGovernanceRegistryStatus;
  readonly readiness: KnowledgeGovernanceRegistryReadiness;
  readonly foundationId: string;
  readonly subjectCount: number;
  readonly contractCount: number;
  readonly roleCount: number;
  readonly capabilityCount: number;
  readonly classificationCount: number;
  readonly sensitivityCount: number;
  readonly accessIntentCount: number;
  readonly usagePolicyCount: number;
  readonly retentionCount: number;
  readonly dispositionCount: number;
  readonly auditIntentCount: number;
  readonly complianceIntentCount: number;
  readonly lifecycleStateCount: number;
  readonly lifecycleTransitionCount: number;
  readonly evidenceKindCount: number;
  readonly exceptionCategoryCount: number;
  readonly policyReferenceKindCount: number;
  readonly decisionReferenceKindCount: number;
  readonly ownershipDeclarationCount: number;
  readonly boundaryCount: number;
  readonly totalEntryCount: number;
  readonly sectionCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
