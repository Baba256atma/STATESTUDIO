/**
 * NPA-T MANAGER-WORKSPACE-ISOLATION:7 — Decision Memory, Approval, and Collaboration.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { appendApprovalDecision, loadApprovalWorkflowEnvelope, type ApprovalWorkflowStorage } from "../approval/approvalWorkflowStore.ts";
import type { ApprovalWorkflowState } from "../approval/approvalWorkflowTypes.ts";
import { BUSINESS_PROJECT_CONTEXT_BOUNDARY } from "../business-context-awareness/businessProjectContextContract.ts";
import { appendCollaborationInput, loadCollaborationEnvelope, type CollaborationStorage } from "../collaboration/collaborationStore.ts";
import type { CollaborationInput } from "../collaboration/collaborationTypes.ts";
import {
  appendDecisionMemoryEntry,
  loadDecisionMemoryEntries,
  type DecisionMemoryStorage,
} from "../decision/memory/decisionMemoryStore.ts";
import type { DecisionMemoryEntry } from "../decision/memory/decisionMemoryTypes.ts";
import { NMI_AUTHORITY_BOUNDARY } from "../nmi/nmiAuthorityBoundary.ts";
import { nmiFoundationIdentity } from "../nmi/nmiIdentity.ts";
import { bindWorkflowMode, createManagerWorkspace, readLiveExecutiveDataWorkspaceId } from "./managerWorkspaceIdentity.ts";
import { DEMO_WORKSPACE_ID } from "./workspaceRegistryContract.ts";
import { setActiveWorkspace, resetWorkspaceRegistryForTests } from "./workspaceRegistryStore.ts";
import {
  applyLegacyManagerFallbackMigration,
  LEGACY_MANAGER_WORKSPACE_FALLBACK,
  resolveManagerRecordWorkspaceId,
} from "./liveManagerDataWorkspaceGuard.ts";

const memorySource = readFileSync(new URL("../decision/memory/decisionMemoryStore.ts", import.meta.url), "utf8");
const approvalSource = readFileSync(new URL("../approval/approvalWorkflowStore.ts", import.meta.url), "utf8");
const collaborationSource = readFileSync(new URL("../collaboration/collaborationStore.ts", import.meta.url), "utf8");

class MemoryStorage implements DecisionMemoryStorage, ApprovalWorkflowStorage, CollaborationStorage {
  readonly values = new Map<string, string>();
  get length() { return this.values.size; }
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
}

function memoryEntry(id: string, title: string, workspaceId?: string | null): DecisionMemoryEntry {
  return {
    id,
    created_at: 1,
    workspace_id: workspaceId,
    title,
    source: "manual",
  };
}

function workflow(decisionId: string): ApprovalWorkflowState {
  return {
    decision_id: decisionId,
    required: true,
    status: "pending_review",
    allowed_post_approval_actions: [],
    blocked_until_approval_actions: [],
    decisions: [],
    explanation: "Review",
    next_steps: [],
  };
}

function collabInput(id: string, summary: string): CollaborationInput {
  return {
    id,
    timestamp: 1,
    user_id: "ada",
    user_label: "Ada",
    role: "manager",
    kind: "concern",
    summary,
  };
}

test.beforeEach(() => resetWorkspaceRegistryForTests());
test.afterEach(() => resetWorkspaceRegistryForTests());

test("MWI:7 I1–I6 I8–I10 BAHA and Factory keep memory, approval, and collaboration apart", () => {
  const baha = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  const factory = createManagerWorkspace({ name: "Factory Expansion", kind: "PROJECT" });
  assert.ok(baha);
  assert.ok(factory);
  setActiveWorkspace(baha.workspaceId);
  const storage = new MemoryStorage();

  const bahaMemory = appendDecisionMemoryEntry({
    workspaceId: baha.workspaceId,
    projectId: "doors",
    entry: memoryEntry("memory-a", "BAHA memory", baha.workspaceId),
    storage,
  });
  const factoryMemory = appendDecisionMemoryEntry({
    workspaceId: factory.workspaceId,
    projectId: "line",
    entry: memoryEntry("memory-b", "Factory memory", factory.workspaceId),
    storage,
  });
  assert.deepEqual(bahaMemory.map((entry) => entry.id), ["memory-a"]);
  assert.deepEqual(loadDecisionMemoryEntries(baha.workspaceId, "doors", storage).map((entry) => entry.id), ["memory-a"]);
  assert.deepEqual(loadDecisionMemoryEntries(factory.workspaceId, "line", storage).map((entry) => entry.id), ["memory-b"]);
  assert.equal(factoryMemory[0]?.id, "memory-b");
  const refusedMemory = appendDecisionMemoryEntry({
    workspaceId: baha.workspaceId,
    projectId: "doors",
    entry: memoryEntry("memory-b", "Factory memory", factory.workspaceId),
    existing: bahaMemory,
    storage,
  });
  assert.deepEqual(refusedMemory.map((entry) => entry.id), ["memory-a"]);

  appendApprovalDecision({
    workspaceId: baha.workspaceId,
    decisionId: "decision-a",
    actorRole: "manager",
    decision: "approved",
    workflow: workflow("decision-a"),
    storage,
  });
  appendApprovalDecision({
    workspaceId: factory.workspaceId,
    decisionId: "decision-b",
    actorRole: "manager",
    decision: "rejected",
    workflow: workflow("decision-b"),
    storage,
  });
  const bahaApproval = loadApprovalWorkflowEnvelope(baha.workspaceId, null, "decision-a", storage);
  const factoryApproval = loadApprovalWorkflowEnvelope(factory.workspaceId, null, "decision-b", storage);
  assert.equal(bahaApproval?.workflow.decisions[0]?.decision, "approved");
  assert.equal(factoryApproval?.workflow.decisions[0]?.decision, "rejected");
  assert.equal(loadApprovalWorkflowEnvelope(baha.workspaceId, null, "decision-b", storage), null);
  const before = storage.getItem(`nexora.approvalWorkflow.${baha.workspaceId}.default_project.decision-a`);
  appendApprovalDecision({
    workspaceId: baha.workspaceId,
    decisionId: "decision-a",
    actorRole: "manager",
    decision: "rejected",
    workflow: workflow("decision-a"),
    sourceWorkspaceId: factory.workspaceId,
    storage,
  });
  assert.equal(storage.getItem(`nexora.approvalWorkflow.${baha.workspaceId}.default_project.decision-a`), before);

  appendCollaborationInput({
    workspaceId: baha.workspaceId,
    decisionId: "decision-a",
    input: collabInput("collab-a", "BAHA concern"),
    storage,
  });
  appendCollaborationInput({
    workspaceId: factory.workspaceId,
    decisionId: "decision-b",
    input: collabInput("collab-b", "Factory concern"),
    storage,
  });
  assert.equal(loadCollaborationEnvelope(baha.workspaceId, null, "decision-a", storage)?.inputs[0]?.id, "collab-a");
  assert.equal(loadCollaborationEnvelope(factory.workspaceId, null, "decision-b", storage)?.inputs[0]?.id, "collab-b");
  assert.equal(loadCollaborationEnvelope(baha.workspaceId, null, "decision-b", storage), null);
  const collabBefore = storage.getItem(`nexora.collaboration.${factory.workspaceId}.default_project.decision-b`);
  appendCollaborationInput({
    workspaceId: factory.workspaceId,
    decisionId: "decision-b",
    input: collabInput("collab-x", "Cross write"),
    sourceWorkspaceId: baha.workspaceId,
    storage,
  });
  assert.equal(storage.getItem(`nexora.collaboration.${factory.workspaceId}.default_project.decision-b`), collabBefore);

  for (const mode of ["overview", "problem", "scenario", "decision", "execution"] as const) {
    bindWorkflowMode({ workspaceId: baha.workspaceId, workflowMode: mode });
    assert.equal(readLiveExecutiveDataWorkspaceId(), baha.workspaceId);
    assert.equal(resolveManagerRecordWorkspaceId(null), baha.workspaceId);
    assert.equal(loadDecisionMemoryEntries(null, "doors", storage)[0]?.id, "memory-a");
    assert.equal(loadDecisionMemoryEntries("overview", "doors", storage).length, 0);
  }
  assert.equal(resolveManagerRecordWorkspaceId("overview"), null);
  assert.equal(bahaMemory[0]?.workspace_id, baha.workspaceId);
  assert.notEqual(bahaMemory[0]?.workspace_id, LEGACY_MANAGER_WORKSPACE_FALLBACK);
});

test("MWI:7 I7/I11/I12 historical default_workspace stays put unless one proof names an owner", () => {
  const storage = new MemoryStorage();
  const legacy = appendDecisionMemoryEntry({
    workspaceId: null,
    projectId: "legacy",
    entry: memoryEntry("memory-old", "Unassigned memory"),
    storage,
  });
  assert.equal(legacy[0]?.workspace_id, LEGACY_MANAGER_WORKSPACE_FALLBACK);
  assert.equal([...storage.values.keys()].some((key) => key.includes(LEGACY_MANAGER_WORKSPACE_FALLBACK)), true);

  const baha = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  assert.ok(baha);
  assert.deepEqual(loadDecisionMemoryEntries(baha.workspaceId, "legacy", storage), []);
  assert.equal(storage.getItem(`nexora.decisionMemory.${LEGACY_MANAGER_WORKSPACE_FALLBACK}.legacy`)?.includes("memory-old"), true);

  const guessed = applyLegacyManagerFallbackMigration(legacy, {
    activeWorkspaceId: baha.workspaceId,
    proofs: [{ recordId: "memory-old", targetWorkspaceId: baha.workspaceId, basis: "active-workspace" }],
  });
  assert.equal(guessed.changed, false);
  assert.equal(guessed.records, legacy);
  const moved = applyLegacyManagerFallbackMigration(legacy, {
    proofs: [{ recordId: "memory-old", targetWorkspaceId: baha.workspaceId, basis: "linked-decision-owner" }],
  });
  assert.equal(moved.changed, true);
  assert.equal(moved.records[0]?.id, "memory-old");
  assert.equal(moved.records[0]?.workspace_id, baha.workspaceId);
  const second = applyLegacyManagerFallbackMigration(moved.records, {
    proofs: [{ recordId: "memory-old", targetWorkspaceId: "factory", basis: "explicit-source-link" }],
  });
  assert.equal(second.changed, false);
  assert.equal(second.records, moved.records);

  assert.deepEqual(loadDecisionMemoryEntries(LEGACY_MANAGER_WORKSPACE_FALLBACK, "legacy", storage), []);
  assert.equal(storage.getItem(`nexora.decisionMemory.${LEGACY_MANAGER_WORKSPACE_FALLBACK}.legacy`)?.includes("memory-old"), true);
});

test("MWI:7 I13–I16 the three stores stay independent of Decision truth and NMI", () => {
  assert.equal(resolveManagerRecordWorkspaceId(null), LEGACY_MANAGER_WORKSPACE_FALLBACK);
  assert.equal(DEMO_WORKSPACE_ID, "demo_workspace");
  assert.doesNotMatch(memorySource, /executiveDecisionRuntimeAdapter|approvalWorkflowStore|collaborationStore/);
  assert.doesNotMatch(approvalSource, /executiveDecisionRuntimeAdapter|decisionMemoryStore|collaborationStore/);
  assert.doesNotMatch(collaborationSource, /executiveDecisionRuntimeAdapter|decisionMemoryStore|approvalWorkflowStore/);
  assert.match(memorySource, /resolveManagerRecordWorkspaceId/);
  assert.match(approvalSource, /resolveManagerRecordWorkspaceId/);
  assert.match(collaborationSource, /resolveManagerRecordWorkspaceId/);
  assert.equal(nmiFoundationIdentity, "NPA-T NMI:1/ManagementIntelligenceFoundation");
  assert.equal(NMI_AUTHORITY_BOUNDARY.businessProjectContext, "BCA:1/BusinessProjectContextFoundation");
  assert.equal(BUSINESS_PROJECT_CONTEXT_BOUNDARY.ownsContextInterpretation, true);
});
