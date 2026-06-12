/**
 * MRP:12:7 — Assistant support dock runtime diagnostics.
 */

import type { AssistantSupportAccordionPanelId } from "./assistantSupportAccordionContract.ts";
import { ASSISTANT_PANEL_DOCK_DEFINITIONS } from "./assistantPanelDockContract.ts";

let dockMountedLogged = false;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function resolvePanelLabel(panelId: AssistantSupportAccordionPanelId): string {
  return ASSISTANT_PANEL_DOCK_DEFINITIONS[panelId].label;
}

export function traceMrp127AssistantSupportDockMounted(): void {
  if (!isDev() || dockMountedLogged) return;
  dockMountedLogged = true;
  globalThis.console?.log?.("[MRP127Runtime]\nAssistantSupportDock mounted");
}

export function traceMrp127SupportPanelOpened(panelId: AssistantSupportAccordionPanelId): void {
  if (!isDev()) return;
  globalThis.console?.log?.(`[MRP127Runtime]\nSupportPanel opened\npanel=${resolvePanelLabel(panelId)}`);
}

export function traceMrp127SupportPanelSwitched(
  fromPanelId: AssistantSupportAccordionPanelId,
  toPanelId: AssistantSupportAccordionPanelId
): void {
  if (!isDev()) return;
  globalThis.console?.log?.(
    `[MRP127Runtime]\nSupportPanel switched\n${resolvePanelLabel(fromPanelId)} -> ${resolvePanelLabel(toPanelId)}`
  );
}

export function traceMrp127AccordionContractPassed(openPanels: number): void {
  if (!isDev()) return;
  globalThis.console?.log?.(`[MRP127Runtime]\nAccordion contract passed\nopenPanels=${openPanels}`);
}

export function resetMrp127RuntimeDiagnosticsForTests(): void {
  dockMountedLogged = false;
}
