/** @deprecated Use sceneHudZoneContract — retained for backward-compatible imports. */

import type React from "react";

import {
  logSceneHudZoneContract,
  resetSceneHudZoneContractForTests,
  resolveSceneHudZoneContract,
  SCENE_HUD_ZONE_HOSTED_OVERLAY_STYLE,
  SCENE_HUD_ZONE_METRICS,
  zoneShellStyle,
  type SceneHudZoneContract,
  type SceneHudZoneContractContext,
} from "./sceneHudZoneContract";
import { SCENE_HUD_ZONE_IDS } from "./sceneHudZoneContract";

export type SceneLayoutZoneId = "topControlsZone" | "rightActionPanelZone" | "bottomTimelineZone";

export type SceneLayoutZoneRect = {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
  maxWidth: string;
};

export type SceneLayoutContract = {
  viewportWidth: number;
  viewportHeight: number;
  topControlsZone: SceneLayoutZoneRect;
  rightActionPanelZone: SceneLayoutZoneRect;
  bottomTimelineZone: SceneLayoutZoneRect;
};

export type SceneLayoutContractContext = SceneHudZoneContractContext & {
  sceneInfoVisible?: boolean;
  objectInfoVisible?: boolean;
  actionPanelExpanded?: boolean;
};

export const SCENE_LAYOUT_METRICS = Object.freeze({
  topControlsHeight: SCENE_HUD_ZONE_METRICS.topBarHeight,
  topControlsGap: SCENE_HUD_ZONE_METRICS.zoneGap,
  actionPanelCompactWidth: SCENE_HUD_ZONE_METRICS.objectPanelCompactWidth,
  actionPanelExpandedWidth: SCENE_HUD_ZONE_METRICS.objectPanelExpandedWidth,
  actionPanelCompactHeight: 56,
  actionPanelExpandedHeight: 360,
  timelineTransportHeight: SCENE_HUD_ZONE_METRICS.timelineTransportHeight,
  timelineCollapsedHeight: SCENE_HUD_ZONE_METRICS.timelineBodyHeight,
  timelineExpandedHeight: 220,
  chatInputClearance: SCENE_HUD_ZONE_METRICS.chatInputClearance,
  bottomHudPadding: SCENE_HUD_ZONE_METRICS.bottomHudPadding,
});

function toLegacyContract(zone: SceneHudZoneContract): SceneLayoutContract {
  return {
    viewportWidth: zone.viewportWidth,
    viewportHeight: zone.viewportHeight,
    topControlsZone: {
      top: zone.topBarZone.top,
      right: zone.topBarZone.right,
      bottom: zone.topBarZone.bottom,
      left: zone.topBarZone.left,
      width: zone.topBarZone.width,
      height: zone.topBarZone.height,
      maxWidth: zone.topBarZone.maxWidth,
    },
    rightActionPanelZone: {
      top: zone.objectPanelZone.top,
      right: zone.objectPanelZone.right,
      bottom: zone.objectPanelZone.bottom,
      left: zone.objectPanelZone.left,
      width: zone.objectPanelZone.width,
      height: zone.objectPanelZone.height,
      maxWidth: zone.objectPanelZone.maxWidth,
    },
    bottomTimelineZone: {
      top: zone.timelineZone.top,
      right: zone.timelineZone.right,
      bottom: zone.timelineZone.bottom,
      left: zone.timelineZone.left,
      width: zone.timelineZone.width,
      height: zone.timelineZone.height,
      maxWidth: zone.timelineZone.maxWidth,
    },
  };
}

export function resolveSceneLayoutContract(
  context: SceneLayoutContractContext = {}
): SceneLayoutContract {
  return toLegacyContract(
    resolveSceneHudZoneContract({
      viewportWidth: context.viewportWidth,
      viewportHeight: context.viewportHeight,
      scenePanelVisible: context.scenePanelVisible ?? context.sceneInfoVisible ?? true,
      timelineVisible: context.timelineVisible ?? true,
      topBarVisible: context.topBarVisible ?? true,
      timelineHeightMode: context.timelineHeightMode ?? "compact",
      objectPanelExpanded: context.objectPanelExpanded ?? context.actionPanelExpanded ?? false,
    })
  );
}

export function applyTopControlsZoneStyle(contract: SceneLayoutContract): React.CSSProperties {
  return zoneShellStyle(
    resolveSceneHudZoneContract({
      viewportWidth: contract.viewportWidth,
      viewportHeight: contract.viewportHeight,
    }),
    SCENE_HUD_ZONE_IDS.topBar
  );
}

export function applyRightActionPanelZoneStyle(contract: SceneLayoutContract): React.CSSProperties {
  return zoneShellStyle(
    resolveSceneHudZoneContract({
      viewportWidth: contract.viewportWidth,
      viewportHeight: contract.viewportHeight,
    }),
    SCENE_HUD_ZONE_IDS.objectPanel
  );
}

export function applyBottomTimelineZoneStyle(contract: SceneLayoutContract): React.CSSProperties {
  return zoneShellStyle(
    resolveSceneHudZoneContract({
      viewportWidth: contract.viewportWidth,
      viewportHeight: contract.viewportHeight,
    }),
    SCENE_HUD_ZONE_IDS.timeline
  );
}

export function logSceneLayoutFixed(contract: SceneLayoutContract): void {
  logSceneHudZoneContract(
    resolveSceneHudZoneContract({
      viewportWidth: contract.viewportWidth,
      viewportHeight: contract.viewportHeight,
    })
  );
}

export function resetSceneLayoutContractForTests(): void {
  resetSceneHudZoneContractForTests();
}

export { SCENE_HUD_ZONE_HOSTED_OVERLAY_STYLE };
