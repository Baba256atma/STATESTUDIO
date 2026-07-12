import {
  DependencyIntelligenceRegistry,
} from "./dependencyIntelligenceIndex.ts";
import type {
  DependencyEntityDescriptor,
} from "./dependencyRegistryTypes.ts";

const dependencyMetadata = Object.freeze({
  platformId: DependencyIntelligenceRegistry.platformId,
  platformVersion: DependencyIntelligenceRegistry.version,
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  tags: Object.freeze(["ops", "dependency-registry", "entity-catalog"]),
} as const);

export const DependencyEntityRegistry = Object.freeze([
  Object.freeze({
    id: "dependency-entity-task",
    name: "Task",
    category: "Execution",
    description: "Canonical dependency entity descriptor for task intelligence relationships.",
    metadata: dependencyMetadata,
  } as const satisfies DependencyEntityDescriptor),
  Object.freeze({
    id: "dependency-entity-workflow",
    name: "Workflow",
    category: "Coordination",
    description: "Canonical dependency entity descriptor for workflow intelligence relationships.",
    metadata: dependencyMetadata,
  } as const satisfies DependencyEntityDescriptor),
  Object.freeze({
    id: "dependency-entity-project",
    name: "Project",
    category: "Planning",
    description: "Canonical dependency entity descriptor for project execution relationships.",
    metadata: dependencyMetadata,
  } as const satisfies DependencyEntityDescriptor),
  Object.freeze({
    id: "dependency-entity-resource",
    name: "Resource",
    category: "Support",
    description: "Canonical dependency entity descriptor for resource intelligence relationships.",
    metadata: dependencyMetadata,
  } as const satisfies DependencyEntityDescriptor),
  Object.freeze({
    id: "dependency-entity-schedule",
    name: "Schedule",
    category: "Planning",
    description: "Canonical dependency entity descriptor for scheduling intelligence relationships.",
    metadata: dependencyMetadata,
  } as const satisfies DependencyEntityDescriptor),
] as const);
