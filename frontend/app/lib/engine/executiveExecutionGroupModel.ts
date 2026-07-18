import {
  ExecutiveOrchestrationCapabilityRegistry,
  ExecutiveOrchestrationComponentRegistry,
} from "./executiveOrchestrationRegistryPlatform.ts";
import type {
  ExecutiveOrchestrationModelDescriptor,
  ExecutiveOrchestrationModelExecutionMode,
} from "./executiveOrchestrationModelTypes.ts";

const NAMESPACE = "nexora.engine.executive.orchestration.model" as const;

const group = (
  groupId: string,
  executionMode: ExecutiveOrchestrationModelExecutionMode,
  members: readonly string[],
  synchronizationPolicy: string,
  aggregationPolicy: string,
) => Object.freeze({
  groupId,
  executionMode,
  members: Object.freeze([...members]),
  synchronizationPolicy,
  aggregationPolicy,
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  executesGroup: false,
} as const);

/**
 * Canonical Execution Group structural model.
 * Includes sequential, parallel, and related mode declarations. Metadata only.
 */
export const ExecutiveExecutionGroupModel = Object.freeze({
  id: "eng-8-model-execution-group",
  kind: "ExecutionGroup",
  name: "Execution Group",
  description:
    "Structural model describing orchestration execution groups without executing grouped work.",
  namespace: NAMESPACE,
  owner: "ENG-8",
  sourcePhase: "ENG-8:3",
  version: "1.0.0",
  status: "Defined",
  fields: Object.freeze([
    "groupId",
    "executionMode",
    "members",
    "synchronizationPolicy",
    "aggregationPolicy",
  ] as const),
  shape: Object.freeze({
    groupId: "string",
    executionMode: "Sequential | Parallel | Conditional | Synchronized | Aggregated | Handoff",
    members: "readonly ComponentId[] | StageId[]",
    synchronizationPolicy: "None | Barrier | DeclarationOnly",
    aggregationPolicy: "None | CollectMetadata | DeclarationOnly",
  } as const),
  supportedExecutionModes: Object.freeze([
    "Sequential",
    "Parallel",
    "Conditional",
    "Synchronized",
    "Aggregated",
    "Handoff",
  ] as const satisfies readonly ExecutiveOrchestrationModelExecutionMode[]),
  groups: Object.freeze([
    group(
      "eng-8-group-sequential-pipeline",
      "Sequential",
      Object.freeze([
        "pipeline-orchestrator",
        "execution-sequence-coordinator",
        "context-propagation-coordinator",
      ] as const),
      "DeclarationOnly",
      "None",
    ),
    group(
      "eng-8-group-parallel-platforms",
      "Parallel",
      Object.freeze([
        "parallel-coordination-descriptor",
        "bus-coordination-gateway",
        "ops-coordination-gateway",
      ] as const),
      "Barrier",
      "CollectMetadata",
    ),
    group(
      "eng-8-group-conditional-dependencies",
      "Conditional",
      Object.freeze(["dependency-coordinator"] as const),
      "None",
      "None",
    ),
    group(
      "eng-8-group-synchronized-completion",
      "Synchronized",
      Object.freeze(["completion-coordinator", "engine-coordinator"] as const),
      "Barrier",
      "CollectMetadata",
    ),
    group(
      "eng-8-group-aggregated-results",
      "Aggregated",
      Object.freeze(["result-aggregator"] as const),
      "DeclarationOnly",
      "CollectMetadata",
    ),
    group(
      "eng-8-group-advisor-handoff",
      "Handoff",
      Object.freeze(["advisor-handoff-coordinator"] as const),
      "None",
      "None",
    ),
  ] as const),
  sequentialExecutionGroup: Object.freeze({
    id: "eng-8-group-sequential-pipeline",
    mode: "Sequential",
    metadataOnly: true,
    immutable: true,
  } as const),
  parallelExecutionGroup: Object.freeze({
    id: "eng-8-group-parallel-platforms",
    mode: "Parallel",
    metadataOnly: true,
    immutable: true,
  } as const),
  registryDependencies: Object.freeze([
    ExecutiveOrchestrationComponentRegistry[0].id,
    ExecutiveOrchestrationCapabilityRegistry[0].id,
    ExecutiveOrchestrationCapabilityRegistry[1].id,
  ] as const),
  modelDependencies: Object.freeze([
    "eng-8-model-execution-stage",
    "eng-8-model-plan",
    "eng-8-model-advisor-handoff",
  ] as const),
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  executesOrchestration: false,
} as const satisfies ExecutiveOrchestrationModelDescriptor & {
  readonly shape: Readonly<Record<string, string>>;
  readonly supportedExecutionModes: readonly ExecutiveOrchestrationModelExecutionMode[];
  readonly groups: readonly object[];
  readonly sequentialExecutionGroup: object;
  readonly parallelExecutionGroup: object;
});
