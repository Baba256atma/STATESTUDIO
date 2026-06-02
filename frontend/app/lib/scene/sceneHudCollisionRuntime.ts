/** E2:56 — Scene HUD collision detection and governed resolution. */

import type React from "react";

import { enforceCanonicalAnchor, hudZoneToDockZone, type ExecutiveHudZone } from "./executiveHudLayoutGovernance";
import { resolveExecutiveTopBaseline, resolveExecutiveSideInset } from "./executiveTopAlignmentRuntime";
import { resolveExecutiveTopHudSafeZone } from "./executiveTopHudSafeZone";
import {
  getSceneHudRegistration,
  type SceneHudPanelId,
  type SceneHudRegistryEntry,
} from "./sceneHudRegistry";

export type HudLayoutRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type HudLayoutPanel = {
  panelId: SceneHudPanelId;
  zone: ExecutiveHudZone;
  priority: number;
  visible: boolean;
  rect: HudLayoutRect;
};

export type HudCollisionResolutionAction = "none" | "reposition" | "collapse" | "hide";

export type HudCollisionResolution = {
  panelId: SceneHudPanelId;
  action: HudCollisionResolutionAction;
  stylePatch?: React.CSSProperties;
};

export type SceneHudLayoutContext = {
  viewportWidth: number;
  viewportHeight: number;
  inset?: number;
  toolbarTop?: number;
  timelineBottomOffset?: number;
  visiblePanels: Partial<Record<SceneHudPanelId, boolean>>;
};

const logKeys = new Set<string>();

function intersects(a: HudLayoutRect, b: HudLayoutRect): boolean {
  const padding = 4;
  return (
    a.x < b.x + b.width - padding &&
    a.x + a.width - padding > b.x &&
    a.y < b.y + b.height - padding &&
    a.y + a.height - padding > b.y
  );
}

function rectForZone(
  entry: SceneHudRegistryEntry,
  context: SceneHudLayoutContext,
  stackOffset = 0
): HudLayoutRect {
  const inset = context.inset ?? resolveExecutiveSideInset(context.viewportWidth);
  const topBaseline = context.toolbarTop ?? resolveExecutiveTopBaseline(context.viewportWidth);
  const { viewportWidth: vpW, viewportHeight: vpH } = context;
  const width = Math.min(entry.estimatedWidth, vpW - inset * 2);
  const height = entry.estimatedHeight;

  switch (entry.zone) {
    case "LEFT_TOP":
      return { x: inset, y: topBaseline + stackOffset, width, height };
    case "TOP_CENTER": {
      const safeZone = resolveExecutiveTopHudSafeZone({
        viewportWidth: vpW,
        sceneInfoVisible: Boolean(context.visiblePanels.sceneInfoHud),
        objectInfoVisible: Boolean(context.visiblePanels.objectInfoHud),
      });
      const centerWidth = Math.min(width, Math.max(120, safeZone.rightLaneStart - safeZone.leftLaneEnd));
      const x = safeZone.leftLaneEnd + Math.max(0, (safeZone.rightLaneStart - safeZone.leftLaneEnd - centerWidth) / 2);
      return { x, y: topBaseline, width: centerWidth, height };
    }
    case "RIGHT_TOP":
      return { x: vpW - width - inset, y: topBaseline + stackOffset, width, height };
    case "LEFT_BOTTOM": {
      const bottom = context.timelineBottomOffset ?? inset;
      return { x: inset, y: vpH - height - bottom, width, height };
    }
    case "BOTTOM_CENTER": {
      const bottom = context.timelineBottomOffset ?? inset;
      return { x: (vpW - width) / 2, y: vpH - height - bottom, width, height };
    }
    case "RIGHT_BOTTOM": {
      const bottom = context.timelineBottomOffset ?? inset;
      return { x: vpW - width - inset, y: vpH - height - bottom, width, height };
    }
    default:
      return { x: inset, y: inset, width, height };
  }
}

export function buildHudLayoutPanels(context: SceneHudLayoutContext): HudLayoutPanel[] {
  const panels: HudLayoutPanel[] = [];
  const rightTopStack: SceneHudPanelId[] = ["objectInfoHud", "executiveStatusHud"];

  (Object.keys(context.visiblePanels) as SceneHudPanelId[]).forEach((panelId) => {
    if (!context.visiblePanels[panelId]) return;
    const entry = getSceneHudRegistration(panelId);
    const zone = enforceCanonicalAnchor(panelId, entry.zone);
    let stackOffset = 0;

    if (zone === "RIGHT_TOP" && panelId === "executiveStatusHud" && context.visiblePanels.objectInfoHud) {
      const objectEntry = getSceneHudRegistration("objectInfoHud");
      stackOffset = objectEntry.estimatedHeight + 8;
    }

    panels.push({
      panelId,
      zone,
      priority: entry.priority,
      visible: true,
      rect: rectForZone({ ...entry, zone }, context, stackOffset),
    });
  });

  if (context.visiblePanels.executiveSceneToolbar) {
    const entry = getSceneHudRegistration("executiveSceneToolbar");
    const zone = enforceCanonicalAnchor("executiveSceneToolbar", entry.zone);
    panels.push({
      panelId: "executiveSceneToolbar",
      zone,
      priority: entry.priority,
      visible: true,
      rect: rectForZone({ ...entry, zone }, context),
    });
  }

  return panels.sort((a, b) => b.priority - a.priority);
}

export function detectSceneHudCollisions(panels: readonly HudLayoutPanel[]): Array<[HudLayoutPanel, HudLayoutPanel]> {
  const collisions: Array<[HudLayoutPanel, HudLayoutPanel]> = [];
  for (let i = 0; i < panels.length; i += 1) {
    for (let j = i + 1; j < panels.length; j += 1) {
      const a = panels[i];
      const b = panels[j];
      if (!a?.visible || !b?.visible) continue;
      if (intersects(a.rect, b.rect)) collisions.push([a, b]);
    }
  }
  return collisions;
}

export function resolveSceneHudCollisions(
  panels: readonly HudLayoutPanel[]
): Map<SceneHudPanelId, HudCollisionResolution> {
  const resolutions = new Map<SceneHudPanelId, HudCollisionResolution>();
  panels.forEach((panel) => resolutions.set(panel.panelId, { panelId: panel.panelId, action: "none" }));

  const collisions = detectSceneHudCollisions(panels);
  if (collisions.length === 0) return resolutions;

  logHudCollision({
    collisionCount: collisions.length,
    pairs: collisions.map(([a, b]) => `${a.panelId}:${b.panelId}`),
  });

  collisions.forEach(([a, b]) => {
    if (a.panelId === "executiveSceneToolbar" || b.panelId === "executiveSceneToolbar") {
      resolutions.set("executiveSceneToolbar", {
        panelId: "executiveSceneToolbar",
        action: "reposition",
        stylePatch: {
          opacity: 1,
          pointerEvents: "none" as const,
          zIndex: 1600,
        },
      });
      return;
    }

    const loser = a.priority <= b.priority ? a : b;
    const winner = a.priority <= b.priority ? b : a;
    let action: HudCollisionResolutionAction = "reposition";
    let stylePatch: React.CSSProperties | undefined;

    if (loser.priority < 60) {
      action = "hide";
      stylePatch = { display: "none" };
    } else if (loser.priority < 85) {
      action = "collapse";
      stylePatch = { opacity: 0.88, pointerEvents: "none" as const };
    } else if (loser.zone === winner.zone && loser.zone === "RIGHT_TOP") {
      action = "reposition";
      stylePatch = { transform: `translateY(${winner.rect.height + 8}px)` };
    } else if (loser.panelId === "executiveSceneToolbar") {
      action = "reposition";
      stylePatch = { maxWidth: "min(320px, 52vw)" };
    } else if (
      loser.zone === "LEFT_TOP" ||
      loser.zone === "TOP_CENTER" ||
      (loser.zone === "RIGHT_TOP" && loser.panelId === "objectInfoHud")
    ) {
      action = "none";
    } else {
      action = "reposition";
      stylePatch = { transform: "translateY(48px)" };
    }

    resolutions.set(loser.panelId, { panelId: loser.panelId, action, stylePatch });
  });

  return resolutions;
}

export function resolveSceneHudPanelStyle(
  panelId: SceneHudPanelId,
  context: SceneHudLayoutContext
): React.CSSProperties | undefined {
  const panels = buildHudLayoutPanels(context);
  const resolutions = resolveSceneHudCollisions(panels);
  return resolutions.get(panelId)?.stylePatch;
}

export function logHudCollision(payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = JSON.stringify(payload);
  if (logKeys.has(key)) return;
  logKeys.add(key);
  globalThis.console?.debug?.("[Nexora][HudCollision]", payload);
}

export function resetSceneHudCollisionLogsForTests(): void {
  logKeys.clear();
}

export { hudZoneToDockZone };
