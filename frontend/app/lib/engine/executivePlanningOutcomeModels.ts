import { ExecutivePlanningLifecycle } from "./executivePlanningIndex.ts";
import type {
  ExecutivePlanningModelLifecycleStage,
  ExecutivePlanningOutcomeModelDescriptor,
} from "./executivePlanningModelTypes.ts";

const lifecycleStages = Object.freeze(
  ExecutivePlanningLifecycle.map(({ name }) => name) as ExecutivePlanningModelLifecycleStage[],
);

const outcomeModel = (
  key: string,
  name: string,
  description: string,
  outcomeRole: string,
) => Object.freeze({
  id: `eng-5-model-outcome-${key}`,
  name,
  description,
  category: "Outcome",
  owner: "ENG-5",
  version: "1.0.0",
  status: "Active",
  outcomeRole,
  supportedLifecycleStages: lifecycleStages,
  metadataOnly: true,
  runtimeFree: true,
  public: true,
} as const satisfies ExecutivePlanningOutcomeModelDescriptor);

export const ExecutivePlanningOutcomeModels = Object.freeze([
  outcomeModel(
    "planning-outcome",
    "PlanningOutcome",
    "Canonical model describing a planning outcome envelope without calculating results.",
    "Declare planned outcome metadata for later validation and freeze phases.",
  ),
  outcomeModel(
    "planning-estimate",
    "PlanningEstimate",
    "Canonical model describing estimate metadata vocabulary without performing estimation.",
    "Represent estimate fields as descriptive planning metadata only.",
  ),
  outcomeModel(
    "planning-confidence",
    "PlanningConfidence",
    "Canonical model describing confidence vocabulary without inference or scoring.",
    "Represent confidence labels as metadata for planned outcomes.",
  ),
  outcomeModel(
    "planning-recommendation",
    "PlanningRecommendation",
    "Canonical model describing recommendation metadata without Advisor response generation.",
    "Represent recommendation structure as planning output metadata only.",
  ),
  outcomeModel(
    "planning-risk",
    "PlanningRisk",
    "Canonical model describing risk metadata vocabulary without risk engines.",
    "Represent planned risk descriptors without mitigation execution.",
  ),
  outcomeModel(
    "planning-validation-summary",
    "PlanningValidationSummary",
    "Canonical model describing validation-summary metadata without executing validators.",
    "Represent validation summary fields for later ENG-5:4 consumption.",
  ),
  outcomeModel(
    "planning-metadata-bundle",
    "PlanningMetadataBundle",
    "Canonical model describing a bundled planning metadata package for publication.",
    "Aggregate descriptive planning metadata without persistence or transport.",
  ),
  outcomeModel(
    "planning-execution-descriptor",
    "PlanningExecutionDescriptor",
    "Canonical model describing execution descriptors for OPS handoff metadata only.",
    "Describe planned execution shape without invoking OPS runtime.",
  ),
] as const);

const outcomeIndex = Object.freeze(
  Object.fromEntries(ExecutivePlanningOutcomeModels.map((model) => [model.id, model])) as Readonly<
    Record<string, ExecutivePlanningOutcomeModelDescriptor | undefined>
  >,
);

export const getExecutivePlanningOutcomeModels = () => ExecutivePlanningOutcomeModels;
export const getExecutivePlanningOutcomeModel = (
  id: string,
): ExecutivePlanningOutcomeModelDescriptor | undefined => outcomeIndex[id];
