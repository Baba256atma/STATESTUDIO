/**
 * NEA-5:1 — Gateway Routing Capabilities.
 *
 * Immutable capability declarations for Gateway Routing Foundation.
 * Capabilities are declarative only — no runtime execution.
 *
 * Ownership: owned exclusively by NEA-5:1.
 */

import type {
  GatewayRoutingCapabilityDeclaration,
  GatewayRoutingCapabilityId,
} from "./gatewayRoutingFoundationTypes.ts";

const capability = (
  capabilityId: GatewayRoutingCapabilityId,
  capabilityName: string,
  description: string,
  order: number,
): GatewayRoutingCapabilityDeclaration =>
  Object.freeze({
    capabilityId,
    capabilityName,
    description,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical routing capability catalog — exactly nine. */
export const GatewayRoutingCapabilities: readonly GatewayRoutingCapabilityDeclaration[] =
  Object.freeze([
    capability(
      "DestinationResolution",
      "Destination Resolution",
      "Declarative ability to declare destination resolution metadata.",
      1,
    ),
    capability(
      "ConsumerSelection",
      "Consumer Selection",
      "Declarative ability to declare consumer selection vocabulary.",
      2,
    ),
    capability(
      "ContextPropagation",
      "Context Propagation",
      "Declarative ability to declare context propagation vocabulary.",
      3,
    ),
    capability(
      "RouteMetadataDeclaration",
      "Route Metadata Declaration",
      "Declarative ability to declare route metadata surfaces.",
      4,
    ),
    capability(
      "RoutePolicyDeclaration",
      "Route Policy Declaration",
      "Declarative ability to declare route policy metadata.",
      5,
    ),
    capability(
      "PriorityDeclaration",
      "Priority Declaration",
      "Declarative ability to declare routing priority vocabulary.",
      6,
    ),
    capability(
      "CorrelationPropagation",
      "Correlation Propagation",
      "Declarative ability to declare correlation propagation vocabulary.",
      7,
    ),
    capability(
      "RoutingSummaryDeclaration",
      "Routing Summary Declaration",
      "Declarative ability to declare routing summary metadata.",
      8,
    ),
    capability(
      "RoutingResultDeclaration",
      "Routing Result Declaration",
      "Declarative ability to declare routing result vocabulary.",
      9,
    ),
  ]);

/** Canonical immutable capability catalog. */
export const GatewayRoutingCapabilityCatalog = Object.freeze({
  catalogId: "NEA-5:1/CapabilityCatalog",
  sourcePhase: "NEA-5:1" as const,
  capabilities: GatewayRoutingCapabilities,
  capabilityCount: GatewayRoutingCapabilities.length,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
