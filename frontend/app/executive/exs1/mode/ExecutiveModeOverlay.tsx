"use client";

import { EXECUTIVE_MODE_TRANSITION_MS } from "./ExecutiveModeConfig";
import { useExecutiveMode } from "./hooks/useExecutiveMode";

/**
 * Stage Overlay — mock presentation reaction to Executive Mode.
 * No runtime calculations.
 */
export function ExecutiveModeOverlay() {
  const { activeMode, config, transitionState } = useExecutiveMode();
  const dimmed =
    transitionState === "exiting" || transitionState === "entering";

  return (
    <div
      data-testid="executive-mode-overlay"
      data-mode={activeMode}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 5,
        opacity: dimmed ? 0.35 : 1,
        transition: `opacity ${EXECUTIVE_MODE_TRANSITION_MS}ms ease, background 250ms ease`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(70% 60% at 50% 40%, ${config.overlayTint} 0%, transparent 70%)`,
          transition: "background 250ms ease",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "1.15rem",
          bottom: "1rem",
          padding: "0.35rem 0.6rem",
          borderRadius: "0.35rem",
          border: `1px solid ${config.accent}66`,
          background: "rgba(8, 12, 18, 0.55)",
          color: config.accent,
          fontSize: "0.62rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {config.overlayLabel}
      </div>
    </div>
  );
}
