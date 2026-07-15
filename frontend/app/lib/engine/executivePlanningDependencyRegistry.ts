import { ExecutivePlanningLifecycle } from "./executivePlanningIndex.ts";
import type {
  ExecutivePlanningDependencyDirection,
  ExecutivePlanningDependencyTypeEntry,
  ExecutivePlanningRegistryLifecycleStage,
} from "./executivePlanningRegistryTypes.ts";

const lifecycleStages = Object.freeze(
  ExecutivePlanningLifecycle.map(({ name }) => name) as ExecutivePlanningRegistryLifecycleStage[],
);

const dependencyType = (
  key: string,
  name: ExecutivePlanningDependencyTypeEntry["name"],
  description: string,
  sourceRelationshipMeaning: string,
  targetRelationshipMeaning: string,
  direction: ExecutivePlanningDependencyDirection,
  criticalitySupport: boolean,
  optionalitySupport: boolean,
) => Object.freeze({
  id: `eng-5-dep-type-${key}`,
  name,
  description,
  category: "DependencyType",
  objectType: "Dependency",
  status: "Active",
  owner: "ENG-5",
  sourceRelationshipMeaning,
  targetRelationshipMeaning,
  direction,
  criticalitySupport,
  optionalitySupport,
  ownershipBoundary: "PlanningMetadataOnly",
  lifecycleStages,
  public: true,
  metadataOnly: true,
  runtimeFree: true,
} as const satisfies ExecutivePlanningDependencyTypeEntry);

export const ExecutivePlanningDependencyRegistry = Object.freeze([
  dependencyType(
    "data",
    "Data Dependency",
    "Dependency metadata describing required data availability between planning artifacts.",
    "Provides required data metadata",
    "Consumes required data metadata",
    "Forward",
    true,
    false,
  ),
  dependencyType(
    "context",
    "Context Dependency",
    "Dependency metadata describing required executive-context references.",
    "Provides context participation metadata",
    "Consumes context participation metadata",
    "Forward",
    true,
    false,
  ),
  dependencyType(
    "sequential",
    "Sequential Dependency",
    "Dependency metadata describing ordered succession between planning steps.",
    "Precedes the dependent step",
    "Follows the source step",
    "Forward",
    true,
    false,
  ),
  dependencyType(
    "conditional",
    "Conditional Dependency",
    "Dependency metadata describing conditional eligibility between planning artifacts.",
    "Defines conditional prerequisite metadata",
    "Applies conditional eligibility metadata",
    "Forward",
    false,
    true,
  ),
  dependencyType(
    "validation",
    "Validation Dependency",
    "Dependency metadata describing validation prerequisites for later planning steps.",
    "Provides validation result metadata",
    "Requires validation result metadata",
    "Forward",
    true,
    false,
  ),
  dependencyType(
    "decision",
    "Decision Dependency",
    "Dependency metadata describing decision-evaluation prerequisites.",
    "Provides decision evaluation metadata",
    "Requires decision evaluation metadata",
    "Forward",
    true,
    false,
  ),
  dependencyType(
    "resource",
    "Resource Dependency",
    "Dependency metadata describing planned resource constraints without allocating resources.",
    "Declares resource constraint metadata",
    "Consumes resource constraint metadata",
    "Forward",
    true,
    true,
  ),
  dependencyType(
    "temporal",
    "Temporal Dependency",
    "Dependency metadata describing temporal ordering vocabulary without scheduling runtime.",
    "Defines temporal precedence metadata",
    "Applies temporal precedence metadata",
    "Forward",
    false,
    true,
  ),
  dependencyType(
    "output",
    "Output Dependency",
    "Dependency metadata describing required planning outputs as inputs to later steps.",
    "Produces required output metadata",
    "Consumes required output metadata",
    "Bidirectional",
    true,
    false,
  ),
] as const);

const dependencyIndex = Object.freeze(
  Object.fromEntries(ExecutivePlanningDependencyRegistry.map((entry) => [entry.id, entry])) as Readonly<
    Record<string, ExecutivePlanningDependencyTypeEntry | undefined>
  >,
);

export const getExecutivePlanningDependencyRegistry = () => ExecutivePlanningDependencyRegistry;
export const getExecutivePlanningDependencyById = (
  id: string,
): ExecutivePlanningDependencyTypeEntry | undefined => dependencyIndex[id];
