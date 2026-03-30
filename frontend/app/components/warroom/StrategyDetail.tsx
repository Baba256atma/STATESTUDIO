"use client";

import React from "react";

import { nx, softCardStyle } from "../ui/nexoraTheme";
import type { EvaluatedStrategy } from "../../lib/strategy-generation/strategyGenerationTypes";

type StrategyDetailProps = {
  item: EvaluatedStrategy | null;
  onRun: () => void;
};

export function StrategyDetail({ item, onRun }: StrategyDetailProps) {
  if (!item) return null;
  return (
    <div style={{ ...softCardStyle, padding: 10, gap: 8 }}>
      <div style={{ color: nx.text, fontSize: 14, fontWeight: 800 }}>{item.strategy.title}</div>
      <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>{item.strategy.description}</div>
      <div style={{ color: "#cbd5e1", fontSize: 12 }}>{item.strategy.rationale}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
        <div style={{ padding: 8, borderRadius: 10, background: "rgba(2,6,23,0.35)" }}>
          <div style={{ color: nx.lowMuted, fontSize: 11 }}>Score</div>
          <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>{Math.round(item.score * 100)}</div>
        </div>
        <div style={{ padding: 8, borderRadius: 10, background: "rgba(2,6,23,0.35)" }}>
          <div style={{ color: nx.lowMuted, fontSize: 11 }}>Risk</div>
          <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>{Math.round(item.risk_level * 100)}</div>
        </div>
        <div style={{ padding: 8, borderRadius: 10, background: "rgba(2,6,23,0.35)" }}>
          <div style={{ color: nx.lowMuted, fontSize: 11 }}>Impact</div>
          <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>{Math.round(item.expected_impact * 100)}</div>
        </div>
      </div>
      {item.tradeoffs.length ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {item.tradeoffs.slice(0, 3).map((tradeoff, idx) => (
            <div key={`${item.strategy.strategy_id}:${idx}`} style={{ color: nx.muted, fontSize: 12 }}>
              {tradeoff}
            </div>
          ))}
        </div>
      ) : null}
      <button
        type="button"
        onClick={onRun}
        style={{
          borderRadius: 10,
          border: `1px solid ${nx.borderStrong}`,
          background: "rgba(59,130,246,0.16)",
          color: "#dbeafe",
          fontSize: 12,
          fontWeight: 700,
          padding: "10px 12px",
          cursor: "pointer",
        }}
      >
        Run Strategy
      </button>
    </div>
  );
}
