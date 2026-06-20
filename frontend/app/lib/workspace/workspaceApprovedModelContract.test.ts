import assert from "node:assert/strict";
import test from "node:test";

import type { WorkspaceDomainSelection } from "./workspaceDomainContract.ts";
import type { WorkspaceSituationContext } from "./workspaceSituationContract.ts";
import { createSuggestedGoal, getGoalSuggestionsForDomain, type WorkspaceGoal } from "./workspaceGoalContract.ts";
import {
  addDraftObject,
  generateWorkspaceDraftModel,
  getWorkspaceDraftModel,
  renameDraftObject,
  resetWorkspaceDraftModelsForTests,
  saveWorkspaceDraftModel,
} from "./workspaceDraftModelContract.ts";
import {
  approveWorkspaceModelFromDraft,
  getSceneHandoff,
  getWorkspaceModel,
  getWorkspaceModelVersionSnapshot,
  getWorkspaceObjects,
  resetWorkspaceModelsForTests,
} from "./workspaceApprovedModelContract.ts";

const domain: WorkspaceDomainSelection = {
  contractVersion: "NW-B:2",
  workspaceId: "workspace_a",
  domainId: "manufacturing",
  domainName: "Manufacturing",
  selectedAt: "2026-06-20T00:00:00.000Z",
};

const situation: WorkspaceSituationContext = {
  contractVersion: "NW-B:3",
  workspaceId: "workspace_a",
  domainId: "manufacturing",
  situationText: "Supplier delays are increasing.",
  createdAt: "2026-06-20T00:00:00.000Z",
  updatedAt: "2026-06-20T00:00:00.000Z",
};

function goals(): readonly WorkspaceGoal[] {
  const first = getGoalSuggestionsForDomain("manufacturing")[0];
  assert.ok(first);
  return [createSuggestedGoal({ workspaceId: "workspace_a", suggestion: first })];
}

function preparedDraft() {
  resetWorkspaceDraftModelsForTests();
  resetWorkspaceModelsForTests();
  const draft = saveWorkspaceDraftModel(
    generateWorkspaceDraftModel({
      workspaceId: "workspace_a",
      domain,
      situation,
      goals: goals(),
      generatedAt: "2026-06-20T00:00:00.000Z",
    })
  );
  const firstObject = draft.objects[0];
  assert.ok(firstObject);
  renameDraftObject("workspace_a", firstObject.objectId, "Strategic Suppliers");
  addDraftObject("workspace_a", "Supplier Contracts");
  assert.equal(getWorkspaceObjects("workspace_a").length, 0);
  const updatedDraft = getWorkspaceDraftModel("workspace_a");
  assert.ok(updatedDraft);
  return updatedDraft;
}

test("approves draft model into a workspace model", () => {
  const draft = preparedDraft();

  const result = approveWorkspaceModelFromDraft({
    draft,
    approvedAt: "2026-06-20T00:00:00.000Z",
  });

  assert.equal(result.model.workspaceId, "workspace_a");
  assert.equal(result.model.status, "approved");
  assert.equal(result.model.modelVersion, 1);
  assert.equal(result.model.approvedObjects.length, draft.objects.length);
  assert.equal(getWorkspaceModel("workspace_a")?.modelId, result.model.modelId);
});

test("promotes draft objects while preserving user edits and source", () => {
  const draft = preparedDraft();

  approveWorkspaceModelFromDraft({ draft });
  const objects = getWorkspaceObjects("workspace_a");

  assert.ok(objects.some((object) => object.objectName === "Strategic Suppliers" && object.source === "UserModified"));
  assert.ok(objects.some((object) => object.objectName === "Supplier Contracts" && object.source === "UserModified"));
});

test("creates a scene handoff without topology", () => {
  const draft = preparedDraft();

  const { sceneHandoff } = approveWorkspaceModelFromDraft({ draft });

  assert.equal(sceneHandoff.sceneReady, true);
  assert.deepEqual(sceneHandoff.approvedObjectIds, draft.objects.map((object) => object.objectId));
  assert.equal(getSceneHandoff("workspace_a")?.modelId, sceneHandoff.modelId);
});

test("increments workspace model version when approved", () => {
  const draft = preparedDraft();
  const before = getWorkspaceModelVersionSnapshot();

  approveWorkspaceModelFromDraft({ draft });

  assert.equal(getWorkspaceModelVersionSnapshot(), before + 1);
});
