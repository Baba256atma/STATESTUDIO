import type { ExecutiveBottomWorkspaceHeightMode } from "../workspace/executiveBottomWorkspace";

export type TimelineCompressionMode = "COMPACT" | "STANDARD" | "EXPANDED";

export type TimelineCompressionState = {
  mode: TimelineCompressionMode;
  maxVisibleItems: number;
  showDetails: boolean;
  showDecisionContext: boolean;
};

const logKeys = new Set<string>();

function log(payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = JSON.stringify(payload);
  if (logKeys.has(key)) return;
  logKeys.add(key);
  globalThis.console?.debug?.("[Nexora][TimelineCompression]", payload);
}

export function resolveTimelineCompression(
  heightMode: ExecutiveBottomWorkspaceHeightMode
): TimelineCompressionState {
  const mode: TimelineCompressionMode =
    heightMode === "expanded" || heightMode === "full" ? "EXPANDED" : "COMPACT";

  const state: TimelineCompressionState = {
    mode,
    maxVisibleItems: mode === "EXPANDED" ? 8 : 4,
    showDetails: mode === "EXPANDED",
    showDecisionContext: mode !== "COMPACT",
  };

  log({
    heightMode,
    mode: state.mode,
    maxVisibleItems: state.maxVisibleItems,
    showDetails: state.showDetails,
  });
  return state;
}

export function logTimelineExpand(payload: {
  from: ExecutiveBottomWorkspaceHeightMode;
  to: ExecutiveBottomWorkspaceHeightMode;
}): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.debug?.("[Nexora][TimelineExpand]", payload);
}

export function resetTimelineCompressionRuntimeForTests(): void {
  logKeys.clear();
}
