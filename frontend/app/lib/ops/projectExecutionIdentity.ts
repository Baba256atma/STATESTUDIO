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

export const ProjectExecutionPlatformId = "OPS-4:1" as const;

export const ProjectExecutionPlatformName =
  "Nexora Executive Operations Project Execution Foundation" as const;

export const ProjectExecutionPlatformNamespace =
  "nexora.ops.project-execution.foundation" as const;

export const ProjectExecutionPlatformDescription =
  "Canonical metadata-only project execution foundation for the Executive Operations Platform." as const;

export const ProjectExecutionPlatformVersion = "1.0.0" as const;

export const ProjectExecutionArchitecturalLevel =
  "OPS Functional Foundation" as const;

export const ProjectExecutionIdentity = Object.freeze({
  platformId: ProjectExecutionPlatformId,
  platformName: ProjectExecutionPlatformName,
  platformNamespace: ProjectExecutionPlatformNamespace,
  platformDescription: ProjectExecutionPlatformDescription,
  platformVersion: ProjectExecutionPlatformVersion,
  architecturalLevel: ProjectExecutionArchitecturalLevel,
  dependencySources: Object.freeze([
    ExecutiveOperationsPublicIndexId,
    ExecutiveTaskIntelligencePublicIndexId,
    ExecutiveWorkflowIntelligencePublicIndexId,
  ]),
  dependencyVersions: Object.freeze([
    ExecutiveOperationsPublicIndexVersion,
    ExecutiveTaskIntelligencePublicIndexVersion,
    ExecutiveWorkflowIntelligencePublicIndexVersion,
  ]),
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

