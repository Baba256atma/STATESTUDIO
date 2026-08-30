"use client";

import type { NexoraDecisionTheatreLiveExecution } from "@/app/lib/decision-theatre/nexoraDecisionTheatreLiveExecution.ts";
import { OBJECT_PANEL_WIDTH } from "@/app/lib/hud/hudPanelDesignContract.ts";
import { cockpit, typeScale } from "../../exs1/shell/executiveCockpitTheme";

type Props = {
  readonly liveExecution: NexoraDecisionTheatreLiveExecution;
  readonly onAsk: (question: string) => void;
  readonly onInspectDecision: () => void;
  readonly onShowHistory: () => void;
};

export function NexoraDecisionTheatreLiveExecutionSurface({
  liveExecution,
  onAsk,
  onInspectDecision,
  onShowHistory,
}: Props) {
  return (
    <aside
      data-testid="nexora-theatre-live-execution"
      data-theatre-live-execution-id={liveExecution.liveExecutionId}
      data-theatre-live-execution-state={liveExecution.state}
      data-theatre-live-execution-canonical={liveExecution.canonicalStatus}
      data-theatre-execution-id={liveExecution.executionId}
      data-theatre-execution-decision-id={liveExecution.decisionId}
      aria-label="Active execution"
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
        Active execution
      </div>
      <p style={{ fontSize: typeScale.body.size, margin: 0 }}>{liveExecution.advisorReadable.happeningNow}</p>
      <p style={{ fontSize: typeScale.caption.size, margin: 0 }}>Decision: {liveExecution.decisionTitle}</p>
      <p style={{ fontSize: typeScale.caption.size, margin: 0 }}>{liveExecution.advisorReadable.progress}</p>
      <p style={{ fontSize: typeScale.caption.size, color: cockpit.warning, margin: 0 }}>{liveExecution.advisorReadable.attention}</p>
      <p style={{ fontSize: typeScale.caption.size, color: cockpit.muted, margin: 0 }}>{liveExecution.advisorReadable.unknown}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
        <button type="button" data-testid="nexora-theatre-live-inspect-decision" onClick={onInspectDecision} style={chipStyle}>
          Show the Decision
        </button>
        {liveExecution.actions.find((item) => item.action === "SHOW_COMPARISON_HISTORY")?.available ? (
          <button type="button" data-testid="nexora-theatre-live-show-history" onClick={onShowHistory} style={chipStyle}>
            Show the alternatives
          </button>
        ) : null}
        {liveExecution.suggestedQuestions.map((question) => (
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
