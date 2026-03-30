"use client";

import React from "react";

import { nx, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";
import type { WarRoomController } from "../../lib/warroom/warRoomTypes";

type ScenarioListProps = {
  controller: WarRoomController;
};

export function ScenarioList({ controller }: ScenarioListProps) {
  const scenarios = controller.availableScenarios;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={sectionTitleStyle}>Scenario Queue</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {scenarios.length ? (
          scenarios.map((scenario) => {
            const active = controller.state.activeScenarioId === scenario.id;
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => {
                  controller.updateFocus(scenario.trigger.targetId);
                  controller.runScenario(scenario.id);
                }}
                style={{
                  ...softCardStyle,
                  padding: 10,
                  textAlign: "left",
                  cursor: "pointer",
                  border: active ? `1px solid ${nx.borderStrong}` : `1px solid ${nx.border}`,
                  background: active ? "rgba(59,130,246,0.12)" : softCardStyle.background,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>{scenario.title}</div>
                  <div style={{ color: active ? "#dbeafe" : nx.muted, fontSize: 11, fontWeight: 700 }}>
                    {scenario.outputMode === "mixed"
                      ? "MIXED"
                      : scenario.outputMode === "decision_path"
                      ? "DECISION"
                      : "PROP"}
                  </div>
                </div>
                <div style={{ color: nx.muted, fontSize: 11 }}>
                  {scenario.origin.toUpperCase()} · {scenario.trigger.type.toUpperCase()} · {scenario.trigger.targetId}
                </div>
              </button>
            );
          })
        ) : (
          <div style={{ ...softCardStyle, color: nx.muted, fontSize: 12 }}>
            No scenarios composed yet. Select an object and compose the next move.
          </div>
        )}
      </div>
    </div>
  );
}
