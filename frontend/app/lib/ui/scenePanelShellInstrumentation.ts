import type { ExecutiveWorkspaceLayoutMetrics } from "./executiveWorkspaceLayout";

const loggedKeys = new Set<string>();

function devLog(key: string, event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.info?.(event, payload ?? {});
}

export function logScenePanelShellMounted(): void {
  devLog("scene-panel-mounted", "[Nexora][E2:3][ScenePanelShellMounted]");
}

export function logScenePanelCollapsed(): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.("[Nexora][E2:3][ScenePanelCollapsed]");
}

export function logScenePanelExpanded(): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.("[Nexora][E2:3][ScenePanelExpanded]");
}

export function logAddObjectPlaceholderClicked(): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.("[Nexora][E2:3][AddObjectPlaceholderClicked]");
}

export function resetScenePanelShellInstrumentationForTests(): void {
  loggedKeys.clear();
}
