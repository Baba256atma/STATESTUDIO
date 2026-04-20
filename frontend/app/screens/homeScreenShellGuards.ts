/**
 * HomeScreen-only guards and small string→panel-source mappers.
 * Keeps panel continuity / router ownership in HomeScreen + panelController; this file is pure helpers.
 */

import type { PanelOpenSource } from "../lib/ui/right-panel/panelControllerTypes";

export const EXECUTIVE_ACTION_TARGETS = ["simulate", "compare"] as const;
export type ExecutiveActionTarget = (typeof EXECUTIVE_ACTION_TARGETS)[number];

export type ExecutiveActionIntent =
  | "run_simulation"
  | "compare_options"
  | "open_war_room"
  | "why_this";

export function isExecutiveActionTarget(value: unknown): value is ExecutiveActionTarget {
  return (
    typeof value === "string" &&
    (EXECUTIVE_ACTION_TARGETS as readonly string[]).includes(value)
  );
}

export function isAutomaticRightPanelSource(source: string): boolean {
  return source.startsWith("effect:") || source.startsWith("adapter:");
}

export function toPanelOpenSource(source: string | null | undefined): PanelOpenSource {
  if (typeof source !== "string" || source.trim().length === 0) {
    return "unknown";
  }
  if (source === "direct_open") return "direct_open";
  if (source === "legacy_alias") return "legacy_alias";
  if (source === "action_intent") return "action_intent";
  if (
    source === "guided_prompt" ||
    source === "domain_prompt_guide" ||
    source === "assistant_prompt_chip"
  ) {
    return "guided_prompt";
  }
  if (source === "cta") return "cta";
  if (source.startsWith("effect:")) return "effect_auto";
  if (source.startsWith("adapter:")) return "adapter_auto";
  if (source.startsWith("left_nav")) return "left_nav";
  if (source.startsWith("inspector_section")) return "inspector_section";
  if (source.startsWith("legacy:") || source.includes("legacy_sync")) return "legacy_alias";
  return "unknown";
}

export function getPanelActionFallbackMessage(action: string): string {
  switch (action) {
    case "run_simulation":
      return "Simulation is not available for this context yet.";
    case "compare_options":
      return "Compare options is not available for this context yet.";
    case "open_war_room":
      return "War Room context is not available for this decision yet.";
    case "open_risk_flow":
      return "Risk Flow is not available for this context yet.";
    case "why_this":
      return "Advice details are not available yet.";
    default:
      return "This panel action is not available yet.";
  }
}
