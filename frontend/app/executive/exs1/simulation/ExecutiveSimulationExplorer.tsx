"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import { ExecutiveSimulationComparison } from "./ExecutiveSimulationComparison";
import { ExecutiveSimulationInspector } from "./ExecutiveSimulationInspector";
import { ExecutiveSimulationResults } from "./ExecutiveSimulationResults";
import { SIMULATION_ASSUMPTIONS } from "./ExecutiveSimulationConfig";
import type { SimulationAssumptionId } from "./ExecutiveSimulationConfig";
import { useExecutiveSimulation } from "./hooks/useExecutiveSimulation";

type Section = "Sessions" | "Results" | "Comparison" | "Archived";

const SECTIONS: readonly Section[] = [
  "Sessions",
  "Results",
  "Comparison",
  "Archived",
];

/**
 * Simulations Explorer — sessions, results, comparison, archived.
 */
export function ExecutiveSimulationExplorer() {
  const {
    sessions,
    activeSession,
    section,
    setSection,
    setActiveSessionId,
    createInventoryShortage,
    toggleAssumption,
    runActive,
    createDecisionCandidate,
    overlayActive,
    setOverlayActive,
    archiveActive,
    busy,
    error,
  } = useExecutiveSimulation();

  const archived = sessions.filter((s) => s.status === "Archived");

  return (
    <div
      data-testid="executive-simulation-explorer"
      style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}
    >
      <div>
        <p
          style={{
            margin: 0,
            fontSize: cockpit.type.status.size,
            letterSpacing: cockpit.type.status.tracking,
            textTransform: "uppercase",
            color: cockpit.lowMuted,
          }}
        >
          Executive Simulations
        </p>
        <p
          style={{
            margin: "0.3rem 0 0",
            fontSize: "0.74rem",
            color: cockpit.textSoft,
          }}
        >
          Deterministic future states · Runtime stays unchanged until Decision.
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
        {SECTIONS.map((item) => (
          <button
            key={item}
            type="button"
            data-testid={`simulation-section-${item.toLowerCase()}`}
            onClick={() => setSection(item)}
            style={{
              padding: "0.3rem 0.5rem",
              borderRadius: cockpit.radius.sm,
              border:
                section === item
                  ? `1px solid ${cockpit.accent}`
                  : `1px solid ${cockpit.border}`,
              background: section === item ? cockpit.accentSoft : "transparent",
              color: section === item ? cockpit.accent : cockpit.muted,
              fontSize: "0.62rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {section === "Sessions" ? (
        <>
          <button
            type="button"
            data-testid="simulation-create-inventory-shortage"
            disabled={busy}
            onClick={() => createInventoryShortage()}
            style={primaryButton}
          >
            New · Inventory Shortage
          </button>

          {activeSession ? (
            <section
              data-testid="simulation-assumption-picker"
              style={{
                padding: "0.55rem 0.6rem",
                borderRadius: cockpit.radius.md,
                border: `1px solid ${cockpit.border}`,
                background: cockpit.panelSoft,
                display: "flex",
                flexDirection: "column",
                gap: "0.35rem",
              }}
            >
              <strong style={{ fontSize: "0.72rem", color: cockpit.accent }}>
                Explicit Assumptions
              </strong>
              {SIMULATION_ASSUMPTIONS.map((assumption) => {
                const checked = activeSession.assumptionIds.includes(
                  assumption.id,
                );
                return (
                  <label
                    key={assumption.id}
                    style={{
                      display: "flex",
                      gap: "0.4rem",
                      fontSize: "0.68rem",
                      color: cockpit.textSoft,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      data-testid={`simulation-assumption-${assumption.id}`}
                      checked={checked}
                      onChange={() =>
                        toggleAssumption(
                          assumption.id as SimulationAssumptionId,
                        )
                      }
                    />
                    <span>
                      {assumption.label}
                      <span style={{ display: "block", color: cockpit.muted }}>
                        {assumption.description}
                      </span>
                    </span>
                  </label>
                );
              })}
            </section>
          ) : null}

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
            <button
              type="button"
              data-testid="simulation-run"
              disabled={!activeSession || busy}
              onClick={() => void runActive()}
              style={primaryButton}
            >
              Run Simulation
            </button>
            <button
              type="button"
              data-testid="simulation-toggle-overlay"
              disabled={!activeSession?.results}
              onClick={() => setOverlayActive(!overlayActive)}
              style={secondaryButton}
            >
              {overlayActive ? "Hide Overlay" : "Show Overlay"}
            </button>
            <button
              type="button"
              data-testid="simulation-create-decision"
              disabled={
                !activeSession ||
                activeSession.status !== "Completed" ||
                busy
              }
              onClick={() => createDecisionCandidate()}
              style={secondaryButton}
            >
              Create Decision Candidate
            </button>
            <button
              type="button"
              data-testid="simulation-archive"
              disabled={!activeSession}
              onClick={() => archiveActive()}
              style={secondaryButton}
            >
              Archive
            </button>
          </div>

          {error ? (
            <p
              data-testid="simulation-error"
              style={{ margin: 0, color: "#F97066", fontSize: "0.72rem" }}
            >
              {error}
            </p>
          ) : null}

          <div
            data-testid="executive-simulation-session-list"
            style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}
          >
            {sessions
              .filter((s) => s.status !== "Archived")
              .map((session) => (
                <button
                  key={session.sessionId}
                  type="button"
                  data-testid={`simulation-session-${session.sessionId}`}
                  onClick={() => setActiveSessionId(session.sessionId)}
                  style={{
                    textAlign: "left",
                    padding: "0.5rem 0.6rem",
                    borderRadius: cockpit.radius.md,
                    border:
                      activeSession?.sessionId === session.sessionId
                        ? `1px solid ${cockpit.accent}`
                        : `1px solid ${cockpit.border}`,
                    background:
                      activeSession?.sessionId === session.sessionId
                        ? cockpit.accentSoft
                        : cockpit.panelSoft,
                    color: cockpit.text,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: "0.72rem",
                  }}
                >
                  {session.scenarioLabel} · {session.status}
                  <div style={{ color: cockpit.muted, fontSize: "0.64rem" }}>
                    {session.assumptionIds.join(", ")}
                  </div>
                </button>
              ))}
          </div>
          <ExecutiveSimulationInspector />
        </>
      ) : null}

      {section === "Results" ? (
        <ExecutiveSimulationResults session={activeSession} />
      ) : null}
      {section === "Comparison" ? (
        <ExecutiveSimulationComparison sessions={sessions} />
      ) : null}
      {section === "Archived" ? (
        <div data-testid="simulation-archived-list">
          {archived.length === 0 ? (
            <p style={{ margin: 0, color: cockpit.muted, fontSize: "0.72rem" }}>
              No archived simulations.
            </p>
          ) : (
            archived.map((session) => (
              <div
                key={session.sessionId}
                style={{
                  fontSize: "0.72rem",
                  color: cockpit.textSoft,
                  marginBottom: "0.35rem",
                }}
              >
                {session.scenarioLabel} · {session.sessionId}
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

const primaryButton = {
  padding: "0.4rem 0.65rem",
  borderRadius: cockpit.radius.sm,
  border: `1px solid ${cockpit.accent}`,
  background: cockpit.accentSoft,
  color: cockpit.accent,
  fontSize: "0.68rem",
  cursor: "pointer",
  fontFamily: "inherit",
} as const;

const secondaryButton = {
  ...primaryButton,
  border: `1px solid ${cockpit.border}`,
  background: "transparent",
  color: cockpit.muted,
};
