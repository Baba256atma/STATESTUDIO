"use client";

import React from "react";

import { nx, softCardStyle } from "../ui/nexoraTheme";
import type { CouncilAgentOpinion } from "../../lib/council/strategicCouncilTypes";

type CouncilOpinionCardProps = {
  opinion: CouncilAgentOpinion;
};

export function CouncilOpinionCard({ opinion }: CouncilOpinionCardProps) {
  return (
    <div style={{ ...softCardStyle, gap: 8, border: "1px solid rgba(148,163,184,0.18)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div style={{ color: "#f8fafc", fontSize: 12, fontWeight: 800 }}>{opinion.headline}</div>
        <div style={{ color: "#93c5fd", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
          {opinion.role}
        </div>
      </div>
      <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{opinion.summary}</div>
      {opinion.priorities.length ? (
        <div style={{ color: "#cbd5e1", fontSize: 11 }}>Priorities: {opinion.priorities.slice(0, 2).join(" · ")}</div>
      ) : null}
      {opinion.concerns.length ? (
        <div style={{ color: nx.lowMuted, fontSize: 11 }}>Concerns: {opinion.concerns.slice(0, 2).join(" · ")}</div>
      ) : null}
    </div>
  );
}
