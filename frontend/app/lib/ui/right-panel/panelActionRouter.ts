import type { CanonicalRightPanelView, RightPanelView } from "./rightPanelTypes";

export const RIGHT_PANEL_ACTION_INTENTS = [
  "run_simulation",
  "compare_options",
  "open_war_room",
  "open_risk_flow",
  "why_this",
] as const;

export type RightPanelActionIntent = (typeof RIGHT_PANEL_ACTION_INTENTS)[number];

export type RightPanelActionResolution = {
  action: RightPanelActionIntent;
  sourceView: RightPanelView;
  targetView: CanonicalRightPanelView;
  fallbackMessage: string;
};

export function isRightPanelActionIntent(value: unknown): value is RightPanelActionIntent {
  return typeof value === "string" && RIGHT_PANEL_ACTION_INTENTS.includes(value as RightPanelActionIntent);
}

export function resolveRightPanelAction(
  action: RightPanelActionIntent,
  sourceView: RightPanelView
): RightPanelActionResolution {
  switch (action) {
    case "run_simulation":
      return {
        action,
        sourceView,
        targetView: "simulate",
        fallbackMessage: "Simulation is not available for this context yet.",
      };
    case "compare_options":
      return {
        action,
        sourceView,
        targetView: "compare",
        fallbackMessage: "Compare options is not available for this context yet.",
      };
    case "open_war_room":
      return {
        action,
        sourceView,
        targetView: "war_room",
        fallbackMessage: "War Room context is not available for this decision yet.",
      };
    case "open_risk_flow":
      return {
        action,
        sourceView,
        targetView: "risk",
        fallbackMessage: "Risk Flow is not available for this context yet.",
      };
    case "why_this":
      return {
        action,
        sourceView,
        targetView: "advice",
        fallbackMessage: "Advice details are not available yet.",
      };
  }
}
