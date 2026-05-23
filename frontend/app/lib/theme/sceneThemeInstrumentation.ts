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

export function logSceneThemeChanged(previous: string, next: string): void {
  devLogEvent("[Nexora][ThemeChanged]", { previous, next });
}

export function logSceneThemeApplied(theme: string): void {
  devLogOnce(`theme-applied-${theme}`, "[Nexora][ThemeApplied]", { theme });
}

export function logSceneHudThemeAdapted(payload: {
  affectedHudCount: number;
  adaptationDurationMs: number;
  theme: string;
}): void {
  devLogOnce(
    `hud-adapted-${payload.theme}-${payload.affectedHudCount}`,
    "[Nexora][HUDThemeAdapted]",
    payload
  );
}

export function logSceneThemeValidation(payload: Record<string, unknown>): void {
  devLogOnce(`theme-validation-${payload.theme ?? "unknown"}`, "[Nexora][ThemeValidation]", payload);
}

/** Test-only reset for dedupe keys. */
export function resetSceneThemeInstrumentationForTests(): void {
  loggedKeys.clear();
}
