import type { ExecutiveAnchorZone } from "../hud/hudAnchoringRuntime";

export type PanelCollapseState = "collapsed" | "expanded";

export type GovernedPanelId =
  | "sceneInfoHud"
  | "objectInfoHud"
  | "timelineHud"
  | "aiAssistant"
  | "scenarioSuggestions"
  | "scenarioComparison"
  | "sandbox"
  | "diagnostics";

export type PanelGovernanceRecord = {
  panelId: GovernedPanelId;
  visible: boolean;
  collapsed: boolean;
  anchorZone: ExecutiveAnchorZone;
  preferredAnchor?: ExecutiveAnchorZone;
  priority: number;
  title: string;
};

const STORAGE_KEY = "nexora:panel-governance";
type StoredPanelGovernanceValue =
  | PanelCollapseState
  | {
      collapsed?: PanelCollapseState;
      preferredAnchor?: ExecutiveAnchorZone;
    };
const records = new Map<GovernedPanelId, PanelGovernanceRecord>();
const logKeys = new Set<string>();
const listeners = new Set<() => void>();

function notifyPanelGovernanceListenersDeferred(): void {
  if (typeof queueMicrotask === "function") {
    queueMicrotask(() => notifyPanelGovernanceListeners());
    return;
  }
  setTimeout(() => notifyPanelGovernanceListeners(), 0);
}

export function subscribePanelGovernance(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyPanelGovernanceListeners(): void {
  for (const listener of listeners) listener();
}

function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

function devLog(label: string, payload: Record<string, unknown>, key: string): void {
  if (!isDev()) return;
  const logKey = `${label}:${key}`;
  if (logKeys.has(logKey)) return;
  logKeys.add(logKey);
  console.debug(label, payload);
}

function readStoredCollapse(panelId: GovernedPanelId): PanelCollapseState {
  if (typeof window === "undefined") return "expanded";
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<string, StoredPanelGovernanceValue>;
    const value = parsed[panelId];
    if (value === "collapsed" || value === "expanded") return value;
    return value?.collapsed === "collapsed" ? "collapsed" : "expanded";
  } catch {
    return "expanded";
  }
}

function persistCollapse(panelId: GovernedPanelId, state: PanelCollapseState): void {
  if (typeof window === "undefined") return;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<string, StoredPanelGovernanceValue>;
    const previous = parsed[panelId];
    parsed[panelId] = typeof previous === "object" && previous
      ? { ...previous, collapsed: state }
      : { collapsed: state };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // Collapse state is non-critical; default expanded remains valid.
  }
}

function readStoredPreferredAnchor(panelId: GovernedPanelId): ExecutiveAnchorZone | null {
  if (typeof window === "undefined") return null;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<string, StoredPanelGovernanceValue>;
    const value = parsed[panelId];
    return typeof value === "object" && value?.preferredAnchor ? value.preferredAnchor : null;
  } catch {
    return null;
  }
}

function persistPreferredAnchor(panelId: GovernedPanelId, preferredAnchor: ExecutiveAnchorZone): void {
  if (typeof window === "undefined") return;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<string, StoredPanelGovernanceValue>;
    const previous = parsed[panelId];
    parsed[panelId] = typeof previous === "object" && previous
      ? { ...previous, preferredAnchor }
      : { collapsed: previous === "collapsed" ? "collapsed" : "expanded", preferredAnchor };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // Anchor persistence is non-critical; canonical runtime anchors remain valid.
  }
}

export function registerGovernedPanel(record: PanelGovernanceRecord): PanelGovernanceRecord {
  const previous = records.get(record.panelId);
  const next = { ...record };
  records.set(record.panelId, next);
  if (previous?.collapsed !== next.collapsed) {
    notifyPanelGovernanceListenersDeferred();
  }
  devLog("[Nexora][PanelGovernance]", {
    panelId: next.panelId,
    title: next.title,
    visible: next.visible,
    collapsed: next.collapsed,
    anchorZone: next.anchorZone,
    priority: next.priority,
    duplicate: Boolean(previous),
  }, `${next.panelId}:${next.visible}:${next.collapsed}:${next.anchorZone}`);
  return next;
}

export function getPanelCollapseState(panelId: GovernedPanelId): PanelCollapseState {
  return readStoredCollapse(panelId);
}

export function setPanelCollapseState(panelId: GovernedPanelId, state: PanelCollapseState): PanelCollapseState {
  const previousStored = readStoredCollapse(panelId);
  if (previousStored === state) {
    return state;
  }
  persistCollapse(panelId, state);
  const previous = records.get(panelId);
  if (previous) {
    records.set(panelId, { ...previous, collapsed: state === "collapsed" });
  }
  notifyPanelGovernanceListenersDeferred();
  devLog(state === "collapsed" ? "[Nexora][PanelCollapsed]" : "[Nexora][PanelExpanded]", {
    panelId,
    collapsed: state === "collapsed",
  }, `${panelId}:${state}`);
  return state;
}

export function getPreferredPanelAnchor(panelId: GovernedPanelId): ExecutiveAnchorZone | null {
  return readStoredPreferredAnchor(panelId);
}

export function setPreferredPanelAnchor(
  panelId: GovernedPanelId,
  preferredAnchor: ExecutiveAnchorZone
): ExecutiveAnchorZone {
  persistPreferredAnchor(panelId, preferredAnchor);
  const previous = records.get(panelId);
  if (previous) {
    records.set(panelId, { ...previous, preferredAnchor, anchorZone: preferredAnchor });
  }
  devLog("[Nexora][AnchorPersistence]", {
    panelId,
    preferredAnchor,
  }, `${panelId}:${preferredAnchor}`);
  return preferredAnchor;
}

export function getPanelGovernanceSnapshot(): ReadonlyArray<PanelGovernanceRecord> {
  return Object.freeze(Array.from(records.values()));
}

export function resetPanelGovernanceRuntimeForTests(): void {
  records.clear();
  logKeys.clear();
  listeners.clear();
}
