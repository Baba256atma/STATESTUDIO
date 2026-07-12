import {
  ExecutionPlatformDescription,
  ExecutionPlatformId,
  ExecutionPlatformIdentity,
  ExecutionPlatformName,
  ExecutionPlatformNamespace,
  ExecutionPlatformVersion,
  ExecutionPublicApis,
} from "./executionIndex.ts";
import { ExecutionPlatformMetadata } from "./executionMetadata.ts";

export interface ExecutionPublicApiRegistryEntry {
  readonly name: string;
  readonly kind: string;
  readonly exportSource: string;
  readonly stability: "Stable";
}

export const ExecutionPublicApiRegistry = Object.freeze([
  ...ExecutionPublicApis.map((api) =>
    Object.freeze({
      name: api.name,
      kind: api.kind,
      exportSource: api.exportPath,
      stability: api.stability,
    } as const),
  ),
  Object.freeze({
    name: "ExecutionPlatformId",
    kind: "Constant",
    exportSource: "./executionIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "ExecutionPlatformVersion",
    kind: "Constant",
    exportSource: "./executionIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "ExecutionPlatformName",
    kind: "Constant",
    exportSource: "./executionIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "ExecutionPlatformNamespace",
    kind: "Constant",
    exportSource: "./executionIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "ExecutionPlatformDescription",
    kind: "Constant",
    exportSource: "./executionIndex.ts",
    stability: "Stable",
  }),
  Object.freeze({
    name: "ExecutionPlatformIdentity",
    kind: "Object",
    exportSource: "./executionIndex.ts",
    stability: "Stable",
  }),
] as const satisfies readonly ExecutionPublicApiRegistryEntry[]);

export const ExecutionPublicApiRegistryMetadata = Object.freeze({
  registryId: "ops.execution.public-api-registry",
  registryVersion: ExecutionPlatformMetadata.compatibilityVersion,
  exportedApiCount: ExecutionPublicApiRegistry.length,
  rootPlatformId: ExecutionPlatformId,
  rootPlatformVersion: ExecutionPlatformVersion,
  rootPlatformName: ExecutionPlatformName,
  rootPlatformNamespace: ExecutionPlatformNamespace,
  rootPlatformDescription: ExecutionPlatformDescription,
  rootPlatformIdentity: ExecutionPlatformIdentity,
  metadataOnly: true,
  immutable: true,
} as const);
