import { readFileSync } from "node:fs";
import { join } from "node:path";
import { performance } from "node:perf_hooks";

import type { NexoraRelationship } from "../../../lib/relationships/relationshipTypes.ts";
import {
  getRelationshipRenderPlan,
  resolveExecutiveRelationshipScenePlan,
} from "../../../lib/relationships/executive/resolveExecutiveRelationshipScenePlan.ts";
import { resetExecutiveRelationshipInstrumentationForTests } from "../../../lib/relationships/executive/executiveRelationshipInstrumentation.ts";
import { resetRelationshipDensityForTests } from "../../../lib/relationships/executive/relationshipDensityRuntime.ts";
import {
  readValidatedSceneRelationshipsForRender,
  resetRelationshipRendererRuntimeForTests,
  resolveRelationshipLineVisualReaction,
} from "../../../lib/relationships/relationshipRendererRuntime.ts";
import {
  approveWorkspaceModelFromDraft,
  resetWorkspaceModelsForTests,
} from "../../../lib/workspace/workspaceApprovedModelContract.ts";
import {
  createWorkspaceSceneFromApprovedModel,
  resetWorkspaceScenesForTests,
} from "../../../lib/workspace/workspaceSceneCreationContract.ts";
import type { WorkspaceDomainSelection } from "../../../lib/workspace/workspaceDomainContract.ts";
import {
  createSuggestedGoal,
  getGoalSuggestionsForDomain,
  type WorkspaceGoal,
} from "../../../lib/workspace/workspaceGoalContract.ts";
import {
  generateWorkspaceDraftModel,
  resetWorkspaceDraftModelsForTests,
  saveWorkspaceDraftModel,
} from "../../../lib/workspace/workspaceDraftModelContract.ts";
import type { WorkspaceSituationContext } from "../../../lib/workspace/workspaceSituationContract.ts";
import {
  createWorkspaceRelationshipsFromApprovedModel,
  getWorkspaceDiscoveredRelationships,
  getWorkspaceRelationshipDiscovery,
  resetWorkspaceRelationshipsForTests,
} from "../../../lib/workspace/workspaceRelationshipDiscoveryContract.ts";
import {
  clampRelationshipFlowBallCount,
  resolveRelationshipFlowBallConfig,
  shouldShowRelationshipFlowBalls,
} from "./relationshipFlowRuntime.ts";
import {
  REL_UX3_CERTIFICATION_COMPLETE_DIAGNOSTIC,
  REL_UX3_CERTIFICATION_GATE_TITLES,
  REL_UX3_CERTIFICATION_TAGS,
  REL_UX3_CERTIFICATION_VERSION,
  type RelationshipVisualizationCertificationGate,
  type RelationshipVisualizationCertificationInput,
  type RelationshipVisualizationCertificationResult,
  type RelationshipVisualizationCertificationScenario,
} from "./relationshipVisualizationCertificationContract.ts";

const FRONTEND_ROOT = process.cwd();
const STRESS_PLAN_BUDGET_MS = 500;
const MEMORY_LOOP_ITERATIONS = 120;

function readSource(relativePath: string): string {
  return readFileSync(join(FRONTEND_ROOT, relativePath), "utf8");
}

function gate(
  id: RelationshipVisualizationCertificationGate["id"],
  failures: readonly string[]
): RelationshipVisualizationCertificationGate {
  return Object.freeze({
    id,
    name: REL_UX3_CERTIFICATION_GATE_TITLES[id],
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail: failures.length === 0 ? `${REL_UX3_CERTIFICATION_GATE_TITLES[id]} certified.` : failures.join("; "),
  });
}

function scenario(
  id: RelationshipVisualizationCertificationScenario["id"],
  name: string,
  failures: readonly string[]
): RelationshipVisualizationCertificationScenario {
  return Object.freeze({
    id,
    name,
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail: failures.length === 0 ? `${name} stable.` : failures.join("; "),
  });
}

function buildRelationship(
  id: string,
  sourceId: string,
  targetId: string,
  strength = 0.5
): NexoraRelationship {
  return Object.freeze({
    id,
    sourceId,
    targetId,
    type: "dependency",
    direction: "uni",
    createdAt: "2026-06-20T00:00:00.000Z",
    metadata: Object.freeze({ strength }),
  });
}

function buildStressRelationships(count: number): readonly NexoraRelationship[] {
  const relationships: NexoraRelationship[] = [];
  for (let index = 0; index < count; index += 1) {
    relationships.push(
      buildRelationship(`rel_${index}`, "obj_hub", `obj_spoke_${index}`, 0.35 + (index % 5) * 0.12)
    );
  }
  return Object.freeze(relationships);
}

function buildSceneWithRelationships(relationshipCount: number) {
  const relationships = buildStressRelationships(relationshipCount);
  const objects = [
    { id: "obj_hub" },
    ...Array.from({ length: relationshipCount }, (_, index) => ({ id: `obj_spoke_${index}` })),
  ];
  return {
    sceneJson: {
      scene: {
        objects,
        relationships: [...relationships],
      },
    },
    objects,
    relationships,
  };
}

function sourceContainsForbiddenPatterns(source: string, patterns: readonly string[]): string[] {
  return patterns.filter((pattern) => source.includes(pattern));
}

function resetCertificationStores(): void {
  resetRelationshipRendererRuntimeForTests();
  resetExecutiveRelationshipInstrumentationForTests();
  resetRelationshipDensityForTests();
  resetWorkspaceDraftModelsForTests();
  resetWorkspaceModelsForTests();
  resetWorkspaceScenesForTests();
  resetWorkspaceRelationshipsForTests();
}

function domain(workspaceId: string): WorkspaceDomainSelection {
  return Object.freeze({
    contractVersion: "NW-B:2",
    workspaceId,
    domainId: "finance",
    domainName: "Finance",
    selectedAt: "2026-06-20T00:00:00.000Z",
  });
}

function situation(workspaceId: string): WorkspaceSituationContext {
  return Object.freeze({
    contractVersion: "NW-B:3",
    workspaceId,
    domainId: "finance",
    situationText: "Operational dependency pressure across supplier and product nodes.",
    createdAt: "2026-06-20T00:00:00.000Z",
    updatedAt: "2026-06-20T00:00:00.000Z",
  });
}

function goals(workspaceId: string): readonly WorkspaceGoal[] {
  const suggestion = getGoalSuggestionsForDomain("finance")[0];
  if (!suggestion) return [];
  return Object.freeze([createSuggestedGoal({ workspaceId, suggestion })]);
}

function approveFinanceWorkspace(workspaceId: string): void {
  const draft = saveWorkspaceDraftModel(
    generateWorkspaceDraftModel({
      workspaceId,
      domain: domain(workspaceId),
      situation: situation(workspaceId),
      goals: goals(workspaceId),
      generatedAt: "2026-06-20T00:00:00.000Z",
    })
  );
  approveWorkspaceModelFromDraft({
    draft,
    approvedAt: "2026-06-20T00:00:00.000Z",
  });
}

function measureScenePlanMs(relationships: readonly NexoraRelationship[], selectedObjectId: string): number {
  const started = performance.now();
  resolveExecutiveRelationshipScenePlan({
    relationships: [...relationships],
    selectedObjectId,
  });
  return performance.now() - started;
}

function countVisibleRelationships(
  relationships: readonly NexoraRelationship[],
  selectedObjectId: string
): number {
  const plan = resolveExecutiveRelationshipScenePlan({
    relationships: [...relationships],
    selectedObjectId,
  });
  return relationships.filter((relationship) => getRelationshipRenderPlan(plan, relationship.id)?.visible).length;
}

function countFlowBallInstances(
  relationships: readonly NexoraRelationship[],
  selectedObjectId: string
): number {
  const plan = resolveExecutiveRelationshipScenePlan({
    relationships: [...relationships],
    selectedObjectId,
  });
  let total = 0;
  for (const relationship of relationships) {
    const renderPlan = getRelationshipRenderPlan(plan, relationship.id);
    if (
      !renderPlan?.visible ||
      !shouldShowRelationshipFlowBalls({
        selectedObjectId,
        focusRole: renderPlan.focusRole,
      })
    ) {
      continue;
    }
    total += clampRelationshipFlowBallCount(
      resolveRelationshipFlowBallConfig(relationship.metadata?.strength as number ?? 0.5).ballCount
    );
  }
  return total;
}

export function certifyRelationshipVisualization(
  input: RelationshipVisualizationCertificationInput = {}
): RelationshipVisualizationCertificationResult {
  resetCertificationStores();

  const gates: RelationshipVisualizationCertificationGate[] = [];
  const scenarios: RelationshipVisualizationCertificationScenario[] = [];
  const evidence: string[] = [];

  const relationshipRendererSource = readSource("app/components/scene/relationships/RelationshipRenderer.tsx");
  const relationshipLineSource = readSource("app/components/scene/relationships/RelationshipLine.tsx");
  const relationshipFlowSource = readSource("app/components/scene/relationships/relationshipFlowRuntime.ts");
  const sceneSyncSource = readSource("app/lib/workspace/workspaceRelationshipSceneSyncContract.ts");
  const relationshipScopeSource = `${relationshipRendererSource}\n${relationshipLineSource}\n${relationshipFlowSource}`;

  const fiftyScene = buildSceneWithRelationships(50);
  const hundredScene = buildSceneWithRelationships(100);
  const fiftyValidated = readValidatedSceneRelationshipsForRender(
    fiftyScene.sceneJson,
    fiftyScene.objects
  );
  const hundredValidated = readValidatedSceneRelationshipsForRender(
    hundredScene.sceneJson,
    hundredScene.objects
  );

  const objectClickPlan = resolveExecutiveRelationshipScenePlan({
    relationships: [...fiftyScene.relationships],
    selectedObjectId: "obj_hub",
  });
  const connectedPlan = getRelationshipRenderPlan(objectClickPlan, "rel_0");
  const unrelatedProbe = resolveExecutiveRelationshipScenePlan({
    relationships: [
      buildRelationship("rel_connected", "obj_hub", "obj_spoke_0"),
      buildRelationship("rel_unrelated", "obj_x", "obj_y"),
    ],
    selectedObjectId: "obj_hub",
  });
  const unrelatedPlan = getRelationshipRenderPlan(unrelatedProbe, "rel_unrelated");
  const connectedReaction = resolveRelationshipLineVisualReaction({
    relationshipId: "rel_connected",
    selectedObjectId: "obj_hub",
    renderPlan: getRelationshipRenderPlan(unrelatedProbe, "rel_connected"),
  });
  const unrelatedReaction = resolveRelationshipLineVisualReaction({
    relationshipId: "rel_unrelated",
    selectedObjectId: "obj_hub",
    renderPlan: unrelatedPlan,
  });

  const fiftyPlanMs = measureScenePlanMs(fiftyScene.relationships, "obj_hub");
  const hundredPlanMs = measureScenePlanMs(hundredScene.relationships, "obj_hub");
  const fiftyVisible = countVisibleRelationships(fiftyScene.relationships, "obj_hub");
  const hundredVisible = countVisibleRelationships(hundredScene.relationships, "obj_hub");
  const hundredFlowBalls = countFlowBallInstances(hundredScene.relationships, "obj_hub");

  scenarios.push(
    scenario("fifty_relationship_stress", "50 relationship stress test", [
      fiftyValidated.length === 50 ? "" : `Expected 50 validated relationships, got ${fiftyValidated.length}`,
      fiftyVisible === 50 ? "" : `Expected 50 visible relationships on object click, got ${fiftyVisible}`,
      fiftyPlanMs <= STRESS_PLAN_BUDGET_MS ? "" : `50-relationship plan exceeded ${STRESS_PLAN_BUDGET_MS}ms (${fiftyPlanMs.toFixed(2)}ms)`,
    ].filter(Boolean))
  );

  scenarios.push(
    scenario("hundred_relationship_stress", "100 relationship stress test", [
      hundredValidated.length === 100 ? "" : `Expected 100 validated relationships, got ${hundredValidated.length}`,
      hundredVisible === 100 ? "" : `Expected 100 visible relationships on object click, got ${hundredVisible}`,
      hundredPlanMs <= STRESS_PLAN_BUDGET_MS
        ? ""
        : `100-relationship plan exceeded ${STRESS_PLAN_BUDGET_MS}ms (${hundredPlanMs.toFixed(2)}ms)`,
    ].filter(Boolean))
  );

  scenarios.push(
    scenario("object_click_visual_response", "Object click instant visual response", [
      connectedPlan?.focusRole === "direct_dependency" ? "" : "Connected relationship missing direct_dependency focus",
      connectedPlan?.visible === true ? "" : "Connected relationship not visible on object click",
      connectedReaction.selected === true ? "" : "Connected relationship not marked selected",
      connectedReaction.emphasized === true ? "" : "Connected relationship not emphasized",
      unrelatedPlan?.visible === true ? "" : "Unrelated relationship hidden on object click",
      unrelatedReaction.selected === false ? "" : "Unrelated relationship incorrectly selected",
    ].filter(Boolean))
  );

  approveFinanceWorkspace("workspace_rel_viz_a");
  approveFinanceWorkspace("workspace_rel_viz_b");
  createWorkspaceSceneFromApprovedModel({ workspaceId: "workspace_rel_viz_a" });
  createWorkspaceRelationshipsFromApprovedModel({
    workspaceId: "workspace_rel_viz_a",
    createdAt: "2026-06-20T00:00:00.000Z",
  });
  const workspaceARelationships = getWorkspaceDiscoveredRelationships("workspace_rel_viz_a");
  const workspaceBRelationships = getWorkspaceDiscoveredRelationships("workspace_rel_viz_b");
  scenarios.push(
    scenario("workspace_switching_isolation", "Workspace switching isolation", [
      getWorkspaceRelationshipDiscovery("workspace_rel_viz_a") ? "" : "Workspace A discovery missing",
      getWorkspaceRelationshipDiscovery("workspace_rel_viz_b") === null ? "" : "Workspace B should stay isolated",
      workspaceARelationships.length > 0 ? "" : "Workspace A relationships missing",
      workspaceBRelationships.length === 0 ? "" : "Workspace B leaked relationships",
    ].filter(Boolean))
  );

  const perRelationshipBallCapBreached = Array.from({ length: 6 }, (_, index) =>
    clampRelationshipFlowBallCount(index)
  ).some((count, index) => count !== Math.min(5, Math.max(1, index)));
  scenarios.push(
    scenario("flow_ball_budget", "Flow ball performance budget", [
      perRelationshipBallCapBreached ? "Flow ball clamp exceeded max of 5" : "",
      hundredFlowBalls <= hundredScene.relationships.length * 5
        ? ""
        : `Flow ball instances exceeded per-relationship budget (${hundredFlowBalls})`,
      relationshipFlowSource.includes("MAX_FLOW_BALLS = 5") ? "" : "Flow runtime missing max ball guard",
      relationshipLineSource.includes("RelationshipFlowBalls") ? "" : "RelationshipLine missing flow ball renderer",
    ].filter(Boolean))
  );

  const selectionMutationPatterns = sourceContainsForbiddenPatterns(relationshipScopeSource, [
    "setSelectedObjectId",
    "setSelectedRelationshipId",
    "dispatchSelection",
  ]);

  gates.push(
    gate("A", [
      selectionMutationPatterns.length > 0
        ? `Relationship visualization mutates selection: ${selectionMutationPatterns.join(", ")}`
        : "",
      relationshipRendererSource.includes("selectedObjectId") ? "" : "Renderer missing selectedObjectId input",
      relationshipRendererSource.includes("resolveRelationshipLineVisualReaction")
        ? ""
        : "Renderer missing object-focus visual reaction wiring",
    ].filter(Boolean))
  );

  gates.push(
    gate("B", [
      relationshipLineSource.includes("resolveExecutiveObjectFocusVisuals")
        ? ""
        : "RelationshipLine missing executive object-focus visuals",
      relationshipLineSource.includes("* 2.5") ? "" : "Highlight thickness multiplier missing",
      relationshipLineSource.includes("opacity: 0.25") ? "" : "Unrelated dim opacity missing",
      connectedReaction.emphasized === true ? "" : "Connected relationship highlight reaction failed",
      unrelatedPlan?.visible === true ? "" : "Unrelated relationships not preserved visible",
    ].filter(Boolean))
  );

  gates.push(
    gate("C", [
      relationshipFlowSource.includes("shouldShowRelationshipFlowBalls") ? "" : "Flow visibility guard missing",
      relationshipFlowSource.includes("speedMultiplier: 2") ? "" : "Strength speed mapping missing",
      relationshipFlowSource.includes("ballCount: 5") ? "" : "Very strong ball count mapping missing",
      relationshipLineSource.includes("interpolateLinePoint") ? "" : "Flow interpolation wiring missing",
      /<Points\b/.test(relationshipScopeSource) ||
      relationshipScopeSource.includes("InstancedMesh") ||
      relationshipScopeSource.includes("ParticleSystem")
        ? "Flow visualization uses heavyweight particle primitives"
        : "",
    ].filter(Boolean))
  );

  gates.push(
    gate("D", [
      relationshipRendererSource.includes("resolveExecutiveRelationshipScenePlan")
        ? ""
        : "Renderer missing executive scene plan integration",
      relationshipRendererSource.includes("readValidatedSceneRelationshipsForRender")
        ? ""
        : "Renderer bypasses validated relationship reader",
      relationshipRendererSource.includes("RelationshipLine") ? "" : "Renderer missing RelationshipLine mount",
    ].filter(Boolean))
  );

  const reloadBefore = JSON.stringify(fiftyScene.sceneJson);
  readValidatedSceneRelationshipsForRender(fiftyScene.sceneJson, fiftyScene.objects);
  gates.push(
    gate("E", [
      JSON.stringify(fiftyScene.sceneJson) === reloadBefore ? "" : "Scene payload mutated during render read",
      relationshipRendererSource.includes("relationships.length === 0") ? "" : "Renderer missing empty-state guard",
    ].filter(Boolean))
  );

  gates.push(
    gate("F", [
      sourceContainsForbiddenPatterns(relationshipScopeSource, [
        "topology",
        "mutateTopology",
        "updateTopology",
      ]).length > 0
        ? "Relationship visualization references topology mutation"
        : "",
    ].filter(Boolean))
  );

  gates.push(
    gate("G", [
      sourceContainsForbiddenPatterns(relationshipScopeSource, [
        "syncWorkspaceRelationshipsToScene",
        "adaptSceneRelationshipToNexoraRelationship",
        "writeWorkspaceSceneJson",
      ]).length > 0
        ? "Relationship visualization mutates scene sync"
        : "",
    ].filter(Boolean))
  );

  gates.push(
    gate("H", [
      sourceContainsForbiddenPatterns(relationshipScopeSource, [
        "workspaceRelationshipSceneSyncContract",
        "workspaceRelationshipCreationContract",
      ]).length > 0
        ? "Relationship visualization imports DS-2 contract mutation paths"
        : "",
      sceneSyncSource.includes("adaptSceneRelationshipToNexoraRelationship")
        ? ""
        : "DS-2 scene sync contract missing expected adapter (regression sentinel)",
    ].filter(Boolean))
  );

  gates.push(
    gate("I", [
      sourceContainsForbiddenPatterns(relationshipScopeSource, [
        "ObjectPanelLazy",
        "WorkspaceObjectIntelligencePanel",
        "RightPanelHost",
      ]).length > 0
        ? "Relationship visualization imports object panel runtime"
        : "",
    ].filter(Boolean))
  );

  gates.push(
    gate("J", [
      sourceContainsForbiddenPatterns(relationshipScopeSource, [
        "MainRightPanelShell",
        "mrpWorkspace",
        "executiveDashboardBridge",
      ]).length > 0
        ? "Relationship visualization imports MRP runtime"
        : "",
    ].filter(Boolean))
  );

  gates.push(
    gate("K", [
      sourceContainsForbiddenPatterns(relationshipScopeSource, [
        "routeChatInput",
        "assistantRuntime",
        "resolveWorkspaceRelationshipQuestion",
      ]).length > 0
        ? "Relationship visualization imports assistant runtime"
        : "",
    ].filter(Boolean))
  );

  gates.push(
    gate("L", [
      workspaceARelationships.length > 0 ? "" : "Workspace A relationships missing",
      workspaceBRelationships.length === 0 ? "" : "Workspace B relationships leaked",
    ].filter(Boolean))
  );

  gates.push(
    gate("M", [
      fiftyValidated.length === 50 ? "" : "50-relationship validation failed",
      hundredValidated.length === 100 ? "" : "100-relationship validation failed",
      hundredVisible === 100 ? "" : "100-relationship visibility failed on object click",
      hundredPlanMs <= STRESS_PLAN_BUDGET_MS
        ? ""
        : `100-relationship plan resolution slow (${hundredPlanMs.toFixed(2)}ms)`,
    ].filter(Boolean))
  );

  const earlySamples: number[] = [];
  const lateSamples: number[] = [];
  for (let index = 0; index < MEMORY_LOOP_ITERATIONS; index += 1) {
    const elapsed = measureScenePlanMs(hundredScene.relationships, "obj_hub");
    if (index < 10) earlySamples.push(elapsed);
    if (index >= MEMORY_LOOP_ITERATIONS - 10) lateSamples.push(elapsed);
  }
  const earlyAverage = earlySamples.reduce((sum, value) => sum + value, 0) / earlySamples.length;
  const lateAverage = lateSamples.reduce((sum, value) => sum + value, 0) / lateSamples.length;
  gates.push(
    gate("N", [
      Number.isFinite(earlyAverage) && Number.isFinite(lateAverage) ? "" : "Memory loop produced invalid timings",
      lateAverage <= earlyAverage * 4
        ? ""
        : `Plan resolution timing drift suggests leak (${earlyAverage.toFixed(2)}ms -> ${lateAverage.toFixed(2)}ms)`,
      relationshipFlowSource.includes("let active") ? "Flow runtime contains mutable module state" : "",
    ].filter(Boolean))
  );

  gates.push(
    gate("O", [
      input.buildPassed === false ? "Build verification failed" : "",
      input.testsPassed === false ? "Relationship visualization tests failed" : "",
    ].filter(Boolean))
  );

  evidence.push(`50-relationship validated count: ${fiftyValidated.length}`);
  evidence.push(`100-relationship validated count: ${hundredValidated.length}`);
  evidence.push(`50-relationship visible on object click: ${fiftyVisible}`);
  evidence.push(`100-relationship visible on object click: ${hundredVisible}`);
  evidence.push(`50-relationship plan resolution: ${fiftyPlanMs.toFixed(2)}ms`);
  evidence.push(`100-relationship plan resolution: ${hundredPlanMs.toFixed(2)}ms`);
  evidence.push(`100-relationship flow ball instances: ${hundredFlowBalls}`);
  evidence.push(`Memory loop early avg: ${earlyAverage.toFixed(2)}ms, late avg: ${lateAverage.toFixed(2)}ms`);
  evidence.push("Relationship visualization scope remains read-only for scene, sync, topology, MRP, assistant, and object panel");

  const certified =
    REL_UX3_CERTIFICATION_TAGS.length === 5 &&
    gates.every((entry) => entry.status === "PASS") &&
    scenarios.every((entry) => entry.status === "PASS");

  return Object.freeze({
    version: REL_UX3_CERTIFICATION_VERSION,
    certified,
    result: certified ? "PASS" : "FAIL",
    diagnostics: Object.freeze([REL_UX3_CERTIFICATION_COMPLETE_DIAGNOSTIC] as const),
    gates: Object.freeze(gates),
    scenarios: Object.freeze(scenarios),
    tags: REL_UX3_CERTIFICATION_TAGS,
    evidence: Object.freeze(evidence),
  });
}

export const runRelationshipVisualizationCertification = certifyRelationshipVisualization;
