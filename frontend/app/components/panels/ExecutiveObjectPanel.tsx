"use client";

import React from "react";
import { nx, softCardStyle } from "../ui/nexoraTheme";
import type { ExecutiveObjectPanelData } from "../../lib/panels/executiveObjectPanelData";
import { fallbackExecutiveData } from "../../lib/panels/executiveObjectPanelData";

type Props = {
  data: ExecutiveObjectPanelData | null;
  selectedObjectId: string | null;
};

type ExecutiveObjectAction = "war_room" | "compare_options" | "next_move";

function emitExecutiveObjectAction(action: ExecutiveObjectAction, objectId: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("nexora:executive-object-action", {
      detail: {
        action,
        objectId,
      },
    })
  );
}

function riskBadgeStyle(level: ExecutiveObjectPanelData["riskLevel"]): React.CSSProperties {
  const base: React.CSSProperties = {
    display: "inline-block",
    fontSize: 10,
    fontWeight: 750,
    padding: "2px 8px",
    borderRadius: 999,
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
  };
  switch (level) {
    case "critical":
      return { ...base, background: "rgba(248,113,113,0.18)", color: "#fecaca", border: "1px solid rgba(248,113,113,0.35)" };
    case "high":
      return { ...base, background: "rgba(251,146,60,0.16)", color: "#fed7aa", border: "1px solid rgba(251,146,60,0.32)" };
    case "medium":
      return { ...base, background: "rgba(250,204,21,0.14)", color: "#fef08a", border: "1px solid rgba(250,204,21,0.28)" };
    case "low":
      return { ...base, background: "rgba(74,222,128,0.14)", color: "#bbf7d0", border: "1px solid rgba(74,222,128,0.28)" };
    default:
      return { ...base, background: "rgba(148,163,184,0.12)", color: nx.muted, border: "1px solid rgba(148,163,184,0.2)" };
  }
}

export default function ExecutiveObjectPanel({ data, selectedObjectId }: Props) {
  const oid = String(selectedObjectId ?? "").trim();

  const merged: ExecutiveObjectPanelData | null = oid
    ? {
        objectId: oid,
        objectName: data?.objectName,
        ...fallbackExecutiveData,
        ...(data && data.objectId === oid ? data : {}),
      }
    : null;

  if (!oid || !merged) {
    return (
      <div style={{ ...softCardStyle, padding: 14, color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
        Select an object to see executive insight.
      </div>
    );
  }

  const insightParts = merged.insight.split(/\n+/).map((p) => p.trim()).filter(Boolean);
  const what = insightParts[0] ?? merged.insight;
  const why = insightParts.slice(1).join(" ") || null;

  const confPct = Math.round((merged.confidence ?? 0.5) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <section style={{ ...softCardStyle, padding: 12 }}>
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: nx.lowMuted }}>
          Primary insight
        </div>
        <div style={{ marginTop: 8, fontSize: 12, fontWeight: 650, color: nx.text, lineHeight: 1.4 }}>What happened?</div>
        <div style={{ marginTop: 4, fontSize: 12, color: nx.muted, lineHeight: 1.45 }}>{what || "—"}</div>
        <div style={{ marginTop: 10, fontSize: 12, fontWeight: 650, color: nx.text, lineHeight: 1.4 }}>Why it matters?</div>
        <div style={{ marginTop: 4, fontSize: 12, color: nx.muted, lineHeight: 1.45 }}>{why || "—"}</div>
      </section>

      <section style={{ ...softCardStyle, padding: 12 }}>
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: nx.lowMuted }}>
          Risk snapshot
        </div>
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={riskBadgeStyle(merged.riskLevel)}>{merged.riskLevel}</span>
          <span style={{ fontSize: 11, color: nx.muted }}>
            Affected:{" "}
            {(merged.affectedObjects?.length ?? 0) > 0 ? merged.affectedObjects!.join(", ") : "None surfaced"}
          </span>
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: nx.muted, lineHeight: 1.4 }}>
          Fragility signal:{" "}
          {(merged.affectedObjects?.length ?? 0) > 2
            ? "Multiple neighbors in play — watch knock-on effects."
            : "Single-thread exposure for now."}
        </div>
      </section>

      <section style={{ ...softCardStyle, padding: 12, border: "1px solid rgba(56,189,248,0.22)" }}>
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: nx.lowMuted }}>
          Recommended action
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: nx.text, lineHeight: 1.45, fontWeight: 600 }}>{merged.recommendedAction}</div>
        <div style={{ marginTop: 10, fontSize: 11, color: nx.muted }}>
          Confidence: <span style={{ color: nx.text, fontWeight: 700 }}>{confPct}%</span>
        </div>
      </section>
      {oid ? (
        <section style={{ ...softCardStyle, padding: 12 }}>
          <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: nx.lowMuted }}>
            Next decision
          </div>
          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button
              type="button"
              onClick={() => emitExecutiveObjectAction("war_room", oid)}
              style={{
                height: 30,
                padding: "0 10px",
                borderRadius: 8,
                border: "1px solid rgba(56,189,248,0.28)",
                background: "rgba(56,189,248,0.12)",
                color: nx.text,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Open War Room
            </button>
            <button
              type="button"
              onClick={() => emitExecutiveObjectAction("compare_options", oid)}
              style={{
                height: 30,
                padding: "0 10px",
                borderRadius: 8,
                border: "1px solid rgba(148,163,184,0.24)",
                background: "rgba(2,6,23,0.32)",
                color: nx.textSoft,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Compare Options
            </button>
            <button
              type="button"
              onClick={() => emitExecutiveObjectAction("next_move", oid)}
              style={{
                height: 30,
                padding: "0 10px",
                borderRadius: 8,
                border: "1px solid rgba(34,197,94,0.28)",
                background: "rgba(34,197,94,0.12)",
                color: nx.text,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Show Next Move
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
