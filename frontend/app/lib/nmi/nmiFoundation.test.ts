/**
 * NPA-T NMI:1 — Management Intelligence Foundation tests.
 * Contract and composition only. Does not start NMI:2 or RMS:2.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { BUSINESS_PROJECT_CONTEXT_BOUNDARY } from "@/app/lib/business-context-awareness/businessProjectContextContract.ts";
import { realDataIntegrationFoundationIdentity } from "@/app/lib/data-reality/realDataIntegrationFoundation.ts";
import { MANAGER_OBJECT_KINDS } from "@/app/lib/manager-object/managerObjectInteractionFoundation.ts";
import { getDefaultNexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { NPS_OPTION_GENERATION_BOUNDARY } from "@/app/lib/nexora-problem-solving/npsOptionGeneration.ts";
import { RMS_AUTHORITY_BOUNDARY } from "@/app/lib/rms/rmsAuthorityBoundary.ts";
import { RMS_DEFERRED_CAPABILITIES, RMS_FOUNDATION_CONTRACT } from "@/app/lib/rms/rmsFoundationContract.ts";
import { verifyRmsFoundation } from "@/app/lib/rms/rmsFoundation.ts";
import { executiveStageQueueFoundationIdentity } from "@/app/lib/spatial-presentation/executiveStageQueueFoundation.ts";
import { VAI_AUTHORITY_BOUNDARY } from "@/app/lib/vai/vaiAuthorityBoundary.ts";
import { VAI_8_BOUNDARY } from "@/app/lib/vai/vaiExperimentDecisionContract.ts";
import { NMI_AUTHORITY_BOUNDARY } from "./nmiAuthorityBoundary.ts";
import { NMI_FOUNDATION_CONTRACT, type NmiCanonicalRef } from "./nmiContract.ts";
import { composeNmiUnifiedManagementModel, verifyNmiFoundation } from "./nmiFoundation.ts";
import { NMI_GATE_BOUNDARY } from "./nmiGateBoundary.ts";
import { NMI_CAUSAL_EVIDENCE_SAFETY, NMI_MANAGEMENT_RELATIONS } from "./nmiRelationshipContract.ts";
import { NMI_RMS_BOUNDARY } from "./nmiRmsBoundary.ts";

function ref(id: string, kind: NmiCanonicalRef["kind"], authority: string): NmiCanonicalRef {
  return { id, kind, authority, sourceRef: `src:${id}` };
}

test("NMI:1 foundation verifies without starting NMI:2 or RMS:2", () => {
  const verified = verifyNmiFoundation();
  assert.equal(verified.ok, true);
  assert.equal(NMI_FOUNDATION_CONTRACT.startsNmi2, false);
  assert.equal(NMI_FOUNDATION_CONTRACT.startsRms2, false);
  assert.equal(NMI_AUTHORITY_BOUNDARY.startsNmi2, false);
  assert.equal(NMI_AUTHORITY_BOUNDARY.startsRms2, false);
});

test("BUSINESS, PROJECT, HYBRID, and UNKNOWN remain explicit BCA kinds", () => {
  const business = composeNmiUnifiedManagementModel({
    modelId: "nmi-business",
    contextId: "bca:ctx:plant",
    contextKind: "BUSINESS",
    businessProjectRef: ref("org:plant", "BUSINESS_PROJECT", "BCA:1"),
  });
  const project = composeNmiUnifiedManagementModel({
    modelId: "nmi-project",
    contextId: "bca:ctx:rollout",
    contextKind: "PROJECT",
    businessProjectRef: ref("project:rollout", "BUSINESS_PROJECT", "BCA:1"),
  });
  const hybrid = composeNmiUnifiedManagementModel({
    modelId: "nmi-hybrid",
    contextId: "bca:ctx:hybrid",
    contextKind: "HYBRID",
    businessProjectRef: ref("hybrid:capacity", "BUSINESS_PROJECT", "BCA:1"),
  });
  const unknown = composeNmiUnifiedManagementModel({
    modelId: "nmi-unknown",
    contextId: "bca:ctx:unknown",
    contextKind: "UNKNOWN",
  });
  assert.equal(business.contextKind, "BUSINESS");
  assert.equal(project.contextKind, "PROJECT");
  assert.equal(hybrid.contextKind, "HYBRID");
  assert.equal(unknown.contextKind, "UNKNOWN");
  assert.equal(unknown.businessProjectRef, null);
  assert.equal(business.contextAuthority, "BCA:1/BusinessProjectContextFoundation");
  assert.equal(BUSINESS_PROJECT_CONTEXT_BOUNDARY.ownsContextInterpretation, true);
  assert.equal(NMI_FOUNDATION_CONTRACT.parallelContextClassifier, false);
});

test("canonical IDs are preserved and missing relationships stay missing", () => {
  const goalId = "goal:delivery";
  const model = composeNmiUnifiedManagementModel({
    modelId: "nmi-ids",
    contextId: "bca:ctx:plant",
    contextKind: "BUSINESS",
    nodes: [ref(goalId, "GOAL", "MO:1"), ref("kpi:otd", "KPI", "KPI")],
    unresolvedRelationshipIds: ["rel:goal-kpi-unresolved"],
  });
  assert.equal(model.nodes[0]?.id, goalId);
  assert.equal(model.relationships.length, 0);
  assert.deepEqual(model.unresolvedRelationshipIds, ["rel:goal-kpi-unresolved"]);
  assert.ok(model.missingNodes.includes("DECISION"));
  assert.equal(model.decisionRoadmap.fabricatesMissingNodes, false);
  assert.equal(model.decisionRoadmap.implemented, false);
});

test("NMI cannot manufacture causal certainty or collapse journey kinds", () => {
  const model = composeNmiUnifiedManagementModel({
    modelId: "nmi-safety",
    contextId: "bca:ctx:plant",
    contextKind: "BUSINESS",
    nodes: [
      ref("sc:a", "SCENARIO", "CC:9"),
      ref("dec:a", "DECISION", "CC:10"),
      ref("ex:a", "EXECUTION", "CC:11"),
      ref("out:a", "OUTCOME", "CORE-OUT"),
    ],
    relationships: [
      {
        relationshipId: "rel-assoc",
        fromId: "vai:staffing",
        toId: "vai:otd",
        kind: "affects",
        epistemicStatus: "ASSOCIATION",
        causal: false,
        convertsAssociationToCause: false,
        convertsAssumptionToFact: false,
        sourceAuthority: "VAI:3",
        sourceRef: "rel-staff-otd",
      },
    ],
    simulationStateIds: ["rms:world:1"],
    observedRealityIds: ["data:otd:91"],
  });
  assert.equal(model.createsCausalCertainty, false);
  assert.equal(model.relationships[0]?.causal, false);
  assert.equal(model.relationships[0]?.epistemicStatus, "ASSOCIATION");
  assert.equal(model.scenarioIsDecision, false);
  assert.equal(model.decisionIsExecution, false);
  assert.equal(model.executionIsOutcome, false);
  assert.equal(model.simulationIsObservedReality, false);
  assert.ok(!model.observedRealityIds.includes("rms:world:1"));
  assert.equal(NMI_CAUSAL_EVIDENCE_SAFETY.correlationToCausation, false);
  assert.equal(NMI_CAUSAL_EVIDENCE_SAFETY.scenarioToDecision, false);
  assert.equal(NMI_MANAGEMENT_RELATIONS.includes("affects"), true);
});

test("Gate API is reused rather than duplicated", () => {
  assert.equal(NMI_GATE_BOUNDARY.gateApi, realDataIntegrationFoundationIdentity);
  assert.equal(NMI_GATE_BOUNDARY.nmiGate, false);
  assert.equal(NMI_GATE_BOUNDARY.secondIngestionGateway, false);
  assert.equal(NMI_AUTHORITY_BOUNDARY.nmiGate, false);
  assert.equal(NMI_AUTHORITY_BOUNDARY.parallelGateApi, false);
});

test("NMI does not mutate Stage, Objects, Decisions, or Executions", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id);
  const model = composeNmiUnifiedManagementModel({
    modelId: "nmi-mutate",
    contextId: "bca:ctx:plant",
    contextKind: "PROJECT",
    nodes: [ref("dec:a", "DECISION", "CC:10")],
  });
  assert.equal(model.mutatesStage, false);
  assert.equal(model.mutatesObjects, false);
  assert.equal(model.approvesDecisions, false);
  assert.equal(model.startsExecutions, false);
  assert.deepEqual(getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id), catalog);
  assert.ok(!MANAGER_OBJECT_KINDS.includes("variable" as typeof MANAGER_OBJECT_KINDS[number]));
});

test("RMS remains separate from NMI management intelligence", () => {
  assert.equal(verifyRmsFoundation().ok, true);
  assert.equal(NMI_RMS_BOUNDARY.rmsGroundTruthOwner, "RMS:1");
  assert.equal(NMI_RMS_BOUNDARY.nmiIsSimulationEngine, false);
  assert.equal(NMI_RMS_BOUNDARY.rmsWritesNmiTruth, false);
  assert.equal(NMI_RMS_BOUNDARY.startsRms2, false);
  assert.equal(RMS_AUTHORITY_BOUNDARY.nmi, false);
  assert.equal(RMS_FOUNDATION_CONTRACT.privilegedSimulationNexora, false);
  assert.ok(RMS_DEFERRED_CAPABILITIES.includes("NMI"));
  assert.ok(RMS_DEFERRED_CAPABILITIES.includes("RMS_2"));
});

test("existing certified authorities remain authoritative", () => {
  assert.equal(NMI_AUTHORITY_BOUNDARY.managerObject, "MO:1");
  assert.equal(NMI_AUTHORITY_BOUNDARY.variables, "VAI:1–8");
  assert.equal(NMI_AUTHORITY_BOUNDARY.scenarios, "CC:9");
  assert.equal(NMI_AUTHORITY_BOUNDARY.decision, "CC:10");
  assert.equal(NMI_AUTHORITY_BOUNDARY.execution, "CC:11");
  assert.equal(NMI_AUTHORITY_BOUNDARY.gateApi, "RDI:1/NexoraRealDataIntegrationFoundation");
  assert.equal(VAI_AUTHORITY_BOUNDARY.scenario, "CC:9");
  assert.equal(VAI_8_BOUNDARY.startsVai9, false);
  assert.equal(NPS_OPTION_GENERATION_BOUNDARY.createsScenarioAuthority, false);
  assert.equal(executiveStageQueueFoundationIdentity, "STAGE-PROD:1/ExecutiveStageQueueFoundation");
  assert.equal(NMI_FOUNDATION_CONTRACT.managerFacingQueueUi, false);
  assert.equal(NMI_FOUNDATION_CONTRACT.managementMapImplemented, false);
  assert.equal(NMI_FOUNDATION_CONTRACT.attentionImplemented, false);
});
