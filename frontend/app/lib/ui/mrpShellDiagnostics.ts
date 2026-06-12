/**
 * MRP shell diagnostics — header chrome, tab rename, collapse authority.
 */

let cleanHeaderLogged = false;
let collapseControlLogged = false;
let tabsLogged = false;
let tabRenameLogged = false;
let collapseRelocatedLogged = false;
let duplicateCollapseRemovedLogged = false;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function traceMrpCleanHeader(): void {
  if (!isDev() || cleanHeaderLogged) return;
  cleanHeaderLogged = true;
  globalThis.console?.log?.("[NexoraMRP]\nheader=clean\nprimaryDecision=removed");
}

export function traceMrpCollapseControlMounted(): void {
  if (!isDev() || collapseControlLogged) return;
  collapseControlLogged = true;
  globalThis.console?.log?.("[NexoraMRP]\ncollapseControl=mounted");
}

export function traceMrpTabsMounted(): void {
  if (!isDev() || tabsLogged) return;
  tabsLogged = true;
  globalThis.console?.log?.("[NexoraMRP]\ntabs=mounted");
}

export function traceMrpTabRenameDashboardToInsight(): void {
  if (!isDev() || tabRenameLogged) return;
  tabRenameLogged = true;
  globalThis.console?.log?.("[NexoraMRP]\ntabRename=dashboard_to_insight");
}

export function traceMrpCollapseControlRelocatedToHeader(): void {
  if (!isDev() || collapseRelocatedLogged) return;
  collapseRelocatedLogged = true;
  globalThis.console?.log?.("[NexoraMRP]\ncollapseControl=relocated_to_header");
}

export function traceMrpDuplicateCollapseControlsRemoved(): void {
  if (!isDev() || duplicateCollapseRemovedLogged) return;
  duplicateCollapseRemovedLogged = true;
  globalThis.console?.log?.("[NexoraMRP]\nduplicateCollapseControls=removed");
}

export function resetMrpShellDiagnosticsForTests(): void {
  cleanHeaderLogged = false;
  collapseControlLogged = false;
  tabsLogged = false;
  tabRenameLogged = false;
  collapseRelocatedLogged = false;
  duplicateCollapseRemovedLogged = false;
}
