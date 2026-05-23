import {
  DEFAULT_OVERLAY_VISIBILITY,
  type OverlayActivationReason,
  type OverlayRuntimeVisibility,
  type SceneOverlay,
  type SceneOverlayType,
} from "./overlayContracts";
import {
  logOverlayActivated,
  logOverlayRemoved,
  logOverlayRuntimeSnapshotCreated,
  logOverlayRuntimeSubscriberNotify,
  logOverlayRuntimeVisibilityChanged,
  logOverlayVisibilityChanged,
} from "./overlayInstrumentation";

const OVERLAY_VISIBILITY_STORAGE_KEY = "nx-overlay-visibility";

const SERVER_OVERLAY_VISIBILITY = Object.freeze({
  propagation: DEFAULT_OVERLAY_VISIBILITY.propagation,
  risk_flow: DEFAULT_OVERLAY_VISIBILITY.risk_flow,
  scenario: DEFAULT_OVERLAY_VISIBILITY.scenario,
  dependency: DEFAULT_OVERLAY_VISIBILITY.dependency,
}) as OverlayRuntimeVisibility;

function createFrozenVisibilitySnapshot(state: OverlayRuntimeVisibility): OverlayRuntimeVisibility {
  return Object.freeze({
    propagation: state.propagation,
    risk_flow: state.risk_flow,
    scenario: state.scenario,
    dependency: state.dependency,
  });
}

function visibilityValuesEqual(a: OverlayRuntimeVisibility, b: OverlayRuntimeVisibility): boolean {
  return (
    a.propagation === b.propagation &&
    a.risk_flow === b.risk_flow &&
    a.scenario === b.scenario &&
    a.dependency === b.dependency
  );
}

let visibility: OverlayRuntimeVisibility = { ...DEFAULT_OVERLAY_VISIBILITY };
let cachedVisibilitySnapshot: OverlayRuntimeVisibility = createFrozenVisibilitySnapshot(visibility);
const activeOverlays = new Map<string, SceneOverlay>();
const listeners = new Set<() => void>();

function notifyVisibilitySubscribers(): void {
  if (listeners.size === 0) return;
  logOverlayRuntimeSubscriberNotify({ listenerCount: listeners.size });
  listeners.forEach((listener) => listener());
}

function commitVisibilitySnapshot(): void {
  const nextSnapshot = createFrozenVisibilitySnapshot(visibility);
  if (Object.is(cachedVisibilitySnapshot, nextSnapshot)) {
    return;
  }
  if (visibilityValuesEqual(cachedVisibilitySnapshot, nextSnapshot)) {
    return;
  }

  cachedVisibilitySnapshot = nextSnapshot;
  logOverlayRuntimeSnapshotCreated({
    propagation: nextSnapshot.propagation,
    risk_flow: nextSnapshot.risk_flow,
    scenario: nextSnapshot.scenario,
    dependency: nextSnapshot.dependency,
  });
  logOverlayRuntimeVisibilityChanged({
    propagation: nextSnapshot.propagation,
    risk_flow: nextSnapshot.risk_flow,
    scenario: nextSnapshot.scenario,
    dependency: nextSnapshot.dependency,
  });
  notifyVisibilitySubscribers();
}

export function subscribeOverlayRuntime(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getOverlayRuntimeVisibility(): OverlayRuntimeVisibility {
  return cachedVisibilitySnapshot;
}

export function getOverlayRuntimeServerVisibility(): OverlayRuntimeVisibility {
  return SERVER_OVERLAY_VISIBILITY;
}

export function isOverlayTypeVisible(type: SceneOverlayType): boolean {
  return visibility[type] !== false;
}

export function setOverlayTypeVisibility(
  type: SceneOverlayType,
  visible: boolean,
  reason: OverlayActivationReason | "user" = "manual"
): void {
  if (visibility[type] === visible) return;
  visibility = { ...visibility, [type]: visible };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(OVERLAY_VISIBILITY_STORAGE_KEY, JSON.stringify(visibility));
    } catch {
      // Ignore storage failures.
    }
  }
  logOverlayVisibilityChanged({ overlayType: type, visible, reason });
  commitVisibilitySnapshot();
}

export function hydrateOverlayVisibilityFromStorage(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(OVERLAY_VISIBILITY_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Partial<OverlayRuntimeVisibility>;
    const nextVisibility: OverlayRuntimeVisibility = {
      propagation: parsed.propagation ?? DEFAULT_OVERLAY_VISIBILITY.propagation,
      risk_flow: parsed.risk_flow ?? DEFAULT_OVERLAY_VISIBILITY.risk_flow,
      scenario: parsed.scenario ?? DEFAULT_OVERLAY_VISIBILITY.scenario,
      dependency: parsed.dependency ?? DEFAULT_OVERLAY_VISIBILITY.dependency,
    };
    if (visibilityValuesEqual(visibility, nextVisibility)) return;
    visibility = nextVisibility;
    commitVisibilitySnapshot();
  } catch {
    if (visibilityValuesEqual(visibility, DEFAULT_OVERLAY_VISIBILITY)) return;
    visibility = { ...DEFAULT_OVERLAY_VISIBILITY };
    commitVisibilitySnapshot();
  }
}

export function registerSceneOverlay(overlay: SceneOverlay, reason: OverlayActivationReason): void {
  const existing = activeOverlays.get(overlay.id);
  activeOverlays.set(overlay.id, overlay);
  if (!existing) {
    logOverlayActivated({
      overlayId: overlay.id,
      overlayType: overlay.type,
      sourceObjects: overlay.sourceIds,
      targetObjects: overlay.targetIds,
      reason,
    });
  }
}

export function removeSceneOverlay(overlayId: string, reason: OverlayActivationReason): void {
  const existing = activeOverlays.get(overlayId);
  if (!existing) return;
  activeOverlays.delete(overlayId);
  logOverlayRemoved({ overlayId, overlayType: existing.type, reason });
}

export function syncSceneOverlays(nextOverlays: SceneOverlay[], reason: OverlayActivationReason): void {
  const nextIds = new Set(nextOverlays.map((overlay) => overlay.id));
  for (const id of activeOverlays.keys()) {
    if (!nextIds.has(id)) removeSceneOverlay(id, reason);
  }
  nextOverlays.forEach((overlay) => registerSceneOverlay(overlay, reason));
}

export function getActiveSceneOverlays(): SceneOverlay[] {
  return Array.from(activeOverlays.values()).sort((a, b) => a.type.localeCompare(b.type));
}

/** Test-only reset. */
export function resetOverlayRuntimeForTests(): void {
  visibility = { ...DEFAULT_OVERLAY_VISIBILITY };
  cachedVisibilitySnapshot = createFrozenVisibilitySnapshot(visibility);
  activeOverlays.clear();
  listeners.clear();
}

// Hydrate once on module load in browser.
if (typeof window !== "undefined") {
  hydrateOverlayVisibilityFromStorage();
}
