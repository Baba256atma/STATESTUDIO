import {
  ExecutiveOrchestrationLifecycleContract,
} from "./executiveOrchestrationFoundation.ts";
import {
  ExecutiveOrchestrationCapabilityRegistry,
  ExecutiveOrchestrationComponentRegistry,
  ExecutiveOrchestrationLifecycleRegistry,
} from "./executiveOrchestrationRegistryPlatform.ts";
import type {
  ExecutiveOrchestrationModelDescriptor,
} from "./executiveOrchestrationModelTypes.ts";

const NAMESPACE = "nexora.engine.executive.orchestration.model" as const;

/**
 * Canonical Execution Stage structural model.
 * Metadata only — does not transition or execute stages.
 */
export const ExecutiveExecutionStageModel = Object.freeze({
  id: "eng-8-model-execution-stage",
  kind: "ExecutionStage",
  name: "Execution Stage",
  description:
    "Structural model describing orchestration execution-stage metadata without transitioning stages.",
  namespace: NAMESPACE,
  owner: "ENG-8",
  sourcePhase: "ENG-8:3",
  version: "1.0.0",
  status: "Defined",
  fields: Object.freeze([
    "stageId",
    "sequence",
    "lifecycleStage",
    "participatingComponents",
    "supportedCapabilities",
    "status",
  ] as const),
  shape: Object.freeze({
    stageId: "string",
    sequence: "number",
    lifecycleStage: "Idle | ReceiveRequest | PreparePipeline | ResolveDependencies | CoordinateExecution | AggregateResults | PrepareResponse | Complete",
    participatingComponents: "readonly ComponentId[]",
    supportedCapabilities: "readonly CapabilityId[]",
    status: "Declared",
  } as const),
  stageTemplates: Object.freeze(
    ExecutiveOrchestrationLifecycleRegistry.map((entry) => Object.freeze({
      stageId: entry.stageId,
      sequence: entry.sequence,
      lifecycleStage: entry.stageId,
      participatingComponents: entry.participatingComponentIds,
      supportedCapabilities: entry.allowedCapabilityIds,
      status: "Declared",
      terminal: entry.terminal,
      metadataOnly: true,
      immutable: true,
    } as const)),
  ),
  registryDependencies: Object.freeze([
    ExecutiveOrchestrationLifecycleRegistry[0].id,
    ExecutiveOrchestrationComponentRegistry[0].id,
    ExecutiveOrchestrationCapabilityRegistry[0].id,
  ] as const),
  modelDependencies: Object.freeze([
    "eng-8-model-coordination-route",
    "eng-8-model-execution-group",
  ] as const),
  foundationAlignment: Object.freeze({
    lifecycleOrdering: ExecutiveOrchestrationLifecycleContract.ordering,
  } as const),
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  executesOrchestration: false,
} as const satisfies ExecutiveOrchestrationModelDescriptor & {
  readonly shape: Readonly<Record<string, string>>;
  readonly stageTemplates: readonly object[];
  readonly foundationAlignment: object;
});
