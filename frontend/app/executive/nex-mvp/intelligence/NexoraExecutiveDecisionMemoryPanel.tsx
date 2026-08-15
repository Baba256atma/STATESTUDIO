"use client";

import type { ExecutiveDecisionMemoryView } from "@/app/lib/spatial-presentation/executiveStageDecisionMemory";
import { cockpit } from "../../exs1/shell/executiveCockpitTheme";

type Props = {
  readonly decisionMemory: ExecutiveDecisionMemoryView | null | undefined;
};

/**
 * STAGE-PROD:5 — Decision Memory + Outcome Trace in Advisor.
 * Historical vs current states are shown separately.
 * Not a Stage Object.
 */
export function NexoraExecutiveDecisionMemoryPanel({
  decisionMemory,
}: Props) {
  if (
    decisionMemory == null ||
    decisionMemory.eligible !== true ||
    decisionMemory.available !== true ||
    decisionMemory.memory == null
  ) {
    return null;
  }

  const memory = decisionMemory.memory;
  const sectionLabel = {
    fontSize: "0.55rem",
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    color: cockpit.muted,
    fontWeight: 600,
    marginBottom: "0.2rem",
  };
  const body = {
    fontSize: "0.66rem",
    color: cockpit.textSoft,
    lineHeight: 1.4,
    margin: 0,
  };

  return (
    <section
      data-testid="nexora-executive-decision-memory"
      data-stage-prod="5"
      data-memory-id={memory.memoryId}
      data-memory-decision={memory.decisionObjectId}
      data-memory-is-semantic-object="false"
      data-historical-vs-current={
        decisionMemory.historicalVsCurrentDifferent ? "different" : "same"
      }
      data-outcome-status={decisionMemory.outcomeTrace?.status ?? "none"}
      aria-label="Decision Memory"
      style={{
        margin: "0.35rem 0.75rem 0.15rem",
        padding: "0.55rem 0.65rem 0.6rem",
        borderTop: `1px solid ${cockpit.border}`,
        borderBottom: `1px solid ${cockpit.border}`,
        background: "rgba(12, 18, 28, 0.42)",
      }}
    >
      <div
        style={{
          fontSize: "0.55rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: cockpit.muted,
          fontWeight: 600,
          marginBottom: "0.4rem",
        }}
      >
        Decision Memory
      </div>

      <div data-testid="nexora-executive-memory-decision" style={{ marginBottom: "0.4rem" }}>
        <div style={sectionLabel}>Decision</div>
        <p style={body}>
          {memory.decisionStatus} · {memory.recordedAt.slice(0, 10)}
        </p>
      </div>

      <div data-testid="nexora-executive-memory-historical" style={{ marginBottom: "0.4rem" }}>
        <div style={sectionLabel}>At decision</div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {decisionMemory.historicalStates.map((state) => (
            <li key={`h-${state.objectId}`} style={{ ...body, padding: "0.1rem 0" }}>
              · {state.label ?? state.objectId}: {state.executiveState ?? "—"}
            </li>
          ))}
        </ul>
      </div>

      <div data-testid="nexora-executive-memory-current" style={{ marginBottom: "0.4rem" }}>
        <div style={sectionLabel}>Current</div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {decisionMemory.currentStates.map((state) => (
            <li key={`c-${state.objectId}`} style={{ ...body, padding: "0.1rem 0" }}>
              · {state.label ?? state.objectId}:{" "}
              {state.available ? (state.executiveState ?? "—") : "unavailable"}
            </li>
          ))}
        </ul>
      </div>

      <div data-testid="nexora-executive-memory-evidence" style={{ marginBottom: "0.4rem" }}>
        <div style={sectionLabel}>Evidence at decision</div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {memory.contextSnapshot.evidence.slice(0, 5).map((item) => (
            <li key={item.id} style={{ ...body, padding: "0.1rem 0" }}>
              · {item.text}
            </li>
          ))}
        </ul>
      </div>

      <div data-testid="nexora-executive-memory-options" style={{ marginBottom: "0.4rem" }}>
        <div style={sectionLabel}>Options considered</div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {memory.consideredOptions.map((option) => (
            <li key={option.objectId ?? option.label} style={{ ...body, padding: "0.1rem 0" }}>
              · {option.label}
              {option.wasSelected ? " (selected)" : ""}
            </li>
          ))}
        </ul>
      </div>

      <div data-testid="nexora-executive-memory-rationale" style={{ marginBottom: "0.4rem" }}>
        <div style={sectionLabel}>Rationale</div>
        <p style={body}>
          {memory.rationale?.text ?? "Rationale not recorded"}
        </p>
      </div>

      {memory.expectedOutcomes.length > 0 ? (
        <div data-testid="nexora-executive-memory-expected" style={{ marginBottom: "0.4rem" }}>
          <div style={sectionLabel}>Expected</div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {memory.expectedOutcomes.map((outcome) => (
              <li key={outcome.id} style={{ ...body, padding: "0.1rem 0" }}>
                · {outcome.metricKey ?? outcome.targetObjectId ?? outcome.id}
                {outcome.targetValue != null
                  ? ` ${outcome.comparator ?? ""} ${outcome.targetValue}`
                  : outcome.targetState != null
                    ? ` → ${outcome.targetState}`
                    : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {decisionMemory.executionSummaries.length > 0 ? (
        <div data-testid="nexora-executive-memory-execution" style={{ marginBottom: "0.4rem" }}>
          <div style={sectionLabel}>Execution</div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {decisionMemory.executionSummaries.map((execution) => (
              <li
                key={execution.executionObjectId}
                style={{ ...body, padding: "0.1rem 0" }}
              >
                · {execution.executionObjectId}: {execution.status ?? "linked"}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div data-testid="nexora-executive-memory-outcome">
        <div style={sectionLabel}>Outcome</div>
        {decisionMemory.outcomeTrace == null ? (
          <p style={body}>Not yet evaluable</p>
        ) : (
          <>
            <p style={{ ...body, fontWeight: 600, textTransform: "capitalize" }}>
              {decisionMemory.outcomeTrace.status.replace(/-/g, " ")}
            </p>
            <ul style={{ listStyle: "none", margin: "0.2rem 0 0", padding: 0 }}>
              {decisionMemory.outcomeTrace.comparisons.map((comparison) => (
                <li
                  key={comparison.expectedOutcomeId}
                  style={{ ...body, padding: "0.1rem 0" }}
                >
                  · Expected {String(comparison.expected)} · Actual{" "}
                  {comparison.actual == null ? "—" : String(comparison.actual)} ·{" "}
                  {comparison.status}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
