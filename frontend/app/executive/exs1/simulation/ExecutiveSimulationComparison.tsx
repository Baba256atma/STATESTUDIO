"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import type { ExecutiveSimulationSession } from "./ExecutiveSimulationSession";
import { STATIC_CONFIDENCE } from "./ExecutiveSimulationConfig";

type Props = {
  readonly sessions: readonly ExecutiveSimulationSession[];
  readonly baselineLabel?: string;
};

/**
 * Compare Baseline vs Scenario sessions — Impact, Risk, KPI, Confidence, Notes.
 */
export function ExecutiveSimulationComparison({
  sessions,
  baselineLabel = "Baseline",
}: Props) {
  const completed = sessions.filter(
    (s) => s.status === "Completed" && s.results,
  );

  return (
    <section
      data-testid="executive-simulation-comparison"
      style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}
    >
      <strong style={{ fontSize: "0.72rem", color: cockpit.accent }}>
        Scenario Comparison · {baselineLabel}
        {completed.length ? ` · ${completed.map((s) => s.scenarioLabel).join(" / ")}` : ""}
      </strong>

      {completed.length === 0 ? (
        <p style={{ margin: 0, fontSize: "0.72rem", color: cockpit.muted }}>
          Run a simulation to compare against Baseline.
        </p>
      ) : (
        completed.map((session) => {
          const results = session.results!;
          return (
            <article
              key={session.sessionId}
              data-testid={`simulation-compare-${session.sessionId}`}
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
              <div style={{ color: cockpit.accent, fontWeight: 550 }}>
                {session.scenarioLabel}
              </div>
              <div>Impact · {results.impact.summary}</div>
              <div>
                Risk · {results.risk.level} · Confidence ·{" "}
                {results.confidence ?? STATIC_CONFIDENCE}% (static)
              </div>
              <div>
                KPI ·{" "}
                {results.future.kpis
                  .map(
                    (k) =>
                      `${k.name} ${k.current}${k.unit} → ${k.projected}${k.unit} (${k.difference >= 0 ? "+" : ""}${k.difference})`,
                  )
                  .join(" · ")}
              </div>
              <div>Notes · {results.executiveNotes}</div>
            </article>
          );
        })
      )}
    </section>
  );
}
