import assert from "node:assert/strict";
import test from "node:test";
import { resolveTypeCActionPanel } from "./routeTypeCExecutiveAction.ts";
import type { TypeCExecutiveAction, TypeCExecutiveActionKind } from "./typeCExecutiveActions.ts";

function action(kind: TypeCExecutiveActionKind, overrides: Partial<TypeCExecutiveAction> = {}): TypeCExecutiveAction {
  return {
    id: `action_${kind}`,
    kind,
    label: kind,
    ...overrides,
  };
}

test("resolveTypeCActionPanel maps each action kind to expected panel", () => {
  assert.equal(resolveTypeCActionPanel(action("analyze_object"))?.panelId, "object_focus");
  assert.equal(resolveTypeCActionPanel(action("explain_risk"))?.panelId, "risk");
  assert.equal(resolveTypeCActionPanel(action("monitor_signal"))?.panelId, "risk_flow");
  assert.equal(resolveTypeCActionPanel(action("open_scenario"))?.panelId, "war_room");
  assert.equal(resolveTypeCActionPanel(action("compare_options"))?.panelId, "compare");
});

test("resolveTypeCActionPanel returns null for disabled action", () => {
  assert.equal(resolveTypeCActionPanel(action("explain_risk", { disabled: true })), null);
});

test("resolveTypeCActionPanel returns null for unknown action", () => {
  assert.equal(
    resolveTypeCActionPanel({
      id: "unknown",
      kind: "unknown_kind" as TypeCExecutiveActionKind,
      label: "Unknown",
    }),
    null
  );
});

test("resolveTypeCActionPanel is deterministic for repeated action clicks", () => {
  const input = action("compare_options");
  const first = resolveTypeCActionPanel(input);
  const second = resolveTypeCActionPanel(input);

  assert.deepEqual(first, second);
});

test("resolveTypeCActionPanel does not mutate action", () => {
  const input = action("monitor_signal", { reason: "risk_or_why_signal_available" });
  const before = structuredClone(input);

  resolveTypeCActionPanel(input);

  assert.deepEqual(input, before);
});
