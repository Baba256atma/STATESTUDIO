"use client";

import React from "react";

import { nx, softCardStyle } from "../ui/nexoraTheme";
import type { CompareResult } from "../../lib/compare/compareTypes";

type CompareSummaryViewProps = {
  result: CompareResult | null;
};

export function CompareSummaryView({ result }: CompareSummaryViewProps) {
  if (!result) return null;
  return (
    <div style={{ ...softCardStyle, padding: 10, gap: 8 }}>
      <div style={{ color: nx.text, fontSize: 14, fontWeight: 800 }}>{result.summary.headline}</div>
      <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>{result.summary.reasoning}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ padding: 8, borderRadius: 10, background: "rgba(2,6,23,0.35)" }}>
          <div style={{ color: nx.lowMuted, fontSize: 11 }}>Winner</div>
          <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>{result.summary.winner.toUpperCase()}</div>
        </div>
        <div style={{ padding: 8, borderRadius: 10, background: "rgba(2,6,23,0.35)" }}>
          <div style={{ color: nx.lowMuted, fontSize: 11 }}>Confidence</div>
          <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>{Math.round(result.summary.confidence * 100)}%</div>
        </div>
      </div>
    </div>
  );
}
