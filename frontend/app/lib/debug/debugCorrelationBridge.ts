/**
 * Dev-only: last panel-controller ↔ chat linkage for cross-component debug emission.
 * Updated synchronously when HomeScreen records panel_requested; read by RightPanelHost on host events.
 * Not product state — observe-only.
 */

export type PanelSelfDebugLink = {
  panelCorrelationId: string;
  chatCorrelationId: string | null;
  requestedView: string | null;
  rawSource: string | null;
  ts: number;
};

let lastPanelLink: PanelSelfDebugLink | null = null;

export function registerPanelSelfDebugLink(link: PanelSelfDebugLink): void {
  lastPanelLink = link;
}

export function peekPanelSelfDebugLink(): PanelSelfDebugLink | null {
  return lastPanelLink;
}
