import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { createSceneOrgSavedScene } from "../scene-org/sceneOrgWorkspacePlacementContract.ts";
import { createHostedWorkspace } from "./hostedWorkspaceCommands.ts";
import { getHostedOperations } from "./hostedOperationalHttp.ts";
import {
  projectHostedOperationalRecords,
  readHostedOperationalSnapshot,
  replaceHostedDecisionExecution,
  replaceHostedDecisions,
  replaceHostedExecutions,
  replaceHostedSavedScenes,
} from "./hostedOperationalPersistence.ts";
import {
  closeHostedWorkspaceDatabaseForTests,
  failHostedWorkspaceDatabaseForTests,
  openHostedWorkspaceDatabaseForTests,
} from "./hostedWorkspaceStore.ts";

const userA = Object.freeze({ userId: "dev:user_a" });
const userB = Object.freeze({ userId: "dev:user_b" });

function decision(workspaceId: string, decisionId: string, title: string) {
  return Object.freeze({
    decisionId,
    title,
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

function scene(workspaceId: string, sceneId: string, name: string, kind: "SAVED" | "DEFAULT_MANAGER" = "SAVED") {
  return createSceneOrgSavedScene({
    sceneId,
    name,
    kind,
    sceneIntentType: "manager-view",
    managerWorkspaceId: workspaceId,
    canonicalReferences: [],
    layout: {
      presentationDepth: "minimum",
      leftRegion: "management",
      rightRegion: "contextual",
      detailWorkspace: "closed",
    },
  });
}

async function workspace(principal: { userId: string }, name: string, kind: "BUSINESS" | "PROJECT") {
  const created = await createHostedWorkspace({ principal, name, kind });
  assert.equal(created.ok, true);
  if (!created.ok) throw new Error("workspace");
  return created.value;
}

test("hosted decisions, executions, and scenes stay workspace-owned", async () => {
  const directory = await mkdtemp(join(tmpdir(), "nexora-hosted-ops-"));
  await openHostedWorkspaceDatabaseForTests(directory);
  try {
    const companyA = await workspace(userA, "Company A", "BUSINESS");
    const projectA = await workspace(userA, "Project A", "PROJECT");
    const companyB = await workspace(userB, "Company B", "BUSINESS");
    const anonymous = await getHostedOperations(companyA.workspaceId);
    assert.equal(anonymous.status, 401);

    const created = decision(companyA.workspaceId, "dec-company", "Certify capacity");
    await replaceHostedDecisions(companyA.workspaceId, [created]);
    const updated = decision(companyA.workspaceId, "dec-company", "Certify capacity again");
    await replaceHostedDecisions(companyA.workspaceId, [updated]);
    await replaceHostedDecisions(companyA.workspaceId, [updated]);
    const decisions = await readHostedOperationalSnapshot(companyA.workspaceId);
    assert.equal(decisions.decisions.length, 1);
    assert.equal(decisions.decisions[0]?.title, "Certify capacity again");
    assert.equal(decisions.decisions[0]?.decisionId, "dec-company");

    await replaceHostedExecutions(companyA.workspaceId, [execution(companyA.workspaceId, "dec-company")]);
    await replaceHostedDecisionExecution(companyA.workspaceId, {
      decisions: [updated],
      executions: [execution(companyA.workspaceId, "dec-company")],
    });
    await assert.rejects(
      () => replaceHostedDecisionExecution(companyA.workspaceId, { decisions: [] }),
      /invalid_record/,
    );
    const linked = await readHostedOperationalSnapshot(companyA.workspaceId);
    assert.equal(linked.executions.length, 1);
    assert.equal(linked.executions[0]?.decisionId, "dec-company");
    assert.equal(linked.executions[0]?.executionId, "execution-dec-company");
    await assert.rejects(
      () => replaceHostedExecutions(companyA.workspaceId, [execution(projectA.workspaceId, "dec-company")]),
      /invalid_record/,
    );
    await assert.rejects(
      () => replaceHostedExecutions(companyA.workspaceId, [execution(companyA.workspaceId, "dec-other")]),
      /invalid_record/,
    );

    const saved = scene(companyA.workspaceId, "scene-capacity", "Capacity");
    await replaceHostedSavedScenes(companyA.workspaceId, [saved]);
    const renamed = scene(companyA.workspaceId, "scene-capacity", "Capacity room", "DEFAULT_MANAGER");
    await replaceHostedSavedScenes(companyA.workspaceId, [renamed]);
    const scenes = await readHostedOperationalSnapshot(companyA.workspaceId);
    assert.equal(scenes.scenes.length, 1);
    assert.equal(scenes.scenes[0]?.sceneId, "scene-capacity");
    assert.equal(scenes.scenes[0]?.name, "Capacity room");
    assert.equal(scenes.scenes[0]?.kind, "DEFAULT_MANAGER");
    await replaceHostedSavedScenes(companyA.workspaceId, []);
    assert.equal((await readHostedOperationalSnapshot(companyA.workspaceId)).scenes.length, 0);
    await replaceHostedSavedScenes(companyA.workspaceId, [renamed]);

    const projectDecision = decision(projectA.workspaceId, "dec-project", "Project decision");
    await replaceHostedDecisions(projectA.workspaceId, [projectDecision]);
    await replaceHostedExecutions(projectA.workspaceId, [execution(projectA.workspaceId, "dec-project")]);
    await replaceHostedSavedScenes(projectA.workspaceId, [scene(projectA.workspaceId, "scene-project", "Project scene", "DEFAULT_MANAGER")]);
    const companyOnly = await readHostedOperationalSnapshot(companyA.workspaceId);
    const projectOnly = await readHostedOperationalSnapshot(projectA.workspaceId);
    assert.equal(companyOnly.decisions.some((record) => record.decisionId === "dec-project"), false);
    assert.equal(projectOnly.decisions.some((record) => record.decisionId === "dec-company"), false);
    assert.equal(JSON.stringify(companyOnly).includes("csvText"), false);

    const projected = projectHostedOperationalRecords(
      companyOnly.decisions,
      [decision(companyA.workspaceId, "dec-company", "STALE BROWSER")],
      companyA.workspaceId,
    );
    assert.equal(projected.find((record) => record.decisionId === "dec-company")?.title, "Certify capacity again");

    const foreign = await readHostedOperationalSnapshot(companyB.workspaceId);
    assert.equal(foreign.decisions.length, 0);
    assert.equal(foreign.executions.length, 0);
    assert.equal(foreign.scenes.length, 0);
    await assert.rejects(
      () => replaceHostedDecisions("demo_workspace", [decision("demo_workspace", "dec-demo", "Demo")]),
      /workspace_not_found/,
    );

    await closeHostedWorkspaceDatabaseForTests();
    await openHostedWorkspaceDatabaseForTests(directory);
    const reopened = await readHostedOperationalSnapshot(companyA.workspaceId);
    assert.equal(reopened.decisions[0]?.decisionId, "dec-company");
    assert.equal(reopened.executions[0]?.executionId, "execution-dec-company");
    assert.equal(reopened.scenes[0]?.sceneId, "scene-capacity");
    assert.equal(reopened.scenes[0]?.kind, "DEFAULT_MANAGER");

    failHostedWorkspaceDatabaseForTests(true);
    await assert.rejects(() => readHostedOperationalSnapshot(companyA.workspaceId), /data_store_unavailable/);
    await assert.rejects(() => replaceHostedDecisions(companyA.workspaceId, [updated]), /data_store_unavailable/);
    await assert.rejects(() => replaceHostedSavedScenes(companyA.workspaceId, [renamed]), /data_store_unavailable/);
  } finally {
    failHostedWorkspaceDatabaseForTests(false);
    await closeHostedWorkspaceDatabaseForTests();
    await rm(directory, { recursive: true, force: true });
  }
});
