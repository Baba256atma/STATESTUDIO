/**
 * MRP:12:4 — Assistant surface branding diagnostics.
 */

let assistantTitleLogged = false;
let legacyTitleRemovedLogged = false;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function traceAssistantBrandingTitle(): void {
  if (!isDev() || assistantTitleLogged) return;
  assistantTitleLogged = true;
  globalThis.console?.log?.("[NexoraBranding]\nassistantTitle=nexora");
}

export function traceLegacyAssistantTitleRemoved(): void {
  if (!isDev() || legacyTitleRemovedLogged) return;
  legacyTitleRemovedLogged = true;
  globalThis.console?.log?.("[NexoraBranding]\nlegacyAssistantTitleRemoved=true");
}

export function resetAssistantBrandingDiagnosticsForTests(): void {
  assistantTitleLogged = false;
  legacyTitleRemovedLogged = false;
}
