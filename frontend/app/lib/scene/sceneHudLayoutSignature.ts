export type SceneHudDriftPanelId =
  | "sceneInfoHud"
  | "objectInfoHud"
  | "timelineHud"
  | "sceneToolbar"
  | "executiveStatusHud"
  | "quickActionsDock";

export const HUD_DRIFT_PIXEL_TOLERANCE = 2;

export type SceneHudLayoutRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type SceneHudLayoutSnapshot = {
  panelId: SceneHudDriftPanelId;
  top: number;
  left: number;
  width: number;
  height: number;
  visible: boolean;
  collapsed: boolean;
};

/** Normalize layout values to one decimal place, rounded. */
export function normalizeHudLayoutValue(value: number): number {
  return Math.round(Number(value.toFixed(1)));
}

export function normalizeHudLayoutRect(rect: SceneHudLayoutRect): SceneHudLayoutRect {
  return {
    top: normalizeHudLayoutValue(rect.top),
    left: normalizeHudLayoutValue(rect.left),
    width: normalizeHudLayoutValue(rect.width),
    height: normalizeHudLayoutValue(rect.height),
  };
}

export function buildSceneHudLayoutSignature(snapshot: SceneHudLayoutSnapshot): string {
  const rect = normalizeHudLayoutRect(snapshot);
  return JSON.stringify({
    panelId: snapshot.panelId,
    roundedTop: rect.top,
    roundedLeft: rect.left,
    roundedWidth: rect.width,
    roundedHeight: rect.height,
    visibility: snapshot.visible,
    collapsed: snapshot.collapsed,
  });
}

export function areHudLayoutRectsStable(
  before: SceneHudLayoutRect,
  after: SceneHudLayoutRect,
  tolerancePx: number = HUD_DRIFT_PIXEL_TOLERANCE
): boolean {
  return (
    Math.abs(before.top - after.top) <= tolerancePx &&
    Math.abs(before.left - after.left) <= tolerancePx &&
    Math.abs(before.width - after.width) <= tolerancePx &&
    Math.abs(before.height - after.height) <= tolerancePx
  );
}

export function inferSceneHudDriftReason(
  before: SceneHudLayoutRect,
  after: SceneHudLayoutRect,
  tolerancePx: number = HUD_DRIFT_PIXEL_TOLERANCE
): "layout_measurement" | "position_shift" | "subpixel_variance" {
  if (
    Math.abs(before.width - after.width) > tolerancePx ||
    Math.abs(before.height - after.height) > tolerancePx
  ) {
    return "layout_measurement";
  }
  if (
    Math.abs(before.top - after.top) > tolerancePx ||
    Math.abs(before.left - after.left) > tolerancePx
  ) {
    return "position_shift";
  }
  return "subpixel_variance";
}

export function readSceneHudLayoutSnapshot(
  node: HTMLElement,
  panelId: SceneHudDriftPanelId
): SceneHudLayoutSnapshot {
  const raw = node.getBoundingClientRect();
  const rect = normalizeHudLayoutRect({
    top: raw.top,
    left: raw.left,
    width: raw.width,
    height: raw.height,
  });
  const style = window.getComputedStyle(node);
  const visible =
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    Number.parseFloat(style.opacity || "1") > 0.01 &&
    rect.width > 0 &&
    rect.height > 0;
  const collapsed =
    node.querySelector('[data-nx-state="collapsed"]') != null ||
    node.getAttribute("data-scene-hud-collapsed") === "true";

  return {
    panelId,
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    visible,
    collapsed,
  };
}
