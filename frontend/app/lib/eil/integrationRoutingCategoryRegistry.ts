/**
 * EIL-3:2 — Integration Routing Category Registry.
 *
 * Canonical registry for the ten Foundation routing categories.
 * Consumes only the EIL-3:1 Integration Routing Foundation aggregate surface.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-3:2.
 */

import { IntegrationRoutingFoundationPlatform } from "./integrationRoutingFoundation.ts";
import type { RoutingCategoryRegistryEntry } from "./integrationRoutingRegistryTypes.ts";

const foundation = IntegrationRoutingFoundationPlatform;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.foundationNamespace;

/**
 * Exactly ten category registry entries preserving Foundation order.
 */
export const IntegrationRoutingCategoryRegistry: readonly RoutingCategoryRegistryEntry[] =
  Object.freeze(
    foundation.categories.map((item) =>
      Object.freeze({
        id: `EIL-3:2/Registry/Category/${item.categoryKey}` as const,
        key: item.categoryKey,
        categoryKey: item.categoryKey,
        canonicalName: item.canonicalName,
        category: "Category" as const,
        description: item.description,
        sourcePhase: "EIL-3:1/IntegrationRoutingFoundation" as const,
        sourceNamespace: foundationNamespace,
        ownership: "EIL-3:2" as const,
        status: "Registered" as const,
        lifecycleState: "Verified",
        ordinal: item.deterministicOrder,
        tags: Object.freeze(["category", "foundation-reference"]),
        sourceReference: `${foundationId}/categories/${item.categoryKey}`,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );

/** Frozen category-registry catalog with derived count. */
export const IntegrationRoutingCategoryRegistryCatalog = Object.freeze({
  collectionId: "EIL-3:2/Collection/Categories",
  category: "Category" as const,
  sourcePhase: "EIL-3:2" as const,
  entries: IntegrationRoutingCategoryRegistry,
  entryCount: IntegrationRoutingCategoryRegistry.length,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
