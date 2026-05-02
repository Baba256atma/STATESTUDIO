import {
  INTENT_PANEL_REGISTRY,
  type NexoraIntent,
  type PanelTarget,
} from "./intentPanelRegistry";

export function resolveIntentToPanel(intent: NexoraIntent): PanelTarget {
  const target = INTENT_PANEL_REGISTRY[intent];
  if (!target) {
    if (process.env.NODE_ENV !== "production") {
      globalThis.console?.warn?.("[Nexora][IntentMissing]", intent);
    }
    return INTENT_PANEL_REGISTRY.unknown_intent;
  }
  return target;
}
