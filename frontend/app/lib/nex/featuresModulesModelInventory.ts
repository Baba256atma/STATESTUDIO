/**
 * NEX-3:3 — Model inventory metadata.
 */

import { FeaturesModulesModelRelationships } from "./featuresModulesModelRelationships.ts";
import { FeaturesModulesModels } from "./featuresModulesModels.ts";

export const FeaturesModulesModelInventory = Object.freeze({
  id: "NEX-3:3/ModelInventory",
  modelCount: FeaturesModulesModels.length,
  modelCategoryCount: FeaturesModulesModels.length,
  modelRelationshipCount: FeaturesModulesModelRelationships.length,
  modelGroupCount: 4,
  modelVersion: "1.0.0",
  groups: Object.freeze(["Direction", "Composition", "Boundaries", "Governance"]),
  metadataOnly: true,
  immutable: true,
} as const);
