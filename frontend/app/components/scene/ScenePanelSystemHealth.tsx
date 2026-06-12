"use client";

import React from "react";

import type { SceneRuntimeSummary } from "../../lib/scene/sceneRuntimeSummary";
import type { NexoraHudThemeTokens } from "../../lib/scene/nexoraHudTheme";
import { nexoraHudSectionLabelStyle } from "../../lib/scene/nexoraHudTheme";
import { nx } from "../ui/nexoraTheme";

export type ScenePanelSystemHealthProps = {
  theme: NexoraHudThemeTokens;
  summary: SceneRuntimeSummary;
};

const metricRowStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: 6,
  alignItems: "center",
  padding: "3px 0",
};

export function ScenePanelSystemHealth(props: ScenePanelSystemHealthProps): React.ReactElement {
  const rows = [
    { label: "Warnings", value: String(props.summary.warningCount) },
    { label: "Recommendations", value: String(props.summary.recommendationCount) },
    { label: "Last Update", value: props.summary.lastUpdateLabel },
  ] as const;

  return (
    <section data-nx-section="system-health">
      <div style={{ ...nexoraHudSectionLabelStyle(props.theme), marginBottom: 6 }}>System Health</div>
      <div
        style={{
          borderRadius: 6,
          border: `1px solid color-mix(in srgb, ${nx.borderSoft} 65%, transparent)`,
          background: "color-mix(in srgb, var(--nx-bg-control) 42%, transparent)",
          padding: "5px 7px",
        }}
      >
        {rows.map((row) => (
          <div key={row.label} style={metricRowStyle}>
            <span style={{ color: nx.muted }}>{row.label}</span>
            <span style={{ color: nx.text, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ScenePanelSystemHealth;
