import {
  ExecutiveDependencyIntelligenceFoundation,
} from "./dependencyIntelligenceIndex.ts";
import type {
  DependencyImpactDescriptor,
  DependencyImpactSummary as DependencyImpactSummaryShape,
} from "./dependencyModelTypes.ts";

const impactMetadata = Object.freeze({
  platformId: ExecutiveDependencyIntelligenceFoundation.registry.platformId,
  platformVersion: ExecutiveDependencyIntelligenceFoundation.registry.version,
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  tags: Object.freeze(["ops", "dependency-model", "impact-descriptor"]),
} as const);

export const DependencyImpactModel = Object.freeze([
  Object.freeze({
    id: "dependency-impact-direct",
    type: "direct-impact",
    name: "Direct Impact",
    description: "Descriptive metadata for immediate dependency impact relationships.",
    relatedEntityTypes: Object.freeze(["Task", "Workflow"]),
    metadata: impactMetadata,
  } as const satisfies DependencyImpactDescriptor),
  Object.freeze({
    id: "dependency-impact-indirect",
    type: "indirect-impact",
    name: "Indirect Impact",
    description: "Descriptive metadata for indirect dependency impact relationships.",
    relatedEntityTypes: Object.freeze(["Project", "Resource"]),
    metadata: impactMetadata,
  } as const satisfies DependencyImpactDescriptor),
  Object.freeze({
    id: "dependency-impact-upstream",
    type: "upstream-impact",
    name: "Upstream Impact",
    description: "Descriptive metadata for upstream dependency impact relationships.",
    relatedEntityTypes: Object.freeze(["Project", "Workflow"]),
    metadata: impactMetadata,
  } as const satisfies DependencyImpactDescriptor),
  Object.freeze({
    id: "dependency-impact-downstream",
    type: "downstream-impact",
    name: "Downstream Impact",
    description: "Descriptive metadata for downstream dependency impact relationships.",
    relatedEntityTypes: Object.freeze(["Task", "Schedule"]),
    metadata: impactMetadata,
  } as const satisfies DependencyImpactDescriptor),
  Object.freeze({
    id: "dependency-impact-chain",
    type: "dependency-chain",
    name: "Dependency Chain",
    description: "Descriptive metadata for dependency chain structures.",
    relatedEntityTypes: Object.freeze(["Task", "Workflow", "Project"]),
    metadata: impactMetadata,
  } as const satisfies DependencyImpactDescriptor),
  Object.freeze({
    id: "dependency-impact-group",
    type: "dependency-group",
    name: "Dependency Group",
    description: "Descriptive metadata for grouped dependency structures.",
    relatedEntityTypes: Object.freeze(["Project", "Resource", "Schedule"]),
    metadata: impactMetadata,
  } as const satisfies DependencyImpactDescriptor),
  Object.freeze({
    id: "dependency-impact-scope",
    type: "dependency-scope",
    name: "Dependency Scope",
    description: "Descriptive metadata for dependency scope boundaries.",
    relatedEntityTypes: Object.freeze(["Task", "Workflow", "Project", "Resource", "Schedule"]),
    metadata: impactMetadata,
  } as const satisfies DependencyImpactDescriptor),
] as const);

export const ExecutiveDependencyImpactSummary = Object.freeze({
  impactDescriptorCount: DependencyImpactModel.length,
  supportedImpactTypes: Object.freeze(
    DependencyImpactModel.map((impact) => impact.type),
  ),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies DependencyImpactSummaryShape);
