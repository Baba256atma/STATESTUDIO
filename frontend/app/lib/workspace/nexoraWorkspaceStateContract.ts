import {
  normalizeDashboardContext,
  normalizeMainRightPanelTab,
  type DashboardContext,
  type MainRightPanelTab,
} from "../ui/mainRightPanelContract";
import {
  DEFAULT_NEXORA_LEFT_NAV_MODE,
  getNexoraLeftNavItem,
  resolveNexoraLeftNavMode,
  type NexoraLeftNavMode,
} from "../ui/nexoraLeftNavContract";
import {
  normalizeObjectCatalogState,
  normalizeScenePanelState,
  type ObjectCatalogState,
  type ScenePanelState,
} from "../scene/scenePanelContract";
import {
  normalizeObjectPanelState,
  resolveObjectPanelState,
  type ObjectPanelState,
} from "../object-panel/objectPanelContract";
import {
  normalizeTimelineState,
  type TimelineState,
} from "../timeline/timelineArchitectureContract";

export interface NexoraWorkspaceState {
  activeLeftNavMode: NexoraLeftNavMode;
  activeMRPTab: MainRightPanelTab;
  dashboardContext: DashboardContext;
  scenePanelState: ScenePanelState;
  objectPanelState: ObjectPanelState;
  selectedObjectId: string | null;
  timelineState: TimelineState;
  objectCatalogState: ObjectCatalogState;
}

export const DEFAULT_NEXORA_WORKSPACE_STATE: NexoraWorkspaceState = Object.freeze({
  activeLeftNavMode: DEFAULT_NEXORA_LEFT_NAV_MODE,
  activeMRPTab: "dashboard",
  dashboardContext: "overview",
  scenePanelState: "expanded",
  objectPanelState: "empty",
  selectedObjectId: null,
  timelineState: "collapsed",
  objectCatalogState: "closed",
});

export type NexoraWorkspaceAction =
  | { type: "setLeftNavMode"; mode: unknown }
  | { type: "setMRPTab"; tab: unknown }
  | { type: "setDashboardContext"; context: unknown }
  | { type: "setScenePanelState"; state: unknown }
  | { type: "selectObject"; objectId: unknown; dashboardContext?: unknown }
  | { type: "clearSelection" }
  | { type: "setTimelineState"; state: unknown; activateContext?: boolean }
  | { type: "setObjectCatalogState"; state: unknown };

const workspaceStateWarnings = new Set<string>();

function warnWorkspaceStateBrake(message: string, payload?: Readonly<Record<string, unknown>>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${message}:${JSON.stringify(payload ?? {})}`;
  if (workspaceStateWarnings.has(key)) return;
  workspaceStateWarnings.add(key);
  console.warn(message, payload ?? {});
}

export function normalizeSelectedObjectIdForWorkspace(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value !== "string") {
    warnWorkspaceStateBrake("[WorkspaceState][Brake] Invalid selected object id.", {
      selectedObjectId: value,
      fallback: null,
    });
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed;
}

export function createDefaultNexoraWorkspaceState(): NexoraWorkspaceState {
  return { ...DEFAULT_NEXORA_WORKSPACE_STATE };
}

export function normalizeNexoraWorkspaceState(value: Partial<NexoraWorkspaceState> | null | undefined): NexoraWorkspaceState {
  const selectedObjectId = normalizeSelectedObjectIdForWorkspace(value?.selectedObjectId);
  return {
    activeLeftNavMode: resolveNexoraLeftNavMode(value?.activeLeftNavMode, { warn: false }),
    activeMRPTab: normalizeMainRightPanelTab(value?.activeMRPTab ?? "dashboard", { warn: false }),
    dashboardContext: normalizeDashboardContext(value?.dashboardContext ?? "overview", { warn: false }),
    scenePanelState: normalizeScenePanelState(value?.scenePanelState ?? "expanded", { warn: false }),
    objectPanelState: normalizeObjectPanelState(
      value?.objectPanelState ?? resolveObjectPanelState({ selectedObjectId })
    ),
    selectedObjectId,
    timelineState: normalizeTimelineState(value?.timelineState ?? "collapsed"),
    objectCatalogState: normalizeObjectCatalogState(value?.objectCatalogState ?? "closed", { warn: false }),
  };
}

export function reduceNexoraWorkspaceState(
  state: NexoraWorkspaceState,
  action: NexoraWorkspaceAction
): NexoraWorkspaceState {
  switch (action.type) {
    case "setLeftNavMode": {
      const activeLeftNavMode = resolveNexoraLeftNavMode(action.mode);
      const item = getNexoraLeftNavItem(activeLeftNavMode);
      return {
        ...state,
        activeLeftNavMode,
        activeMRPTab: "dashboard",
        dashboardContext: item.dashboardContext,
        timelineState: item.dashboardContext === "timeline" ? "expanded" : state.timelineState,
      };
    }
    case "setMRPTab": {
      const activeMRPTab = normalizeMainRightPanelTab(action.tab);
      return {
        ...state,
        activeMRPTab,
      };
    }
    case "setDashboardContext":
      return {
        ...state,
        activeMRPTab: "dashboard",
        dashboardContext: normalizeDashboardContext(action.context),
      };
    case "setScenePanelState":
      return {
        ...state,
        scenePanelState: normalizeScenePanelState(action.state),
      };
    case "selectObject": {
      const selectedObjectId = normalizeSelectedObjectIdForWorkspace(action.objectId);
      const nextDashboardContext =
        action.dashboardContext == null
          ? state.dashboardContext
          : normalizeDashboardContext(action.dashboardContext);
      return {
        ...state,
        selectedObjectId,
        objectPanelState: resolveObjectPanelState({ selectedObjectId }),
        dashboardContext: nextDashboardContext,
      };
    }
    case "clearSelection":
      return {
        ...state,
        selectedObjectId: null,
        objectPanelState: "empty",
      };
    case "setTimelineState": {
      const timelineState = normalizeTimelineState(
        typeof action.state === "string" ? action.state : null
      );
      return {
        ...state,
        activeMRPTab: action.activateContext === false ? state.activeMRPTab : "dashboard",
        dashboardContext: action.activateContext === false ? state.dashboardContext : "timeline",
        timelineState,
      };
    }
    case "setObjectCatalogState":
      return {
        ...state,
        objectCatalogState: normalizeObjectCatalogState(action.state),
      };
    default:
      warnWorkspaceStateBrake("[WorkspaceState][Brake] Possible synchronization loop detected.", {
        action,
      });
      return state;
  }
}

export function warnInvalidWorkspaceStateField(
  field:
    | "left_nav_mode"
    | "mrp_tab"
    | "dashboard_context"
    | "selected_object_id",
  value: unknown
): void {
  const labels = {
    left_nav_mode: "[WorkspaceState][Brake] Invalid left nav mode.",
    mrp_tab: "[WorkspaceState][Brake] Invalid MRP tab.",
    dashboard_context: "[WorkspaceState][Brake] Invalid dashboard context.",
    selected_object_id: "[WorkspaceState][Brake] Invalid selected object id.",
  } as const;
  warnWorkspaceStateBrake(labels[field], { value: value ?? null });
}

export function warnDuplicateWorkspaceStateSourceDetected(sources: readonly string[]): void {
  const normalized = sources.map((source) => source.trim()).filter(Boolean);
  if (normalized.length <= 1) return;
  warnWorkspaceStateBrake("[WorkspaceState][Brake] Duplicate workspace state source detected.", {
    sources: normalized,
    canonical: "NexoraWorkspaceState",
  });
}

export function warnPossibleWorkspaceSynchronizationLoop(detail?: Readonly<Record<string, unknown>>): void {
  warnWorkspaceStateBrake("[WorkspaceState][Brake] Possible synchronization loop detected.", detail);
}
