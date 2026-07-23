/**
 * EIL-2:8 — Integration Connector Freeze Extensions.
 *
 * Descriptive extension-policy metadata for the frozen EIL-2 connector baseline.
 * Metadata only — no runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-2:8.
 */

import type {
  IntegrationConnectorFreezeExtension,
  IntegrationConnectorFreezeExtensionKey,
} from "./integrationConnectorFreezeTypes.ts";

const extension = (
  key: IntegrationConnectorFreezeExtensionKey,
  canonicalName: string,
  description: string,
  ordinal: number,
): IntegrationConnectorFreezeExtension =>
  Object.freeze({
    extensionId: `EIL-2:8/Extension/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    ownership: "EIL-2:8" as const,
    ordinal,
    tags: Object.freeze(["extension-policy", key.toLowerCase()]),
    runtimeEnforced: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight freeze extension-policy declarations.
 */
export const IntegrationConnectorFreezeExtensions: readonly IntegrationConnectorFreezeExtension[] =
  Object.freeze([
    extension(
      "ExtensionAfterPublicIndexOnly",
      "Extension allowed only after Public Index",
      "Architectural extension is permitted only after Public Index publication.",
      1,
    ),
    extension(
      "NoMutationOfFrozenMetadata",
      "No mutation of frozen metadata",
      "Frozen identities, inventories, and locks must not be mutated.",
      2,
    ),
    extension(
      "AdditiveEvolutionOnly",
      "Additive evolution only",
      "Future evolution must be additive and must not redefine frozen surfaces.",
      3,
    ),
    extension(
      "BackwardCompatibilityPreservation",
      "Backward compatibility preservation",
      "Future consumers must preserve backward compatibility with the frozen baseline.",
      4,
    ),
    extension(
      "CanonicalIdentityPreservation",
      "Canonical identity preservation",
      "Canonical EIL-2 identities must remain preserved across future phases.",
      5,
    ),
    extension(
      "NamespacePreservation",
      "Namespace preservation",
      "nexora.eil.integration-connector.* namespaces must remain preserved.",
      6,
    ),
    extension(
      "DependencyPreservation",
      "Dependency preservation",
      "Aggregate dependency direction must remain preserved.",
      7,
    ),
    extension(
      "InventoryPreservation",
      "Inventory preservation",
      "Frozen inventory totals must remain preserved as the architectural baseline.",
      8,
    ),
  ]);
