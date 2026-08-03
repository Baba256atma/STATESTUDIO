"use client";

import { useExecutiveDecision } from "./hooks/useExecutiveDecision";

/**
 * ExecutiveDecisionOverlay — halo, approval glow, focus, locked selection.
 */
export function ExecutiveDecisionOverlay() {
  const { isActive, currentDecision } = useExecutiveDecision();
  if (!isActive || !currentDecision) return null;

  const approved = currentDecision.status === "Approved";
  const accent = approved ? "#12B76A" : "#1570EF";

  return (
    <div
      data-testid="executive-decision-overlay"
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        background: `radial-gradient(50% 48% at 50% 55%, ${accent}22 0%, transparent 70%)`,
        transition: "background 250ms ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "0.85rem",
          borderRadius: "0.85rem",
          border: `1px solid ${accent}55`,
          boxShadow: approved
            ? `inset 0 0 50px ${accent}18, 0 0 30px ${accent}22`
            : `inset 0 0 30px ${accent}10`,
          transition: "border-color 250ms ease, box-shadow 250ms ease",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "1.15rem",
          bottom: "1rem",
          padding: "0.3rem 0.55rem",
          borderRadius: "0.35rem",
          border: `1px solid ${accent}66`,
          background: "rgba(8, 12, 18, 0.55)",
          color: accent,
          fontSize: "0.6rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {approved
          ? "Approved · Executive Focus · Locked"
          : "Decision Workspace · Candidate focus"}
      </div>
    </div>
  );
}
