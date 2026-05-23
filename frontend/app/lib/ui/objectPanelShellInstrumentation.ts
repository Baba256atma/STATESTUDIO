const loggedKeys = new Set<string>();

function devLogOnce(key: string, event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.info?.(event, payload ?? {});
}

export function logObjectPanelShellMounted(): void {
  devLogOnce("object-panel-mounted", "[Nexora][E2:4][ObjectPanelShellMounted]");
}

export function logObjectPanelCollapsed(): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.("[Nexora][E2:4][ObjectPanelCollapsed]");
}

export function logObjectPanelExpanded(): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.("[Nexora][E2:4][ObjectPanelExpanded]");
}

export function logObjectSelectionObserved(payload: {
  selectedObjectId: string | null;
  selectedObjectLabel: string | null;
}): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `selection-${payload.selectedObjectId ?? "none"}-${payload.selectedObjectLabel ?? "none"}`;
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.info?.("[Nexora][E2:4][ObjectSelectionObserved]", payload);
}

export function resetObjectPanelShellInstrumentationForTests(): void {
  loggedKeys.clear();
}
