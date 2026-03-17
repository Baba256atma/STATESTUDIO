"use client";

import React from "react";

const LEVEL_COLORS: Record<string, string> = {
  low: "#86efac",
  medium: "#fde68a",
  high: "#fb923c",
  critical: "#f87171",
};

function levelColor(level: string): string {
  return LEVEL_COLORS[level.toLowerCase()] ?? "#cbd5e1";
}

export function FragilityScoreCard({
  score,
  level,
  summary,
}: {
  score: number;
  level: string;
  summary: string;
}): React.ReactElement {
  const color = levelColor(level);

  return (
    <section
      aria-label="Fragility score"
      style={{
        padding: 12,
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(15,23,42,0.72)",
        display: "grid",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div>
          <div style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase" }}>
            Executive Result
          </div>
          <div style={{ color: "#e2e8f0", fontSize: 28, fontWeight: 800, lineHeight: 1.1 }}>
            {score.toFixed(2)}
          </div>
        </div>
        <div
          style={{
            alignSelf: "center",
            padding: "6px 10px",
            borderRadius: 999,
            background: `${color}22`,
            border: `1px solid ${color}55`,
            color,
            fontSize: 12,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {level}
        </div>
      </div>
      <div style={{ color: "#cbd5e1", fontSize: 13, lineHeight: 1.55 }}>{summary}</div>
    </section>
  );
}
