"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import { useExecutiveSimulation } from "./hooks/useExecutiveSimulation";

export function ExecutiveSimulationInspector() {
  const { activeSession, overlayActive, sessions } = useExecutiveSimulation();

  return (
    <section
      data-testid="executive-simulation-inspector"
      style={{
        padding: "0.55rem 0.65rem",
        borderRadius: cockpit.radius.md,
        border: `1px solid ${cockpit.border}`,
        background: cockpit.panelSoft,
        fontSize: "0.7rem",
        color: cockpit.textSoft,
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
      }}
    >
      <strong style={{ color: cockpit.accent }}>Simulation Inspector</strong>
      <div>Sessions · {sessions.length}</div>
      <div>Active · {activeSession?.scenarioLabel ?? "—"}</div>
      <div>Status · {activeSession?.status ?? "—"}</div>
      <div>Overlay · {overlayActive ? "On" : "Off"}</div>
      <div>
        Decision Candidate · {activeSession?.decisionCandidateId ?? "—"}
      </div>
      <div>
        Assumptions · {activeSession?.assumptionIds.join(", ") || "—"}
      </div>
    </section>
  );
}
