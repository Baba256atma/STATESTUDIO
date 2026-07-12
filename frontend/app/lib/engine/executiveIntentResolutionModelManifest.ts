import { ExecutiveIntentResolutionFoundation } from "./executiveIntentResolutionIndex.ts";
import { ExecutiveIntentResolutionRegistryPlatform } from "./executiveIntentResolutionRegistryIndex.ts";
import { ExecutiveIntentResolutionGoalModel } from "./executiveIntentResolutionGoalModel.ts";
import { ExecutiveIntentResolutionIntentModel } from "./executiveIntentResolutionIntentModel.ts";
import { ExecutiveIntentResolutionResolutionModel } from "./executiveIntentResolutionResolutionModel.ts";
import type { ExecutiveModelManifest } from "./executiveIntentResolutionModelTypes.ts";

export const ExecutiveIntentResolutionModelManifest = Object.freeze({
  ownership: "ENG-3",
  modelCollections: Object.freeze([
    ExecutiveIntentResolutionIntentModel,
    ExecutiveIntentResolutionGoalModel,
    ExecutiveIntentResolutionResolutionModel,
  ]),
  registryDependencies: Object.freeze([
    Object.freeze({ publicIndex: "executiveIntentResolutionRegistryIndex.ts", artifact: ExecutiveIntentResolutionRegistryPlatform }),
  ]),
  foundationDependencies: Object.freeze([
    Object.freeze({ publicIndex: "executiveIntentResolutionIndex.ts", artifact: ExecutiveIntentResolutionFoundation }),
  ]),
  compatibility: Object.freeze({
    foundation: "ENG-3:1", registry: "ENG-3:2", engineLayer: "Compatible", ownershipSafe: true,
  }),
  version: "1.0.0", stability: "Draft", certificationState: "Uncertified",
  publicationState: "Published", metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveModelManifest);
