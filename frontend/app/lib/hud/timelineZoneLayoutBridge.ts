/**
 * MRP_HUD:10:3 — Timeline zone layout bridge (HUD contract → runtime traces).
 */

import type { SceneHudZoneContract } from "../scene/sceneHudZoneContract.ts";
import type { SceneHudZoneContractContext } from "../scene/sceneHudZoneContract.ts";
import { resolveSceneHudEdgeInset } from "../scene/sceneHudInsetContract.ts";
import { SCENE_HUD_ZONE_METRICS } from "../scene/sceneHudZoneContract.ts";
import {
  resolveTimelineBottomAnchoredTop,
  TIMELINE_BOTTOM_INSET_PX,
} from "./timelineBottomAnchorContract.ts";
import { resolveTimelineDisplayHeight, toTimelineDisplayState } from "./timelineWidthContract.ts";
import { resolveTimelineZoneContract, type TimelineZoneInput } from "./timelineZoneContract.ts";
import {
  auditTimelineOwnership,
  runTimelineZoneEnforcement,
} from "./timelineZoneRuntime.ts";

function resolveTimelineHeight(mode: "collapsed" | "compact" | "expanded" | "full"): number {
  return resolveTimelineDisplayHeight(toTimelineDisplayState(mode));
}

function buildTimelineZoneInput(
  contract: SceneHudZoneContract,
  context: Pick<
    SceneHudZoneContractContext,
    | "mainRightPanelWidth"
    | "mainRightPanelVisible"
    | "timelineHeightMode"
    | "timelineVisible"
    | "sceneWidth"
  >
): TimelineZoneInput {
  const layoutWidth = contract.sceneWidth;
  const isMobile = layoutWidth < 768;
  const sideInset = resolveSceneHudEdgeInset();
  const timelineHeightMode = context.timelineHeightMode ?? "compact";
  const timelineHeight = resolveTimelineHeight(timelineHeightMode);
  const timelineTop = resolveTimelineBottomAnchoredTop({
    layoutHeight: contract.sceneHeight,
    timelineHeight,
    bottomInset: TIMELINE_BOTTOM_INSET_PX,
  });
  const mrpWidth = Math.max(0, context.mainRightPanelWidth ?? 0);
  const mrpVisible = context.mainRightPanelVisible !== false && mrpWidth > 0;
  const usingViewportFallback =
    !context.sceneWidth || context.sceneWidth <= 0 || context.sceneWidth >= contract.viewportWidth - 1;

  return {
    viewportWidth: contract.viewportWidth,
    layoutWidth,
    layoutHeight: contract.sceneHeight,
    sideInset,
    timelineTop,
    timelineHeight,
    timelineBottomOffset: TIMELINE_BOTTOM_INSET_PX,
    scenePanelLeft: contract.scenePanelZone.left,
    scenePanelWidth: contract.scenePanelZone.width,
    objectPanelLeft: contract.objectPanelZone.left,
    objectPanelWidth: contract.objectPanelZone.width,
    objectPanelBandWidth: SCENE_HUD_ZONE_METRICS.objectPanelCompactWidth,
    mrpWidth,
    mrpVisible,
    usingViewportFallback,
    isMobile,
  };
}

export function traceTimelineZoneFromHudContract(
  contract: SceneHudZoneContract,
  context: Pick<
    SceneHudZoneContractContext,
    | "mainRightPanelWidth"
    | "mainRightPanelVisible"
    | "timelineHeightMode"
    | "timelineVisible"
    | "sceneWidth"
  >
): void {
  runTimelineZoneEnforcement(buildTimelineZoneInput(contract, context));
  if (process.env.NODE_ENV === "production") return;
  auditTimelineOwnership();
}

export function resolveTimelineZoneForTests(
  contract: SceneHudZoneContract,
  context: Pick<
    SceneHudZoneContractContext,
    | "mainRightPanelWidth"
    | "mainRightPanelVisible"
    | "timelineHeightMode"
    | "timelineVisible"
    | "sceneWidth"
  >
) {
  return resolveTimelineZoneContract(buildTimelineZoneInput(contract, context));
}

export function readTimelineBoundsFromHudContract(
  contract: SceneHudZoneContract
): Pick<TimelineZoneInput, "scenePanelLeft" | "scenePanelWidth" | "objectPanelLeft" | "objectPanelWidth"> {
  return {
    scenePanelLeft: contract.scenePanelZone.left,
    scenePanelWidth: contract.scenePanelZone.width,
    objectPanelLeft: contract.objectPanelZone.left,
    objectPanelWidth: contract.objectPanelZone.width,
  };
}
