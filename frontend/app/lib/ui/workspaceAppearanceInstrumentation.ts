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

export function logWorkspaceAppearanceMounted(): void {
  devLogOnce("appearance-mounted", "[Nexora][E2:17][AppearanceMounted]");
}

export function logWorkspaceAppearanceModeChanged(mode: "day" | "night"): void {
  devLogEvent("[Nexora][E2:17][ModeChanged]", { mode });
}

export function logWorkspaceAppearanceThemeApplied(mode: "day" | "night"): void {
  devLogOnce(`theme-applied-${mode}`, "[Nexora][E2:17][ThemeApplied]", { mode });
}

export function logWorkspaceHudThemeUpdated(mode: "day" | "night"): void {
  devLogOnce(`hud-theme-${mode}`, "[Nexora][E2:17][HudThemeUpdated]", { mode });
}

export function logWorkspaceSceneThemeUpdated(mode: "day" | "night"): void {
  devLogOnce(`scene-theme-${mode}`, "[Nexora][E2:17][SceneThemeUpdated]", { mode });
}

export function logWorkspaceAppearancePreferenceRestored(preference: string, resolved: "day" | "night"): void {
  devLogOnce(
    `preference-restored-${preference}-${resolved}`,
    "[Nexora][E2:17][PreferenceRestored]",
    { preference, resolved }
  );
}

/** Test-only reset for dedupe keys. */
export function resetWorkspaceAppearanceInstrumentationForTests(): void {
  loggedKeys.clear();
}
