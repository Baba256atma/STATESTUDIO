/**
 * EIL-4:1 — Integration Orchestration Foundation Identity.
 *
 * Canonical immutable identity for the Integration Orchestration Platform foundation.
 * Metadata-only. No runtime orchestration behavior.
 *
 * Ownership: owned exclusively by EIL-4:1.
 */

import type { OrchestrationIdentity } from "./integrationOrchestrationFoundationTypes.ts";

/** Canonical foundation identity constant. */
export const IntegrationOrchestrationFoundationId =
  "EIL-4:1/IntegrationOrchestrationFoundation" as const;

/** Human-readable foundation name. */
export const IntegrationOrchestrationFoundationName =
  "Integration Orchestration Foundation" as const;

/** Semantic version. */
export const IntegrationOrchestrationFoundationVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationOrchestrationFoundationNamespace =
  "nexora.eil.integration-orchestration.foundation" as const;

/** Foundation status. */
export const IntegrationOrchestrationFoundationStatusValue =
  "Foundation" as const;

/** Immediate next-phase readiness. */
export const IntegrationOrchestrationFoundationReadinessValue =
  "ReadyForRegistry" as const;

/**
 * Immutable identity descriptor for EIL-4:1 Integration Orchestration Foundation.
 */
export const IntegrationOrchestrationFoundationIdentity: OrchestrationIdentity =
  Object.freeze({
    foundationId: IntegrationOrchestrationFoundationId,
    foundationName: IntegrationOrchestrationFoundationName,
    foundationVersion: IntegrationOrchestrationFoundationVersion,
    foundationNamespace: IntegrationOrchestrationFoundationNamespace,
    layer: "EIL" as const,
    platform: "EIL-4" as const,
    phaseId: "EIL-4:1" as const,
    phaseType: "Foundation" as const,
    owner: "EIL-4 Integration Orchestration Foundation",
    status: IntegrationOrchestrationFoundationStatusValue,
    readiness: IntegrationOrchestrationFoundationReadinessValue,
    description:
      "Immutable architectural foundation of the Nexora Integration Orchestration Platform. Declares orchestration identities, categories, contracts, capabilities, responsibilities, lifecycle, ownership, boundaries, and terminology without orchestration engine or workflow execution behavior.",
    metadataOnly: true as const,
    immutable: true as const,
  });
