import React from "react";
import { cardStyle, nx, primaryMetricStyle, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";
import { EmptyStateCard } from "../ui/panelStates";

export default function StrategicPatternsPanel({ patterns }: { patterns: any }) {
  if (!patterns || !patterns.top_pattern) {
    return <EmptyStateCard text="Strategic patterns appear after repeated analysis history exists." />;
  }

  const top = patterns.top_pattern;
  const items = Array.isArray(patterns.detected_patterns) ? patterns.detected_patterns : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          ...cardStyle,
        }}
      >
        <div style={sectionTitleStyle}>
          Top Pattern
        </div>
        <div style={primaryMetricStyle}>{top.label}</div>
        <div style={{ color: "#cbd5e1", fontSize: 12 }}>{patterns.summary}</div>
        <div style={{ color: "#93c5fd", fontSize: 12 }}>
          Frequency: {top.frequency} · Avg fragility: {Number(top.avg_fragility ?? 0).toFixed(2)}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.slice(0, 3).map((p: any, idx: number) => (
          <div
            key={idx}
            style={{
              ...softCardStyle,
              padding: 10,
            }}
          >
            <div style={{ color: nx.text, fontWeight: 700, fontSize: 13 }}>{p.label}</div>
            <div style={{ color: nx.muted, fontSize: 11 }}>
              Frequency: {p.frequency} · Avg fragility: {Number(p.avg_fragility ?? 0).toFixed(2)}
            </div>
            <div style={{ color: "#cbd5e1", fontSize: 12 }}>{p.why}</div>
            {Array.isArray(p.key_objects) && p.key_objects.length ? (
              <div style={{ color: "#93c5fd", fontSize: 11 }}>
                Key objects: {p.key_objects.join(", ")}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
