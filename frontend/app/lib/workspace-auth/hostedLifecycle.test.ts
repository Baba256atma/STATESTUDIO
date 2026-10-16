import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { projectNexoraLlmManagementContext } from "../conversational-control/nexoraLlmManagementContext.ts";
import { createSceneOrgSavedScene } from "../scene-org/sceneOrgWorkspacePlacementContract.ts";
import { createHostedWorkspace } from "./hostedWorkspaceCommands.ts";
import { hostedWorkspaceFailure } from "./hostedWorkspaceHttp.ts";
import {
  acceptHostedPendingCsv,
  createHostedPendingCsv,
  readHostedManagerDataSnapshot,
  readHostedPendingCsv,
  removeHostedDataSource,
} from "./hostedManagerData.ts";
import {
  countHostedCustomerRows,
  deleteOwnedHostedAccountData,
  deleteOwnedHostedWorkspace,
  failHostedDeletionMidTransactionForTests,
} from "./hostedLifecycle.ts";
import { deleteHostedWorkspaceResponse } from "./hostedLifecycleHttp.ts";
import { projectHostedOperationalRecords, replaceHostedDecisionExecution, replaceHostedSavedScenes } from "./hostedOperationalPersistence.ts";
import {
  closeHostedWorkspaceDatabaseForTests,
  failHostedWorkspaceDatabaseForTests,
  openHostedWorkspaceDatabaseForTests,
} from "./hostedWorkspaceStore.ts";

const userA = Object.freeze({ userId: "dev:lifecycle_a" });
const userB = Object.freeze({ userId: "dev:lifecycle_b" });

function decision(workspaceId: string, decisionId: string) {
  return Object.freeze({
    decisionId,
    title: decisionId,
    status: "Approved" as const,
    locked: true,
    subjectIds: Object.freeze([]),
    evidenceRefs: Object.freeze([]),
    uncertaintyRefs: Object.freeze([]),
    committedBy: "manager" as const,
    source: "conversation" as const,
    workspaceId,
  });
}

function execution(workspaceId: string, decisionId: string) {
  return Object.freeze({
    executionId: `execution-${decisionId}`,
    decisionId,
    title: "Implement",
    status: "planned" as const,
    ownerIds: Object.freeze([]),
    blockers: Object.freeze([]),
    risks: Object.freeze([]),
    milestones: Object.freeze([]),
    source: "conversation",
    createdFromDecision: true as const,
    workspaceId,
    modelId: null,
    createdAt: "2026-10-16T00:00:00.000Z",
    startedAt: null,
    completedAt: null,
  });
}

async function workspace(principal: { userId: string }, name: string, kind: "BUSINESS" | "PROJECT") {
  const created = await createHostedWorkspace({ principal, name, kind });
  assert.equal(created.ok, true);
  if (!created.ok) throw new Error("workspace");
  return created.value;
}

test("hosted lifecycle deletes one workspace and preserves the rest", async () => {
  const directory = await mkdtemp(join(tmpdir(), "nexora-hosted-lifecycle-"));
  await openHostedWorkspaceDatabaseForTests(directory);
  try {
    const company = await workspace(userA, "Lifecycle Company", "BUSINESS");
    const project = await workspace(userA, "Lifecycle Project", "PROJECT");
    const companyB = await workspace(userB, "Lifecycle Company B", "BUSINESS");
    const renamed = await workspace(userA, "Lifecycle Company", "BUSINESS");
    assert.notEqual(renamed.workspaceId, company.workspaceId);

    const pending = await createHostedPendingCsv({
      workspaceId: company.workspaceId,
      fileName: "lifecycle.csv",
      csvText: "Date,Warehouse Used Capacity,Warehouse Total Capacity\n2026-01-01,10,20\n",
      now: new Date("2026-01-01T00:00:00.000Z"),
    });
    await assert.rejects(
      () => readHostedPendingCsv(company.workspaceId, pending.pendingId, new Date("2026-01-02T00:00:01.000Z")),
      /pending_not_found/,
    );
    const fresh = await createHostedPendingCsv({
      workspaceId: company.workspaceId,
      fileName: "lifecycle.csv",
      csvText: "Date,Warehouse Used Capacity,Warehouse Total Capacity\n2026-01-01,10,20\n",
    });
    const accepted = await acceptHostedPendingCsv({ workspaceId: company.workspaceId, pendingId: fresh.pendingId });
    assert.equal(await countHostedCustomerRows(company.workspaceId).then((rows) => rows.pending), 0);
    await removeHostedDataSource(company.workspaceId, accepted.sources[0]!.sourceContextId);
    assert.equal((await readHostedManagerDataSnapshot(company.workspaceId)).sources.length, 0);

    const keptPending = await createHostedPendingCsv({
      workspaceId: company.workspaceId,
      fileName: "keep-until-delete.csv",
      csvText: "Date,Warehouse Used Capacity,Warehouse Total Capacity\n2026-01-01,11,22\n",
    });
    await acceptHostedPendingCsv({ workspaceId: company.workspaceId, pendingId: keptPending.pendingId });
    await replaceHostedDecisionExecution(company.workspaceId, {
      decisions: [decision(company.workspaceId, "dec-lifecycle-company")],
      executions: [execution(company.workspaceId, "dec-lifecycle-company")],
    });
    await replaceHostedSavedScenes(company.workspaceId, [createSceneOrgSavedScene({
      sceneId: "scene-lifecycle-company",
      name: "Lifecycle Room",
      kind: "DEFAULT_MANAGER",
      sceneIntentType: "manager-view",
      managerWorkspaceId: company.workspaceId,
      canonicalReferences: [],
      layout: { presentationDepth: "minimum", leftRegion: "management", rightRegion: "contextual", detailWorkspace: "closed" },
    })]);
    await replaceHostedDecisionExecution(project.workspaceId, {
      decisions: [decision(project.workspaceId, "dec-lifecycle-project")],
      executions: [execution(project.workspaceId, "dec-lifecycle-project")],
    });
    await replaceHostedDecisionExecution(companyB.workspaceId, {
      decisions: [decision(companyB.workspaceId, "dec-lifecycle-b")],
      executions: [execution(companyB.workspaceId, "dec-lifecycle-b")],
    });

    const anonymous = await deleteHostedWorkspaceResponse(company.workspaceId);
    assert.equal(anonymous.status, 401);
    const foreign = await deleteOwnedHostedWorkspace({ principal: userB, workspaceId: company.workspaceId });
    assert.equal(foreign.ok, false);
    if (!foreign.ok) assert.equal(foreign.outcome, "NOT_AUTHORIZED");
    const hidden = hostedWorkspaceFailure("NOT_AUTHORIZED");
    const missing = hostedWorkspaceFailure("WORKSPACE_NOT_FOUND");
    assert.equal(hidden.status, missing.status);
    assert.equal(JSON.stringify(await hidden.json()), JSON.stringify(await missing.json()));

    failHostedWorkspaceDatabaseForTests(true);
    assert.equal((await deleteOwnedHostedWorkspace({ principal: userA, workspaceId: company.workspaceId })).ok, false);
    failHostedWorkspaceDatabaseForTests(false);
    assert.equal((await countHostedCustomerRows(company.workspaceId)).decisions, 1);

    failHostedDeletionMidTransactionForTests(true);
    assert.equal((await deleteOwnedHostedWorkspace({ principal: userA, workspaceId: company.workspaceId })).ok, false);
    failHostedDeletionMidTransactionForTests(false);
    assert.equal((await countHostedCustomerRows(company.workspaceId)).workspace, 1);
    assert.equal((await countHostedCustomerRows(company.workspaceId)).executions, 1);

    const deleted = await deleteOwnedHostedWorkspace({ principal: userA, workspaceId: company.workspaceId });
    assert.equal(deleted.ok, true);
    const again = await deleteOwnedHostedWorkspace({ principal: userA, workspaceId: company.workspaceId });
    assert.equal(again.ok, false);
    if (!again.ok) assert.equal(again.outcome, "WORKSPACE_NOT_FOUND");
    const gone = await countHostedCustomerRows(company.workspaceId);
    assert.deepEqual(gone, { workspace: 0, pending: 0, sources: 0, observations: 0, decisions: 0, executions: 0, scenes: 0 });
    assert.equal((await countHostedCustomerRows(project.workspaceId)).decisions, 1);
    assert.equal((await countHostedCustomerRows(companyB.workspaceId)).decisions, 1);
    const projected = projectHostedOperationalRecords(
      [],
      [decision(company.workspaceId, "dec-stale")],
      company.workspaceId,
    );
    assert.equal(projected.length, 0);
    const context = JSON.stringify(projectNexoraLlmManagementContext({
      workspaceId: project.workspaceId,
      utterance: "What remains?",
      resolvedSubjectId: null,
      subjectLabel: null,
      subjectKind: null,
      subjectEpistemic: null,
      referentId: null,
      referentProvenance: null,
    }));
    assert.equal(context.includes("dec-lifecycle-company"), false);
    assert.equal(context.includes(company.workspaceId), false);

    const account = await deleteOwnedHostedAccountData(userA);
    assert.equal(account.ok && account.deletedWorkspaces, 2);
    const retry = await deleteOwnedHostedAccountData(userA);
    assert.equal(retry.ok && retry.deletedWorkspaces, 0);
    assert.equal((await countHostedCustomerRows(project.workspaceId)).workspace, 0);
    assert.equal((await countHostedCustomerRows(renamed.workspaceId)).workspace, 0);
    assert.equal((await countHostedCustomerRows(companyB.workspaceId)).decisions, 1);
    assert.equal((await deleteOwnedHostedWorkspace({ principal: userA, workspaceId: "demo_workspace" })).ok, false);
  } finally {
    failHostedWorkspaceDatabaseForTests(false);
    failHostedDeletionMidTransactionForTests(false);
    await closeHostedWorkspaceDatabaseForTests();
    await rm(directory, { recursive: true, force: true });
  }
});
