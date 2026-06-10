import { buildSelectionSignature } from "./selectionSignature";
import { recordNullSelectionWritePrevented } from "../debug/startupNoiseAudit";

export const USER_SELECTION_LOCK_TTL_MS = 450;

export type UserSelectionLock = {
  objectId: string;
  clickEventId: string;
  startedAt: number;
};

export type CanonicalVisualSelection = {
  selectedId: string | null;
  highlightedIds: string[];
  labelIds: string[];
  ringIds: string[];
  haloIds: string[];
  linkIds: string[];
  labelObjectIds: string[];
  ringObjectIds: string[];
  linkObjectIds: string[];
  layerObjectIds: string[];
  relationshipObjectIds: string[];
};

export type DerivedObjectSelectionMirror = {
  highlighted_objects: string[];
  dim_unrelated_objects: boolean;
} | null;

export function normalizeSelectedObjectId(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function deriveObjectSelectionFromSelectedId(input: {
  selectedId: string | null | undefined;
  sceneJson?: unknown;
}): DerivedObjectSelectionMirror {
  const selectedId = normalizeSelectedObjectId(input.selectedId);
  if (!selectedId) return null;
  return {
    highlighted_objects: [selectedId],
    dim_unrelated_objects: false,
  };
}

/** Single owner for scene object ring/bold/label selected visuals. */
export function resolveCanonicalSceneVisualSelection(input: {
  selectedObjectIdState: string | null | undefined;
}): string | null {
  return normalizeSelectedObjectId(input.selectedObjectIdState);
}

export function logVisualSelectionAuthorityRejected(payload: {
  attemptedObjectId: string | null;
  canonicalSelectedId: string | null;
  source: string;
}): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.debug?.("[Nexora][VisualSelectionAuthorityRejected]", payload);
}

export const CANONICAL_VISUAL_SELECTION_SOURCE = "canonicalSelectedId" as const;

const visualSelectionLayerAuditKeys = new Set<string>();

export function logVisualSelectionLayerAudit(payload: {
  objectId: string;
  selectedVisual: boolean;
  selectedId: string | null;
  ringSource: string;
  labelSource: string;
  boldSource: string;
  glowSource: string;
}): void {
  if (process.env.NODE_ENV === "production") return;
  const key = JSON.stringify(payload);
  if (visualSelectionLayerAuditKeys.has(key)) return;
  visualSelectionLayerAuditKeys.add(key);
  globalThis.console?.debug?.("[Nexora][VisualSelectionLayerAudit]", payload);
}

export function resetVisualSelectionLayerAuditLogsForTests(): void {
  visualSelectionLayerAuditKeys.clear();
}

export function isCanonicalObjectSelectionSelectSource(source: string): boolean {
  const normalized = String(source ?? "").trim();
  return normalized === "object_click" || normalized.startsWith("object_click:");
}

export function isCanonicalObjectSelectionClearSource(source: string): boolean {
  const normalized = String(source ?? "").trim();
  return (
    normalized === "empty_canvas_click" ||
    normalized === "SceneCanvas.onPointerMissed" ||
    normalized === "scene_pointer_miss" ||
    normalized === "scene_clear" ||
    normalized === "keyboard_clear" ||
    normalized === "executive_object_delete" ||
    normalized === "relationship_select" ||
    normalized === "propagation_path_select" ||
    normalized === "executive_relationship_insert" ||
    normalized === "qa_fixture_clear"
  );
}

export function isCanonicalObjectSelectionWriteSource(source: string): boolean {
  return (
    isCanonicalObjectSelectionSelectSource(source) ||
    isCanonicalObjectSelectionClearSource(source)
  );
}

export function shouldBlockNonCanonicalSelectionWrite(input: {
  source: string;
  nextObjectId: string | null;
}): boolean {
  const source = String(input.source ?? "").trim();
  if (source === "focus_ownership" || source === "focus_ownership_clear") {
    return true;
  }
  const nextId = normalizeSelectedObjectId(input.nextObjectId);
  if (nextId != null) {
    return !isCanonicalObjectSelectionSelectSource(source);
  }
  return !isCanonicalObjectSelectionClearSource(source);
}

export function logNonCanonicalSelectionWriterBlocked(payload: {
  writer: string;
  attemptedObjectId: string | null;
  currentSelectedId: string | null;
  source: string;
}): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.debug?.("[Nexora][NonCanonicalSelectionWriterBlocked]", payload);
}

export function logFocusOwnershipSelectionWriteBlocked(payload: {
  attemptedObjectId: string | null;
  currentSelectedId: string | null;
  source: string;
}): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.debug?.("[Nexora][FocusOwnershipSelectionWriteBlocked]", payload);
}

export function logStaleDebouncedSelectionSkipped(payload: {
  scheduledObjectId: string;
  canonicalSelectedId: string | null;
  source: string;
}): void {
  if (process.env.NODE_ENV === "production") return;
  globalThis.console?.debug?.("[Nexora][StaleDebouncedSelectionSkipped]", payload);
}

export function resolveCanonicalVisualSelection(
  selectedObjectIdState: string | null | undefined
): CanonicalVisualSelection {
  const selectedId = resolveCanonicalSceneVisualSelection({ selectedObjectIdState });
  if (!selectedId) {
    return {
      selectedId: null,
      highlightedIds: [],
      labelIds: [],
      ringIds: [],
      haloIds: [],
      linkIds: [],
      labelObjectIds: [],
      ringObjectIds: [],
      linkObjectIds: [],
      layerObjectIds: [],
      relationshipObjectIds: [],
    };
  }
  return {
    selectedId,
    highlightedIds: [selectedId],
    labelIds: [selectedId],
    ringIds: [selectedId],
    haloIds: [selectedId],
    linkIds: [selectedId],
    labelObjectIds: [selectedId],
    ringObjectIds: [selectedId],
    linkObjectIds: [selectedId],
    layerObjectIds: [selectedId],
    relationshipObjectIds: [selectedId],
  };
}

export type SceneSelectionChangeSource =
  | "pointer_object_click"
  | "empty_canvas_click"
  | "keyboard_clear"
  | "scene_sync"
  | "prop_sync"
  | "visual_sync"
  | "effect_echo";

export type SceneSelectionChangeOptions = {
  source?: SceneSelectionChangeSource;
  eventId?: string;
};

export const OBJECT_CLICK_TRANSACTION_DEDUPE_MS = 150;

export function isSceneSelectionUserIntentSource(
  source: SceneSelectionChangeSource | string | undefined
): boolean {
  return (
    source === "pointer_object_click" ||
    source === "empty_canvas_click" ||
    source === "keyboard_clear"
  );
}

export function isSceneSelectionEchoSource(
  source: SceneSelectionChangeSource | string | undefined
): boolean {
  if (!source) return true;
  return (
    source === "scene_sync" ||
    source === "prop_sync" ||
    source === "visual_sync" ||
    source === "effect_echo"
  );
}

export function isUserSelectionLockActive(
  lock: UserSelectionLock | null,
  now = Date.now()
): boolean {
  return Boolean(lock && now - lock.startedAt <= USER_SELECTION_LOCK_TTL_MS);
}

export function hasRecentUserObjectClick(
  latestUserObjectClick: { timestamp: number } | null | undefined,
  now = Date.now()
): boolean {
  return Boolean(
    latestUserObjectClick && now - latestUserObjectClick.timestamp <= USER_SELECTION_LOCK_TTL_MS
  );
}

/** focus_ownership may commit selection only when this returns false (bootstrap/fallback). */
export function shouldFocusOwnershipMirrorOnly(input: {
  selectedObjectIdState: string | null | undefined;
  latestUserObjectClick: { timestamp: number } | null | undefined;
  userSelectionLock: UserSelectionLock | null;
  now?: number;
}): boolean {
  const now = input.now ?? Date.now();
  if (normalizeSelectedObjectId(input.selectedObjectIdState) != null) return true;
  if (isUserSelectionLockActive(input.userSelectionLock, now)) return true;
  if (hasRecentUserObjectClick(input.latestUserObjectClick, now)) return true;
  return false;
}

export function isAutomaticSelectionSource(source: string): boolean {
  const normalizedSource = String(source ?? "").trim();
  if (!normalizedSource) return true;
  if (normalizedSource === "object_click") return false;
  if (normalizedSource.startsWith("object_click:")) return false;
  if (normalizedSource === "user_click") return false;
  if (normalizedSource.startsWith("user_click:")) return false;
  if (normalizedSource.startsWith("manual_")) return false;
  return (
    normalizedSource === "focus_ownership" ||
    normalizedSource === "focus_ownership_clear" ||
    normalizedSource === "SceneCanvas.onPointerMissed" ||
    normalizedSource === "scene_pointer_miss" ||
    normalizedSource === "scene_clear" ||
    normalizedSource === "visible_ui_reconcile" ||
    normalizedSource === "scene_parity" ||
    normalizedSource === "right_panel_context" ||
    normalizedSource === "panel_controller" ||
    normalizedSource === "fallback_authority" ||
    normalizedSource.startsWith("visible_ui_reconcile:") ||
    normalizedSource.startsWith("scene_parity:") ||
    normalizedSource.startsWith("right_panel_context:") ||
    normalizedSource.startsWith("panel_controller:") ||
    normalizedSource.startsWith("fallback_authority:") ||
    normalizedSource.startsWith("interaction_controller")
  );
}

export function shouldBlockAutomaticSelectionOverride(input: {
  lockedObjectId: string | null;
  nextObjectId: string | null;
  source: string;
  now?: number;
}): boolean {
  const lockedObjectId = normalizeSelectedObjectId(input.lockedObjectId);
  if (!lockedObjectId) return false;
  if (!isAutomaticSelectionSource(input.source)) return false;
  const nextObjectId = normalizeSelectedObjectId(input.nextObjectId);
  if (nextObjectId == null) return true;
  return nextObjectId !== lockedObjectId;
}

export function shouldCommitSelectedObjectId(
  prev: string | null | undefined,
  next: string | null | undefined
): boolean {
  const same = normalizeSelectedObjectId(prev) === normalizeSelectedObjectId(next);
  if (same && normalizeSelectedObjectId(prev) == null) {
    recordNullSelectionWritePrevented();
  }
  return !same;
}

export function buildObjectSelectionSignature(selection: unknown): string {
  if (selection == null) return "null";
  const record = selection as {
    focused_object?: string | null;
    highlighted_objects?: unknown;
    dim_unrelated_objects?: boolean;
  };
  const highlighted = Array.isArray(record.highlighted_objects)
    ? record.highlighted_objects.filter((id): id is string => typeof id === "string")
    : [];
  const dimUnrelated = record.dim_unrelated_objects === true;
  return JSON.stringify({
    ...JSON.parse(
      buildSelectionSignature({
        focusedId: typeof record.focused_object === "string" ? record.focused_object : null,
        highlightedIds: highlighted,
        source: "system",
      })
    ),
    d: dimUnrelated,
  });
}

export function shouldCommitObjectSelection(prev: unknown, next: unknown): boolean {
  if (prev == null && next == null) {
    recordNullSelectionWritePrevented();
    return false;
  }
  if (buildObjectSelectionSignature(prev) === buildObjectSelectionSignature(next)) {
    return false;
  }
  return true;
}
