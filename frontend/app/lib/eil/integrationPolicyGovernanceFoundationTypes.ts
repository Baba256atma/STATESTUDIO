/**
 * EIL-5:1 — Integration Policy & Governance Foundation Types.
 *
 * Readonly contracts and closed vocabularies for the Integration Policy & Governance Platform.
 * Metadata-only. No governance enforcement.
 *
 * Ownership: owned exclusively by EIL-5:1.
 */

export type PolicyGovernanceFoundationStatus = "Foundation";

export type PolicyGovernanceFoundationReadiness = "ReadyForRegistry";

export type PolicyGovernanceLifecycleState =
  | "Declared"
  | "Designed"
  | "Verified"
  | "Certified"
  | "Frozen"
  | "Released"
  | "Deprecated"
  | "Retired";

export type PolicyGovernanceCategoryKey =
  | "IdentityPolicy"
  | "AccessPolicy"
  | "DependencyPolicy"
  | "CompatibilityPolicy"
  | "VersionPolicy"
  | "LifecyclePolicy"
  | "InventoryPolicy"
  | "CompliancePolicy"
  | "SecurityPolicy"
  | "ExecutiveGovernancePolicy";

export type PolicyGovernanceContractName =
  | "Policy"
  | "GovernanceRule"
  | "GovernanceBoundary"
  | "GovernanceScope"
  | "ComplianceContract"
  | "PolicyLifecycle"
  | "PolicyVersion"
  | "PolicyMetadata"
  | "PolicyCompatibility"
  | "GovernanceIdentity";

export type PolicyGovernanceCapabilityId =
  | "PolicyDescription"
  | "GovernanceClassification"
  | "ComplianceDeclaration"
  | "DependencyDeclaration"
  | "CompatibilityDeclaration"
  | "LifecycleDescription"
  | "MetadataPublication"
  | "InventorySupport"
  | "GovernanceReadiness"
  | "ArchitecturalConsistency";

export type PolicyGovernanceResponsibilityId =
  | "PreserveGovernanceIdentity"
  | "PreserveArchitecturalBoundaries"
  | "PublishGovernanceMetadata"
  | "PreserveDependencyDirection"
  | "PreserveCompatibility"
  | "PreserveDeterministicInventories"
  | "SupportFutureRuntimePlatforms"
  | "PreserveArchitecturalConsistency";

/** Canonical policy & governance foundation identity. */
export interface IntegrationPolicyGovernanceFoundationIdentity {
  readonly foundationId: "EIL-5:1/IntegrationPolicyGovernanceFoundation";
  readonly foundationName: "Integration Policy & Governance Foundation";
  readonly foundationVersion: "1.0.0";
  readonly foundationNamespace: "nexora.eil.integration-policy-governance.foundation";
  readonly layer: "EIL";
  readonly platform: "EIL-5";
  readonly phaseId: "EIL-5:1";
  readonly phaseType: "Foundation";
  readonly owner: "EIL-5 Integration Policy & Governance Foundation";
  readonly status: PolicyGovernanceFoundationStatus;
  readonly readiness: PolicyGovernanceFoundationReadiness;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable governance category declaration. */
export interface IntegrationPolicyGovernanceCategory {
  readonly categoryId: `EIL-5:1/Category/${PolicyGovernanceCategoryKey}`;
  readonly categoryKey: PolicyGovernanceCategoryKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly runtimeImplemented: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Immutable governance contract declaration. */
export interface IntegrationPolicyGovernanceContract {
  readonly contractId: `EIL-5:1/Contract/${PolicyGovernanceContractName}`;
  readonly contractName: PolicyGovernanceContractName;
  readonly canonicalName: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly runtimeBehavior: "None";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Descriptive governance capability declaration. */
export interface IntegrationPolicyGovernanceCapability {
  readonly capabilityId: `EIL-5:1/Capability/${PolicyGovernanceCapabilityId}`;
  readonly capabilityKey: PolicyGovernanceCapabilityId;
  readonly capabilityName: string;
  readonly description: string;
  readonly ownedByEil5: true;
  readonly executesRuntime: false;
  readonly performsGovernance: false;
  readonly performsNetworking: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Descriptive governance responsibility declaration. */
export interface IntegrationPolicyGovernanceResponsibility {
  readonly responsibilityId: PolicyGovernanceResponsibilityId;
  readonly responsibilityName: string;
  readonly description: string;
  readonly ownedByEil5: true;
  readonly executesRuntime: false;
  readonly performsBusinessLogic: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Lifecycle catalog declaration. */
export interface IntegrationPolicyGovernanceLifecycle {
  readonly lifecycleId: "EIL-5:1/IntegrationPolicyGovernanceLifecycle";
  readonly sourcePhase: "EIL-5:1";
  readonly states: readonly PolicyGovernanceLifecycleState[];
  readonly stateCount: number;
  readonly transitions: Readonly<
    Record<
      PolicyGovernanceLifecycleState,
      readonly PolicyGovernanceLifecycleState[]
    >
  >;
  readonly currentState: "Verified";
  readonly foundationReadiness: PolicyGovernanceFoundationReadiness;
  readonly executesTransitions: false;
  readonly runtimeStateMachine: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Deterministic foundation summary. */
export interface PolicyGovernanceFoundationSummary {
  readonly foundationId: "EIL-5:1/IntegrationPolicyGovernanceFoundation";
  readonly version: "1.0.0";
  readonly name: "Integration Policy & Governance Foundation";
  readonly namespace: "nexora.eil.integration-policy-governance.foundation";
  readonly status: PolicyGovernanceFoundationStatus;
  readonly readiness: PolicyGovernanceFoundationReadiness;
  readonly governanceCategoryCount: number;
  readonly contractCount: number;
  readonly capabilityCount: number;
  readonly responsibilityCount: number;
  readonly lifecycleStateCount: number;
  readonly ownershipCount: number;
  readonly nonOwnershipCount: number;
  readonly terminologyCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Deterministic foundation inventory. */
export interface IntegrationPolicyGovernanceInventory {
  readonly inventoryId: "EIL-5:1/Inventory";
  readonly governanceCategoryCount: number;
  readonly contractCount: number;
  readonly capabilityCount: number;
  readonly responsibilityCount: number;
  readonly lifecycleStateCount: number;
  readonly totalFoundationEntryCount: number;
  readonly countsDerivedFromCollections: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
