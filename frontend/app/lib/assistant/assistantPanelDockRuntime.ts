/**
 * MRP:11:2:2 — Session-scoped assistant panel dock visibility runtime.
 */

import {
  ASSISTANT_PANEL_DOCK_STORAGE_KEY,
  DEFAULT_ASSISTANT_PANEL_VISIBILITY,
  resolveAssistantPanelDockAction,
  type AssistantPanelDockAction,
  type AssistantPanelDockId,
  type AssistantPanelVisibility,
} from "./assistantPanelDockContract.ts";
import { ASSISTANT_SUGGESTIONS_VISIBILITY_STORAGE_KEY } from "./assistantSuggestionsVisibilityContract.ts";

const listeners = new Set<() => void>();

let assistantPanelVisibility: AssistantPanelVisibility = { ...DEFAULT_ASSISTANT_PANEL_VISIBILITY };

function readStorage(): Storage | null {
  if (typeof globalThis.sessionStorage === "undefined") return null;
  return globalThis.sessionStorage;
}

function parsePanelVisibility(raw: string | null): AssistantPanelVisibility {
  if (!raw) return { ...DEFAULT_ASSISTANT_PANEL_VISIBILITY };
  try {
    const parsed = JSON.parse(raw) as Partial<AssistantPanelVisibility>;
    return {
      suggestions: parsed.suggestions ?? DEFAULT_ASSISTANT_PANEL_VISIBILITY.suggestions,
      guidance: parsed.guidance ?? DEFAULT_ASSISTANT_PANEL_VISIBILITY.guidance,
      scenario: parsed.scenario ?? DEFAULT_ASSISTANT_PANEL_VISIBILITY.scenario,
      decision: parsed.decision ?? DEFAULT_ASSISTANT_PANEL_VISIBILITY.decision,
      actions: parsed.actions ?? DEFAULT_ASSISTANT_PANEL_VISIBILITY.actions,
    };
  } catch {
    return { ...DEFAULT_ASSISTANT_PANEL_VISIBILITY };
  }
}

function persistVisibility(state: AssistantPanelVisibility): void {
  const storage = readStorage();
  if (!storage) return;
  try {
    storage.setItem(ASSISTANT_PANEL_DOCK_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota / privacy mode failures.
  }
}

function hydrateFromStorage(): void {
  const storage = readStorage();
  if (!storage) return;
  const raw = storage.getItem(ASSISTANT_PANEL_DOCK_STORAGE_KEY);
  if (raw) {
    assistantPanelVisibility = parsePanelVisibility(raw);
    return;
  }
  const legacySuggestions = storage.getItem(ASSISTANT_SUGGESTIONS_VISIBILITY_STORAGE_KEY);
  if (legacySuggestions !== null) {
    assistantPanelVisibility = {
      ...DEFAULT_ASSISTANT_PANEL_VISIBILITY,
      suggestions: legacySuggestions !== "0" && legacySuggestions !== "false",
    };
    persistVisibility(assistantPanelVisibility);
  }
}

if (typeof globalThis.window !== "undefined") {
  hydrateFromStorage();
}

export function getAssistantPanelVisibility(): AssistantPanelVisibility {
  return assistantPanelVisibility;
}

export function isAssistantPanelVisible(panelId: AssistantPanelDockId): boolean {
  return assistantPanelVisibility[panelId];
}

export function traceAssistantPanelDock(input: {
  panel: AssistantPanelDockId;
  action: AssistantPanelDockAction;
}): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.log?.(
    `[AssistantPanelDock]\npanel=${input.panel}\naction=${input.action}`
  );
}

export function setAssistantPanelVisible(panelId: AssistantPanelDockId, visible: boolean): boolean {
  if (assistantPanelVisibility[panelId] === visible) return visible;
  assistantPanelVisibility = { ...assistantPanelVisibility, [panelId]: visible };
  persistVisibility(assistantPanelVisibility);
  traceAssistantPanelDock({
    panel: panelId,
    action: resolveAssistantPanelDockAction(visible),
  });
  for (const listener of listeners) listener();
  return visible;
}

export function collapseAssistantPanel(panelId: AssistantPanelDockId): boolean {
  return setAssistantPanelVisible(panelId, false);
}

export function expandAssistantPanel(panelId: AssistantPanelDockId): boolean {
  return setAssistantPanelVisible(panelId, true);
}

export function toggleAssistantPanelVisible(panelId: AssistantPanelDockId): boolean {
  return setAssistantPanelVisible(panelId, !assistantPanelVisibility[panelId]);
}

export function subscribeAssistantPanelVisibility(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Test-only reset. */
export function resetAssistantPanelVisibilityForTests(
  state: AssistantPanelVisibility = DEFAULT_ASSISTANT_PANEL_VISIBILITY
): void {
  assistantPanelVisibility = { ...state };
  const storage = readStorage();
  if (storage) storage.removeItem(ASSISTANT_PANEL_DOCK_STORAGE_KEY);
  for (const listener of listeners) listener();
}
