import type React from "react";

import type { SceneThemeTokens } from "../../theme/sceneThemeTypes";
import { logExecutiveInteractionStandard } from "./executiveHarmonizationInstrumentation";

export type ExecutiveInteractionState =
  | "default"
  | "hover"
  | "focus"
  | "pressed"
  | "disabled"
  | "loading"
  | "active"
  | "selected";

export type ExecutiveInteractionSnapshot = {
  state: ExecutiveInteractionState;
  cursor: React.CSSProperties["cursor"];
  opacity: number;
  transform?: string;
  transition: string;
  outline?: string;
  boxShadow?: string;
};

const BASE_TRANSITION = "border-color 140ms ease, background 140ms ease, color 140ms ease, opacity 140ms ease, transform 120ms ease";

const STATE_MULTIPLIERS: Record<ExecutiveInteractionState, Partial<ExecutiveInteractionSnapshot>> = {
  default: { opacity: 1, cursor: "pointer" },
  hover: { opacity: 1, cursor: "pointer", transform: "translateY(-1px)" },
  focus: { opacity: 1, cursor: "pointer", outline: "2px solid color-mix(in srgb, var(--nx-accent) 45%, transparent)" },
  pressed: { opacity: 0.92, cursor: "pointer", transform: "translateY(0)" },
  disabled: { opacity: 0.55, cursor: "not-allowed" },
  loading: { opacity: 0.75, cursor: "wait" },
  active: { opacity: 1, cursor: "pointer" },
  selected: { opacity: 1, cursor: "pointer" },
};

/** E2:49 Part 3 — unified executive button/control interaction states. */
export function resolveExecutiveInteractionState(
  state: ExecutiveInteractionState
): ExecutiveInteractionSnapshot {
  const snapshot: ExecutiveInteractionSnapshot = {
    state,
    cursor: STATE_MULTIPLIERS[state]?.cursor ?? "pointer",
    opacity: STATE_MULTIPLIERS[state]?.opacity ?? 1,
    transition: BASE_TRANSITION,
    transform: STATE_MULTIPLIERS[state]?.transform,
    outline: STATE_MULTIPLIERS[state]?.outline,
  };
  logExecutiveInteractionStandard("state", snapshot);
  return snapshot;
}

export function resolveExecutiveControlButtonStyle(
  tokens: SceneThemeTokens,
  state: ExecutiveInteractionState = "default",
  selected = false
): React.CSSProperties {
  const resolvedState = selected ? "selected" : state;
  const interaction = resolveExecutiveInteractionState(resolvedState);
  const active = selected || state === "active";

  return {
    padding: "4px 8px",
    minHeight: 28,
    borderRadius: 8,
    border: `1px solid ${active ? tokens.chipBorder : tokens.controlBorder}`,
    background: active ? tokens.chipBackground : tokens.controlBackground,
    color: active ? tokens.textPrimary : tokens.textSecondary,
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    lineHeight: 1.2,
    cursor: interaction.cursor,
    opacity: interaction.opacity,
    transition: interaction.transition,
    transform: interaction.transform,
    outline: interaction.outline,
    outlineOffset: 2,
  };
}

export function resolveExecutiveChipButtonStyle(
  tokens: SceneThemeTokens,
  state: ExecutiveInteractionState = "default",
  active = false
): React.CSSProperties {
  const interaction = resolveExecutiveInteractionState(active ? "selected" : state);
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "3px 8px",
    borderRadius: 999,
    border: `1px solid ${active ? tokens.chipBorder : tokens.controlBorder}`,
    background: active ? tokens.chipBackground : "transparent",
    color: active ? tokens.textPrimary : tokens.textSecondary,
    fontSize: 10,
    fontWeight: 700,
    lineHeight: 1.2,
    cursor: interaction.cursor,
    opacity: interaction.opacity,
    transition: interaction.transition,
  };
}
