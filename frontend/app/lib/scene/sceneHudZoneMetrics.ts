/**
 * Leaf HUD zone metrics. Kept off sceneHudZoneContract so safe-zone
 * contracts can read numbers without forming a Turbopack cycle
 * (empty-module / "has no exports" failure).
 */

import { SCENE_PANEL_TOP } from "./sceneHudInsetContract.ts";
import { SCENE_PANEL_WIDTH } from "./scenePanelWidthContract.ts";
import {
  OBJECT_PANEL_EXPANDED_WIDTH,
  OBJECT_PANEL_WIDTH,
} from "../hud/hudPanelDesignContract.ts";

export const SCENE_HUD_ZONE_METRICS = Object.freeze({
  topBarHeight: 44,
  zoneGap: 8,
  scenePanelWidth: SCENE_PANEL_WIDTH,
  scenePanelCompactWidth: SCENE_PANEL_WIDTH,
  scenePanelTopInset: SCENE_PANEL_TOP,
  objectPanelCompactWidth: OBJECT_PANEL_WIDTH,
  objectPanelExpandedWidth: OBJECT_PANEL_EXPANDED_WIDTH,
  objectPanelRailWidth: 56,
  timelineTransportHeight: 52,
  timelineBodyHeight: 64,
  timelineCollapsedBodyHeight: 36,
  timelineExpandedBodyHeight: 220,
  chatInputClearance: 88,
  bottomHudPadding: 16,
  sidePanelMinViewport: 1024,
  mrpSafeGap: 16,
});
