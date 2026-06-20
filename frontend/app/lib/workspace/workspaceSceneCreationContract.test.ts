import assert from "node:assert/strict";
import test from "node:test";

import type { WorkspaceDomainSelection } from "./workspaceDomainContract.ts";
import type { WorkspaceSituationContext } from "./workspaceSituationContract.ts";
import { createSuggestedGoal, getGoalSuggestionsForDomain, type WorkspaceGoal } from "./workspaceGoalContract.ts";
import {
  generateWorkspaceDraftModel,
  resetWorkspaceDraftModelsForTests,
  saveWorkspaceDraftModel,
} from "./workspaceDraftModelContract.ts";
import {
  approveWorkspaceModelFromDraft,
  resetWorkspaceModelsForTests,
} from "./workspaceApprovedModelContract.ts";
import {
  createWorkspaceSceneFromApprovedModel,
  getWorkspaceSceneCreation,
  getWorkspaceSceneJson,
  getWorkspaceSceneObjects,
  getWorkspaceSceneVersionSnapshot,
  resetWorkspaceScenesForTests,
} from "./workspaceSceneCreationContract.ts";

function domain(workspaceId: string, domainId = "manufacturing"): WorkspaceDomainSelection {
  return {
    contractVersion: "NW-B:2",
    workspaceId,
    domainId,
    domainName: domainId === "finance" ? "Finance" : "Manufacturing",
    selectedAt: "2026-06-20T00:00:00.000Z",
  };
}

function situation(workspaceId: string, domainId = "manufacturing"): WorkspaceSituationContext {
  return {
    contractVersion: "NW-B:3",
    workspaceId,
    domainId,
    situationText: "The system needs a first operating model.",
    createdAt: "2026-06-20T00:00:00.000Z",
    updatedAt: "2026-06-20T00:00:00.000Z",
  };
}

function goals(workspaceId: string, domainId = "manufacturing"): readonly WorkspaceGoal[] {
  const suggestion = getGoalSuggestionsForDomain(domainId)[0];
  assert.ok(suggestion);
  return [createSuggestedGoal({ workspaceId, suggestion })];
}

function approveWorkspace(workspaceId: string, domainId = "manufacturing") {
  const draft = saveWorkspaceDraftModel(
    generateWorkspaceDraftModel({
      workspaceId,
      domain: domain(workspaceId, domainId),
      situation: situation(workspaceId, domainId),
      goals: goals(workspaceId, domainId),
      generatedAt: "2026-06-20T00:00:00.000Z",
    })
  );
  return approveWorkspaceModelFromDraft({
    draft,
    approvedAt: "2026-06-20T00:00:00.000Z",
  });
}

function resetStores(): void {
  resetWorkspaceDraftModelsForTests();
  resetWorkspaceModelsForTests();
  resetWorkspaceScenesForTests();
}

test("creates workspace scene objects from an approved model", () => {
  resetStores();
  const { model } = approveWorkspace("workspace_scene_a");

  const before = getWorkspaceSceneVersionSnapshot();
  const creation = createWorkspaceSceneFromApprovedModel({
    workspaceId: "workspace_scene_a",
    createdAt: "2026-06-20T00:00:00.000Z",
  });

  assert.ok(creation);
  assert.equal(creation.workspaceId, "workspace_scene_a");
  assert.equal(creation.modelId, model.modelId);
  assert.equal(creation.sceneReady, true);
  assert.equal(getWorkspaceSceneVersionSnapshot(), before + 1);

  const objects = getWorkspaceSceneObjects("workspace_scene_a");
  assert.equal(objects.length, model.approvedObjects.length);
  assert.ok(objects.every((object) => object.workspaceId === "workspace_scene_a"));
  assert.ok(objects.every((object) => object.modelId === model.modelId));
  assert.ok(objects.every((object) => object.source === "ApprovedModel"));
  assert.ok(objects.every((object) => Array.isArray(object.position) && object.position.length === 3));
});

test("builds scene json without demo content or advanced intelligence", () => {
  resetStores();
  approveWorkspace("workspace_scene_b");

  createWorkspaceSceneFromApprovedModel({ workspaceId: "workspace_scene_b" });
  const sceneJson = getWorkspaceSceneJson("workspace_scene_b");

  assert.ok(sceneJson);
  assert.equal(sceneJson.meta?.workspaceId, "workspace_scene_b");
  assert.equal(sceneJson.meta?.source, "ApprovedModel");
  assert.equal(sceneJson.meta?.workspaceSceneCreated, true);
  assert.equal(sceneJson.scene.relationships?.length, 0);
  assert.equal(sceneJson.scene.loops?.length, 0);
  assert.equal(sceneJson.scene.kpi, undefined);
  assert.ok(sceneJson.scene.objects?.every((object) => object.source === "ApprovedModel"));
});

test("keeps workspace scene objects isolated by workspace", () => {
  resetStores();
  approveWorkspace("workspace_scene_a", "manufacturing");
  approveWorkspace("workspace_scene_b", "finance");

  createWorkspaceSceneFromApprovedModel({ workspaceId: "workspace_scene_a" });

  assert.ok(getWorkspaceSceneCreation("workspace_scene_a"));
  assert.equal(getWorkspaceSceneCreation("workspace_scene_b"), null);
  assert.ok(getWorkspaceSceneObjects("workspace_scene_a").length > 0);
  assert.equal(getWorkspaceSceneObjects("workspace_scene_b").length, 0);
  assert.equal(getWorkspaceSceneJson("workspace_scene_b"), null);
});
