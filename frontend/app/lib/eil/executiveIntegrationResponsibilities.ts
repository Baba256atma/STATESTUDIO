/**
 * EIL-1:1 — Executive Integration Responsibilities.
 *
 * Declared coordination responsibilities for the Executive Integration Layer.
 * Metadata only — no runtime execution.
 *
 * Ownership: owned exclusively by EIL-1:1.
 */

import type {
  ExecutiveIntegrationResponsibilityId,
  IntegrationCapability,
} from "./executiveIntegrationFoundationTypes.ts";

export interface ExecutiveIntegrationResponsibilityDeclaration {
  readonly responsibilityId: ExecutiveIntegrationResponsibilityId;
  readonly responsibilityName: string;
  readonly description: string;
  readonly ownedByEil: true;
  readonly executesRuntime: false;
  readonly performsBusinessReasoning: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

const responsibility = (
  responsibilityId: ExecutiveIntegrationResponsibilityId,
  responsibilityName: string,
  description: string,
  order: number,
): ExecutiveIntegrationResponsibilityDeclaration =>
  Object.freeze({
    responsibilityId,
    responsibilityName,
    description,
    ownedByEil: true as const,
    executesRuntime: false as const,
    performsBusinessReasoning: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Exactly eight declared Executive Integration responsibilities. */
export const ExecutiveIntegrationResponsibilities: readonly ExecutiveIntegrationResponsibilityDeclaration[] =
  Object.freeze([
    responsibility(
      "PlatformCoordination",
      "Platform coordination",
      "Coordinate certified platform Public Indexes without owning platform internals.",
      1,
    ),
    responsibility(
      "CrossPlatformRouting",
      "Cross-platform routing",
      "Declare routing paths between platforms without implementing transport.",
      2,
    ),
    responsibility(
      "IntegrationContracts",
      "Integration contracts",
      "Publish immutable integration contracts for cross-platform coordination.",
      3,
    ),
    responsibility(
      "ServiceDiscovery",
      "Service discovery",
      "Declare discovery metadata for certified platform surfaces without runtime lookup.",
      4,
    ),
    responsibility(
      "PlatformInteroperability",
      "Platform interoperability",
      "Declare interoperability rules across certified Nexora platforms.",
      5,
    ),
    responsibility(
      "WorkflowCoordination",
      "Workflow coordination",
      "Declare workflow coordination contracts without executing workflows.",
      6,
    ),
    responsibility(
      "DependencyOrchestration",
      "Dependency orchestration",
      "Declare dependency orchestration rules without runtime dependency resolution.",
      7,
    ),
    responsibility(
      "EventCoordination",
      "Event coordination",
      "Declare event coordination contracts without message-bus or queue behavior.",
      8,
    ),
  ]);

const capability = (
  responsibilityId: ExecutiveIntegrationResponsibilityId,
  capabilityName: string,
  order: number,
): IntegrationCapability =>
  Object.freeze({
    capabilityId: `EIL-1:1/Capability/${responsibilityId}`,
    capabilityName,
    responsibilityId,
    ownedByEil: true as const,
    performsInference: false as const,
    performsDecision: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Capability descriptors bound 1:1 to responsibilities. */
export const ExecutiveIntegrationCapabilityCatalog: readonly IntegrationCapability[] =
  Object.freeze([
    capability("PlatformCoordination", "Platform Coordination Capability", 1),
    capability("CrossPlatformRouting", "Cross-Platform Routing Capability", 2),
    capability("IntegrationContracts", "Integration Contracts Capability", 3),
    capability("ServiceDiscovery", "Service Discovery Capability", 4),
    capability(
      "PlatformInteroperability",
      "Platform Interoperability Capability",
      5,
    ),
    capability("WorkflowCoordination", "Workflow Coordination Capability", 6),
    capability(
      "DependencyOrchestration",
      "Dependency Orchestration Capability",
      7,
    ),
    capability("EventCoordination", "Event Coordination Capability", 8),
  ]);

/** Canonical immutable responsibilities aggregate. */
export const ExecutiveIntegrationResponsibilityCatalog = Object.freeze({
  catalogId: "EIL-1:1/ExecutiveIntegrationResponsibilities",
  sourcePhase: "EIL-1:1" as const,
  responsibilities: ExecutiveIntegrationResponsibilities,
  capabilities: ExecutiveIntegrationCapabilityCatalog,
  responsibilityCount: ExecutiveIntegrationResponsibilities.length,
  capabilityCount: ExecutiveIntegrationCapabilityCatalog.length,
  executesRuntime: false as const,
  performsBusinessReasoning: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
