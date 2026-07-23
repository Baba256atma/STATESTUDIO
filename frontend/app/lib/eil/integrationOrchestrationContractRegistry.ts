/**
 * EIL-4:2 — Integration Orchestration Contract Registry.
 *
 * Canonical registry for the ten Foundation orchestration contracts.
 * References Foundation contract identities without redefining architecture.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-4:2.
 */

import { IntegrationOrchestrationFoundationPlatform } from "./integrationOrchestrationFoundation.ts";
import type {
  OrchestrationCompatibilityClassification,
  OrchestrationContractClassification,
  OrchestrationContractRegistryEntry,
} from "./integrationOrchestrationRegistryTypes.ts";

const foundation = IntegrationOrchestrationFoundationPlatform;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.foundationNamespace;

const CONTRACT_CLASSIFICATION: Readonly<
  Record<string, OrchestrationContractClassification>
> = Object.freeze({
  OrchestrationContract: "Orchestration",
  FlowContract: "Flow",
  StepContract: "Step",
  TransitionContract: "Transition",
  TriggerContract: "Trigger",
  DependencyContract: "Dependency",
  CompletionContract: "Completion",
  FailureContract: "Failure",
  StateContract: "State",
  MetadataContract: "Metadata",
});

const COMPATIBILITY: Readonly<
  Record<string, OrchestrationCompatibilityClassification>
> = Object.freeze({
  OrchestrationContract: "Canonical",
  FlowContract: "Flow",
  StepContract: "Step",
  TransitionContract: "Transition",
  TriggerContract: "Trigger",
  DependencyContract: "Dependency",
  CompletionContract: "Completion",
  FailureContract: "Failure",
  StateContract: "State",
  MetadataContract: "Metadata",
});

/**
 * Exactly ten contract registry entries preserving Foundation order.
 */
export const IntegrationOrchestrationContractRegistry: readonly OrchestrationContractRegistryEntry[] =
  Object.freeze(
    foundation.contracts.map((contract) =>
      Object.freeze({
        registryId:
          `EIL-4:2/Registry/Contract/${contract.contractName}` as const,
        canonicalKey: contract.contractName,
        canonicalName: contract.canonicalName,
        contractName: contract.canonicalName,
        category: "Contract" as const,
        description: contract.description,
        contractClassification:
          CONTRACT_CLASSIFICATION[contract.contractName]!,
        architecturalPurpose: contract.description,
        compatibilityClassification: COMPATIBILITY[contract.contractName]!,
        sourcePhase: "EIL-4:1/IntegrationOrchestrationFoundation" as const,
        sourceNamespace: foundationNamespace,
        architecturalOwner: "EIL-4:2" as const,
        status: "Registered" as const,
        lifecycleState: "Verified",
        ordinal: contract.deterministicOrder,
        tags: Object.freeze(["contract", "foundation-reference"]),
        sourceReference: `${foundationId}/contracts/${contract.contractName}`,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );

/** Frozen contract-registry catalog with derived count. */
export const IntegrationOrchestrationContractRegistryCatalog = Object.freeze({
  collectionId: "EIL-4:2/Collection/Contracts",
  category: "Contract" as const,
  sourcePhase: "EIL-4:2" as const,
  entries: IntegrationOrchestrationContractRegistry,
  entryCount: IntegrationOrchestrationContractRegistry.length,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
