"use client";

import type { MonitoringAlert } from "./ExecutiveMonitoringConfig";
import { ALERT_COLOR } from "./ExecutiveMonitoringConfig";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly alert: MonitoringAlert;
};

/**
 * ExecutiveAlertCard — Information / Warning / Critical.
 */
export function ExecutiveAlertCard({ alert }: Props) {
  const color = ALERT_COLOR[alert.severity];

  return (
    <article
      data-testid={`executive-alert-card-${alert.id}`}
      data-severity={alert.severity}
      style={{
        padding: "0.55rem 0.6rem",
        borderRadius: "0.45rem",
        border: `1px solid ${color}66`,
        background: `${color}10`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "0.35rem",
          alignItems: "center",
        }}
      >
        <strong style={{ fontSize: "0.78rem", color: cockpit.text }}>
          {alert.title}
        </strong>
        <span
          style={{
            fontSize: "0.5rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color,
            border: `1px solid ${color}`,
            borderRadius: "999px",
            padding: "0.1rem 0.32rem",
          }}
        >
          {alert.severity}
        </span>
      </div>
      <p
        style={{
          margin: "0.3rem 0 0",
          fontSize: "0.7rem",
          color: cockpit.textSoft,
          lineHeight: 1.4,
        }}
      >
        {alert.summary}
      </p>
    </article>
  );
}
