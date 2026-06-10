/**
 * MRP:1:1 — Clean Main Right Panel state contract.
 *
 * Canonical tab state lives in NexoraWorkspaceState.activeMRPTab.
 * Canonical dashboard mode lives in NexoraWorkspaceState.dashboardMode.
 * Legacy rightPanelState.view remains a compatibility mirror only.
 */

import {
  MAIN_RIGHT_PANEL_TABS,
  normalizeMainRightPanelTab,
  type MainRightPanelTab,
} from "./mainRightPanelContract";
import {
  dashboardModeLabel,
  normalizeDashboardMode,
  type DashboardMode,
} from "../dashboard/dashboardModeRuntimeContract.ts";

export type { DashboardMode, MainRightPanelTab };

export type MainRightPanelPresentationState = Readonly<{
  activeTab: MainRightPanelTab;
  dashboardMode: DashboardMode;
}>;

export type MainRightPanelTabChange = Readonly<{
  fromTab: MainRightPanelTab;
  toTab: MainRightPanelTab;
  source: string;
}>;

const loggedTabChanges = new Set<string>();
const loggedBrakes = new Set<string>();

export function resolveMainRightPanelPresentation(input: {
  activeTab?: unknown;
  dashboardMode?: unknown;
}): MainRightPanelPresentationState {
  return Object.freeze({
    activeTab: normalizeMainRightPanelTab(input.activeTab ?? "dashboard"),
    dashboardMode: normalizeDashboardMode(input.dashboardMode ?? "overview", { warn: false }),
  });
}

export function isValidMainRightPanelTabTransition(
  fromTab: MainRightPanelTab,
  toTab: MainRightPanelTab
): boolean {
  if (fromTab === toTab) return true;
  return isMainRightPanelTab(fromTab) && isMainRightPanelTab(toTab);
}

function isMainRightPanelTab(value: unknown): value is MainRightPanelTab {
  return typeof value === "string" && (MAIN_RIGHT_PANEL_TABS as readonly string[]).includes(value);
}

export function warnMainRightPanelStateBrake(
  message: string,
  detail: Readonly<Record<string, unknown>> = {}
): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${message}:${JSON.stringify(detail)}`;
  if (loggedBrakes.has(key)) return;
  loggedBrakes.add(key);
  globalThis.console?.warn?.("[MRP][Brake]", { message, ...detail });
}

export function logMainRightPanelTabChange(change: MainRightPanelTabChange): void {
  if (process.env.NODE_ENV === "production") return;
  if (!isValidMainRightPanelTabTransition(change.fromTab, change.toTab)) {
    warnMainRightPanelStateBrake("Invalid tab transition blocked.", change);
    return;
  }
  const key = `${change.fromTab}->${change.toTab}:${change.source}`;
  if (loggedTabChanges.has(key)) return;
  loggedTabChanges.add(key);
  globalThis.console?.debug?.("[Nexora][MRP][TabChange]", change);
}

export { dashboardModeLabel };

export function resetMainRightPanelStateContractForTests(): void {
  loggedTabChanges.clear();
  loggedBrakes.clear();
}
