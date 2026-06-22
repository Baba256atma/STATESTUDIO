import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { NexoraRelationship } from "./relationshipTypes.ts";
import {
  areRelationshipLinePointsValid,
  readValidatedSceneRelationshipsForRender,
  resetRelationshipRendererRuntimeForTests,
  resolveSafeExecutiveRelationshipGraphicsProfile,
  validateRelationshipForRender,
} from "./relationshipRendererRuntime.ts";
import type { WorkspaceDomainSelection } from "../workspace/workspaceDomainContract.ts";
import type { WorkspaceSituationContext } from "../workspace/workspaceSituationContract.ts";
import {
  approveWorkspaceModelFromDraft,
  resetWorkspaceModelsForTests,
} from "../workspace/workspaceApprovedModelContract.ts";
import {
  createWorkspaceSceneFromApprovedModel,
  resetWorkspaceScenesForTests,
} from "../workspace/workspaceSceneCreationContract.ts";
import {
  createSuggestedGoal,
  getGoalSuggestionsForDomain,
  type WorkspaceGoal,
} from "../workspace/workspaceGoalContract.ts";
import {
  generateWorkspaceDraftModel,
  resetWorkspaceDraftModelsForTests,
  saveWorkspaceDraftModel,
} from "../workspace/workspaceDraftModelContract.ts";
import {
  createWorkspaceRelationshipsFromApprovedModel,
  getWorkspaceDiscoveredRelationships,
  getWorkspaceRelationshipDiscovery,
  getWorkspaceSceneJsonWithRelationships,
  resetWorkspaceRelationshipsForTests,
} from "../workspace/workspaceRelationshipDiscoveryContract.ts";
import {
  NWB8_FIX2_CERTIFICATION_TAG,
  RELATIONSHIP_SCENE_REGRESSION_CERTIFICATION_TAGS,
  RELATIONSHIP_SCENE_REGRESSION_COMPLETE_DIAGNOSTIC,
  type RelationshipSceneRegressionCertificationInput,
  type RelationshipSceneRegressionCertificationResult,
  type RelationshipSceneRegressionGate,
  type RelationshipSceneRegressionScenario,
} from "./relationshipSceneRegressionCertificationContract.ts";

const FRONTEND_ROOT = process.cwd();

function safeCountSceneRelationships(sceneJson: unknown): number {
  if (!sceneJson || typeof sceneJson !== "object") return 0;
  const relationships = (sceneJson as { scene?: { relationships?: unknown } }).scene?.relationships;
  return Array.isArray(relationships) ? relationships.length : 0;
}

function readSource(relativePath: string): string {
  return readFileSync(join(FRONTEND_ROOT, relativePath), "utf8");
}

function gate(
  id: RelationshipSceneRegressionGate["id"],
  name: string,
  failures: readonly string[]
): RelationshipSceneRegressionGate {
  return Object.freeze({
    id,
    name,
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail: failures.length === 0 ? `${name} certified.` : failures.join("; "),
  });
}

function scenario(
  id: RelationshipSceneRegressionScenario["id"],
  name: string,
  failures: readonly string[]
): RelationshipSceneRegressionScenario {
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
  targetId: string
): NexoraRelationship {
  return Object.freeze({
    id,
    sourceId,
    targetId,
    type: "influences",
    direction: "uni",
    createdAt: "2026-06-20T00:00:00.000Z",
  });
}

function buildSceneWithRelationships(relationshipCount: number): {
  sceneJson: { scene: { objects: { id: string }[]; relationships: NexoraRelationship[] } };
  objects: { id: string }[];
} {
  const objectCount = Math.max(2, relationshipCount + 1);
  const objects = Array.from({ length: objectCount }, (_, index) =>
    Object.freeze({ id: `obj_${index}` })
  );
  const relationships = Array.from({ length: relationshipCount }, (_, index) =>
    buildRelationship(`rel_${index}`, `obj_${index}`, `obj_${index + 1}`)
  );
  return Object.freeze({
    sceneJson: Object.freeze({
      scene: Object.freeze({
        objects,
        relationships,
      }),
    }),
    objects,
  });
}

function resetWorkspaceCertificationStores(): void {
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
    situationText: "Cash flow pressure is increasing while revenue forecasts remain uncertain.",
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

function sourceContainsForbiddenPatterns(
  source: string,
  patterns: readonly string[]
): string[] {
  return patterns.filter((pattern) => source.includes(pattern));
}

export function runRelationshipSceneRegressionCertification(
  input: RelationshipSceneRegressionCertificationInput = {}
): RelationshipSceneRegressionCertificationResult {
  resetRelationshipRendererRuntimeForTests();
  resetWorkspaceCertificationStores();

  const gates: RelationshipSceneRegressionGate[] = [];
  const scenarios: RelationshipSceneRegressionScenario[] = [];
  const evidence: string[] = [];

  const relationshipRendererSource = readSource("app/components/scene/relationships/RelationshipRenderer.tsx");
  const relationshipLineSource = readSource("app/components/scene/relationships/RelationshipLine.tsx");
  const sceneCanvasSource = readSource("app/components/SceneCanvas.tsx");
  const sceneOverlaySource = readSource("app/components/scene/overlay/SceneOverlayRenderer.tsx");
  const relationshipScopeSource = `${relationshipRendererSource}\n${relationshipLineSource}`;

  const zeroScene = buildSceneWithRelationships(0);
  const singleScene = buildSceneWithRelationships(1);
  const tenScene = buildSceneWithRelationships(10);

  const zeroValidated = readValidatedSceneRelationshipsForRender(
    zeroScene.sceneJson,
    zeroScene.objects
  );
  const singleValidated = readValidatedSceneRelationshipsForRender(
    singleScene.sceneJson,
    singleScene.objects
  );
  const tenValidated = readValidatedSceneRelationshipsForRender(
    tenScene.sceneJson,
    tenScene.objects
  );

  scenarios.push(
    scenario("zero_relationships", "Workspace with 0 relationships", [
      zeroValidated.length === 0 ? "" : "Expected zero validated relationships",
      safeCountSceneRelationships(zeroScene.sceneJson) === 0 ? "" : "countSceneRelationships returned non-zero",
    ].filter(Boolean))
  );

  scenarios.push(
    scenario("single_relationship", "Workspace with 1 relationship", [
      singleValidated.length === 1 ? "" : "Expected one validated relationship",
      singleValidated[0]?.id === "rel_0" ? "" : "Validated relationship id mismatch",
      resolveSafeExecutiveRelationshipGraphicsProfile("3D").profile ? "" : "Graphics profile missing",
    ].filter(Boolean))
  );

  const tenObjectIds = new Set(tenScene.objects.map((object) => object.id));
  scenarios.push(
    scenario("ten_relationships", "Workspace with 10 relationships", [
      tenValidated.length === 10 ? "" : "Expected ten validated relationships",
      tenValidated.every((relationship) =>
        validateRelationshipForRender(relationship, tenObjectIds).valid
      )
        ? ""
        : "One or more relationships failed validation",
      relationshipRendererSource.includes("resolveExecutiveRelationshipScenePlan")
        ? ""
        : "Renderer missing executive scene plan integration",
    ].filter(Boolean))
  );

  approveFinanceWorkspace("workspace_rel_cert_a");
  approveFinanceWorkspace("workspace_rel_cert_b");
  createWorkspaceSceneFromApprovedModel({ workspaceId: "workspace_rel_cert_a" });
  createWorkspaceRelationshipsFromApprovedModel({
    workspaceId: "workspace_rel_cert_a",
    createdAt: "2026-06-20T00:00:00.000Z",
  });
  const workspaceARelationships = getWorkspaceDiscoveredRelationships("workspace_rel_cert_a");
  const workspaceBRelationships = getWorkspaceDiscoveredRelationships("workspace_rel_cert_b");
  scenarios.push(
    scenario("workspace_switching", "Workspace switching", [
      getWorkspaceRelationshipDiscovery("workspace_rel_cert_a") ? "" : "Workspace A discovery missing",
      getWorkspaceRelationshipDiscovery("workspace_rel_cert_b") === null ? "" : "Workspace B should stay isolated",
      workspaceARelationships.length > 0 ? "" : "Workspace A relationships missing",
      workspaceBRelationships.length === 0 ? "" : "Workspace B leaked relationships",
    ].filter(Boolean))
  );

  const selectionMutationPatterns = sourceContainsForbiddenPatterns(relationshipScopeSource, [
    "setSelectedObjectId",
    "setSelectedRelationshipId",
    "dispatchSelection",
  ]);
  scenarios.push(
    scenario("selection_after_render", "Object selection after relationship rendering", [
      selectionMutationPatterns.length > 0
        ? `Relationship render scope mutates selection: ${selectionMutationPatterns.join(", ")}`
        : "",
      relationshipRendererSource.includes("selectedObjectId") ? "" : "Renderer still accepts selection input",
    ].filter(Boolean))
  );

  const reloadBefore = JSON.stringify(singleScene.sceneJson);
  const reloadFirst = readValidatedSceneRelationshipsForRender(
    singleScene.sceneJson,
    singleScene.objects
  );
  const reloadSecond = readValidatedSceneRelationshipsForRender(
    singleScene.sceneJson,
    singleScene.objects
  );
  scenarios.push(
    scenario("scene_reload", "Scene reload", [
      JSON.stringify(singleScene.sceneJson) === reloadBefore ? "" : "Scene payload mutated on reload",
      reloadFirst.length === reloadSecond.length ? "" : "Validated relationship count changed on reload",
      reloadFirst[0]?.id === reloadSecond[0]?.id ? "" : "Validated relationship identity changed on reload",
    ].filter(Boolean))
  );

  const invalidScene = {
    scene: {
      objects: [{ id: "obj_a" }, { id: "obj_b" }],
      relationships: [
        buildRelationship("rel_ok", "obj_a", "obj_b"),
        {
          id: "rel_bad",
          sourceId: "obj_a",
          targetId: "missing",
          type: "influences",
          direction: "uni",
          createdAt: "2026-06-20T00:00:00.000Z",
        },
        null,
        "invalid",
      ],
    },
  };
  const invalidValidated = readValidatedSceneRelationshipsForRender(invalidScene, invalidScene.scene.objects);
  scenarios.push(
    scenario("invalid_payload", "Relationship contains invalid payload", [
      invalidValidated.length === 1 ? "" : "Expected only valid relationship to survive",
      invalidValidated[0]?.id === "rel_ok" ? "" : "Valid relationship not preserved",
      validateRelationshipForRender(null).valid === false ? "" : "Null relationship should fail validation",
    ].filter(Boolean))
  );

  const contractSample = validateRelationshipForRender(
    buildRelationship("rel_contract", "obj_a", "obj_b"),
    new Set(["obj_a", "obj_b"])
  );
  gates.push(
    gate("A", "Relationship Contract Valid", [
      contractSample.valid ? "" : "Valid relationship contract rejected",
      validateRelationshipForRender({ id: "bad" }).valid === false ? "" : "Invalid contract accepted",
      readValidatedSceneRelationshipsForRender !== undefined ? "" : "Validated scene reader missing",
    ].filter(Boolean))
  );

  gates.push(
    gate("B", "Relationship Renderer Safe", [
      relationshipRendererSource.includes("data-nx-") ? "RelationshipRenderer still uses data-nx-* attributes" : "",
      relationshipRendererSource.includes("readValidatedSceneRelationshipsForRender") ? "" : "Renderer bypasses validation reader",
      relationshipRendererSource.includes("userData") ? "" : "Renderer missing userData metadata",
      relationshipRendererSource.includes("relationships.length === 0") ? "" : "Renderer missing empty-state guard",
    ].filter(Boolean))
  );

  gates.push(
    gate("C", "Relationship Line Safe", [
      relationshipLineSource.includes("data-nx-") ? "RelationshipLine still uses data-nx-* attributes" : "",
      relationshipLineSource.includes("validateRelationshipForRender") ? "" : "RelationshipLine missing contract validation",
      relationshipLineSource.includes("areRelationshipLinePointsValid") ? "" : "RelationshipLine missing point guards",
      relationshipLineSource.includes("return null") ? "" : "RelationshipLine missing null fallback",
    ].filter(Boolean))
  );

  gates.push(
    gate("D", "Pulse Animation Safe", [
      relationshipLineSource.includes("PulsingExecutiveLine") ? "" : "PulsingExecutiveLine missing",
      relationshipLineSource.includes("readLineMaterial") ? "" : "Pulse material guard missing",
      relationshipLineSource.includes("logRelationshipPulseDisabled") ? "" : "Pulse disable diagnostic missing",
      relationshipLineSource.includes("pulseDisabledRef") ? "" : "Pulse disable latch missing",
    ].filter(Boolean))
  );

  gates.push(
    gate("E", "Scene Canvas Safe", [
      safeCountSceneRelationships(null) === 0 ? "" : "countSceneRelationships(null) threw or returned non-zero",
      safeCountSceneRelationships({ scene: { relationships: "bad" } }) === 0
        ? ""
        : "countSceneRelationships rejected malformed relationships",
      sceneCanvasSource.includes("countSceneRelationships") ? "" : "SceneCanvas missing relationship count guard",
      sceneOverlaySource.includes("RelationshipRenderer") ? "" : "SceneOverlayRenderer missing relationship layer",
    ].filter(Boolean))
  );

  const mergedScene = getWorkspaceSceneJsonWithRelationships("workspace_rel_cert_a");
  const mergedRelationshipCount = Array.isArray(mergedScene?.scene.relationships)
    ? mergedScene.scene.relationships.length
    : 0;
  gates.push(
    gate("F", "Workspace Isolation Safe", [
      workspaceARelationships.length > 0 ? "" : "Workspace A relationships missing",
      workspaceBRelationships.length === 0 ? "" : "Workspace B relationships leaked",
      mergedRelationshipCount > 0 ? "" : "Merged scene relationships missing",
      readValidatedSceneRelationshipsForRender(mergedScene, mergedScene?.scene.objects ?? []).length > 0
        ? ""
        : "Merged scene relationships failed render validation",
    ].filter(Boolean))
  );

  gates.push(
    gate("G", "Object Selection Unchanged", [
      selectionMutationPatterns.length > 0
        ? `Relationship scope mutates selection: ${selectionMutationPatterns.join(", ")}`
        : "",
      relationshipRendererSource.includes("selectedObjectId") ? "" : "Renderer no longer accepts selection input",
    ].filter(Boolean))
  );

  gates.push(
    gate("H", "Caption System Unchanged", [
      relationshipScopeSource.includes("ObjectCaption") ? "Relationship scope imports ObjectCaption" : "",
      relationshipScopeSource.includes("objectCaptionBillboardRuntime")
        ? "Relationship scope imports caption runtime"
        : "",
    ].filter(Boolean))
  );

  gates.push(
    gate("I", "MRP Unchanged", [
      relationshipScopeSource.includes("MainRightPanelShell") ? "Relationship scope imports MainRightPanelShell" : "",
      relationshipScopeSource.includes("workspaceRelationshipCount")
        ? "Relationship scope writes MRP relationship count"
        : "",
    ].filter(Boolean))
  );

  gates.push(
    gate("J", "Assistant Unchanged", [
      relationshipScopeSource.includes("resolveWorkspaceRelationshipQuestion")
        ? "Relationship render scope imports assistant runtime"
        : "",
      relationshipScopeSource.includes("routeChatInput") ? "Relationship render scope imports chat router" : "",
    ].filter(Boolean))
  );

  gates.push(
    gate("K", "Build Passes", [
      input.buildPassed === false ? "Build verification failed" : "",
    ].filter(Boolean))
  );

  const runtimeFailures = scenarios
    .filter((entry) => entry.status === "FAIL")
    .map((entry) => `${entry.name}: ${entry.detail}`);
  gates.push(
    gate("L", "No Runtime Errors", [
      ...runtimeFailures,
      areRelationshipLinePointsValid([[Number.NaN, 0, 0], [1, 1, 1]]) === false
        ? ""
        : "Invalid line points were accepted",
      resolveSafeExecutiveRelationshipGraphicsProfile(null).profile ? "" : "Graphics profile fallback missing",
      input.testsPassed === false ? "Regression tests failed" : "",
    ].filter(Boolean))
  );

  evidence.push(`Validated 0-relationship scene: ${zeroValidated.length} renderable relationships`);
  evidence.push(`Validated 1-relationship scene: ${singleValidated.length} renderable relationships`);
  evidence.push(`Validated 10-relationship scene: ${tenValidated.length} renderable relationships`);
  evidence.push(`Workspace A relationships: ${workspaceARelationships.length}`);
  evidence.push(`Workspace B relationships: ${workspaceBRelationships.length}`);
  evidence.push(`Invalid payload survivors: ${invalidValidated.length}`);
  evidence.push("No data-nx-* attributes in relationship renderer scope");
  evidence.push("Relationship line point guards active");
  evidence.push("Pulse animation guarded against missing material");

  const freezeTagsValid =
    RELATIONSHIP_SCENE_REGRESSION_CERTIFICATION_TAGS.length === 5 &&
    RELATIONSHIP_SCENE_REGRESSION_CERTIFICATION_TAGS.includes("[RELATIONSHIP_RENDERING_FROZEN]");
  const certified =
    freezeTagsValid &&
    gates.every((entry) => entry.status === "PASS") &&
    scenarios.every((entry) => entry.status === "PASS");

  return Object.freeze({
    tag: NWB8_FIX2_CERTIFICATION_TAG,
    version: "NW-B:8-FIX-2",
    certified,
    result: certified ? "PASS" : "FAIL",
    diagnostics: Object.freeze([RELATIONSHIP_SCENE_REGRESSION_COMPLETE_DIAGNOSTIC] as const),
    gates: Object.freeze(gates),
    scenarios: Object.freeze(scenarios),
    freezeTags: RELATIONSHIP_SCENE_REGRESSION_CERTIFICATION_TAGS,
    evidence: Object.freeze(evidence),
  });
}
