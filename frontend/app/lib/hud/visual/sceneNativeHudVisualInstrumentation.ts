const loggedKeys = new Set<string>();

function devLogOnce(key: string, event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.info?.(event, payload ?? {});
}

function devLogEvent(event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.(event, payload ?? {});
}

export function logSceneNativeHudVisualSystem(payload: Record<string, unknown>): void {
  devLogOnce(`hud-visual-${payload.surface ?? "unknown"}-${payload.themeMode ?? "night"}`, "[Nexora][HudVisualSystem]", payload);
}

export function logSceneHudDepth(payload: Record<string, unknown>): void {
  devLogEvent("[Nexora][HudDepth]", payload);
}

export function logExecutiveTransparency(payload: Record<string, unknown>): void {
  devLogOnce(`transparency-${payload.mode ?? "balanced"}`, "[Nexora][Transparency]", payload);
}

export function logSceneHudSpatialAlignment(payload: Record<string, unknown>): void {
  devLogEvent("[Nexora][SpatialAlignment]", payload);
}

export function logHudEdgeIntegration(payload: Record<string, unknown>): void {
  devLogOnce(`edge-${payload.anchor ?? "unknown"}`, "[Nexora][EdgeIntegration]", payload);
}

export function logSceneHudTypographyAudit(payload: Record<string, unknown>): void {
  devLogEvent("[Nexora][TypographyAudit]", payload);
}

export function resetSceneNativeHudVisualInstrumentationForTests(): void {
  loggedKeys.clear();
}
