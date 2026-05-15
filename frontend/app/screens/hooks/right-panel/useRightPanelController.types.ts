import type { MutableRefObject } from "react";

import type { RightPanelView } from "../../../lib/ui/right-panel/rightPanelTypes.ts";
import type { TypeCOpenSimPanelForTypeCRef } from "../typec/useTypeCOrchestration.types.ts";

// ======================================================
// Right Panel Controller Types
// ======================================================
//
// This file stabilizes Right Panel orchestration ownership before extraction from HomeScreen.
// **Types, readonly contracts, extraction metadata, and callback signatures only** — no hooks,
// no runtime orchestration, no UI, no panel mutation.
//
// See `HomeScreenOptimizationInventory.md` → **O3 — Right Panel Controller Extraction**.

/**
 * High-level origin of a panel open request (HomeScreen may still use finer-grained enums such as
 * `PanelSource` from `panelAuthorityTypes` during migration).
 */
export type RightPanelSource =
  | "chat"
  | "type_c"
  | "scene"
  | "user"
  | "system"
  | "restore"
  | "demo"
  | "simulation";

/** Semantic reason for opening or routing a panel (string allowed for incremental extraction). */
export type RightPanelReason =
  | "object_selected"
  | "chat_intent"
  | "type_c_action"
  | "scenario_opened"
  | "war_room"
  | "simulation_compare"
  | "executive_focus"
  | "manual_open"
  | "restore_state";

export type OpenRightPanelOptions = Readonly<{
  bypassDedupe?: boolean;
  preserveFocus?: boolean;
  suppressFlashProtection?: boolean;
  reason?: RightPanelReason | string;
}>;

/** Snapshot aligned with HomeScreen `rightPanelState` + trace metadata concepts. */
export type RightPanelControllerState = Readonly<{
  activePanelId: string | null;
  activePanelView: string | null;
  activePanelSource: string | null;
  activePanelReason: string | null;
  hasOpenPanel: boolean;
}>;

export type RightPanelDedupeResult = Readonly<{
  shouldOpen: boolean;
  skippedReason?: string;
  signature: string;
}>;

/**
 * Controller-owned refs (O3:5). `lastPanelRequestSigRef` / `lastOpenIntentRef` moved from HomeScreen; placeholder
 * refs remain for future O3 steps. **Still in HomeScreen:** `lastPanelAuthorityReasonRef`, `lastUpstreamPanelCommitSigRef`,
 * authority audit sig refs, `rightPanelRouteLockRef`, `panelAuthorityRapidIntentRef`, `clickIntentLockRef`, etc.
 */
export type RightPanelControllerRefs = Readonly<{
  lastPanelRequestSigRef: MutableRefObject<string | null>;
  lastOpenIntentRef: MutableRefObject<string | null>;
  lastOpenedPanelRef: MutableRefObject<string | null>;
  lastPanelOpenReasonRef: MutableRefObject<string | null>;
  lastPanelOpenSourceRef: MutableRefObject<string | null>;
  lastPanelOpenAtRef: MutableRefObject<number | null>;
  panelFlashGuardRef: MutableRefObject<string | null>;
}>;

/** Public surface for panel opens/closes (`useRightPanelController` implements O3:4+). */
export type RightPanelControllerCallbacks = Readonly<{
  openRightPanel: (view: string, source: RightPanelSource | string, options?: OpenRightPanelOptions) => void;
  closeRightPanel: (reason?: string) => void;
  getActivePanelId: () => string | null;
  isPanelOpen: (view: string) => boolean;
}>;

export type RightPanelDiagnosticEventName =
  | "panel_open_requested"
  | "panel_open_skipped"
  | "panel_open_committed"
  | "panel_close_requested"
  | "panel_close_committed"
  | "panel_flash_blocked"
  | "dashboard_spam_blocked"
  | "panel_normalized"
  | "bridge_connected";

export type RightPanelDiagnosticPayload = Readonly<{
  view?: string | null;
  /** Raw / incoming view label (authority + router traces). */
  requestedView?: string | null;
  source?: string | null;
  reason?: string | null;
  skippedReason?: string | null;
  normalizedView?: string | null;
  /** Dedupe / intent signature (open intent, upstream commit, etc.). */
  signature?: string | null;
  activePanelId?: string | null;
  at?: number;
  /** Bridge wiring (O3:6+). */
  bridgeName?: string;
  connected?: boolean;
  extractionPhase?: string;
  /** Optional sub-classifier (e.g. dashboard override candidate vs blocked). */
  detail?: string | null;
  family?: string | null;
  contextId?: string | null;
  writer?: string | null;
  /** Legacy `[Nexora][PanelRouteDecision]` shape (`requested` / `final`). */
  requested?: string | null;
  final?: string | null;
  prevView?: string | null;
  nextView?: string | null;
}>;

export type RightPanelDiagnosticEmitter = Readonly<{
  emitRightPanelDiagnostic: (
    eventName: RightPanelDiagnosticEventName,
    payload?: RightPanelDiagnosticPayload | null,
    dedupeKey?: string | null
  ) => void;
}>;

export type UseRightPanelControllerContract = Readonly<{
  state: RightPanelControllerState;
  refs: RightPanelControllerRefs;
  callbacks: RightPanelControllerCallbacks;
}>;

/**
 * Structural subset passed from `useRightPanelController` into HomeScreen’s `requestPanelAuthorityOpen`.
 * HomeScreen keeps the full local `NexoraPanelAuthorityRequest` type; the hook uses a widened `source: string`
 * and the shell casts when wiring (O3:4).
 */
export type PanelAuthorityOpenRequest = Readonly<{
  view: string;
  family?: "EXE" | "SCN" | "SIM" | "RSK";
  source: string;
  contextId?: string | null;
  reason?: string;
  forceOpen?: boolean;
}>;

export type RequestPanelAuthorityOpenFn = (request: PanelAuthorityOpenRequest) => void;

/** O3:6 — named bridge slots for external zones that open the right panel via refs (dev logs + wiring). */
export type RightPanelBridgeName =
  | "type_c"
  | "chat"
  | "scene"
  | "demo"
  | "manual"
  | "restore";

/** Refs HomeScreen keeps for Type-C / chat / scene consumers; only slots that exist are listed. */
export type RightPanelBridgeRefs = Readonly<{
  typeCOpenSimPanelRef?: TypeCOpenSimPanelForTypeCRef;
}>;

export type UseRightPanelControllerInput = Readonly<{
  activePanelId: string | null;
  activePanelView: string | null;
  selectedObjectId: string | null;
  /** Optional; used when resolving default `contextId` for generic `openRightPanel` (O3:4). */
  focusedObjectId?: string | null;
  getRightPanelSnapshot: () => Readonly<{ view: RightPanelView | null; contextId: string | null }>;
  /** Mirrors `rightPanelState.isOpen` for authority intent dedupe (O3:5). */
  rightPanelIsOpen: boolean;
  panelAuthorityOpenBridgeRef: MutableRefObject<RequestPanelAuthorityOpenFn | null>;
  panelAuthorityCloseBridgeRef: MutableRefObject<((reason?: string) => void) | null>;
  clearClickIntentLock: (
    reason: string,
    detail?: {
      source?: string;
      nextView?: RightPanelView | null;
      nextContextId?: string | null;
    }
  ) => void;
  traceRightPanelPathAudit: (
    source: string,
    nextView: RightPanelView | null,
    classification:
      | "explicit_user_action"
      | "default_sync"
      | "fallback"
      | "adapter_reopen"
      | "legacy_sync"
      | "direct_state_write"
  ) => void;
  traceRightPanelStateMutation: (
    source: string,
    previousView: RightPanelView | null,
    nextView: RightPanelView | null,
    contextId?: string | null
  ) => void;
  lastRightPanelChangeSourceRef: MutableRefObject<string | null>;
  refs?: Partial<RightPanelControllerRefs> | null;
  /** O3:6 — bridge ref targets; assignment runs in `useRightPanelControllerBridgeWiring` after `openSimPanel` exists. */
  bridgeRefs?: Partial<RightPanelBridgeRefs> | null;
}>;

export const RIGHT_PANEL_CONTROLLER_EXTRACTION_PLAN = {
  phase: "O3",
  zone: "right_panel_controller",
  extractionOrder: [
    "types",
    "hook_skeleton",
    "open_close_callbacks",
    "routing_normalization",
    "dedupe_guards",
    "bridge_wiring",
    "diagnostics",
    "cleanup",
  ] as const,
  protectedAreas: [
    "scene_apply_controller",
    "type_c_orchestration",
    "chat_pipeline",
    "right_panel_host",
  ] as const,
} as const;

export type UseRightPanelControllerResult = UseRightPanelControllerContract &
  Readonly<{
    diagnostics: RightPanelDiagnosticEmitter;
    extractionPlan: typeof RIGHT_PANEL_CONTROLLER_EXTRACTION_PLAN;
  }>;
