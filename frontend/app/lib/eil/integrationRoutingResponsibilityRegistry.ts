/**
 * EIL-3:2 — Integration Routing Responsibility Registry.
 *
 * Canonical registry for the eight Foundation routing responsibilities.
 * Architectural ownership classifications are declarative metadata only.
 *
 * Ownership: owned exclusively by EIL-3:2.
 */

import { IntegrationRoutingFoundationPlatform } from "./integrationRoutingFoundation.ts";
import type { RoutingResponsibilityRegistryEntry } from "./integrationRoutingRegistryTypes.ts";

const foundation = IntegrationRoutingFoundationPlatform;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.foundationNamespace;

/**
 * Exactly eight responsibility registry entries preserving Foundation order.
 */
export const IntegrationRoutingResponsibilityRegistry: readonly RoutingResponsibilityRegistryEntry[] =
  Object.freeze(
    foundation.responsibilityDeclarations.map((responsibility) =>
      Object.freeze({
        id:
          `EIL-3:2/Registry/Responsibility/${responsibility.responsibilityId}` as const,
        key: responsibility.responsibilityId,
        responsibilityKey: responsibility.responsibilityId,
        canonicalName: responsibility.responsibilityName,
        category: "Responsibility" as const,
        description: responsibility.description,
        architecturalOwner: "EIL-3" as const,
        sourcePhase: "EIL-3:1/IntegrationRoutingFoundation" as const,
        sourceNamespace: foundationNamespace,
        ownership: "EIL-3:2" as const,
        status: "Registered" as const,
        lifecycleState: "Verified",
        ordinal: responsibility.deterministicOrder,
        tags: Object.freeze(["responsibility", "foundation-reference"]),
        sourceReference:
          `${foundationId}/responsibilities/${responsibility.responsibilityId}`,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );

/** Frozen responsibility-registry catalog with derived count. */
export const IntegrationRoutingResponsibilityRegistryCatalog = Object.freeze({
  collectionId: "EIL-3:2/Collection/Responsibilities",
  category: "Responsibility" as const,
  sourcePhase: "EIL-3:2" as const,
  entries: IntegrationRoutingResponsibilityRegistry,
  entryCount: IntegrationRoutingResponsibilityRegistry.length,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
