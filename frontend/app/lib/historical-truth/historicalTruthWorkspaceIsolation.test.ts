/**
 * NPA-T MANAGER-WORKSPACE-ISOLATION:6 — Timeline historical truth isolation.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { BUSINESS_PROJECT_CONTEXT_BOUNDARY } from "../business-context-awareness/businessProjectContextContract.ts";
import {
  createNexoraCanonicalDecisionRuntime,
  hydrateNexoraCanonicalDecisionRuntimeRecords,
  serializeNexoraCanonicalDecisionRuntimeState,
} from "../conversational-control/executiveDecisionRuntimeAdapter.ts";
import { NMI_AUTHORITY_BOUNDARY } from "../nmi/nmiAuthorityBoundary.ts";
import { nmiFoundationIdentity } from "../nmi/nmiIdentity.ts";
import {
  applyNexoraMVPFlowDomainAction,
  createInitialNexoraMVPFlowDomainState,
} from "../nex-mvp/nexoraMVPExecutiveFlow.ts";
import { bindWorkflowMode, createManagerWorkspace, readLiveExecutiveDataWorkspaceId } from "../workspace/managerWorkspaceIdentity.ts";
import { DEMO_WORKSPACE_ID } from "../workspace/workspaceRegistryContract.ts";
import { resetWorkspaceRegistryForTests } from "../workspace/workspaceRegistryStore.ts";
import { HISTORICAL_PRESENTATION_BOUNDARY } from "./historicalTruthPresentation.ts";
import {
  applyTimelineOwnershipMigration,
  assessTimelineEventWorkspace,
  selectTimelineCapturesForManagerWorkspace,
  selectTimelineRecordsForManagerWorkspace,
  TIMELINE_DEMO_WORKSPACE_ID,
  TIMELINE_OWNERSHIP_EVIDENCE,
} from "./historicalTruthPresentation.ts";

const shellSource = readFileSync(new URL("../../executive/nex-mvp/NexoraExecutiveShell.tsx", import.meta.url), "utf8");

test.beforeEach(() => resetWorkspaceRegistryForTests());
test.afterEach(() => resetWorkspaceRegistryForTests());

test("MWI:6 I1–I8 Timeline history stays inside the owning Manager Workspace", () => {
  const baha = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  const factory = createManagerWorkspace({ name: "Factory Expansion", kind: "PROJECT" });
  assert.ok(baha);
  assert.ok(factory);
  const records = [
    { eventId: "event-baha", workspaceId: baha.workspaceId, title: "BAHA approval" },
    { eventId: "event-factory", workspaceId: factory.workspaceId, title: "Factory approval" },
    { eventId: "event-overview", workspaceId: "overview", title: "Legacy overview" },
    { eventId: "event-decision", workspaceId: "decision", title: "Legacy decision" },
    { eventId: "event-demo", workspaceId: DEMO_WORKSPACE_ID, title: "Demo history" },
    { eventId: "event-blank", workspaceId: null, title: "Unassigned" },
  ];
  assert.deepEqual(
    selectTimelineRecordsForManagerWorkspace(records, baha.workspaceId).map((entry) => entry.eventId),
    ["event-baha"],
  );
  assert.deepEqual(
    selectTimelineRecordsForManagerWorkspace(records, factory.workspaceId).map((entry) => entry.eventId),
    ["event-factory"],
  );
  assert.deepEqual(
    selectTimelineRecordsForManagerWorkspace(records, TIMELINE_DEMO_WORKSPACE_ID).map((entry) => entry.eventId),
    ["event-demo"],
  );
  assert.deepEqual(selectTimelineRecordsForManagerWorkspace(records, "execution"), []);

  for (const mode of ["overview", "problem", "scenario", "decision", "execution"] as const) {
    bindWorkflowMode({ workspaceId: factory.workspaceId, workflowMode: mode });
    assert.equal(readLiveExecutiveDataWorkspaceId(), factory.workspaceId);
    assert.deepEqual(
      selectTimelineRecordsForManagerWorkspace(records, readLiveExecutiveDataWorkspaceId()).map((entry) => entry.eventId),
      ["event-factory"],
    );
  }

  const decisions = [
    { decisionId: "decision-baha", workspaceId: baha.workspaceId },
    { decisionId: "decision-overview", workspaceId: "overview" },
  ];
  const executions = [
    { executionId: "execution-baha", workspaceId: baha.workspaceId },
    { executionId: "execution-overview", workspaceId: "overview" },
  ];
  const captures = [
    { observationId: "capture-baha", decisionId: "decision-baha", executionId: null },
    { observationId: "capture-overview", decisionId: "decision-overview", executionId: null },
    { observationId: "capture-loose", decisionId: null, executionId: null },
  ];
  assert.deepEqual(
    selectTimelineCapturesForManagerWorkspace(captures, decisions, executions, baha.workspaceId).map((entry) => entry.observationId),
    ["capture-baha"],
  );
  assert.equal(assessTimelineEventWorkspace(factory.workspaceId, baha.workspaceId).status, "mismatch");
  assert.equal(assessTimelineEventWorkspace("overview", baha.workspaceId).status, "workflow-excluded");
  assert.equal(assessTimelineEventWorkspace(null, baha.workspaceId).status, "unassigned");
  assert.equal(assessTimelineEventWorkspace(baha.workspaceId, baha.workspaceId).status, "allowed");
  assert.equal(HISTORICAL_PRESENTATION_BOUNDARY.persists, false);
  assert.equal(HISTORICAL_PRESENTATION_BOUNDARY.mutatesAuthorities, false);
  assert.equal(HISTORICAL_PRESENTATION_BOUNDARY.establishesCausation, false);
});

test("MWI:6 I5/I6/I9/I10 ownership moves only by proof and decision hydration keeps it", () => {
  const baha = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  const factory = createManagerWorkspace({ name: "Factory Expansion", kind: "PROJECT" });
  assert.ok(baha);
  assert.ok(factory);
  const historical = [{ eventId: "event-old", workspaceId: "overview" }];
  const guessed = applyTimelineOwnershipMigration(historical, {
    activeWorkspaceId: baha.workspaceId,
    proofs: [{ eventId: "event-old", targetWorkspaceId: baha.workspaceId, basis: "active-workspace" }],
  });
  assert.equal(guessed.changed, false);
  assert.equal(guessed.records, historical);
  assert.equal(TIMELINE_OWNERSHIP_EVIDENCE.rejected.includes("active-workspace"), true);
  assert.equal(TIMELINE_OWNERSHIP_EVIDENCE.rejected.includes("workflow-mode"), true);

  const conflict = applyTimelineOwnershipMigration(historical, {
    proofs: [
      { eventId: "event-old", targetWorkspaceId: baha.workspaceId, basis: "explicit-source-link" },
      { eventId: "event-old", targetWorkspaceId: factory.workspaceId, basis: "canonical-source-relationship" },
    ],
  });
  assert.equal(conflict.changed, false);
  assert.equal(conflict.records[0]?.workspaceId, "overview");

  const moved = applyTimelineOwnershipMigration(historical, {
    activeWorkspaceId: factory.workspaceId,
    proofs: [{ eventId: "event-old", targetWorkspaceId: baha.workspaceId, basis: "durable-event-source" }],
  });
  assert.equal(moved.changed, true);
  assert.equal(moved.records[0]?.eventId, "event-old");
  assert.equal(moved.records[0]?.workspaceId, baha.workspaceId);
  const second = applyTimelineOwnershipMigration(moved.records, {
    proofs: [{ eventId: "event-old", targetWorkspaceId: factory.workspaceId, basis: "explicit-source-link" }],
  });
  assert.equal(second.changed, false);
  assert.equal(second.records, moved.records);

  const runtime = createNexoraCanonicalDecisionRuntime();
  const applied = runtime.adapter.transitionDecision({
    decisionId: "cc10:decision:baha",
    action: "approve",
    title: "Expand Capacity",
    subjectIds: ["obj-capacity"],
    workspaceId: baha.workspaceId,
    committedAt: "2026-10-12T12:00:00.000Z",
  });
  assert.equal(applied.decision?.workspaceId, baha.workspaceId);
  const serialized = serializeNexoraCanonicalDecisionRuntimeState(runtime.getState());
  const hydrated = hydrateNexoraCanonicalDecisionRuntimeRecords(serialized, []);
  assert.equal(hydrated[0]?.decisionId, "cc10:decision:baha");
  assert.equal(hydrated[0]?.workspaceId, baha.workspaceId);
  assert.equal(hydrated[0]?.committedAt, "2026-10-12T12:00:00.000Z");
});

test("MWI:6 a new Decision takes the live Manager Workspace and an existing workflow owner stays", () => {
  const baha = createManagerWorkspace({ name: "BAHA Doors", kind: "BUSINESS" });
  assert.ok(baha);
  const fresh = createNexoraCanonicalDecisionRuntime();
  const created = applyNexoraMVPFlowDomainAction(
    createInitialNexoraMVPFlowDomainState(),
    {
      actionId: "act-decision-approve",
      subjectId: "ctx-decision-reprice",
      kind: "approve-decision",
    },
    { decisionRuntime: fresh.adapter, managerWorkspaceId: baha.workspaceId },
  );
  assert.equal(created.ok, true);
  assert.equal(fresh.adapter.getDecision("ctx-decision-reprice")?.workspaceId, baha.workspaceId);

  const legacy = createNexoraCanonicalDecisionRuntime();
  legacy.adapter.transitionDecision({
    decisionId: "ctx-decision-reprice",
    action: "approve",
    title: "Reprice",
    workspaceId: "overview",
    committedAt: "2026-08-15T12:00:00.000Z",
  });
  applyNexoraMVPFlowDomainAction(
    createInitialNexoraMVPFlowDomainState(),
    {
      actionId: "act-decision-approve",
      subjectId: "ctx-decision-reprice",
      kind: "approve-decision",
    },
    { decisionRuntime: legacy.adapter, managerWorkspaceId: baha.workspaceId },
  );
  assert.equal(legacy.adapter.getDecision("ctx-decision-reprice")?.workspaceId, "overview");
  assert.match(shellSource, /managerWorkspaceId: readLiveExecutiveDataWorkspaceId\(\)/);
  assert.match(shellSource, /selectTimelineRecordsForManagerWorkspace/);
  assert.match(shellSource, /historicalLensRange\(timelineLens/);
  assert.equal(nmiFoundationIdentity, "NPA-T NMI:1/ManagementIntelligenceFoundation");
  assert.equal(NMI_AUTHORITY_BOUNDARY.businessProjectContext, "BCA:1/BusinessProjectContextFoundation");
  assert.equal(BUSINESS_PROJECT_CONTEXT_BOUNDARY.ownsContextInterpretation, true);
});
