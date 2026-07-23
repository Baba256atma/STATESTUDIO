/**
 * EIL-1:1 — Integration Foundation Capabilities.
 *
 * Descriptive capability declarations for the Integration Foundation.
 * No runtime execution.
 *
 * Ownership: owned exclusively by EIL-1:1.
 */

import type {
  IntegrationCapabilityDeclaration,
  IntegrationCapabilityId,
} from "./integrationFoundationTypes.ts";

const capability = (
  capabilityKey: IntegrationCapabilityId,
  capabilityName: string,
  description: string,
  order: number,
): IntegrationCapabilityDeclaration =>
  Object.freeze({
    capabilityId: `EIL-1:1/Capability/${capabilityKey}` as const,
    capabilityKey,
    capabilityName,
    description,
    ownedByEil: true as const,
    executesRuntime: false as const,
    performsInference: false as const,
    performsDecision: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly ten descriptive Integration Foundation capabilities.
 * Canonical collection for derived inventory counts.
 */
export const IntegrationFoundationCapabilities: readonly IntegrationCapabilityDeclaration[] =
  Object.freeze([
    capability(
      "PlatformIntegration",
      "Platform integration",
      "Declare metadata for integrating certified Nexora platforms without owning their internals.",
      1,
    ),
    capability(
      "RoutingCoordination",
      "Routing coordination",
      "Declare routing coordination paths between platforms without networking.",
      2,
    ),
    capability(
      "DependencyAwareness",
      "Dependency awareness",
      "Declare dependency direction and awareness rules without resolution engines.",
      3,
    ),
    capability(
      "Interoperability",
      "Interoperability",
      "Declare interoperability metadata across coordinated platforms.",
      4,
    ),
    capability(
      "CompatibilityValidation",
      "Compatibility validation",
      "Declare compatibility validation metadata without runtime validators.",
      5,
    ),
    capability(
      "ServiceDiscovery",
      "Service discovery",
      "Declare service-discovery metadata without lookup or registry runtime.",
      6,
    ),
    capability(
      "ContractPreservation",
      "Contract preservation",
      "Declare preservation of canonical integration contracts across phases.",
      7,
    ),
    capability(
      "OrchestrationSupport",
      "Orchestration support",
      "Declare orchestration-support metadata without an orchestration engine.",
      8,
    ),
    capability(
      "IntegrationLifecycleAwareness",
      "Integration lifecycle awareness",
      "Declare lifecycle-awareness metadata for integration surfaces.",
      9,
    ),
    capability(
      "ExecutiveCoordination",
      "Executive coordination",
      "Declare executive coordination metadata without business-logic execution.",
      10,
    ),
  ]);

/** Canonical immutable capabilities catalog. */
export const IntegrationFoundationCapabilityCatalog = Object.freeze({
  catalogId: "EIL-1:1/IntegrationFoundationCapabilities",
  sourcePhase: "EIL-1:1" as const,
  capabilities: IntegrationFoundationCapabilities,
  capabilityCount: IntegrationFoundationCapabilities.length,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
