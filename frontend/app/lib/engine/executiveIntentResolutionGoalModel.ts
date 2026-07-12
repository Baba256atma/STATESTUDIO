import { ExecutiveIntentResolutionRegistry } from "./executiveIntentResolutionIndex.ts";
import { ExecutiveIntentResolutionCapabilityRegistry, ExecutiveIntentResolutionRegistryManifest } from "./executiveIntentResolutionRegistryIndex.ts";
import type { ExecutiveGoalModel } from "./executiveIntentResolutionModelTypes.ts";

const objectiveModel = Object.freeze({
  fields: Object.freeze(["objectiveId", "goalReference", "description", "status"] as const),
  metadataOnly: true, immutable: true,
} as const);

export const ExecutiveIntentResolutionGoalModel = Object.freeze({
  id: "eng-3-model-goal", name: "Executive Intent Resolution Goal Model",
  fields: Object.freeze(["goalId", "goalType", "goalCategory", "objectiveCollection", "requiredCapabilities", "expectedOutputs", "resolutionDependencies"]),
  objectiveModel,
  goalRegistryReference: ExecutiveIntentResolutionRegistry.goals,
  capabilityRegistryReference: ExecutiveIntentResolutionCapabilityRegistry,
  outputRegistryReference: ExecutiveIntentResolutionRegistryManifest.registryGroups[4],
  owner: "ENG-3", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveGoalModel);
