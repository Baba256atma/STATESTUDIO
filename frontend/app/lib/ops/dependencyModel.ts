import { DependencyEdgeModel } from "./dependencyEdgeModel.ts";
import { DependencyGraphModel } from "./dependencyGraphModel.ts";
import { DependencyImpactModel } from "./dependencyImpactModel.ts";
import {
  DependencyModelMetadata,
  ExecutiveDependencyModelSummary,
} from "./dependencyModelMetadata.ts";
import { DependencyNodeModel } from "./dependencyNodeModel.ts";

export const ExecutiveDependencyModel = Object.freeze({
  nodes: DependencyNodeModel,
  edges: DependencyEdgeModel,
  graph: DependencyGraphModel,
  impact: DependencyImpactModel,
  metadata: DependencyModelMetadata,
  summary: ExecutiveDependencyModelSummary,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const getExecutiveDependencyModel = () => ExecutiveDependencyModel;

export const getDependencyGraphModel = () => DependencyGraphModel;

export const getDependencyImpactModel = () => DependencyImpactModel;
