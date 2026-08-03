"use client";

import { useExecutiveExecution } from "./hooks/useExecutiveExecution";

/**
 * ExecutionOverlay — progress rings atmosphere, blocked indicators, completion glow.
 */
export function ExecutionOverlay() {
  const { isActive, plan, blockedTasks, overallProgress } =
    useExecutiveExecution();
  if (!isActive) return null;

  const completed = plan.status === "Completed";
  const accent = completed
    ? "#12B76A"
    : blockedTasks.length > 0
      ? "#F04438"
      : "#12B76A";

  return (
    <div
      data-testid="execution-overlay"
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        background: `radial-gradient(52% 48% at 50% 55%, ${accent}1f 0%, transparent 72%)`,
        transition: "background 250ms ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "0.85rem",
          borderRadius: "0.85rem",
          border: `1px solid ${accent}55`,
          boxShadow: completed
            ? `inset 0 0 50px ${accent}20, 0 0 30px ${accent}22`
            : `inset 0 0 28px ${accent}12`,
          transition: "border-color 250ms ease, box-shadow 250ms ease",
        }}
      />
      <div
        data-testid="execution-overlay-progress"
        style={{
          position: "absolute",
          top: "1rem",
          right: "1.1rem",
          padding: "0.35rem 0.55rem",
          borderRadius: "999px",
          border: `1px solid ${accent}66`,
          background: "rgba(10,14,20,0.75)",
          color: accent,
          fontSize: "0.62rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        Progress · {overallProgress}%
        {blockedTasks.length > 0 ? ` · ${blockedTasks.length} blocked` : ""}
      </div>
    </div>
  );
}
