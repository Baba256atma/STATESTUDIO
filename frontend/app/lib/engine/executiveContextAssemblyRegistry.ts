import { ExecutiveContextCapabilityRegistry } from "./executiveContextCapabilityRegistry.ts";
import { ExecutiveContextDomainRegistry } from "./executiveContextDomainRegistry.ts";
import { ExecutiveContextLifecycleRegistry } from "./executiveContextLifecycleRegistry.ts";
import { ExecutiveContextOwnershipRegistry } from "./executiveContextOwnershipRegistry.ts";
import { ExecutiveContextSourceRegistry } from "./executiveContextSourceRegistry.ts";
import type {
  ExecutiveContextAssemblyRegistryAggregate,
  ExecutiveContextAssemblyRegistrySummary,
  ExecutiveContextRegistryDependency,
  ExecutiveContextRegistryMetadata,
} from "./executiveContextAssemblyRegistryTypes.ts";

const registryMetadata = Object.freeze({
  registryId: "ENG-4:2",
  registryVersion: "1.0.0",
  registryName: "Executive Context Assembly Registry",
  namespace: "nexora.engine.executive.context-assembly.registry",
  phase: "ENG-4:2",
  owner: "ENG-4",
  status: Object.freeze({
    registry: "Registry",
    metadataOnly: "MetadataOnly",
    immutable: "Immutable",
    runtimeFree: "RuntimeFree",
    deterministic: "Deterministic",
  } as const),
  nextPhase: "ENG-4:3",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutiveContextRegistryMetadata);

const registryDependencies = Object.freeze([
  Object.freeze({
    phase: "ENG-1",
    publicIndex: "executiveEnginePublicIndex.ts",
    consumption: "PublicIndexOnly",
    metadataOnly: true,
    immutable: true,
  } as const satisfies ExecutiveContextRegistryDependency),
  Object.freeze({
    phase: "ENG-2",
    publicIndex: "executiveRequestIntentPublicIndex.ts",
    consumption: "PublicIndexOnly",
    metadataOnly: true,
    immutable: true,
  } as const satisfies ExecutiveContextRegistryDependency),
  Object.freeze({
    phase: "ENG-3",
    publicIndex: "executiveIntentResolutionPublicIndex.ts",
    consumption: "PublicIndexOnly",
    metadataOnly: true,
    immutable: true,
  } as const satisfies ExecutiveContextRegistryDependency),
  Object.freeze({
    phase: "ENG-4:1",
    publicIndex: "executiveContextAssemblyFoundation.ts",
    consumption: "PublicIndexOnly",
    metadataOnly: true,
    immutable: true,
  } as const satisfies ExecutiveContextRegistryDependency),
] as const);

export const ExecutiveContextAssemblyRegistry = Object.freeze({
  domains: ExecutiveContextDomainRegistry,
  sources: ExecutiveContextSourceRegistry,
  capabilities: ExecutiveContextCapabilityRegistry,
  lifecycle: ExecutiveContextLifecycleRegistry,
  ownership: ExecutiveContextOwnershipRegistry,
  metadata: registryMetadata,
  dependencies: registryDependencies,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutiveContextAssemblyRegistryAggregate);

const registrySummary = Object.freeze({
  registryId: "ENG-4:2",
  phase: "ENG-4:2",
  namespace: "nexora.engine.executive.context-assembly.registry",
  owner: "ENG-4",
  domainCount: ExecutiveContextDomainRegistry.entries.length,
  sourceCount: ExecutiveContextSourceRegistry.entries.length,
  capabilityCount: ExecutiveContextCapabilityRegistry.entries.length,
  lifecycleStageCount: ExecutiveContextLifecycleRegistry.entries.length,
  ownershipCount: ExecutiveContextOwnershipRegistry.entries.length,
  dependencyCount: registryDependencies.length,
  nextPhase: "ENG-4:3",
  modelReady: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutiveContextAssemblyRegistrySummary);

export { ExecutiveContextCapabilityRegistry } from "./executiveContextCapabilityRegistry.ts";
export { ExecutiveContextDomainRegistry } from "./executiveContextDomainRegistry.ts";
export { ExecutiveContextLifecycleRegistry } from "./executiveContextLifecycleRegistry.ts";
export { ExecutiveContextOwnershipRegistry } from "./executiveContextOwnershipRegistry.ts";
export { ExecutiveContextSourceRegistry } from "./executiveContextSourceRegistry.ts";

export const getExecutiveContextAssemblyRegistry = () => ExecutiveContextAssemblyRegistry;
export const getExecutiveContextDomainRegistry = () => ExecutiveContextDomainRegistry;
export const getExecutiveContextSourceRegistry = () => ExecutiveContextSourceRegistry;
export const getExecutiveContextCapabilityRegistry = () => ExecutiveContextCapabilityRegistry;
export const getExecutiveContextLifecycleRegistry = () => ExecutiveContextLifecycleRegistry;
export const getExecutiveContextOwnershipRegistry = () => ExecutiveContextOwnershipRegistry;
export const getExecutiveContextAssemblyRegistrySummary = () => registrySummary;
