import { EXECUTIVE_TIMELINE_VISIBLE_REGION } from "../hud/timelineVisibleRegionRuntime";
import {
  resolveTimelineDisplayHeight,
  toTimelineDisplayState,
} from "../hud/timelineWidthContract.ts";
import { normalizeTimelineState, resolveTimelineState } from "../timeline/timelineArchitectureContract";
import {
  traceMrp1210TimelineCollapsed,
  traceMrp1210TimelineExpanded,
  resetMrp1210RuntimeDiagnosticsForTests,
} from "../hud/mrp1210RuntimeDiagnostics.ts";
import {
  traceTimelineDisplayState,
  resetTimeline131RuntimeDiagnosticsForTests,
} from "../hud/timeline131RuntimeDiagnostics.ts";

/**
 * ARCHITECTURE CONTRACT:
 * This runtime persists scene-native Timeline presentation state only. It must
 * not become a timeline event store, simulation engine, MRP tab owner, or page
 * router. See docs/nexora-timeline-architecture.md.
 */
export type ExecutiveTimelineCollapseState = "collapsed" | "compact" | "expanded";
export type ExecutiveBottomWorkspaceSurface = "timeline" | "decision-context" | "quick-navigation";
export type ExecutiveBottomWorkspaceHeightMode = ExecutiveTimelineCollapseState | "full";

export type ExecutiveBottomWorkspaceState = {
  collapsed: boolean;
  expanded: boolean;
  activeSurface: ExecutiveBottomWorkspaceSurface;
  selectedTimelineEvent: string | null;
  heightMode: ExecutiveBottomWorkspaceHeightMode;
};

const STORAGE_KEY = "nexora:executive-bottom-workspace";
export const EXECUTIVE_TIMELINE_VISIBLE_ZONE = Object.freeze({
  bottomOffset: EXECUTIVE_TIMELINE_VISIBLE_REGION.bottomOffset,
  compactHeight: EXECUTIVE_TIMELINE_VISIBLE_REGION.compactHeight,
  expandedHeight: EXECUTIVE_TIMELINE_VISIBLE_REGION.expandedHeight,
  fullHeight: EXECUTIVE_TIMELINE_VISIBLE_REGION.fullHeight,
});

const DEFAULT_BOTTOM_WORKSPACE_STATE: ExecutiveBottomWorkspaceState = Object.freeze({
  collapsed: false,
  expanded: true,
  activeSurface: "timeline",
  selectedTimelineEvent: null,
  heightMode: "expanded",
});

let bottomWorkspaceState: ExecutiveBottomWorkspaceState = { ...DEFAULT_BOTTOM_WORKSPACE_STATE };
const logKeys = new Set<string>();
const listeners = new Set<() => void>();

function notifyListeners(): void {
  for (const listener of listeners) listener();
}

export function subscribeBottomWorkspaceState(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function isTimelineVisuallyExpanded(mode: ExecutiveBottomWorkspaceHeightMode): boolean {
  return toTimelineDisplayState(mode) === "expanded";
}

export function normalizeBottomWorkspaceHeightMode(
  mode: ExecutiveBottomWorkspaceHeightMode | undefined
): ExecutiveBottomWorkspaceHeightMode {
  if (mode === "collapsed" || mode === "compact") return "compact";
  if (mode === "expanded" || mode === "full") return "expanded";
  return "expanded";
}

function traceTimelinePresentationMode(mode: ExecutiveBottomWorkspaceHeightMode): void {
  const displayState = toTimelineDisplayState(mode);
  traceTimelineDisplayState(displayState);
  if (displayState === "compact") {
    traceMrp1210TimelineCollapsed();
    return;
  }
  traceMrp1210TimelineExpanded();
}

function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

function log(label: string, payload: Record<string, unknown>): void {
  if (!isDev()) return;
  const key = `${label}:${JSON.stringify(payload)}`;
  if (logKeys.has(key)) return;
  logKeys.add(key);
  console.debug(label, payload);
}

function persistState(state: ExecutiveBottomWorkspaceState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Persistence is best-effort; layout remains deterministic without storage.
  }
}

export function getBottomWorkspaceState(): ExecutiveBottomWorkspaceState {
  return bottomWorkspaceState;
}

export function hydrateBottomWorkspaceState(): ExecutiveBottomWorkspaceState {
  if (typeof window === "undefined") return bottomWorkspaceState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return bottomWorkspaceState;
    const parsed = JSON.parse(raw) as Partial<ExecutiveBottomWorkspaceState>;
    bottomWorkspaceState = {
      ...DEFAULT_BOTTOM_WORKSPACE_STATE,
      ...parsed,
      activeSurface: isBottomWorkspaceSurface(parsed.activeSurface) ? parsed.activeSurface : "timeline",
      selectedTimelineEvent:
        typeof parsed.selectedTimelineEvent === "string" ? parsed.selectedTimelineEvent : null,
      heightMode: normalizeBottomWorkspaceHeightMode(
        isBottomWorkspaceHeightMode(parsed.heightMode) ? parsed.heightMode : "expanded"
      ),
    };
    bottomWorkspaceState = {
      ...bottomWorkspaceState,
      collapsed: bottomWorkspaceState.heightMode === "compact",
      expanded: isTimelineVisuallyExpanded(bottomWorkspaceState.heightMode),
    };
  } catch {
    bottomWorkspaceState = { ...DEFAULT_BOTTOM_WORKSPACE_STATE };
  }
  return bottomWorkspaceState;
}

export function setBottomWorkspaceState(
  patch: Partial<ExecutiveBottomWorkspaceState>
): ExecutiveBottomWorkspaceState {
  const previousHeightMode = bottomWorkspaceState.heightMode;
  if (patch.heightMode != null) {
    normalizeTimelineState(
      resolveTimelineState({
        heightMode: patch.heightMode,
        collapsed: patch.heightMode === "compact" || patch.heightMode === "collapsed",
      })
    );
  }
  bottomWorkspaceState = {
    ...bottomWorkspaceState,
    ...patch,
  };
  if (patch.heightMode != null) {
    bottomWorkspaceState = {
      ...bottomWorkspaceState,
      heightMode: normalizeBottomWorkspaceHeightMode(patch.heightMode),
      collapsed: bottomWorkspaceState.heightMode === "compact",
      expanded: isTimelineVisuallyExpanded(bottomWorkspaceState.heightMode),
    };
  }
  persistState(bottomWorkspaceState);
  if (patch.heightMode != null && previousHeightMode !== bottomWorkspaceState.heightMode) {
    traceTimelinePresentationMode(bottomWorkspaceState.heightMode);
  }
  notifyListeners();
  logBottomWorkspaceMetrics({
    mode: bottomWorkspaceState.heightMode,
    height: heightForBottomWorkspaceMode(bottomWorkspaceState.heightMode),
    eventCount: 0,
    activeSurface: bottomWorkspaceState.activeSurface,
  });
  return bottomWorkspaceState;
}

export function toggleBottomWorkspace(): ExecutiveBottomWorkspaceState {
  const displayState = toTimelineDisplayState(bottomWorkspaceState.heightMode);
  const nextMode: ExecutiveBottomWorkspaceHeightMode =
    displayState === "compact" ? "expanded" : "compact";
  return setBottomWorkspaceState({
    collapsed: nextMode === "compact",
    expanded: nextMode === "expanded",
    heightMode: nextMode,
  });
}

export function selectBottomWorkspaceSurface(
  activeSurface: ExecutiveBottomWorkspaceSurface
): ExecutiveBottomWorkspaceState {
  return setBottomWorkspaceState({ activeSurface });
}

export function selectBottomWorkspaceTimelineEvent(eventId: string | null): ExecutiveBottomWorkspaceState {
  return setBottomWorkspaceState({ selectedTimelineEvent: eventId });
}

export function heightForBottomWorkspaceMode(mode: ExecutiveBottomWorkspaceHeightMode): number {
  return resolveTimelineDisplayHeight(toTimelineDisplayState(mode));
}

export function logTimelineVisibleZone(payload: { bottomOffset: number; height: number; mode: ExecutiveBottomWorkspaceHeightMode }): void {
  log("[Nexora][TimelineVisibleZone]", payload);
}

export function logBottomWorkspaceMetrics(payload: {
  mode: ExecutiveBottomWorkspaceHeightMode;
  height: number;
  eventCount: number;
  activeSurface: ExecutiveBottomWorkspaceSurface;
}): void {
  log("[Nexora][BottomWorkspace]", payload);
  log("[Nexora][TimelineCompression]", payload);
  log("[Nexora][WorkspaceHeight]", payload);
  log("[Nexora][TimelineMode]", payload);
}

function isBottomWorkspaceSurface(value: unknown): value is ExecutiveBottomWorkspaceSurface {
  return value === "timeline" || value === "decision-context" || value === "quick-navigation";
}

function isBottomWorkspaceHeightMode(value: unknown): value is ExecutiveBottomWorkspaceHeightMode {
  return value === "collapsed" || value === "compact" || value === "expanded" || value === "full";
}

export function resetExecutiveBottomWorkspaceForTests(): void {
  bottomWorkspaceState = { ...DEFAULT_BOTTOM_WORKSPACE_STATE };
  logKeys.clear();
  resetMrp1210RuntimeDiagnosticsForTests();
  resetTimeline131RuntimeDiagnosticsForTests();
}
