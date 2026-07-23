/**
 * EIL-2:1 — Integration Connector Foundation Identity.
 *
 * Canonical immutable identity for the Integration Connector Platform foundation.
 * Metadata-only. No runtime connector behavior.
 *
 * Ownership: owned exclusively by EIL-2:1.
 */

import type { IntegrationConnectorIdentity } from "./integrationConnectorFoundationTypes.ts";

/** Canonical foundation identity constant. */
export const IntegrationConnectorFoundationId =
  "EIL-2:1/IntegrationConnectorFoundation" as const;

/** Human-readable foundation name. */
export const IntegrationConnectorFoundationName =
  "Integration Connector Foundation" as const;

/** Semantic version. */
export const IntegrationConnectorFoundationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationConnectorFoundationNamespace =
  "nexora.eil.integration-connector.foundation" as const;

/** Foundation status. */
export const IntegrationConnectorFoundationStatus = "Foundation" as const;

/** Immediate next-phase readiness. */
export const IntegrationConnectorFoundationReadiness =
  "ReadyForRegistry" as const;

/**
 * Immutable identity descriptor for EIL-2:1 Integration Connector Foundation.
 */
export const IntegrationConnectorFoundationIdentity: IntegrationConnectorIdentity =
  Object.freeze({
    foundationId: IntegrationConnectorFoundationId,
    foundationName: IntegrationConnectorFoundationName,
    foundationVersion: IntegrationConnectorFoundationVersion,
    foundationNamespace: IntegrationConnectorFoundationNamespace,
    layer: "EIL" as const,
    platform: "EIL-2" as const,
    phaseId: "EIL-2:1" as const,
    phaseType: "Foundation" as const,
    owner: "EIL-2 Integration Connector Foundation",
    status: IntegrationConnectorFoundationStatus,
    readiness: IntegrationConnectorFoundationReadiness,
    description:
      "Immutable architectural foundation of the Nexora Integration Connector Platform. Declares connector identities, categories, contracts, capabilities, responsibilities, lifecycle, ownership, boundaries, and terminology without connector runtime behavior.",
    metadataOnly: true as const,
    immutable: true as const,
  });
