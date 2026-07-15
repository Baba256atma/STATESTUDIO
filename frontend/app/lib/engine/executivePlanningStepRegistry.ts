import { ExecutivePlanningLifecycle } from "./executivePlanningIndex.ts";
import type {
  ExecutivePlanningRegistryLifecycleStage,
  ExecutivePlanningStepTypeEntry,
} from "./executivePlanningRegistryTypes.ts";

const lifecycleStages = Object.freeze(
  ExecutivePlanningLifecycle.map(({ name }) => name) as ExecutivePlanningRegistryLifecycleStage[],
);

const stepType = (
  key: string,
  name: ExecutivePlanningStepTypeEntry["name"],
  description: string,
  consumesMetadata: readonly string[],
  producesMetadata: readonly string[],
  mayDependOnPreviousSteps: boolean,
  mayParticipateInParallelPlanning: boolean,
  retryMetadataAllowed: boolean,
) => Object.freeze({
  id: `eng-5-step-type-${key}`,
  name,
  description,
  category: "StepType",
  objectType: "Step",
  status: "Active",
  owner: "ENG-5",
  consumesMetadata: Object.freeze([...consumesMetadata]),
  producesMetadata: Object.freeze([...producesMetadata]),
  mayDependOnPreviousSteps,
  mayParticipateInParallelPlanning,
  retryMetadataAllowed,
  ownershipBoundary: "PlanningMetadataOnly",
  lifecycleStages,
  public: true,
  metadataOnly: true,
  runtimeFree: true,
} as const satisfies ExecutivePlanningStepTypeEntry);

export const ExecutivePlanningStepRegistry = Object.freeze([
  stepType(
    "input-acquisition",
    "Input Acquisition Step",
    "Represents acquisition of approved planning inputs as metadata references only.",
    Object.freeze(["request-intent-public-surface", "context-assembly-public-surface"]),
    Object.freeze(["acquired-input-metadata"]),
    false,
    true,
    false,
  ),
  stepType(
    "context-preparation",
    "Context Preparation Step",
    "Represents preparation of context-assembly references for planning metadata.",
    Object.freeze(["acquired-input-metadata", "executive-context-public-surface"]),
    Object.freeze(["prepared-context-metadata"]),
    true,
    true,
    true,
  ),
  stepType(
    "analysis",
    "Analysis Step",
    "Represents analysis planning metadata without performing analysis runtime.",
    Object.freeze(["prepared-context-metadata"]),
    Object.freeze(["analysis-step-metadata"]),
    true,
    true,
    true,
  ),
  stepType(
    "comparison",
    "Comparison Step",
    "Represents comparison planning metadata without computing comparisons.",
    Object.freeze(["analysis-step-metadata"]),
    Object.freeze(["comparison-step-metadata"]),
    true,
    true,
    true,
  ),
  stepType(
    "validation",
    "Validation Step",
    "Represents validation planning metadata without executing validation engines.",
    Object.freeze(["comparison-step-metadata", "analysis-step-metadata"]),
    Object.freeze(["validation-step-metadata"]),
    true,
    false,
    true,
  ),
  stepType(
    "decision-evaluation",
    "Decision Evaluation Step",
    "Represents decision-evaluation planning metadata without making decisions.",
    Object.freeze(["validation-step-metadata"]),
    Object.freeze(["decision-evaluation-metadata"]),
    true,
    false,
    true,
  ),
  stepType(
    "recommendation-preparation",
    "Recommendation Preparation Step",
    "Represents recommendation preparation metadata without Advisor generation.",
    Object.freeze(["decision-evaluation-metadata"]),
    Object.freeze(["recommendation-preparation-metadata"]),
    true,
    true,
    true,
  ),
  stepType(
    "execution-preparation",
    "Execution Preparation Step",
    "Represents execution-preparation metadata for OPS without invoking OPS runtime.",
    Object.freeze(["recommendation-preparation-metadata", "decision-evaluation-metadata"]),
    Object.freeze(["execution-preparation-metadata"]),
    true,
    false,
    true,
  ),
  stepType(
    "monitoring-preparation",
    "Monitoring Preparation Step",
    "Represents monitoring-preparation metadata without monitoring execution.",
    Object.freeze(["execution-preparation-metadata"]),
    Object.freeze(["monitoring-preparation-metadata"]),
    true,
    true,
    true,
  ),
  stepType(
    "output-assembly",
    "Output Assembly Step",
    "Represents assembly of planning output metadata without persistence or UI delivery.",
    Object.freeze(["monitoring-preparation-metadata", "execution-preparation-metadata"]),
    Object.freeze(["assembled-planning-output-metadata"]),
    true,
    false,
    false,
  ),
] as const);

const stepIndex = Object.freeze(
  Object.fromEntries(ExecutivePlanningStepRegistry.map((entry) => [entry.id, entry])) as Readonly<
    Record<string, ExecutivePlanningStepTypeEntry | undefined>
  >,
);

export const getExecutivePlanningStepRegistry = () => ExecutivePlanningStepRegistry;
export const getExecutivePlanningStepById = (
  id: string,
): ExecutivePlanningStepTypeEntry | undefined => stepIndex[id];
