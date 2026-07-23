/**
 * EIL-5:2 — Integration Policy & Governance Registry Types.
 *
 * Readonly contracts and closed vocabularies for the Integration Policy & Governance Registry.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-5:2.
 */

/** Registry status for EIL-5:2. */
export type PolicyGovernanceRegistryStatus = "Registry";

/** Immediate downstream readiness — Model only. */
export type PolicyGovernanceRegistryReadiness = "ReadyForModel";

/** Closed registry-category vocabulary. */
export type PolicyGovernanceRegistryCategory =
  | "Category"
  | "Contract"
  | "Capability"
  | "Responsibility"
  | "Lifecycle"
  | "Ownership";

/** Closed registry ownership vocabulary. */
export type PolicyGovernanceRegistryOwnership =
  | "EIL-5:2"
  | "EIL-5 Integration Policy & Governance Registry";

/** Closed registry entry status vocabulary. */
export type PolicyGovernanceRegistryEntryStatus = "Registered";

/** Closed registry source vocabulary. */
export type PolicyGovernanceRegistrySource =
  | "EIL-5:1"
  | "EIL-5:1/IntegrationPolicyGovernanceFoundation";

/** Closed policy classification (metadata only). */
export type PolicyGovernancePolicyClassification =
  | "Identity"
  | "Access"
  | "Dependency"
  | "Compatibility"
  | "Version"
  | "Lifecycle"
  | "Inventory"
  | "Compliance"
  | "Security"
  | "Executive";

/** Closed governance scope (metadata only). */
export type PolicyGovernanceScope =
  | "Identity"
  | "Access"
  | "Dependency"
  | "Compatibility"
  | "Version"
  | "Lifecycle"
  | "Inventory"
  | "Compliance"
  | "Security"
  | "Executive";

/** Closed contract classification (metadata only). */
export type PolicyGovernanceContractClassification =
  | "Policy"
  | "GovernanceRule"
  | "GovernanceBoundary"
  | "GovernanceScope"
  | "Compliance"
  | "PolicyLifecycle"
  | "PolicyVersion"
  | "PolicyMetadata"
  | "PolicyCompatibility"
  | "GovernanceIdentity";

/** Closed compatibility classification (metadata only). */
export type PolicyGovernanceCompatibilityClassification =
  | "Canonical"
  | "Rule"
  | "Boundary"
  | "Scope"
  | "Compliance"
  | "Lifecycle"
  | "Version"
  | "Metadata"
  | "Compatibility"
  | "Identity";

/** Closed compliance classification (metadata only). */
export type PolicyGovernanceComplianceClassification =
  | "Declarative"
  | "Boundary"
  | "Scope"
  | "Contractual"
  | "Lifecycle"
  | "Version"
  | "Metadata"
  | "Compatibility"
  | "Identity"
  | "Canonical";

/** Closed responsibility classification (metadata only). */
export type PolicyGovernanceResponsibilityClassification =
  | "Identity"
  | "Boundary"
  | "Publication"
  | "Dependency"
  | "Compatibility"
  | "Inventory"
  | "RuntimeSupport"
  | "Consistency";

/** Registry entry ID branded shape. */
export type PolicyGovernanceRegistryEntryId = `EIL-5:2/Registry/${string}`;

/** Base immutable registry entry. */
export interface IntegrationPolicyGovernanceRegistryEntry {
  readonly registryId: PolicyGovernanceRegistryEntryId;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: PolicyGovernanceRegistryCategory;
  readonly sourcePhase: PolicyGovernanceRegistrySource;
  readonly sourceNamespace: "nexora.eil.integration-policy-governance.foundation";
  readonly sourceReference: string;
  readonly architecturalOwner: PolicyGovernanceRegistryOwnership;
  readonly lifecycleState: string;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly status: PolicyGovernanceRegistryEntryStatus;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Category-specific registry entry. */
export interface IntegrationPolicyGovernanceCategoryRegistryEntry
  extends IntegrationPolicyGovernanceRegistryEntry {
  readonly category: "Category";
  readonly name: string;
  readonly policyClassification: PolicyGovernancePolicyClassification;
  readonly governanceScope: PolicyGovernanceScope;
  readonly ownership: PolicyGovernanceRegistryOwnership;
}

/** Contract-specific registry entry. */
export interface IntegrationPolicyGovernanceContractRegistryEntry
  extends IntegrationPolicyGovernanceRegistryEntry {
  readonly category: "Contract";
  readonly contractName: string;
  readonly contractClassification: PolicyGovernanceContractClassification;
  readonly architecturalPurpose: string;
  readonly compatibilityClassification: PolicyGovernanceCompatibilityClassification;
  readonly complianceClassification: PolicyGovernanceComplianceClassification;
}

/** Capability-specific registry entry. */
export interface IntegrationPolicyGovernanceCapabilityRegistryEntry
  extends IntegrationPolicyGovernanceRegistryEntry {
  readonly category: "Capability";
  readonly capabilityName: string;
  readonly ownership: PolicyGovernanceRegistryOwnership;
}

/** Responsibility-specific registry entry. */
export interface IntegrationPolicyGovernanceResponsibilityRegistryEntry
  extends IntegrationPolicyGovernanceRegistryEntry {
  readonly category: "Responsibility";
  readonly responsibilityName: string;
  readonly responsibilityClassification: PolicyGovernanceResponsibilityClassification;
}

/** Immutable Foundation/source reference. */
export interface IntegrationPolicyGovernanceRegistryReference {
  readonly referenceId: string;
  readonly sourcePhase: PolicyGovernanceRegistrySource;
  readonly sourceReference: string;
  readonly registered: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Canonical registry identity descriptor. */
export interface IntegrationPolicyGovernanceRegistryIdentity {
  readonly phaseId: "EIL-5:2";
  readonly canonicalId: "EIL-5:2/IntegrationPolicyGovernanceRegistry";
  readonly name: "Integration Policy & Governance Registry";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-policy-governance.registry";
  readonly layer: "EIL";
  readonly platform: "EIL-5";
  readonly phaseType: "Registry";
  readonly status: PolicyGovernanceRegistryStatus;
  readonly readiness: PolicyGovernanceRegistryReadiness;
  readonly foundationDependency: "EIL-5:1/IntegrationPolicyGovernanceFoundation";
  readonly foundationEntryPoint: "integrationPolicyGovernanceFoundation.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Aggregate registry collections. */
export interface IntegrationPolicyGovernanceRegistryCollections {
  readonly collectionsId: "EIL-5:2/Collections";
  readonly sourcePhase: "EIL-5:2";
  readonly categories: readonly IntegrationPolicyGovernanceCategoryRegistryEntry[];
  readonly contracts: readonly IntegrationPolicyGovernanceContractRegistryEntry[];
  readonly capabilities: readonly IntegrationPolicyGovernanceCapabilityRegistryEntry[];
  readonly responsibilities: readonly IntegrationPolicyGovernanceResponsibilityRegistryEntry[];
  readonly categoryCount: number;
  readonly contractCount: number;
  readonly capabilityCount: number;
  readonly responsibilityCount: number;
  readonly lifecycleStateCount: number;
  readonly totalRegistryEntryCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Aggregate registry inventory. */
export interface IntegrationPolicyGovernanceRegistryInventory {
  readonly inventoryId: "EIL-5:2/Inventory";
  readonly categoryCount: number;
  readonly contractCount: number;
  readonly capabilityCount: number;
  readonly responsibilityCount: number;
  readonly lifecycleStateCount: number;
  readonly totalRegistryEntryCount: number;
  readonly countsDerivedFromCollections: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Aggregate registry summary. */
export interface IntegrationPolicyGovernanceRegistrySummary {
  readonly registryId: "EIL-5:2/IntegrationPolicyGovernanceRegistry";
  readonly version: "1.0.0";
  readonly name: "Integration Policy & Governance Registry";
  readonly namespace: "nexora.eil.integration-policy-governance.registry";
  readonly status: PolicyGovernanceRegistryStatus;
  readonly readiness: PolicyGovernanceRegistryReadiness;
  readonly foundationId: "EIL-5:1/IntegrationPolicyGovernanceFoundation";
  readonly categoryCount: number;
  readonly contractCount: number;
  readonly capabilityCount: number;
  readonly responsibilityCount: number;
  readonly lifecycleStateCount: number;
  readonly totalRegistryEntryCount: number;
  readonly nextPhase: "EIL-5:3 — Integration Policy & Governance Model";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
