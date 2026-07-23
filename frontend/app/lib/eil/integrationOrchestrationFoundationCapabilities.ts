/**
 * EIL-4:1 — Integration Orchestration Foundation Capabilities.
 *
 * Descriptive capability declarations for the Integration Orchestration Foundation.
 * No runtime execution.
 *
 * Ownership: owned exclusively by EIL-4:1.
 */

import type {
  OrchestrationCapability,
  OrchestrationCapabilityId,
} from "./integrationOrchestrationFoundationTypes.ts";

const capability = (
  capabilityKey: OrchestrationCapabilityId,
  capabilityName: string,
  description: string,
  order: number,
): OrchestrationCapability =>
  Object.freeze({
    capabilityId: `EIL-4:1/Capability/${capabilityKey}` as const,
    capabilityKey,
    capabilityName,
    description,
    ownedByEil4: true as const,
    executesRuntime: false as const,
    performsOrchestration: false as const,
    performsNetworking: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly ten descriptive Integration Orchestration Foundation capabilities.
 * Canonical collection for derived inventory counts.
 */
export const IntegrationOrchestrationFoundationCapabilities: readonly OrchestrationCapability[] =
  Object.freeze([
    capability(
      "FlowDescription",
      "Flow description",
      "Declare orchestration flow description metadata without workflow execution.",
      1,
    ),
    capability(
      "StepDescription",
      "Step description",
      "Declare orchestration step description metadata without step execution.",
      2,
    ),
    capability(
      "DependencyDeclaration",
      "Dependency declaration",
      "Declare orchestration dependency-direction metadata without resolution engines.",
      3,
    ),
    capability(
      "TransitionDescription",
      "Transition description",
      "Declare orchestration transition description metadata without transition engines.",
      4,
    ),
    capability(
      "StateDescription",
      "State description",
      "Declare orchestration state description metadata without state machines.",
      5,
    ),
    capability(
      "TriggerDeclaration",
      "Trigger declaration",
      "Declare orchestration trigger metadata without trigger firing runtime.",
      6,
    ),
    capability(
      "CompletionDeclaration",
      "Completion declaration",
      "Declare orchestration completion metadata without completion handlers.",
      7,
    ),
    capability(
      "FailureDeclaration",
      "Failure declaration",
      "Declare orchestration failure metadata without recovery engines.",
      8,
    ),
    capability(
      "InventorySupport",
      "Inventory support",
      "Declare orchestration inventory support metadata derived from canonical collections.",
      9,
    ),
    capability(
      "OrchestrationReadiness",
      "Orchestration readiness",
      "Declare orchestration readiness metadata for future registry phases.",
      10,
    ),
  ]);

/** Canonical immutable capabilities catalog. */
export const IntegrationOrchestrationFoundationCapabilityCatalog =
  Object.freeze({
    catalogId: "EIL-4:1/IntegrationOrchestrationFoundationCapabilities",
    sourcePhase: "EIL-4:1" as const,
    capabilities: IntegrationOrchestrationFoundationCapabilities,
    capabilityCount: IntegrationOrchestrationFoundationCapabilities.length,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
