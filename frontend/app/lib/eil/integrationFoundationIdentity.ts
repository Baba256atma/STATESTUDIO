/**
 * EIL-1:1 — Integration Foundation Identity.
 *
 * Canonical immutable identity for the Executive Integration Layer foundation.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-1:1.
 */

import type { IntegrationFoundationIdentityDescriptor } from "./integrationFoundationTypes.ts";

/** Canonical foundation identity constant. */
export const IntegrationFoundationId =
  "EIL-1:1/IntegrationFoundation" as const;

/** Human-readable foundation name. */
export const IntegrationFoundationName = "Integration Foundation" as const;

/** Semantic version. */
export const IntegrationFoundationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationFoundationNamespace =
  "nexora.eil.integration.foundation" as const;

/** Foundation status. */
export const IntegrationFoundationStatus = "Foundation" as const;

/** Immediate next-phase readiness. */
export const IntegrationFoundationReadiness = "ReadyForRegistry" as const;

/**
 * Immutable identity descriptor for EIL-1:1 Integration Foundation.
 */
export const IntegrationFoundationIdentity: IntegrationFoundationIdentityDescriptor =
  Object.freeze({
    foundationId: IntegrationFoundationId,
    foundationName: IntegrationFoundationName,
    foundationVersion: IntegrationFoundationVersion,
    foundationNamespace: IntegrationFoundationNamespace,
    layer: "Executive Integration Layer" as const,
    phase: "EIL-1" as const,
    stage: "Foundation" as const,
    sourcePhase: "EIL-1:1" as const,
    owner: "EIL-1 Integration Foundation",
    status: IntegrationFoundationStatus,
    readiness: IntegrationFoundationReadiness,
    description:
      "Immutable architectural foundation of the Nexora Executive Integration Layer. Declares identities, contracts, responsibilities, capabilities, lifecycle, ownership, boundaries, compatibility, and terminology without runtime behavior.",
    metadataOnly: true as const,
    immutable: true as const,
  });
