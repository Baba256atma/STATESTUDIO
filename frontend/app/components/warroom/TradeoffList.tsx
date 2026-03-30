"use client";

import React from "react";

import { nx, softCardStyle } from "../ui/nexoraTheme";
import type { CompareTradeoff } from "../../lib/compare/compareTypes";

type TradeoffListProps = {
  items: CompareTradeoff[];
};

export function TradeoffList({ items }: TradeoffListProps) {
  if (!items.length) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item) => (
        <div key={item.dimension} style={{ ...softCardStyle, padding: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>{item.dimension.toUpperCase()}</div>
            <div style={{ color: "#cbd5e1", fontSize: 11 }}>{item.winner.toUpperCase()}</div>
          </div>
          <div style={{ color: nx.muted, fontSize: 12 }}>{item.explanation}</div>
        </div>
      ))}
    </div>
  );
}
