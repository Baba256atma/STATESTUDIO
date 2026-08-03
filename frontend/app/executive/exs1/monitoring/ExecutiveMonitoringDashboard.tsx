"use client";

import { ExecutiveAlertCard } from "./ExecutiveAlertCard";
import { ExecutiveHealthCard } from "./ExecutiveHealthCard";
import { ExecutiveKPICard } from "./ExecutiveKPICard";
import { useExecutiveMonitoring } from "./hooks/useExecutiveMonitoring";
import { cockpit } from "../shell/executiveCockpitTheme";

/**
 * ExecutiveMonitoringDashboard — Insight-oriented mock dashboard blocks.
 */
export function ExecutiveMonitoringDashboard() {
  const { kpis, alerts, notes, summary } = useExecutiveMonitoring();

  return (
    <div
      data-testid="executive-monitoring-dashboard"
      style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}
    >
      <ExecutiveHealthCard />
      <section>
        <p style={labelStyle}>KPI Dashboard</p>
        <div
          style={{
            marginTop: "0.35rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
          }}
        >
          {kpis.map((kpi) => (
            <ExecutiveKPICard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      </section>
      <section>
        <p style={labelStyle}>Alert Center</p>
        <div
          style={{
            marginTop: "0.35rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
          }}
        >
          {alerts.map((alert) => (
            <ExecutiveAlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </section>
      <section>
        <p style={labelStyle}>Trend Summary</p>
        <p
          style={{
            margin: "0.3rem 0 0",
            fontSize: "0.74rem",
            color: cockpit.textSoft,
            lineHeight: 1.4,
          }}
        >
          {summary} Revenue holds near target while Delivery and Inventory lag
          the expected recovery curve (mock).
        </p>
      </section>
      <section>
        <p style={labelStyle}>Executive Notes</p>
        <p
          style={{
            margin: "0.3rem 0 0",
            fontSize: "0.74rem",
            color: cockpit.muted,
            lineHeight: 1.4,
          }}
        >
          {notes}
        </p>
      </section>
    </div>
  );
}

const labelStyle = {
  margin: 0,
  fontSize: "0.56rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: cockpit.lowMuted,
};
