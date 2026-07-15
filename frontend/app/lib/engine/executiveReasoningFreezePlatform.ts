import { ExecutiveReasoningCompatibility } from "./executiveReasoningCompatibility.ts";
import {
  ExecutiveReasoningCertificationPlatform,
} from "./executiveReasoningCertificationIndex.ts";
import { ExecutiveReasoningExtensionPolicy } from "./executiveReasoningExtensionPolicy.ts";
import {
  ExecutiveReasoningFreezeMetadata,
  ExecutiveReasoningFreezeSummary,
} from "./executiveReasoningFreezeMetadata.ts";
import { ExecutiveReasoningFreezeRegistry } from "./executiveReasoningFreezeRegistry.ts";
import { ExecutiveReasoningManifest } from "./executiveReasoningManifestPlatform.ts";
import { ExecutiveReasoningModelPlatform } from "./executiveReasoningModelIndex.ts";
import { ExecutiveReasoningPipelineFoundation } from "./executiveReasoningPipelineFoundation.ts";
import { ExecutiveReasoningPlatform } from "./executiveReasoningPlatformIndex.ts";
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

const freeze = Object.freeze({
  metadata: ExecutiveReasoningFreezeMetadata,
  registry: ExecutiveReasoningFreezeRegistry,
  compatibility: ExecutiveReasoningCompatibility,
  extensionPolicy: ExecutiveReasoningExtensionPolicy,
  summary: ExecutiveReasoningFreezeSummary,
  ownership: Object.freeze({
    owner: "ENG-6",
    owns: Object.freeze([
      "freeze metadata",
      "freeze registry",
      "compatibility declarations",
      "extension policy",
      "release-lock metadata",
    ] as const),
    neverOwns: Object.freeze([
      "reasoning execution",
      "inference",
      "confidence evaluation",
      "evidence processing",
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
 * Canonical Executive Reasoning Freeze Platform.
 * Aggregates ENG-6:1 through ENG-6:7 without modification. Metadata only.
 */
export const ExecutiveReasoningFreezePlatform = Object.freeze({
  foundation: ExecutiveReasoningPipelineFoundation,
  registry,
  model: ExecutiveReasoningModelPlatform,
  validation: ExecutiveReasoningValidationPlatform,
  manifest: ExecutiveReasoningManifest,
  platform: ExecutiveReasoningPlatform,
  certification: ExecutiveReasoningCertificationPlatform,
  freeze,
} as const);

export const getExecutiveReasoningFreeze = () => ExecutiveReasoningFreezePlatform;
export const getExecutiveReasoningFreezeMetadata = () => ExecutiveReasoningFreezeMetadata;
export const getExecutiveReasoningFreezeSummary = () => ExecutiveReasoningFreezeSummary;

export {
  ExecutiveReasoningCompatibility,
  ExecutiveReasoningExtensionPolicy,
  ExecutiveReasoningFreezeMetadata,
  ExecutiveReasoningFreezeRegistry,
};
