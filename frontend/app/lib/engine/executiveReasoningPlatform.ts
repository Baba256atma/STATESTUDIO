import { ExecutiveReasoningManifest } from "./executiveReasoningManifestPlatform.ts";
import { ExecutiveReasoningModelPlatform } from "./executiveReasoningModelIndex.ts";
import { ExecutiveReasoningPipelineFoundation } from "./executiveReasoningPipelineFoundation.ts";
import { ExecutiveReasoningPlatformMetadata } from "./executiveReasoningPlatformMetadata.ts";
import { ExecutiveReasoningPlatformReadiness } from "./executiveReasoningPlatformReadiness.ts";
import { ExecutiveReasoningPlatformRegistry } from "./executiveReasoningPlatformRegistry.ts";
import { ExecutiveReasoningPlatformSummary } from "./executiveReasoningPlatformSummary.ts";
import {
  ExecutiveReasoningCapabilityRegistry,
  ExecutiveReasoningComponentRegistry,
  ExecutiveReasoningLifecycleRegistry,
  ExecutiveReasoningRegistryMetadata,
} from "./executiveReasoningRegistryIndex.ts";
import { ExecutiveReasoningValidationPlatform } from "./executiveReasoningValidationPlatform.ts";

const registry = Object.freeze({
  metadata: ExecutiveReasoningRegistryMetadata,
  components: ExecutiveReasoningComponentRegistry,
  capabilities: ExecutiveReasoningCapabilityRegistry,
  lifecycle: ExecutiveReasoningLifecycleRegistry,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);

const platform = Object.freeze({
  metadata: ExecutiveReasoningPlatformMetadata,
  registry: ExecutiveReasoningPlatformRegistry,
  summary: ExecutiveReasoningPlatformSummary,
  readiness: ExecutiveReasoningPlatformReadiness,
  ownership: Object.freeze({
    owner: "ENG-6",
    owns: Object.freeze([
      "platform metadata aggregation",
      "platform registry metadata",
      "platform summary metadata",
      "platform readiness metadata",
    ] as const),
    neverOwns: Object.freeze([
      "reasoning execution",
      "inference",
      "confidence calculation",
      "evidence evaluation",
      "contradiction resolution",
      "planning",
      "orchestration",
      "decision making",
      "runtime behavior",
      "business logic",
    ] as const),
  } as const),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);

/**
 * Canonical Executive Reasoning Platform — official architectural entry point.
 * Aggregates ENG-6:1 through ENG-6:5 without modification. Metadata only.
 */
export const ExecutiveReasoningPlatform = Object.freeze({
  foundation: ExecutiveReasoningPipelineFoundation,
  registry,
  model: ExecutiveReasoningModelPlatform,
  validation: ExecutiveReasoningValidationPlatform,
  manifest: ExecutiveReasoningManifest,
  platform,
} as const);
