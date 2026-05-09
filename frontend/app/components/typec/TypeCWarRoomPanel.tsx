"use client";

import type React from "react";

import type { TypeCScenarioDraft } from "../../lib/typec/typeCScenarioDrafts.ts";
import type { TypeCScenarioSimulation } from "../../lib/typec/typeCScenarioSimulation.ts";

export type TypeCWarRoomPanelProps = {
  scenario: TypeCScenarioDraft | null;
  simulation: TypeCScenarioSimulation | null;
  onExit: () => void;
};

const panelStyle = {
  position: "fixed",
  right: 16,
  bottom: 18,
  zIndex: 46,
  width: 380,
  maxWidth: "calc(100vw - 32px)",
  padding: 14,
  borderRadius: 12,
  border: "1px solid rgba(251, 191, 36, 0.24)",
  background: "linear-gradient(180deg, rgba(30, 27, 75, 0.94), rgba(2, 6, 23, 0.9))",
  boxShadow: "0 18px 52px rgba(0, 0, 0, 0.34)",
  color: "rgba(255, 251, 235, 0.94)",
  backdropFilter: "blur(14px)",
} as const;

const titleStyle = {
  margin: 0,
  fontSize: 14,
  lineHeight: 1.25,
  fontWeight: 800,
  letterSpacing: 0,
} as const;

const textStyle = {
  margin: "6px 0 0",
  color: "rgba(254, 243, 199, 0.82)",
  fontSize: 12,
  lineHeight: 1.45,
} as const;

const sectionStyle = {
  marginTop: 10,
  paddingTop: 9,
  borderTop: "1px solid rgba(253, 224, 71, 0.14)",
} as const;

const buttonStyle = {
  borderRadius: 8,
  border: "1px solid rgba(253, 224, 71, 0.24)",
  background: "rgba(15, 23, 42, 0.52)",
  color: "rgba(254, 249, 195, 0.92)",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 750,
  padding: "6px 9px",
} as const;

function riskColor(riskLevel: TypeCScenarioSimulation["riskLevel"]): string {
  if (riskLevel === "high") return "rgba(248, 113, 113, 0.95)";
  if (riskLevel === "medium") return "rgba(251, 191, 36, 0.95)";
  return "rgba(125, 211, 252, 0.9)";
}

export function TypeCWarRoomPanel({
  scenario,
  simulation,
  onExit,
}: TypeCWarRoomPanelProps): React.ReactElement | null {
  if (!scenario || !simulation) return null;

  return (
    <aside data-nx="typec-war-room-panel" aria-label="Type-C War Room simulation" style={panelStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div>
          <div style={{ color: "rgba(253, 224, 71, 0.74)", fontSize: 10, fontWeight: 800 }}>
            War Room Simulation
          </div>
          <h2 style={titleStyle}>{scenario.title}</h2>
        </div>
        <span
          style={{
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.14)",
            color: riskColor(simulation.riskLevel),
            fontSize: 10,
            fontWeight: 850,
            padding: "3px 7px",
            textTransform: "uppercase",
          }}
        >
          {simulation.riskLevel}
        </span>
      </div>

      <p style={textStyle}>{simulation.summary}</p>

      <div style={sectionStyle}>
        <div style={{ fontSize: 11, fontWeight: 800 }}>Affected objects</div>
        <div style={textStyle}>
          {simulation.affectedObjectIds.length ? simulation.affectedObjectIds.join(", ") : "No affected objects"}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={{ fontSize: 11, fontWeight: 800 }}>Propagation paths</div>
        {simulation.propagationPaths.length ? (
          <ul style={{ ...textStyle, paddingLeft: 16 }}>
            {simulation.propagationPaths.map((path) => (
              <li key={`${path.from}-${path.to}`}>
                {path.from} → {path.to} · {Math.round(path.intensity * 100)}%
              </li>
            ))}
          </ul>
        ) : (
          <div style={textStyle}>No propagation path detected.</div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <button type="button" onClick={onExit} style={buttonStyle}>
          Exit Simulation
        </button>
      </div>
    </aside>
  );
}

export default TypeCWarRoomPanel;
