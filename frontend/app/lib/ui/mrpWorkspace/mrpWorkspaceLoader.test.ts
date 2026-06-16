import test from "node:test";
import assert from "node:assert/strict";

import {
  MRP_BUILD_RECOVERED_TAG,
  MRP_CERTIFIED_WORKSPACE_RENDERER_CONNECTED_TAG,
  MRP_DYNAMIC_RENDER_ZONE_TAG,
  MRP_LOADER_RUNTIME_RECOVERED_TAG,
  MRP_PHASE4B_UNBLOCKED_TAG,
  MRP_WORKSPACE_LOADER_TAG,
} from "./mrpWorkspaceLoaderContract.ts";
import {
  MRP_WORKSPACE_IDS,
  MRP_WORKSPACE_REGISTRY,
  getMrpWorkspaceRegistryEntry,
} from "./mrpWorkspaceRegistry.ts";
import {
  resolveMrpWorkspaceId,
  resolveMrpWorkspaceMountPlan,
} from "./mrpWorkspaceResolver.ts";
import {
  getMrpWorkspaceLoaderSnapshot,
  getMrpWorkspaceMountGenerationForTests,
  mountMrpWorkspace,
  resetMrpWorkspaceLoaderRuntimeForTests,
  unmountMrpWorkspace,
  validateMrpWorkspaceLoaderInvariants,
} from "./mrpWorkspaceLoaderRuntime.ts";

test.beforeEach(() => {
  resetMrpWorkspaceLoaderRuntimeForTests();
});

test("registry defines all nine canonical workspaces", () => {
  assert.equal(MRP_WORKSPACE_IDS.length, 9);
  for (const id of MRP_WORKSPACE_IDS) {
    assert.equal(getMrpWorkspaceRegistryEntry(id).id, id);
    assert.ok(MRP_WORKSPACE_REGISTRY[id]);
  }
});

test("resolveMrpWorkspaceId maps overview contexts", () => {
  assert.equal(
    resolveMrpWorkspaceId({
      dashboardMode: "overview",
      dashboardContext: "overview",
    }),
    "executive_summary"
  );
  assert.equal(
    resolveMrpWorkspaceId({
      dashboardMode: "overview",
      dashboardContext: "risk",
    }),
    "risk"
  );
  assert.equal(
    resolveMrpWorkspaceId({
      dashboardMode: "overview",
      dashboardContext: "sources",
    }),
    "operational"
  );
});

test("resolveMrpWorkspaceId maps dedicated dashboard modes", () => {
  assert.equal(
    resolveMrpWorkspaceId({
      dashboardMode: "compare",
      dashboardContext: "compare",
    }),
    "compare"
  );
  assert.equal(
    resolveMrpWorkspaceId({
      dashboardMode: "war_room",
      dashboardContext: "war_room",
    }),
    "war_room"
  );
  assert.equal(
    resolveMrpWorkspaceId({
      dashboardMode: "analyze",
      dashboardContext: "risk",
    }),
    "risk"
  );
});

test("mount plan uses risk workspace for overview risk context", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "overview",
    dashboardContext: "risk",
  });
  assert.equal(plan.workspaceId, "risk");
  assert.equal(plan.mountTarget, "risk_workspace");
  assert.ok(plan.mountKey.includes("risk_workspace"));
});

test("mount plan uses operational workspace for overview sources context", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "overview",
    dashboardContext: "sources",
  });
  assert.equal(plan.workspaceId, "operational");
  assert.equal(plan.mountTarget, "operational_workspace");
  assert.ok(plan.mountKey.includes("operational_workspace"));
});

test("mount plan uses timeline workspace for overview timeline context", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "overview",
    dashboardContext: "timeline",
  });
  assert.equal(plan.workspaceId, "timeline");
  assert.equal(plan.mountTarget, "timeline_workspace");
  assert.ok(plan.mountKey.includes("timeline_workspace"));
});

test("mount plan uses timeline workspace for dedicated timeline mode", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "timeline",
    dashboardContext: "timeline",
  });
  assert.equal(plan.workspaceId, "timeline");
  assert.equal(plan.mountTarget, "timeline_workspace");
});

test("mount plan uses scenario workspace for dedicated scenario mode", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "scenario",
    dashboardContext: "scenario",
  });
  assert.equal(plan.workspaceId, "scenario");
  assert.equal(plan.mountTarget, "scenario_workspace");
});

test("mount plan uses scenario workspace for overview scenario context", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "overview",
    dashboardContext: "scenario",
  });
  assert.equal(plan.workspaceId, "scenario");
  assert.equal(plan.mountTarget, "scenario_workspace");
  assert.ok(plan.mountKey.includes("scenario_workspace"));
});

test("mount plan uses dashboard runtime for compare dashboard mode", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "compare",
    dashboardContext: "compare",
  });
  assert.equal(plan.workspaceId, "compare");
  assert.equal(plan.mountTarget, "dashboard_runtime");
  assert.ok(plan.mountKey.includes("compare:dashboard_runtime:compare:compare"));
});

test("mount plan uses war room workspace for dedicated war room mode", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "war_room",
    dashboardContext: "war_room",
  });
  assert.equal(plan.workspaceId, "war_room");
  assert.equal(plan.mountTarget, "war_room_workspace");
});

test("mount plan uses war room workspace for overview war room context", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "overview",
    dashboardContext: "war_room",
  });
  assert.equal(plan.workspaceId, "war_room");
  assert.equal(plan.mountTarget, "war_room_workspace");
  assert.ok(plan.mountKey.includes("war_room_workspace"));
});

test("workspace change unmounts previous and mounts new workspace", () => {
  mountMrpWorkspace({
    workspaceId: "executive_summary",
    mountKey: "executive_summary:dashboard_runtime:overview:overview:none",
  });
  assert.equal(getMrpWorkspaceLoaderSnapshot().activeMountCount, 1);

  const next = mountMrpWorkspace({
    workspaceId: "risk",
    mountKey: "risk:risk_workspace:overview:risk:none",
  });

  assert.equal(next.mounted, true);
  assert.equal(next.unmountedPrevious, true);
  assert.equal(getMrpWorkspaceLoaderSnapshot().activeMount?.workspaceId, "risk");
  assert.equal(getMrpWorkspaceMountGenerationForTests(), 2);
});

test("duplicate mount with same key is prevented", () => {
  const key = "risk:risk_workspace:overview:risk:none";
  mountMrpWorkspace({ workspaceId: "risk", mountKey: key });
  const duplicate = mountMrpWorkspace({ workspaceId: "risk", mountKey: key });

  assert.equal(duplicate.mounted, false);
  assert.equal(duplicate.duplicatePrevented, true);
  assert.equal(getMrpWorkspaceMountGenerationForTests(), 1);
});

test("unmount clears active mount", () => {
  const key = "operational:operational_workspace:overview:sources:none";
  mountMrpWorkspace({ workspaceId: "operational", mountKey: key });
  assert.equal(unmountMrpWorkspace(key), true);
  assert.equal(getMrpWorkspaceLoaderSnapshot().activeMount, null);
  assert.equal(getMrpWorkspaceLoaderSnapshot().activeMountCount, 0);
});

test("loader invariants enforce single active mount", () => {
  mountMrpWorkspace({
    workspaceId: "governance",
    mountKey: "governance:loader_shell:overview:settings:none",
  });
  const invariants = validateMrpWorkspaceLoaderInvariants();
  assert.equal(invariants.valid, true);
  assert.equal(invariants.activeMountCount, 1);
  assert.equal(invariants.maxActiveMounts, 1);
});

test("exports loader tags", () => {
  assert.equal(MRP_WORKSPACE_LOADER_TAG, "[MRP_WORKSPACE_LOADER]");
  assert.equal(MRP_DYNAMIC_RENDER_ZONE_TAG, "[MRP_DYNAMIC_RENDER_ZONE]");
  assert.equal(MRP_LOADER_RUNTIME_RECOVERED_TAG, "[MRP_LOADER_RUNTIME_RECOVERED]");
  assert.equal(MRP_BUILD_RECOVERED_TAG, "[MRP_BUILD_RECOVERED]");
  assert.equal(MRP_PHASE4B_UNBLOCKED_TAG, "[MRP_PHASE4B_UNBLOCKED]");
  assert.equal(
    MRP_CERTIFIED_WORKSPACE_RENDERER_CONNECTED_TAG,
    "[MRP_CERTIFIED_WORKSPACE_RENDERER_CONNECTED]"
  );
});

test("analyze mode resolves risk workspace id even when mount target is loader_shell", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "analyze",
    dashboardContext: "overview",
  });
  assert.equal(plan.workspaceId, "risk");
  assert.equal(plan.mountTarget, "loader_shell");
});
