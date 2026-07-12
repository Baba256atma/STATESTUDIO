import { ExecutiveIntentResolutionGoalModel } from "./executiveIntentResolutionGoalModel.ts";
import { ExecutiveIntentResolutionIntentModel } from "./executiveIntentResolutionIntentModel.ts";
import { ExecutiveIntentResolutionModelManifest } from "./executiveIntentResolutionModelManifest.ts";
import { ExecutiveIntentResolutionResolutionModel } from "./executiveIntentResolutionResolutionModel.ts";
import type { ExecutiveModelPlatform } from "./executiveIntentResolutionModelTypes.ts";

const metadata = Object.freeze({
  platformId: "ENG-3:3", name: "Executive Intent Resolution Model Platform",
  namespace: "nexora.engine.executive.intent-resolution.model", version: "1.0.0",
  owner: "ENG-3", status: "Published", metadataOnly: true, immutable: true, deterministic: true,
} as const);

export const ExecutiveIntentResolutionModelPlatform = Object.freeze({
  intentModel: ExecutiveIntentResolutionIntentModel,
  goalModel: ExecutiveIntentResolutionGoalModel,
  resolutionModel: ExecutiveIntentResolutionResolutionModel,
  manifest: ExecutiveIntentResolutionModelManifest,
  metadata,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveModelPlatform);

export const getExecutiveIntentResolutionModelPlatform = () => ExecutiveIntentResolutionModelPlatform;
export const getExecutiveIntentResolutionModelManifest = () => ExecutiveIntentResolutionModelManifest;
