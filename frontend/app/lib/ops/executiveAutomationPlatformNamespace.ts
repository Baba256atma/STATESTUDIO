import * as foundation from "./automationIndex.ts";
import * as registry from "./automationRegistryIndex.ts";
import * as model from "./automationModelIndex.ts";
import * as validation from "./automationValidationIndex.ts";
import * as manifest from "./automationManifestIndex.ts";
import { ExecutiveAutomationPlatformMetadata } from "./executiveAutomationPlatformMetadata.ts";
import type { ExecutiveAutomationPlatformNamespace } from "./executiveAutomationPlatformTypes.ts";

export const ExecutiveAutomationPlatform = Object.freeze({
  foundation: Object.freeze({ ...foundation }),
  registry: Object.freeze({ ...registry }),
  model: Object.freeze({ ...model }),
  validation: Object.freeze({ ...validation }),
  manifest: Object.freeze({ ...manifest }),
  metadata: ExecutiveAutomationPlatformMetadata,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutiveAutomationPlatformNamespace);
