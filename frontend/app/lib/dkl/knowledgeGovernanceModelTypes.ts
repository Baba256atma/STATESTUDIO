/**
 * DKL-8:3 — Knowledge Governance Model Types.
 *
 * Shared IDs, model kinds, relationship kinds, statuses, and base contracts.
 * Registry-aligned. Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-8:3.
 */

import { KnowledgeGovernanceRegistryPlatform } from "./knowledgeGovernanceRegistry.ts";

type RegistryPlatform = typeof KnowledgeGovernanceRegistryPlatform;

export type KnowledgeGovernanceModelStatus = "ModelDefined";

export type KnowledgeGovernanceModelReadiness = "ReadyForValidation";

export type GovernanceSubjectId =
  RegistryPlatform["subjects"][number]["id"];

export type GovernanceRoleId = RegistryPlatform["roles"][number]["id"];

export type GovernanceCapabilityId =
  RegistryPlatform["capabilities"][number]["id"];

export type KnowledgeClassificationId =
  RegistryPlatform["classifications"][number]["id"];

export type KnowledgeSensitivityId =
  RegistryPlatform["sensitivities"][number]["id"];

export type KnowledgeAccessIntentId =
  RegistryPlatform["accessIntents"][number]["id"];

export type KnowledgeRetentionIntentId =
  RegistryPlatform["retentionIntents"][number]["id"];

export type KnowledgeDispositionIntentId =
  RegistryPlatform["dispositionIntents"][number]["id"];

export type KnowledgeAuditIntentId =
  RegistryPlatform["auditIntents"][number]["id"];

export type KnowledgeComplianceIntentId =
  RegistryPlatform["complianceIntents"][number]["id"];

export type GovernanceLifecycleStateId =
  RegistryPlatform["lifecycleStates"][number]["id"];

export type GovernanceLifecycleTransitionId =
  RegistryPlatform["lifecycleTransitions"][number]["id"];

export type GovernanceEvidenceKindId =
  RegistryPlatform["evidenceKinds"][number]["id"];

export type GovernanceExceptionCategoryId =
  RegistryPlatform["exceptionCategories"][number]["id"];

export type GovernancePolicyReferenceKindId =
  RegistryPlatform["policyReferenceKinds"][number]["id"];

export type GovernanceDecisionReferenceKindId =
  RegistryPlatform["decisionReferenceKinds"][number]["id"];

export type GovernanceBoundaryId =
  RegistryPlatform["boundaries"]["ownershipBoundaries"][number]["id"];

/** Confirms Registry platform remains the sole vocabulary type source. */
export const KnowledgeGovernanceModelUsesRegistryVocabulary =
  KnowledgeGovernanceRegistryPlatform.identity.registryId ===
  "DKL-8:2/KnowledgeGovernanceRegistry";

export type KnowledgeGovernanceModelKind =
  | "GovernanceIdentity"
  | "GovernanceSubjectReference"
  | "GovernanceScope"
  | "GovernanceActorRoleReference"
  | "OwnershipAssignment"
  | "StewardshipAssignment"
  | "ClassificationAssignment"
  | "SensitivityAssignment"
  | "AccessIntentAssignment"
  | "UsagePolicyAssignment"
  | "RetentionIntentAssignment"
  | "DispositionIntentAssignment"
  | "AuditIntentAssignment"
  | "ComplianceIntentAssignment"
  | "PolicyApplicability"
  | "GovernanceLifecycleState"
  | "GovernanceLifecycleTransitionRecord"
  | "GovernanceEvidenceReference"
  | "GovernanceDecisionReference"
  | "GovernanceException"
  | "GovernanceBoundaryReference"
  | "GovernanceProfile"
  | "GovernanceSnapshot"
  | "GovernanceRecord"
  | "GovernanceRelationship"
  | "GovernanceFinding"
  | "GovernanceIssue"
  | "GovernanceConflict"
  | "GovernanceAmbiguity"
  | "GovernanceModelResult"
  | "GovernanceModelReferences";

export type KnowledgeGovernanceRelationshipKind =
  | "Governs"
  | "OwnedBy"
  | "StewardedBy"
  | "ClassifiedAs"
  | "SensitiveAs"
  | "SubjectToPolicy"
  | "PermitsIntent"
  | "RestrictsIntent"
  | "RetainedBy"
  | "DisposedBy"
  | "AuditedBy"
  | "SubjectToCompliance"
  | "SupportedByEvidence"
  | "GrantedException"
  | "Supersedes"
  | "DerivedFrom"
  | "AppliesToScope"
  | "ReferencesDecision"
  | "BoundedBy";

export type KnowledgeGovernanceScopeType =
  | "Global"
  | "Tenant"
  | "Organization"
  | "BusinessUnit"
  | "Department"
  | "Team"
  | "Project"
  | "KnowledgeDomain"
  | "SubjectType"
  | "SpecificSubject"
  | "Relationship"
  | "KnowledgeGraphSegment"
  | "RepositoryCollection"
  | "KnowledgeService"
  | "CustomDeclaredScope";

export type KnowledgeGovernanceActorType =
  | "User"
  | "Team"
  | "Department"
  | "Organization"
  | "Tenant"
  | "System"
  | "ExternalAuthority"
  | "Unassigned";

export type KnowledgeGovernanceConflictType =
  | "OwnershipConflict"
  | "ClassificationConflict"
  | "SensitivityConflict"
  | "AccessIntentConflict"
  | "PolicyApplicabilityConflict"
  | "RetentionConflict"
  | "DispositionConflict"
  | "LifecycleConflict"
  | "ExceptionConflict"
  | "BoundaryConflict";

export type KnowledgeGovernanceAmbiguityType =
  | "MissingOwner"
  | "MissingSteward"
  | "UnknownScope"
  | "UnclearClassification"
  | "UnclearSensitivity"
  | "UnresolvedPolicy"
  | "UnclearRetention"
  | "UnclearDisposition"
  | "UnverifiedEvidence"
  | "UnresolvedException"
  | "UnknownLifecycle"
  | "BoundaryUncertainty";

export type KnowledgeGovernanceModelComponentStatus =
  | "Declared"
  | "Referenced"
  | "StructuralOnly";

export interface KnowledgeGovernanceModelKindDescriptor {
  readonly modelKindId: string;
  readonly modelKind: KnowledgeGovernanceModelKind;
  readonly description: string;
  readonly fields: readonly string[];
  readonly sourcePhase: "DKL-8:3";
  readonly registryAligned: true;
  readonly runtimeBehavior: "None";
  readonly generatesFindings: false;
  readonly evaluatesGovernance: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

export interface KnowledgeGovernanceRelationshipKindDescriptor {
  readonly relationshipKindId: string;
  readonly relationshipKind: KnowledgeGovernanceRelationshipKind;
  readonly description: string;
  readonly direction: "Directed" | "Bidirectional";
  readonly runtimeBehavior: "None";
  readonly traversableAtRuntime: false;
  readonly deterministicOrder: number;
}

export interface KnowledgeGovernanceModelIdentityContract {
  readonly id: string;
  readonly version: string;
  readonly kind: KnowledgeGovernanceModelKind;
  readonly namespace: string;
  readonly sourcePhase: "DKL-8:3";
  readonly status: KnowledgeGovernanceModelComponentStatus;
}

export interface KnowledgeGovernanceModelSummary {
  readonly id: string;
  readonly version: string;
  readonly namespace: string;
  readonly status: KnowledgeGovernanceModelStatus;
  readonly readiness: KnowledgeGovernanceModelReadiness;
  readonly upstreamDependency: string;
  readonly modelKindCount: number;
  readonly relationshipKindCount: number;
  readonly assignmentModelCount: number;
  readonly policyModelCount: number;
  readonly lifecycleModelCount: number;
  readonly evidenceModelCount: number;
  readonly compositeModelCount: number;
  readonly sectionCount: number;
  readonly runtimeBehavior: "None";
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
