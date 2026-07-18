import { ExecutiveAdvisorHandoffModel } from "./executiveAdvisorHandoffModel.ts";
import { ExecutiveCoordinationRouteModel } from "./executiveCoordinationRouteModel.ts";
import { ExecutiveDependencyChainModel } from "./executiveDependencyChainModel.ts";
import { ExecutiveExecutionGroupModel } from "./executiveExecutionGroupModel.ts";
import { ExecutiveExecutionStageModel } from "./executiveExecutionStageModel.ts";
import { ExecutiveOrchestrationPlanModel } from "./executiveOrchestrationPlanModel.ts";
import { ExecutiveOrchestrationRequestModel } from "./executiveOrchestrationRequestModel.ts";
import {
  getExecutiveOrchestrationFoundation,
} from "./executiveOrchestrationFoundation.ts";
import {
  getExecutiveOrchestrationRegistryPlatform,
} from "./executiveOrchestrationRegistryPlatform.ts";
import type {
  ExecutiveOrchestrationModelDescriptor,
  ExecutiveOrchestrationModelId,
  ExecutiveOrchestrationModelMetadata,
  ExecutiveOrchestrationModelRegistryEntry,
  ExecutiveOrchestrationModelRelationship,
} from "./executiveOrchestrationModelTypes.ts";

const registryEntry = (
  model: ExecutiveOrchestrationModelDescriptor,
) => Object.freeze({
  id: model.id,
  kind: model.kind,
  name: model.name,
  description: model.description,
  status: "Registered",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const satisfies ExecutiveOrchestrationModelRegistryEntry);

const relationship = (
  key: string,
  source: ExecutiveOrchestrationModelRelationship["source"],
  destination: ExecutiveOrchestrationModelRelationship["destination"],
  description: string,
) => Object.freeze({
  id: `eng-8-model-rel-${key}`,
  source,
  destination,
  direction: "Forward",
  description,
  metadataOnly: true,
  immutable: true,
  executesRelationship: false,
} as const satisfies ExecutiveOrchestrationModelRelationship);

const modelRegistry = Object.freeze({
  id: "eng-8-model-registry",
  name: "Executive Orchestration Model Registry",
  owner: "ENG-8",
  version: "1.0.0",
  namespace: "nexora.engine.executive.orchestration.model",
  entries: Object.freeze([
    registryEntry(ExecutiveOrchestrationRequestModel),
    registryEntry(ExecutiveOrchestrationPlanModel),
    registryEntry(ExecutiveExecutionStageModel),
    registryEntry(ExecutiveCoordinationRouteModel),
    registryEntry(ExecutiveDependencyChainModel),
    registryEntry(ExecutiveExecutionGroupModel),
    registryEntry(ExecutiveAdvisorHandoffModel),
  ] as const),
  kinds: Object.freeze([
    "Request",
    "Plan",
    "ExecutionStage",
    "CoordinationRoute",
    "DependencyChain",
    "ExecutionGroup",
    "AdvisorHandoff",
  ] as const),
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const);

const relationships = Object.freeze([
  relationship("request-to-plan", "Request", "Plan", "Request feeds plan structure."),
  relationship("plan-to-stage", "Plan", "ExecutionStage", "Plan composes execution stages."),
  relationship(
    "stage-to-route",
    "ExecutionStage",
    "CoordinationRoute",
    "Stages declare coordination routes.",
  ),
  relationship(
    "route-to-group",
    "CoordinationRoute",
    "ExecutionGroup",
    "Routes associate with execution groups.",
  ),
  relationship(
    "group-to-handoff",
    "ExecutionGroup",
    "AdvisorHandoff",
    "Groups complete into Advisor handoff metadata.",
  ),
  relationship(
    "plan-to-dependency",
    "Plan",
    "DependencyChain",
    "Plan references dependency-chain metadata.",
  ),
] as const);

const metadata = Object.freeze({
  id: "ENG-8:3",
  name: "Executive Orchestration Model Platform",
  version: "1.0.0",
  namespace: "nexora.engine.executive.orchestration.model",
  status: "Stable",
  architectureMode: "MetadataOnly",
  immutability: "DeeplyFrozen",
  runtimeBehavior: "None",
  owner: "ENG-8",
  previousPhase: "ENG-8:2",
  nextPhase: "ENG-8:4",
  readiness: "ReadyForValidation",
  metadataOnly: true,
  runtimeFree: true,
  deterministic: true,
  immutable: true,
  deeplyFrozen: true,
  readyForValidation: true,
} as const satisfies ExecutiveOrchestrationModelMetadata);

const modelsById = Object.freeze({
  "eng-8-model-request": ExecutiveOrchestrationRequestModel,
  "eng-8-model-plan": ExecutiveOrchestrationPlanModel,
  "eng-8-model-execution-stage": ExecutiveExecutionStageModel,
  "eng-8-model-coordination-route": ExecutiveCoordinationRouteModel,
  "eng-8-model-dependency-chain": ExecutiveDependencyChainModel,
  "eng-8-model-execution-group": ExecutiveExecutionGroupModel,
  "eng-8-model-advisor-handoff": ExecutiveAdvisorHandoffModel,
} as const satisfies Readonly<
  Record<ExecutiveOrchestrationModelId, ExecutiveOrchestrationModelDescriptor>
>);

/**
 * Canonical ENG-8:3 Executive Orchestration Model Platform.
 * Consumes ENG-8:1 and ENG-8:2 public APIs only.
 */
export const ExecutiveOrchestrationModelPlatform = Object.freeze({
  foundation: getExecutiveOrchestrationFoundation(),
  registry: getExecutiveOrchestrationRegistryPlatform(),
  request: ExecutiveOrchestrationRequestModel,
  plan: ExecutiveOrchestrationPlanModel,
  executionStage: ExecutiveExecutionStageModel,
  coordinationRoute: ExecutiveCoordinationRouteModel,
  dependencyChain: ExecutiveDependencyChainModel,
  executionGroup: ExecutiveExecutionGroupModel,
  advisorHandoff: ExecutiveAdvisorHandoffModel,
  modelRegistry,
  relationships,
  relationshipChain: Object.freeze([
    "Request",
    "Plan",
    "ExecutionStage",
    "CoordinationRoute",
    "ExecutionGroup",
    "AdvisorHandoff",
  ] as const),
  metadata,
  status: Object.freeze({
    stable: "Stable",
    metadataOnly: "MetadataOnly",
    runtimeFree: "RuntimeFree",
    deeplyFrozen: "DeeplyFrozen",
    readyForValidation: "ReadyForValidation",
  } as const),
  consumedSurfaces: Object.freeze({
    foundation: "executiveOrchestrationFoundation.ts",
    registry: "executiveOrchestrationRegistryPlatform.ts",
  } as const),
  metadataOnly: true,
  runtimeFree: true,
  deterministic: true,
  immutable: true,
  deeplyFrozen: true,
  readyForValidation: true,
} as const);

export const getExecutiveOrchestrationModelPlatform = () =>
  ExecutiveOrchestrationModelPlatform;

export const getExecutiveOrchestrationModelById = (
  id: string,
): ExecutiveOrchestrationModelDescriptor | undefined =>
  Object.hasOwn(modelsById, id)
    ? modelsById[id as ExecutiveOrchestrationModelId]
    : undefined;

export {
  ExecutiveAdvisorHandoffModel,
  ExecutiveCoordinationRouteModel,
  ExecutiveDependencyChainModel,
  ExecutiveExecutionGroupModel,
  ExecutiveExecutionStageModel,
  ExecutiveOrchestrationPlanModel,
  ExecutiveOrchestrationRequestModel,
};
