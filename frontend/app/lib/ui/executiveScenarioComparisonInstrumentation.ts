const loggedKeys = new Set<string>();

function devLogOnce(key: string, event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.info?.(event, payload ?? {});
}

export function logExecutiveScenarioComparisonWorkspaceMounted(): void {
  devLogOnce("comparison-workspace-mounted", "[Nexora][E2:14][ComparisonWorkspaceMounted]");
}

export function logExecutiveScenarioOptionCompared(scenarioId: string): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `option-compared-${scenarioId}`;
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.info?.("[Nexora][E2:14][ScenarioOptionCompared]", { scenarioId });
}

export function logExecutiveScenarioComparisonSelected(payload: {
  scenarioId: string;
  title: string;
}): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.("[Nexora][E2:14][ScenarioComparisonSelected]", payload);
}

export function logExecutiveScenarioComparisonSimulationRequested(payload: {
  scenarioId: string | null;
  title?: string | null;
}): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.("[Nexora][E2:14][SimulationRequested]", payload);
}

export function logExecutiveScenarioDecisionEvaluationRendered(bestOptionId: string): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `decision-eval-${bestOptionId}`;
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.info?.("[Nexora][E2:14][DecisionEvaluationRendered]", { bestOptionId });
}

export function logExecutiveScenarioComparisonThemeResolved(mode: "day" | "night"): void {
  devLogOnce(`comparison-theme-${mode}`, "[Nexora][E2:14][ScenarioThemeResolved]", { mode });
}

export function resetExecutiveScenarioComparisonInstrumentationForTests(): void {
  loggedKeys.clear();
}
