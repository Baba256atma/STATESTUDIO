"use client";

import { HEALTH_COLOR } from "./ExecutiveMonitoringConfig";
import { ExecutiveHealthBadge } from "./ExecutiveHealthBadge";
import { useExecutiveMonitoring } from "./hooks/useExecutiveMonitoring";
import { cockpit } from "../shell/executiveCockpitTheme";

/**
 * ExecutiveHealthCard — single executive health indicator.
 */
export function ExecutiveHealthCard() {
  const { executiveHealth, summary } = useExecutiveMonitoring();
  const color = HEALTH_COLOR[executiveHealth];

  return (
    <article
      data-testid="executive-health-card"
      data-health={executiveHealth}
      style={{
        padding: "0.7rem 0.75rem",
        borderRadius: "0.5rem",
        border: `1px solid ${color}66`,
        background: `${color}12`,
        display: "flex",
        flexDirection: "column",
        gap: "0.4rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.4rem",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.56rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: cockpit.lowMuted,
          }}
        >
          Executive Health
        </p>
        <ExecutiveHealthBadge health={executiveHealth} />
      </div>
      <strong style={{ fontSize: "1.05rem", color }}>{executiveHealth}</strong>
      <p
        style={{
          margin: 0,
          fontSize: "0.72rem",
          color: cockpit.textSoft,
          lineHeight: 1.4,
        }}
      >
        {summary}
      </p>
    </article>
  );
}
