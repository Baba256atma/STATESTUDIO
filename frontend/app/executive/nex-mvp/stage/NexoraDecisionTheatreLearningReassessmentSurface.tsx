"use client";

import type { NexoraDecisionTheatreLearningReassessment } from "@/app/lib/decision-theatre/nexoraDecisionTheatreLearningReassessment.ts";
import { OBJECT_PANEL_WIDTH } from "@/app/lib/hud/hudPanelDesignContract.ts";
import { cockpit, typeScale } from "../../exs1/shell/executiveCockpitTheme";

type Props = {
  readonly learning: NexoraDecisionTheatreLearningReassessment;
  readonly onAsk: (question: string) => void;
  readonly onInspectDecision: () => void;
  readonly onShowHistory: () => void;
};

export function NexoraDecisionTheatreLearningReassessmentSurface({
  learning,
  onAsk,
  onInspectDecision,
  onShowHistory,
}: Props) {
  return (
    <aside
      data-testid="nexora-theatre-learning-reassessment"
      data-theatre-learning-id={learning.learningReassessmentId}
      data-theatre-learning-state={learning.state}
      data-theatre-reassessment-state={learning.reassessmentState}
      data-theatre-learning-durable="false"
      aria-label="Learning and reassessment"
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
        {learning.state === "LEARNING_CANDIDATE"
          ? "Learning pending"
          : learning.reassessmentState === "REASSESSMENT_AVAILABLE"
            ? "Learning and reassessment"
            : "Learning"}
      </div>
      <p style={{ fontSize: typeScale.caption.size, margin: 0 }}>
        Observed: {learning.baselineLabel ?? "unknown"} → {learning.observedLabel ?? "unknown"}
      </p>
      {learning.targetLabel ? (
        <p style={{ fontSize: typeScale.caption.size, margin: 0 }}>Goal: {learning.targetLabel}</p>
      ) : null}
      <p style={{ fontSize: typeScale.body.size, margin: 0 }}>{learning.advisorReadable.changed}</p>
      <p style={{ fontSize: typeScale.caption.size, color: cockpit.muted, margin: 0 }}>{learning.advisorReadable.uncertain}</p>
      <p style={{ fontSize: typeScale.caption.size, margin: 0 }}>{learning.advisorReadable.reconsider}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
        <button type="button" data-testid="nexora-theatre-learning-inspect-decision" onClick={onInspectDecision} style={chipStyle}>
          Show the Decision
        </button>
        {learning.actions.find((item) => item.action === "SHOW_COMPARISON_HISTORY")?.available ? (
          <button type="button" data-testid="nexora-theatre-learning-show-history" onClick={onShowHistory} style={chipStyle}>
            Show the alternatives
          </button>
        ) : null}
        {learning.suggestedQuestions.map((question) => (
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
