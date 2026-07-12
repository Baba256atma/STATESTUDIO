import { ProjectExecutionContracts } from "./projectExecutionContracts.ts";
import { ProjectExecutionIdentity } from "./projectExecutionIdentity.ts";
import { buildProjectExecutionManifest } from "./projectExecutionManifest.ts";
import { ProjectExecutionRegistry } from "./projectExecutionRegistry.ts";
import { validateProjectExecutionFoundation } from "./projectExecutionValidation.ts";

export const ExecutiveProjectExecutionFoundation = Object.freeze({
  identity: ProjectExecutionIdentity,
  registry: ProjectExecutionRegistry,
  contracts: ProjectExecutionContracts,
  manifest: buildProjectExecutionManifest(),
  validation: validateProjectExecutionFoundation(),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

