"use client";

import React from "react";

import { nx, softCardStyle } from "../ui/nexoraTheme";
import type { CouncilDisagreement } from "../../lib/council/strategicCouncilTypes";

type CouncilDisagreementPanelProps = {
  disagreement: CouncilDisagreement | null;
};

export function CouncilDisagreementPanel({ disagreement }: CouncilDisagreementPanelProps) {
  if (!disagreement) {
    return (
      <div style={{ ...softCardStyle, color: nx.lowMuted, fontSize: 12 }}>
        The council is currently aligned enough that no major executive disagreement needs escalation.
      </div>
    );
  }

  return (
    <div style={{ ...softCardStyle, gap: 8, border: "1px solid rgba(252,165,165,0.16)" }}>
      <div style={{ color: nx.risk, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em" }}>
        Active Tension
      </div>
      <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800 }}>{disagreement.dimension.replace(/_/g, " ")}</div>
      <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{disagreement.summary}</div>
      <div style={{ color: "#cbd5e1", fontSize: 11, lineHeight: 1.5 }}>
        CEO: {disagreement.ceo_position ?? "No position"} | CFO: {disagreement.cfo_position ?? "No position"} | COO: {disagreement.coo_position ?? "No position"}
      </div>
    </div>
  );
}
