import { ExecutivePlanningLifecycle } from "./executivePlanningIndex.ts";
import { ExecutivePlanTypeRegistry } from "./executivePlanningRegistryIndex.ts";
import type {
  ExecutivePlanModelDescriptor,
  ExecutivePlanningModelLifecycleStage,
} from "./executivePlanningModelTypes.ts";

const lifecycleStages = Object.freeze(
  ExecutivePlanningLifecycle.map(({ name }) => name) as ExecutivePlanningModelLifecycleStage[],
);

const planRegistryIds = Object.freeze(ExecutivePlanTypeRegistry.map(({ id }) => id));

const planModel = (
  key: string,
  name: string,
  description: string,
  purpose: string,
  compatibleRegistries: readonly string[],
) => Object.freeze({
  id: `eng-5-model-plan-${key}`,
  name,
  description,
  category: "Plan",
  owner: "ENG-5",
  version: "1.0.0",
  status: "Active",
  purpose,
  compatibleRegistries: Object.freeze([...compatibleRegistries]),
  supportedLifecycleStages: lifecycleStages,
  metadataOnly: true,
  runtimeFree: true,
  public: true,
} as const satisfies ExecutivePlanModelDescriptor);

export const ExecutivePlanModels = Object.freeze([
  planModel(
    "executive-plan",
    "ExecutivePlan",
    "Canonical model describing an executive plan as planning metadata only.",
    "Represent plan identity and structure without creating or executing plan instances.",
    Object.freeze(["ExecutivePlanTypeRegistry", ...planRegistryIds]),
  ),
  planModel(
    "planning-route",
    "PlanningRoute",
    "Canonical model describing a planned route through planning steps as metadata.",
    "Represent route composition without pathfinding or scheduling.",
    Object.freeze(["ExecutivePlanTypeRegistry", "ExecutivePlanningStepRegistry"]),
  ),
  planModel(
    "planning-checkpoint",
    "PlanningCheckpoint",
    "Canonical model describing planning checkpoints as validation or decision markers.",
    "Represent checkpoint metadata without performing validation or decisions.",
    Object.freeze(["ExecutivePlanningStepRegistry", "ExecutivePlanningGraphNodeRegistry"]),
  ),
  planModel(
    "planning-goal",
    "PlanningGoal",
    "Canonical model describing planning goals derived from resolved executive intent metadata.",
    "Represent goal metadata without goal inference or execution.",
    Object.freeze(["ExecutivePlanTypeRegistry"]),
  ),
  planModel(
    "planning-scope",
    "PlanningScope",
    "Canonical model describing planning scope boundaries as metadata.",
    "Represent included and excluded planning scope without runtime filtering.",
    Object.freeze(["ExecutivePlanTypeRegistry"]),
  ),
  planModel(
    "planning-context",
    "PlanningContext",
    "Canonical model describing context-assembly references consumed by planning metadata.",
    "Represent context participation without assembling or mutating context.",
    Object.freeze(["ExecutivePlanTypeRegistry", "ExecutivePlanningDependencyRegistry"]),
  ),
  planModel(
    "planning-timeline",
    "PlanningTimeline",
    "Canonical model describing temporal planning vocabulary without scheduling runtime.",
    "Represent timeline metadata without timers, calendars, or OPS scheduling.",
    Object.freeze(["ExecutivePlanTypeRegistry", "ExecutivePlanningPriorityRegistry"]),
  ),
  planModel(
    "planning-summary",
    "PlanningSummary",
    "Canonical model describing a planning summary envelope for later publication phases.",
    "Represent summary metadata without generating narratives or Advisor responses.",
    Object.freeze(["ExecutivePlanTypeRegistry"]),
  ),
] as const);

const planIndex = Object.freeze(
  Object.fromEntries(ExecutivePlanModels.map((model) => [model.id, model])) as Readonly<
    Record<string, ExecutivePlanModelDescriptor | undefined>
  >,
);

export const getExecutivePlanModels = () => ExecutivePlanModels;
export const getExecutivePlanModel = (id: string): ExecutivePlanModelDescriptor | undefined => planIndex[id];
