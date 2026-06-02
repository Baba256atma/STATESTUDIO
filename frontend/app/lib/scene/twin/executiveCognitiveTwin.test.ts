import test from "node:test";
import assert from "node:assert/strict";

import {
  buildExecutiveCognitiveTwinState,
  resolveExecutiveCognitiveTwinCopilotPrompt,
} from "./executiveCognitiveTwinRuntime.ts";
import {
  refreshExecutiveCognitiveTwin,
  resetExecutiveCognitiveTwinForTests,
} from "./executiveCognitiveTwinStore.ts";
import { resolveTwinObjectSelection } from "./executiveCognitiveTwinSelection.ts";

test("buildExecutiveCognitiveTwinState builds living registry and scores", () => {
  const state = buildExecutiveCognitiveTwinState({
    sceneObjectIds: ["supplier_a", "inventory_b", "customer_c"],
    sceneObjectMeta: [
      { id: "supplier_a", label: "Supplier A", tags: ["supply", "logistics"] },
      { id: "inventory_b", label: "Inventory B", tags: ["operations"] },
      { id: "customer_c", label: "Customer C", tags: ["finance"] },
    ],
    relationships: [
      { id: "rel_1", sourceId: "supplier_a", targetId: "inventory_b" },
      { id: "rel_2", sourceId: "inventory_b", targetId: "customer_c" },
    ],
    activeSimulation: {
      scenarioId: "scenario_delay",
      affectedObjectIds: ["supplier_a", "inventory_b"],
      propagationPaths: [{ from: "supplier_a", to: "inventory_b", intensity: 0.82 }],
      riskLevel: "high",
      summary: "Supplier delay propagates through inventory.",
    },
    domainLabel: "Supply Chain",
  });

  assert.equal(state.active, true);
  assert.equal(state.registry.objects.length, 3);
  assert.ok(state.registry.clusters.length > 0);
  assert.ok(state.scores.enterpriseHealthScore > 0);
  assert.ok(state.livingObjectIds.length > 0);
  assert.ok(state.relationships.some((entry) => entry.health === "stressed" || entry.health === "broken"));
});

test("resolveTwinObjectSelection highlights living and stressed entities", () => {
  const state = buildExecutiveCognitiveTwinState({
    sceneObjectIds: ["supplier_a", "inventory_b"],
    sceneObjectMeta: [
      { id: "supplier_a", label: "Supplier A" },
      { id: "inventory_b", label: "Inventory B" },
    ],
    relationships: [{ id: "rel_1", sourceId: "supplier_a", targetId: "inventory_b" }],
    activeSimulation: {
      scenarioId: "scenario_delay",
      affectedObjectIds: ["supplier_a", "inventory_b"],
      propagationPaths: [{ from: "supplier_a", to: "inventory_b", intensity: 0.82 }],
      riskLevel: "high",
      summary: "High risk propagation.",
    },
    alerts: [
      {
        id: "alert_1",
        level: "critical",
        message: "Supplier instability",
        relatedObjectIds: ["supplier_a"],
        timestamp: Date.now(),
        acknowledged: false,
      },
    ],
  });

  const selection = resolveTwinObjectSelection(state);
  assert.ok((selection?.highlighted_objects?.length ?? 0) > 0);
  assert.ok(resolveExecutiveCognitiveTwinCopilotPrompt(state)?.includes("Enterprise twin pulse"));
});

test("executiveCognitiveTwinStore refreshes with signature dedupe", () => {
  resetExecutiveCognitiveTwinForTests();
  const loaded = refreshExecutiveCognitiveTwin({
    sceneObjectIds: ["obj_a"],
    sceneObjectMeta: [{ id: "obj_a", label: "Object A" }],
  });
  assert.equal(loaded?.active, true);
  const again = refreshExecutiveCognitiveTwin({
    sceneObjectIds: ["obj_a"],
    sceneObjectMeta: [{ id: "obj_a", label: "Object A" }],
  });
  assert.equal(again?.signature, loaded?.signature);
});
