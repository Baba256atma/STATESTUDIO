/**
 * EIL-2:2 — Integration Connector Responsibility Registry.
 *
 * Canonical registry for the eight Foundation connector responsibilities.
 * Architectural ownership classifications are declarative metadata only.
 *
 * Ownership: owned exclusively by EIL-2:2.
 */

import {
  IntegrationConnectorFoundationId,
  IntegrationConnectorFoundationNamespace,
  IntegrationConnectorFoundationPlatform,
} from "./integrationConnectorFoundation.ts";
import type { IntegrationConnectorResponsibilityRegistryEntry } from "./integrationConnectorRegistryTypes.ts";

const foundation = IntegrationConnectorFoundationPlatform;

/**
 * Exactly eight responsibility registry entries preserving Foundation order.
 */
export const IntegrationConnectorResponsibilityRegistry: readonly IntegrationConnectorResponsibilityRegistryEntry[] =
  Object.freeze(
    foundation.responsibilityDeclarations.map((responsibility) =>
      Object.freeze({
        id:
          `EIL-2:2/Registry/Responsibility/${responsibility.responsibilityId}` as const,
        key: responsibility.responsibilityId,
        responsibilityKey: responsibility.responsibilityId,
        canonicalName: responsibility.responsibilityName,
        category: "Responsibility" as const,
        description: responsibility.description,
        architecturalOwner: "EIL-2" as const,
        sourcePhase: "EIL-2:1/IntegrationConnectorFoundation" as const,
        sourceNamespace: IntegrationConnectorFoundationNamespace,
        ownership: "EIL-2:2" as const,
        status: "Registered" as const,
        lifecycleState: "Verified",
        ordinal: responsibility.deterministicOrder,
        tags: Object.freeze(["responsibility", "foundation-reference"]),
        sourceReference:
          `${IntegrationConnectorFoundationId}/responsibilities/${responsibility.responsibilityId}`,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );

/** Frozen responsibility-registry catalog with derived count. */
export const IntegrationConnectorResponsibilityRegistryCatalog =
  Object.freeze({
    collectionId: "EIL-2:2/Collection/Responsibilities",
    category: "Responsibility" as const,
    sourcePhase: "EIL-2:2" as const,
    entries: IntegrationConnectorResponsibilityRegistry,
    entryCount: IntegrationConnectorResponsibilityRegistry.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
