"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import { useRuntimeIntelligence } from "./hooks/useRuntimeIntelligence";

export function ExecutiveSignalHistory() {
  const { journalEntries, signals } = useRuntimeIntelligence();
  const history = signals.filter(
    (s) => s.lifecycle === "Resolved" || s.lifecycle === "Archived",
  );

  return (
    <div
      data-testid="executive-signal-history"
      style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
    >
      {journalEntries.map((entry) => (
        <div
          key={entry.id}
          data-testid={`intelligence-journal-${entry.signalId}`}
          style={{
            padding: "0.55rem 0.6rem",
            borderRadius: cockpit.radius.sm,
            border: `1px solid ${cockpit.border}`,
            background: cockpit.panelSoft,
            fontSize: "0.72rem",
            color: cockpit.textSoft,
          }}
        >
          <div style={{ color: cockpit.accent, fontWeight: 550 }}>
            {entry.summary}
          </div>
          <div style={{ marginTop: "0.2rem" }}>Reason · {entry.reason}</div>
          <div>Objects · {entry.objects}</div>
          <div>Recommendation · {entry.recommendation}</div>
        </div>
      ))}
      {history.map((signal) => (
        <div
          key={signal.signalId}
          style={{
            padding: "0.45rem 0.55rem",
            borderRadius: cockpit.radius.sm,
            border: `1px solid ${cockpit.border}`,
            color: cockpit.muted,
            fontSize: "0.7rem",
          }}
        >
          {signal.lifecycle} · {signal.summary}
        </div>
      ))}
      {journalEntries.length === 0 && history.length === 0 ? (
        <p style={{ margin: 0, color: cockpit.muted, fontSize: "0.74rem" }}>
          Intelligence history appears after signals are generated.
        </p>
      ) : null}
    </div>
  );
}
