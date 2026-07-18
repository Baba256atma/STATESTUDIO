/**
 * DKL-8:1 — Knowledge Governance Foundation Types.
 *
 * Readonly contracts and closed vocabularies for Knowledge Governance.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by DKL-8:1.
 */

export type KnowledgeGovernanceFoundationStatus = "FoundationDefined";

export type KnowledgeGovernanceFoundationReadiness = "ReadyForRegistry";

export type KnowledgeGovernanceSubjectType =
  | "KnowledgeObject"
  | "BusinessObject"
  | "Entity"
  | "Relationship"
  | "DocumentKnowledge"
  | "EventKnowledge"
  | "MetricKnowledge"
  | "DecisionKnowledge"
  | "OperationalKnowledge"
  | "StrategicKnowledge"
  | "ConversationKnowledge"
  | "RepositoryRecord"
  | "KnowledgeVersion"
  | "KnowledgeSnapshot"
  | "KnowledgeServiceResult"
  | "KnowledgeGraphSegment"
  | "Metadata"
  | "DerivedKnowledge"
  | "ExternalKnowledgeReference";

export type KnowledgeGovernanceRoleKind =
  | "Owner"
  | "Steward"
  | "Custodian"
  | "Producer"
  | "Consumer"
  | "Approver"
  | "Auditor"
  | "PolicyAuthority";

export type KnowledgeClassificationLevel =
  | "Public"
  | "Internal"
  | "Confidential"
  | "Restricted"
  | "HighlyRestricted";

export type KnowledgeSensitivityDimension =
  | "Personal"
  | "Financial"
  | "Commercial"
  | "Operational"
  | "Strategic"
  | "Legal"
  | "Security"
  | "Executive"
  | "Customer"
  | "Employee"
  | "Supplier"
  | "Contractual"
  | "IntellectualProperty";

export type KnowledgeAccessIntentKind =
  | "Read"
  | "Reference"
  | "Query"
  | "Traverse"
  | "Export"
  | "Share"
  | "Modify"
  | "Approve"
  | "Archive"
  | "Delete"
  | "Audit"
  | "Administer";

export type KnowledgeRetentionKind =
  | "Permanent"
  | "FixedDuration"
  | "UntilSuperseded"
  | "UntilProjectClosure"
  | "UntilContractClosure"
  | "UntilLegalRelease"
  | "UntilPolicyChange"
  | "ManualReview"
  | "Unspecified";

export type KnowledgeDispositionKind =
  | "Retain"
  | "Archive"
  | "Anonymize"
  | "Detach"
  | "Restrict"
  | "Delete"
  | "Review"
  | "Transfer";

export type KnowledgeGovernanceLifecycleState =
  | "Declared"
  | "Classified"
  | "Assigned"
  | "Reviewed"
  | "Approved"
  | "Active"
  | "Restricted"
  | "ExceptionGranted"
  | "Superseded"
  | "Archived"
  | "Retired";

export type KnowledgeGovernanceEvidenceKind =
  | "Policy"
  | "Contract"
  | "Source"
  | "OwnerDeclaration"
  | "StewardReview"
  | "AuditResult"
  | "ComplianceRequirement"
  | "ExecutiveDecision"
  | "SystemRule"
  | "RepositoryRecord"
  | "KnowledgeVersion"
  | "ExternalAuthority";

export type KnowledgeGovernanceExceptionStatus =
  | "Requested"
  | "UnderReview"
  | "Granted"
  | "Denied"
  | "Expired"
  | "Revoked";

export interface KnowledgeGovernanceIdentity {
  readonly foundationId: "DKL-8:1/KnowledgeGovernanceFoundation";
  readonly foundationName: "Knowledge Governance Foundation";
  readonly foundationVersion: string;
  readonly foundationNamespace: "nexora.dkl.knowledge-governance.foundation";
  readonly layer: "Data Knowledge Layer";
  readonly phase: "DKL-8";
  readonly stage: "Foundation";
  readonly sourcePhase: "DKL-8:1";
  readonly owner: string;
  readonly status: KnowledgeGovernanceFoundationStatus;
  readonly readiness: KnowledgeGovernanceFoundationReadiness;
  readonly dkl7PublicIndexId: string;
  readonly dkl7PublicIndexVersion: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeGovernanceSubject {
  readonly subjectTypeId: string;
  readonly subjectType: KnowledgeGovernanceSubjectType;
  readonly description: string;
  readonly machineReadable: true;
  readonly runtimeBehavior: "None";
  readonly deterministicOrder: number;
}

export interface KnowledgeGovernanceScope {
  readonly scopeId: string;
  readonly description: string;
  readonly subjectTypeReferences: readonly string[];
  readonly metadataOnly: true;
}

export interface KnowledgeOwner {
  readonly roleId: "DKL-8:1/Role/Owner";
  readonly roleKind: "Owner";
  readonly accountability: "Accountable for governed knowledge";
  readonly assignsUsers: false;
}

export interface KnowledgeSteward {
  readonly roleId: "DKL-8:1/Role/Steward";
  readonly roleKind: "Steward";
  readonly accountability: "Maintains governance quality and policy alignment";
  readonly assignsUsers: false;
}

export interface KnowledgeGovernanceRole {
  readonly roleId: string;
  readonly roleKind: KnowledgeGovernanceRoleKind;
  readonly description: string;
  readonly accountability: string;
  readonly assignsUsers: false;
  readonly assignsOrganizations: false;
  readonly runtimeBehavior: "None";
  readonly deterministicOrder: number;
}

export interface KnowledgeClassification {
  readonly classificationId: string;
  readonly level: KnowledgeClassificationLevel;
  readonly description: string;
  readonly separateFromAccessPermission: true;
  readonly separateFromTrustLevel: true;
  readonly separateFromValidationResult: true;
  readonly separateFromBusinessPriority: true;
  readonly separateFromExecutiveImportance: true;
  readonly separateFromDataQuality: true;
  readonly deterministicOrder: number;
}

export interface KnowledgeSensitivity {
  readonly sensitivityId: string;
  readonly dimension: KnowledgeSensitivityDimension;
  readonly description: string;
  readonly independentFromClassification: true;
  readonly implementsPrivacyLaw: false;
  readonly deterministicOrder: number;
}

export interface KnowledgeAccessIntent {
  readonly accessIntentId: string;
  readonly intent: KnowledgeAccessIntentKind;
  readonly description: string;
  readonly declarativeOnly: true;
  readonly authenticates: false;
  readonly authorizes: false;
  readonly issuesTokens: false;
  readonly enforcesPermissions: false;
  readonly runtimeBehavior: "None";
  readonly deterministicOrder: number;
}

export interface KnowledgeUsagePolicy {
  readonly policyContractId: string;
  readonly description: string;
  readonly declarativeOnly: true;
  readonly executesPolicy: false;
}

export interface KnowledgeRetentionPolicy {
  readonly retentionId: string;
  readonly retentionKind: KnowledgeRetentionKind;
  readonly description: string;
  readonly schedulesDeletion: false;
  readonly mutatesRepository: false;
  readonly deterministicOrder: number;
}

export interface KnowledgeDispositionPolicy {
  readonly dispositionId: string;
  readonly dispositionKind: KnowledgeDispositionKind;
  readonly description: string;
  readonly executesDisposition: false;
  readonly mutatesRepository: false;
  readonly deterministicOrder: number;
}

export interface KnowledgeAuditIntent {
  readonly auditIntentId: string;
  readonly category: string;
  readonly description: string;
  readonly implementsLogging: false;
  readonly storesAuditEvents: false;
  readonly evaluatesCompliance: false;
  readonly runtimeBehavior: "None";
  readonly deterministicOrder: number;
}

export interface KnowledgeComplianceIntent {
  readonly complianceIntentId: string;
  readonly category: string;
  readonly description: string;
  readonly interpretsLaw: false;
  readonly executesControls: false;
  readonly runtimeBehavior: "None";
  readonly deterministicOrder: number;
}

export interface KnowledgeLifecycleGovernance {
  readonly lifecycleId: string;
  readonly states: readonly KnowledgeGovernanceLifecycleState[];
  readonly transitions: Readonly<
    Record<
      KnowledgeGovernanceLifecycleState,
      readonly KnowledgeGovernanceLifecycleState[]
    >
  >;
  readonly stateMeanings: Readonly<
    Record<KnowledgeGovernanceLifecycleState, string>
  >;
  readonly stateCount: number;
  readonly declarativeOnly: true;
  readonly runtimeStateMachine: false;
  readonly executesTransitions: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface KnowledgePolicyReference {
  readonly policyReferenceId: string;
  readonly description: string;
  readonly referenceOnly: true;
  readonly embedsPolicyBody: false;
}

export interface KnowledgeGovernanceEvidence {
  readonly evidenceKindId: string;
  readonly evidenceKind: KnowledgeGovernanceEvidenceKind;
  readonly description: string;
  readonly referenceOnly: true;
  readonly embedsUpstreamObject: false;
  readonly deterministicOrder: number;
}

export interface KnowledgeGovernanceException {
  readonly exceptionContractId: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly grantsAutomatically: false;
  readonly implementsWorkflow: false;
  readonly createsTasks: false;
  readonly sendsNotifications: false;
}

export interface KnowledgeGovernanceDecisionReference {
  readonly decisionReferenceId: string;
  readonly description: string;
  readonly referenceOnly: true;
  readonly makesExecutiveDecision: false;
}

export interface KnowledgeGovernanceContext {
  readonly contextId: string;
  readonly description: string;
  readonly metadataOnly: true;
}

export interface KnowledgeGovernanceBoundary {
  readonly boundariesId: string;
  readonly owns: readonly string[];
  readonly doesNotOwn: readonly string[];
  readonly prohibitedSurfaces: readonly string[];
  readonly runtimeEnforcement: false;
}

export interface KnowledgeGovernanceContractDeclaration {
  readonly contractId: string;
  readonly contractName: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeBehavior: "None";
  readonly deterministicOrder: number;
}

export interface KnowledgeGovernanceFoundationSummary {
  readonly foundationId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly status: KnowledgeGovernanceFoundationStatus;
  readonly readiness: KnowledgeGovernanceFoundationReadiness;
  readonly dkl7PublicIndexId: string;
  readonly contractCount: number;
  readonly subjectTypeCount: number;
  readonly roleCount: number;
  readonly classificationCount: number;
  readonly sensitivityCount: number;
  readonly accessIntentCount: number;
  readonly retentionCount: number;
  readonly dispositionCount: number;
  readonly auditIntentCount: number;
  readonly complianceIntentCount: number;
  readonly lifecycleStateCount: number;
  readonly evidenceKindCount: number;
  readonly exceptionContractCount: number;
  readonly ownsCount: number;
  readonly doesNotOwnCount: number;
  readonly prohibitedSurfaceCount: number;
  readonly sectionCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
