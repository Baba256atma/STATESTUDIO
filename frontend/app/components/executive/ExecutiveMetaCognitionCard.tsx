"use client";

import type React from "react";

import type { ExecutiveMetaCognitionSnapshot } from "../../lib/meta-cognition";
import { nx, softCardStyle } from "../ui/nexoraTheme";

type ExecutiveMetaCognitionCardProps = {
  snapshot: ExecutiveMetaCognitionSnapshot | null;
  compact?: boolean;
};

function formatConfidence(value: number): string {
  return `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%`;
}

export function ExecutiveMetaCognitionCard({
  snapshot,
  compact = false,
}: ExecutiveMetaCognitionCardProps): React.ReactElement | null {
  if (!snapshot) return null;

  const primaryAssumption = snapshot.assumptions[0]?.label ?? "Reasoning assumptions are still forming.";
  const primaryLimit = snapshot.advisoryLimits[0] ?? "Executive review remains required.";

  return (
    <section
      data-nx="executive-meta-cognition-card"
      aria-label="Executive reasoning reflection"
      style={{
        ...softCardStyle,
        padding: compact ? 10 : 12,
        border: "1px solid rgba(125, 211, 252, 0.2)",
        display: "flex",
        flexDirection: "column",
        gap: compact ? 6 : 8,
      }}
    >
      <div style={{ color: nx.lowMuted, fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        Strategic self-awareness
      </div>
      <div style={{ color: nx.text, fontSize: compact ? 12 : 13, fontWeight: 800, lineHeight: 1.35 }}>
        {snapshot.strategicReflection}
      </div>
      <div style={{ color: nx.muted, fontSize: 11, lineHeight: 1.45 }}>
        {snapshot.confidenceEvolution.explanation}
      </div>
      {!compact ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 6 }}>
          <div style={{ color: nx.textSoft, fontSize: 11, lineHeight: 1.4 }}>
            <strong>Assumption:</strong> {primaryAssumption}
          </div>
          <div style={{ color: nx.textSoft, fontSize: 11, lineHeight: 1.4 }}>
            <strong>Limit:</strong> {primaryLimit}
          </div>
        </div>
      ) : null}
      <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 700 }}>
        Confidence {formatConfidence(snapshot.confidenceEvolution.current)} · {snapshot.confidenceEvolution.direction}
      </div>
    </section>
  );
}

