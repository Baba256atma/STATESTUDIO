"use client";

import React from "react";

import { nx, softCardStyle } from "../ui/nexoraTheme";
import type { StrategyGenerationResult } from "../../lib/strategy-generation/strategyGenerationTypes";

type StrategyListProps = {
  result: StrategyGenerationResult | null;
  selectedStrategyId: string | null;
  onSelect: (strategyId: string | null) => void;
};

export function StrategyList({ result, selectedStrategyId, onSelect }: StrategyListProps) {
  if (!result?.strategies.length) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {result.strategies.map((item) => {
        const active = selectedStrategyId === item.strategy.strategy_id;
        const recommended = result.recommended_strategy_id === item.strategy.strategy_id;
        return (
          <button
            key={item.strategy.strategy_id}
            type="button"
            onClick={() => onSelect(item.strategy.strategy_id)}
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
              <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>{item.strategy.title}</div>
              <div style={{ color: recommended ? "#93c5fd" : nx.muted, fontSize: 11, fontWeight: 700 }}>
                #{item.ranking}{recommended ? " · REC" : ""}
              </div>
            </div>
            <div style={{ color: nx.muted, fontSize: 11 }}>
              Score {Math.round(item.score * 100)} · Risk {Math.round(item.risk_level * 100)} · Impact {Math.round(item.expected_impact * 100)}
            </div>
          </button>
        );
      })}
    </div>
  );
}
