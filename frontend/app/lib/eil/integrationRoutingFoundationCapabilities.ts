/**
 * EIL-3:1 — Integration Routing Foundation Capabilities.
 *
 * Descriptive capability declarations for the Integration Routing Foundation.
 * No runtime execution.
 *
 * Ownership: owned exclusively by EIL-3:1.
 */

import type {
  RoutingCapability,
  RoutingCapabilityId,
} from "./integrationRoutingFoundationTypes.ts";

const capability = (
  capabilityKey: RoutingCapabilityId,
  capabilityName: string,
  description: string,
  order: number,
): RoutingCapability =>
  Object.freeze({
    capabilityId: `EIL-3:1/Capability/${capabilityKey}` as const,
    capabilityKey,
    capabilityName,
    description,
    ownedByEil3: true as const,
    executesRuntime: false as const,
    performsRouting: false as const,
    performsNetworking: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly ten descriptive Integration Routing Foundation capabilities.
 * Canonical collection for derived inventory counts.
 */
export const IntegrationRoutingFoundationCapabilities: readonly RoutingCapability[] =
  Object.freeze([
    capability(
      "RouteClassification",
      "Route classification",
      "Declare route category classification metadata without runtime classifiers.",
      1,
    ),
    capability(
      "RouteDescription",
      "Route description",
      "Declare route description metadata without route execution.",
      2,
    ),
    capability(
      "RouteMetadata",
      "Route metadata",
      "Declare route metadata envelopes without persistence or storage.",
      3,
    ),
    capability(
      "RouteDependencyDeclaration",
      "Route dependency declaration",
      "Declare route dependency-direction metadata without resolution engines.",
      4,
    ),
    capability(
      "RouteCompatibilityDeclaration",
      "Route compatibility declaration",
      "Declare route compatibility metadata without runtime validators.",
      5,
    ),
    capability(
      "RouteLifecycleAwareness",
      "Route lifecycle awareness",
      "Declare route lifecycle-awareness metadata without state machines.",
      6,
    ),
    capability(
      "RoutePolicyDescription",
      "Route policy description",
      "Declare route policy description metadata without policy evaluation.",
      7,
    ),
    capability(
      "RouteConfigurationMetadata",
      "Route configuration metadata",
      "Declare route configuration metadata without configuration engines.",
      8,
    ),
    capability(
      "RouteInventorySupport",
      "Route inventory support",
      "Declare route inventory support metadata derived from canonical collections.",
      9,
    ),
    capability(
      "RouteReadinessDeclaration",
      "Route readiness declaration",
      "Declare route readiness metadata for future registry phases.",
      10,
    ),
  ]);

/** Canonical immutable capabilities catalog. */
export const IntegrationRoutingFoundationCapabilityCatalog = Object.freeze({
  catalogId: "EIL-3:1/IntegrationRoutingFoundationCapabilities",
  sourcePhase: "EIL-3:1" as const,
  capabilities: IntegrationRoutingFoundationCapabilities,
  capabilityCount: IntegrationRoutingFoundationCapabilities.length,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
