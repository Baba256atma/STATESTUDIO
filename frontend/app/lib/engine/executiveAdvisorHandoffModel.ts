import {
  ExecutiveOrchestrationCoordinationRegistry,
  ExecutiveOrchestrationDependencyRegistry,
} from "./executiveOrchestrationRegistryPlatform.ts";
import type {
  ExecutiveOrchestrationModelDescriptor,
} from "./executiveOrchestrationModelTypes.ts";

const NAMESPACE = "nexora.engine.executive.orchestration.model" as const;

/**
 * Canonical Advisor Handoff structural model.
 * Metadata only — does not generate Advisor messages or perform handoff.
 */
export const ExecutiveAdvisorHandoffModel = Object.freeze({
  id: "eng-8-model-advisor-handoff",
  kind: "AdvisorHandoff",
  name: "Advisor Handoff",
  description:
    "Structural model describing Advisor handoff metadata without performing Advisor communication.",
  namespace: NAMESPACE,
  owner: "ENG-8",
  sourcePhase: "ENG-8:3",
  version: "1.0.0",
  status: "Defined",
  fields: Object.freeze([
    "source",
    "destination",
    "completionRequirements",
    "routingRequirements",
    "aggregationReference",
  ] as const),
  shape: Object.freeze({
    source: "decision | bus-platforms | ops-platforms",
    destination: "advisor",
    completionRequirements: "readonly CompletionRequirement[]",
    routingRequirements: "readonly RoutingRequirement[]",
    aggregationReference: "ResultAggregationId | null",
  } as const),
  handoffTemplate: Object.freeze({
    source: "decision",
    destination: "advisor",
    completionRequirements: Object.freeze([
      "AggregateResultsDeclared",
      "PrepareResponseDeclared",
      "CompletionCoordinatorReady",
    ] as const),
    routingRequirements: Object.freeze([
      "AdvisorPublicApiReferenceOnly",
      "NoRuntimeAdvisorInvocation",
      "HandoffModeDeclared",
    ] as const),
    aggregationReference: "eng-8-model-result-aggregation",
    status: "Declared",
    metadataOnly: true,
    immutable: true,
    executesHandoff: false,
  } as const),
  registryDependencies: Object.freeze([
    ExecutiveOrchestrationCoordinationRegistry[5].id,
    ExecutiveOrchestrationCoordinationRegistry[8].id,
    ExecutiveOrchestrationDependencyRegistry[9].id,
  ] as const),
  modelDependencies: Object.freeze([
    "eng-8-model-plan",
    "eng-8-model-coordination-route",
    "eng-8-model-execution-group",
  ] as const),
  ownershipBoundary: Object.freeze({
    owns: Object.freeze(["advisor handoff metadata contracts"] as const),
    neverOwns: Object.freeze([
      "Advisor conversational presentation",
      "Advisor message generation",
      "runtime Advisor invocation",
    ] as const),
  } as const),
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  executesOrchestration: false,
} as const satisfies ExecutiveOrchestrationModelDescriptor & {
  readonly shape: Readonly<Record<string, string>>;
  readonly handoffTemplate: object;
  readonly ownershipBoundary: object;
});
