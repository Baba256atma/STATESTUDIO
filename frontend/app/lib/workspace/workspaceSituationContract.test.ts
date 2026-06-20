import assert from "node:assert/strict";
import test from "node:test";

import {
  getSituationPlaceholderForDomain,
  getSituationTemplatesForDomain,
  getWorkspaceSituation,
  getWorkspaceSituationVersionSnapshot,
  resetWorkspaceSituationsForTests,
  saveWorkspaceSituation,
} from "./workspaceSituationContract.ts";

test("provides domain-aware situation templates", () => {
  const manufacturingTemplates = getSituationTemplatesForDomain("manufacturing");
  const financePlaceholder = getSituationPlaceholderForDomain("finance");

  assert.equal(manufacturingTemplates[0]?.label, "Supplier Delay");
  assert.match(financePlaceholder, /Cash flow/i);
});

test("saves situation context by workspace", () => {
  resetWorkspaceSituationsForTests();

  const situation = saveWorkspaceSituation({
    workspaceId: "workspace_a",
    domainId: "manufacturing",
    situationText: " Supplier delays are increasing. ",
    now: "2026-06-20T00:00:00.000Z",
  });

  assert.equal(situation.workspaceId, "workspace_a");
  assert.equal(situation.domainId, "manufacturing");
  assert.equal(situation.situationText, "Supplier delays are increasing.");
  assert.equal(situation.createdAt, "2026-06-20T00:00:00.000Z");
  assert.equal(situation.updatedAt, "2026-06-20T00:00:00.000Z");
  assert.equal(getWorkspaceSituation("workspace_a")?.situationText, "Supplier delays are increasing.");
});

test("preserves separate situation contexts across workspaces", () => {
  resetWorkspaceSituationsForTests();

  saveWorkspaceSituation({
    workspaceId: "workspace_a",
    domainId: "finance",
    situationText: "Cash flow pressure is increasing.",
  });
  saveWorkspaceSituation({
    workspaceId: "workspace_b",
    domainId: "project_management",
    situationText: "Milestones are slipping.",
  });

  assert.equal(getWorkspaceSituation("workspace_a")?.domainId, "finance");
  assert.equal(getWorkspaceSituation("workspace_b")?.domainId, "project_management");
});

test("updates situation while preserving createdAt", () => {
  resetWorkspaceSituationsForTests();

  saveWorkspaceSituation({
    workspaceId: "workspace_a",
    domainId: "operations",
    situationText: "Backlog is growing.",
    now: "2026-06-20T00:00:00.000Z",
  });
  const updated = saveWorkspaceSituation({
    workspaceId: "workspace_a",
    domainId: "operations",
    situationText: "Backlog is growing and service levels are slipping.",
    now: "2026-06-21T00:00:00.000Z",
  });

  assert.equal(updated.createdAt, "2026-06-20T00:00:00.000Z");
  assert.equal(updated.updatedAt, "2026-06-21T00:00:00.000Z");
});

test("increments situation store version when saved", () => {
  resetWorkspaceSituationsForTests();
  const before = getWorkspaceSituationVersionSnapshot();

  saveWorkspaceSituation({
    workspaceId: "workspace_a",
    domainId: "technology",
    situationText: "Reliability issues are increasing.",
  });

  assert.equal(getWorkspaceSituationVersionSnapshot(), before + 1);
});

