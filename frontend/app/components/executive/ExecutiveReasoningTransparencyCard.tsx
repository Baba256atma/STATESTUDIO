"use client";

import type React from "react";

import type { ExecutiveReasoningTransparency } from "../../lib/reasoning-transparency";
import { nx, softCardStyle } from "../ui/nexoraTheme";

type ExecutiveReasoningTransparencyCardProps = {
  transparency: ExecutiveReasoningTransparency | null;
  compact?: boolean;
};

export function ExecutiveReasoningTransparencyCard({
  transparency,
  compact = false,
}: ExecutiveReasoningTransparencyCardProps): React.ReactElement | null {
  if (!transparency) return null;

  const primarySignal = transparency.primarySignals[0] ?? "Operational signals are still forming.";
  const primaryAssumption = transparency.assumptions[0]?.label ?? "Strategic assumptions are stabilizing.";
  const primaryUncertainty = transparency.uncertaintySources[0]?.label;
  const primaryConfidence = transparency.confidenceFactors[0]?.label;

  return (
    <section
      data-nx="executive-reasoning-transparency-card"
      aria-label="Executive reasoning transparency"
      style={{
        ...softCardStyle,
        padding: compact ? 10 : 12,
        border: "1px solid rgba(94, 234, 212, 0.18)",
        display: "flex",
        flexDirection: "column",
        gap: compact ? 6 : 8,
      }}
    >
      <div
        style={{ color: nx.lowMuted, fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}
      >
        Reasoning transparency
      </div>
      <div style={{ color: nx.text, fontSize: compact ? 12 : 13, fontWeight: 800, lineHeight: 1.35 }}>
        {transparency.reasoningSummary}
      </div>
      {!compact ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 6 }}>
          <ReasonRow label="Evidence" value={primarySignal} />
          <ReasonRow label="Assumption" value={primaryAssumption} />
          {primaryUncertainty ? <ReasonRow label="Uncertainty" value={primaryUncertainty} /> : null}
          {transparency.tradeoffs[0] ? (
            <ReasonRow label="Tradeoff" value={transparency.tradeoffs[0].label} />
          ) : null}
        </div>
      ) : null}
      {primaryConfidence ? (
        <div style={{ color: nx.muted, fontSize: 11, lineHeight: 1.45 }}>{primaryConfidence}</div>
      ) : null}
    </section>
  );
}

function ReasonRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ color: nx.textSoft, fontSize: 11, lineHeight: 1.4 }}>
      <strong>{label}:</strong> {value}
    </div>
  );
}
