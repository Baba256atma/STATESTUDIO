"use client";

import type { NexoraDecisionTheatreOutcomeObservation } from "@/app/lib/decision-theatre/nexoraDecisionTheatreOutcomeObservation.ts";
import { OBJECT_PANEL_WIDTH } from "@/app/lib/hud/hudPanelDesignContract.ts";
import { cockpit, typeScale } from "../../exs1/shell/executiveCockpitTheme";

type Props = {
  readonly observation: NexoraDecisionTheatreOutcomeObservation;
  readonly onAsk: (question: string) => void;
  readonly onInspectDecision: () => void;
  readonly onShowHistory: () => void;
};

export function NexoraDecisionTheatreOutcomeObservationSurface({
  observation,
  onAsk,
  onInspectDecision,
  onShowHistory,
}: Props) {
  return (
    <aside
      data-testid="nexora-theatre-outcome-observation"
      data-theatre-outcome-observation-id={observation.outcomeObservationId}
      data-theatre-outcome-observation-state={observation.state}
      data-theatre-outcome-id={observation.outcomeId ?? "none"}
      data-theatre-outcome-execution-id={observation.executionId}
      aria-label="Outcome observation"
      style={{
        position: "absolute",
        top: "4.5rem",
        right: "0.75rem",
        width: OBJECT_PANEL_WIDTH,
        maxWidth: "42%",
        maxHeight: "62%",
        zIndex: 5,
        display: "flex",
        flexDirection: "column",
        gap: "0.4rem",
        padding: "0.7rem 0.8rem",
        borderRadius: "0.5rem",
        border: `1px solid ${cockpit.borderStrong}`,
        background: cockpit.panel,
        color: cockpit.text,
        boxShadow: "0 10px 28px rgba(0, 0, 0, 0.32)",
        pointerEvents: "auto",
        overflow: "auto",
      }}
    >
      <div style={{ fontSize: typeScale.status.size, color: cockpit.muted, textTransform: "uppercase", letterSpacing: typeScale.status.tracking }}>
        {observation.state === "OUTCOME_PENDING"
          ? "Outcome pending"
          : observation.state === "OUTCOME_PARTIAL"
            ? "Early observation"
            : "Outcome observed"}
      </div>
      <p style={{ fontSize: typeScale.body.size, margin: 0 }}>{observation.advisorReadable.result}</p>
      <p style={{ fontSize: typeScale.caption.size, margin: 0 }}>Execution: {observation.decisionTitle}</p>
      {observation.observedLabel ? (
        <p style={{ fontSize: typeScale.caption.size, margin: 0 }}>Observed: {observation.observedLabel}</p>
      ) : null}
      {observation.baselineLabel ? (
        <p style={{ fontSize: typeScale.caption.size, margin: 0 }}>Baseline: {observation.baselineLabel}</p>
      ) : null}
      {observation.targetLabel ? (
        <p style={{ fontSize: typeScale.caption.size, margin: 0 }}>Goal: {observation.targetLabel}</p>
      ) : null}
      <p style={{ fontSize: typeScale.caption.size, margin: 0 }}>{observation.advisorReadable.delta}</p>
      <p style={{ fontSize: typeScale.caption.size, color: cockpit.muted, margin: 0 }}>{observation.advisorReadable.causality}</p>
      <p style={{ fontSize: typeScale.caption.size, color: cockpit.warning, margin: 0 }}>{observation.advisorReadable.unknown}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
        <button type="button" data-testid="nexora-theatre-outcome-inspect-decision" onClick={onInspectDecision} style={chipStyle}>
          Show the Decision
        </button>
        {observation.actions.find((item) => item.action === "SHOW_COMPARISON_HISTORY")?.available ? (
          <button type="button" data-testid="nexora-theatre-outcome-show-history" onClick={onShowHistory} style={chipStyle}>
            Show the alternatives
          </button>
        ) : null}
        {observation.suggestedQuestions.map((question) => (
          <button key={question} type="button" onClick={() => onAsk(question)} style={chipStyle}>
            {question}
          </button>
        ))}
      </div>
    </aside>
  );
}

const chipStyle = {
  border: `1px solid ${cockpit.border}`,
  background: cockpit.accentSoft,
  color: cockpit.text,
  borderRadius: "999px",
  padding: "0.2rem 0.55rem",
  fontSize: "0.62rem",
  cursor: "pointer",
} as const;
