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
  resetWorkspaceScenesForTests,
} from "./workspaceSceneCreationContract.ts";
import {
  createWorkspaceRelationshipsFromApprovedModel,
  getWorkspaceDiscoveredRelationships,
  getWorkspaceRelationshipDiscovery,
  getWorkspaceAdaptedNexoraRelationships,
  getWorkspaceSceneJsonWithRelationships,
  resetWorkspaceRelationshipsForTests,
} from "./workspaceRelationshipDiscoveryContract.ts";
import { resolveWorkspaceRelationshipQuestion } from "./workspaceRelationshipAssistantRuntime.ts";

function domain(workspaceId: string, domainId = "finance"): WorkspaceDomainSelection {
  return {
    contractVersion: "NW-B:2",
    workspaceId,
    domainId,
    domainName: domainId === "finance" ? "Finance" : "Manufacturing",
    selectedAt: "2026-06-20T00:00:00.000Z",
  };
}

function situation(workspaceId: string, domainId = "finance"): WorkspaceSituationContext {
  return {
    contractVersion: "NW-B:3",
    workspaceId,
    domainId,
    situationText: "Cash flow pressure is increasing while revenue forecasts remain uncertain.",
    createdAt: "2026-06-20T00:00:00.000Z",
    updatedAt: "2026-06-20T00:00:00.000Z",
  };
}

function goals(workspaceId: string, domainId = "finance"): readonly WorkspaceGoal[] {
  const suggestion = getGoalSuggestionsForDomain(domainId)[0];
  assert.ok(suggestion);
  return [createSuggestedGoal({ workspaceId, suggestion })];
}

function approveFinanceWorkspace(workspaceId: string) {
  const draft = saveWorkspaceDraftModel(
    generateWorkspaceDraftModel({
      workspaceId,
      domain: domain(workspaceId, "finance"),
      situation: situation(workspaceId, "finance"),
      goals: goals(workspaceId, "finance"),
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
  resetWorkspaceRelationshipsForTests();
}

test("generates deterministic finance relationships from approved objects", () => {
  resetStores();
  approveFinanceWorkspace("workspace_rel_finance");
  createWorkspaceSceneFromApprovedModel({ workspaceId: "workspace_rel_finance" });

  const discovery = createWorkspaceRelationshipsFromApprovedModel({
    workspaceId: "workspace_rel_finance",
    createdAt: "2026-06-20T00:00:00.000Z",
  });

  assert.ok(discovery);
  assert.equal(discovery.relationshipsCreated, true);
  const relationships = getWorkspaceDiscoveredRelationships("workspace_rel_finance");
  assert.ok(relationships.length >= 3);
  assert.ok(
    relationships.some(
      (relationship) =>
        relationship.sourceObjectName === "Revenue" &&
        relationship.targetObjectName === "Cash Flow" &&
        relationship.relationshipType === "influences"
    )
  );
  assert.ok(
    relationships.some(
      (relationship) =>
        relationship.sourceObjectName === "Expenses" &&
        relationship.targetObjectName === "Cash Flow"
    )
  );
});

test("merges discovered relationships into workspace scene json", () => {
  resetStores();
  approveFinanceWorkspace("workspace_rel_scene");
  createWorkspaceSceneFromApprovedModel({ workspaceId: "workspace_rel_scene" });
  createWorkspaceRelationshipsFromApprovedModel({ workspaceId: "workspace_rel_scene" });

  const sceneJson = getWorkspaceSceneJsonWithRelationships("workspace_rel_scene");
  assert.ok(sceneJson);
  assert.ok((sceneJson.scene.relationships?.length ?? 0) >= 3);
  assert.equal(sceneJson.meta?.relationshipsCreated, true);
  assert.equal(sceneJson.scene.kpi, undefined);
  assert.equal(sceneJson.scene.loops?.length, 0);
});

test("keeps relationship discovery isolated by workspace", () => {
  resetStores();
  approveFinanceWorkspace("workspace_rel_a");
  approveFinanceWorkspace("workspace_rel_b");
  createWorkspaceSceneFromApprovedModel({ workspaceId: "workspace_rel_a" });
  createWorkspaceRelationshipsFromApprovedModel({ workspaceId: "workspace_rel_a" });

  assert.ok(getWorkspaceRelationshipDiscovery("workspace_rel_a"));
  assert.equal(getWorkspaceRelationshipDiscovery("workspace_rel_b"), null);
  assert.ok(getWorkspaceDiscoveredRelationships("workspace_rel_a").length > 0);
  assert.equal(getWorkspaceDiscoveredRelationships("workspace_rel_b").length, 0);
});

test("assistant can explain discovered relationships", () => {
  resetStores();
  approveFinanceWorkspace("workspace_rel_assistant");
  createWorkspaceSceneFromApprovedModel({ workspaceId: "workspace_rel_assistant" });
  createWorkspaceRelationshipsFromApprovedModel({ workspaceId: "workspace_rel_assistant" });
  const relationships = getWorkspaceDiscoveredRelationships("workspace_rel_assistant");

  const answer = resolveWorkspaceRelationshipQuestion(
    "Why are these objects connected?",
    relationships
  );
  assert.ok(answer);
  assert.match(answer.assistantReply, /Revenue influences Cash Flow/i);
  assert.match(answer.assistantReply, /incoming revenue/i);
});

test("returns stable SceneJson reference when relationship scene inputs are unchanged", () => {
  resetStores();
  approveFinanceWorkspace("workspace_rel_cache");
  createWorkspaceSceneFromApprovedModel({ workspaceId: "workspace_rel_cache" });
  createWorkspaceRelationshipsFromApprovedModel({ workspaceId: "workspace_rel_cache" });

  const first = getWorkspaceSceneJsonWithRelationships("workspace_rel_cache");
  const second = getWorkspaceSceneJsonWithRelationships("workspace_rel_cache");

  assert.ok(first);
  assert.equal(first, second);
  assert.equal(first?.scene.relationships, second?.scene.relationships);
});

test("returns stable adapted Nexora relationship array when relationship set unchanged", () => {
  resetStores();
  approveFinanceWorkspace("workspace_rel_adapt");
  createWorkspaceSceneFromApprovedModel({ workspaceId: "workspace_rel_adapt" });
  createWorkspaceRelationshipsFromApprovedModel({ workspaceId: "workspace_rel_adapt" });

  const first = getWorkspaceAdaptedNexoraRelationships("workspace_rel_adapt");
  const second = getWorkspaceAdaptedNexoraRelationships("workspace_rel_adapt");

  assert.ok(first.length >= 3);
  assert.equal(first, second);
});

test("returns new adapted Nexora relationship array when relationships change", () => {
  resetStores();
  approveFinanceWorkspace("workspace_rel_adapt_change");
  createWorkspaceSceneFromApprovedModel({ workspaceId: "workspace_rel_adapt_change" });

  const before = getWorkspaceAdaptedNexoraRelationships("workspace_rel_adapt_change");
  createWorkspaceRelationshipsFromApprovedModel({ workspaceId: "workspace_rel_adapt_change" });
  const after = getWorkspaceAdaptedNexoraRelationships("workspace_rel_adapt_change");

  assert.equal(before.length, 0);
  assert.ok(after.length >= 3);
  assert.notEqual(before, after);
});

test("returns new SceneJson reference when relationships change", () => {
  resetStores();
  approveFinanceWorkspace("workspace_rel_cache_change");
  createWorkspaceSceneFromApprovedModel({ workspaceId: "workspace_rel_cache_change" });

  const beforeRelationships = getWorkspaceSceneJsonWithRelationships("workspace_rel_cache_change");
  createWorkspaceRelationshipsFromApprovedModel({ workspaceId: "workspace_rel_cache_change" });
  const afterRelationships = getWorkspaceSceneJsonWithRelationships("workspace_rel_cache_change");

  assert.ok(beforeRelationships);
  assert.ok(afterRelationships);
  assert.notEqual(beforeRelationships, afterRelationships);
  assert.equal(beforeRelationships?.scene.relationships?.length ?? 0, 0);
  assert.ok((afterRelationships?.scene.relationships?.length ?? 0) >= 3);
});
