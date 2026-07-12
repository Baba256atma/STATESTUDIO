import { ExecutiveEngineRegistry } from "./engineIndex.ts";
import { ExecutiveEngineCapabilityRegistry, ExecutiveEngineCapabilityRegistryMetadata } from "./engineCapabilityRegistry.ts";
import { ExecutiveEngineComponentRegistry } from "./engineComponentRegistry.ts";
import { ExecutiveEngineDependencyRegistry, ExecutiveEngineDependencyRegistryMetadata } from "./engineDependencyRegistry.ts";
import { ExecutiveEngineCurrentLifecycle, ExecutiveEngineLifecycleRegistry } from "./engineLifecycleRegistry.ts";
import type { ExecutiveEngineRegistryManifestDescriptor } from "./engineRegistryTypes.ts";

export const ExecutiveEngineRegistryMetadata = Object.freeze({
  registryId: "ENG-1:2", registryName: "Executive Engine Registry",
  registryVersion: "1.0.0", registryNamespace: "nexora.engine.executive.registry",
  foundationId: ExecutiveEngineRegistry.platformId,
  capabilityCount: ExecutiveEngineCapabilityRegistry.length,
  componentCount: ExecutiveEngineComponentRegistry.length,
  dependencyCount: ExecutiveEngineDependencyRegistry.length,
  lifecycleCount: ExecutiveEngineLifecycleRegistry.length,
  releaseStatus: "Draft", metadataOnly: true, immutable: true, deterministic: true,
} as const);

export const ExecutiveEngineRegistryManifest = Object.freeze({
  registryId: "ENG-1:2",
  capabilityRegistry: ExecutiveEngineCapabilityRegistry,
  componentRegistry: ExecutiveEngineComponentRegistry,
  dependencyRegistry: ExecutiveEngineDependencyRegistry,
  lifecycleRegistry: ExecutiveEngineLifecycleRegistry,
  currentLifecycle: ExecutiveEngineCurrentLifecycle,
  metadata: Object.freeze({ registry: ExecutiveEngineRegistryMetadata,
    capabilities: ExecutiveEngineCapabilityRegistryMetadata,
    dependencies: ExecutiveEngineDependencyRegistryMetadata }),
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveEngineRegistryManifestDescriptor);

export const getExecutiveEngineRegistryManifest = () => ExecutiveEngineRegistryManifest;
