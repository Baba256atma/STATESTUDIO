const loggedKeys = new Set<string>();

function devLogOnce(key: string, event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.info?.(event, payload ?? {});
}

export function logExecutiveQuickActionsMounted(): void {
  devLogOnce("quick-actions-mounted", "[Nexora][E2:16][QuickActionsMounted]");
}

export function logExecutiveQuickActionAnalyzeRequested(payload: {
  hasObjectSelection: boolean;
  label: string;
}): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.("[Nexora][E2:16][AnalyzeRequested]", payload);
}

export function logExecutiveQuickActionSimulateRequested(): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.("[Nexora][E2:16][SimulateRequested]");
}

export function logExecutiveQuickActionCompareRequested(): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.("[Nexora][E2:16][CompareRequested]");
}

export function logExecutiveQuickActionSnapshotRequested(): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.("[Nexora][E2:16][SnapshotRequested]");
}

export function logExecutiveQuickActionsDockThemeResolved(mode: "day" | "night"): void {
  devLogOnce(`quick-actions-theme-${mode}`, "[Nexora][E2:16][DockThemeResolved]", { mode });
}

export function resetExecutiveQuickActionsInstrumentationForTests(): void {
  loggedKeys.clear();
}
