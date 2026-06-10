import test from "node:test";
import assert from "node:assert/strict";

import {
  DASHBOARD_HOME_CANONICAL_SECTION_ORDER,
  DASHBOARD_HOME_LAYOUT_ZONES,
  resetDashboardHomeLayoutBrakesForTests,
} from "./dashboardHomeLayoutContract.ts";
import { DASHBOARD_HOME_LAYOUT_LEGACY_ISOLATION } from "./dashboardHomeLayoutLegacyFindings.ts";
import {
  buildDashboardHomeLayoutView,
  sectionBelongsToZone,
  validateDashboardHomeSectionOrder,
} from "./dashboardHomeLayoutRuntime.ts";

test.beforeEach(() => {
  resetDashboardHomeLayoutBrakesForTests();
});

test("layout view exposes four canonical zones", () => {
  const view = buildDashboardHomeLayoutView();
  assert.equal(view.source, "dashboard_home_layout");
  assert.equal(view.zones.length, 4);
  assert.equal(view.zones[0]?.id, "executive_status");
  assert.equal(view.zones[1]?.id, "executive_action");
  assert.equal(view.zones[2]?.id, "executive_guidance");
  assert.equal(view.zones[3]?.id, "executive_continuity");
});

test("canonical section order matches executive scanning hierarchy", () => {
  assert.deepEqual(DASHBOARD_HOME_CANONICAL_SECTION_ORDER, [
    "executive_summary",
    "workspace_snapshot",
    "daily_readiness",
    "quick_actions",
    "recommendations_surface",
    "intelligence_briefing",
    "recent_activity_timeline",
    "favorites_layer",
    "workspace_recovery",
  ]);
});

test("validateDashboardHomeSectionOrder accepts canonical order", () => {
  const result = validateDashboardHomeSectionOrder(DASHBOARD_HOME_CANONICAL_SECTION_ORDER);
  assert.equal(result.valid, true);
});

test("validateDashboardHomeSectionOrder rejects drift", () => {
  const drifted = ["quick_actions", ...DASHBOARD_HOME_CANONICAL_SECTION_ORDER.slice(1)];
  const result = validateDashboardHomeSectionOrder(drifted);
  assert.equal(result.valid, false);
});

test("timeline belongs to continuity zone not status zone", () => {
  assert.equal(sectionBelongsToZone("recent_activity_timeline", "executive_continuity"), true);
  assert.equal(sectionBelongsToZone("recent_activity_timeline", "executive_status"), false);
});

test("readiness belongs to status zone", () => {
  assert.equal(sectionBelongsToZone("daily_readiness", "executive_status"), true);
  assert.equal(sectionBelongsToZone("workspace_snapshot", "executive_status"), true);
});

test("visual weight decreases from status to continuity", () => {
  assert.equal(DASHBOARD_HOME_LAYOUT_ZONES[0]?.visualWeight, "high");
  assert.equal(DASHBOARD_HOME_LAYOUT_ZONES[3]?.visualWeight, "low");
});

test("legacy isolation disables dynamic reorder", () => {
  assert.equal(DASHBOARD_HOME_LAYOUT_LEGACY_ISOLATION.stability.dynamicReorder, "disabled");
  assert.equal(DASHBOARD_HOME_LAYOUT_LEGACY_ISOLATION.removedDuplicates.recentWorkflowSurface.status, "removed_from_home");
});
