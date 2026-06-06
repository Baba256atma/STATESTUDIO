import { EXECUTIVE_TIMELINE_VISIBLE_REGION } from "../hud/timelineVisibleRegionRuntime";
import { normalizeTimelineState, resolveTimelineState } from "../timeline/timelineArchitectureContract";

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
  expanded: false,
  activeSurface: "timeline",
  selectedTimelineEvent: null,
  heightMode: "compact",
});

let bottomWorkspaceState: ExecutiveBottomWorkspaceState = { ...DEFAULT_BOTTOM_WORKSPACE_STATE };
const logKeys = new Set<string>();

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
      heightMode: isBottomWorkspaceHeightMode(parsed.heightMode) ? parsed.heightMode : "compact",
    };
  } catch {
    bottomWorkspaceState = { ...DEFAULT_BOTTOM_WORKSPACE_STATE };
  }
  return bottomWorkspaceState;
}

export function setBottomWorkspaceState(
  patch: Partial<ExecutiveBottomWorkspaceState>
): ExecutiveBottomWorkspaceState {
  if (patch.heightMode != null) {
    normalizeTimelineState(
      resolveTimelineState({
        heightMode: patch.heightMode,
        collapsed: patch.heightMode === "collapsed",
      })
    );
  }
  bottomWorkspaceState = {
    ...bottomWorkspaceState,
    ...patch,
  };
  persistState(bottomWorkspaceState);
  logBottomWorkspaceMetrics({
    mode: bottomWorkspaceState.heightMode,
    height: heightForBottomWorkspaceMode(bottomWorkspaceState.heightMode),
    eventCount: 0,
    activeSurface: bottomWorkspaceState.activeSurface,
  });
  return bottomWorkspaceState;
}

export function toggleBottomWorkspace(): ExecutiveBottomWorkspaceState {
  const nextMode: ExecutiveBottomWorkspaceHeightMode =
    bottomWorkspaceState.heightMode === "collapsed"
      ? "compact"
      : bottomWorkspaceState.heightMode === "compact"
        ? "expanded"
        : "collapsed";
  return setBottomWorkspaceState({
    collapsed: nextMode === "collapsed",
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
  if (mode === "collapsed") return 32;
  if (mode === "compact") return EXECUTIVE_TIMELINE_VISIBLE_ZONE.compactHeight;
  if (mode === "expanded") return EXECUTIVE_TIMELINE_VISIBLE_ZONE.expandedHeight;
  return EXECUTIVE_TIMELINE_VISIBLE_ZONE.fullHeight;
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
}
