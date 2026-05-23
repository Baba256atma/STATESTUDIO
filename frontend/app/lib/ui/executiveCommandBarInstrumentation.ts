const loggedKeys = new Set<string>();

function devLogOnce(key: string, event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.info?.(event, payload ?? {});
}

export function logExecutiveCommandBarMounted(): void {
  devLogOnce("command-bar-mounted", "[Nexora][E2:15][CommandBarMounted]");
}

export function logExecutiveFrsiStatusRendered(score: number | null): void {
  devLogOnce(`frsi-${score ?? "none"}`, "[Nexora][E2:15][FrsiStatusRendered]", { score });
}

export function logExecutiveScenarioStatusRendered(name: string): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `scenario-${name}`;
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.info?.("[Nexora][E2:15][ScenarioStatusRendered]", { name });
}

export function logExecutiveDecisionStatusRendered(phase: string): void {
  devLogOnce(`decision-${phase}`, "[Nexora][E2:15][DecisionStatusRendered]", { phase });
}

export function logExecutiveReadinessRendered(phase: string): void {
  devLogOnce(`readiness-${phase}`, "[Nexora][E2:15][ExecutiveReadinessRendered]", { phase });
}

export function logExecutiveCommandBarThemeResolved(mode: "day" | "night"): void {
  devLogOnce(`command-bar-theme-${mode}`, "[Nexora][E2:15][CommandBarThemeResolved]", { mode });
}

export function logExecutiveCommandBarActionTriggered(action: string): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.info?.("[Nexora][E2:15][CommandBarActionTriggered]", { action });
}

export function resetExecutiveCommandBarInstrumentationForTests(): void {
  loggedKeys.clear();
}
