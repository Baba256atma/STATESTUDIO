import * as foundation from "./workflowIntelligenceIndex.ts";
import * as manifest from "./workflowPlatformManifestIndex.ts";
import * as metadata from "./workflowMetadataIndex.ts";
import * as model from "./workflowModelIndex.ts";
import * as validation from "./workflowValidationIndex.ts";
import { ExecutiveWorkflowIntelligencePlatformPublicRegistry } from "./workflowPlatformPublicRegistry.ts";
import { ExecutiveWorkflowIntelligencePlatformReleaseSummary } from "./workflowPlatformReleaseSummary.ts";

export const ExecutiveWorkflowIntelligencePlatform = Object.freeze({
  foundation: Object.freeze({ ...foundation }),
  metadata: Object.freeze({ ...metadata }),
  model: Object.freeze({ ...model }),
  validation: Object.freeze({ ...validation }),
  manifest: Object.freeze({ ...manifest }),
  publicIndex: Object.freeze({
    registry: ExecutiveWorkflowIntelligencePlatformPublicRegistry,
    releaseSummary: ExecutiveWorkflowIntelligencePlatformReleaseSummary,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
