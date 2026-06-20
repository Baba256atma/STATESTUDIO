import assert from "node:assert/strict";
import test from "node:test";

import {
  getWorkspaceDomainSelection,
  getWorkspaceDomainVersionSnapshot,
  NEXORA_WORKSPACE_DOMAIN_OPTIONS,
  resetWorkspaceDomainSelectionsForTests,
  saveWorkspaceDomainSelection,
} from "./workspaceDomainContract.ts";

test("provides first-party Nexora domain options", () => {
  const domainIds = NEXORA_WORKSPACE_DOMAIN_OPTIONS.map((option) => option.domainId);

  assert.deepEqual(domainIds, [
    "manufacturing",
    "finance",
    "project_management",
    "supply_chain",
    "operations",
    "sales",
    "human_resources",
    "technology",
    "custom",
  ]);
});

test("saves domain context by workspace", () => {
  resetWorkspaceDomainSelectionsForTests();

  const selection = saveWorkspaceDomainSelection({
    workspaceId: "workspace_a",
    domainId: "manufacturing",
    selectedAt: "2026-06-20T00:00:00.000Z",
  });

  assert.equal(selection.workspaceId, "workspace_a");
  assert.equal(selection.domainId, "manufacturing");
  assert.equal(selection.domainName, "Manufacturing");
  assert.equal(getWorkspaceDomainSelection("workspace_a")?.domainName, "Manufacturing");
});

test("preserves separate domain selections across workspaces", () => {
  resetWorkspaceDomainSelectionsForTests();

  saveWorkspaceDomainSelection({ workspaceId: "workspace_a", domainId: "finance" });
  saveWorkspaceDomainSelection({ workspaceId: "workspace_b", domainId: "operations" });

  assert.equal(getWorkspaceDomainSelection("workspace_a")?.domainName, "Finance");
  assert.equal(getWorkspaceDomainSelection("workspace_b")?.domainName, "Operations");
});

test("increments domain store version when saved", () => {
  resetWorkspaceDomainSelectionsForTests();
  const before = getWorkspaceDomainVersionSnapshot();

  saveWorkspaceDomainSelection({ workspaceId: "workspace_a", domainId: "technology" });

  assert.equal(getWorkspaceDomainVersionSnapshot(), before + 1);
});
