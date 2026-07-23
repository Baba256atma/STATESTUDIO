/**
 * EIL-2:1 — Integration Connector Foundation Capabilities.
 *
 * Descriptive capability declarations for the Integration Connector Foundation.
 * No runtime execution.
 *
 * Ownership: owned exclusively by EIL-2:1.
 */

import type {
  IntegrationConnectorCapability,
  IntegrationConnectorCapabilityId,
} from "./integrationConnectorFoundationTypes.ts";

const capability = (
  capabilityKey: IntegrationConnectorCapabilityId,
  capabilityName: string,
  description: string,
  order: number,
): IntegrationConnectorCapability =>
  Object.freeze({
    capabilityId: `EIL-2:1/Capability/${capabilityKey}` as const,
    capabilityKey,
    capabilityName,
    description,
    ownedByEil2: true as const,
    executesRuntime: false as const,
    performsNetworking: false as const,
    performsAuthentication: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly ten descriptive Integration Connector Foundation capabilities.
 * Canonical collection for derived inventory counts.
 */
export const IntegrationConnectorFoundationCapabilities: readonly IntegrationConnectorCapability[] =
  Object.freeze([
    capability(
      "ConnectorRegistration",
      "Connector registration",
      "Declare connector registration metadata without a registration runtime.",
      1,
    ),
    capability(
      "ConnectorDiscoveryMetadata",
      "Connector discovery metadata",
      "Declare connector discovery metadata without lookup or networking.",
      2,
    ),
    capability(
      "EndpointDescription",
      "Endpoint description",
      "Declare endpoint description metadata without reachable transports.",
      3,
    ),
    capability(
      "ProtocolDeclaration",
      "Protocol declaration",
      "Declare protocol metadata without protocol client or server implementation.",
      4,
    ),
    capability(
      "CompatibilityDeclaration",
      "Compatibility declaration",
      "Declare connector compatibility metadata without runtime validators.",
      5,
    ),
    capability(
      "LifecycleAwareness",
      "Lifecycle awareness",
      "Declare connector lifecycle-awareness metadata without state machines.",
      6,
    ),
    capability(
      "DependencyAwareness",
      "Dependency awareness",
      "Declare connector dependency-direction metadata without resolution engines.",
      7,
    ),
    capability(
      "ConfigurationMetadata",
      "Configuration metadata",
      "Declare connector configuration metadata without configuration engines.",
      8,
    ),
    capability(
      "ConnectorClassification",
      "Connector classification",
      "Declare connector category classification metadata without runtime classifiers.",
      9,
    ),
    capability(
      "IntegrationReadiness",
      "Integration readiness",
      "Declare connector integration-readiness metadata for future registry phases.",
      10,
    ),
  ]);

/** Canonical immutable capabilities catalog. */
export const IntegrationConnectorFoundationCapabilityCatalog = Object.freeze({
  catalogId: "EIL-2:1/IntegrationConnectorFoundationCapabilities",
  sourcePhase: "EIL-2:1" as const,
  capabilities: IntegrationConnectorFoundationCapabilities,
  capabilityCount: IntegrationConnectorFoundationCapabilities.length,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
