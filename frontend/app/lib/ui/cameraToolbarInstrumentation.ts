const loggedKeys = new Set<string>();

function devLogOnce(key: string, event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.info?.(event, payload ?? {});
}

export function logCameraToolbarMounted(): void {
  devLogOnce("camera-toolbar-mounted", "[Nexora][E2:11][CameraToolbarMounted]");
}

export function logCameraActionRequested(payload: { action: string }): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.("[Nexora][E2:11][CameraActionRequested]", payload);
}

export function logHudThemeModeResolved(payload: { mode: string }): void {
  devLogOnce(`hud-theme-${payload.mode}`, "[Nexora][E2:11][HudThemeModeResolved]", payload);
}

export function resetCameraToolbarInstrumentationForTests(): void {
  loggedKeys.clear();
}
