/**
 * EIL-2:2 — Integration Connector Category Registry.
 *
 * Canonical registry for the ten Foundation connector categories.
 * Consumes only the EIL-2:1 Integration Connector Foundation aggregate surface.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-2:2.
 */

import {
  IntegrationConnectorFoundationId,
  IntegrationConnectorFoundationNamespace,
  IntegrationConnectorFoundationPlatform,
} from "./integrationConnectorFoundation.ts";
import type { IntegrationConnectorCategoryRegistryEntry } from "./integrationConnectorRegistryTypes.ts";

const foundation = IntegrationConnectorFoundationPlatform;

/**
 * Exactly ten category registry entries preserving Foundation order.
 */
export const IntegrationConnectorCategoryRegistry: readonly IntegrationConnectorCategoryRegistryEntry[] =
  Object.freeze(
    foundation.categories.map((item) =>
      Object.freeze({
        id: `EIL-2:2/Registry/Category/${item.categoryKey}` as const,
        key: item.categoryKey,
        categoryKey: item.categoryKey,
        canonicalName: item.canonicalName,
        category: "Category" as const,
        description: item.description,
        sourcePhase: "EIL-2:1/IntegrationConnectorFoundation" as const,
        sourceNamespace: IntegrationConnectorFoundationNamespace,
        ownership: "EIL-2:2" as const,
        status: "Registered" as const,
        lifecycleState: "Verified",
        ordinal: item.deterministicOrder,
        tags: Object.freeze(["category", "foundation-reference"]),
        sourceReference: `${IntegrationConnectorFoundationId}/categories/${item.categoryKey}`,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );

/** Frozen category-registry catalog with derived count. */
export const IntegrationConnectorCategoryRegistryCatalog = Object.freeze({
  collectionId: "EIL-2:2/Collection/Categories",
  category: "Category" as const,
  sourcePhase: "EIL-2:2" as const,
  entries: IntegrationConnectorCategoryRegistry,
  entryCount: IntegrationConnectorCategoryRegistry.length,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
