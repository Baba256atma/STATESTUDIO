"use client";

import type { NexoraDecisionTheatreDecisionComparison } from "@/app/lib/decision-theatre/nexoraDecisionTheatreDecisionComparison.ts";
import type { NexoraDecisionTheatreComparisonLevel } from "@/app/lib/decision-theatre/nexoraDecisionTheatreDecisionComparison.ts";
import { OBJECT_PANEL_WIDTH } from "@/app/lib/hud/hudPanelDesignContract.ts";
import { cockpit, typeScale } from "../../exs1/shell/executiveCockpitTheme";

type Props = {
  readonly comparison: NexoraDecisionTheatreDecisionComparison;
  readonly onLevelChange: (level: NexoraDecisionTheatreComparisonLevel) => void;
  readonly onAsk: (question: string) => void;
  readonly onReviewDecision?: () => void;
};

export function NexoraDecisionTheatreComparisonSurface({
  comparison,
  onLevelChange,
  onAsk,
  onReviewDecision,
}: Props) {
  const showCompare = comparison.level === "compare" || comparison.level === "decide";
  const showDecide = comparison.level === "decide";
  return (
    <aside
      data-testid="nexora-theatre-comparison"
      data-theatre-comparison-id={comparison.comparisonId}
      data-theatre-comparison-candidate-count={String(comparison.candidateIds.length)}
      data-theatre-comparison-level={comparison.level}
      data-theatre-comparison-active-candidate={comparison.activeCandidateId ?? "none"}
      aria-label="Decision comparison"
      style={{
        position: "absolute",
        top: "4.5rem",
        right: "0.75rem",
        left: "auto",
        width: OBJECT_PANEL_WIDTH,
        maxWidth: "42%",
        maxHeight: "36%",
        zIndex: 3,
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
        overflow: "hidden",
      }}
    >
      <div style={{ fontSize: typeScale.status.size, color: cockpit.muted, textTransform: "uppercase", letterSpacing: typeScale.status.tracking }}>
        Comparison
      </div>
      <p style={{ fontSize: typeScale.body.size, margin: 0, color: cockpit.textSoft }}>{comparison.advisorReadable.choice}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
        {comparison.candidates.map((item) => (
          <div key={item.id} style={{ fontSize: typeScale.caption.size, color: cockpit.text }}>
            {item.label}
            {item.isDoNothing ? " (do nothing)" : ""}
            {comparison.activeCandidateId === item.id ? " — investigating" : ""}
          </div>
        ))}
      </div>
      {showCompare ? (
        <div style={{ overflow: "auto", minHeight: 0 }}>
          {comparison.criteria.filter((item) => item.available).map((item) => (
            <div key={item.key} style={{ fontSize: typeScale.caption.size, color: cockpit.textSoft }}>
              {item.label}
            </div>
          ))}
          <p style={{ fontSize: typeScale.caption.size, color: cockpit.muted, margin: "0.35rem 0 0" }}>
            {comparison.advisorReadable.tradeOffs}
          </p>
        </div>
      ) : null}
      {showDecide ? (
        <div>
          <p style={{ fontSize: typeScale.caption.size, color: cockpit.warning, margin: 0 }}>{comparison.uncertainty}</p>
          {comparison.recommendation ? (
            <p style={{ fontSize: typeScale.caption.size, margin: "0.35rem 0 0" }}>
              {comparison.advisorReadable.recommendation}
            </p>
          ) : (
            <p style={{ fontSize: typeScale.caption.size, margin: "0.35rem 0 0" }}>
              Nexora does not have enough comparable evidence to prefer one option. This is not a Decision.
            </p>
          )}
        </div>
      ) : null}
      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
        {comparison.level === "choice" ? (
          <button type="button" data-testid="nexora-theatre-comparison-deeper" onClick={() => onLevelChange("compare")} style={chipStyle}>
            Compare
          </button>
        ) : null}
        {comparison.level === "compare" ? (
          <button type="button" data-testid="nexora-theatre-comparison-decide" onClick={() => onLevelChange("decide")} style={chipStyle}>
            Decide
          </button>
        ) : null}
        {comparison.actions.find((item) => item.action === "PROCEED_TO_DECISION")?.available && onReviewDecision ? (
          <button type="button" data-testid="nexora-theatre-comparison-review-decision" onClick={onReviewDecision} style={chipStyle}>
            Review choice
          </button>
        ) : null}
        {comparison.suggestedQuestions.slice(0, 3).map((question) => (
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
