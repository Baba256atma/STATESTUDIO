import {
  ExecutiveOrchestrationFoundation,
} from "./executiveOrchestrationFoundation.ts";
import {
  ExecutiveOrchestrationLifecycleRegistry,
  ExecutiveOrchestrationRegistryPlatform,
} from "./executiveOrchestrationRegistryPlatform.ts";
import type {
  ExecutiveOrchestrationModelDescriptor,
} from "./executiveOrchestrationModelTypes.ts";

const NAMESPACE = "nexora.engine.executive.orchestration.model" as const;

/**
 * Canonical Executive Orchestration Request structural model.
 * Metadata only — does not receive or process requests.
 */
export const ExecutiveOrchestrationRequestModel = Object.freeze({
  id: "eng-8-model-request",
  kind: "Request",
  name: "Executive Orchestration Request",
  description:
    "Structural model describing orchestration request metadata without receiving or processing requests.",
  namespace: NAMESPACE,
  owner: "ENG-8",
  sourcePhase: "ENG-8:3",
  version: "1.0.0",
  status: "Defined",
  fields: Object.freeze([
    "requestId",
    "requestSource",
    "orchestrationPurpose",
    "targetPipeline",
    "coordinationScope",
    "executionMode",
    "status",
  ] as const),
  shape: Object.freeze({
    requestId: "string",
    requestSource: "ENG-2 | Advisor | Suite",
    orchestrationPurpose: "string",
    targetPipeline: "ExecutiveBrainPipeline",
    coordinationScope: "EngineStages | EngineAndPlatforms",
    executionMode: "Sequential | Parallel | Conditional | Synchronized | Aggregated | Handoff",
    status: "Declared",
  } as const),
  registryDependencies: Object.freeze([
    ExecutiveOrchestrationRegistryPlatform.registryMetadata.id,
    ExecutiveOrchestrationLifecycleRegistry[0].id,
  ] as const),
  modelDependencies: Object.freeze(["eng-8-model-plan"] as const),
  foundationAlignment: Object.freeze({
    foundationId: ExecutiveOrchestrationFoundation.id,
    initialLifecycleStage: "Idle",
  } as const),
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  executesOrchestration: false,
} as const satisfies ExecutiveOrchestrationModelDescriptor & {
  readonly shape: Readonly<Record<string, string>>;
  readonly foundationAlignment: Readonly<{
    foundationId: string;
    initialLifecycleStage: string;
  }>;
});
