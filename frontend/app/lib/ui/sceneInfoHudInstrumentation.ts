const loggedKeys = new Set<string>();

function devLogOnce(key: string, event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.info?.(event, payload ?? {});
}

export function logSceneInfoHudMounted(): void {
  devLogOnce("scene-info-hud-mounted", "[Nexora][E2:8][SceneInfoHudMounted]");
}

export function logSceneInfoHudCollapsed(): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.("[Nexora][E2:8][SceneInfoHudCollapsed]");
}

export function logSceneInfoHudExpanded(): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.("[Nexora][E2:8][SceneInfoHudExpanded]");
}

export function logSceneLayerVisibilityChanged(payload: {
  layer: string;
  visible: boolean;
}): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.("[Nexora][E2:8][SceneLayerVisibilityChanged]", payload);
}

export function resetSceneInfoHudInstrumentationForTests(): void {
  loggedKeys.clear();
}
