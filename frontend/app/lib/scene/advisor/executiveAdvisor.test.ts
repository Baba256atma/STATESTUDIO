import test from "node:test";
import assert from "node:assert/strict";

import type { TypeCScenarioSimulation } from "../../typec/typeCScenarioSimulation.ts";
import {
  buildExecutiveAdvisorState,
  resolveExecutiveAdvisorCopilotPrompt,
} from "./executiveAdvisorRuntime.ts";
import { buildExecutiveWarRoomState } from "../warroom/executiveWarRoomRuntime.ts";
import { buildExecutiveCognitiveTwinState } from "../twin/executiveCognitiveTwinRuntime.ts";
import {
  refreshExecutiveAdvisor,
  resetExecutiveAdvisorForTests,
  setExecutiveAdvisorRecommendationStatus,
} from "./executiveAdvisorStore.ts";
import {
  detectAdvisorObservations,
  generateStrategicQuestions,
} from "./strategicCoReasoningEngine.ts";

function simulation(): TypeCScenarioSimulation {
  return {
    scenarioId: "scenario_delay",
    affectedObjectIds: ["supplier_a", "inventory_b"],
    propagationPaths: [{ from: "supplier_a", to: "inventory_b", intensity: 0.82 }],
    riskLevel: "high",
    summary: "Supplier delay propagates through inventory.",
  };
}

test("buildExecutiveAdvisorState synthesizes observations, questions, and recommendations", () => {
  const cognitiveTwin = buildExecutiveCognitiveTwinState({
    sceneObjectIds: ["supplier_a", "inventory_b"],
    sceneObjectMeta: [
      { id: "supplier_a", label: "Supplier A" },
      { id: "inventory_b", label: "Inventory B" },
    ],
    relationships: [{ id: "rel_1", sourceId: "supplier_a", targetId: "inventory_b" }],
    activeSimulation: simulation(),
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
  const warRoom = buildExecutiveWarRoomState({
    selectedObjectId: "supplier_a",
    activeSimulation: simulation(),
    activeScenarioTitle: "Delay Scenario",
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
    cognitiveTwin,
  });

  const state = buildExecutiveAdvisorState({
    cognitiveTwin,
    warRoom,
    activeSimulation: simulation(),
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

  assert.equal(state.active, true);
  assert.ok(state.observations.length > 0);
  assert.ok(state.observations.some((entry) => entry.kind === "risk"));
  assert.ok(state.questions.length > 0);
  assert.ok(state.recommendations.length > 0);
  assert.ok(state.evidence.length > 0);
  assert.ok(state.reasoningChains.length > 0);
  assert.ok(state.explainability.evidenceCount > 0);
  assert.ok(state.hud.calibratedConfidence > 0);
  assert.ok(resolveExecutiveAdvisorCopilotPrompt(state)?.includes("Recommended action"));
});

test("detectAdvisorObservations finds risk and blind spot signals", () => {
  const observations = detectAdvisorObservations({
    cognitiveTwin: buildExecutiveCognitiveTwinState({
      sceneObjectIds: ["obj_a"],
      sceneObjectMeta: [{ id: "obj_a", label: "Object A" }],
      activeSimulation: simulation(),
    }),
    activeSimulation: simulation(),
    pipelineConfidence: 0.42,
  });

  assert.ok(observations.some((entry) => entry.kind === "risk" || entry.kind === "early_signal"));
  const questions = generateStrategicQuestions(observations, {
    activeSimulation: simulation(),
  });
  assert.ok(questions.length > 0);
});

test("executiveAdvisorStore refreshes with signature dedupe and lifecycle status", () => {
  resetExecutiveAdvisorForTests();
  const cognitiveTwin = buildExecutiveCognitiveTwinState({
    sceneObjectIds: ["obj_a"],
    sceneObjectMeta: [{ id: "obj_a", label: "Object A" }],
  });
  const warRoom = buildExecutiveWarRoomState({
    selectedObjectId: "obj_a",
    cognitiveTwin,
  });
  const input = { cognitiveTwin, warRoom };

  const first = refreshExecutiveAdvisor(input);
  const second = refreshExecutiveAdvisor(input);
  assert.equal(first?.signature, second?.signature);

  const recommendationId = first?.recommendations[0]?.id;
  assert.ok(recommendationId);
  setExecutiveAdvisorRecommendationStatus(recommendationId!, "accepted");
  assert.equal(
    refreshExecutiveAdvisor(input)?.recommendations.find((entry) => entry.id === recommendationId)?.status,
    "accepted"
  );
});
