/**
 * NPA-T NMI:4 — Decision Roadmap Intelligence tests.
 * Read projection only. Does not start NMI:5 or change Queue/Stage/Advisor.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { realDataIntegrationFoundationIdentity } from "@/app/lib/data-reality/realDataIntegrationFoundation.ts";
import { getDefaultNexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { RMS_NEXORA_PARTICIPANT_CONTRACT } from "@/app/lib/rms/rmsActorContracts.ts";
import { verifyRmsFoundation } from "@/app/lib/rms/rmsFoundation.ts";
import { executiveStageQueueFoundationIdentity } from "@/app/lib/spatial-presentation/executiveStageQueueFoundation.ts";
import { VAI_AUTHORITY_BOUNDARY } from "@/app/lib/vai/vaiAuthorityBoundary.ts";
import { VAI_CAUSAL_SAFETY_BOUNDARY } from "@/app/lib/vai/vaiCausalContract.ts";
import { NMI_AUTHORITY_BOUNDARY } from "./nmiAuthorityBoundary.ts";
import { NMI_FOUNDATION_CONTRACT, type NmiCanonicalRef } from "./nmiContract.ts";
import { composeNmiUnifiedManagementModel } from "./nmiFoundation.ts";
import { NMI_GATE_BOUNDARY } from "./nmiGateBoundary.ts";
import { composeNmiManagementMap } from "./nmiManagementMapCompose.ts";
import { type NmiManagementRelationship } from "./nmiRelationshipContract.ts";
import { NMI_RELATIONSHIP_INTELLIGENCE_CONTRACT } from "./nmiRelationshipIntelligenceContract.ts";
import { verifyNmiRelationshipIntelligence } from "./nmiRelationshipIntelligenceFoundation.ts";
import { NMI_RMS_BOUNDARY } from "./nmiRmsBoundary.ts";
import { composeNmiDecisionRoadmap, rejectSealedRmsRoadmapFact } from "./nmiDecisionRoadmapCompose.ts";
import {
  NMI_DECISION_ROADMAP_CONTRACT,
  NMI_DECISION_ROADMAP_GATE_FLOW,
  type NmiRoadmapStage,
} from "./nmiDecisionRoadmapContract.ts";
import { explainNmiDecisionRoadmap } from "./nmiDecisionRoadmapExplain.ts";
import { verifyNmiDecisionRoadmap } from "./nmiDecisionRoadmapFoundation.ts";
import { nmiDecisionRoadmapIdentity } from "./nmiDecisionRoadmapIdentity.ts";
import { projectNmiDecisionRoadmap } from "./nmiDecisionRoadmapProjection.ts";

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

function statusOf(roadmap: ReturnType<typeof composeNmiDecisionRoadmap>, stage: NmiRoadmapStage) {
  return roadmap.stages.find((item) => item.stage === stage)?.status;
}

function idsOf(roadmap: ReturnType<typeof composeNmiDecisionRoadmap>, stage: NmiRoadmapStage) {
  return roadmap.stages.find((item) => item.stage === stage)?.elements.map((item) => item.elementId) ?? [];
}

function issueMap() {
  const model = composeNmiUnifiedManagementModel({
    modelId: "nmi-rm-issue",
    contextId: "bca:ctx:plant",
    contextKind: "BUSINESS",
    businessProjectRef: ref("org:plant", "BUSINESS_PROJECT", "BCA:1"),
    nodes: [
      ref("goal:otd", "GOAL", "MO:1"),
      ref("proc:production", "PROCESS", "BCA:4"),
      ref("kpi:otd", "KPI", "KPI"),
      ref("data:otd", "DATA_EVIDENCE", "P0:1"),
      ref("problem:capacity", "PROBLEM", "MO:1"),
      ref("vai:capacity", "VARIABLE", "VAI:1"),
    ],
    relationships: [
      rel("rel:kpi-measures-goal", "kpi:otd", "goal:otd", "measures"),
      rel("rel:kpi-evidence", "kpi:otd", "data:otd", "evidenced_by", "EVIDENCE_REFERENCED"),
      rel("rel:problem-threatens", "problem:capacity", "goal:otd", "threatens"),
      rel("rel:problem-op", "problem:capacity", "proc:production", "belongs_to"),
      rel("rel:var-capacity", "vai:capacity", "problem:capacity", "affects", "ASSOCIATION"),
    ],
  });
  return composeNmiManagementMap({
    mapId: "map-rm-issue",
    model,
    annotations: [
      { id: "goal:otd", title: "OTD ≥ 96%" },
      { id: "problem:capacity", title: "Capacity Gap" },
      { id: "data:otd", knownStatus: "UNRESOLVED" },
    ],
  });
}

function scenarioMap(withComparison: boolean) {
  const model = composeNmiUnifiedManagementModel({
    modelId: "nmi-rm-sc",
    contextId: "bca:ctx:plant",
    contextKind: "BUSINESS",
    businessProjectRef: ref("org:plant", "BUSINESS_PROJECT", "BCA:1"),
    nodes: [
      ref("problem:capacity", "PROBLEM", "MO:1"),
      ref("sc:temp", "SCENARIO", "CC:9"),
      ref("sc:external", "SCENARIO", "CC:9"),
      ref("sc:none", "SCENARIO", "CC:9"),
    ],
    relationships: [
      rel("rel:sc-temp", "sc:temp", "problem:capacity", "addresses"),
      rel("rel:sc-external", "sc:external", "problem:capacity", "addresses"),
      rel("rel:sc-none", "sc:none", "problem:capacity", "addresses"),
    ],
  });
  return composeNmiManagementMap({
    mapId: withComparison ? "map-rm-sc-cmp" : "map-rm-sc",
    model,
    annotations: [{ id: "problem:capacity", title: "Capacity Gap" }],
  });
}

function decisionMap() {
  const model = composeNmiUnifiedManagementModel({
    modelId: "nmi-rm-dec",
    contextId: "bca:ctx:plant",
    contextKind: "BUSINESS",
    nodes: [
      ref("problem:capacity", "PROBLEM", "MO:1"),
      ref("sc:external", "SCENARIO", "CC:9"),
      ref("dec:external", "DECISION", "CC:10"),
    ],
    relationships: [
      rel("rel:sc-addr", "sc:external", "problem:capacity", "addresses"),
      rel("rel:dec-select", "dec:external", "sc:external", "selected_as"),
    ],
  });
  return composeNmiManagementMap({ mapId: "map-rm-dec", model });
}

function executionMap() {
  const model = composeNmiUnifiedManagementModel({
    modelId: "nmi-rm-ex",
    contextId: "bca:ctx:plant",
    contextKind: "BUSINESS",
    nodes: [
      ref("dec:external", "DECISION", "CC:10"),
      ref("ex:expand", "EXECUTION", "CC:11"),
    ],
    relationships: [rel("rel:exec", "ex:expand", "dec:external", "executed_by")],
  });
  return composeNmiManagementMap({ mapId: "map-rm-ex", model });
}

function outcomeMap() {
  const model = composeNmiUnifiedManagementModel({
    modelId: "nmi-rm-out",
    contextId: "bca:ctx:plant",
    contextKind: "BUSINESS",
    nodes: [
      ref("ex:expand", "EXECUTION", "CC:11"),
      ref("out:otd", "OUTCOME", "CORE-OUT"),
    ],
    relationships: [rel("rel:obs", "out:otd", "ex:expand", "observed_by")],
  });
  return composeNmiManagementMap({ mapId: "map-rm-out", model });
}

function goalWithoutKpiMap() {
  const model = composeNmiUnifiedManagementModel({
    modelId: "nmi-rm-goal",
    contextId: "bca:ctx:plant",
    contextKind: "BUSINESS",
    businessProjectRef: ref("org:plant", "BUSINESS_PROJECT", "BCA:1"),
    nodes: [ref("goal:otd", "GOAL", "MO:1")],
  });
  return composeNmiManagementMap({ mapId: "map-rm-goal", model });
}

test("NMI:4 verifies on NMI:1–3 without starting NMI:5", () => {
  assert.equal(verifyNmiRelationshipIntelligence().ok, true);
  assert.equal(verifyNmiDecisionRoadmap().ok, true);
  assert.equal(NMI_FOUNDATION_CONTRACT.decisionRoadmapImplemented, false);
  assert.equal(NMI_RELATIONSHIP_INTELLIGENCE_CONTRACT.startsNmi4, false);
  assert.equal(NMI_DECISION_ROADMAP_CONTRACT.startsNmi5, false);
  assert.equal(nmiDecisionRoadmapIdentity, "NPA-T NMI:4/DecisionRoadmapIntelligence");
});

test("roadmaps from Goal, Problem, Scenario, Decision, and Execution anchors stay separate", () => {
  const fromGoal = composeNmiDecisionRoadmap({ roadmapId: "rm-goal", map: issueMap(), anchorNodeId: "goal:otd" });
  const fromProblem = composeNmiDecisionRoadmap({
    roadmapId: "rm-problem",
    map: issueMap(),
    anchorNodeId: "problem:capacity",
  });
  const fromScenario = composeNmiDecisionRoadmap({
    roadmapId: "rm-sc",
    map: scenarioMap(false),
    anchorNodeId: "sc:temp",
  });
  const fromDecision = composeNmiDecisionRoadmap({
    roadmapId: "rm-dec",
    map: decisionMap(),
    anchorNodeId: "dec:external",
  });
  const fromExecution = composeNmiDecisionRoadmap({
    roadmapId: "rm-ex",
    map: executionMap(),
    anchorNodeId: "ex:expand",
  });
  assert.equal(fromGoal.anchorRef.id, "goal:otd");
  assert.equal(fromProblem.anchorRef.id, "problem:capacity");
  assert.equal(fromScenario.anchorRef.id, "sc:temp");
  assert.equal(fromDecision.anchorRef.id, "dec:external");
  assert.equal(fromExecution.anchorRef.id, "ex:expand");
  assert.notEqual(fromGoal.roadmapId, fromProblem.roadmapId);
  assert.ok(idsOf(fromGoal, "GOAL").includes("goal:otd"));
  assert.ok(idsOf(fromProblem, "ISSUE").includes("problem:capacity"));
  assert.ok(idsOf(fromScenario, "SCENARIO").includes("sc:temp"));
  assert.ok(idsOf(fromDecision, "DECISION").includes("dec:external"));
  assert.ok(idsOf(fromExecution, "EXECUTION").includes("ex:expand"));
  assert.equal(fromGoal.anchorRef.authority, "MO:1");
});

test("branching scenarios are preserved; comparison converges only when canonical", () => {
  const branched = composeNmiDecisionRoadmap({
    roadmapId: "rm-branch",
    map: scenarioMap(false),
    anchorNodeId: "problem:capacity",
  });
  assert.equal(idsOf(branched, "SCENARIO").length, 3);
  assert.equal(branched.branches[0]?.prefersScenario, false);
  assert.equal(statusOf(branched, "COMPARISON"), "MISSING");
  assert.equal(statusOf(branched, "DECISION"), "NOT_REACHED");
  assert.equal(branched.convergences.some((item) => item.toStage === "COMPARISON"), false);
  const compared = composeNmiDecisionRoadmap({
    roadmapId: "rm-cmp",
    map: scenarioMap(true),
    anchorNodeId: "problem:capacity",
    comparisonRefs: [
      {
        comparisonId: "cmp:capacity",
        authority: "DS:7:8 Scenario Comparison Foundation",
        scenarioIds: ["sc:temp", "sc:external", "sc:none"],
        sourceRef: "cmp:capacity",
      },
    ],
  });
  assert.equal(statusOf(compared, "COMPARISON"), "PRESENT");
  assert.equal(statusOf(compared, "DECISION"), "NOT_REACHED");
  assert.ok(compared.convergences.some((item) => item.toStage === "COMPARISON" && item.canonical));
  assert.equal(NMI_DECISION_ROADMAP_CONTRACT.comparisonImpliesApproval, false);
  assert.equal(NMI_DECISION_ROADMAP_CONTRACT.scenarioImpliesDecision, false);
});

test("missing KPI, unresolved evidence, and ANALYSIS do not imply causality", () => {
  const missingKpi = composeNmiDecisionRoadmap({
    roadmapId: "rm-nokpi",
    map: goalWithoutKpiMap(),
    anchorNodeId: "goal:otd",
  });
  assert.equal(statusOf(missingKpi, "KPI_DATA"), "MISSING");
  const issue = composeNmiDecisionRoadmap({
    roadmapId: "rm-issue",
    map: issueMap(),
    anchorNodeId: "problem:capacity",
  });
  assert.equal(statusOf(issue, "KPI_DATA"), "UNRESOLVED");
  const analysis = issue.stages.find((item) => item.stage === "ANALYSIS");
  assert.equal(analysis?.status, "PARTIAL");
  assert.equal(analysis?.elements[0]?.knowledgeKind, "ANALYTICAL_RELATIONSHIP");
  assert.notEqual(analysis?.elements[0]?.knowledgeKind, "SUPPORTED_CAUSAL_RELATIONSHIP");
  assert.equal(issue.createsCausalCertainty, false);
  assert.equal(NMI_DECISION_ROADMAP_CONTRACT.analysisImpliesCausality, false);
  assert.equal(VAI_CAUSAL_SAFETY_BOUNDARY.correlationEqualsCausation, false);
});

test("Decision, Execution, Outcome, and Learning do not collapse forward", () => {
  const decided = composeNmiDecisionRoadmap({
    roadmapId: "rm-dec-only",
    map: decisionMap(),
    anchorNodeId: "dec:external",
  });
  assert.equal(statusOf(decided, "DECISION"), "PRESENT");
  assert.equal(statusOf(decided, "EXECUTION"), "NOT_REACHED");
  assert.notEqual(statusOf(decided, "EXECUTION"), "MISSING");
  const executing = composeNmiDecisionRoadmap({
    roadmapId: "rm-ex-only",
    map: executionMap(),
    anchorNodeId: "ex:expand",
  });
  assert.equal(statusOf(executing, "EXECUTION"), "PRESENT");
  assert.equal(statusOf(executing, "OUTCOME"), "NOT_REACHED");
  const observed = composeNmiDecisionRoadmap({
    roadmapId: "rm-out-only",
    map: outcomeMap(),
    anchorNodeId: "out:otd",
  });
  assert.equal(statusOf(observed, "OUTCOME"), "PRESENT");
  assert.equal(statusOf(observed, "LEARNING_REASSESSMENT"), "NOT_REACHED");
  const singleScenario = composeNmiDecisionRoadmap({
    roadmapId: "rm-one-sc",
    map: composeNmiManagementMap({
      mapId: "map-one-sc",
      model: composeNmiUnifiedManagementModel({
        modelId: "nmi-one-sc",
        contextId: "bca:ctx:plant",
        contextKind: "BUSINESS",
        nodes: [ref("problem:capacity", "PROBLEM", "MO:1"), ref("sc:temp", "SCENARIO", "CC:9")],
        relationships: [rel("rel:sc-temp", "sc:temp", "problem:capacity", "addresses")],
      }),
    }),
    anchorNodeId: "problem:capacity",
  });
  assert.equal(statusOf(singleScenario, "COMPARISON"), "NOT_APPLICABLE");
});

test("current position and possible next stages are descriptive only", () => {
  const issue = composeNmiDecisionRoadmap({
    roadmapId: "rm-pos-issue",
    map: issueMap(),
    anchorNodeId: "problem:capacity",
  });
  assert.equal(issue.currentPosition.primary, "ISSUE");
  assert.equal(issue.currentPosition.secondary, "ANALYSIS");
  assert.equal(issue.currentPosition.descriptive, true);
  assert.equal(issue.currentPosition.advancesCanonicalWorkflow, false);
  assert.equal(issue.requiredAction, false);
  assert.ok(issue.possibleNextStages.some((item) => item.stage === "SCENARIO"));
  assert.ok(issue.possibleNextStages.every((item) => item.requiredAction === false && item.descriptive === true));

  const scenarios = composeNmiDecisionRoadmap({
    roadmapId: "rm-pos-sc",
    map: scenarioMap(true),
    anchorNodeId: "problem:capacity",
    comparisonRefs: [
      {
        comparisonId: "cmp:capacity",
        authority: "DS:7:8 Scenario Comparison Foundation",
        scenarioIds: ["sc:temp", "sc:external", "sc:none"],
        sourceRef: "cmp:capacity",
      },
    ],
  });
  assert.equal(scenarios.currentPosition.primary, "SCENARIO");
  assert.equal(scenarios.currentPosition.secondary, "COMPARISON");

  const decided = composeNmiDecisionRoadmap({
    roadmapId: "rm-pos-dec",
    map: decisionMap(),
    anchorNodeId: "dec:external",
  });
  assert.equal(decided.currentPosition.primary, "DECISION");
  assert.ok(decided.possibleNextStages.some((item) => item.stage === "EXECUTION"));

  const executing = composeNmiDecisionRoadmap({
    roadmapId: "rm-pos-ex",
    map: executionMap(),
    anchorNodeId: "ex:expand",
  });
  assert.equal(executing.currentPosition.primary, "EXECUTION");

  const observed = composeNmiDecisionRoadmap({
    roadmapId: "rm-pos-out",
    map: outcomeMap(),
    anchorNodeId: "out:otd",
  });
  assert.equal(observed.currentPosition.primary, "OUTCOME");
});

test("explainability, projection, RMS/Gate/UI isolation", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id);
  const roadmap = composeNmiDecisionRoadmap({
    roadmapId: "rm-explain",
    map: issueMap(),
    anchorNodeId: "problem:capacity",
  });
  const explanation = explainNmiDecisionRoadmap(roadmap);
  assert.ok(explanation.about.includes("problem:capacity"));
  assert.ok(explanation.goalIds.includes("goal:otd"));
  assert.ok(explanation.issueIds.includes("problem:capacity"));
  assert.equal(explanation.comparisonOccurred, false);
  assert.equal(explanation.mutatesAdvisor, false);
  assert.ok(explanation.unknown.some((item) => item.includes("SCENARIO")));
  const projection = projectNmiDecisionRoadmap(roadmap);
  assert.ok(projection.lines.some((line) => line.includes("Capacity Gap") || line.includes("problem:capacity")));
  assert.ok(projection.lines.some((line) => line.includes("analytical; not confirmed cause")));
  assert.equal(projection.mutatesQueue, false);
  assert.equal(projection.mutatesStage, false);
  assert.ok(roadmap.gaps.some((gap) => gap.requiresAttention === false));
  const sealed = rejectSealedRmsRoadmapFact("rms:ground-truth:machine-3-failing");
  assert.equal(sealed.known, false);
  assert.equal(sealed.readsSealedRmsGroundTruth, false);
  assert.equal(roadmap.readsSealedRmsGroundTruth, false);
  assert.equal(NMI_RMS_BOUNDARY.rmsWritesNmiTruth, false);
  assert.equal(RMS_NEXORA_PARTICIPANT_CONTRACT.groundTruthAccess, "FORBIDDEN");
  assert.equal(NMI_GATE_BOUNDARY.nmiGate, false);
  assert.equal(NMI_GATE_BOUNDARY.gateApi, realDataIntegrationFoundationIdentity);
  assert.equal(NMI_DECISION_ROADMAP_GATE_FLOW[6], "NMI_DECISION_ROADMAP");
  assert.equal(roadmap.mutatesObjects, false);
  assert.equal(roadmap.mutatesQueue, false);
  assert.equal(roadmap.mutatesStage, false);
  assert.equal(roadmap.projectsOntoStage, false);
  assert.equal(roadmap.decidesAttention, false);
  assert.equal(executiveStageQueueFoundationIdentity, "STAGE-PROD:1/ExecutiveStageQueueFoundation");
  assert.equal(NMI_AUTHORITY_BOUNDARY.advisor, "CC:5 / NXA / NCA / ECA presentation");
  assert.equal(VAI_AUTHORITY_BOUNDARY.decision, "CC:10");
  assert.equal(verifyRmsFoundation().ok, true);
  assert.ok(roadmap.compositionProvenance.includes("nmi:map:map-rm-issue"));
  assert.deepEqual(getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id), catalog);
});
