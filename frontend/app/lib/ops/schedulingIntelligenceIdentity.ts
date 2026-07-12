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
import {
  ExecutiveResourceIntelligencePublicIndexId,
  ExecutiveResourceIntelligencePublicIndexVersion,
} from "./executiveResourceIntelligencePublicIndex.ts";

export const SchedulingIntelligencePlatformId = "OPS-6:1" as const;

export const SchedulingIntelligencePlatformName =
  "Nexora Executive Operations Scheduling Intelligence Foundation" as const;

export const SchedulingIntelligencePlatformNamespace =
  "nexora.ops.scheduling-intelligence.foundation" as const;

export const SchedulingIntelligencePlatformDescription =
  "Canonical metadata-only scheduling intelligence foundation for the Executive Operations Platform." as const;

export const SchedulingIntelligencePlatformVersion = "1.0.0" as const;

export const SchedulingIntelligenceArchitecturalLevel =
  "OPS Functional Foundation" as const;

export const SchedulingIntelligencePlatformStatus = "Draft" as const;

export const SchedulingIntelligenceIdentity = Object.freeze({
  platformId: SchedulingIntelligencePlatformId,
  platformName: SchedulingIntelligencePlatformName,
  platformNamespace: SchedulingIntelligencePlatformNamespace,
  platformDescription: SchedulingIntelligencePlatformDescription,
  platformVersion: SchedulingIntelligencePlatformVersion,
  platformArchitecturalLevel: SchedulingIntelligenceArchitecturalLevel,
  platformStatus: SchedulingIntelligencePlatformStatus,
  dependencySources: Object.freeze([
    ExecutiveOperationsPublicIndexId,
    ExecutiveTaskIntelligencePublicIndexId,
    ExecutiveWorkflowIntelligencePublicIndexId,
    ExecutiveProjectExecutionPublicIndexId,
    ExecutiveResourceIntelligencePublicIndexId,
  ]),
  dependencyVersions: Object.freeze([
    ExecutiveOperationsPublicIndexVersion,
    ExecutiveTaskIntelligencePublicIndexVersion,
    ExecutiveWorkflowIntelligencePublicIndexVersion,
    ExecutiveProjectExecutionPublicIndexVersion,
    ExecutiveResourceIntelligencePublicIndexVersion,
  ]),
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
