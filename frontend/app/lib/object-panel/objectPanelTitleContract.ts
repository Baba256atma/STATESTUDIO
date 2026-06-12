/**
 * MRP_OBJECT:14:6 — Object Panel explicit identity header contract.
 */

export const OBJECT_PANEL_TITLE_PREFIX = "OBJECT :" as const;
export const OBJECT_PANEL_NO_SELECTION_LABEL = "No Selection" as const;

let loggedTitleSignature: string | null = null;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function formatObjectPanelTitle(objectName: string | null | undefined): string {
  const name = typeof objectName === "string" ? objectName.trim() : "";
  if (!name) {
    return `${OBJECT_PANEL_TITLE_PREFIX} ${OBJECT_PANEL_NO_SELECTION_LABEL}`;
  }
  return `${OBJECT_PANEL_TITLE_PREFIX} ${name}`;
}

export function traceObjectPanelTitleIdentity(objectName: string | null | undefined): void {
  if (!isDev()) return;
  const title = formatObjectPanelTitle(objectName);
  if (loggedTitleSignature === title) return;
  loggedTitleSignature = title;
  globalThis.console?.log?.(`[ObjectPanelTitle] title=${title}`);
}

export function resetObjectPanelTitleContractForTests(): void {
  loggedTitleSignature = null;
}
