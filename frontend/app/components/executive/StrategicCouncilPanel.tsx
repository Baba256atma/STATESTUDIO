"use client";

import React from "react";

import { cardStyle, nx, sectionTitleStyle } from "../ui/nexoraTheme";
import type { StrategicCouncilResult } from "../../lib/council/strategicCouncilTypes";
import { CouncilDisagreementPanel } from "./CouncilDisagreementPanel";
import { CouncilOpinionCard } from "./CouncilOpinionCard";
import { CouncilSynthesisPanel } from "./CouncilSynthesisPanel";

type StrategicCouncilPanelProps = {
  council: StrategicCouncilResult | null;
  compact?: boolean;
  titleLabel?: string;
  emptyText?: string;
};

export function StrategicCouncilPanel({ council, compact = false, titleLabel, emptyText }: StrategicCouncilPanelProps) {
  if (!council) {
    return (
      <div style={{ ...cardStyle, color: nx.lowMuted, fontSize: 12, padding: 14 }}>
        {emptyText ?? "The strategic council activates when Nexora sees enough pressure, fragility, or tradeoff signal to brief leadership clearly."}
      </div>
    );
  }

  return (
    <div style={{ ...cardStyle, gap: 14, padding: 14 }}>
      <div style={{ ...sectionTitleStyle, color: "#cbd5f5" }}>{titleLabel ?? "Strategic Council"}</div>
      <CouncilSynthesisPanel synthesis={council.synthesis} />
      <CouncilDisagreementPanel disagreement={council.disagreements[0] ?? null} />
      <div style={{ display: "grid", gridTemplateColumns: compact ? "1fr" : "repeat(3, minmax(0, 1fr))", gap: 8 }}>
        {council.opinions.map((opinion) => (
          <CouncilOpinionCard key={opinion.role} opinion={opinion} />
        ))}
      </div>
    </div>
  );
}
