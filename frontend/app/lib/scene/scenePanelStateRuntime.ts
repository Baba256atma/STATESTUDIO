/**
 * MRP_HUD:13:4A — Scene Panel collapse state render-safety diagnostics.
 */

let lastCollapseWriteSignature: string | null = null;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function traceScenePanelCollapseWrite(input: {
  collapsed: boolean;
  source: "event" | "effect";
  skipped?: boolean;
}): void {
  if (!isDev()) return;
  const signature = `${input.collapsed}:${input.source}:${input.skipped === true}`;
  if (input.skipped) {
    if (lastCollapseWriteSignature === `skip:${signature}`) return;
    lastCollapseWriteSignature = `skip:${signature}`;
    globalThis.console?.log?.("[NexoraScenePanelState] collapseWrite=skipped_duplicate");
    return;
  }
  if (lastCollapseWriteSignature === signature) return;
  lastCollapseWriteSignature = signature;
  globalThis.console?.log?.("[NexoraScenePanelState] collapseWrite=event_safe");
}

export function resetScenePanelStateDiagnosticsForTests(): void {
  lastCollapseWriteSignature = null;
}
