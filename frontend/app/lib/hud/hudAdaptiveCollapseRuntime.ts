import { getExecutiveHudViewport } from "../layout/executiveHudHydrationRuntime";

export type HudAdaptiveCollapseInput = {
  panelId: string;
  priority: number;
  viewportWidth?: number;
  viewportHeight?: number;
  visiblePanelCount?: number;
};

export type HudAdaptiveCollapseResult = {
  shouldCollapse: boolean;
  reason: "none" | "narrow_viewport" | "short_viewport" | "crowded_scene";
};

const logKeys = new Set<string>();

function viewport() {
  return getExecutiveHudViewport();
}

function log(payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = JSON.stringify(payload);
  if (logKeys.has(key)) return;
  logKeys.add(key);
  globalThis.console?.debug?.("[Nexora][HudAutoCollapse]", payload);
}

export function resolveHudAdaptiveCollapse(input: HudAdaptiveCollapseInput): HudAdaptiveCollapseResult {
  const vp = viewport();
  const width = input.viewportWidth ?? vp.width;
  const height = input.viewportHeight ?? vp.height;
  const visiblePanelCount = input.visiblePanelCount ?? 3;
  const isProtected =
    input.panelId === "sceneInfoHud" || input.panelId === "objectInfoHud" || input.panelId === "timelineHud";

  let result: HudAdaptiveCollapseResult = { shouldCollapse: false, reason: "none" };
  if (!isProtected && width < 960) result = { shouldCollapse: true, reason: "narrow_viewport" };
  else if (!isProtected && height < 680) result = { shouldCollapse: true, reason: "short_viewport" };
  else if (!isProtected && visiblePanelCount > 5 && input.priority < 30) result = { shouldCollapse: true, reason: "crowded_scene" };

  if (result.shouldCollapse) {
    log({
      panelId: input.panelId,
      priority: input.priority,
      reason: result.reason,
      width,
      height,
      visiblePanelCount,
    });
  }
  return result;
}

export function resetHudAdaptiveCollapseRuntimeForTests(): void {
  logKeys.clear();
}
