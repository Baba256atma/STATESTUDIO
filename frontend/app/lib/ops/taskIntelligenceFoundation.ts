import { TaskIntelligenceContracts } from "./taskIntelligenceContracts.ts";
import { TaskIntelligenceIdentity } from "./taskIntelligenceIdentity.ts";
import { buildTaskIntelligenceManifest } from "./taskIntelligenceManifest.ts";
import { TaskIntelligenceRegistry } from "./taskIntelligenceRegistry.ts";
import { validateTaskIntelligenceFoundation } from "./taskIntelligenceValidation.ts";

export const ExecutiveTaskIntelligenceFoundation = Object.freeze({
  identity: TaskIntelligenceIdentity,
  registry: TaskIntelligenceRegistry,
  contracts: TaskIntelligenceContracts,
  manifest: buildTaskIntelligenceManifest(),
  validation: validateTaskIntelligenceFoundation(),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
