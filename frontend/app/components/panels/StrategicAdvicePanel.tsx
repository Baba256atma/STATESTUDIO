import React from "react";
import { cardStyle, nx, primaryMetricStyle, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";
import { EmptyStateCard } from "../ui/panelStates";

function prettyObjectName(id: string) {
  return String(id || "")
    .replace(/^obj_/, "")
    .replace(/_\d+$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function StrategicAdvicePanel({ advice }: { advice: any }) {
  if (!advice || !advice.primary_recommendation) {
    return <EmptyStateCard text="Executive recommendations will appear after Nexora evaluates the scenario." />;
  }

  const primary = advice.primary_recommendation;
  const actions = Array.isArray(advice.recommended_actions) ? advice.recommended_actions : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          ...cardStyle,
          border: "1px solid rgba(96,165,250,0.28)",
          boxShadow: "inset 0 0 0 1px rgba(96,165,250,0.08)",
        }}
      >
        <div style={sectionTitleStyle}>
          Recommended Action
        </div>
        <div style={primaryMetricStyle}>{primary.action}</div>
        <div style={{ color: nx.text, fontSize: 12 }}>{primary.impact}</div>
        <div style={{ color: "#93c5fd", fontSize: 12 }}>
          Confidence: {Number(advice.confidence ?? 0).toFixed(2)}
        </div>
      </div>

      <div style={{ ...softCardStyle, color: nx.text, fontSize: 12 }}>
        {advice.why}
      </div>
      {typeof advice?.summary === "string" && advice.summary.trim().length ? (
        <div style={{ ...softCardStyle, color: "#cbd5e1", fontSize: 12 }}>
          Executive summary: {advice.summary}
        </div>
      ) : null}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {actions.map((a: any, idx: number) => (
          <div
            key={idx}
            style={{
              ...softCardStyle,
              padding: 10,
            }}
          >
            <div style={{ color: nx.text, fontWeight: 700, fontSize: 13 }}>{a.action}</div>
            <div style={{ color: nx.muted, fontSize: 11 }}>
              Type: {a.type} · Priority: {a.priority}
            </div>
            <div style={{ color: "#cbd5e1", fontSize: 12 }}>{a.impact}</div>
            {Array.isArray(a.targets) && a.targets.length ? (
              <div style={{ color: "#93c5fd", fontSize: 11 }}>
                Targets: {a.targets.map((t: string) => prettyObjectName(t)).join(", ")}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
