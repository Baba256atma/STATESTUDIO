import * as foundation from "./taskIntelligenceIndex.ts";
import * as manifest from "./taskPlatformManifestIndex.ts";
import * as metadata from "./taskMetadataIndex.ts";
import * as model from "./taskModelIndex.ts";
import * as validation from "./taskValidationIndex.ts";
import { ExecutiveTaskIntelligencePlatformPublicRegistry } from "./taskPlatformPublicRegistry.ts";
import { ExecutiveTaskIntelligencePlatformReleaseSummary } from "./taskPlatformReleaseSummary.ts";

export const ExecutiveTaskIntelligencePlatform = Object.freeze({
  foundation: Object.freeze({ ...foundation }),
  metadata: Object.freeze({ ...metadata }),
  model: Object.freeze({ ...model }),
  validation: Object.freeze({ ...validation }),
  manifest: Object.freeze({ ...manifest }),
  publicIndex: Object.freeze({
    registry: ExecutiveTaskIntelligencePlatformPublicRegistry,
    releaseSummary: ExecutiveTaskIntelligencePlatformReleaseSummary,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
