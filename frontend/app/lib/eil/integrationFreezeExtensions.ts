/**
 * EIL-1:8 — Integration Freeze Extensions.
 *
 * Descriptive extension-policy metadata for the frozen EIL-1 baseline.
 * Metadata only — no runtime enforcement.
 *
 * Ownership: owned exclusively by EIL-1:8.
 */

import type {
  IntegrationFreezeExtension,
  IntegrationFreezeExtensionKey,
} from "./integrationFreezeTypes.ts";

const extension = (
  key: IntegrationFreezeExtensionKey,
  canonicalName: string,
  description: string,
  ordinal: number,
): IntegrationFreezeExtension =>
  Object.freeze({
    extensionId: `EIL-1:8/Extension/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    ownership: "EIL-1:8" as const,
    ordinal,
    tags: Object.freeze(["extension-policy", key.toLowerCase()]),
    runtimeEnforced: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly eight freeze extension-policy declarations.
 */
export const IntegrationFreezeExtensions: readonly IntegrationFreezeExtension[] =
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
      "Canonical EIL-1 identities must remain preserved across future phases.",
      5,
    ),
    extension(
      "NamespacePreservation",
      "Namespace preservation",
      "nexora.eil.integration.* namespaces must remain preserved.",
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
