"use client";

import React from "react";

import { nx, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";
import type { ScenarioMemoryRecord } from "../../lib/evolution/evolutionTypes";

type MemoryTimelineProps = {
  items: ScenarioMemoryRecord[];
  onOutcomeUpdate: (recordId: string, outcomeStatus: "positive" | "mixed" | "negative") => void;
};

function formatTs(value: number): string {
  const date = new Date(value * 1000);
  return Number.isNaN(date.getTime()) ? "Unknown time" : date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function MemoryTimeline({ items, onOutcomeUpdate }: MemoryTimelineProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={sectionTitleStyle}>Recent Scenario Memory</div>
      {items.length ? (
        items.slice(0, 6).map((item) => (
          <div key={item.record_id} style={{ ...softCardStyle, padding: 10, gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>{item.scenario_title ?? item.scenario_id ?? item.record_id}</div>
              <div style={{ color: nx.lowMuted, fontSize: 11 }}>{formatTs(item.timestamp)}</div>
            </div>
            <div style={{ color: nx.muted, fontSize: 12 }}>
              {item.predicted_summary?.headline ?? "Structured scenario run stored in Nexora memory."}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 6 }}>
              {(["positive", "mixed", "negative"] as const).map((status) => (
                <button
                  key={`${item.record_id}:${status}`}
                  type="button"
                  onClick={() => onOutcomeUpdate(item.record_id, status)}
                  style={{
                    borderRadius: 10,
                    border: `1px solid ${nx.border}`,
                    background: "rgba(2,6,23,0.42)",
                    color: nx.text,
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "8px 6px",
                    cursor: "pointer",
                  }}
                >
                  Mark {status}
                </button>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div style={{ ...softCardStyle, color: nx.muted, fontSize: 12 }}>No scenario history stored yet.</div>
      )}
    </div>
  );
}
