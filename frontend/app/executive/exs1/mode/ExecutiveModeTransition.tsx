"use client";

import type { CSSProperties, ReactNode } from "react";
import { EXECUTIVE_MODE_TRANSITION_MS } from "./ExecutiveModeConfig";
import { useExecutiveMode } from "./hooks/useExecutiveMode";

type Props = {
  readonly children: ReactNode;
  readonly style?: CSSProperties;
  readonly testId?: string;
};

/**
 * ExecutiveModeTransition — fade + scale wrapper (~250ms).
 */
export function ExecutiveModeTransition({
  children,
  style,
  testId = "executive-mode-transition",
}: Props) {
  const { transitionState, activeMode, config } = useExecutiveMode();
  const dimmed =
    transitionState === "exiting" || transitionState === "entering";

  return (
    <div
      data-testid={testId}
      data-mode={activeMode}
      data-transition={transitionState}
      style={{
        width: "100%",
        height: "100%",
        opacity: dimmed ? 0.72 : 1,
        transform: dimmed ? "scale(0.985)" : "scale(1)",
        transition: `opacity ${EXECUTIVE_MODE_TRANSITION_MS}ms ease, transform ${EXECUTIVE_MODE_TRANSITION_MS}ms ease, filter ${EXECUTIVE_MODE_TRANSITION_MS}ms ease`,
        filter:
          config.emphasis === "war-room"
            ? "saturate(0.85) brightness(0.92)"
            : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
