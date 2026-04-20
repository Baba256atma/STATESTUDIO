import test from "node:test";
import assert from "node:assert/strict";

import { resolvePanelTransition, resolveRightPanelFamily } from "./panelStateMachine.ts";

test("explicit focus click from scene transitions into object family", () => {
  const transition = resolvePanelTransition({
    sourceEvent: "explicit_right_rail_click",
    requestedView: "object",
    currentView: "workspace",
    requestedLegacyTab: "object_focus",
    currentLegacyTab: "scene",
    renderableFamilies: ["scene", "object"],
  });

  assert.equal(transition.allowed, true);
  assert.equal(transition.finalView, "object");
  assert.equal(transition.finalFamily, "object");
  assert.equal(transition.reason, "explicit_transition_allowed");
});

test("explicit risk click stays in risk family", () => {
  const transition = resolvePanelTransition({
    sourceEvent: "explicit_left_nav_click",
    requestedView: "risk",
    currentView: "workspace",
    requestedLegacyTab: "risk_flow",
    currentLegacyTab: "scene",
    renderableFamilies: ["scene", "risk"],
  });

  assert.equal(transition.allowed, true);
  assert.equal(transition.finalView, "risk");
  assert.equal(transition.finalFamily, "risk");
});

test("automatic scene fallback is blocked while object family is preserved", () => {
  const transition = resolvePanelTransition({
    sourceEvent: "effect_reconcile",
    requestedView: "workspace",
    currentView: "object",
    requestedLegacyTab: "scene",
    currentLegacyTab: "object_focus",
    preservedView: "object",
    preservedFamily: "object",
    fallbackView: "object",
    renderableFamilies: ["scene", "object"],
  });

  assert.equal(transition.blocked, true);
  assert.equal(transition.familyPreserved, true);
  assert.equal(transition.finalView, "object");
  assert.equal(transition.reason, "preserved_family_beats_automatic_override");
});

test("automatic simulate takeover is blocked while risk family is preserved", () => {
  const transition = resolvePanelTransition({
    sourceEvent: "adapter_sync",
    requestedView: "simulate",
    currentView: "risk",
    requestedLegacyTab: "simulate",
    currentLegacyTab: "risk_flow",
    preservedView: "risk",
    preservedFamily: "risk",
    fallbackView: "risk",
    renderableFamilies: ["risk", "simulate"],
  });

  assert.equal(transition.blocked, true);
  assert.equal(transition.familyPreserved, true);
  assert.equal(transition.finalView, "risk");
});

test("non-renderable requested family falls back only when fallback family is renderable", () => {
  const transition = resolvePanelTransition({
    sourceEvent: "host_fallback",
    requestedView: "risk",
    currentView: "workspace",
    requestedLegacyTab: "risk_flow",
    currentLegacyTab: "scene",
    fallbackView: "workspace",
    renderableFamilies: ["scene"],
  });

  assert.equal(transition.allowed, true);
  assert.equal(transition.fallbackApplied, true);
  assert.equal(transition.finalView, "workspace");
  assert.equal(transition.finalFamily, "scene");
  assert.equal(transition.reason, "requested_family_not_renderable");
});

test("same view and context is a no-op transition", () => {
  const transition = resolvePanelTransition({
    sourceEvent: "explicit_left_nav_click",
    requestedView: "risk",
    currentView: "risk",
    requestedLegacyTab: "risk_flow",
    currentLegacyTab: "risk_flow",
    contextId: "ctx-1",
    currentContextId: "ctx-1",
    renderableFamilies: ["risk"],
  });

  assert.equal(transition.noOp, true);
  assert.equal(transition.finalView, "risk");
  assert.equal(transition.reason, "no_op_same_state");
});

test("family resolver keeps workspace scene intent distinct from workflow workspace", () => {
  assert.equal(resolveRightPanelFamily("workspace", "scene"), "scene");
  assert.equal(resolveRightPanelFamily("workspace", "workspace"), "workflow");
});
