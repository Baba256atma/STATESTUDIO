"use client";

import type { NexoraDecisionTheatreDecisionCommitment } from "@/app/lib/decision-theatre/nexoraDecisionTheatreDecisionCommitment.ts";
import { OBJECT_PANEL_WIDTH } from "@/app/lib/hud/hudPanelDesignContract.ts";
import { cockpit, typeScale } from "../../exs1/shell/executiveCockpitTheme";

type Props = {
  readonly commitment: NexoraDecisionTheatreDecisionCommitment;
  readonly onCancel: () => void;
  readonly onChangeCandidate: (candidateId: string) => void;
  readonly onCommit: () => void;
  readonly onAsk: (question: string) => void;
  readonly onInvestigate: () => void;
};

export function NexoraDecisionTheatreCommitmentSurface({
  commitment,
  onCancel,
  onChangeCandidate,
  onCommit,
  onAsk,
  onInvestigate,
}: Props) {
  const reviewing = commitment.state !== "COMMITTED";
  return (
    <aside
      data-testid="nexora-theatre-decision-commitment"
      data-theatre-decision-commitment-id={commitment.commitmentId}
      data-theatre-decision-candidate-id={commitment.candidateId ?? "none"}
      data-theatre-decision-state={commitment.state}
      data-theatre-decision-authoritative-id={commitment.authoritativeDecisionId ?? "none"}
      aria-label="Decision review"
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
        {commitment.state === "COMMITTED" ? "Decision" : "Decision review"}
      </div>
      <p style={{ fontSize: typeScale.body.size, margin: 0 }}>{commitment.advisorReadable.reviewing}</p>
      <p style={{ fontSize: typeScale.caption.size, color: cockpit.textSoft, margin: 0 }}>{commitment.advisorReadable.why}</p>
      <p style={{ fontSize: typeScale.caption.size, color: cockpit.muted, margin: 0 }}>{commitment.advisorReadable.evidence}</p>
      <p style={{ fontSize: typeScale.caption.size, color: cockpit.muted, margin: 0 }}>{commitment.advisorReadable.tradeOffs}</p>
      <p style={{ fontSize: typeScale.caption.size, color: cockpit.warning, margin: 0 }}>{commitment.advisorReadable.uncertainty}</p>
      <p style={{ fontSize: typeScale.caption.size, margin: 0 }}>{commitment.advisorReadable.recommendationDistinct}</p>
      <p style={{ fontSize: typeScale.caption.size, margin: 0 }}>{commitment.advisorReadable.next}</p>
      {reviewing ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
          {commitment.candidateChoices.map((item) => (
            <button
              key={item.id}
              type="button"
              data-testid={`nexora-theatre-decision-candidate-${item.id}`}
              onClick={() => onChangeCandidate(item.id)}
              style={chipStyle}
            >
              {item.id === commitment.candidateId ? item.label : `Review ${item.label}`}
            </button>
          ))}
        </div>
      ) : null}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
        {reviewing ? (
          <button type="button" data-testid="nexora-theatre-decision-investigate" onClick={onInvestigate} style={chipStyle}>
            Investigate
          </button>
        ) : null}
        {commitment.actions.find((item) => item.action === "COMMIT_DECISION")?.available ? (
          <button type="button" data-testid="nexora-theatre-decision-commit" onClick={onCommit} style={chipStyle}>
            Approve this Decision
          </button>
        ) : null}
        {commitment.actions.find((item) => item.action === "CANCEL_DECISION_REVIEW")?.available ? (
          <button type="button" data-testid="nexora-theatre-decision-cancel" onClick={onCancel} style={chipStyle}>
            Go back
          </button>
        ) : null}
        {commitment.suggestedQuestions.slice(0, 3).map((question) => (
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
