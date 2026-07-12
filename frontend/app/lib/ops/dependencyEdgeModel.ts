import {
  ExecutiveDependencyIntelligenceFoundation,
} from "./dependencyIntelligenceIndex.ts";
import type {
  DependencyEdgeCollection,
  DependencyEdgeDescriptor,
} from "./dependencyModelTypes.ts";

const dependencyMetadata = Object.freeze({
  platformId: ExecutiveDependencyIntelligenceFoundation.registry.platformId,
  platformVersion: ExecutiveDependencyIntelligenceFoundation.registry.version,
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  tags: Object.freeze(["ops", "dependency-model", "edge-descriptor"]),
} as const);

export const DependencyEdgeModel = Object.freeze([
  Object.freeze({
    id: "dependency-edge-project-requires-workflow",
    source: "dependency-node-project",
    target: "dependency-node-workflow",
    relationshipType: "requires",
    direction: "Outbound",
    strength: "Strong",
    priority: "High",
    criticality: "Essential",
    lifecycle: "active",
    metadata: dependencyMetadata,
  } as const satisfies DependencyEdgeDescriptor),
  Object.freeze({
    id: "dependency-edge-workflow-enables-task",
    source: "dependency-node-workflow",
    target: "dependency-node-task",
    relationshipType: "enables",
    direction: "Outbound",
    strength: "Moderate",
    priority: "Normal",
    criticality: "Important",
    lifecycle: "active",
    metadata: dependencyMetadata,
  } as const satisfies DependencyEdgeDescriptor),
  Object.freeze({
    id: "dependency-edge-task-consumes-resource",
    source: "dependency-node-task",
    target: "dependency-node-resource",
    relationshipType: "consumes",
    direction: "Outbound",
    strength: "Strong",
    priority: "High",
    criticality: "Important",
    lifecycle: "active",
    metadata: dependencyMetadata,
  } as const satisfies DependencyEdgeDescriptor),
  Object.freeze({
    id: "dependency-edge-schedule-precedes-task",
    source: "dependency-node-schedule",
    target: "dependency-node-task",
    relationshipType: "precedes",
    direction: "Outbound",
    strength: "Moderate",
    priority: "Normal",
    criticality: "Important",
    lifecycle: "active",
    metadata: dependencyMetadata,
  } as const satisfies DependencyEdgeDescriptor),
] as const satisfies DependencyEdgeCollection);
