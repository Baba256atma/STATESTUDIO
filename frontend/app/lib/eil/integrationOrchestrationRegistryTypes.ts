/**
 * EIL-4:2 — Integration Orchestration Registry Types.
 *
 * Readonly contracts and closed vocabularies for the Integration Orchestration Registry.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-4:2.
 */

/** Registry status for EIL-4:2. */
export type OrchestrationRegistryStatus = "Registry";

/** Immediate downstream readiness — Model only. */
export type OrchestrationRegistryReadiness = "ReadyForModel";

/** Closed registry-category vocabulary. */
export type OrchestrationRegistryCategory =
  | "Category"
  | "Contract"
  | "Capability"
  | "Responsibility"
  | "Lifecycle"
  | "Ownership";

/** Closed registry ownership vocabulary. */
export type OrchestrationRegistryOwnership =
  | "EIL-4:2"
  | "EIL-4 Integration Orchestration Registry";

/** Closed registry entry status vocabulary. */
export type OrchestrationRegistryEntryStatus = "Registered";

/** Closed registry source vocabulary. */
export type OrchestrationRegistrySource =
  | "EIL-4:1"
  | "EIL-4:1/IntegrationOrchestrationFoundation";

/** Closed flow classification (metadata only). */
export type OrchestrationFlowClassification =
  | "Sequential"
  | "Parallel"
  | "Conditional"
  | "EventDriven"
  | "Scheduled"
  | "Approval"
  | "Recovery"
  | "Compensation"
  | "Composite"
  | "Executive";

/** Closed contract classification (metadata only). */
export type OrchestrationContractClassification =
  | "Orchestration"
  | "Flow"
  | "Step"
  | "Transition"
  | "Trigger"
  | "Dependency"
  | "Completion"
  | "Failure"
  | "State"
  | "Metadata";

/** Closed compatibility classification (metadata only). */
export type OrchestrationCompatibilityClassification =
  | "Canonical"
  | "Flow"
  | "Step"
  | "Transition"
  | "Trigger"
  | "Dependency"
  | "Completion"
  | "Failure"
  | "State"
  | "Metadata";

/** Closed responsibility classification (metadata only). */
export type OrchestrationResponsibilityClassification =
  | "Identity"
  | "Boundary"
  | "Publication"
  | "Dependency"
  | "Compatibility"
  | "Inventory"
  | "RuntimeSupport"
  | "Consistency";

/** Registry entry ID branded shape. */
export type OrchestrationRegistryEntryId = `EIL-4:2/Registry/${string}`;

/** Base immutable registry entry. */
export interface OrchestrationRegistryEntry {
  readonly registryId: OrchestrationRegistryEntryId;
  readonly canonicalKey: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: OrchestrationRegistryCategory;
  readonly sourcePhase: OrchestrationRegistrySource;
  readonly sourceNamespace: "nexora.eil.integration-orchestration.foundation";
  readonly sourceReference: string;
  readonly architecturalOwner: OrchestrationRegistryOwnership;
  readonly lifecycleState: string;
  readonly ordinal: number;
  readonly tags: readonly string[];
  readonly status: OrchestrationRegistryEntryStatus;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Category-specific registry entry. */
export interface OrchestrationCategoryRegistryEntry
  extends OrchestrationRegistryEntry {
  readonly category: "Category";
  readonly name: string;
  readonly flowClassification: OrchestrationFlowClassification;
  readonly ownership: OrchestrationRegistryOwnership;
}

/** Contract-specific registry entry. */
export interface OrchestrationContractRegistryEntry
  extends OrchestrationRegistryEntry {
  readonly category: "Contract";
  readonly contractName: string;
  readonly contractClassification: OrchestrationContractClassification;
  readonly architecturalPurpose: string;
  readonly compatibilityClassification: OrchestrationCompatibilityClassification;
}

/** Capability-specific registry entry. */
export interface OrchestrationCapabilityRegistryEntry
  extends OrchestrationRegistryEntry {
  readonly category: "Capability";
  readonly capabilityName: string;
  readonly ownership: OrchestrationRegistryOwnership;
}

/** Responsibility-specific registry entry. */
export interface OrchestrationResponsibilityRegistryEntry
  extends OrchestrationRegistryEntry {
  readonly category: "Responsibility";
  readonly responsibilityName: string;
  readonly responsibilityClassification: OrchestrationResponsibilityClassification;
}

/** Immutable Foundation/source reference. */
export interface OrchestrationRegistryReference {
  readonly referenceId: string;
  readonly sourcePhase: OrchestrationRegistrySource;
  readonly sourceReference: string;
  readonly registered: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Canonical registry identity descriptor. */
export interface OrchestrationRegistryIdentity {
  readonly phaseId: "EIL-4:2";
  readonly canonicalId: "EIL-4:2/IntegrationOrchestrationRegistry";
  readonly name: "Integration Orchestration Registry";
  readonly version: "1.0.0";
  readonly namespace: "nexora.eil.integration-orchestration.registry";
  readonly layer: "EIL";
  readonly platform: "EIL-4";
  readonly phaseType: "Registry";
  readonly status: OrchestrationRegistryStatus;
  readonly readiness: OrchestrationRegistryReadiness;
  readonly foundationDependency: "EIL-4:1/IntegrationOrchestrationFoundation";
  readonly foundationEntryPoint: "integrationOrchestrationFoundation.ts";
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Aggregate registry collections. */
export interface OrchestrationRegistryCollections {
  readonly collectionsId: "EIL-4:2/Collections";
  readonly sourcePhase: "EIL-4:2";
  readonly categories: readonly OrchestrationCategoryRegistryEntry[];
  readonly contracts: readonly OrchestrationContractRegistryEntry[];
  readonly capabilities: readonly OrchestrationCapabilityRegistryEntry[];
  readonly responsibilities: readonly OrchestrationResponsibilityRegistryEntry[];
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
export interface OrchestrationRegistryInventory {
  readonly inventoryId: "EIL-4:2/Inventory";
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
export interface OrchestrationRegistrySummary {
  readonly registryId: "EIL-4:2/IntegrationOrchestrationRegistry";
  readonly version: "1.0.0";
  readonly name: "Integration Orchestration Registry";
  readonly namespace: "nexora.eil.integration-orchestration.registry";
  readonly status: OrchestrationRegistryStatus;
  readonly readiness: OrchestrationRegistryReadiness;
  readonly foundationId: "EIL-4:1/IntegrationOrchestrationFoundation";
  readonly categoryCount: number;
  readonly contractCount: number;
  readonly capabilityCount: number;
  readonly responsibilityCount: number;
  readonly lifecycleStateCount: number;
  readonly totalRegistryEntryCount: number;
  readonly nextPhase: "EIL-4:3 — Integration Orchestration Model";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
