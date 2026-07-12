import { ExecutionContracts } from "./executionContracts.ts";
import { ExecutionPlatformIdentity } from "./executionIdentity.ts";
import { buildExecutionManifest } from "./executionManifest.ts";
import { ExecutionRegistry } from "./executionRegistry.ts";
import { validateExecutionFoundation } from "./executionValidation.ts";

export const ExecutiveExecutionFoundation = Object.freeze({
  identity: ExecutionPlatformIdentity,
  registry: ExecutionRegistry,
  contracts: ExecutionContracts,
  manifest: buildExecutionManifest(),
  validation: validateExecutionFoundation(),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
