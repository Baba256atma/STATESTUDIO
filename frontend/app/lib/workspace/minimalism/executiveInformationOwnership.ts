import type { InformationCategory, InformationOwner } from "./executiveMinimalismTypes";
import { logInformationOwnership } from "./executiveMinimalismInstrumentation";

/** Canonical owner for each information category — single source of truth. */
export const EXECUTIVE_INFORMATION_OWNERS: Record<InformationCategory, InformationOwner> = {
  current_view: "scene_info",
  selected_object: "object_info",
  decision_status: "command_bar",
  frsi_score: "command_bar",
  frsi_breakdown: "scene_info",
  scenario_status: "command_bar",
  readiness: "command_bar",
  timeline_events: "timeline_hud",
  object_metadata: "object_info",
  confidence: "status_hud",
  health: "status_hud",
  pipeline_insight: "status_hud",
};

export type InformationOwnershipContext = {
  surface: InformationOwner;
  commandBarVisible?: boolean;
  statusHudVisible?: boolean;
  compactMode?: boolean;
};

export function getInformationOwner(category: InformationCategory): InformationOwner {
  return EXECUTIVE_INFORMATION_OWNERS[category];
}

/** Whether a surface may render a category without duplicating the canonical owner. */
export function shouldSurfaceOwnInformation(
  category: InformationCategory,
  context: InformationOwnershipContext
): boolean {
  const owner = getInformationOwner(category);
  const isOwner = context.surface === owner;

  if (isOwner) {
    logInformationOwnership({ category, owner, surface: context.surface, allowed: true });
    return true;
  }

  // Status HUD owns supplemental insight when command bar is visible but insight is suppressed there.
  if (
    category === "pipeline_insight" &&
    context.surface === "status_hud" &&
    context.commandBarVisible &&
    context.statusHudVisible
  ) {
    logInformationOwnership({ category, owner: "status_hud", surface: context.surface, allowed: true, supplemental: true });
    return true;
  }

  // FRSI breakdown is Scene Info only; score stays on command bar.
  if (category === "frsi_breakdown" && context.surface === "scene_info") {
    logInformationOwnership({ category, owner: "scene_info", surface: context.surface, allowed: true });
    return true;
  }

  logInformationOwnership({ category, owner, surface: context.surface, allowed: false });
  return false;
}

export function shouldHideDuplicateInformation(
  category: InformationCategory,
  context: InformationOwnershipContext
): boolean {
  if (shouldSurfaceOwnInformation(category, context)) return false;
  const owner = getInformationOwner(category);

  if (category === "readiness" && context.commandBarVisible && context.surface === "status_hud") {
    return true;
  }
  if (category === "frsi_score" && context.commandBarVisible && context.surface === "status_hud") {
    return true;
  }
  if (category === "scenario_status" && context.commandBarVisible && context.surface === "status_hud") {
    return true;
  }
  if (category === "decision_status" && context.commandBarVisible && context.surface !== "command_bar") {
    return context.surface === "status_hud";
  }
  if (category === "pipeline_insight" && context.commandBarVisible && context.surface === "command_bar") {
    return true;
  }

  return owner !== context.surface;
}
