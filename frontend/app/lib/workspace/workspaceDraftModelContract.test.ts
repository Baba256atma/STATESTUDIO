import assert from "node:assert/strict";
import test from "node:test";

import type { WorkspaceDomainSelection } from "./workspaceDomainContract.ts";
import type { WorkspaceSituationContext } from "./workspaceSituationContract.ts";
import {
  createSuggestedGoal,
  getGoalSuggestionsForDomain,
  type WorkspaceGoal,
} from "./workspaceGoalContract.ts";
import {
  addDraftObject,
  approveWorkspaceDraftModel,
  generateWorkspaceDraftModel,
  getWorkspaceDraftModel,
  getWorkspaceDraftModelVersionSnapshot,
  removeDraftObject,
  renameDraftObject,
  resetWorkspaceDraftModelsForTests,
  saveWorkspaceDraftModel,
} from "./workspaceDraftModelContract.ts";

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

function manufacturingGoals(): readonly WorkspaceGoal[] {
  const first = getGoalSuggestionsForDomain("manufacturing")[0];
  const second = getGoalSuggestionsForDomain("manufacturing")[1];
  assert.ok(first);
  assert.ok(second);
  return [
    createSuggestedGoal({ workspaceId: "workspace_a", suggestion: first }),
    createSuggestedGoal({ workspaceId: "workspace_a", suggestion: second }),
  ];
}

test("generates a rule-based draft model from domain situation and goals", () => {
  const draft = generateWorkspaceDraftModel({
    workspaceId: "workspace_a",
    domain,
    situation,
    goals: manufacturingGoals(),
    generatedAt: "2026-06-20T00:00:00.000Z",
  });

  assert.equal(draft.workspaceId, "workspace_a");
  assert.equal(draft.domainId, "manufacturing");
  assert.equal(draft.generationSource, "RuleBased");
  assert.deepEqual(draft.goalIds, ["reduce_cost", "improve_throughput"]);
  assert.ok(draft.objects.some((object) => object.objectName === "Suppliers"));
  assert.ok(draft.objects.some((object) => object.objectName === "Inventory"));
});

test("persists draft model by workspace", () => {
  resetWorkspaceDraftModelsForTests();
  const draft = generateWorkspaceDraftModel({
    workspaceId: "workspace_a",
    domain,
    situation,
    goals: manufacturingGoals(),
  });

  saveWorkspaceDraftModel(draft);

  assert.equal(getWorkspaceDraftModel("workspace_a")?.objects.length, draft.objects.length);
});

test("supports removing renaming and adding draft objects", () => {
  resetWorkspaceDraftModelsForTests();
  const draft = saveWorkspaceDraftModel(
    generateWorkspaceDraftModel({
      workspaceId: "workspace_a",
      domain,
      situation,
      goals: manufacturingGoals(),
    })
  );
  const firstObject = draft.objects[0];
  assert.ok(firstObject);

  renameDraftObject("workspace_a", firstObject.objectId, "Strategic Suppliers");
  assert.equal(getWorkspaceDraftModel("workspace_a")?.objects[0]?.objectName, "Strategic Suppliers");

  addDraftObject("workspace_a", "Supplier Contracts");
  assert.ok(getWorkspaceDraftModel("workspace_a")?.objects.some((object) => object.objectName === "Supplier Contracts"));

  removeDraftObject("workspace_a", firstObject.objectId);
  assert.equal(
    getWorkspaceDraftModel("workspace_a")?.objects.some((object) => object.objectId === firstObject.objectId),
    false
  );
});

test("approves draft without creating scene objects", () => {
  resetWorkspaceDraftModelsForTests();
  saveWorkspaceDraftModel(
    generateWorkspaceDraftModel({
      workspaceId: "workspace_a",
      domain,
      situation,
      goals: manufacturingGoals(),
    })
  );

  const approved = approveWorkspaceDraftModel("workspace_a");

  assert.equal(approved?.status, "approved");
  assert.ok(approved?.approvedAt);
});

test("increments draft store version when saved", () => {
  resetWorkspaceDraftModelsForTests();
  const before = getWorkspaceDraftModelVersionSnapshot();

  saveWorkspaceDraftModel(
    generateWorkspaceDraftModel({
      workspaceId: "workspace_a",
      domain,
      situation,
      goals: manufacturingGoals(),
    })
  );

  assert.equal(getWorkspaceDraftModelVersionSnapshot(), before + 1);
});

