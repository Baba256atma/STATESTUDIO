import { WorkflowPlatformMetadata } from "./workflowMetadataIndex.ts";
import type { WorkflowPlatformDependencyEntry } from "./workflowPlatformManifestTypes.ts";

export const WorkflowPlatformDependencyMap = Object.freeze([
  Object.freeze({
    sourcePhaseId: "OPS-3:2",
    targetPhaseId: "OPS-3:1",
    dependencyType: "PublicApi",
    relationship: "Extends workflow foundation through public exports.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-3:3",
    targetPhaseId: "OPS-3:1",
    dependencyType: "PublicApi",
    relationship: "Consumes workflow foundation through public exports.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-3:3",
    targetPhaseId: "OPS-3:2",
    dependencyType: "PublicApi",
    relationship: "Consumes workflow metadata registries through public exports.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-3:4",
    targetPhaseId: "OPS-3:1",
    dependencyType: "PublicApi",
    relationship: "Validates workflow foundation through public exports.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-3:4",
    targetPhaseId: "OPS-3:2",
    dependencyType: "PublicApi",
    relationship: "Validates workflow registry and metadata through public exports.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-3:4",
    targetPhaseId: "OPS-3:3",
    dependencyType: "PublicApi",
    relationship: "Validates workflow model through public exports.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-3:1",
    targetPhaseId: "OPS-2:9",
    dependencyType: "PublicApi",
    relationship: "Workflow foundation consumes task intelligence public platform.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformDependencyEntry),
] as const);

export const WorkflowPlatformDependencyMapMetadata = Object.freeze({
  dependencyMapId: "ops.workflow-intelligence.platform-dependency-map",
  dependencyMapVersion: WorkflowPlatformMetadata.compatibilityVersion,
  dependencyCount: WorkflowPlatformDependencyMap.length,
  metadataOnly: true,
  immutable: true,
} as const);
