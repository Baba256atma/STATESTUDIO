import {
  ExecutiveDependencyIntelligenceFoundation,
} from "./dependencyIntelligenceIndex.ts";
import type {
  DependencyNodeCollection,
  DependencyNodeDescriptor,
} from "./dependencyModelTypes.ts";

const dependencyMetadata = Object.freeze({
  platformId: ExecutiveDependencyIntelligenceFoundation.registry.platformId,
  platformVersion: ExecutiveDependencyIntelligenceFoundation.registry.version,
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  tags: Object.freeze(["ops", "dependency-model", "node-descriptor"]),
} as const);

export const DependencyNodeModel = Object.freeze([
  Object.freeze({
    id: "dependency-node-task",
    entityType: "Task",
    category: "Execution",
    label: "Task Dependency Node",
    description: "Canonical metadata descriptor for task dependency nodes.",
    lifecycle: "active",
    metadata: dependencyMetadata,
  } as const satisfies DependencyNodeDescriptor),
  Object.freeze({
    id: "dependency-node-workflow",
    entityType: "Workflow",
    category: "Coordination",
    label: "Workflow Dependency Node",
    description: "Canonical metadata descriptor for workflow dependency nodes.",
    lifecycle: "active",
    metadata: dependencyMetadata,
  } as const satisfies DependencyNodeDescriptor),
  Object.freeze({
    id: "dependency-node-project",
    entityType: "Project",
    category: "Planning",
    label: "Project Dependency Node",
    description: "Canonical metadata descriptor for project dependency nodes.",
    lifecycle: "active",
    metadata: dependencyMetadata,
  } as const satisfies DependencyNodeDescriptor),
  Object.freeze({
    id: "dependency-node-resource",
    entityType: "Resource",
    category: "Support",
    label: "Resource Dependency Node",
    description: "Canonical metadata descriptor for resource dependency nodes.",
    lifecycle: "active",
    metadata: dependencyMetadata,
  } as const satisfies DependencyNodeDescriptor),
  Object.freeze({
    id: "dependency-node-schedule",
    entityType: "Schedule",
    category: "Planning",
    label: "Schedule Dependency Node",
    description: "Canonical metadata descriptor for scheduling dependency nodes.",
    lifecycle: "active",
    metadata: dependencyMetadata,
  } as const satisfies DependencyNodeDescriptor),
] as const satisfies DependencyNodeCollection);
