/**
 * NEX-4:3 — Model inventory metadata.
 */

import { UserJourneyExperienceModelRelationships } from "./userJourneyExperienceModelRelationships.ts";
import { UserJourneyExperienceModels } from "./userJourneyExperienceModels.ts";

export const UserJourneyExperienceModelInventory = Object.freeze({
  id: "NEX-4:3/ModelInventory",
  modelCount: UserJourneyExperienceModels.length,
  modelCategoryCount: UserJourneyExperienceModels.length,
  modelRelationshipCount: UserJourneyExperienceModelRelationships.length,
  modelGroupCount: 4,
  modelVersion: "1.0.0",
  groups: Object.freeze(["Direction", "Journey", "Experience", "Governance"]),
  metadataOnly: true,
  immutable: true,
} as const);
