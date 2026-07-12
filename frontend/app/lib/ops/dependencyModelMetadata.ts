import {
  ExecutiveDependencyIntelligenceFoundation,
} from "./dependencyIntelligenceIndex.ts";
import {
  ExecutiveDependencyRegistry,
} from "./dependencyRegistryIndex.ts";
import type {
  DependencyModelDescriptor,
  DependencyModelSummary as DependencyModelSummaryShape,
} from "./dependencyModelTypes.ts";
import { DependencyEdgeModel } from "./dependencyEdgeModel.ts";
import { DependencyGraphModel } from "./dependencyGraphModel.ts";
import { DependencyImpactModel } from "./dependencyImpactModel.ts";
import { DependencyNodeModel } from "./dependencyNodeModel.ts";

export const DependencyModelMetadata = Object.freeze({
  modelVersion: ExecutiveDependencyIntelligenceFoundation.registry.version,
  supportedGraphVersion: "1.0.0",
  supportedNodeVersion: "1.0.0",
  supportedEdgeVersion: "1.0.0",
  supportedImpactVersion: "1.0.0",
  compatibilityVersion: ExecutiveDependencyRegistry.metadata.compatibilityVersion,
  deterministicStatus: "Deterministic",
  readonlyStatus: "Readonly",
  metadataOnlyStatus: "MetadataOnly",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies DependencyModelDescriptor);

export const ExecutiveDependencyModelSummary = Object.freeze({
  nodeCount: DependencyNodeModel.length,
  edgeCount: DependencyEdgeModel.length,
  graphCount: DependencyGraphModel.length,
  impactCount: DependencyImpactModel.length,
  status: "PASS",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies DependencyModelSummaryShape);
