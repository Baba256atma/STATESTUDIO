import {
  ExecutiveOrchestrationCapabilityContract,
  ExecutiveOrchestrationDependencyContract,
  ExecutiveOrchestrationFoundation,
  ExecutiveOrchestrationLifecycleContract,
  ExecutiveOrchestrationResponsibilityContract,
  getExecutiveOrchestrationFoundation,
} from "./executiveOrchestrationFoundation.ts";

/**
 * Immutable foundation summary for ENG-8:5.
 * References ENG-8:1 only through its public API.
 */
export const ExecutiveOrchestrationFoundationManifest = Object.freeze({
  id: "eng-8-manifest-foundation",
  section: "Foundation",
  name: "Executive Orchestration Foundation Manifest",
  description:
    "Immutable summary of ENG-8:1 foundation responsibilities, lifecycle, capabilities, and dependency declarations.",
  foundation: getExecutiveOrchestrationFoundation(),
  foundationId: ExecutiveOrchestrationFoundation.id,
  responsibilities: Object.freeze({
    count: ExecutiveOrchestrationResponsibilityContract.responsibilities.length,
    ids: Object.freeze(
      ExecutiveOrchestrationResponsibilityContract.responsibilities.map(({ id }) => id),
    ),
    coordinationTargetCount:
      ExecutiveOrchestrationResponsibilityContract.coordinationTargets.length,
  } as const),
  lifecycle: Object.freeze({
    stageCount: ExecutiveOrchestrationLifecycleContract.stages.length,
    ordering: ExecutiveOrchestrationLifecycleContract.ordering,
    first: ExecutiveOrchestrationLifecycleContract.ordering[0],
    last: ExecutiveOrchestrationLifecycleContract.ordering[7],
  } as const),
  capabilities: Object.freeze({
    count: ExecutiveOrchestrationCapabilityContract.capabilities.length,
    ids: Object.freeze(
      ExecutiveOrchestrationCapabilityContract.capabilities.map(({ id }) => id),
    ),
  } as const),
  dependencyDeclarations: Object.freeze({
    allowed: ExecutiveOrchestrationDependencyContract.rules.allowed,
    forbidden: ExecutiveOrchestrationDependencyContract.rules.forbidden,
    direction: ExecutiveOrchestrationDependencyContract.rules.direction,
    publicApiOnly: ExecutiveOrchestrationDependencyContract.rules.publicApiOnly,
  } as const),
  architecturalBoundaries: ExecutiveOrchestrationFoundation.architecturalBoundaries,
  status: "Complete",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  deeplyFrozen: true,
} as const);
