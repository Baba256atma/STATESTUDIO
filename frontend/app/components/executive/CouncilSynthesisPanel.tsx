"use client";

import React from "react";

import { nx, softCardStyle } from "../ui/nexoraTheme";
import type { CouncilSynthesis } from "../../lib/council/strategicCouncilTypes";

type CouncilSynthesisPanelProps = {
  synthesis: CouncilSynthesis;
};

export function CouncilSynthesisPanel({ synthesis }: CouncilSynthesisPanelProps) {
  return (
    <div style={{ ...softCardStyle, gap: 8, border: "1px solid rgba(96,165,250,0.2)" }}>
      <div style={{ color: "#93c5fd", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
        Council Synthesis
      </div>
      <div style={{ color: "#f8fafc", fontSize: 14, fontWeight: 800 }}>{synthesis.headline}</div>
      <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{synthesis.summary}</div>
      <div style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 700 }}>{synthesis.recommended_direction}</div>
      {synthesis.top_actions.length ? (
        <div style={{ color: "#cbd5e1", fontSize: 11 }}>Actions: {synthesis.top_actions.slice(0, 3).join(" · ")}</div>
      ) : null}
    </div>
  );
}
