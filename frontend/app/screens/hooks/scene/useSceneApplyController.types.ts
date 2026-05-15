import type { Dispatch, MutableRefObject, SetStateAction } from "react";

import type { SceneJson } from "../../../lib/sceneTypes.ts";
import type { TypeCApplySceneUpdateRef } from "../typec/useTypeCOrchestration.types.ts";

// ======================================================
// Scene Apply Controller Types
// ======================================================
//
// Companion types for `useSceneApplyController.ts` — load that file for the public I/O contract and AI context notes.
// This file holds **types and metadata only**: no hooks, no runtime orchestration, no UI, no scene mutation.
//
// See `HomeScreenOptimizationInventory.md` → **O2 — Scene Apply Controller Extraction** and **AI Usage Notes After O2**.

/** Known writer families; call sites may still pass arbitrary `string` for compatibility. */
export type SceneApplySource =
  | "chat"
  | "type_c"
  | "ingestion"
  | "panel"
  | "demo"
  | "replay"
  | "snapshot"
  | "restore"
  | "manual"
  | "system";

export type SceneApplyOptions = Readonly<{
  bypassDedupe?: boolean;
  allowDestructiveReset?: boolean;
  reason?: string;
  trace?: boolean;
}>;

export type SceneApplyUpdater =
  | SceneJson
  | null
  | ((prev: SceneJson | null) => SceneJson | null);

/** Main scene writer contract (implementation: `useSceneApplyController` since O2:4). */
export type ApplySceneChangeSafe = (
  nextOrUpdater: SceneApplyUpdater,
  source: SceneApplySource | string,
  options?: SceneApplyOptions
) => void;

/** Named scene-write bridges wired by `useSceneApplyController` (O2:6). */
export type SceneApplyBridgeName =
  | "type_c"
  | "ingestion"
  | "chat"
  | "panel"
  | "demo"
  | "manual";

export type SceneApplyBridgeStatus = Readonly<{
  name: SceneApplyBridgeName;
  connected: boolean;
  lastConnectedAt: number | null;
}>;

/**
 * Optional refs HomeScreen owns; the scene apply hook assigns `applySceneChangeSafe` in an effect (O2:6).
 * Only includes bridges that exist today — extend when a zone gains a dedicated ref.
 */
export type SceneApplyBridgeRefs = Readonly<{
  /** Type-C orchestration reads `current` when applying connection suggestions / scenario scene edits. */
  applyTypeCSceneUpdateRef?: TypeCApplySceneUpdateRef;
}>;

/** Readonly snapshot aligned with HomeScreen scene + selection concepts. */
export type SceneApplyControllerState = Readonly<{
  sceneJson: SceneJson | null;
  sceneObjectCount: number;
  selectedObjectId: string | null;
  focusedObjectId: string | null;
}>;

/**
 * Refs exposed by `useSceneApplyController` (O2:5+).
 *
 * - **`lastSceneApplySigRef`** — hook-owned full-scene JSON dedupe for `applySceneChangeSafe`.
 * - **`lastSceneResetTraceSigRef`** — **shared** with `HomeScreen` parity / empty-state diagnostics (same ref
 *   identity passed in; `applySceneChangeSafe` and other paths must dedupe the same reset trace).
 * - **`lastSceneSemanticSignatureRef` / `lastSceneRenderSignatureRef`** — typically HomeScreen’s
 *   `lastSceneSemanticApplyRef` / `lastSceneVisualApplySignatureRef` (unified reaction / visual parity), not read
 *   inside `applySceneChangeSafe` today.
 * - **`lastSceneWriteSourceRef` / `lastSceneWriteAtRef`** — hook-owned by default (updated when
 *   `applySceneChangeSafe` commits a new `sceneJson`); HomeScreen may pass overrides via `refs` if a later
 *   prompt needs shared provenance with non-apply paths.
 *
 * Not moved (still HomeScreen): `lastUpstreamSceneApplySigBySourceRef`, `sceneIntentQueueRef`, parity trace refs, etc.
 */
export type SceneApplyControllerRefs = Readonly<{
  lastSceneApplySigRef: MutableRefObject<string | null>;
  lastSceneResetTraceSigRef: MutableRefObject<string | null>;
  lastSceneSemanticSignatureRef: MutableRefObject<string | null>;
  lastSceneRenderSignatureRef: MutableRefObject<string | null>;
  lastSceneWriteSourceRef: MutableRefObject<string | null>;
  lastSceneWriteAtRef: MutableRefObject<number | null>;
}>;

/** Dev-only fields for `emitSceneApplyDiagnostic` (O2:7); all optional for flexibility. */
export type SceneApplyDiagnosticPayload = Readonly<{
  source?: string;
  reason?: string;
  objectCountBefore?: number;
  objectCountAfter?: number;
  bypassDedupe?: boolean;
  destructiveResetAllowed?: boolean;
  applied?: boolean;
  skippedReason?: string;
  signature?: string | null;
  semanticSig?: string | null;
  bridgeName?: SceneApplyBridgeName;
  connected?: boolean;
  extractionPhase?: string;
  bucket?: string;
  at?: number;
}>;

export type SceneApplyDiagnosticEventName =
  | "apply_started"
  | "apply_skipped"
  | "apply_committed"
  | "destructive_reset_blocked"
  | "duplicate_scene_write_skipped"
  | "semantic_signature_updated"
  | "bridge_connected";

export type SceneApplyDiagnosticEvent = Readonly<{
  name: SceneApplyDiagnosticEventName;
  payload: SceneApplyDiagnosticPayload;
  at: number;
}>;

/** Callbacks the hook will expose (implementations added in O2:3+). */
export type SceneApplyControllerCallbacks = Readonly<{
  applySceneChangeSafe: ApplySceneChangeSafe;
  getSceneObjectCount: () => number;
  getSceneSemanticSignature: () => string | null;
  /** Dev-only scene-write diagnostics (O2:7); no-ops in production. */
  emitSceneApplyDiagnostic: (
    name: SceneApplyDiagnosticEventName,
    payload?: SceneApplyDiagnosticPayload
  ) => void;
}>;

export type UseSceneApplyControllerContract = Readonly<{
  state: SceneApplyControllerState;
  refs: SceneApplyControllerRefs;
  callbacks: SceneApplyControllerCallbacks;
}>;

export type UseSceneApplyControllerInput = Readonly<{
  sceneJson: SceneJson | null;
  setSceneJson: Dispatch<SetStateAction<SceneJson | null>>;
  selectedObjectId: string | null;
  focusedObjectId: string | null;
  refs?: Partial<SceneApplyControllerRefs> | null;
  /**
   * Shared reset-trace dedupe ref: `applySceneChangeSafe` and HomeScreen parity / empty-state paths must see the
   * same `current` value (O2:5 — not duplicated inside the hook).
   */
  lastSceneResetTraceSigRef: MutableRefObject<string | null>;
  /**
   * HomeScreen’s shadowed `console.debug` (often a dev no-op). Passed through so upstream dedupe skips
   * inside `applySceneChangeSafe` match prior HomeScreen logging behavior.
   */
  sceneApplyConsoleDebug: (...args: unknown[]) => void;
  /** Optional refs to receive `applySceneChangeSafe` (O2:6); hook assigns/clears in `useEffect`, not during render. */
  bridgeRefs?: Partial<SceneApplyBridgeRefs> | null;
}>;

export const SCENE_APPLY_CONTROLLER_EXTRACTION_PLAN = {
  phase: "O2",
  zone: "scene_apply_controller",
  extractionOrder: [
    "types",
    "hook_skeleton",
    "apply_function",
    "dedupe_refs",
    "semantic_signature",
    "bridge_refs",
    "diagnostics",
    "cleanup",
  ] as const,
  protectedAreas: [
    "type_c_orchestration",
    "right_panel_routing",
    "chat_pipeline",
    "ingestion_bridge",
  ] as const,
} as const;
