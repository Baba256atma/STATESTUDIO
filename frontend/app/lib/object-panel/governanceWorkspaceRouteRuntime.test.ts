import test from "node:test";
import assert from "node:assert/strict";

import { resolveMrpWorkspaceMountPlan } from "../ui/mrpWorkspace/mrpWorkspaceResolver.ts";
import { buildMrpContextHeaderView } from "../ui/mrpContext/mrpContextResolver.ts";

const GOVERNANCE_DASHBOARD_CONTEXT = "governance" as const;
const GOVERNANCE_RUNTIME_ROUTE_TAG = "[MRP_5B2_RUNTIME]" as const;

test("dashboardContext governance resolves governance workspace mount", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "governance",
    dashboardContext: "governance",
    subWorkspaceMode: null,
  });
  assert.equal(plan.workspaceId, "governance");
  assert.equal(plan.mountTarget, "governance_workspace");
});

test("context header shows governance panel and approval mode", () => {
  const header = buildMrpContextHeaderView(
    {
      activeTab: "dashboard",
      dashboardMode: "governance",
      dashboardContext: "governance",
      selectedObjectId: "factory-a",
      selectedObjectLabel: "Factory A",
      routeObjectId: "factory-a",
      routeObjectName: "Factory A",
      subWorkspaceMode: null,
    },
    1
  );
  assert.equal(header.panelName, "Governance");
  assert.equal(header.activeMode, "Approval • Policy • Authority");
  assert.equal(header.selectedObject, "Factory A");
});

test("exports governance route constants", () => {
  assert.equal(GOVERNANCE_DASHBOARD_CONTEXT, "governance");
  assert.equal(GOVERNANCE_RUNTIME_ROUTE_TAG, "[MRP_5B2_RUNTIME]");
});
