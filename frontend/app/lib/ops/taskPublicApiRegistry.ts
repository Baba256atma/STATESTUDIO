import {
  ExecutiveTaskIntelligenceFoundation,
  TaskIntelligencePlatformDescription,
  TaskIntelligencePlatformId,
  TaskIntelligencePlatformName,
  TaskIntelligencePlatformNamespace,
  TaskIntelligencePlatformVersion,
  TaskIntelligencePublicApis,
} from "./taskIntelligenceIndex.ts";
import { TaskPlatformMetadata } from "./taskMetadata.ts";

export interface TaskPublicApiRegistryEntry {
  readonly name: string;
  readonly kind: string;
  readonly exportSource: string;
  readonly stability: "Stable";
}

export const TaskPublicApiRegistry = Object.freeze([
  ...TaskIntelligencePublicApis.map((api) =>
    Object.freeze({
      name: api.name,
      kind: api.kind,
      exportSource: api.exportPath,
      stability: api.stability,
    } as const),
  ),
  Object.freeze({
    name: "TaskIntelligencePlatformId",
    kind: "Constant",
    exportSource: "./taskIntelligenceIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "TaskIntelligencePlatformVersion",
    kind: "Constant",
    exportSource: "./taskIntelligenceIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "TaskIntelligencePlatformName",
    kind: "Constant",
    exportSource: "./taskIntelligenceIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "TaskIntelligencePlatformNamespace",
    kind: "Constant",
    exportSource: "./taskIntelligenceIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "TaskIntelligencePlatformDescription",
    kind: "Constant",
    exportSource: "./taskIntelligenceIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "ExecutiveTaskIntelligenceFoundation",
    kind: "Object",
    exportSource: "./taskIntelligenceIndex.ts",
    stability: "Stable",
  }),
] as const satisfies readonly TaskPublicApiRegistryEntry[]);

export const TaskPublicApiRegistryMetadata = Object.freeze({
  registryId: "ops.task-intelligence.public-api-registry",
  registryVersion: TaskPlatformMetadata.compatibilityVersion,
  exportedApiCount: TaskPublicApiRegistry.length,
  rootPlatformId: TaskIntelligencePlatformId,
  rootPlatformVersion: TaskIntelligencePlatformVersion,
  rootPlatformName: TaskIntelligencePlatformName,
  rootPlatformNamespace: TaskIntelligencePlatformNamespace,
  rootPlatformDescription: TaskIntelligencePlatformDescription,
  rootPlatformFoundation: ExecutiveTaskIntelligenceFoundation,
  metadataOnly: true,
  immutable: true,
} as const);
