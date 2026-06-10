export function isExplicitUserSelectionSource(source: string): boolean {
  if (source === "object_click" || source.startsWith("object_click:")) return true;
  if (source === "SceneCanvas.onPointerMissed" || source.startsWith("SceneCanvas.onPointerMissed:")) return true;
  if (source === "user_click" || source.startsWith("user_click:")) return true;
  if (source === "investor_demo") return true;
  return false;
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
