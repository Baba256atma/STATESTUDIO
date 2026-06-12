/**
 * MRP_HUD:10:2 — trace helper from resolved HUD contract (diagnostics only).
 */

import type { SceneHudZoneContractContext } from "../scene/sceneHudZoneContract.ts";
import type { SceneHudZoneContract } from "../scene/sceneHudZoneContract.ts";
import {
  OBJECT_PANEL_TOP,
  resolveSceneHudEdgeInset,
} from "../scene/sceneHudInsetContract.ts";
import { SCENE_HUD_ZONE_METRICS } from "../scene/sceneHudZoneContract.ts";
import { resolveObjectPanelSafeZoneContract } from "./objectPanelSafeZoneContract.ts";
import {
  auditObjectPanelOwnership,
  runObjectPanelSafeZoneEnforcement,
  type ObjectPanelSafeZoneRuntimeInput,
} from "./objectPanelSafeZoneRuntime.ts";

const FIXED_SCENE_PANEL_SLOT_WIDTH = SCENE_HUD_ZONE_METRICS.scenePanelWidth;
const FIXED_OBJECT_PANEL_SLOT_WIDTH = SCENE_HUD_ZONE_METRICS.objectPanelCompactWidth;

function buildSafeZoneInput(
  contract: SceneHudZoneContract,
  context: Pick<
    SceneHudZoneContractContext,
    "mainRightPanelWidth" | "mainRightPanelVisible" | "objectPanelExpanded" | "sceneWidth"
  >
): ObjectPanelSafeZoneRuntimeInput {
  const layoutWidth = contract.sceneWidth;
  const isMobile = layoutWidth < 768;
  const isNarrow = layoutWidth < SCENE_HUD_ZONE_METRICS.sidePanelMinViewport;
  const compactSidePanels = isNarrow;
  const sideInset = resolveSceneHudEdgeInset();
  const sideTop = contract.objectPanelZone.top || OBJECT_PANEL_TOP;
  const sideMaxHeight = contract.objectPanelZone.height;
  const scenePanelWidth = compactSidePanels
    ? SCENE_HUD_ZONE_METRICS.scenePanelCompactWidth
    : FIXED_SCENE_PANEL_SLOT_WIDTH;
  const objectPanelExpanded = context.objectPanelExpanded ?? false;
  const objectPanelWidthRequested = objectPanelExpanded
    ? SCENE_HUD_ZONE_METRICS.objectPanelExpandedWidth
    : FIXED_OBJECT_PANEL_SLOT_WIDTH;
  const mrpWidth = Math.max(0, context.mainRightPanelWidth ?? 0);
  const mrpVisible = context.mainRightPanelVisible !== false && mrpWidth > 0;
  const usingViewportFallback =
    !context.sceneWidth || context.sceneWidth <= 0 || context.sceneWidth >= contract.viewportWidth - 1;

  return {
    viewportWidth: contract.viewportWidth,
    layoutWidth,
    layoutHeight: contract.sceneHeight,
    sideInset,
    sideTop,
    sideMaxHeight,
    scenePanelLeft: contract.scenePanelZone.left,
    scenePanelWidth,
    objectPanelWidthRequested,
    mrpWidth,
    mrpVisible,
    usingViewportFallback,
    isMobile,
    objectPanelExpanded,
  };
}

export function traceObjectPanelSafeZoneFromHudContract(
  contract: SceneHudZoneContract,
  context: Pick<
    SceneHudZoneContractContext,
    "mainRightPanelWidth" | "mainRightPanelVisible" | "objectPanelExpanded" | "sceneWidth"
  >
): void {
  runObjectPanelSafeZoneEnforcement(buildSafeZoneInput(contract, context));
  if (process.env.NODE_ENV === "production") return;
  auditObjectPanelOwnership();
}

export function resolveObjectPanelSafeZoneForTests(
  contract: SceneHudZoneContract,
  context: Pick<
    SceneHudZoneContractContext,
    "mainRightPanelWidth" | "mainRightPanelVisible" | "objectPanelExpanded" | "sceneWidth"
  >
) {
  return resolveObjectPanelSafeZoneContract(buildSafeZoneInput(contract, context));
}
