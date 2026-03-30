"use client";

import React from "react";

import { nx, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";
import type { StrategyMemoryRecord } from "../../lib/evolution/evolutionTypes";

type StrategyHistoryListProps = {
  items: StrategyMemoryRecord[];
};

export function StrategyHistoryList({ items }: StrategyHistoryListProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={sectionTitleStyle}>Strategy History</div>
      {items.length ? (
        items.slice(0, 6).map((item) => (
          <div key={item.record_id} style={{ ...softCardStyle, padding: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>{item.title}</div>
              <div style={{ color: item.chosen ? "#93c5fd" : nx.lowMuted, fontSize: 11, fontWeight: 700 }}>
                {item.chosen ? "CHOSEN" : "TRACKED"}
              </div>
            </div>
            <div style={{ color: nx.muted, fontSize: 12 }}>{item.rationale}</div>
          </div>
        ))
      ) : (
        <div style={{ ...softCardStyle, color: nx.muted, fontSize: 12 }}>No strategy history stored yet.</div>
      )}
    </div>
  );
}
