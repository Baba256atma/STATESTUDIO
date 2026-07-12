import { SchedulingIntelligenceContracts } from "./schedulingIntelligenceContracts.ts";
import { SchedulingIntelligenceIdentity } from "./schedulingIntelligenceIdentity.ts";
import { buildSchedulingIntelligenceManifest } from "./schedulingIntelligenceManifest.ts";
import { SchedulingIntelligenceRegistry } from "./schedulingIntelligenceRegistry.ts";
import { validateSchedulingIntelligenceFoundation } from "./schedulingIntelligenceValidation.ts";

export const ExecutiveSchedulingIntelligenceFoundation = Object.freeze({
  identity: SchedulingIntelligenceIdentity,
  registry: SchedulingIntelligenceRegistry,
  contracts: SchedulingIntelligenceContracts,
  manifest: buildSchedulingIntelligenceManifest(),
  validation: validateSchedulingIntelligenceFoundation(),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
