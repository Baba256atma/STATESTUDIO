/**
 * MRP_HUD:14:9 — Unified scene-native HUD edge inset + boundary alignment contract.
 */

export const HUD_EDGE_INSET = 4;

export const SCENE_PANEL_LEFT = HUD_EDGE_INSET;
export const OBJECT_PANEL_RIGHT = HUD_EDGE_INSET;
export const TIMELINE_LEFT = HUD_EDGE_INSET;
export const TIMELINE_RIGHT = HUD_EDGE_INSET;
export const TIMELINE_BOTTOM = HUD_EDGE_INSET;
export const SCENE_PANEL_TOP = HUD_EDGE_INSET;
export const OBJECT_PANEL_TOP = HUD_EDGE_INSET;

export type SceneHudBoundaryZones = Readonly<{
  scenePanelZone: { top: number; left: number };
  objectPanelZone: { top: number; right: number };
  timelineZone: { left: number; right: number; bottom: number };
}>;

export type SceneHudBoundaryInsets = Readonly<{
  edgeInset: number;
  sceneLeft: number;
  objectRight: number;
  timelineLeft: number;
  timelineRight: number;
  timelineBottom: number;
  scenePanelTop: number;
  objectPanelTop: number;
}>;

let lastInsetTraceSignature: string | null = null;
let lastBoundaryAlignment: boolean | null = null;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function resolveSceneHudEdgeInset(): number {
  return HUD_EDGE_INSET;
}

export function resolveSceneHudBoundaryInsets(): SceneHudBoundaryInsets {
  return Object.freeze({
    edgeInset: HUD_EDGE_INSET,
    sceneLeft: SCENE_PANEL_LEFT,
    objectRight: OBJECT_PANEL_RIGHT,
    timelineLeft: TIMELINE_LEFT,
    timelineRight: TIMELINE_RIGHT,
    timelineBottom: TIMELINE_BOTTOM,
    scenePanelTop: SCENE_PANEL_TOP,
    objectPanelTop: OBJECT_PANEL_TOP,
  });
}

const BOUNDARY_TOLERANCE_PX = 0.5;

export function validateSceneHudBoundaryAlignment(contract: SceneHudBoundaryZones): boolean {
  const insets = resolveSceneHudBoundaryInsets();
  return (
    Math.abs(contract.scenePanelZone.left - insets.sceneLeft) <= BOUNDARY_TOLERANCE_PX &&
    Math.abs(contract.scenePanelZone.top - insets.scenePanelTop) <= BOUNDARY_TOLERANCE_PX &&
    Math.abs(contract.objectPanelZone.top - insets.objectPanelTop) <= BOUNDARY_TOLERANCE_PX &&
    Math.abs(contract.objectPanelZone.right - insets.objectRight) <= BOUNDARY_TOLERANCE_PX &&
    Math.abs(contract.timelineZone.left - insets.timelineLeft) <= BOUNDARY_TOLERANCE_PX &&
    Math.abs(contract.timelineZone.right - insets.timelineRight) <= BOUNDARY_TOLERANCE_PX &&
    Math.abs(contract.timelineZone.bottom - insets.timelineBottom) <= BOUNDARY_TOLERANCE_PX
  );
}

export function traceSceneHudInsets(contract: SceneHudBoundaryZones & { sceneWidth?: number; sceneHeight?: number }): void {
  if (!isDev()) return;

  const insets = resolveSceneHudBoundaryInsets();
  const boundaryAlignment = validateSceneHudBoundaryAlignment(contract);
  const signature = [
    contract.sceneWidth ?? 0,
    contract.sceneHeight ?? 0,
    contract.scenePanelZone.left,
    contract.scenePanelZone.top,
    contract.objectPanelZone.top,
    contract.objectPanelZone.right,
    contract.timelineZone.left,
    contract.timelineZone.right,
    contract.timelineZone.bottom,
    boundaryAlignment,
  ].join(":");

  if (lastInsetTraceSignature !== signature) {
    lastInsetTraceSignature = signature;
    globalThis.console?.log?.(
      `[NexoraHudInsets] edgeInset=${insets.edgeInset} sceneLeft=${insets.sceneLeft} objectRight=${insets.objectRight} timelineLeft=${insets.timelineLeft} timelineRight=${insets.timelineRight} timelineBottom=${insets.timelineBottom}`
    );
  }

  if (lastBoundaryAlignment !== boundaryAlignment) {
    lastBoundaryAlignment = boundaryAlignment;
    globalThis.console?.log?.(
      `[NexoraHudInsets] boundaryAlignment=${boundaryAlignment}`
    );
    if (!boundaryAlignment) {
      globalThis.console?.warn?.("[NexoraHudInsets][Brake] reason=edge_alignment_mismatch");
    }
  }
}

export function resetSceneHudInsetContractForTests(): void {
  lastInsetTraceSignature = null;
  lastBoundaryAlignment = null;
}
