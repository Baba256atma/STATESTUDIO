import * as foundation from "./executionMonitoringIndex.ts";
import * as registry from "./executionMonitoringRegistryIndex.ts";
import * as model from "./executionMonitoringModelIndex.ts";
import * as validation from "./executionMonitoringValidationIndex.ts";
import * as manifest from "./executionMonitoringManifestIndex.ts";
import { ExecutiveExecutionMonitoringPlatformMetadata } from "./executiveExecutionMonitoringPlatformMetadata.ts";
import type { ExecutiveExecutionMonitoringPlatformNamespace } from "./executiveExecutionMonitoringPlatformTypes.ts";

export const ExecutiveExecutionMonitoringPlatform = Object.freeze({
  foundation: Object.freeze({ ...foundation }),
  registry: Object.freeze({ ...registry }),
  model: Object.freeze({ ...model }),
  validation: Object.freeze({ ...validation }),
  manifest: Object.freeze({ ...manifest }),
  metadata: ExecutiveExecutionMonitoringPlatformMetadata,
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveExecutionMonitoringPlatformNamespace);
