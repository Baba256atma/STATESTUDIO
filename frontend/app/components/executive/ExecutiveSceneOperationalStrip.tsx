"use client";

import type React from "react";

import { nx } from "../ui/nexoraTheme";

export type ExecutiveSceneOperationalStripProps = {
  operationalState: string;
  primarySignal: string;
  secondarySignal?: string;
  activeInsight?: string | null;
  objectCount?: number;
  fragilityLabel?: string | null;
};

/**
 * Lightweight executive scene operational status overlay (Type-C scene host).
 */
export function ExecutiveSceneOperationalStrip(
  props: ExecutiveSceneOperationalStripProps
): React.ReactElement | null {
  const {
    operationalState,
    primarySignal,
    secondarySignal = "",
    activeInsight = null,
    objectCount,
    fragilityLabel = null,
  } = props;

  const primary = primarySignal.trim();
  if (!primary && !operationalState && !activeInsight) {
    return null;
  }

  const metaParts: string[] = [];
  if (typeof objectCount === "number" && objectCount >= 0) {
    metaParts.push(`${objectCount} object${objectCount === 1 ? "" : "s"}`);
  }
  if (fragilityLabel?.trim()) {
    metaParts.push(`Fragility · ${fragilityLabel.trim()}`);
  }

  return (
    <section
      className="nx-executive-scene-operational-strip"
      aria-label="Executive scene operational status"
      style={{
        maxWidth: 360,
        borderRadius: 10,
        border: `1px solid ${nx.border}`,
        background: "rgba(15, 23, 42, 0.88)",
        backdropFilter: "blur(8px)",
        padding: "8px 10px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
        <span
          style={{
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: nx.lowMuted,
          }}
        >
          Scene · {operationalState}
        </span>
        {metaParts.length > 0 ? (
          <span style={{ fontSize: 9, fontWeight: 600, color: nx.textSoft }}>{metaParts.join(" · ")}</span>
        ) : null}
      </div>
      {primary ? (
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: nx.textStrong, lineHeight: 1.35 }}>
          {primary}
        </p>
      ) : null}
      {secondarySignal.trim() ? (
        <p style={{ margin: 0, fontSize: 10, color: nx.muted, lineHeight: 1.35 }}>{secondarySignal.trim()}</p>
      ) : null}
      {activeInsight?.trim() ? (
        <p style={{ margin: 0, fontSize: 10, color: nx.textSoft, lineHeight: 1.35 }}>{activeInsight.trim()}</p>
      ) : null}
    </section>
  );
}
