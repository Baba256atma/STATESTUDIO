import { ExecutiveEngineMetadata } from "./engineIndex.ts";
import type { ExecutiveEngineDependencyRegistryEntry, ExecutiveEnginePublicDependencyId } from "./engineRegistryTypes.ts";

const dependency = (id: ExecutiveEnginePublicDependencyId, name: string) => Object.freeze({
  id, name, dependencyType: "PublicApi", ownership: "ExternalPublicLayer",
  circularDependencyAllowed: false, metadataOnly: true, immutable: true,
} as const satisfies ExecutiveEngineDependencyRegistryEntry);

export const ExecutiveEngineDependencyRegistry = Object.freeze([
  dependency("CORE", "Core Platform"),
  dependency("CORE-TEN", "Core Tenancy Platform"),
  dependency("BUS", "Business Platform"),
  dependency("OPS", "Operations Platform"),
] as const);

export const ExecutiveEngineDependencyRegistryMetadata = Object.freeze({
  registryId: "eng-1-2-public-dependencies",
  dependencyCount: ExecutiveEngineDependencyRegistry.length,
  approvedDependencies: ExecutiveEngineMetadata.publicDependencies,
  publicApisOnly: true, circularDependenciesAllowed: false,
  metadataOnly: true, immutable: true, deterministic: true,
} as const);
