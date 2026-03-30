"use client";

import React from "react";

import { nx, primaryButtonStyle, secondaryButtonStyle, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";
import type { WarRoomController, WarRoomMode } from "../../lib/warroom/warRoomTypes";

type ActionControlsProps = {
  controller: WarRoomController;
  loading: boolean;
};

const MODES: WarRoomMode[] = ["analysis", "simulation", "decision"];

export function ActionControls({ controller, loading }: ActionControlsProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={sectionTitleStyle}>Action Controls</div>

      <div style={{ ...softCardStyle, gap: 10, padding: 12, border: "1px solid rgba(96,165,250,0.18)" }}>
        <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>Run and manage the current scenario</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8 }}>
          <button
            type="button"
            onClick={() => {
              controller.runScenario();
            }}
            disabled={!controller.canRun || loading}
            style={{ ...primaryButtonStyle, opacity: !controller.canRun || loading ? 0.5 : 1 }}
          >
            Run
          </button>
          <button
            type="button"
            onClick={() => controller.refreshScenario()}
            disabled={!controller.state.activeScenarioId || loading}
            style={{ ...secondaryButtonStyle, opacity: !controller.state.activeScenarioId || loading ? 0.5 : 1 }}
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={() => controller.stopScenario()}
            disabled={!controller.state.activeScenarioId}
            style={{ ...secondaryButtonStyle, opacity: !controller.state.activeScenarioId ? 0.5 : 1 }}
          >
            Stop
          </button>
          <button type="button" onClick={() => controller.clearScenario()} style={secondaryButtonStyle}>
            Clear
          </button>
        </div>
      </div>

      <div style={{ ...softCardStyle, gap: 10, padding: 12 }}>
        <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>Choose the operating mode</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
          {MODES.map((mode) => {
            const active = controller.state.mode === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => controller.switchMode(mode)}
                style={{
                  borderRadius: 10,
                  border: `1px solid ${active ? nx.borderStrong : nx.border}`,
                  background: active ? "rgba(59,130,246,0.16)" : "rgba(2,6,23,0.42)",
                  color: active ? "#dbeafe" : nx.text,
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "10px 8px",
                  cursor: "pointer",
                }}
              >
                {mode === "analysis" ? "Analysis" : mode === "simulation" ? "Simulation" : "Decision"}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => controller.setCompareViewMode("summary")}
          style={{
            borderRadius: 10,
            border: `1px solid ${controller.session.viewMode === "compare" ? nx.borderStrong : nx.border}`,
            background: controller.session.viewMode === "compare" ? "rgba(59,130,246,0.16)" : "rgba(2,6,23,0.42)",
            color: controller.session.viewMode === "compare" ? "#dbeafe" : nx.text,
            fontSize: 12,
            fontWeight: 700,
            padding: "10px 8px",
            cursor: "pointer",
          }}
        >
          Compare Mode
        </button>
      </div>
    </div>
  );
}
