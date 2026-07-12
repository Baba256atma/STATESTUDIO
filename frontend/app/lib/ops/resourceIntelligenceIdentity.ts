import {
  ExecutiveOperationsPublicIndexId,
  ExecutiveOperationsPublicIndexVersion,
} from "./executiveOperationsPublicIndex.ts";
import {
  ExecutiveTaskIntelligencePublicIndexId,
  ExecutiveTaskIntelligencePublicIndexVersion,
} from "./executiveTaskIntelligencePublicIndex.ts";
import {
  ExecutiveWorkflowIntelligencePublicIndexId,
  ExecutiveWorkflowIntelligencePublicIndexVersion,
} from "./executiveWorkflowIntelligencePublicIndex.ts";
import {
  ExecutiveProjectExecutionPublicIndexId,
  ExecutiveProjectExecutionPublicIndexVersion,
} from "./executiveProjectExecutionPublicIndex.ts";

export const ResourceIntelligencePlatformId = "OPS-5:1" as const;

export const ResourceIntelligencePlatformName =
  "Nexora Executive Operations Resource Intelligence Foundation" as const;

export const ResourceIntelligencePlatformNamespace =
  "nexora.ops.resource-intelligence.foundation" as const;

export const ResourceIntelligencePlatformDescription =
  "Canonical metadata-only resource intelligence foundation for the Executive Operations Platform." as const;

export const ResourceIntelligencePlatformVersion = "1.0.0" as const;

export const ResourceIntelligenceArchitecturalLevel =
  "OPS Functional Foundation" as const;

export const ResourceIntelligencePlatformStatus = "Draft" as const;

export const ResourceIntelligenceIdentity = Object.freeze({
  platformId: ResourceIntelligencePlatformId,
  platformName: ResourceIntelligencePlatformName,
  platformNamespace: ResourceIntelligencePlatformNamespace,
  platformDescription: ResourceIntelligencePlatformDescription,
  platformVersion: ResourceIntelligencePlatformVersion,
  platformArchitecturalLevel: ResourceIntelligenceArchitecturalLevel,
  platformStatus: ResourceIntelligencePlatformStatus,
  dependencySources: Object.freeze([
    ExecutiveOperationsPublicIndexId,
    ExecutiveTaskIntelligencePublicIndexId,
    ExecutiveWorkflowIntelligencePublicIndexId,
    ExecutiveProjectExecutionPublicIndexId,
  ]),
  dependencyVersions: Object.freeze([
    ExecutiveOperationsPublicIndexVersion,
    ExecutiveTaskIntelligencePublicIndexVersion,
    ExecutiveWorkflowIntelligencePublicIndexVersion,
    ExecutiveProjectExecutionPublicIndexVersion,
  ]),
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

