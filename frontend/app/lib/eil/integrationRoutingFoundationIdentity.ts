/**
 * EIL-3:1 — Integration Routing Foundation Identity.
 *
 * Canonical immutable identity for the Integration Routing Platform foundation.
 * Metadata-only. No runtime routing behavior.
 *
 * Ownership: owned exclusively by EIL-3:1.
 */

import type { RoutingIdentity } from "./integrationRoutingFoundationTypes.ts";

/** Canonical foundation identity constant. */
export const IntegrationRoutingFoundationId =
  "EIL-3:1/IntegrationRoutingFoundation" as const;

/** Human-readable foundation name. */
export const IntegrationRoutingFoundationName =
  "Integration Routing Foundation" as const;

/** Semantic version. */
export const IntegrationRoutingFoundationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationRoutingFoundationNamespace =
  "nexora.eil.integration-routing.foundation" as const;

/** Foundation status. */
export const IntegrationRoutingFoundationStatusValue = "Foundation" as const;

/** Immediate next-phase readiness. */
export const IntegrationRoutingFoundationReadinessValue =
  "ReadyForRegistry" as const;

/**
 * Immutable identity descriptor for EIL-3:1 Integration Routing Foundation.
 */
export const IntegrationRoutingFoundationIdentity: RoutingIdentity =
  Object.freeze({
    foundationId: IntegrationRoutingFoundationId,
    foundationName: IntegrationRoutingFoundationName,
    foundationVersion: IntegrationRoutingFoundationVersion,
    foundationNamespace: IntegrationRoutingFoundationNamespace,
    layer: "EIL" as const,
    platform: "EIL-3" as const,
    phaseId: "EIL-3:1" as const,
    phaseType: "Foundation" as const,
    owner: "EIL-3 Integration Routing Foundation",
    status: IntegrationRoutingFoundationStatusValue,
    readiness: IntegrationRoutingFoundationReadinessValue,
    description:
      "Immutable architectural foundation of the Nexora Integration Routing Platform. Declares routing identities, categories, contracts, capabilities, responsibilities, lifecycle, ownership, boundaries, and terminology without routing engine or message execution behavior.",
    metadataOnly: true as const,
    immutable: true as const,
  });
