import {
  ExecutivePlanningCapabilityRegistry,
  ExecutivePlanningLifecycle,
} from "./executivePlanningIndex.ts";
import type {
  ExecutivePlanTypeEntry,
  ExecutivePlanningRegistryLifecycleStage,
} from "./executivePlanningRegistryTypes.ts";

const lifecycleStages = Object.freeze(
  ExecutivePlanningLifecycle.map(({ name }) => name) as ExecutivePlanningRegistryLifecycleStage[],
);

const capabilityIds = Object.freeze(
  ExecutivePlanningCapabilityRegistry.map(({ id }) => id),
);

const planType = (
  key: string,
  name: ExecutivePlanTypeEntry["name"],
  description: string,
  purpose: string,
  supportedPlanningCapabilities: readonly string[],
  expectedPlanningOutputs: readonly string[],
) => Object.freeze({
  id: `eng-5-plan-type-${key}`,
  name,
  description,
  category: "PlanType",
  objectType: "Plan",
  status: "Active",
  owner: "ENG-5",
  purpose,
  supportedPlanningCapabilities: Object.freeze([...supportedPlanningCapabilities]),
  expectedPlanningOutputs: Object.freeze([...expectedPlanningOutputs]),
  lifecycleStages,
  public: true,
  metadataOnly: true,
  runtimeFree: true,
} as const satisfies ExecutivePlanTypeEntry);

export const ExecutivePlanTypeRegistry = Object.freeze([
  planType(
    "analysis",
    "Analysis Plan",
    "Official plan type for structuring analysis-oriented planning metadata.",
    "Describe analysis planning without performing analysis or execution.",
    Object.freeze([capabilityIds[0], capabilityIds[1], capabilityIds[7]]),
    Object.freeze(["analysis-plan-metadata", "analysis-step-outline"]),
  ),
  planType(
    "decision",
    "Decision Plan",
    "Official plan type for structuring decision-evaluation planning metadata.",
    "Describe decision planning without making runtime decisions.",
    Object.freeze([capabilityIds[0], capabilityIds[1], capabilityIds[5]]),
    Object.freeze(["decision-plan-metadata", "decision-evaluation-outline"]),
  ),
  planType(
    "recommendation",
    "Recommendation Plan",
    "Official plan type for structuring recommendation-oriented planning metadata.",
    "Describe recommendation planning without generating Advisor responses.",
    Object.freeze([capabilityIds[0], capabilityIds[1], capabilityIds[7]]),
    Object.freeze(["recommendation-plan-metadata", "recommendation-outline"]),
  ),
  planType(
    "scenario",
    "Scenario Plan",
    "Official plan type for structuring scenario-oriented planning metadata.",
    "Describe scenario planning without simulating or executing scenarios.",
    Object.freeze([capabilityIds[0], capabilityIds[3], capabilityIds[4]]),
    Object.freeze(["scenario-plan-metadata", "scenario-branch-outline"]),
  ),
  planType(
    "execution-preparation",
    "Execution Preparation Plan",
    "Official plan type for preparing execution-plan metadata for OPS consumption.",
    "Describe execution preparation without invoking OPS execution runtime.",
    Object.freeze([capabilityIds[0], capabilityIds[1], capabilityIds[2], capabilityIds[3]]),
    Object.freeze(["execution-preparation-metadata", "ordered-step-outline"]),
  ),
  planType(
    "monitoring",
    "Monitoring Plan",
    "Official plan type for structuring monitoring-preparation planning metadata.",
    "Describe monitoring planning without performing monitoring runtime.",
    Object.freeze([capabilityIds[0], capabilityIds[1], capabilityIds[7]]),
    Object.freeze(["monitoring-plan-metadata", "monitoring-outline"]),
  ),
  planType(
    "recovery",
    "Recovery Plan",
    "Official plan type for structuring recovery-oriented planning metadata.",
    "Describe recovery planning without executing recovery actions.",
    Object.freeze([capabilityIds[0], capabilityIds[2], capabilityIds[6]]),
    Object.freeze(["recovery-plan-metadata", "recovery-outline"]),
  ),
  planType(
    "escalation",
    "Escalation Plan",
    "Official plan type for structuring escalation-oriented planning metadata.",
    "Describe escalation planning without performing escalation execution.",
    Object.freeze([capabilityIds[0], capabilityIds[5], capabilityIds[6]]),
    Object.freeze(["escalation-plan-metadata", "escalation-outline"]),
  ),
] as const);

const planTypeIndex = Object.freeze(
  Object.fromEntries(ExecutivePlanTypeRegistry.map((entry) => [entry.id, entry])) as Readonly<
    Record<string, ExecutivePlanTypeEntry | undefined>
  >,
);

export const getExecutivePlanTypeRegistry = () => ExecutivePlanTypeRegistry;
export const getExecutivePlanTypeById = (id: string): ExecutivePlanTypeEntry | undefined => planTypeIndex[id];
