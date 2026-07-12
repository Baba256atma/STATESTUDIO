import { ExecutiveIntentResolutionFoundation } from "./executiveIntentResolutionIndex.ts";
import { ExecutiveIntentResolutionManifestPlatform } from "./executiveIntentResolutionManifestIndex.ts";
import { ExecutiveIntentResolutionModelPlatform } from "./executiveIntentResolutionModelIndex.ts";
import { ExecutiveIntentResolutionRegistryPlatform } from "./executiveIntentResolutionRegistryIndex.ts";
import { ExecutiveIntentResolutionValidationPlatform } from "./executiveIntentResolutionValidationIndex.ts";
import { ExecutiveIntentResolutionPlatformMetadata } from "./executiveIntentResolutionPlatformMetadata.ts";
import type { ExecutiveIntentResolutionPlatformNamespace as PlatformNamespace } from "./executiveIntentResolutionPlatformTypes.ts";

export const ExecutiveIntentResolutionPlatformNamespace = Object.freeze({
  foundation: ExecutiveIntentResolutionFoundation,
  registry: ExecutiveIntentResolutionRegistryPlatform,
  model: ExecutiveIntentResolutionModelPlatform,
  validation: ExecutiveIntentResolutionValidationPlatform,
  manifest: ExecutiveIntentResolutionManifestPlatform,
  metadata: ExecutiveIntentResolutionPlatformMetadata,
} as const satisfies PlatformNamespace);
