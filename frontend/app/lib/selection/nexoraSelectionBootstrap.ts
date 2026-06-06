export function isExplicitUserSelectionSource(source: string): boolean {
  if (source === "object_click" || source === "investor_demo") return true;
  return source.startsWith("interaction_controller:");
}

export function shouldBlockAutomaticSelectionWrite(input: {
  selectionUserIntent: boolean;
  executiveInteraction: boolean;
  source?: string;
  hasMaterialSelection: boolean;
}): boolean {
  if (!input.hasMaterialSelection) return false;
  if (input.selectionUserIntent) return false;
  if (input.executiveInteraction) return false;
  if (input.source && isExplicitUserSelectionSource(input.source)) return false;
  return true;
}

export function logNexoraSelectionBootstrap(payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  console.debug("[NEXORA_SELECTION_BOOTSTRAP]", payload);
}

export function logNexoraSelectionSource(payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  console.debug("[NEXORA_SELECTION_SOURCE]", payload);
}
