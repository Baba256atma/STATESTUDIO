/** E2:58 — Selection communicated through visual emphasis, not tooltip text. */

export type ExecutiveObjectSelectionHighlight = {
  showRing: boolean;
  ringScale: number;
  ringOpacity: number;
  emissiveBoost: number;
  outlineStrength: number;
  labelEmphasis: boolean;
};

export function resolveExecutiveObjectSelectionHighlight(input: {
  selected: boolean;
  focused: boolean;
  theme?: "day" | "night";
}): ExecutiveObjectSelectionHighlight {
  const active = input.selected || input.focused;
  const highlight: ExecutiveObjectSelectionHighlight = {
    showRing: input.selected,
    ringScale: input.selected ? 1.34 : 1,
    ringOpacity: input.theme === "day" ? 0.34 : 0.46,
    emissiveBoost: active ? 0.85 : 0,
    outlineStrength: active ? 1.15 : 1,
    labelEmphasis: active,
  };

  if (active) {
    logSelectionHighlight({
      selected: input.selected,
      focused: input.focused,
      showRing: highlight.showRing,
    });
  }

  return highlight;
}

const logKeys = new Set<string>();

export function logSelectionHighlight(payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = JSON.stringify(payload);
  if (logKeys.has(key)) return;
  logKeys.add(key);
  globalThis.console?.debug?.("[Nexora][SelectionHighlight]", payload);
}

export function resetExecutiveObjectSelectionHighlightLogsForTests(): void {
  logKeys.clear();
}
