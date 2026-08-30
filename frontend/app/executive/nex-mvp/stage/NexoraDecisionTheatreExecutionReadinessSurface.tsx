"use client";

import type { NexoraDecisionTheatreExecutionReadiness } from "@/app/lib/decision-theatre/nexoraDecisionTheatreExecutionReadiness.ts";
import { OBJECT_PANEL_WIDTH } from "@/app/lib/hud/hudPanelDesignContract.ts";
import { cockpit, typeScale } from "../../exs1/shell/executiveCockpitTheme";

type Props = {
  readonly readiness: NexoraDecisionTheatreExecutionReadiness;
  readonly onAsk: (question: string) => void;
  readonly onInspectDecision: () => void;
  readonly onRequestStart: () => void;
  readonly onShowHistory: () => void;
};

export function NexoraDecisionTheatreExecutionReadinessSurface({
  readiness,
  onAsk,
  onInspectDecision,
  onRequestStart,
  onShowHistory,
}: Props) {
  return (
    <aside
      data-testid="nexora-theatre-execution-readiness"
      data-theatre-execution-readiness-id={readiness.readinessId}
      data-theatre-execution-readiness={readiness.readiness}
      data-theatre-execution-decision-id={readiness.decisionId}
      data-theatre-execution-id={readiness.executionId ?? "none"}
      aria-label="Execution readiness"
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
        {readiness.readiness === "EXECUTION_STARTED" ? "Execution" : "Execution readiness"}
      </div>
      <p style={{ fontSize: typeScale.body.size, margin: 0 }}>{readiness.advisorReadable.scene}</p>
      <p style={{ fontSize: typeScale.caption.size, margin: 0 }}>{readiness.advisorReadable.hasStarted}</p>
      <p style={{ fontSize: typeScale.caption.size, color: cockpit.muted, margin: 0 }}>{readiness.advisorReadable.readiness}</p>
      <p style={{ fontSize: typeScale.caption.size, color: cockpit.warning, margin: 0 }}>{readiness.advisorReadable.missing}</p>
      <p style={{ fontSize: typeScale.caption.size, margin: 0 }}>{readiness.advisorReadable.whatHappensNext}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
        <button type="button" data-testid="nexora-theatre-execution-inspect-decision" onClick={onInspectDecision} style={chipStyle}>
          Show the Decision
        </button>
        {readiness.actions.find((item) => item.action === "SHOW_COMPARISON_HISTORY")?.available ? (
          <button type="button" data-testid="nexora-theatre-execution-show-history" onClick={onShowHistory} style={chipStyle}>
            Show the alternatives
          </button>
        ) : null}
        {readiness.actions.find((item) => item.action === "REQUEST_START_EXECUTION")?.available ? (
          <button type="button" data-testid="nexora-theatre-execution-start" onClick={onRequestStart} style={chipStyle}>
            Start execution
          </button>
        ) : null}
        {readiness.suggestedQuestions.map((question) => (
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
