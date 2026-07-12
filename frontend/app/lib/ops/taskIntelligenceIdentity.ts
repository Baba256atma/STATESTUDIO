import {
  ExecutiveOperationsPublicIndexId,
  ExecutiveOperationsPublicIndexVersion,
} from "./executiveOperationsPublicIndex.ts";

export const TaskIntelligencePlatformId = "OPS-2:1" as const;

export const TaskIntelligencePlatformName =
  "Nexora Executive Operations Task Intelligence Foundation" as const;

export const TaskIntelligencePlatformNamespace =
  "nexora.ops.task-intelligence.foundation" as const;

export const TaskIntelligencePlatformDescription =
  "Canonical metadata-only task intelligence foundation for the Executive Operations Platform." as const;

export const TaskIntelligencePlatformVersion = "1.0.0" as const;

export const TaskIntelligenceArchitecturalLevel =
  "OPS Functional Foundation" as const;

export const TaskIntelligenceIdentity = Object.freeze({
  platformId: TaskIntelligencePlatformId,
  platformName: TaskIntelligencePlatformName,
  platformNamespace: TaskIntelligencePlatformNamespace,
  platformDescription: TaskIntelligencePlatformDescription,
  platformVersion: TaskIntelligencePlatformVersion,
  architecturalLevel: TaskIntelligenceArchitecturalLevel,
  dependencySource: ExecutiveOperationsPublicIndexId,
  dependencyVersion: ExecutiveOperationsPublicIndexVersion,
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
