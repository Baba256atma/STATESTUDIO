import React from "react";
import { cardStyle, nx, primaryMetricStyle, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";
import { EmptyStateCard } from "../ui/panelStates";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

export default function StrategicPatternsPanel({ patterns }: { patterns: unknown | null }) {
  const patternsRecord = asRecord(patterns);
  const top = asRecord(patternsRecord?.top_pattern);
  if (!patternsRecord || !top) {
    return <EmptyStateCard text="Strategic patterns appear after repeated analysis history exists." />;
  }

  const items = Array.isArray(patternsRecord.detected_patterns) ? patternsRecord.detected_patterns : [];

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
        <div style={primaryMetricStyle}>{String(top.label ?? "Pattern")}</div>
        <div style={{ color: "#cbd5e1", fontSize: 12 }}>{String(patternsRecord.summary ?? "")}</div>
        <div style={{ color: "#93c5fd", fontSize: 12 }}>
          Frequency: {String(top.frequency ?? "—")} · Avg fragility: {Number(top.avg_fragility ?? 0).toFixed(2)}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.slice(0, 3).map((patternValue, idx) => {
          const pattern = asRecord(patternValue);
          return (
            <div
              key={idx}
              style={{
                ...softCardStyle,
                padding: 10,
              }}
            >
              <div style={{ color: nx.text, fontWeight: 700, fontSize: 13 }}>{String(pattern?.label ?? "Pattern")}</div>
              <div style={{ color: nx.muted, fontSize: 11 }}>
                Frequency {String(pattern?.frequency ?? "—")} · Avg fragility {Number(pattern?.avg_fragility ?? 0).toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
