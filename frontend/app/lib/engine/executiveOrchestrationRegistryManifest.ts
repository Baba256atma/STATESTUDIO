import {
  ExecutiveOrchestrationCapabilityRegistry,
  ExecutiveOrchestrationComponentRegistry,
  ExecutiveOrchestrationCoordinationRegistry,
  ExecutiveOrchestrationDependencyRegistry,
  ExecutiveOrchestrationLifecycleRegistry,
  ExecutiveOrchestrationRegistryPlatform,
  getExecutiveOrchestrationRegistryPlatform,
} from "./executiveOrchestrationRegistryPlatform.ts";

/**
 * Immutable registry inventory for ENG-8:5.
 * References ENG-8:2 only through its public API.
 */
export const ExecutiveOrchestrationRegistryManifest = Object.freeze({
  id: "eng-8-manifest-registry",
  section: "Registry",
  name: "Executive Orchestration Registry Manifest",
  description:
    "Immutable inventory summarizing ENG-8:2 registry components, targets, capabilities, lifecycle, dependencies, responsibilities, modes, and routes.",
  registry: getExecutiveOrchestrationRegistryPlatform(),
  registryId: ExecutiveOrchestrationRegistryPlatform.registryMetadata.id,
  inventory: Object.freeze({
    components: ExecutiveOrchestrationComponentRegistry.length,
    coordinationTargets: ExecutiveOrchestrationCoordinationRegistry.length,
    capabilities: ExecutiveOrchestrationCapabilityRegistry.length,
    lifecycleStages: ExecutiveOrchestrationLifecycleRegistry.length,
    dependencies: ExecutiveOrchestrationDependencyRegistry.length,
    responsibilities: ExecutiveOrchestrationRegistryPlatform.responsibilities.length,
    executionModes: ExecutiveOrchestrationRegistryPlatform.executionModes.length,
    routingRelationships:
      ExecutiveOrchestrationRegistryPlatform.routingRelationships.length,
  } as const),
  componentNames: Object.freeze(
    ExecutiveOrchestrationComponentRegistry.map(({ name }) => name),
  ),
  coordinationTargetNames: Object.freeze(
    ExecutiveOrchestrationCoordinationRegistry.map(({ name }) => name),
  ),
  lifecycleOrdering: Object.freeze(
    ExecutiveOrchestrationLifecycleRegistry.map(({ stageId }) => stageId),
  ),
  executionModes: Object.freeze(
    ExecutiveOrchestrationRegistryPlatform.executionModes.map(({ modeId }) => modeId),
  ),
  status: "Complete",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  deeplyFrozen: true,
} as const);
