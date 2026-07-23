/**
 * EIL-4:3 — Integration Orchestration Relationship Models.
 *
 * Canonical descriptive relationships between orchestration domain models.
 * Metadata only — no relationship resolution or execution.
 *
 * Ownership: owned exclusively by EIL-4:3.
 */

import { IntegrationOrchestrationRegistryIdentity } from "./integrationOrchestrationRegistry.ts";
import type {
  IntegrationOrchestrationRelationshipModel,
  OrchestrationDomainModelKey,
  OrchestrationRegistryReference,
  OrchestrationRelationshipType,
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

const relationship = (
  key: string,
  relationshipType: OrchestrationRelationshipType,
  canonicalName: string,
  description: string,
  sourceModel: OrchestrationDomainModelKey,
  targetModel: OrchestrationDomainModelKey,
  collection: OrchestrationRegistryReference["collection"],
  entryKey: string,
  ordinal: number,
  tags: readonly string[],
): IntegrationOrchestrationRelationshipModel =>
  Object.freeze({
    relationshipId: `EIL-4:3/Relationship/${key}` as const,
    relationshipType,
    canonicalKey: key,
    canonicalName,
    description,
    sourceModel,
    targetModel,
    ownership: "EIL-4:3" as const,
    lifecycle: "Verified" as const,
    sourceRegistryReference: registryRef(collection, entryKey),
    sourceReference:
      `EIL-4:2/IntegrationOrchestrationRegistry/${collection}/${entryKey}`,
    version: "1.0.0" as const,
    ordinal,
    tags: Object.freeze([...tags]),
    resolvesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly twelve relationship declarations covering every relationship type.
 * Descriptive metadata only.
 */
export const IntegrationOrchestrationRelationshipModels: readonly IntegrationOrchestrationRelationshipModel[] =
  Object.freeze([
    relationship(
      "OrchestrationOwnsFlow",
      "owns",
      "Orchestration → Flow",
      "Orchestration owns flow definition metadata.",
      "Orchestration",
      "Flow",
      "contracts",
      "FlowContract",
      1,
      Object.freeze(["owns", "flow"]),
    ),
    relationship(
      "FlowReferencesStep",
      "references",
      "Flow → Flow Step",
      "Flow references step definition metadata.",
      "Flow",
      "FlowStep",
      "contracts",
      "StepContract",
      2,
      Object.freeze(["references", "step"]),
    ),
    relationship(
      "FlowStepDependsOnDependency",
      "dependsOn",
      "Flow Step → Dependency",
      "Flow step depends on dependency metadata.",
      "FlowStep",
      "Dependency",
      "contracts",
      "DependencyContract",
      3,
      Object.freeze(["dependsOn", "dependency"]),
    ),
    relationship(
      "FlowCompatibleWithApproval",
      "compatibleWith",
      "Flow → Approval",
      "Flow is compatible with approval metadata.",
      "Flow",
      "Approval",
      "categories",
      "ApprovalFlow",
      4,
      Object.freeze(["compatibleWith", "approval"]),
    ),
    relationship(
      "TransitionMappedToState",
      "mappedTo",
      "Transition → State",
      "Transition maps to state metadata.",
      "Transition",
      "State",
      "contracts",
      "StateContract",
      5,
      Object.freeze(["mappedTo", "state"]),
    ),
    relationship(
      "OrchestrationComposedOfFlows",
      "composedOf",
      "Orchestration → Flow",
      "Orchestration is composed of flow metadata.",
      "Orchestration",
      "Flow",
      "collections",
      "collections",
      6,
      Object.freeze(["composedOf", "flow"]),
    ),
    relationship(
      "FlowStepBelongsToFlow",
      "belongsTo",
      "Flow Step → Flow",
      "Flow step belongs to flow definition metadata.",
      "FlowStep",
      "Flow",
      "contracts",
      "FlowContract",
      7,
      Object.freeze(["belongsTo", "flow"]),
    ),
    relationship(
      "StateTransitionsToCompletion",
      "transitionsTo",
      "State → Completion",
      "State transitions to completion metadata without runtime transition.",
      "State",
      "Completion",
      "contracts",
      "CompletionContract",
      8,
      Object.freeze(["transitionsTo", "completion"]),
    ),
    relationship(
      "FlowTriggeredByTrigger",
      "triggeredBy",
      "Flow → Trigger",
      "Flow is triggered by trigger metadata without trigger execution.",
      "Flow",
      "Trigger",
      "contracts",
      "TriggerContract",
      9,
      Object.freeze(["triggeredBy", "trigger"]),
    ),
    relationship(
      "OrchestrationCoordinatesRouteReference",
      "coordinates",
      "Orchestration → Route Reference",
      "Orchestration coordinates route-reference metadata.",
      "Orchestration",
      "RouteReference",
      "capabilities",
      "FlowDescription",
      10,
      Object.freeze(["coordinates", "route-reference"]),
    ),
    relationship(
      "RecoveryRecoversFromFailure",
      "recoversFrom",
      "Recovery → Failure",
      "Recovery recovers from failure metadata without recovery engines.",
      "Recovery",
      "Failure",
      "contracts",
      "FailureContract",
      11,
      Object.freeze(["recoversFrom", "failure"]),
    ),
    relationship(
      "CompensationExtendsRecovery",
      "extends",
      "Compensation → Recovery",
      "Compensation metadata extends recovery mapping metadata.",
      "Compensation",
      "Recovery",
      "categories",
      "CompensationFlow",
      12,
      Object.freeze(["extends", "compensation"]),
    ),
  ]);

/** Exactly twelve relationship types covered by the relationship models. */
export const IntegrationOrchestrationRelationshipTypes = Object.freeze([
  "owns",
  "references",
  "dependsOn",
  "compatibleWith",
  "mappedTo",
  "composedOf",
  "belongsTo",
  "transitionsTo",
  "triggeredBy",
  "coordinates",
  "recoversFrom",
  "extends",
] as const satisfies readonly OrchestrationRelationshipType[]);
