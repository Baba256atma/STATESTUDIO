"use client";

import { ExecutiveDecisionBadge } from "./ExecutiveDecisionBadge";
import { useExecutiveDecision } from "./hooks/useExecutiveDecision";
import { DECISION_TRANSITION_MS } from "./ExecutiveDecisionConfig";

/**
 * ExecutiveDecisionObject — primary Stage object for the current Decision.
 */
export function ExecutiveDecisionObject() {
  const { isActive, currentDecision } = useExecutiveDecision();
  if (!isActive || !currentDecision) return null;

  const approved = currentDecision.status === "Approved";
  const accent = approved ? "#12B76A" : "#1570EF";

  return (
    <div
      data-testid="executive-decision-object"
      data-status={currentDecision.status}
      data-locked={currentDecision.locked ? "true" : "false"}
      style={{
        position: "absolute",
        left: "50%",
        top: "58%",
        transform: "translate(-50%, -50%) scale(1)",
        width: "9.5rem",
        padding: "0.85rem 0.75rem 0.75rem",
        borderRadius: "0.65rem",
        border: `1.5px solid ${accent}`,
        background: `linear-gradient(165deg, ${accent}33, rgba(12,16,24,0.95))`,
        boxShadow: `0 0 0 1px ${accent}55, 0 0 40px ${accent}33, 0 16px 36px rgba(0,0,0,0.4)`,
        color: "#E8EEF6",
        textAlign: "center",
        zIndex: 5,
        pointerEvents: "none",
        transition: `transform ${DECISION_TRANSITION_MS}ms ease, box-shadow ${DECISION_TRANSITION_MS}ms ease, border-color ${DECISION_TRANSITION_MS}ms ease`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.3rem",
          marginBottom: "0.4rem",
        }}
      >
        <ExecutiveDecisionBadge status={currentDecision.status} compact />
        {currentDecision.locked ? (
          <ExecutiveDecisionBadge locked compact />
        ) : null}
      </div>
      <div
        style={{
          fontSize: "0.58rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#98A2B3",
        }}
      >
        Decision
      </div>
      <div
        data-testid="executive-decision-object-name"
        style={{
          marginTop: "0.25rem",
          fontSize: "0.95rem",
          fontWeight: 600,
          color: accent,
        }}
      >
        {currentDecision.name}
      </div>
      <div
        style={{
          marginTop: "0.35rem",
          fontSize: "0.68rem",
          color: "#C5D0DE",
        }}
      >
        {currentDecision.status}
        {currentDecision.locked ? " · LOCKED" : ""}
      </div>
    </div>
  );
}
