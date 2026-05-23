const loggedKeys = new Set<string>();

function devLogOnce(key: string, event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.info?.(event, payload ?? {});
}

export function logExecutiveScenarioPanelMounted(): void {
  devLogOnce("scenario-panel-mounted", "[Nexora][E2:13][ScenarioPanelMounted]");
}

export function logExecutiveScenarioRendered(scenarioId: string): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `scenario-rendered-${scenarioId}`;
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.info?.("[Nexora][E2:13][ScenarioRendered]", { scenarioId });
}

export function logExecutiveScenarioSelected(payload: {
  scenarioId: string;
  title: string;
  status?: string;
}): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.("[Nexora][E2:13][ScenarioSelected]", payload);
}

export function logExecutiveScenarioCompareRequested(payload: {
  selectedScenarioIds: string[];
}): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.("[Nexora][E2:13][CompareRequested]", payload);
}

export function logExecutiveScenarioThemeResolved(mode: "day" | "night"): void {
  devLogOnce(`scenario-theme-${mode}`, "[Nexora][E2:13][ScenarioThemeResolved]", { mode });
}

export function resetExecutiveScenarioSuggestionsInstrumentationForTests(): void {
  loggedKeys.clear();
}
