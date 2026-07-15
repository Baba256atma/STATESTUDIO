import {
  ExecutivePlanningCapabilityRegistry,
  ExecutivePlanningContracts,
  ExecutivePlanningFoundation,
  ExecutivePlanningLifecycle,
  ExecutivePlanningMetadata,
  ExecutivePlanningOwnership,
} from "./executivePlanningIndex.ts";
import { ExecutivePlanningManifestPlatform } from "./executivePlanningManifestIndex.ts";
import { ExecutivePlanningModelPlatform } from "./executivePlanningModelIndex.ts";
import { ExecutivePlanningPlatformMetadata } from "./executivePlanningPlatformMetadata.ts";
import { ExecutivePlanningPlatformSummary } from "./executivePlanningPlatformSummary.ts";
import { ExecutivePlanningRegistryPlatform } from "./executivePlanningRegistryIndex.ts";
import { ExecutivePlanningValidationPlatform } from "./executivePlanningValidationIndex.ts";

const foundation = Object.freeze({
  foundation: ExecutivePlanningFoundation,
  contracts: ExecutivePlanningContracts,
  capabilities: ExecutivePlanningCapabilityRegistry,
  lifecycle: ExecutivePlanningLifecycle,
  ownership: ExecutivePlanningOwnership,
  metadata: ExecutivePlanningMetadata,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const);

export const ExecutivePlanningPlatform = Object.freeze({
  metadata: ExecutivePlanningPlatformMetadata,
  foundation,
  registry: ExecutivePlanningRegistryPlatform,
  model: ExecutivePlanningModelPlatform,
  validation: ExecutivePlanningValidationPlatform,
  manifest: ExecutivePlanningManifestPlatform,
  summary: ExecutivePlanningPlatformSummary,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const);
