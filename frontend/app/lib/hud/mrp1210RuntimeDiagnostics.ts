/**
 * MRP:12:10 — Timeline collapse / expand runtime diagnostics.
 */

let lastTrace: "collapsed" | "expanded" | null = null;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function traceMrp1210TimelineCollapsed(): void {
  if (!isDev() || lastTrace === "collapsed") return;
  lastTrace = "collapsed";
  globalThis.console?.log?.("[MRP1210Runtime]\nTimelineCollapsed");
}

export function traceMrp1210TimelineExpanded(): void {
  if (!isDev() || lastTrace === "expanded") return;
  lastTrace = "expanded";
  globalThis.console?.log?.("[MRP1210Runtime]\nTimelineExpanded");
}

export function resetMrp1210RuntimeDiagnosticsForTests(): void {
  lastTrace = null;
}
