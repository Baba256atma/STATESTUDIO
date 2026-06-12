/**
 * MRP:12:8 — Executive Questions support panel runtime diagnostics.
 */

let questionsPanelMountedLogged = false;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function traceMrp128QuestionsPanelMounted(): void {
  if (!isDev() || questionsPanelMountedLogged) return;
  questionsPanelMountedLogged = true;
  globalThis.console?.log?.("[MRP128Runtime]\nQuestionsPanel mounted");
}

export function traceMrp128QuestionInjected(question: string): void {
  if (!isDev()) return;
  globalThis.console?.log?.(`[MRP128Runtime]\nQuestion injected\nquestion="${question}"`);
}

export function traceMrp128SingleOpenContractPassed(openPanels: number): void {
  if (!isDev()) return;
  globalThis.console?.log?.(`[MRP128Runtime]\nSingleOpenContract passed\nopenPanels=${openPanels}`);
}

export function resetMrp128RuntimeDiagnosticsForTests(): void {
  questionsPanelMountedLogged = false;
}
