import test from "node:test";
import assert from "node:assert/strict";

import type { TypeCScenarioDraft } from "../../typec/typeCScenarioDrafts.ts";
import type { TypeCScenarioSimulation } from "../../typec/typeCScenarioSimulation.ts";
import { compareTypeCScenarioSimulations } from "../../typec/typeCScenarioComparison.ts";
import {
  buildExecutiveWarRoomState,
  resolveExecutiveWarRoomCopilotPrompt,
  resolveWarRoomIncidentFocusObjectId,
} from "./executiveWarRoomRuntime.ts";
import {
  dispatchExecutiveWarRoomCommand,
  refreshExecutiveWarRoom,
  resetExecutiveWarRoomForTests,
  setExecutiveWarRoomFocusMode,
} from "./executiveWarRoomStore.ts";

function draft(id: string, title: string): TypeCScenarioDraft {
  return {
    id,
    title,
    description: title,
    trigger: "trigger",
    impact: "impact",
    confidence: 0.8,
    relatedObjectIds: ["supplier_a"],
    basedOnConnections: [],
  };
}

function simulation(scenarioId: string, riskLevel: TypeCScenarioSimulation["riskLevel"]): TypeCScenarioSimulation {
  return {
    scenarioId,
    riskLevel,
    affectedObjectIds: ["supplier_a", "inventory_b"],
    propagationPaths: [{ from: "supplier_a", to: "inventory_b", intensity: 0.82 }],
    summary: `${scenarioId} propagation summary`,
  };
}

test("buildExecutiveWarRoomState synthesizes alerts, recommendations, and KPIs", () => {
  const activeSimulation = simulation("scenario_a", "high");
  const state = buildExecutiveWarRoomState({
    selectedObjectId: "supplier_a",
    activeSimulation,
    activeScenarioTitle: "Aggressive Scenario",
    alerts: [
      {
        id: "alert_1",
        level: "critical",
        message: "Supplier instability detected",
        relatedObjectIds: ["supplier_a"],
        timestamp: Date.now(),
        acknowledged: false,
      },
    ],
    timelineEvents: [
      {
        id: "evt_1",
        title: "Supplier delay signal",
        summary: "Delay risk emerging upstream",
        status: "active",
        severity: "warning",
        markerType: "risk",
        relatedObjectIds: ["supplier_a"],
      },
    ],
  });

  assert.equal(state.active, true);
  assert.equal(state.statusLevel, "critical");
  assert.ok(state.alerts.length > 0);
  assert.ok(state.recommendations.length >= 0);
  assert.ok(state.hud.commands.length >= 6);
  assert.ok(state.kpis.riskScore > 0.5);
});

test("buildExecutiveWarRoomState integrates scenario comparison and recommendations", () => {
  const drafts = [draft("scenario_a", "Conservative"), draft("scenario_b", "Balanced")];
  const simulations = [simulation("scenario_a", "low"), simulation("scenario_b", "medium")];
  const comparison = compareTypeCScenarioSimulations({ scenarios: drafts, simulations });
  const state = buildExecutiveWarRoomState({
    scenarioComparison: comparison,
    decisionRecommendation: {
      recommendedScenarioId: comparison.bestOptionId ?? "scenario_a",
      reasoning: "Conservative path balances risk.",
      tradeoff: "Lower reward, safer propagation.",
      riskWarning: "Medium paths remain visible.",
      nextAction: "Review conservative scenario in war room.",
      confidence: 0.74,
    },
  });

  assert.equal(state.mission.autoFocusMode, "scenario");
  assert.ok(state.bestScenarioTitle);
  assert.ok(state.tradeoffSummary);
});

test("executiveWarRoomStore refreshes and dispatches focus commands", () => {
  resetExecutiveWarRoomForTests();
  const activeSimulation = simulation("scenario_a", "high");
  const loaded = refreshExecutiveWarRoom({
    activeSimulation,
    alerts: [
      {
        id: "alert_1",
        level: "critical",
        message: "Critical cascade risk",
        relatedObjectIds: ["inventory_b"],
        timestamp: Date.now(),
        acknowledged: false,
      },
    ],
  });
  assert.equal(loaded.active, true);

  dispatchExecutiveWarRoomCommand("show_risks");
  const focused = setExecutiveWarRoomFocusMode("risk");
  assert.equal(focused?.mission.focusMode, "risk");
  assert.equal(resolveWarRoomIncidentFocusObjectId(focused), "inventory_b");
  assert.ok(resolveExecutiveWarRoomCopilotPrompt(focused)?.includes("War Room focus"));
});
