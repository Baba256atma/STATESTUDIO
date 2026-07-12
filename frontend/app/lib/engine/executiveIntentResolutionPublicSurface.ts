import { ExecutiveIntentResolutionFoundation } from "./executiveIntentResolutionIndex.ts";
import { ExecutiveIntentResolutionModelPlatform } from "./executiveIntentResolutionModelIndex.ts";
import { ExecutiveIntentResolutionRegistryPlatform } from "./executiveIntentResolutionRegistryIndex.ts";
import { ExecutiveIntentResolutionValidationPlatform } from "./executiveIntentResolutionValidationIndex.ts";
import type { ExecutivePublicSurface } from "./executiveIntentResolutionManifestTypes.ts";

export const ExecutiveIntentResolutionPublicSurface = Object.freeze({
  namespace: "nexora.engine.executive.intent-resolution.public",
  phases: Object.freeze([
    Object.freeze({ phase: "ENG-3:1", owner: "ENG-3", publicIndex: "executiveIntentResolutionIndex.ts", apiNames: Object.freeze(["ExecutiveIntentResolutionContracts", "ExecutiveIntentResolutionRegistry", "ExecutiveIntentResolutionMetadata", "ExecutiveIntentResolutionFoundation", "getExecutiveIntentResolutionFoundation", "getExecutiveIntentResolutionRegistry", "getExecutiveIntentResolutionMetadata"]), artifact: ExecutiveIntentResolutionFoundation }),
    Object.freeze({ phase: "ENG-3:2", owner: "ENG-3", publicIndex: "executiveIntentResolutionRegistryIndex.ts", apiNames: Object.freeze(["ExecutiveIntentResolutionIntentRegistry", "ExecutiveIntentResolutionDomainRegistry", "ExecutiveIntentResolutionCapabilityRegistry", "ExecutiveIntentResolutionRegistryManifest", "ExecutiveIntentResolutionRegistryPlatform", "getExecutiveIntentResolutionRegistryPlatform", "getExecutiveIntentResolutionRegistryManifest"]), artifact: ExecutiveIntentResolutionRegistryPlatform }),
    Object.freeze({ phase: "ENG-3:3", owner: "ENG-3", publicIndex: "executiveIntentResolutionModelIndex.ts", apiNames: Object.freeze(["ExecutiveIntentResolutionIntentModel", "ExecutiveIntentResolutionGoalModel", "ExecutiveIntentResolutionResolutionModel", "ExecutiveIntentResolutionModelManifest", "ExecutiveIntentResolutionModelPlatform", "getExecutiveIntentResolutionModelPlatform", "getExecutiveIntentResolutionModelManifest"]), artifact: ExecutiveIntentResolutionModelPlatform }),
    Object.freeze({ phase: "ENG-3:4", owner: "ENG-3", publicIndex: "executiveIntentResolutionValidationIndex.ts", apiNames: Object.freeze(["ExecutiveIntentResolutionFoundationValidation", "ExecutiveIntentResolutionRegistryValidation", "ExecutiveIntentResolutionModelValidation", "ExecutiveIntentResolutionValidationManifest", "ExecutiveIntentResolutionValidationPlatform", "getExecutiveIntentResolutionValidationPlatform", "getExecutiveIntentResolutionValidationManifest"]), artifact: ExecutiveIntentResolutionValidationPlatform }),
  ]),
  totalApiCount: 28, ownershipOnly: true, metadataOnly: true, immutable: true,
} as const satisfies ExecutivePublicSurface);
