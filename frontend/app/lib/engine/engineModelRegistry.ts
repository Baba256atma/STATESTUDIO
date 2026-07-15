import { ExecutiveEngineFoundation } from "./engineIndex.ts";
import { ExecutiveEngineCapabilityRegistry, ExecutiveEngineRegistryManifest } from "./engineRegistryIndex.ts";
import { ExecutiveDecisionModel, ExecutiveDecisionOptionModel, ExecutiveReasoningRecordModel } from "./executiveDecisionModel.ts";
import { ExecutiveGoalModel, ExecutiveIntentModel } from "./executiveIntentModel.ts";
import { ExecutiveOutcomeModel } from "./executiveOutcomeModel.ts";
import { ExecutiveCoordinationInstructionModel, ExecutivePlanModel, ExecutivePlanStepModel } from "./executivePlanModel.ts";
import { ExecutiveRequestModel } from "./executiveRequestModel.ts";
import type { ExecutiveEngineModelDescriptor, ExecutiveEngineModelRelationship } from "./engineModelTypes.ts";

/** ENG-1:3 generic engine context model (owned by Executive Engine; ENG-4 owns specialized assembly models). */
export const ExecutiveContextModel = Object.freeze({
  id: "executive-context", name: "Executive Context", description: "Conceptual schema for context references required by the Engine.", owner: "Engine", category: "ConceptualModel",
  fields: Object.freeze(["contextId", "requestReference", "tenantReference", "workspaceReference", "actorReferences", "businessDomainReferences", "operationDomainReferences", "relevantEntityReferences", "dataSourceReferences", "timeHorizonMetadata", "constraintReferences", "assumptionReferences", "contextCompletenessStatus"]),
  referencePolicies: Object.freeze(["external-entities-by-reference", "data-sources-by-reference", "tenant-aware-by-reference"]), publicVisibility: true, lifecycleStatus: "active", sourcePhase: "ENG-1:3", runtimeClassification: "MetadataOnly", metadataOnly: true, immutable: true,
} as const satisfies ExecutiveEngineModelDescriptor);

export const ExecutiveEngineModelRegistry = Object.freeze([
  ExecutiveRequestModel, ExecutiveIntentModel, ExecutiveGoalModel, ExecutiveContextModel,
  ExecutivePlanModel, ExecutivePlanStepModel, ExecutiveReasoningRecordModel, ExecutiveDecisionModel,
  ExecutiveDecisionOptionModel, ExecutiveCoordinationInstructionModel, ExecutiveOutcomeModel,
] as const);

const relationship = (order: number, source: ExecutiveEngineModelRelationship["source"], target: ExecutiveEngineModelRelationship["target"]) => Object.freeze({
  order, source, target, relationship: "DescribesFlowTo", runtimeExecution: false, metadataOnly: true,
} as const satisfies ExecutiveEngineModelRelationship);

export const ExecutiveEngineModelRelationships = Object.freeze([
  relationship(1, "executive-request", "executive-intent"),
  relationship(2, "executive-intent", "executive-goal"),
  relationship(3, "executive-goal", "executive-context"),
  relationship(4, "executive-context", "executive-plan"),
  relationship(5, "executive-plan", "executive-reasoning-record"),
  relationship(6, "executive-reasoning-record", "executive-decision"),
  relationship(7, "executive-decision", "executive-coordination-instruction"),
  relationship(8, "executive-coordination-instruction", "executive-outcome"),
] as const);

const summary = Object.freeze({
  modelPhaseId: "ENG-1:3", modelPhaseVersion: "1.0.0",
  totalModelCount: ExecutiveEngineModelRegistry.length,
  modelIdentifiers: Object.freeze(ExecutiveEngineModelRegistry.map((model) => model.id)),
  ownershipClassification: "EngineOwnedRepresentations",
  metadataOnlyStatus: true, runtimeFreeStatus: true,
  dependencyComplianceStatus: ExecutiveEngineFoundation.metadata.publicDependencies.length === 4 ? "Compliant" : "NonCompliant",
  registryCapabilityCount: ExecutiveEngineCapabilityRegistry.length,
  sourceRegistryPhase: ExecutiveEngineRegistryManifest.registryId,
  antiDuplicationStatus: "Compliant",
  nextPhase: "ENG-1:4 — Executive Engine Validation",
  immutable: true, deterministic: true,
} as const);

export const getExecutiveEngineModelRegistry = () => ExecutiveEngineModelRegistry;
export const getExecutiveEngineModelRelationships = () => ExecutiveEngineModelRelationships;
export const getExecutiveEngineModelSummary = () => summary;
