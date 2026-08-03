"use client";

import type { MonitoringKpi } from "./ExecutiveMonitoringConfig";
import { HEALTH_COLOR } from "./ExecutiveMonitoringConfig";
import { ExecutiveHealthBadge } from "./ExecutiveHealthBadge";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly kpi: MonitoringKpi;
};

/**
 * ExecutiveKPICard — Expected → Actual → Variance (visual only).
 */
export function ExecutiveKPICard({ kpi }: Props) {
  const color = HEALTH_COLOR[kpi.health];

  return (
    <article
      data-testid={`executive-kpi-card-${kpi.id}`}
      data-health={kpi.health}
      style={{
        padding: "0.55rem 0.6rem",
        borderRadius: "0.45rem",
        border: `1px solid ${color}55`,
        background: cockpit.panelSoft,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "0.35rem",
        }}
      >
        <strong style={{ fontSize: "0.8rem", color: cockpit.text }}>
          {kpi.name}
        </strong>
        <ExecutiveHealthBadge health={kpi.health} compact />
      </div>
      <div
        style={{
          marginTop: "0.4rem",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr auto 1fr",
          gap: "0.25rem",
          alignItems: "center",
          fontSize: "0.66rem",
        }}
      >
        <Metric label="Expected" value={kpi.expected} />
        <Arrow />
        <Metric label="Actual" value={kpi.actual} accent={color} />
        <Arrow />
        <Metric label="Variance" value={kpi.variance} accent={color} />
      </div>
    </article>
  );
}

function Metric({
  label,
  value,
  accent,
}: {
  readonly label: string;
  readonly value: string;
  readonly accent?: string;
}) {
  return (
    <div>
      <p
        style={{
          margin: 0,
          fontSize: "0.5rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: cockpit.lowMuted,
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: "0.15rem 0 0",
          fontWeight: 600,
          color: accent ?? cockpit.textSoft,
        }}
      >
        {value}
      </p>
    </div>
  );
}

function Arrow() {
  return (
    <span aria-hidden style={{ color: cockpit.lowMuted, fontSize: "0.7rem" }}>
      ↓
    </span>
  );
}
