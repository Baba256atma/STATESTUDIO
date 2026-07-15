import { ExecutivePlanningLifecycle } from "./executivePlanningIndex.ts";
import type {
  ExecutivePlanningDependencyModelDescriptor,
  ExecutivePlanningModelLifecycleStage,
} from "./executivePlanningModelTypes.ts";

const lifecycleStages = Object.freeze(
  ExecutivePlanningLifecycle.map(({ name }) => name) as ExecutivePlanningModelLifecycleStage[],
);

const dependencyModel = (
  key: string,
  name: string,
  description: string,
) => Object.freeze({
  id: `eng-5-model-dependency-${key}`,
  name,
  description,
  category: "Dependency",
  owner: "ENG-5",
  version: "1.0.0",
  status: "Active",
  compatibleDependencyRegistry: "ExecutivePlanningDependencyRegistry",
  supportedLifecycleStages: lifecycleStages,
  metadataOnly: true,
  runtimeFree: true,
  public: true,
} as const satisfies ExecutivePlanningDependencyModelDescriptor);

export const ExecutivePlanningDependencyModels = Object.freeze([
  dependencyModel(
    "planning-dependency",
    "PlanningDependency",
    "Canonical model describing a planning dependency as metadata without resolution.",
  ),
  dependencyModel(
    "dependency-constraint",
    "DependencyConstraint",
    "Canonical model describing dependency constraint metadata without enforcement engines.",
  ),
  dependencyModel(
    "dependency-chain",
    "DependencyChain",
    "Canonical model describing ordered dependency-chain metadata without traversal.",
  ),
  dependencyModel(
    "dependency-group",
    "DependencyGroup",
    "Canonical model describing grouped dependency metadata without graph algorithms.",
  ),
  dependencyModel(
    "dependency-reference",
    "DependencyReference",
    "Canonical model describing a reference to dependency vocabulary without resolving targets.",
  ),
  dependencyModel(
    "dependency-metadata",
    "DependencyMetadata",
    "Canonical model describing the dependency metadata envelope owned by Executive Planning.",
  ),
] as const);

const dependencyIndex = Object.freeze(
  Object.fromEntries(ExecutivePlanningDependencyModels.map((model) => [model.id, model])) as Readonly<
    Record<string, ExecutivePlanningDependencyModelDescriptor | undefined>
  >,
);

export const getExecutivePlanningDependencyModels = () => ExecutivePlanningDependencyModels;
export const getExecutivePlanningDependencyModel = (
  id: string,
): ExecutivePlanningDependencyModelDescriptor | undefined => dependencyIndex[id];
