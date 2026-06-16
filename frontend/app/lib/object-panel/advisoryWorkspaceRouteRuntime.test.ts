import test from "node:test";
import assert from "node:assert/strict";

import { mapLegacyPanelRouteToDashboardContext } from "../ui/mainRightPanelContract.ts";
import { normalizeObjectPanelDashboardAction } from "./objectPanelActionRouterContract.ts";
import { ADVISORY_LEGACY_SURFACE_REMOVED_TAG } from "./advisoryWorkspaceRouteContract.ts";
import { resolveMrpWorkspaceMountPlan } from "../ui/mrpWorkspace/mrpWorkspaceResolver.ts";
import { buildMrpContextHeaderView } from "../ui/mrpContext/mrpContextResolver.ts";

test("legacy advice routes map to advisory dashboard context", () => {
  assert.equal(mapLegacyPanelRouteToDashboardContext("advice", { warn: false }), "advisory");
  assert.equal(mapLegacyPanelRouteToDashboardContext("strategic_advice", { warn: false }), "advisory");
  assert.equal(mapLegacyPanelRouteToDashboardContext("recommendation", { warn: false }), "advisory");
});

test("legacy executive actions normalize to advisory object panel action", () => {
  assert.equal(normalizeObjectPanelDashboardAction("explain_object"), "advisory");
  assert.equal(normalizeObjectPanelDashboardAction("next_move"), "advisory");
  assert.equal(normalizeObjectPanelDashboardAction("open_decision_analysis"), "advisory");
});

test("dashboardContext advisory resolves advisory workspace mount", () => {
  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "advisory",
    dashboardContext: "advisory",
    subWorkspaceMode: "advisory",
  });
  assert.equal(plan.workspaceId, "advisory");
  assert.equal(plan.mountTarget, "advisory_workspace");
});

test("context header shows advisory panel and recommendation mode", () => {
  const header = buildMrpContextHeaderView(
    {
      activeTab: "dashboard",
      dashboardMode: "advisory",
      dashboardContext: "advisory",
      selectedObjectId: "machine-a",
      selectedObjectLabel: "Machine A",
      routeObjectId: "machine-a",
      routeObjectName: "Machine A",
      subWorkspaceMode: "advisory",
    },
    1
  );
  assert.equal(header.panelName, "Advisory");
  assert.equal(header.activeMode, "Recommendation / Overview");
  assert.equal(header.selectedObject, "Machine A");
});

test("exports advisory legacy surface removed tag", () => {
  assert.equal(ADVISORY_LEGACY_SURFACE_REMOVED_TAG, "[ADVISORY_LEGACY_SURFACE_REMOVED]");
});
