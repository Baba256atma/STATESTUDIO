import * as foundation from "./projectExecutionIndex.ts";
import * as manifest from "./projectPlatformManifestIndex.ts";
import * as metadata from "./projectMetadataIndex.ts";
import * as model from "./projectModelIndex.ts";
import * as validation from "./projectValidationIndex.ts";
import { ExecutiveProjectExecutionPlatformPublicRegistry } from "./projectPlatformPublicRegistry.ts";
import { ExecutiveProjectExecutionPlatformReleaseSummary } from "./projectPlatformReleaseSummary.ts";

export const ExecutiveProjectExecutionPlatform = Object.freeze({
  foundation: Object.freeze({ ...foundation }),
  metadata: Object.freeze({ ...metadata }),
  model: Object.freeze({ ...model }),
  validation: Object.freeze({ ...validation }),
  manifest: Object.freeze({ ...manifest }),
  publicIndex: Object.freeze({
    registry: ExecutiveProjectExecutionPlatformPublicRegistry,
    releaseSummary: ExecutiveProjectExecutionPlatformReleaseSummary,
    workflowCompatibilitySummary: Object.freeze({
      compatibilityStatus:
        ExecutiveProjectExecutionPlatformReleaseSummary.workflowCompatibilityStatus,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    taskCompatibilitySummary: Object.freeze({
      compatibilityStatus:
        ExecutiveProjectExecutionPlatformReleaseSummary.taskCompatibilityStatus,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

