/**
 * EIL-4:3 — Integration Orchestration Domain Models.
 *
 * Immutable architectural domain models derived from Registry references.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-4:3.
 */

import { IntegrationOrchestrationRegistryIdentity } from "./integrationOrchestrationRegistry.ts";
import type {
  IntegrationOrchestrationDomainModel,
  OrchestrationDomainModelKey,
  OrchestrationRegistryReference,
} from "./integrationOrchestrationModelTypes.ts";

const registryRef = (
  collection: OrchestrationRegistryReference["collection"],
  entryKey: string,
): OrchestrationRegistryReference =>
  Object.freeze({
    registryId: IntegrationOrchestrationRegistryIdentity.canonicalId,
    registryNamespace: IntegrationOrchestrationRegistryIdentity.namespace,
    entryPoint: "integrationOrchestrationRegistry.ts" as const,
    collection,
    entryKey,
    preservesCanonicalReference: true as const,
    duplicatesRegistryValue: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const domainModel = (
  key: OrchestrationDomainModelKey,
  canonicalName: string,
  description: string,
  collection: OrchestrationRegistryReference["collection"],
  entryKey: string,
  ordinal: number,
  tags: readonly string[],
): IntegrationOrchestrationDomainModel =>
  Object.freeze({
    modelId: `EIL-4:3/Model/${key}` as const,
    canonicalKey: key,
    canonicalName,
    description,
    ownership: "EIL-4:3" as const,
    lifecycle: "Verified" as const,
    sourceRegistryReference: registryRef(collection, entryKey),
    sourceReference:
      `EIL-4:2/IntegrationOrchestrationRegistry/${collection}/${entryKey}`,
    version: "1.0.0" as const,
    ordinal,
    tags: Object.freeze([...tags]),
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly sixteen canonical orchestration domain model definitions.
 * Registry collections are referenced, never duplicated.
 */
export const IntegrationOrchestrationDomainModels: readonly IntegrationOrchestrationDomainModel[] =
  Object.freeze([
    domainModel(
      "Orchestration",
      "Orchestration",
      "Root architectural model for an integration orchestration definition.",
      "collections",
      "collections",
      1,
      Object.freeze(["domain", "root"]),
    ),
    domainModel(
      "Flow",
      "Flow",
      "Architectural flow definition coordinating orchestration steps.",
      "contracts",
      "FlowContract",
      2,
      Object.freeze(["domain", "flow"]),
    ),
    domainModel(
      "FlowStep",
      "Flow Step",
      "Architectural step definition within an orchestration flow.",
      "contracts",
      "StepContract",
      3,
      Object.freeze(["domain", "step"]),
    ),
    domainModel(
      "Transition",
      "Transition",
      "Architectural transition metadata between orchestration steps.",
      "contracts",
      "TransitionContract",
      4,
      Object.freeze(["domain", "transition"]),
    ),
    domainModel(
      "Trigger",
      "Trigger",
      "Architectural trigger metadata for orchestration flow initiation.",
      "contracts",
      "TriggerContract",
      5,
      Object.freeze(["domain", "trigger"]),
    ),
    domainModel(
      "Dependency",
      "Dependency",
      "Architectural dependency metadata preserving approved direction.",
      "contracts",
      "DependencyContract",
      6,
      Object.freeze(["domain", "dependency"]),
    ),
    domainModel(
      "State",
      "State",
      "Architectural state metadata for orchestration definitions.",
      "contracts",
      "StateContract",
      7,
      Object.freeze(["domain", "state"]),
    ),
    domainModel(
      "Completion",
      "Completion",
      "Architectural completion metadata for orchestration flows.",
      "contracts",
      "CompletionContract",
      8,
      Object.freeze(["domain", "completion"]),
    ),
    domainModel(
      "Failure",
      "Failure",
      "Architectural failure metadata for orchestration definitions.",
      "contracts",
      "FailureContract",
      9,
      Object.freeze(["domain", "failure"]),
    ),
    domainModel(
      "Recovery",
      "Recovery",
      "Architectural recovery metadata for orchestration flow recovery.",
      "categories",
      "RecoveryFlow",
      10,
      Object.freeze(["domain", "recovery"]),
    ),
    domainModel(
      "Compensation",
      "Compensation",
      "Architectural compensation metadata for orchestration rollback paths.",
      "categories",
      "CompensationFlow",
      11,
      Object.freeze(["domain", "compensation"]),
    ),
    domainModel(
      "Approval",
      "Approval",
      "Architectural approval metadata for gated orchestration flows.",
      "categories",
      "ApprovalFlow",
      12,
      Object.freeze(["domain", "approval"]),
    ),
    domainModel(
      "RouteReference",
      "Route Reference",
      "Architectural reference metadata linking orchestration to route surfaces.",
      "capabilities",
      "FlowDescription",
      13,
      Object.freeze(["domain", "route-reference"]),
    ),
    domainModel(
      "ConnectorReference",
      "Connector Reference",
      "Architectural reference metadata linking orchestration to connector surfaces.",
      "capabilities",
      "StepDescription",
      14,
      Object.freeze(["domain", "connector-reference"]),
    ),
    domainModel(
      "ExecutionContext",
      "Execution Context",
      "Architectural context metadata surrounding an orchestration definition.",
      "capabilities",
      "StateDescription",
      15,
      Object.freeze(["domain", "context"]),
    ),
    domainModel(
      "OrchestrationBoundary",
      "Orchestration Boundary",
      "Architectural boundary metadata for orchestration ownership surfaces.",
      "ownershipCoverage",
      "1",
      16,
      Object.freeze(["domain", "boundary"]),
    ),
  ]);
