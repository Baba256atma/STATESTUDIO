import {
  ExecutiveOrchestrationFoundation,
} from "./executiveOrchestrationFoundation.ts";
import {
  ExecutiveOrchestrationCapabilityRegistry,
  ExecutiveOrchestrationLifecycleRegistry,
  ExecutiveOrchestrationRegistryPlatform,
} from "./executiveOrchestrationRegistryPlatform.ts";
import type {
  ExecutiveOrchestrationModelDescriptor,
} from "./executiveOrchestrationModelTypes.ts";

const NAMESPACE = "nexora.engine.executive.orchestration.model" as const;

/**
 * Canonical Executive Orchestration Plan structural model.
 * Metadata only — does not plan or execute pipelines.
 */
export const ExecutiveOrchestrationPlanModel = Object.freeze({
  id: "eng-8-model-plan",
  kind: "Plan",
  name: "Executive Orchestration Plan",
  description:
    "Structural model describing orchestration plan composition without constructing or executing plans.",
  namespace: NAMESPACE,
  owner: "ENG-8",
  sourcePhase: "ENG-8:3",
  version: "1.0.0",
  status: "Defined",
  fields: Object.freeze([
    "planId",
    "stages",
    "dependencyChain",
    "executionGroups",
    "completionStrategy",
    "routingStrategy",
  ] as const),
  shape: Object.freeze({
    planId: "string",
    stages: "readonly ExecutionStage[]",
    dependencyChain: "DependencyChain",
    executionGroups: "readonly ExecutionGroup[]",
    completionStrategy: "CompletionState",
    routingStrategy: "CoordinationRoute | FailureRoute",
  } as const),
  completionState: Object.freeze({
    id: "eng-8-model-completion-state",
    name: "Completion State",
    description: "Declares completion-state metadata without synchronizing completion.",
    fields: Object.freeze([
      "completionId",
      "requiredStages",
      "aggregationReference",
      "handoffRequired",
      "status",
    ] as const),
    metadataOnly: true,
    immutable: true,
    runtimeFree: true,
  } as const),
  failureRoute: Object.freeze({
    id: "eng-8-model-failure-route",
    name: "Failure Route",
    description: "Declares failure-route metadata without propagating failures.",
    fields: Object.freeze([
      "failureRouteId",
      "sourceStage",
      "destination",
      "propagationPolicy",
      "status",
    ] as const),
    metadataOnly: true,
    immutable: true,
    runtimeFree: true,
  } as const),
  resultAggregation: Object.freeze({
    id: "eng-8-model-result-aggregation",
    name: "Result Aggregation",
    description: "Declares result-aggregation metadata without aggregating runtime results.",
    fields: Object.freeze([
      "aggregationId",
      "memberGroupIds",
      "aggregationPolicy",
      "completionReference",
      "status",
    ] as const),
    metadataOnly: true,
    immutable: true,
    runtimeFree: true,
  } as const),
  registryDependencies: Object.freeze([
    ExecutiveOrchestrationRegistryPlatform.registryMetadata.id,
    ExecutiveOrchestrationLifecycleRegistry[2].id,
    ExecutiveOrchestrationCapabilityRegistry[7].id,
  ] as const),
  modelDependencies: Object.freeze([
    "eng-8-model-execution-stage",
    "eng-8-model-dependency-chain",
    "eng-8-model-execution-group",
    "eng-8-model-coordination-route",
    "eng-8-model-advisor-handoff",
  ] as const),
  foundationAlignment: Object.freeze({
    foundationId: ExecutiveOrchestrationFoundation.id,
    lifecycleOrdering: ExecutiveOrchestrationLifecycleRegistry.map(({ stageId }) => stageId),
  } as const),
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  executesOrchestration: false,
} as const satisfies ExecutiveOrchestrationModelDescriptor & {
  readonly shape: Readonly<Record<string, string>>;
  readonly completionState: object;
  readonly failureRoute: object;
  readonly resultAggregation: object;
  readonly foundationAlignment: object;
});
