/**
 * NPA-T NMI:3 — Management Relationship Intelligence tests.
 * Read interpretation only. Does not start NMI:4 or change Queue/Advisor/Stage.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { BUSINESS_PROJECT_RELATIONSHIP_BOUNDARY } from "@/app/lib/business-context-awareness/businessProjectRelationshipContract.ts";
import { realDataIntegrationFoundationIdentity } from "@/app/lib/data-reality/realDataIntegrationFoundation.ts";
import { getDefaultNexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { RMS_NEXORA_PARTICIPANT_CONTRACT } from "@/app/lib/rms/rmsActorContracts.ts";
import { verifyRmsFoundation } from "@/app/lib/rms/rmsFoundation.ts";
import { executiveStageQueueFoundationIdentity } from "@/app/lib/spatial-presentation/executiveStageQueueFoundation.ts";
import { VAI_AUTHORITY_BOUNDARY } from "@/app/lib/vai/vaiAuthorityBoundary.ts";
import { VAI_CAUSAL_SAFETY_BOUNDARY } from "@/app/lib/vai/vaiCausalContract.ts";
import { NMI_AUTHORITY_BOUNDARY } from "./nmiAuthorityBoundary.ts";
import { type NmiCanonicalRef } from "./nmiContract.ts";
import { composeNmiUnifiedManagementModel } from "./nmiFoundation.ts";
import { NMI_GATE_BOUNDARY } from "./nmiGateBoundary.ts";
import { composeNmiManagementMap } from "./nmiManagementMapCompose.ts";
import { NMI_MANAGEMENT_MAP_CONTRACT } from "./nmiManagementMapContract.ts";
import { verifyNmiManagementMap } from "./nmiManagementMapFoundation.ts";
import { NMI_CAUSAL_EVIDENCE_SAFETY, type NmiManagementRelationship } from "./nmiRelationshipContract.ts";
import { NMI_RMS_BOUNDARY } from "./nmiRmsBoundary.ts";
import { extractNmiRelationshipChain } from "./nmiRelationshipIntelligenceChain.ts";
import {
  NMI_RELATIONSHIP_INTELLIGENCE_CONTRACT,
  NMI_RELATIONSHIP_INTELLIGENCE_GATE_FLOW,
} from "./nmiRelationshipIntelligenceContract.ts";
import { verifyNmiRelationshipIntelligence } from "./nmiRelationshipIntelligenceFoundation.ts";
import { nmiRelationshipIntelligenceIdentity } from "./nmiRelationshipIntelligenceIdentity.ts";
import {
  explainNmiRelationshipTrace,
  interpretNmiRelationship,
  interpretNmiRelationships,
  rejectSealedRmsRelationship,
} from "./nmiRelationshipIntelligenceInterpret.ts";
import { answerNmiManagementQuestion, composeNmiRelationshipGapReport } from "./nmiRelationshipIntelligenceQuery.ts";

function ref(id: string, kind: NmiCanonicalRef["kind"], authority: string): NmiCanonicalRef {
  return { id, kind, authority, sourceRef: `src:${id}` };
}

function rel(
  relationshipId: string,
  fromId: string,
  toId: string,
  kind: NmiManagementRelationship["kind"],
  epistemicStatus: NmiManagementRelationship["epistemicStatus"] = "DECLARED",
): NmiManagementRelationship {
  return {
    relationshipId,
    fromId,
    toId,
    kind,
    epistemicStatus,
    causal: false,
    convertsAssociationToCause: false,
    convertsAssumptionToFact: false,
    sourceAuthority: "canonical",
    sourceRef: relationshipId,
  };
}

function plantMap() {
  const model = composeNmiUnifiedManagementModel({
    modelId: "nmi-rel-plant",
    contextId: "bca:ctx:plant",
    contextKind: "BUSINESS",
    businessProjectRef: ref("org:plant", "BUSINESS_PROJECT", "BCA:1"),
    nodes: [
      ref("goal:otd", "GOAL", "MO:1"),
      ref("proc:production", "PROCESS", "BCA:4"),
      ref("kpi:otd", "KPI", "KPI"),
      ref("data:otd", "DATA_EVIDENCE", "P0:1"),
      ref("problem:capacity", "PROBLEM", "MO:1"),
      ref("risk:overtime", "RISK", "MO:1"),
      ref("vai:capacity", "VARIABLE", "VAI:1"),
      ref("sc:temp", "SCENARIO", "CC:9"),
      ref("sc:external", "SCENARIO", "CC:9"),
      ref("sc:overtime", "SCENARIO", "CC:9"),
      ref("proc:disconnected", "PROCESS", "BCA:4"),
    ],
    relationships: [
      rel("rel:kpi-measures-goal", "kpi:otd", "goal:otd", "measures"),
      rel("rel:kpi-evidence", "kpi:otd", "data:otd", "evidenced_by", "EVIDENCE_REFERENCED"),
      rel("rel:problem-threatens", "problem:capacity", "goal:otd", "threatens"),
      rel("rel:problem-operation", "problem:capacity", "proc:production", "belongs_to"),
      rel("rel:risk-problem", "risk:overtime", "problem:capacity", "supports"),
      rel("rel:var-capacity", "vai:capacity", "problem:capacity", "affects", "ASSOCIATION"),
      rel("rel:sc-temp", "sc:temp", "problem:capacity", "addresses"),
      rel("rel:sc-external", "sc:external", "problem:capacity", "addresses"),
    ],
    unresolvedRelationshipIds: ["rel:unresolved-driver"],
  });
  return composeNmiManagementMap({ mapId: "map-rel-plant", model });
}

function journeyMap() {
  const model = composeNmiUnifiedManagementModel({
    modelId: "nmi-rel-journey",
    contextId: "bca:ctx:plant",
    contextKind: "BUSINESS",
    nodes: [
      ref("problem:capacity", "PROBLEM", "MO:1"),
      ref("sc:external", "SCENARIO", "CC:9"),
      ref("dec:external", "DECISION", "CC:10"),
      ref("ex:expand", "EXECUTION", "CC:11"),
      ref("out:otd", "OUTCOME", "CORE-OUT"),
      ref("learn:capacity", "LEARNING", "CORE-OUT:2"),
    ],
    relationships: [
      rel("rel:sc-addr", "sc:external", "problem:capacity", "addresses"),
      rel("rel:dec-select", "dec:external", "sc:external", "selected_as"),
      rel("rel:exec", "ex:expand", "dec:external", "executed_by"),
      rel("rel:obs", "out:otd", "ex:expand", "observed_by"),
      rel("rel:learn", "learn:capacity", "problem:capacity", "reassesses"),
    ],
  });
  return composeNmiManagementMap({ mapId: "map-rel-journey", model });
}

test("NMI:3 verifies on NMI:1–2 without starting NMI:4", () => {
  assert.equal(verifyNmiManagementMap().ok, true);
  assert.equal(verifyNmiRelationshipIntelligence().ok, true);
  assert.equal(NMI_MANAGEMENT_MAP_CONTRACT.startsNmi3, false);
  assert.equal(NMI_RELATIONSHIP_INTELLIGENCE_CONTRACT.startsNmi4, false);
  assert.equal(NMI_RELATIONSHIP_INTELLIGENCE_CONTRACT.decisionRoadmapImplemented, false);
  assert.equal(nmiRelationshipIntelligenceIdentity, "NPA-T NMI:3/ManagementRelationshipIntelligence");
  assert.equal(BUSINESS_PROJECT_RELATIONSHIP_BOUNDARY.ownsRelationshipStore, false);
  assert.equal(NMI_RELATIONSHIP_INTELLIGENCE_CONTRACT.duplicatesBca3, false);
});

test("cross-domain interpretations preserve IDs, direction, class, and provenance", () => {
  const map = plantMap();
  const items = interpretNmiRelationships(map);
  const measures = items.find((item) => item.relationshipId === "rel:kpi-measures-goal");
  const evidence = items.find((item) => item.relationshipId === "rel:kpi-evidence");
  const threat = items.find((item) => item.relationshipId === "rel:problem-threatens");
  const operation = items.find((item) => item.relationshipId === "rel:problem-operation");
  const risk = items.find((item) => item.relationshipId === "rel:risk-problem");
  const variable = items.find((item) => item.relationshipId === "rel:var-capacity");
  const scenario = items.find((item) => item.relationshipId === "rel:sc-temp");
  assert.equal(measures?.sourceId, "kpi:otd");
  assert.equal(measures?.targetId, "goal:otd");
  assert.equal(measures?.managementClass, "PERFORMANCE");
  assert.equal(measures?.sourceRef?.id, "kpi:otd");
  assert.equal(evidence?.managementClass, "EVIDENCE");
  assert.equal(evidence?.epistemicStatus, "EVIDENCE_REFERENCED");
  assert.ok(evidence?.provenance.includes("canonical"));
  assert.equal(threat?.kind, "threatens");
  assert.equal(threat?.sourceId, "problem:capacity");
  assert.equal(threat?.targetId, "goal:otd");
  assert.equal(operation?.managementClass, "STRUCTURAL");
  assert.equal(risk?.sourceId, "risk:overtime");
  assert.equal(risk?.targetId, "problem:capacity");
  assert.equal(variable?.managementClass, "ANALYTICAL");
  assert.equal(variable?.causalCommunication, "ANALYTICAL_INFLUENCE");
  assert.equal(variable?.causal, false);
  assert.equal(variable?.epistemicStatus, "ASSOCIATION");
  assert.equal(variable?.certainty, "UNKNOWN");
  assert.equal(variable?.numericStrength, null);
  assert.equal(scenario?.managementClass, "RESPONSE");
  assert.equal(threat?.directionPreserved, true);
  assert.equal(threat?.reversesSemanticMeaning, false);
});

test("commitment, execution, observation, and learning interpretations", () => {
  const items = interpretNmiRelationships(journeyMap());
  assert.equal(items.find((item) => item.kind === "selected_as")?.managementClass, "COMMITMENT");
  assert.equal(items.find((item) => item.kind === "executed_by")?.managementClass, "EXECUTION");
  assert.equal(items.find((item) => item.kind === "observed_by")?.managementClass, "OBSERVATION");
  assert.equal(items.find((item) => item.kind === "reassesses")?.managementClass, "LEARNING");
  assert.equal(items.find((item) => item.kind === "executed_by")?.sourceId, "ex:expand");
  assert.equal(items.find((item) => item.kind === "executed_by")?.targetId, "dec:external");
});

test("reverse navigation does not reverse semantic meaning", () => {
  const map = plantMap();
  const chain = extractNmiRelationshipChain(map, { originNodeId: "goal:otd", maxHops: 2 });
  const threatHop = chain.hops.find((hop) => hop.relationshipId === "rel:problem-threatens");
  assert.equal(threatHop?.traversal, "REVERSE");
  assert.equal(threatHop?.fromNodeId, "goal:otd");
  assert.equal(threatHop?.toNodeId, "problem:capacity");
  assert.equal(threatHop?.semanticSourceId, "problem:capacity");
  assert.equal(threatHop?.semanticTargetId, "goal:otd");
  assert.equal(threatHop?.interpretation.kind, "threatens");
  assert.ok(threatHop?.interpretation.managementMeaning.includes("PROBLEM threatens GOAL"));
  assert.equal(threatHop?.interpretation.reversesSemanticMeaning, false);
});

test("causal safety: association is not cause; unsupported confirmation is rejected", () => {
  const map = plantMap();
  const assoc = interpretNmiRelationship(map, map.relationships.find((item) => item.relationshipId === "rel:var-capacity")!);
  assert.equal(assoc.causalCommunication, "ANALYTICAL_INFLUENCE");
  assert.notEqual(assoc.causalCommunication, "CONFIRMED_CAUSAL_RELATIONSHIP");
  assert.equal(NMI_CAUSAL_EVIDENCE_SAFETY.correlationToCausation, false);
  assert.equal(VAI_CAUSAL_SAFETY_BOUNDARY.correlationEqualsCausation, false);
  const rejected = interpretNmiRelationship(
    map,
    map.relationships.find((item) => item.relationshipId === "rel:var-capacity")!,
    { relationshipId: "rel:var-capacity", coreInt3CauseEstablished: true, vaiCausalStatus: "HYPOTHESIS" },
  );
  assert.equal(rejected.unresolvedReason, "UNSUPPORTED_CAUSAL_LINK");
  assert.notEqual(rejected.causalCommunication, "CONFIRMED_CAUSAL_RELATIONSHIP");
  assert.equal(rejected.certainty, "UNKNOWN");
  const unknown = interpretNmiRelationship(map, {
    ...map.relationships[0]!,
    relationshipId: "rel:unknown",
    epistemicStatus: "UNKNOWN",
  });
  assert.equal(unknown.certainty, "UNKNOWN");
});

test("bounded chains do not invent missing intermediate edges", () => {
  const map = plantMap();
  const chain = extractNmiRelationshipChain(map, {
    originNodeId: "goal:otd",
    maxHops: 4,
    kinds: ["measures"],
  });
  assert.ok(chain.hops.some((hop) => hop.relationshipId === "rel:kpi-measures-goal"));
  assert.equal(chain.hops.some((hop) => hop.relationshipId === "rel:kpi-evidence"), false);
  assert.equal(chain.inventedRelationships, false);
  const journey = extractNmiRelationshipChain(journeyMap(), { originNodeId: "problem:capacity", maxHops: 4 });
  assert.ok(journey.hops.some((hop) => hop.interpretation.kind === "addresses"));
  assert.ok(journey.hops.some((hop) => hop.interpretation.kind === "selected_as"));
});

test("relationship gaps are detected and disconnected nodes remain valid", () => {
  const map = plantMap();
  const report = composeNmiRelationshipGapReport(map, "problem:capacity");
  assert.equal(report.checks.find((item) => item.check === "GOAL")?.present, true);
  assert.equal(report.checks.find((item) => item.check === "KPI")?.present, true);
  assert.equal(report.checks.find((item) => item.check === "DATA")?.present, true);
  assert.equal(report.checks.find((item) => item.check === "SCENARIO")?.present, true);
  assert.equal(report.checks.find((item) => item.check === "CONFIRMED_DRIVER")?.present, false);
  assert.equal(report.checks.find((item) => item.check === "CONFIRMED_DRIVER")?.reason, "UNSUPPORTED_CAUSAL_LINK");
  assert.equal(report.checks.find((item) => item.check === "DECISION")?.present, false);
  assert.equal(report.fabricatesMissingEdges, false);
  assert.ok(report.disconnectedValidNodeIds.includes("proc:disconnected"));
  assert.ok(report.disconnectedValidNodeIds.includes("sc:overtime"));
  const overtimeScenarios = answerNmiManagementQuestion(map, "SCENARIOS_ADDRESSING", "problem:capacity");
  assert.equal(overtimeScenarios.relatedIds.includes("sc:overtime"), false);
  assert.ok(report.gaps.some((gap) => gap.reason === "CANONICAL_REFERENCE_MISSING"));
  const isolated = composeNmiUnifiedManagementModel({
    modelId: "nmi-gap-only",
    contextId: "bca:ctx:unknown",
    contextKind: "UNKNOWN",
    nodes: [ref("problem:alone", "PROBLEM", "MO:1"), ref("sc:a", "SCENARIO", "CC:9"), ref("sc:b", "SCENARIO", "CC:9"), ref("sc:c", "SCENARIO", "CC:9")],
  });
  const isolatedMap = composeNmiManagementMap({ mapId: "map-gap-only", model: isolated });
  const isolatedReport = composeNmiRelationshipGapReport(isolatedMap, "problem:alone");
  assert.equal(isolatedReport.checks.find((item) => item.check === "SCENARIO")?.present, false);
  assert.equal(isolatedReport.checks.find((item) => item.check === "SCENARIO")?.reason, "MISSING_RELATIONSHIP");
  assert.ok(isolatedReport.gaps.some((gap) => gap.reason === "UNKNOWN_CONTEXT"));
});

test("management questions, explainable traces, RMS/Gate/UI isolation", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id);
  const map = plantMap();
  const journey = journeyMap();
  assert.deepEqual(answerNmiManagementQuestion(map, "GOAL_THREATENED_BY_PROBLEM", "problem:capacity").relatedIds, ["goal:otd"]);
  assert.deepEqual(answerNmiManagementQuestion(map, "KPI_MEASURING_GOAL", "goal:otd").relatedIds, ["kpi:otd"]);
  assert.deepEqual(answerNmiManagementQuestion(map, "DATA_SUPPORTING_KPI", "kpi:otd").relatedIds, ["data:otd"]);
  assert.deepEqual(answerNmiManagementQuestion(map, "OPERATIONS_RELATED_TO_PROBLEM", "problem:capacity").relatedIds, ["proc:production"]);
  assert.deepEqual(answerNmiManagementQuestion(map, "VARIABLES_ASSOCIATED_WITH_ISSUE", "problem:capacity").relatedIds, ["vai:capacity"]);
  assert.equal(answerNmiManagementQuestion(map, "SCENARIOS_ADDRESSING", "problem:capacity").relatedIds.length, 2);
  assert.deepEqual(answerNmiManagementQuestion(journey, "DECISION_SELECTING_SCENARIO", "sc:external").relatedIds, ["dec:external"]);
  assert.deepEqual(answerNmiManagementQuestion(journey, "EXECUTION_OF_DECISION", "dec:external").relatedIds, ["ex:expand"]);
  assert.deepEqual(answerNmiManagementQuestion(journey, "OUTCOME_OF_EXECUTION", "ex:expand").relatedIds, ["out:otd"]);
  assert.ok(answerNmiManagementQuestion(map, "DISCONNECTED_NODES", null).relatedIds.includes("proc:disconnected"));
  const trace = explainNmiRelationshipTrace(
    interpretNmiRelationships(map).filter((item) => item.relationshipId === "rel:problem-threatens"),
  );
  assert.ok(trace.includes("problem:capacity"));
  assert.ok(trace.some((line) => line.includes("threatens")));
  assert.ok(trace.some((line) => line.includes("epistemic")));
  const sealed = rejectSealedRmsRelationship("rms:ground-truth:hidden-edge");
  assert.equal(sealed.relationshipId, "rms:ground-truth:hidden-edge");
  assert.equal(sealed.known, false);
  assert.equal(sealed.readsSealedRmsGroundTruth, false);
  assert.equal(NMI_RMS_BOUNDARY.rmsWritesNmiTruth, false);
  assert.equal(RMS_NEXORA_PARTICIPANT_CONTRACT.groundTruthAccess, "FORBIDDEN");
  assert.equal(NMI_GATE_BOUNDARY.nmiGate, false);
  assert.equal(NMI_GATE_BOUNDARY.gateApi, realDataIntegrationFoundationIdentity);
  assert.equal(NMI_RELATIONSHIP_INTELLIGENCE_GATE_FLOW[5], "NMI_RELATIONSHIP_INTELLIGENCE");
  assert.equal(NMI_RELATIONSHIP_INTELLIGENCE_CONTRACT.bypassesGate, false);
  assert.equal(NMI_RELATIONSHIP_INTELLIGENCE_CONTRACT.mutatesObjects, false);
  assert.equal(NMI_RELATIONSHIP_INTELLIGENCE_CONTRACT.mutatesStage, false);
  assert.equal(NMI_RELATIONSHIP_INTELLIGENCE_CONTRACT.mutatesQueue, false);
  assert.equal(NMI_RELATIONSHIP_INTELLIGENCE_CONTRACT.parallelAdvisor, false);
  assert.equal(executiveStageQueueFoundationIdentity, "STAGE-PROD:1/ExecutiveStageQueueFoundation");
  assert.equal(NMI_AUTHORITY_BOUNDARY.advisor, "CC:5 / NXA / NCA / ECA presentation");
  assert.equal(VAI_AUTHORITY_BOUNDARY.scenario, "CC:9");
  assert.equal(verifyRmsFoundation().ok, true);
  assert.deepEqual(getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id), catalog);
});
