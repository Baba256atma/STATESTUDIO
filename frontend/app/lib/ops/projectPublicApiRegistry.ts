import {
  ExecutiveProjectExecutionFoundation,
  ProjectExecutionPlatformDescription,
  ProjectExecutionPlatformId,
  ProjectExecutionPlatformName,
  ProjectExecutionPlatformNamespace,
  ProjectExecutionPlatformVersion,
  ProjectExecutionPublicApis,
} from "./projectExecutionIndex.ts";
import { ProjectPlatformMetadata } from "./projectMetadata.ts";

export interface ProjectPublicApiRegistryEntry {
  readonly name: string;
  readonly kind: string;
  readonly exportSource: string;
  readonly stability: "Stable";
}

export const ProjectPublicApiRegistry = Object.freeze([
  ...ProjectExecutionPublicApis.map((api) =>
    Object.freeze({
      name: api.name,
      kind: api.kind,
      exportSource: api.exportPath,
      stability: api.stability,
    } as const),
  ),
  Object.freeze({
    name: "ProjectExecutionPlatformId",
    kind: "Constant",
    exportSource: "./projectExecutionIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "ProjectExecutionPlatformVersion",
    kind: "Constant",
    exportSource: "./projectExecutionIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "ProjectExecutionPlatformName",
    kind: "Constant",
    exportSource: "./projectExecutionIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "ProjectExecutionPlatformNamespace",
    kind: "Constant",
    exportSource: "./projectExecutionIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "ProjectExecutionPlatformDescription",
    kind: "Constant",
    exportSource: "./projectExecutionIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "ExecutiveProjectExecutionFoundation",
    kind: "Object",
    exportSource: "./projectExecutionIndex.ts",
    stability: "Stable",
  }),
] as const satisfies readonly ProjectPublicApiRegistryEntry[]);

export const ProjectPublicApiRegistryMetadata = Object.freeze({
  registryId: "ops.project-execution.public-api-registry",
  registryVersion: ProjectPlatformMetadata.compatibilityVersion,
  exportedApiCount: ProjectPublicApiRegistry.length,
  rootPlatformId: ProjectExecutionPlatformId,
  rootPlatformVersion: ProjectExecutionPlatformVersion,
  rootPlatformName: ProjectExecutionPlatformName,
  rootPlatformNamespace: ProjectExecutionPlatformNamespace,
  rootPlatformDescription: ProjectExecutionPlatformDescription,
  rootPlatformFoundation: ExecutiveProjectExecutionFoundation,
  metadataOnly: true,
  immutable: true,
} as const);

