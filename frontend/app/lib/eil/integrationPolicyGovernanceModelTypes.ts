/**
 * EIL-5:3 — Integration Policy & Governance Model Types.
 *
 * Readonly contracts and closed vocabularies for the Integration Policy & Governance Model.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-5:3.
 */

/** Model status for EIL-5:3. */
export type PolicyGovernanceModelStatus = "Model";

/** Immediate downstream readiness — Validation only. */
export type PolicyGovernanceModelReadiness = "ReadyForValidation";

/** Closed domain-model category vocabulary. */
export type PolicyGovernanceDomainModelKey =
  | "GovernancePolicy"
  | "GovernanceRule"
  | "GovernanceScope"
  | "GovernanceBoundary"
  | "ComplianceRequirement"
  | "ComplianceDeclaration"
  | "PolicyVersion"
  | "PolicyLifecycle"
  | "PolicyDependency"
  | "PolicyCompatibility"
  | "PolicyMetadata"
  | "GovernanceOwner"
  | "GovernanceContext"
  | "GovernanceInventory"
  | "GovernanceClassification"
  | "ExecutiveGovernanceBoundary";

/** Closed relationship-type vocabulary. */
export type PolicyGovernanceRelationshipType =
  | "owns"
  | "references"
  | "dependsOn"
  | "compatibleWith"
  | "governedBy"
  | "classifiedAs"
  | "belongsTo"
  | "composedOf"
  | "extends"
  | "validates"
  | "constrains"
  | "inherits";

/** Closed topology-model vocabulary. */
export type PolicyGovernanceTopologyKey =
  | "Linear"
  | "Hierarchical"
  | "Tree"
  | "Mesh"
  | "Hub"
  | "Composite"
  | "Layered"
  | "Executive";

/** Closed lifecycle-state vocabulary. */
export type PolicyGovernanceModelLifecycleState =
  | "Declared"
  | "Designed"
  | "Verified"
  | "Certified"
  | "Frozen"
  | "Released"
  | "Deprecated"
  | "Retired";

/** Closed model ownership vocabulary. */
export type PolicyGovernanceModelOwnership =
  | "EIL-5:3"
  | "EIL-5 Integration Policy & Governance Model";

/** Immutable registry reference — never duplicates registry values. */
export interface PolicyGovernanceRegistryReference {
  readonly registryId: "EIL-5:2/IntegrationPolicyGovernanceRegistry";
  readonly registryNamespace: "nexora.eil.integration-policy-governance.registry";
  readonly entryPoint: "integrationPolicyGovernanceRegistry.ts";
  readonly collection:
    | "categories"
    | "contracts"
    | "capabilities"
    | "responsibilities"
    | "lifecycleCoverage"
    | "ownershipCoverage"
    | "collections";
  readonly entryKey: string;
  readonly preservesCanonicalReference: true;
  readonly duplicatesRegistryValue: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Base immutable domain model descriptor. */
export interface IntegrationPolicyGovernanceDomainModel {
  readonly modelId: `EIL-5:3/Model/${PolicyGovernanceDomainModelKey}`;
  readonly canonicalKey: PolicyGovernanceDomainModelKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: PolicyGovernanceModelOwnership;
  readonly lifecycle: PolicyGovernanceModelLifecycleState;
  readonly sourceRegistryReference: PolicyGovernanceRegistryReference;
  readonly sourceReference: string;
  readonly version: "1.0.0";
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable relationship model. */
export interface IntegrationPolicyGovernanceRelationshipModel {
  readonly relationshipId: `EIL-5:3/Relationship/${string}`;
  readonly relationshipType: PolicyGovernanceRelationshipType;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly sourceModel: PolicyGovernanceDomainModelKey;
  readonly targetModel: PolicyGovernanceDomainModelKey;
  readonly ownership: PolicyGovernanceModelOwnership;
  readonly lifecycle: PolicyGovernanceModelLifecycleState;
  readonly sourceRegistryReference: PolicyGovernanceRegistryReference;
  readonly sourceReference: string;
  readonly version: "1.0.0";
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly resolvesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable topology model. */
export interface IntegrationPolicyGovernanceTopologyModel {
  readonly topologyModelId: `EIL-5:3/Topology/${PolicyGovernanceTopologyKey}`;
  readonly canonicalKey: PolicyGovernanceTopologyKey;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: PolicyGovernanceModelOwnership;
  readonly lifecycle: PolicyGovernanceModelLifecycleState;
  readonly sourceRegistryReference: PolicyGovernanceRegistryReference;
  readonly sourceReference: string;
  readonly version: "1.0.0";
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly graphEngine: false;
  readonly governanceEngine: false;
  readonly visualization: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Immutable lifecycle mapping model. */
export interface IntegrationPolicyGovernanceLifecycleModel {
  readonly lifecycleModelId: `EIL-5:3/Lifecycle/${PolicyGovernanceModelLifecycleState}`;
  readonly canonicalKey: PolicyGovernanceModelLifecycleState;
  readonly canonicalName: string;
  readonly description: string;
  readonly ownership: PolicyGovernanceModelOwnership;
  readonly lifecycle: PolicyGovernanceModelLifecycleState;
  readonly sourceRegistryReference: PolicyGovernanceRegistryReference;
  readonly sourceReference: string;
  readonly version: "1.0.0";
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly executesTransitions: false;
  readonly runtimeStateMachine: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Canonical model identity descriptor. */
export interface IntegrationPolicyGovernanceModelIdentity {
  readonly phaseId: "EIL-5:3";
  readonly canonicalId: "EIL-5:3/IntegrationPolicyGovernanceModel";
  readonly name: "Integration Policy & Governance Model";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-policy-governance.model";
  readonly layer: "EIL";
  readonly platform: "EIL-5";
  readonly phaseType: "Model";
  readonly status: PolicyGovernanceModelStatus;
  readonly readiness: PolicyGovernanceModelReadiness;
  readonly registryDependency: "EIL-5:2/IntegrationPolicyGovernanceRegistry";
  readonly registryEntryPoint: "integrationPolicyGovernanceRegistry.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Aggregate model collections. */
export interface IntegrationPolicyGovernanceModelCollections {
  readonly collectionsId: "EIL-5:3/Collections";
  readonly sourcePhase: "EIL-5:3";
  readonly domains: readonly IntegrationPolicyGovernanceDomainModel[];
  readonly relationships: readonly IntegrationPolicyGovernanceRelationshipModel[];
  readonly topologies: readonly IntegrationPolicyGovernanceTopologyModel[];
  readonly lifecycles: readonly IntegrationPolicyGovernanceLifecycleModel[];
  readonly domainModelCount: number;
  readonly relationshipModelCount: number;
  readonly topologyModelCount: number;
  readonly lifecycleModelCount: number;
  readonly totalModelEntryCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Aggregate model inventory. */
export interface IntegrationPolicyGovernanceModelInventory {
  readonly inventoryId: "EIL-5:3/Inventory";
  readonly domainModelCount: number;
  readonly relationshipModelCount: number;
  readonly topologyModelCount: number;
  readonly lifecycleModelCount: number;
  readonly totalModelEntryCount: number;
  readonly countsDerivedFromCollections: true;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/** Aggregate model summary. */
export interface IntegrationPolicyGovernanceModelSummary {
  readonly modelId: "EIL-5:3/IntegrationPolicyGovernanceModel";
  readonly version: "1.0.0";
  readonly name: "Integration Policy & Governance Model";
  readonly namespace: "nexora.eil.integration-policy-governance.model";
  readonly status: PolicyGovernanceModelStatus;
  readonly readiness: PolicyGovernanceModelReadiness;
  readonly registryId: "EIL-5:2/IntegrationPolicyGovernanceRegistry";
  readonly domainModelCount: number;
  readonly relationshipModelCount: number;
  readonly topologyModelCount: number;
  readonly lifecycleModelCount: number;
  readonly totalModelEntryCount: number;
  readonly nextPhase: "EIL-5:4 — Integration Policy & Governance Validation";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
