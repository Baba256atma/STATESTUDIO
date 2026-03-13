import React from "react";
import { cardStyle, nx, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";
import { EmptyStateCard } from "../ui/panelStates";

export default function OpponentMovesPanel({ model }: { model: any }) {
  if (!model || !model.actor) {
    return <EmptyStateCard text="Opponent modeling appears when system pressure signals are available." />;
  }

  const moves = Array.isArray(model.possible_moves) ? model.possible_moves : [];
  const best = model.best_response;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          ...cardStyle,
          border: "1px solid rgba(148,163,184,0.18)",
        }}
      >
        <div style={sectionTitleStyle}>
          External Actor
        </div>
        <div style={{ color: nx.text, fontSize: 16, fontWeight: 800 }}>{model.actor.label}</div>
        <div style={{ color: "#93c5fd", fontSize: 12 }}>
          Strategic Risk: {Number(model.strategic_risk ?? 0).toFixed(2)}
        </div>
        <div style={{ color: "#cbd5e1", fontSize: 12 }}>{model.summary}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {moves.slice(0, 3).map((m: any, idx: number) => (
          <div
            key={idx}
            style={{
              ...softCardStyle,
              padding: 10,
            }}
          >
            <div style={{ color: nx.text, fontWeight: 700, fontSize: 13 }}>{m.label}</div>
            <div style={{ color: nx.muted, fontSize: 12 }}>{m.impact}</div>
          </div>
        ))}
      </div>

      {best ? (
        <div
          style={{
            ...cardStyle,
            border: "1px solid rgba(59,130,246,0.28)",
            background: "rgba(15,23,42,0.82)",
          }}
        >
          <div style={{ ...sectionTitleStyle, color: "#93c5fd" }}>
            Best Response
          </div>
          <div style={{ color: nx.text, fontSize: 16, fontWeight: 800 }}>{best.label}</div>
          <div style={{ color: "#cbd5e1", fontSize: 12 }}>{best.why}</div>
          {Array.isArray(best.targets) && best.targets.length ? (
            <div style={{ color: "#93c5fd", fontSize: 11 }}>Targets: {best.targets.join(", ")}</div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
