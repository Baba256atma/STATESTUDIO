import {
  ExecutiveOrchestrationDependencyContract,
} from "./executiveOrchestrationFoundation.ts";
import {
  ExecutiveOrchestrationDependencyRegistry,
  ExecutiveOrchestrationLifecycleRegistry,
} from "./executiveOrchestrationRegistryPlatform.ts";
import type {
  ExecutiveOrchestrationModelDescriptor,
} from "./executiveOrchestrationModelTypes.ts";

const NAMESPACE = "nexora.engine.executive.orchestration.model" as const;

/**
 * Canonical Dependency Chain structural model.
 * Metadata only — does not resolve dependencies.
 */
export const ExecutiveDependencyChainModel = Object.freeze({
  id: "eng-8-model-dependency-chain",
  kind: "DependencyChain",
  name: "Dependency Chain",
  description:
    "Structural model describing orchestration dependency-chain metadata without resolving dependencies.",
  namespace: NAMESPACE,
  owner: "ENG-8",
  sourcePhase: "ENG-8:3",
  version: "1.0.0",
  status: "Defined",
  fields: Object.freeze([
    "dependencyId",
    "parent",
    "child",
    "relationship",
    "ordering",
  ] as const),
  shape: Object.freeze({
    dependencyId: "string",
    parent: "RegistryEntryId | LifecycleStageId | CoordinationTargetId",
    child: "RegistryEntryId | LifecycleStageId | CoordinationTargetId",
    relationship: "ForwardPrerequisite | SupportingReference",
    ordering: "number",
  } as const),
  chainLinks: Object.freeze([
    Object.freeze({
      dependencyId: "eng-8-chain-idle-to-receive",
      parent: "Idle",
      child: "ReceiveRequest",
      relationship: "ForwardPrerequisite",
      ordering: 1,
      metadataOnly: true,
      immutable: true,
    } as const),
    Object.freeze({
      dependencyId: "eng-8-chain-receive-to-prepare",
      parent: "ReceiveRequest",
      child: "PreparePipeline",
      relationship: "ForwardPrerequisite",
      ordering: 2,
      metadataOnly: true,
      immutable: true,
    } as const),
    Object.freeze({
      dependencyId: "eng-8-chain-prepare-to-resolve",
      parent: "PreparePipeline",
      child: "ResolveDependencies",
      relationship: "ForwardPrerequisite",
      ordering: 3,
      metadataOnly: true,
      immutable: true,
    } as const),
    Object.freeze({
      dependencyId: "eng-8-chain-resolve-to-coordinate",
      parent: "ResolveDependencies",
      child: "CoordinateExecution",
      relationship: "ForwardPrerequisite",
      ordering: 4,
      metadataOnly: true,
      immutable: true,
    } as const),
    Object.freeze({
      dependencyId: "eng-8-chain-coordinate-to-aggregate",
      parent: "CoordinateExecution",
      child: "AggregateResults",
      relationship: "ForwardPrerequisite",
      ordering: 5,
      metadataOnly: true,
      immutable: true,
    } as const),
    Object.freeze({
      dependencyId: "eng-8-chain-aggregate-to-response",
      parent: "AggregateResults",
      child: "PrepareResponse",
      relationship: "ForwardPrerequisite",
      ordering: 6,
      metadataOnly: true,
      immutable: true,
    } as const),
    Object.freeze({
      dependencyId: "eng-8-chain-response-to-complete",
      parent: "PrepareResponse",
      child: "Complete",
      relationship: "ForwardPrerequisite",
      ordering: 7,
      metadataOnly: true,
      immutable: true,
    } as const),
  ] as const),
  publicDependencyReferences: Object.freeze(
    ExecutiveOrchestrationDependencyRegistry.map((entry) => Object.freeze({
      dependencyId: entry.dependencyId,
      name: entry.name,
      runtimeInvocationAllowed: entry.runtimeInvocationAllowed,
      publicApiOnly: entry.publicApiOnly,
      metadataOnly: true,
      immutable: true,
    } as const)),
  ),
  registryDependencies: Object.freeze([
    ExecutiveOrchestrationDependencyRegistry[0].id,
    ExecutiveOrchestrationLifecycleRegistry[0].id,
  ] as const),
  modelDependencies: Object.freeze([
    "eng-8-model-execution-stage",
    "eng-8-model-plan",
  ] as const),
  foundationAlignment: Object.freeze({
    allowedDependencies: ExecutiveOrchestrationDependencyContract.rules.allowed,
    forbiddenDependencies: ExecutiveOrchestrationDependencyContract.rules.forbidden,
  } as const),
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  executesOrchestration: false,
} as const satisfies ExecutiveOrchestrationModelDescriptor & {
  readonly shape: Readonly<Record<string, string>>;
  readonly chainLinks: readonly object[];
  readonly publicDependencyReferences: readonly object[];
  readonly foundationAlignment: object;
});
