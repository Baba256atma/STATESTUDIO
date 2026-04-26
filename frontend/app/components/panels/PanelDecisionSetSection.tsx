"use client";

import React from "react";
import type { DecisionOption, DecisionSet } from "../../lib/decision/decisionEngine";
import { logDecisionSet } from "../../lib/decision/decisionEngine";
import { nx, softCardStyle } from "../ui/nexoraTheme";

type PanelDecisionSetSectionProps = {
  view: string;
  decisionSet: DecisionSet;
};

export function PanelDecisionSetSection({ view, decisionSet }: PanelDecisionSetSectionProps) {
  React.useEffect(() => {
    logDecisionSet(view, decisionSet);
  }, [view, decisionSet]);

  const handleDecisionSelect = React.useCallback((opt: DecisionOption) => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[Nexora][DecisionSelected]", opt);
    }
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ marginTop: 12 }}>
        <strong style={{ color: nx.text, fontSize: 12 }}>Recommended Direction:</strong>
        <div style={{ marginTop: 4, fontSize: 12, color: nx.muted, lineHeight: 1.45 }}>{decisionSet.primaryRecommendation}</div>
      </div>

      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        {decisionSet.options.map((opt) => (
          <div
            key={opt.id}
            style={{
              ...softCardStyle,
              padding: 10,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 13, color: nx.text }}>{opt.label}</div>
            <div style={{ fontSize: 12, color: nx.muted, lineHeight: 1.4 }}>{opt.description}</div>
            <div style={{ fontSize: 11, color: nx.muted, opacity: 0.85 }}>Impact: {opt.impact}</div>
            <div style={{ fontSize: 11, color: nx.lowMuted, opacity: 0.78 }}>Trade-off: {opt.tradeoff}</div>
            <button
              type="button"
              onClick={() => handleDecisionSelect(opt)}
              style={{
                marginTop: 8,
                border: "1px solid rgba(148,163,184,0.28)",
                background: "rgba(15,23,42,0.72)",
                color: nx.text,
                borderRadius: 8,
                padding: "6px 12px",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                alignSelf: "flex-start",
              }}
            >
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
