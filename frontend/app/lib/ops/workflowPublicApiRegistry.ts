import {
  ExecutiveWorkflowIntelligenceFoundation,
  WorkflowIntelligencePlatformDescription,
  WorkflowIntelligencePlatformId,
  WorkflowIntelligencePlatformName,
  WorkflowIntelligencePlatformNamespace,
  WorkflowIntelligencePlatformVersion,
  WorkflowIntelligencePublicApis,
} from "./workflowIntelligenceIndex.ts";
import { WorkflowPlatformMetadata } from "./workflowMetadata.ts";

export interface WorkflowPublicApiRegistryEntry {
  readonly name: string;
  readonly kind: string;
  readonly exportSource: string;
  readonly stability: "Stable";
}

export const WorkflowPublicApiRegistry = Object.freeze([
  ...WorkflowIntelligencePublicApis.map((api) =>
    Object.freeze({
      name: api.name,
      kind: api.kind,
      exportSource: api.exportPath,
      stability: api.stability,
    } as const),
  ),
  Object.freeze({
    name: "WorkflowIntelligencePlatformId",
    kind: "Constant",
    exportSource: "./workflowIntelligenceIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "WorkflowIntelligencePlatformVersion",
    kind: "Constant",
    exportSource: "./workflowIntelligenceIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "WorkflowIntelligencePlatformName",
    kind: "Constant",
    exportSource: "./workflowIntelligenceIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "WorkflowIntelligencePlatformNamespace",
    kind: "Constant",
    exportSource: "./workflowIntelligenceIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "WorkflowIntelligencePlatformDescription",
    kind: "Constant",
    exportSource: "./workflowIntelligenceIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "ExecutiveWorkflowIntelligenceFoundation",
    kind: "Object",
    exportSource: "./workflowIntelligenceIndex.ts",
    stability: "Stable",
  }),
] as const satisfies readonly WorkflowPublicApiRegistryEntry[]);

export const WorkflowPublicApiRegistryMetadata = Object.freeze({
  registryId: "ops.workflow-intelligence.public-api-registry",
  registryVersion: WorkflowPlatformMetadata.compatibilityVersion,
  exportedApiCount: WorkflowPublicApiRegistry.length,
  rootPlatformId: WorkflowIntelligencePlatformId,
  rootPlatformVersion: WorkflowIntelligencePlatformVersion,
  rootPlatformName: WorkflowIntelligencePlatformName,
  rootPlatformNamespace: WorkflowIntelligencePlatformNamespace,
  rootPlatformDescription: WorkflowIntelligencePlatformDescription,
  rootPlatformFoundation: ExecutiveWorkflowIntelligenceFoundation,
  metadataOnly: true,
  immutable: true,
} as const);
