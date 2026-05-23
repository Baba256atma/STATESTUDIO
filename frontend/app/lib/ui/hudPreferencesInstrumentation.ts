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

export function logHudPreferencesMounted(): void {
  devLogOnce("hud-prefs-mounted", "[Nexora][E2:19][HudPreferencesMounted]");
}

export function logHudVisibilityChanged(panel: string, visibility: string): void {
  devLogEvent("[Nexora][E2:19][HudVisibilityChanged]", { panel, visibility });
}

export function logHudSizeChanged(panel: string, size: string): void {
  devLogEvent("[Nexora][E2:19][HudSizeChanged]", { panel, size });
}

export function logHudDockChanged(panel: string, dock: string): void {
  devLogEvent("[Nexora][E2:19][HudDockChanged]", { panel, dock });
}

export function logHudPreferenceRestored(panelCount: number): void {
  devLogOnce(`hud-pref-restored-${panelCount}`, "[Nexora][E2:19][HudPreferenceRestored]", { panelCount });
}

export function logHudPanelRegistered(panel: string): void {
  devLogOnce(`hud-registered-${panel}`, "[Nexora][E2:19][HudRegistered]", { panel });
}

/** Test-only reset for dedupe keys. */
export function resetHudPreferencesInstrumentationForTests(): void {
  loggedKeys.clear();
}
