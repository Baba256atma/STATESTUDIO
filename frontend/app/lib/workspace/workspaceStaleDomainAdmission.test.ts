import assert from "node:assert/strict";
import test from "node:test";

import { createManagerWorkspaceFromEntry } from "./managerWorkspaceEntry.ts";
import { requestWorkspaceDeletion } from "./workspaceDeletionLifecycle.ts";
import { resetWorkspaceDeletionGuardForTests } from "./workspaceDeletionGuard.ts";
import { DEMO_WORKSPACE_ID } from "./workspaceRegistryContract.ts";
import {
  deleteWorkspace,
  getWorkspaceById,
  resetWorkspaceRegistryForTests,
  upsertWorkspace,
} from "./workspaceRegistryStore.ts";
import { coordinateWorkspaceMutation } from "./workspaceAuthorityFence.ts";

const STALE_DOMAIN_ADMISSIONS = [
  "monitoring-save-observation",
  "dataset-replacement",
  "nexocause-manager-review",
  "scenario-handoff",
] as const;

function authorityReason(error: unknown): string | undefined {
  return error && typeof error === "object" && "reason" in error ? String(error.reason) : undefined;
}

test("an active disposable workspace admits the shared domain callback", async () => {
  resetWorkspaceRegistryForTests();
  resetWorkspaceDeletionGuardForTests();
  const company = createManagerWorkspaceFromEntry({ name: "Domain Control", kind: "BUSINESS" });
  assert.ok(company);
  let called = false;
  await coordinateWorkspaceMutation({ workspaceId: company.workspaceId }, () => {
    called = true;
  });
  assert.equal(called, true);
  assert.equal(getWorkspaceById(DEMO_WORKSPACE_ID)?.status, "active");
});

test("revoked workspace authority rejects every stale domain admission before its callback", async () => {
  resetWorkspaceRegistryForTests();
  resetWorkspaceDeletionGuardForTests();
  const company = createManagerWorkspaceFromEntry({ name: "Stale Domains", kind: "BUSINESS" });
  assert.ok(company);
  deleteWorkspace(company.workspaceId);
  assert.equal(getWorkspaceById(company.workspaceId), null);

  for (const admission of STALE_DOMAIN_ADMISSIONS) {
    let called = false;
    await assert.rejects(
      () => coordinateWorkspaceMutation({ workspaceId: company.workspaceId, operationId: admission }, () => {
        called = true;
      }),
      (error: unknown) => authorityReason(error) === "workspace-revoked",
    );
    assert.equal(called, false, admission);
  }
});

test("deletion in progress blocks a prepared domain admission before its callback", async () => {
  resetWorkspaceRegistryForTests();
  resetWorkspaceDeletionGuardForTests();
  const company = createManagerWorkspaceFromEntry({ name: "Deleting Domain", kind: "BUSINESS" });
  assert.ok(company);
  const current = getWorkspaceById(company.workspaceId);
  assert.ok(current);
  upsertWorkspace({
    ...current,
    metadata: { ...(current.metadata ?? {}), disposableCertification: "local-certification" },
  });
  const requested = requestWorkspaceDeletion({ workspaceId: company.workspaceId, operationId: "op-stale-domain" });
  assert.equal(requested.ok, true);
  let called = false;
  await assert.rejects(
    () => coordinateWorkspaceMutation({ workspaceId: company.workspaceId }, () => {
      called = true;
    }),
    (error: unknown) => authorityReason(error) === "deletion-in-progress",
  );
  assert.equal(called, false);
  assert.equal(getWorkspaceById(DEMO_WORKSPACE_ID)?.workspaceId, DEMO_WORKSPACE_ID);
});
