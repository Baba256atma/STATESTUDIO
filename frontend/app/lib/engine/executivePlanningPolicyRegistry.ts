import { ExecutivePlanningLifecycle } from "./executivePlanningIndex.ts";
import type {
  ExecutivePlanningParallelModeEntry,
  ExecutivePlanningPriorityLevelEntry,
  ExecutivePlanningRegistryLifecycleStage,
  ExecutivePlanningRetryStrategyEntry,
} from "./executivePlanningRegistryTypes.ts";

const lifecycleStages = Object.freeze(
  ExecutivePlanningLifecycle.map(({ name }) => name) as ExecutivePlanningRegistryLifecycleStage[],
);

const priority = (
  key: string,
  rank: number,
  name: ExecutivePlanningPriorityLevelEntry["name"],
  description: string,
  escalationRelevance: boolean,
) => Object.freeze({
  id: `eng-5-priority-${key}`,
  name,
  description,
  category: "PriorityLevel",
  objectType: "Priority",
  status: "Active",
  owner: "ENG-5",
  rank,
  escalationRelevance,
  lifecycleStages,
  public: true,
  metadataOnly: true,
  runtimeFree: true,
} as const satisfies ExecutivePlanningPriorityLevelEntry);

const parallelMode = (
  key: string,
  name: ExecutivePlanningParallelModeEntry["name"],
  description: string,
  planningEligibility: string,
) => Object.freeze({
  id: `eng-5-parallel-${key}`,
  name,
  description,
  category: "ParallelPlanningMode",
  objectType: "ParallelMode",
  status: "Active",
  owner: "ENG-5",
  planningEligibility,
  lifecycleStages,
  public: true,
  metadataOnly: true,
  runtimeFree: true,
} as const satisfies ExecutivePlanningParallelModeEntry);

const retryStrategy = (
  key: string,
  name: ExecutivePlanningRetryStrategyEntry["name"],
  description: string,
  retryMetadataPurpose: string,
) => Object.freeze({
  id: `eng-5-retry-${key}`,
  name,
  description,
  category: "RetryPlanningStrategy",
  objectType: "RetryStrategy",
  status: "Active",
  owner: "ENG-5",
  retryMetadataPurpose,
  lifecycleStages,
  public: true,
  metadataOnly: true,
  runtimeFree: true,
} as const satisfies ExecutivePlanningRetryStrategyEntry);

export const ExecutivePlanningPriorityRegistry = Object.freeze([
  priority("critical", 1, "Critical", "Highest planning priority metadata level with escalation relevance.", true),
  priority("high", 2, "High", "Elevated planning priority metadata level.", true),
  priority("normal", 3, "Normal", "Default planning priority metadata level.", false),
  priority("low", 4, "Low", "Reduced planning priority metadata level.", false),
  priority("deferred", 5, "Deferred", "Deferred planning priority metadata level without scheduling runtime.", false),
] as const);

export const ExecutivePlanningParallelModeRegistry = Object.freeze([
  parallelMode(
    "sequential-only",
    "Sequential Only",
    "Planning eligibility metadata restricting steps to sequential representation.",
    "Sequential planning metadata only; no parallel eligibility.",
  ),
  parallelMode(
    "parallel-eligible",
    "Parallel Eligible",
    "Planning eligibility metadata allowing optional parallel representation.",
    "May be represented as parallel in planning metadata.",
  ),
  parallelMode(
    "parallel-preferred",
    "Parallel Preferred",
    "Planning eligibility metadata preferring parallel representation when permitted.",
    "Prefer parallel representation in planning metadata when allowed.",
  ),
  parallelMode(
    "parallel-required",
    "Parallel Required",
    "Planning eligibility metadata requiring parallel representation vocabulary.",
    "Requires parallel representation in planning metadata.",
  ),
  parallelMode(
    "mutually-exclusive",
    "Mutually Exclusive",
    "Planning eligibility metadata describing mutually exclusive branch vocabulary.",
    "Mutually exclusive branches in planning metadata; not concurrent execution.",
  ),
] as const);

export const ExecutivePlanningRetryStrategyRegistry = Object.freeze([
  retryStrategy(
    "no-retry",
    "No Retry",
    "Retry-planning strategy metadata declaring that retries are not planned.",
    "Declare absence of retry metadata for a planning step.",
  ),
  retryStrategy(
    "immediate-retry",
    "Immediate Retry",
    "Retry-planning strategy metadata describing immediate retry intent without timers.",
    "Attach immediate-retry intent metadata without executing retries.",
  ),
  retryStrategy(
    "deferred-retry",
    "Deferred Retry",
    "Retry-planning strategy metadata describing deferred retry intent without delays.",
    "Attach deferred-retry intent metadata without scheduling runtime.",
  ),
  retryStrategy(
    "retry-with-validation",
    "Retry with Validation",
    "Retry-planning strategy metadata requiring validation before a planned retry.",
    "Attach validation-gated retry metadata without running validation engines.",
  ),
  retryStrategy(
    "retry-with-alternate-step",
    "Retry with Alternate Step",
    "Retry-planning strategy metadata describing an alternate step path on failure.",
    "Attach alternate-step retry metadata without pathfinding or execution.",
  ),
  retryStrategy(
    "escalate-after-failure",
    "Escalate After Failure",
    "Retry-planning strategy metadata describing escalation after planned failure.",
    "Attach escalation-after-failure metadata without performing escalation.",
  ),
] as const);

const priorityIndex = Object.freeze(
  Object.fromEntries(ExecutivePlanningPriorityRegistry.map((entry) => [entry.id, entry])) as Readonly<
    Record<string, ExecutivePlanningPriorityLevelEntry | undefined>
  >,
);
const parallelIndex = Object.freeze(
  Object.fromEntries(ExecutivePlanningParallelModeRegistry.map((entry) => [entry.id, entry])) as Readonly<
    Record<string, ExecutivePlanningParallelModeEntry | undefined>
  >,
);
const retryIndex = Object.freeze(
  Object.fromEntries(ExecutivePlanningRetryStrategyRegistry.map((entry) => [entry.id, entry])) as Readonly<
    Record<string, ExecutivePlanningRetryStrategyEntry | undefined>
  >,
);

export const getExecutivePlanningPriorityById = (
  id: string,
): ExecutivePlanningPriorityLevelEntry | undefined => priorityIndex[id];
export const getExecutivePlanningParallelModeById = (
  id: string,
): ExecutivePlanningParallelModeEntry | undefined => parallelIndex[id];
export const getExecutivePlanningRetryStrategyById = (
  id: string,
): ExecutivePlanningRetryStrategyEntry | undefined => retryIndex[id];
export const getExecutivePlanningPolicyRegistries = () => Object.freeze({
  priorities: ExecutivePlanningPriorityRegistry,
  parallelModes: ExecutivePlanningParallelModeRegistry,
  retryStrategies: ExecutivePlanningRetryStrategyRegistry,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
