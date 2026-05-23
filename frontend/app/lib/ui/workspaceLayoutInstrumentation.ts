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

export function logWorkspaceLayoutMounted(): void {
  devLogOnce("layout-mounted", "[Nexora][E2:18][LayoutMounted]");
}

export function logWorkspaceLayoutPresetChanged(preset: string): void {
  devLogEvent("[Nexora][E2:18][PresetChanged]", { preset });
}

export function logWorkspaceLayoutPanelRepositioned(payload: {
  panel: string;
  preset: string;
  anchor: string;
}): void {
  devLogOnce(
    `panel-reposition-${payload.panel}-${payload.preset}-${payload.anchor}`,
    "[Nexora][E2:18][PanelRepositioned]",
    payload
  );
}

export function logWorkspaceLayoutPanelResized(payload: { panel: string; sizeMode: string }): void {
  devLogOnce(
    `panel-resize-${payload.panel}-${payload.sizeMode}`,
    "[Nexora][E2:18][PanelResized]",
    payload
  );
}

export function logWorkspaceLayoutRestored(preset: string): void {
  devLogOnce(`layout-restored-${preset}`, "[Nexora][E2:18][LayoutRestored]", { preset });
}

export function logWorkspaceResponsiveLayoutApplied(payload: {
  preset: string;
  breakpoint: string;
  rightRailWidthPx: number;
}): void {
  devLogOnce(
    `responsive-${payload.preset}-${payload.breakpoint}-${payload.rightRailWidthPx}`,
    "[Nexora][E2:18][ResponsiveLayoutApplied]",
    payload
  );
}

/** Test-only reset for dedupe keys. */
export function resetWorkspaceLayoutInstrumentationForTests(): void {
  loggedKeys.clear();
}
