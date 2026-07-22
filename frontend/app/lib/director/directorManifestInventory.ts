import { DirectorValidationRegistry } from "./directorValidation.ts";
import type { DirectorManifestInventorySection } from "./directorManifestTypes.ts";

const validatedModel = DirectorValidationRegistry.validatedModel;
const canonicalRegistry = validatedModel.registry;
const canonicalFoundation = canonicalRegistry.foundation;

const registryCollections = Object.freeze(
  [canonicalRegistry.scenes, canonicalRegistry.cameras,
    canonicalRegistry.timelines, canonicalRegistry.visualizations]
    .flatMap((group) => Object.values(group))
    .filter((value): value is Exclude<typeof value, boolean> =>
      Array.isArray(value)),
);

const foundationCollectionCounts = Object.freeze([
  canonicalFoundation.contracts.length,
  canonicalFoundation.lifecycle.states.length,
  canonicalFoundation.capabilities.length,
]);

const modelCollectionCounts = Object.freeze([
  validatedModel.definitions.length,
  validatedModel.relationships.length,
]);

const validationCollectionCounts = Object.freeze([
  DirectorValidationRegistry.categories.length,
  DirectorValidationRegistry.rules.length,
  DirectorValidationRegistry.policies.length,
]);

const section = (
  name: string,
  collectionCounts: readonly number[],
  canonicalReference: string,
  deterministicOrder: number,
): DirectorManifestInventorySection => Object.freeze({
  id: `DIRECTOR-1:5/Inventory/${name}`,
  name,
  collectionCount: collectionCounts.length,
  entryCount: collectionCounts.reduce((total, count) => total + count, 0),
  canonicalReference,
  deterministicOrder,
  derived: true,
  immutable: true,
});

export const DirectorManifestInventories = Object.freeze([
  section("Foundation", foundationCollectionCounts, canonicalFoundation.identity.id, 1),
  section("Registry", registryCollections.map(({ length }) => length), canonicalRegistry.identity.id, 2),
  section("Model", modelCollectionCounts, validatedModel.identity.id, 3),
  section("Validation", validationCollectionCounts, DirectorValidationRegistry.registryId, 4),
]);

export const DirectorManifestInventoryTotals = Object.freeze({
  totalInventoryEntries: DirectorManifestInventories.reduce(
    (total, inventory) => total + inventory.entryCount, 0,
  ),
  totalMetadataCollections: DirectorManifestInventories.reduce(
    (total, inventory) => total + inventory.collectionCount, 0,
  ),
  totalExportedCollections: DirectorManifestInventories.length,
  derived: true,
  immutable: true,
  deterministic: true,
} as const);
