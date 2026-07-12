import * as foundation from "./resourceIntelligenceIndex.ts";
import * as manifest from "./resourcePlatformManifestIndex.ts";
import * as metadata from "./resourceMetadataIndex.ts";
import * as model from "./resourceModelIndex.ts";
import * as validation from "./resourceValidationIndex.ts";
import { ExecutiveResourceIntelligencePlatformPublicRegistry } from "./resourcePlatformPublicRegistry.ts";
import { ExecutiveResourceIntelligencePlatformReleaseSummary } from "./resourcePlatformReleaseSummary.ts";

export const ExecutiveResourceIntelligencePlatform = Object.freeze({
  foundation: Object.freeze({ ...foundation }),
  metadata: Object.freeze({ ...metadata }),
  model: Object.freeze({ ...model }),
  validation: Object.freeze({ ...validation }),
  manifest: Object.freeze({ ...manifest }),
  publicIndex: Object.freeze({
    registry: ExecutiveResourceIntelligencePlatformPublicRegistry,
    releaseSummary: ExecutiveResourceIntelligencePlatformReleaseSummary,
    taskCompatibilitySummary: Object.freeze({
      compatibilityStatus:
        ExecutiveResourceIntelligencePlatformReleaseSummary.taskCompatibilityStatus,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    workflowCompatibilitySummary: Object.freeze({
      compatibilityStatus:
        ExecutiveResourceIntelligencePlatformReleaseSummary.workflowCompatibilityStatus,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    projectCompatibilitySummary: Object.freeze({
      compatibilityStatus:
        ExecutiveResourceIntelligencePlatformReleaseSummary.projectCompatibilityStatus,
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
