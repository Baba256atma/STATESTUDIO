import test from "node:test";
import assert from "node:assert/strict";

import {
  addNexoraWorkspace,
  appendNexoraAuditEvent,
  createDefaultNexoraOSState,
  createNexoraWorkspace,
  requestNexoraApproval,
  resolveNexoraApproval,
  setNexoraOSModule,
  switchNexoraWorkspace,
} from "./NexoraOSState.ts";
import { resolveNexoraOSRoute } from "./NexoraOSRouter.ts";

test("createDefaultNexoraOSState creates isolated workspace", () => {
  const state = createDefaultNexoraOSState(100);
  assert.equal(state.workspaces.length, 1);
  assert.equal(state.activeModule, "strategic_workspace");
  assert.equal(state.auditEvents[0]?.type, "os_started");
});

test("workspace switching only accepts existing workspace", () => {
  const state = createDefaultNexoraOSState(100);
  const workspace = createNexoraWorkspace({ title: "Finance", domain: "finance", now: 200 });
  const withWorkspace = addNexoraWorkspace(state, workspace);
  assert.equal(switchNexoraWorkspace(withWorkspace, workspace.id).activeWorkspaceId, workspace.id);
  assert.equal(switchNexoraWorkspace(withWorkspace, "missing"), withWorkspace);
});

test("approval requests are explicit and resolvable", () => {
  const state = createDefaultNexoraOSState(100);
  const requested = requestNexoraApproval(state, {
    id: "approve_execution",
    action: "execute scenario",
    requestedBy: "manager",
  });
  assert.equal(requested.approvals.length, 1);
  assert.equal(requested.approvals[0]?.approved, false);
  const approved = resolveNexoraApproval(requested, "approve_execution", true);
  assert.equal(approved.approvals[0]?.approved, true);
});

test("audit events are deduped", () => {
  const state = createDefaultNexoraOSState(100);
  const event = { id: "audit_1", type: "decision", timestamp: 200, details: "Reviewed" };
  const once = appendNexoraAuditEvent(state, event);
  const twice = appendNexoraAuditEvent(once, event);
  assert.equal(once.auditEvents.length, twice.auditEvents.length);
});

test("module routing resolves active layer safely", () => {
  assert.equal(resolveNexoraOSRoute({ requestedModule: "sandbox" }).module, "sandbox");
  assert.equal(resolveNexoraOSRoute({ hasExecution: true }).module, "execution");
  assert.equal(resolveNexoraOSRoute({ hasSimulation: true }).module, "war_room");
});

test("setNexoraOSModule is immutable when changed", () => {
  const state = createDefaultNexoraOSState(100);
  const next = setNexoraOSModule(state, "governance");
  assert.equal(next.activeModule, "governance");
  assert.notEqual(next, state);
});
