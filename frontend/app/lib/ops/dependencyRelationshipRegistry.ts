import {
  DependencyIntelligenceRegistry,
} from "./dependencyIntelligenceIndex.ts";
import type {
  DependencyRelationshipDescriptor,
} from "./dependencyRegistryTypes.ts";

const dependencyMetadata = Object.freeze({
  platformId: DependencyIntelligenceRegistry.platformId,
  platformVersion: DependencyIntelligenceRegistry.version,
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  tags: Object.freeze(["ops", "dependency-registry", "relationship-catalog"]),
} as const);

export const DependencyRelationshipRegistry = Object.freeze([
  Object.freeze({
    id: "dependency-relationship-blocks",
    type: "blocks",
    category: "Execution",
    description: "Describes a blocking relationship where progress is constrained by another entity.",
    direction: "Outbound",
    metadata: dependencyMetadata,
  } as const satisfies DependencyRelationshipDescriptor),
  Object.freeze({
    id: "dependency-relationship-requires",
    type: "requires",
    category: "Execution",
    description: "Describes a requirement relationship that must exist before coordinated work proceeds.",
    direction: "Outbound",
    metadata: dependencyMetadata,
  } as const satisfies DependencyRelationshipDescriptor),
  Object.freeze({
    id: "dependency-relationship-enables",
    type: "enables",
    category: "Execution",
    description: "Describes an enabling relationship that unlocks downstream executive work.",
    direction: "Outbound",
    metadata: dependencyMetadata,
  } as const satisfies DependencyRelationshipDescriptor),
  Object.freeze({
    id: "dependency-relationship-depends-on",
    type: "dependsOn",
    category: "Execution",
    description: "Describes a direct dependency requirement between executive entities.",
    direction: "Outbound",
    metadata: dependencyMetadata,
  } as const satisfies DependencyRelationshipDescriptor),
  Object.freeze({
    id: "dependency-relationship-precedes",
    type: "precedes",
    category: "Temporal",
    description: "Describes a temporal ordering relationship where one entity comes before another.",
    direction: "Outbound",
    metadata: dependencyMetadata,
  } as const satisfies DependencyRelationshipDescriptor),
  Object.freeze({
    id: "dependency-relationship-follows",
    type: "follows",
    category: "Temporal",
    description: "Describes a temporal ordering relationship where one entity follows another.",
    direction: "Inbound",
    metadata: dependencyMetadata,
  } as const satisfies DependencyRelationshipDescriptor),
  Object.freeze({
    id: "dependency-relationship-consumes",
    type: "consumes",
    category: "Resource",
    description: "Describes a resource consumption relationship between executive entities.",
    direction: "Outbound",
    metadata: dependencyMetadata,
  } as const satisfies DependencyRelationshipDescriptor),
  Object.freeze({
    id: "dependency-relationship-produces",
    type: "produces",
    category: "Resource",
    description: "Describes an output-producing relationship relevant to executive dependencies.",
    direction: "Outbound",
    metadata: dependencyMetadata,
  } as const satisfies DependencyRelationshipDescriptor),
  Object.freeze({
    id: "dependency-relationship-references",
    type: "references",
    category: "Informational",
    description: "Describes an informational reference relationship between executive entities.",
    direction: "Bidirectional",
    metadata: dependencyMetadata,
  } as const satisfies DependencyRelationshipDescriptor),
] as const);
