import test from "node:test";
import assert from "node:assert/strict";

import {
  mapRightPanelViewToLegacyTab,
  resolveCanonicalRightPanelRoute,
  resolveRightPanelLeftNavRoute,
  resolveRightPanelRailRoute,
  resolveRightPanelShellSectionForView,
  resolveSafeRightPanelView,
} from "./rightPanelRouter.ts";

test("left nav scene_group resolves to workspace view and scene shell section", () => {
  const route = resolveRightPanelLeftNavRoute("scene_group");

  assert.ok(route);
  assert.equal(route?.resolvedView, "workspace");
  assert.equal(route?.legacyTab, "scene");
  assert.equal(route?.shellSection, "scene");
});

test("left nav risk_group resolves to risk without falling back to simulate", () => {
  const route = resolveRightPanelLeftNavRoute("risk_group");

  assert.ok(route);
  assert.equal(route?.resolvedView, "risk");
  assert.notEqual(route?.resolvedView, "simulate");
});

test("left nav executive_group resolves to dashboard and not simulate", () => {
  const route = resolveRightPanelLeftNavRoute("executive_group");

  assert.ok(route);
  assert.equal(route?.resolvedView, "dashboard");
  assert.notEqual(route?.resolvedView, "simulate");
});

test("right rail object_focus resolves to object_focus and focus section", () => {
  const route = resolveRightPanelRailRoute("object_focus");

  assert.ok(route);
  assert.equal(route?.resolvedView, "object_focus");
  assert.equal(route?.shellSection, "focus");
});

test("right rail risk_flow resolves to risk and not workspace", () => {
  const route = resolveRightPanelRailRoute("risk_flow");

  assert.ok(route);
  assert.equal(route?.resolvedView, "risk");
  assert.notEqual(route?.resolvedView, "workspace");
});

test("right rail fragility_scan resolves to fragility view and fragility shell section", () => {
  const route = resolveRightPanelRailRoute("fragility_scan");

  assert.ok(route);
  assert.equal(route?.resolvedView, "fragility");
  assert.equal(route?.shellSection, "fragility");
});

test("right rail input resolves to input view and input shell section; legacy tab is input not scene", () => {
  const route = resolveRightPanelRailRoute("input");

  assert.ok(route);
  assert.equal(route?.resolvedView, "input");
  assert.equal(route?.shellSection, "input");
  assert.equal(mapRightPanelViewToLegacyTab("input"), "input");
  assert.equal(resolveRightPanelShellSectionForView("input"), "input");
  assert.notEqual(resolveRightPanelShellSectionForView("input"), "scene");
  assert.notEqual(resolveRightPanelShellSectionForView("input"), "workspace");
});

test("invalid click target is blocked instead of silently rerouted", () => {
  assert.equal(resolveRightPanelRailRoute("not_a_real_tab"), null);
  assert.equal(resolveCanonicalRightPanelRoute({ legacyTab: "not_a_real_tab" }), null);
  assert.equal(resolveSafeRightPanelView("", "direct_open"), null);
});

test("repeated click resolution stays deterministic", () => {
  const first = resolveCanonicalRightPanelRoute({ legacyTab: "risk_flow" });
  const second = resolveCanonicalRightPanelRoute({ legacyTab: "risk_flow" });

  assert.deepEqual(second, first);
});

test("legacy tab wins over mismatched raw target for click routing", () => {
  const route = resolveCanonicalRightPanelRoute({
    legacyTab: "risk_flow",
    requestedView: "workspace",
  });

  assert.ok(route);
  assert.equal(route?.resolvedView, "risk");
  assert.equal(route?.fallbackReason, "legacy_tab_preferred_over_requested_view");
});

test("click routing does not default unrelated targets to simulate", () => {
  const focusRoute = resolveCanonicalRightPanelRoute({ legacyTab: "object_focus" });
  const riskRoute = resolveCanonicalRightPanelRoute({ legacyTab: "risk_flow" });
  const executiveRoute = resolveCanonicalRightPanelRoute({ leftNav: "executive_group" });

  assert.equal(focusRoute?.resolvedView, "object_focus");
  assert.equal(riskRoute?.resolvedView, "risk");
  assert.equal(executiveRoute?.resolvedView, "dashboard");
  assert.notEqual(focusRoute?.resolvedView, "simulate");
  assert.notEqual(riskRoute?.resolvedView, "simulate");
  assert.notEqual(executiveRoute?.resolvedView, "simulate");
});
