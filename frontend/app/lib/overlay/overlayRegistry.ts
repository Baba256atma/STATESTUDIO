import { logOverlayRegistered } from "./overlayInstrumentation";
import type { RegisteredOverlayDefinition, SceneOverlayType } from "./overlayContracts";
import { OVERLAY_LAYER_PRIORITY } from "./overlayContracts";

const registry = new Map<SceneOverlayType, RegisteredOverlayDefinition>();

function registerOverlay(definition: RegisteredOverlayDefinition): void {
  registry.set(definition.type, definition);
  logOverlayRegistered({
    overlayId: definition.type,
    overlayType: definition.type,
    sourceObjects: [],
    targetObjects: [],
    reason: "registry",
  });
}

function registerBuiltInOverlays(): void {
  registerOverlay({
    type: "propagation",
    label: "Propagation",
    description: "Impact spread and signal propagation between connected objects",
    defaultVisible: true,
    priority: OVERLAY_LAYER_PRIORITY.propagation,
  });
  registerOverlay({
    type: "risk_flow",
    label: "Risk Flow",
    description: "High-risk routes and fragility concentration movement",
    defaultVisible: true,
    priority: OVERLAY_LAYER_PRIORITY.risk_flow,
  });
  registerOverlay({
    type: "scenario",
    label: "Scenario",
    description: "Scenario consequences and predicted impact zones",
    defaultVisible: true,
    priority: OVERLAY_LAYER_PRIORITY.scenario,
  });
  registerOverlay({
    type: "dependency",
    label: "Dependencies",
    description: "Operational and cross-team dependency relationships",
    defaultVisible: false,
    priority: OVERLAY_LAYER_PRIORITY.dependency,
  });
}

registerBuiltInOverlays();

export function getRegisteredOverlayDefinition(type: SceneOverlayType): RegisteredOverlayDefinition | undefined {
  return registry.get(type);
}

export function getRegisteredOverlayDefinitions(): RegisteredOverlayDefinition[] {
  return Array.from(registry.values()).sort((a, b) => a.priority - b.priority);
}

/** Test-only reset — re-register built-ins. */
export function resetOverlayRegistryForTests(): void {
  registry.clear();
  registerBuiltInOverlays();
}
