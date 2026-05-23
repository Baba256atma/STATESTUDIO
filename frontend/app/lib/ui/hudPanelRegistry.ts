import { logHudPanelRegistered } from "./hudPreferencesInstrumentation";
import type { HudDockPosition, HudPanelDefinition, HudPanelId, HudPreferences, HudSizeMode, HudVisibilityState } from "./hudPreferencesTypes";

const registry = new Map<HudPanelId, HudPanelDefinition>();

/** Future HUD registration — new panels gain visibility/size/dock/persistence automatically. */
export function registerHudPanel(definition: HudPanelDefinition): void {
  registry.set(definition.id, definition);
  logHudPanelRegistered(definition.id);
}

export function getRegisteredHudPanels(): HudPanelDefinition[] {
  return Array.from(registry.values());
}

export function getHudPanelDefinition(id: HudPanelId): HudPanelDefinition | undefined {
  return registry.get(id);
}

export function getHudPanelDefinitionOrThrow(id: HudPanelId): HudPanelDefinition {
  const def = registry.get(id);
  if (!def) throw new Error(`HUD panel not registered: ${id}`);
  return def;
}

export function createDefaultHudPreferences(): HudPreferences {
  const visibility: Partial<Record<HudPanelId, HudVisibilityState>> = {};
  const size: Partial<Record<HudPanelId, HudSizeMode>> = {};
  const dock: Partial<Record<HudPanelId, HudDockPosition>> = {};
  for (const panel of registry.values()) {
    visibility[panel.id] = panel.defaultVisibility;
    size[panel.id] = panel.defaultSize;
    dock[panel.id] = panel.defaultDock;
  }
  return { visibility, size, dock };
}

function registerBuiltInHudPanels(): void {
  const scenePanel = (id: HudPanelId, label: string, shortLabel: string, defaultDock: HudDockPosition, allowedDocks: HudDockPosition[]) =>
    registerHudPanel({
      id,
      label,
      shortLabel,
      category: "scene",
      defaultVisibility: "visible",
      defaultSize: "normal",
      defaultDock,
      allowedDocks,
      customizable: { visibility: true, size: true, dock: true },
    });

  scenePanel("sceneInfoHud", "Scene Info", "Scene", "left", ["left", "top"]);
  scenePanel("objectInfoHud", "Object Info", "Object", "right", ["left", "right", "bottom"]);
  scenePanel("timelineHud", "Timeline", "Time", "bottom", ["top", "bottom"]);
  scenePanel("quickActionsDock", "Quick Actions", "Actions", "bottom", ["top", "bottom"]);
  scenePanel("executiveStatusHud", "Executive Status", "Status", "right", ["left", "right", "top"]);

  registerHudPanel({
    id: "commandBar",
    label: "Executive Status Bar",
    shortLabel: "Status",
    category: "chrome",
    defaultVisibility: "visible",
    defaultSize: "normal",
    defaultDock: "top",
    allowedDocks: ["top"],
    customizable: { visibility: true, size: false, dock: false },
  });

  registerHudPanel({
    id: "aiAssistant",
    label: "AI Assistant",
    shortLabel: "AI",
    category: "rail",
    defaultVisibility: "visible",
    defaultSize: "normal",
    defaultDock: "right",
    allowedDocks: ["left", "right"],
    customizable: { visibility: true, size: true, dock: true },
  });

  registerHudPanel({
    id: "scenarioSuggestions",
    label: "Scenario Suggestions",
    shortLabel: "Scenarios",
    category: "rail",
    defaultVisibility: "visible",
    defaultSize: "normal",
    defaultDock: "right",
    allowedDocks: ["left", "right"],
    customizable: { visibility: true, size: true, dock: true },
  });

  registerHudPanel({
    id: "scenarioComparison",
    label: "Scenario Comparison",
    shortLabel: "Compare",
    category: "rail",
    defaultVisibility: "visible",
    defaultSize: "normal",
    defaultDock: "right",
    allowedDocks: ["left", "right"],
    customizable: { visibility: true, size: true, dock: true },
  });
}

registerBuiltInHudPanels();
