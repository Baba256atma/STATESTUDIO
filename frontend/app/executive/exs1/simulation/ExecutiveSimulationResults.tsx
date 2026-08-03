"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import type { ExecutiveSimulationSession } from "./ExecutiveSimulationSession";

type Props = {
  readonly session: ExecutiveSimulationSession | null;
};

export function ExecutiveSimulationResults({ session }: Props) {
  if (!session?.results) {
    return (
      <div
        data-testid="executive-simulation-results-empty"
        style={{ color: cockpit.muted, fontSize: "0.74rem" }}
      >
        Simulation results appear after a completed run.
      </div>
    );
  }

  const { future, impact, risk, confidence, executiveNotes } = session.results;

  return (
    <section
      data-testid="executive-simulation-results"
      style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}
    >
      <div>
        <strong style={{ color: cockpit.accent, fontSize: "0.78rem" }}>
          {session.scenarioLabel} · Future State
        </strong>
        <p style={{ margin: "0.25rem 0 0", fontSize: "0.7rem", color: cockpit.muted }}>
          {executiveNotes}
        </p>
      </div>

      <div
        data-testid="simulation-object-deltas"
        style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}
      >
        {future.objects.map((object) => (
          <div
            key={object.objectId}
            data-testid={`simulation-object-${object.objectId}`}
            style={{
              padding: "0.4rem 0.5rem",
              borderRadius: cockpit.radius.sm,
              border: `1px solid ${cockpit.border}`,
              background: cockpit.panelSoft,
              fontSize: "0.7rem",
              color: cockpit.textSoft,
            }}
          >
            <strong style={{ color: cockpit.text }}>{object.label}</strong>
            <div>
              Current {object.current}
              {object.unit} → Future {object.future}
              {object.unit} · Delta {object.delta >= 0 ? "+" : ""}
              {object.delta}
            </div>
          </div>
        ))}
      </div>

      <div data-testid="simulation-kpi-projections">
        {future.kpis.map((kpi) => (
          <div
            key={kpi.kpiId}
            style={{
              fontSize: "0.7rem",
              color: cockpit.textSoft,
              marginBottom: "0.25rem",
            }}
          >
            {kpi.name} · {kpi.current}
            {kpi.unit} → {kpi.projected}
            {kpi.unit} · {kpi.difference >= 0 ? "↑ +" : "↓ "}
            {Math.abs(kpi.difference)}
            {kpi.unit}
          </div>
        ))}
      </div>

      <div style={{ fontSize: "0.7rem", color: cockpit.muted }}>
        Impact · {impact.summary}
      </div>
      <div
        data-testid="simulation-risk"
        style={{ fontSize: "0.7rem", color: cockpit.muted }}
      >
        Risk · {risk.level} · Confidence · {confidence}% (static)
      </div>
    </section>
  );
}
