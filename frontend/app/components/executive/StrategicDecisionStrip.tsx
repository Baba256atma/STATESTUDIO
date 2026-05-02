"use client";

import type { DecisionStripModel } from "./buildStrategicDecisionStrip";
import { nx } from "../ui/nexoraTheme";

type StrategicDecisionStripProps = {
  model: DecisionStripModel;
};

const riskColors: Record<NonNullable<DecisionStripModel["riskTag"]>, { bg: string; fg: string; border: string }> = {
  low: { bg: "rgba(34,197,94,0.12)", fg: "#86efac", border: "rgba(34,197,94,0.35)" },
  medium: { bg: "rgba(245,158,11,0.12)", fg: "#fcd34d", border: "rgba(245,158,11,0.38)" },
  high: { bg: "rgba(248,113,113,0.14)", fg: "#fca5a5", border: "rgba(248,113,113,0.4)" },
};

/** Dominant top-of-panel decision summary for Type-C executives. */
export function StrategicDecisionStrip(props: StrategicDecisionStripProps) {
  const { model } = props;
  const risk = model.riskTag ? riskColors[model.riskTag] : null;

  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid rgba(96,165,250,0.35)",
        background: "linear-gradient(135deg, rgba(30,58,138,0.45) 0%, rgba(15,23,42,0.92) 55%, rgba(2,6,23,0.95) 100%)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
        padding: "18px 20px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
        <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase" }}>
          Decision
        </div>
        {risk ? (
          <span
            style={{
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "4px 10px",
              borderRadius: 999,
              border: `1px solid ${risk.border}`,
              background: risk.bg,
              color: risk.fg,
            }}
          >
            Risk · {model.riskTag}
          </span>
        ) : null}
      </div>
      <div style={{ color: "#f8fafc", fontSize: 22, fontWeight: 900, lineHeight: 1.2, letterSpacing: "-0.02em" }}>{model.decision}</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
        <div>
          <div style={{ color: "#93c5fd", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
            Action
          </div>
          <div style={{ color: "#e2e8f0", fontSize: 17, fontWeight: 800, lineHeight: 1.35 }}>{model.action}</div>
        </div>
        <div>
          <div style={{ color: "#93c5fd", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
            Confidence
          </div>
          <div style={{ color: "#cbd5e1", fontSize: 15, fontWeight: 700, lineHeight: 1.4 }}>{model.confidence}</div>
        </div>
      </div>

      {model.impactHint ? (
        <div style={{ color: nx.muted, fontSize: 13, lineHeight: 1.45, borderTop: "1px solid rgba(148,163,184,0.18)", paddingTop: 12 }}>
          {model.impactHint}
        </div>
      ) : null}
    </div>
  );
}
