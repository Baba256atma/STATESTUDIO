import {
  ExecutiveOperationsPublicIndexId,
  ExecutiveOperationsPublicIndexVersion,
} from "./executiveOperationsPublicIndex.ts";
import {
  ExecutiveTaskIntelligencePublicIndexId,
  ExecutiveTaskIntelligencePublicIndexVersion,
} from "./executiveTaskIntelligencePublicIndex.ts";

export const WorkflowIntelligencePlatformId = "OPS-3:1" as const;

export const WorkflowIntelligencePlatformName =
  "Nexora Executive Operations Workflow Intelligence Foundation" as const;

export const WorkflowIntelligencePlatformNamespace =
  "nexora.ops.workflow-intelligence.foundation" as const;

export const WorkflowIntelligencePlatformDescription =
  "Canonical metadata-only workflow intelligence foundation for the Executive Operations Platform." as const;

export const WorkflowIntelligencePlatformVersion = "1.0.0" as const;

export const WorkflowIntelligenceArchitecturalLevel =
  "OPS Functional Foundation" as const;

export const WorkflowIntelligenceIdentity = Object.freeze({
  platformId: WorkflowIntelligencePlatformId,
  platformName: WorkflowIntelligencePlatformName,
  platformNamespace: WorkflowIntelligencePlatformNamespace,
  platformDescription: WorkflowIntelligencePlatformDescription,
  platformVersion: WorkflowIntelligencePlatformVersion,
  architecturalLevel: WorkflowIntelligenceArchitecturalLevel,
  dependencySources: Object.freeze([
    ExecutiveOperationsPublicIndexId,
    ExecutiveTaskIntelligencePublicIndexId,
  ]),
  dependencyVersions: Object.freeze([
    ExecutiveOperationsPublicIndexVersion,
    ExecutiveTaskIntelligencePublicIndexVersion,
  ]),
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
