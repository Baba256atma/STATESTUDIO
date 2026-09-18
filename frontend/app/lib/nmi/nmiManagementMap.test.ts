/**
 * NPA-T NMI:2 — Business/Project Management Map tests.
 * Read projection only. Does not start NMI:3 or redesign Queue.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { BUSINESS_PROJECT_CONTEXT_BOUNDARY } from "@/app/lib/business-context-awareness/businessProjectContextContract.ts";
import { realDataIntegrationFoundationIdentity } from "@/app/lib/data-reality/realDataIntegrationFoundation.ts";
import { getDefaultNexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { verifyRmsFoundation } from "@/app/lib/rms/rmsFoundation.ts";
import { executiveStageQueueFoundationIdentity } from "@/app/lib/spatial-presentation/executiveStageQueueFoundation.ts";
import { VAI_AUTHORITY_BOUNDARY } from "@/app/lib/vai/vaiAuthorityBoundary.ts";
import { NMI_AUTHORITY_BOUNDARY } from "./nmiAuthorityBoundary.ts";
import { NMI_FOUNDATION_CONTRACT, type NmiCanonicalRef } from "./nmiContract.ts";
import { composeNmiUnifiedManagementModel, verifyNmiFoundation } from "./nmiFoundation.ts";
import { NMI_GATE_BOUNDARY } from "./nmiGateBoundary.ts";
import { NMI_CAUSAL_EVIDENCE_SAFETY, type NmiManagementRelationship } from "./nmiRelationshipContract.ts";
import { extractNmiManagementBranch } from "./nmiManagementMapBranch.ts";
import { composeNmiManagementMap } from "./nmiManagementMapCompose.ts";
import {
  NMI_MANAGEMENT_MAP_CONTRACT,
  NMI_MANAGEMENT_MAP_GATE_FLOW,
  NMI_MANAGEMENT_MAP_SECTIONS,
} from "./nmiManagementMapContract.ts";
import { verifyNmiManagementMap } from "./nmiManagementMapFoundation.ts";
import { nmiManagementMapIdentity } from "./nmiManagementMapIdentity.ts";
import { projectNmiManagementMap } from "./nmiManagementMapProjection.ts";

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

const plantNodes = [
  ref("goal:otd", "GOAL", "MO:1"),
  ref("proc:production", "PROCESS", "BCA:4"),
  ref("kpi:otd", "KPI", "KPI"),
  ref("data:otd", "DATA_EVIDENCE", "P0:1"),
  ref("problem:capacity", "PROBLEM", "MO:1"),
  ref("risk:overtime", "RISK", "MO:1"),
  ref("vai:capacity", "VARIABLE", "VAI:1"),
  ref("vai:staffing", "VARIABLE", "VAI:1"),
  ref("vai:downtime", "VARIABLE", "VAI:1"),
  ref("sc:temp", "SCENARIO", "CC:9"),
  ref("sc:external", "SCENARIO", "CC:9"),
  ref("proc:disconnected", "PROCESS", "BCA:4"),
];

const plantRelationships = [
  rel("rel:kpi-measures-goal", "kpi:otd", "goal:otd", "measures"),
  rel("rel:kpi-evidence", "kpi:otd", "data:otd", "evidenced_by"),
  rel("rel:problem-threatens", "problem:capacity", "goal:otd", "threatens"),
  rel("rel:process-supports", "proc:production", "goal:otd", "supports"),
  rel("rel:var-capacity", "vai:capacity", "problem:capacity", "affects", "ASSOCIATION"),
  rel("rel:var-staffing", "vai:staffing", "problem:capacity", "affects", "ASSOCIATION"),
  rel("rel:var-downtime", "vai:downtime", "problem:capacity", "affects", "ASSOCIATION"),
  rel("rel:sc-temp", "sc:temp", "problem:capacity", "addresses"),
  rel("rel:sc-external", "sc:external", "problem:capacity", "addresses"),
];

function businessModel() {
  return composeNmiUnifiedManagementModel({
    modelId: "nmi-business-plant",
    contextId: "bca:ctx:plant",
    contextKind: "BUSINESS",
    businessProjectRef: ref("org:plant", "BUSINESS_PROJECT", "BCA:1"),
    managerRoleRef: ref("role:ops", "MANAGER_ROLE", "BCA:1"),
    nodes: plantNodes,
    relationships: plantRelationships,
    unresolvedRelationshipIds: ["rel:goal-kpi-unresolved"],
    compositionProvenance: ["gate:rdi1", "data-reality:p0"],
  });
}

test("NMI:2 verifies on certified NMI:1 without starting NMI:3", () => {
  assert.equal(verifyNmiFoundation().ok, true);
  assert.equal(verifyNmiManagementMap().ok, true);
  assert.equal(NMI_FOUNDATION_CONTRACT.managementMapImplemented, false);
  assert.equal(NMI_MANAGEMENT_MAP_CONTRACT.startsNmi3, false);
  assert.equal(NMI_MANAGEMENT_MAP_CONTRACT.decisionRoadmapImplemented, false);
  assert.equal(nmiManagementMapIdentity, "NPA-T NMI:2/BusinessProjectManagementMap");
});

test("BUSINESS map composition preserves canonical IDs and sections", () => {
  const map = composeNmiManagementMap({
    mapId: "map-business",
    model: businessModel(),
    annotations: [
      { id: "goal:otd", title: "On-Time Delivery ≥ 96%" },
      { id: "proc:production", title: "Production" },
      { id: "kpi:otd", title: "OTD" },
      { id: "problem:capacity", title: "Capacity Gap" },
      { id: "data:otd", knownStatus: "UNRESOLVED" },
    ],
  });
  assert.equal(map.contextKind, "BUSINESS");
  assert.equal(map.nodes.find((node) => node.nodeId === "goal:otd")?.canonicalRef.id, "goal:otd");
  assert.equal(map.nodes.find((node) => node.nodeId === "goal:otd")?.section, "GOALS");
  assert.equal(map.nodes.find((node) => node.nodeId === "proc:production")?.section, "OPERATIONS");
  assert.equal(map.nodes.find((node) => node.nodeId === "kpi:otd")?.section, "KPI_DATA");
  assert.equal(map.nodes.find((node) => node.nodeId === "data:otd")?.section, "KPI_DATA");
  assert.equal(map.nodes.find((node) => node.nodeId === "data:otd")?.knownStatus, "UNRESOLVED");
  assert.equal(map.nodes.find((node) => node.nodeId === "problem:capacity")?.section, "PROBLEMS");
  assert.equal(map.nodes.find((node) => node.nodeId === "risk:overtime")?.section, "RISKS");
  assert.notEqual(
    map.sections.find((item) => item.section === "PROBLEMS")?.nodeIds[0],
    map.sections.find((item) => item.section === "RISKS")?.nodeIds[0],
  );
  assert.equal(map.nodes.find((node) => node.nodeId === "vai:capacity")?.analyticalRole, true);
  assert.equal(map.nodes.find((node) => node.nodeId === "vai:capacity")?.kind, "VARIABLE");
  assert.equal(map.sections.find((item) => item.section === "SCENARIOS")?.nodeIds.length, 2);
  assert.equal(map.sections.find((item) => item.section === "DECISIONS")?.empty, true);
  assert.equal(map.sections.find((item) => item.section === "EXECUTIONS")?.empty, true);
  assert.equal(map.sections.find((item) => item.section === "OUTCOMES")?.empty, true);
  assert.equal(map.sections.find((item) => item.section === "LEARNING")?.empty, true);
  assert.ok(map.disconnectedNodeIds.includes("proc:disconnected"));
  assert.ok(map.disconnectedNodeIds.includes("risk:overtime"));
  assert.deepEqual(map.unresolvedRelationshipIds, ["rel:goal-kpi-unresolved"]);
  assert.equal(map.hybridLanes, null);
  assert.deepEqual([...NMI_MANAGEMENT_MAP_SECTIONS], [...map.sections.map((item) => item.section)]);
});

test("PROJECT map composition supports decision without execution", () => {
  const model = composeNmiUnifiedManagementModel({
    modelId: "nmi-project",
    contextId: "bca:ctx:rollout",
    contextKind: "PROJECT",
    businessProjectRef: ref("project:rollout", "BUSINESS_PROJECT", "BCA:1"),
    nodes: [
      ref("goal:cutover", "GOAL", "MO:1"),
      ref("proc:cutover", "PROCESS", "BCA:4"),
      ref("risk:delay", "RISK", "MO:1"),
      ref("sc:phased", "SCENARIO", "CC:9"),
      ref("sc:bigbang", "SCENARIO", "CC:9"),
      ref("dec:phased", "DECISION", "CC:10"),
    ],
    relationships: [
      rel("rel:sc-eval", "sc:phased", "goal:cutover", "evaluated_by"),
      rel("rel:dec-selected", "dec:phased", "sc:phased", "selected_as"),
      rel("rel:risk-threatens", "risk:delay", "goal:cutover", "threatens"),
    ],
  });
  const map = composeNmiManagementMap({ mapId: "map-project", model });
  assert.equal(map.contextKind, "PROJECT");
  assert.equal(map.sections.find((item) => item.section === "DECISIONS")?.empty, false);
  assert.equal(map.sections.find((item) => item.section === "EXECUTIONS")?.empty, true);
  assert.equal(map.relationships.some((item) => item.kind === "executed_by"), false);
  assert.equal(map.nodes.find((node) => node.nodeId === "dec:phased")?.contextKind, "PROJECT");
});

test("HYBRID preservation does not flatten Business and Project lanes", () => {
  const model = composeNmiUnifiedManagementModel({
    modelId: "nmi-hybrid",
    contextId: "bca:ctx:hybrid",
    contextKind: "HYBRID",
    businessProjectRef: ref("hybrid:capacity", "BUSINESS_PROJECT", "BCA:1"),
    nodes: [ref("goal:otd", "GOAL", "MO:1"), ref("goal:cutover", "GOAL", "MO:1"), ref("shared:board", "GOAL", "MO:1")],
  });
  const map = composeNmiManagementMap({
    mapId: "map-hybrid",
    model,
    annotations: [
      { id: "goal:otd", contextKind: "BUSINESS", title: "OTD" },
      { id: "goal:cutover", contextKind: "PROJECT", title: "Cutover" },
      { id: "shared:board", contextKind: "HYBRID", title: "Board Goal" },
      { id: "hybrid:capacity", contextKind: "UNKNOWN" },
    ],
  });
  assert.equal(map.contextKind, "HYBRID");
  assert.equal(map.hybridLanes?.flattened, false);
  assert.deepEqual(map.hybridLanes?.businessNodeIds, ["goal:otd"]);
  assert.deepEqual(map.hybridLanes?.projectNodeIds, ["goal:cutover"]);
  assert.deepEqual(map.hybridLanes?.hybridNodeIds, ["shared:board"]);
  assert.ok(map.hybridLanes?.unknownNodeIds.includes("hybrid:capacity"));
  const projection = projectNmiManagementMap(map);
  assert.ok(projection.lines.includes("HYBRID"));
  assert.ok(projection.lines.some((line) => line.includes("Business context")));
  assert.ok(projection.lines.some((line) => line.includes("Project context")));
  const businessScope = composeNmiManagementMap({
    mapId: "map-hybrid-business",
    model,
    annotations: [
      { id: "goal:otd", contextKind: "BUSINESS" },
      { id: "goal:cutover", contextKind: "PROJECT" },
      { id: "shared:board", contextKind: "HYBRID" },
    ],
    scope: { kind: "ENTIRE_BUSINESS" },
  });
  assert.ok(businessScope.nodes.some((node) => node.nodeId === "goal:otd"));
  assert.ok(businessScope.nodes.some((node) => node.nodeId === "shared:board"));
  assert.equal(businessScope.nodes.some((node) => node.nodeId === "goal:cutover"), false);
});

test("UNKNOWN context remains UNKNOWN and is not guessed", () => {
  const model = composeNmiUnifiedManagementModel({
    modelId: "nmi-unknown",
    contextId: "bca:ctx:unknown",
    contextKind: "UNKNOWN",
    nodes: [ref("goal:maybe", "GOAL", "MO:1")],
  });
  const map = composeNmiManagementMap({ mapId: "map-unknown", model });
  assert.equal(map.contextKind, "UNKNOWN");
  assert.equal(map.nodes.find((node) => node.nodeId === "goal:maybe")?.contextKind, "UNKNOWN");
  assert.equal(map.hybridLanes, null);
  assert.equal(BUSINESS_PROJECT_CONTEXT_BOUNDARY.ownsContextInterpretation, true);
});

test("execution without outcome and missing learning remain missing", () => {
  const model = composeNmiUnifiedManagementModel({
    modelId: "nmi-exec",
    contextId: "bca:ctx:plant",
    contextKind: "BUSINESS",
    nodes: [
      ref("dec:temp", "DECISION", "CC:10"),
      ref("ex:temp", "EXECUTION", "CC:11"),
      ref("out:temp", "OUTCOME", "CORE-OUT"),
    ],
    relationships: [rel("rel:exec", "ex:temp", "dec:temp", "executed_by"), rel("rel:obs", "out:temp", "ex:temp", "observed_by")],
  });
  const map = composeNmiManagementMap({ mapId: "map-exec", model });
  assert.equal(map.sections.find((item) => item.section === "EXECUTIONS")?.empty, false);
  assert.equal(map.sections.find((item) => item.section === "OUTCOMES")?.empty, false);
  assert.equal(map.sections.find((item) => item.section === "LEARNING")?.empty, true);
  const beforeOutcome = composeNmiManagementMap({
    mapId: "map-exec-only",
    model: composeNmiUnifiedManagementModel({
      modelId: "nmi-exec-only",
      contextId: "bca:ctx:plant",
      contextKind: "BUSINESS",
      nodes: [ref("dec:temp", "DECISION", "CC:10"), ref("ex:temp", "EXECUTION", "CC:11")],
      relationships: [rel("rel:exec", "ex:temp", "dec:temp", "executed_by")],
    }),
  });
  assert.equal(beforeOutcome.sections.find((item) => item.section === "OUTCOMES")?.empty, true);
});

test("unsupported relationships are not invented", () => {
  const model = composeNmiUnifiedManagementModel({
    modelId: "nmi-no-invent",
    contextId: "bca:ctx:plant",
    contextKind: "BUSINESS",
    nodes: [ref("goal:otd", "GOAL", "MO:1"), ref("vai:capacity", "VARIABLE", "VAI:1")],
  });
  const map = composeNmiManagementMap({ mapId: "map-no-invent", model });
  assert.equal(map.relationships.length, 0);
  assert.equal(map.fabricatesMissingEdges, false);
  assert.equal(map.nodes.find((node) => node.nodeId === "goal:otd")?.relationshipIds.length, 0);
});

test("bounded branch extraction is deterministic and cycle-safe", () => {
  const map = composeNmiManagementMap({ mapId: "map-branch", model: businessModel() });
  const branch = extractNmiManagementBranch(map, { originNodeId: "problem:capacity", maxDepth: 3 });
  const again = extractNmiManagementBranch(map, { originNodeId: "problem:capacity", maxDepth: 3 });
  assert.equal(branch.originPresent, true);
  assert.deepEqual(
    branch.nodes.map((node) => node.nodeId),
    again.nodes.map((node) => node.nodeId),
  );
  assert.ok(branch.nodes.some((node) => node.nodeId === "goal:otd"));
  assert.ok(branch.nodes.some((node) => node.nodeId === "kpi:otd"));
  assert.ok(branch.nodes.some((node) => node.nodeId === "vai:capacity"));
  assert.ok(branch.nodes.some((node) => node.nodeId === "sc:temp"));
  assert.equal(branch.inventedNodes, false);
  assert.equal(branch.createsCausalCertainty, false);
  assert.equal(branch.cycleEncountered, false);

  const cyclicModel = composeNmiUnifiedManagementModel({
    modelId: "nmi-cycle",
    contextId: "bca:ctx:plant",
    contextKind: "BUSINESS",
    nodes: [ref("a", "VARIABLE", "VAI:1"), ref("b", "VARIABLE", "VAI:1"), ref("c", "VARIABLE", "VAI:1")],
    relationships: [
      rel("rel:ab", "a", "b", "affects", "ASSOCIATION"),
      rel("rel:bc", "b", "c", "affects", "ASSOCIATION"),
      rel("rel:ca", "c", "a", "affects", "ASSOCIATION"),
    ],
  });
  const cyclic = extractNmiManagementBranch(composeNmiManagementMap({ mapId: "map-cycle", model: cyclicModel }), {
    originNodeId: "a",
    maxDepth: 8,
  });
  assert.equal(cyclic.cycleEncountered, true);
  assert.equal(cyclic.nodes.length, 3);
  const shallow = extractNmiManagementBranch(map, { originNodeId: "problem:capacity", maxDepth: 1 });
  assert.equal(shallow.truncatedByDepth, true);
  assert.equal(shallow.nodes.some((node) => node.nodeId === "data:otd"), false);
});

test("unresolved evidence and association are not upgraded", () => {
  const map = composeNmiManagementMap({
    mapId: "map-causal",
    model: businessModel(),
    annotations: [{ id: "data:otd", knownStatus: "UNRESOLVED" }],
  });
  const assoc = map.relationships.find((item) => item.relationshipId === "rel:var-capacity");
  assert.equal(assoc?.epistemicStatus, "ASSOCIATION");
  assert.equal(assoc?.causal, false);
  assert.equal(map.createsCausalCertainty, false);
  assert.equal(map.nodes.find((node) => node.nodeId === "data:otd")?.knownStatus, "UNRESOLVED");
  assert.equal(NMI_CAUSAL_EVIDENCE_SAFETY.correlationToCausation, false);
  assert.equal(NMI_CAUSAL_EVIDENCE_SAFETY.associationToConfirmedDriver, false);
});

test("manager-readable projection derives from current state without mutating Queue or Stage", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id);
  const map = composeNmiManagementMap({
    mapId: "map-projection",
    model: businessModel(),
    annotations: [{ id: "goal:otd", title: "On-Time Delivery ≥ 96%" }],
  });
  const projection = projectNmiManagementMap(map);
  assert.equal(projection.lines[0], "BUSINESS");
  assert.ok(projection.lines.some((line) => line.includes("On-Time Delivery ≥ 96%")));
  assert.ok(projection.lines.some((line) => line.includes("Decisions")));
  assert.ok(projection.lines.some((line) => line.includes("[none]")));
  assert.ok(projection.lines.some((line) => line.includes("[analytical]")));
  assert.equal(projection.mutatesQueue, false);
  assert.equal(projection.mutatesStage, false);
  assert.equal(map.mutatesObjects, false);
  assert.equal(map.bypassesGate, false);
  assert.equal(map.writesDataReality, false);
  assert.equal(NMI_GATE_BOUNDARY.nmiGate, false);
  assert.equal(NMI_GATE_BOUNDARY.gateApi, realDataIntegrationFoundationIdentity);
  assert.deepEqual([...NMI_MANAGEMENT_MAP_GATE_FLOW.slice(0, 4)], [...NMI_GATE_BOUNDARY.flow]);
  assert.equal(NMI_MANAGEMENT_MAP_GATE_FLOW[4], "NMI_MANAGEMENT_MAP");
  assert.equal(executiveStageQueueFoundationIdentity, "STAGE-PROD:1/ExecutiveStageQueueFoundation");
  assert.equal(NMI_AUTHORITY_BOUNDARY.queue, "existing executive Queue (unchanged)");
  assert.equal(NMI_AUTHORITY_BOUNDARY.advisor, "CC:5 / NXA / NCA / ECA presentation");
  assert.equal(NMI_MANAGEMENT_MAP_CONTRACT.parallelAdvisor, false);
  assert.equal(NMI_MANAGEMENT_MAP_CONTRACT.redesignsQueue, false);
  assert.deepEqual(getDefaultNexoraMVPObjectInteractionCatalog().objects.map((item) => item.id), catalog);
  assert.equal(verifyRmsFoundation().ok, true);
  assert.equal(VAI_AUTHORITY_BOUNDARY.scenario, "CC:9");
  assert.equal(map.sourceModel.mutatesStage, false);
  assert.equal(map.sourceModel.futureProjections.managementMap, false);
});
