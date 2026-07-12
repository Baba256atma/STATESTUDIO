import { ExecutionCapabilityRegistry } from "./executionCapabilityRegistry.ts";
import { ExecutionPlatformMetadata } from "./executionMetadata.ts";

export interface ExecutionDependencyRegistryEntry {
  readonly capabilityId: string;
  readonly capabilityName: string;
  readonly futurePhaseDependencies: readonly string[];
  readonly dependencyMode: "MetadataOnly";
  readonly resolutionRuntime: false;
}

export const ExecutionDependencyRegistry = Object.freeze(
  ExecutionCapabilityRegistry.map((capability, index) =>
    Object.freeze({
      capabilityId: capability.id,
      capabilityName: capability.name,
      futurePhaseDependencies: Object.freeze([
        `OPS-1:${index + 3}`,
        `OPS-2:${index + 1}`,
      ]),
      dependencyMode: "MetadataOnly",
      resolutionRuntime: false,
    } as const),
  ),
) as readonly ExecutionDependencyRegistryEntry[];

export const ExecutionDependencyRegistryMetadata = Object.freeze({
  registryId: "ops.execution.dependency-registry",
  registryVersion: ExecutionPlatformMetadata.compatibilityVersion,
  dependencyCount: ExecutionDependencyRegistry.length,
  metadataOnly: true,
  immutable: true,
} as const);
