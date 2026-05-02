"use client";

import React from "react";

import { nx, softCardStyle, secondaryButtonStyle } from "../ui/nexoraTheme";
import { useStrategicCommandPanelModel, type StrategicCommandPanelModelProps } from "./useStrategicCommandPanelModel";

export type StrategicCommandPreviewProps = StrategicCommandPanelModelProps & {
  onOpenFull: () => void;
  /** Compact secondary actions — kept inline; never multi-column. */
  onQuickSimulate?: (() => void) | null;
  onQuickCompare?: (() => void) | null;
};

function clamp(text: string, max: number) {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

/** Compact rail preview only — full 3-column workspace lives in the center component panel. */
export function StrategicCommandPreview(props: StrategicCommandPreviewProps) {
  const { onOpenFull, onQuickSimulate, onQuickCompare, ...modelProps } = props;
  const s = useStrategicCommandPanelModel(modelProps);
  const primaryRec = clamp(s.command_recommendation || s.headline, 260);
  const impactShort =
    [s.command_confidence_note, s.review_flags[0]].find((x) => typeof x === "string" && x.trim().length > 0) ??
    clamp(s.explanation, 140);

  const ghostBtn: React.CSSProperties = {
    flex: "1 1 auto",
    minWidth: 0,
    padding: "7px 10px",
    borderRadius: 8,
    border: `1px solid rgba(148,163,184,0.22)`,
    background: "rgba(2,6,23,0.35)",
    color: nx.textSoft,
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, minHeight: 0, maxWidth: "100%" }}>
      <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        Strategic Command
      </div>
      <div style={{ color: nx.text, fontSize: 14, fontWeight: 800, lineHeight: 1.35 }}>{s.headline}</div>
      <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>{clamp(s.summary, 320)}</div>

      <div style={{ ...softCardStyle, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Primary recommendation
        </div>
        <div style={{ color: nx.text, fontSize: 12, fontWeight: 600, lineHeight: 1.45 }}>{primaryRec}</div>
        <div style={{ color: nx.lowMuted, fontSize: 11, lineHeight: 1.45 }}>{impactShort}</div>
      </div>

      {onQuickSimulate || onQuickCompare ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ color: nx.lowMuted, fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Quick actions
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {onQuickSimulate ? (
              <button type="button" onClick={() => onQuickSimulate()} style={ghostBtn}>
                Simulate
              </button>
            ) : null}
            {onQuickCompare ? (
              <button type="button" onClick={() => onQuickCompare()} style={ghostBtn}>
                Compare
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onOpenFull}
        style={{ ...secondaryButtonStyle, width: "100%", padding: "10px 12px", fontSize: 12, fontWeight: 800 }}
      >
        Open Strategic Command
      </button>
    </div>
  );
}
