import type { ExecutionDependency, ExecutionPublicApi } from "./executionTypes.ts";
import { ExecutionContracts } from "./executionContracts.ts";
import { ExecutionPlatformIdentity } from "./executionIdentity.ts";
import { ExecutionRegistry } from "./executionRegistry.ts";

const executionManifestDependencies = Object.freeze([
  Object.freeze({
    id: "dep-bus-public-api",
    name: "Executive Business Intelligence Public Architecture",
    version: "public-api",
    kind: "Architecture",
    optional: false,
    metadata: ExecutionPlatformIdentity.metadata,
  } as const satisfies ExecutionDependency),
]) as readonly ExecutionDependency[];

export const ExecutionPublicApis = Object.freeze([
  Object.freeze({
    name: "ExecutiveExecutionFoundation",
    exportPath: "./executionIndex.ts",
    kind: "Object",
    stability: "Stable",
    description: "Immutable namespace for the OPS execution foundation.",
  } as const satisfies ExecutionPublicApi),
  Object.freeze({
    name: "buildExecutionManifest",
    exportPath: "./executionIndex.ts",
    kind: "Function",
    stability: "Stable",
    description: "Deterministic manifest builder for OPS execution metadata.",
  } as const satisfies ExecutionPublicApi),
  Object.freeze({
    name: "validateExecutionFoundation",
    exportPath: "./executionIndex.ts",
    kind: "Function",
    stability: "Stable",
    description: "Architectural integrity validator for OPS execution metadata.",
  } as const satisfies ExecutionPublicApi),
]) as readonly ExecutionPublicApi[];

export const buildExecutionManifest = () =>
  Object.freeze({
    identity: ExecutionPlatformIdentity,
    registry: ExecutionRegistry,
    contracts: ExecutionContracts,
    dependencies: executionManifestDependencies,
    publicApis: ExecutionPublicApis,
    compatibilityVersion: "1.0.0",
    metadataOnly: true,
    deterministic: true,
    immutable: true,
  } as const);
