import {
  ExecutiveOrchestrationCoordinationRegistry,
  ExecutiveOrchestrationRegistryPlatform,
} from "./executiveOrchestrationRegistryPlatform.ts";
import type {
  ExecutiveOrchestrationModelDescriptor,
} from "./executiveOrchestrationModelTypes.ts";

const NAMESPACE = "nexora.engine.executive.orchestration.model" as const;

/**
 * Canonical Coordination Route structural model.
 * Metadata only — does not route runtime traffic.
 */
export const ExecutiveCoordinationRouteModel = Object.freeze({
  id: "eng-8-model-coordination-route",
  kind: "CoordinationRoute",
  name: "Coordination Route",
  description:
    "Structural model describing orchestration coordination routes without performing routing.",
  namespace: NAMESPACE,
  owner: "ENG-8",
  sourcePhase: "ENG-8:3",
  version: "1.0.0",
  status: "Defined",
  fields: Object.freeze([
    "source",
    "destination",
    "routingDirection",
    "coordinationType",
    "dependencyType",
  ] as const),
  shape: Object.freeze({
    source: "CoordinationTargetId",
    destination: "CoordinationTargetId",
    routingDirection: "Forward | Handoff | External",
    coordinationType: "EngineStage | BusinessPlatform | OperationsPlatform | ResponseSurface",
    dependencyType: "RequiredPublicDependency | OptionalPublicDependency",
  } as const),
  routeTemplates: Object.freeze(
    ExecutiveOrchestrationRegistryPlatform.routingRelationships.map((route) => Object.freeze({
      source: route.sourceTargetId,
      destination: route.destinationTargetId,
      routingDirection: route.direction,
      coordinationType: "Declared",
      dependencyType: "RequiredPublicDependency",
      registryRouteId: route.id,
      metadataOnly: true,
      immutable: true,
      executesRouting: false,
    } as const)),
  ),
  registryDependencies: Object.freeze([
    ExecutiveOrchestrationCoordinationRegistry[0].id,
    ExecutiveOrchestrationCoordinationRegistry[5].id,
    ExecutiveOrchestrationRegistryPlatform.routingRelationships[0].id,
  ] as const),
  modelDependencies: Object.freeze([
    "eng-8-model-execution-stage",
    "eng-8-model-dependency-chain",
  ] as const),
  forwardPipeline: Object.freeze([
    "Executive Request",
    "Intent Resolution",
    "Context Assembly",
    "Planning",
    "Reasoning",
    "Decision",
    "BUS / OPS coordination where required",
    "Advisor handoff",
  ] as const),
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  executesOrchestration: false,
} as const satisfies ExecutiveOrchestrationModelDescriptor & {
  readonly shape: Readonly<Record<string, string>>;
  readonly routeTemplates: readonly object[];
  readonly forwardPipeline: readonly string[];
});
