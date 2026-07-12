import * as foundation from "./schedulingIntelligenceIndex.ts";
import * as manifest from "./schedulingPlatformManifestIndex.ts";
import * as metadata from "./schedulingMetadataIndex.ts";
import * as model from "./schedulingModelIndex.ts";
import * as validation from "./schedulingValidationIndex.ts";
import { ExecutiveSchedulingPlatformPublicRegistry } from "./schedulingPlatformPublicRegistry.ts";
import { ExecutiveSchedulingPlatformReleaseSummary } from "./schedulingPlatformReleaseSummary.ts";

export const ExecutiveSchedulingPlatform = Object.freeze({
  foundation: Object.freeze({ ...foundation }),
  metadata: Object.freeze({ ...metadata }),
  model: Object.freeze({ ...model }),
  validation: Object.freeze({ ...validation }),
  manifest: Object.freeze({ ...manifest }),
  publicIndex: Object.freeze({
    registry: ExecutiveSchedulingPlatformPublicRegistry,
    releaseSummary: ExecutiveSchedulingPlatformReleaseSummary,
    taskCompatibilitySummary: Object.freeze({
      compatibilityStatus:
        ExecutiveSchedulingPlatformReleaseSummary.taskCompatibilityStatus,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    workflowCompatibilitySummary: Object.freeze({
      compatibilityStatus:
        ExecutiveSchedulingPlatformReleaseSummary.workflowCompatibilityStatus,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    projectCompatibilitySummary: Object.freeze({
      compatibilityStatus:
        ExecutiveSchedulingPlatformReleaseSummary.projectCompatibilityStatus,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    resourceCompatibilitySummary: Object.freeze({
      compatibilityStatus:
        ExecutiveSchedulingPlatformReleaseSummary.resourceCompatibilityStatus,
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
