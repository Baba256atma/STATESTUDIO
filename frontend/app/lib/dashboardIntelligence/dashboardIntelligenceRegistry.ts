/**
 * INT-1 — Dashboard Intelligence registry.
 * Panel registration, routing metadata, runtime version, and diagnostics state.
 */

import type {
  DashboardIntelligenceEngineId,
  DashboardIntelligencePanelId,
  DashboardIntelligencePanelRegistration,
  DashboardRuntimeStatus,
} from "./dashboardIntelligenceContract.ts";
import {
  DASHBOARD_INTELLIGENCE_FOUNDATION_VERSION,
  DEFAULT_DASHBOARD_INTELLIGENCE_PANEL_REGISTRATIONS,
} from "./dashboardIntelligenceContract.ts";

export type DashboardIntelligenceRegistryState = Readonly<{
  contractVersion: typeof DASHBOARD_INTELLIGENCE_FOUNDATION_VERSION;
  runtimeStatus: DashboardRuntimeStatus;
  version: number;
  panelCount: number;
  registeredPanels: readonly DashboardIntelligencePanelRegistration[];
}>;

let registryVersion = 0;
let runtimeStatus: DashboardRuntimeStatus = "idle";
const panelRegistry = new Map<
  DashboardIntelligencePanelId,
  DashboardIntelligencePanelRegistration
>();

function seedDefaultPanels(): void {
  if (panelRegistry.size > 0) return;
  for (const registration of DEFAULT_DASHBOARD_INTELLIGENCE_PANEL_REGISTRATIONS) {
    panelRegistry.set(registration.panel, registration);
  }
  registryVersion += 1;
}

export function registerDashboardIntelligencePanel(
  registration: DashboardIntelligencePanelRegistration
): DashboardIntelligencePanelRegistration {
  seedDefaultPanels();
  panelRegistry.set(registration.panel, Object.freeze({ ...registration }));
  registryVersion += 1;
  return panelRegistry.get(registration.panel)!;
}

export function unregisterDashboardIntelligencePanel(
  panel: DashboardIntelligencePanelId
): boolean {
  seedDefaultPanels();
  const removed = panelRegistry.delete(panel);
  if (removed) registryVersion += 1;
  return removed;
}

export function getDashboardIntelligencePanelRegistration(
  panel: DashboardIntelligencePanelId
): DashboardIntelligencePanelRegistration | null {
  seedDefaultPanels();
  return panelRegistry.get(panel) ?? null;
}

export function getDashboardIntelligencePanelRegistrations(): readonly DashboardIntelligencePanelRegistration[] {
  seedDefaultPanels();
  return Object.freeze(
    [...panelRegistry.values()].sort((left, right) => left.title.localeCompare(right.title))
  );
}

export function resolveDashboardIntelligenceEngineId(
  panel: DashboardIntelligencePanelId
): DashboardIntelligenceEngineId | null {
  return getDashboardIntelligencePanelRegistration(panel)?.engineId ?? null;
}

export function setDashboardIntelligenceRuntimeStatus(status: DashboardRuntimeStatus): void {
  runtimeStatus = status;
}

export function getDashboardIntelligenceRegistryVersion(): number {
  seedDefaultPanels();
  return registryVersion;
}

export function getDashboardIntelligenceRegistryState(): DashboardIntelligenceRegistryState {
  seedDefaultPanels();
  return Object.freeze({
    contractVersion: DASHBOARD_INTELLIGENCE_FOUNDATION_VERSION,
    runtimeStatus,
    version: registryVersion,
    panelCount: panelRegistry.size,
    registeredPanels: getDashboardIntelligencePanelRegistrations(),
  });
}

export function resetDashboardIntelligenceRegistryForTests(): void {
  panelRegistry.clear();
  registryVersion = 0;
  runtimeStatus = "idle";
  seedDefaultPanels();
}
