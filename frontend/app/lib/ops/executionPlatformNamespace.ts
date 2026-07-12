import * as foundation from "./executionIndex.ts";
import * as manifest from "./executionPlatformManifestIndex.ts";
import * as metadata from "./executionMetadataIndex.ts";
import * as model from "./executionModelIndex.ts";
import * as validation from "./executionValidationIndex.ts";
import { ExecutiveOperationsPlatformPublicRegistry } from "./executionPlatformPublicRegistry.ts";
import { ExecutiveOperationsPlatformReleaseSummary } from "./executionPlatformReleaseSummary.ts";

export const ExecutiveOperationsPlatform = Object.freeze({
  foundation: Object.freeze({ ...foundation }),
  metadata: Object.freeze({ ...metadata }),
  model: Object.freeze({ ...model }),
  validation: Object.freeze({ ...validation }),
  manifest: Object.freeze({ ...manifest }),
  publicIndex: Object.freeze({
    registry: ExecutiveOperationsPlatformPublicRegistry,
    releaseSummary: ExecutiveOperationsPlatformReleaseSummary,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
