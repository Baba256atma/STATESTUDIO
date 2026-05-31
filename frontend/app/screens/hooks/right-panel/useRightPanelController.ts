/**
 * Right Panel Controller — `useRightPanelController`
 *
 * **Owns (O3:4+):** `openRightPanel` / `closeRightPanel`, panel request dedupe refs (`lastPanelRequestSigRef`),
 * authority open-intent dedupe (`lastOpenIntentRef`), and `openRightPanel` routing normalization (O3:5).
 * **O3:7:** dev-only diagnostics via `emitRightPanelDiagnosticDev` / `diagnostics.emitRightPanelDiagnostic` (deduped; no render-time logs).
 * **Does not own:** React `rightPanelState` — the shell keeps state and wires `panelAuthorityOpenBridgeRef` /
 * `panelAuthorityCloseBridgeRef` after `requestPanelAuthorityOpen` / `requestPanelAuthorityClose` are defined.
 */

import { useCallback, useEffect, useMemo, useRef } from "react";

import { emitDebugEvent } from "../../../lib/debug/debugEmit.ts";
import { logPanelClose } from "../../homeScreenPanelHelpers.ts";
import { normalizeRawAuthorityPanelView } from "./rightPanelAuthorityRoute.ts";
import {
  RIGHT_PANEL_CONTROLLER_EXTRACTION_PLAN,
  type OpenRightPanelOptions,
  type PanelAuthorityOpenRequest,
  type RightPanelBridgeRefs,
  type RightPanelControllerCallbacks,
  type RightPanelControllerRefs,
  type RightPanelControllerState,
  type RightPanelDiagnosticEventName,
  type RightPanelDiagnosticPayload,
  type UseRightPanelControllerInput,
  type UseRightPanelControllerResult,
} from "./useRightPanelController.types.ts";
import type { TypeCOpenSimPanelForTypeCRef } from "../typec/useTypeCOrchestration.types.ts";

const NEXORA_PANEL_AUTHORITY_SOURCE_LITERALS = [
  "left_nav",
  "manual_user_nav",
  "sub_button",
  "tab_click",
  "chat",
  "scene",
  "object_click",
  "analyze_object",
  "system",
  "legacy_event",
  "strategic_command",
  "component_panel",
  "exe_preview",
  "dashboard_preview",
  "decision_strip",
] as const;

function mapIncomingSourceToAuthoritySource(raw: string): string {
  const s = String(raw ?? "").trim();
  if ((NEXORA_PANEL_AUTHORITY_SOURCE_LITERALS as readonly string[]).includes(s)) return s;
  switch (s) {
    case "user":
      return "manual_user_nav";
    case "restore":
      return "scene";
    case "demo":
      return "component_panel";
    case "type_c":
    case "simulation":
      return "sub_button";
    default:
      return "sub_button";
  }
}

function inferAuthorityFamily(viewRaw: string): "EXE" | "SCN" | "SIM" | "RSK" | undefined {
  const v = String(viewRaw ?? "").trim().toLowerCase();
  if (v === "war_room" || v === "compare" || v === "simulate") return "SIM";
  if (v === "risk" || v === "risk_flow") return "RSK";
  if (
    v === "object" ||
    v === "object_focus" ||
    v === "workspace" ||
    v === "executive_object" ||
    v === "focus"
  ) {
    return "SCN";
  }
  return undefined;
}

/** Per-event last dedupe key (dev-only; module scope matches single HomeScreen shell). */
const rightPanelDiagnosticLastKeyByEvent = new Map<RightPanelDiagnosticEventName, string>();

const LEGACY_CONSOLE_LABEL: Partial<
  Record<RightPanelDiagnosticEventName, { readonly method: "log" | "info" | "warn" | "debug"; readonly label: string }>
> = {
  panel_open_skipped: { method: "info", label: "[Nexora][RightPanel][DedupeGuard]" },
  bridge_connected: { method: "info", label: "[Nexora][RightPanel][BridgeConnected]" },
  panel_open_committed: { method: "log", label: "[Nexora][PanelRouteDecision]" },
  panel_flash_blocked: { method: "warn", label: "[Nexora][ExecutiveObjectOverrideBlocked]" },
  dashboard_spam_blocked: { method: "warn", label: "[Nexora][DashboardOverrideBlocked]" },
};

import { shouldEmitRuntimeEvent } from "../../../lib/runtime/runtimeEventDeduper.ts";

/**
 * O3:7 — dev-only right panel diagnostics (no state updates; safe for open/close hot paths).
 * Optional `dedupeKey` suppresses repeats with the same key for that `eventName`.
 */
export function emitRightPanelDiagnosticDev(
  eventName: RightPanelDiagnosticEventName,
  payload?: RightPanelDiagnosticPayload | null,
  dedupeKey?: string | null
): void {
  if (process.env.NODE_ENV === "production") return;
  try {
    const merged: RightPanelDiagnosticPayload = {
      ...(payload ?? {}),
      at: payload?.at ?? Date.now(),
    };
    const key = dedupeKey ?? JSON.stringify({ eventName, ...merged });
    const frameKey = `${eventName}::${key}`;
    if (!shouldEmitRuntimeEvent(frameKey)) {
      return;
    }
    if (rightPanelDiagnosticLastKeyByEvent.get(eventName) === key) {
      return;
    }
    rightPanelDiagnosticLastKeyByEvent.set(eventName, key);
    const legacy = LEGACY_CONSOLE_LABEL[eventName];
    const consolePayload = { eventName, ...merged };
    if (legacy) {
      const fn = globalThis.console[legacy.method]?.bind(globalThis.console) ?? globalThis.console.info.bind(globalThis.console);
      fn(legacy.label, consolePayload);
      return;
    }
    globalThis.console.info("[Nexora][RightPanel][Diagnostic]", consolePayload);
  } catch {
    /* diagnostics must never throw into panel paths */
  }
}

/**
 * O3:6 — assigns external bridge refs to the latest `openSimPanel` callback.
 * **Call after `openSimPanel` is defined** (same module as `useRightPanelController`; React hook order).
 */
export function useRightPanelControllerBridgeWiring(input: Readonly<{
  bridgeRefs?: Partial<RightPanelBridgeRefs> | null;
  openSimPanel: NonNullable<TypeCOpenSimPanelForTypeCRef["current"]>;
}>): void {
  const { bridgeRefs, openSimPanel } = input;

  useEffect(() => {
    const typeCBridgeRef = bridgeRefs?.typeCOpenSimPanelRef;
    if (!typeCBridgeRef) return;
    // eslint-disable-next-line react-hooks/immutability -- O3:6: `typeCOpenSimPanelRef` is a HomeScreen-owned `MutableRefObject`; assigning `.current` is the bridge contract.
    typeCBridgeRef.current = openSimPanel;
    emitRightPanelDiagnosticDev(
      "bridge_connected",
      { bridgeName: "type_c", connected: true, extractionPhase: "O3:6" },
      "type_c"
    );
    return () => {
      if (typeCBridgeRef.current === openSimPanel) {
        typeCBridgeRef.current = null;
      }
    };
  }, [openSimPanel, bridgeRefs?.typeCOpenSimPanelRef]);
}

export function useRightPanelController(input: UseRightPanelControllerInput): UseRightPanelControllerResult {
  const {
    activePanelId,
    activePanelView,
    selectedObjectId,
    focusedObjectId,
    rightPanelIsOpen,
    getRightPanelSnapshot,
    panelAuthorityOpenBridgeRef,
    panelAuthorityCloseBridgeRef,
    clearClickIntentLock,
    traceRightPanelPathAudit,
    traceRightPanelStateMutation,
    lastRightPanelChangeSourceRef,
    bridgeRefs: _o36BridgeRefsReserved,
  } = input;
  void _o36BridgeRefsReserved;

  const lastPanelRequestSigRefOwned = useRef<string | null>(null);
  const lastOpenIntentRefOwned = useRef<string | null>(null);
  const lastOpenedPanelRefOwned = useRef<string | null>(null);
  const lastPanelOpenReasonRefOwned = useRef<string | null>(null);
  const lastPanelOpenSourceRefOwned = useRef<string | null>(null);
  const lastPanelOpenAtRefOwned = useRef<number | null>(null);
  // Anti-flash guard: prevents repeated open/close churn from chat/scene/panel cycles.
  // `panelFlashGuardRef` is reserved for flash signature coordination (O3:5+); do not emit state updates from diagnostics.
  const panelFlashGuardRefOwned = useRef<string | null>(null);

  const lastPanelRequestSigRef = input.refs?.lastPanelRequestSigRef ?? lastPanelRequestSigRefOwned;
  const lastOpenIntentRef = input.refs?.lastOpenIntentRef ?? lastOpenIntentRefOwned;
  const lastOpenedPanelRef = input.refs?.lastOpenedPanelRef ?? lastOpenedPanelRefOwned;
  const lastPanelOpenReasonRef = input.refs?.lastPanelOpenReasonRef ?? lastPanelOpenReasonRefOwned;
  const lastPanelOpenSourceRef = input.refs?.lastPanelOpenSourceRef ?? lastPanelOpenSourceRefOwned;
  const lastPanelOpenAtRef = input.refs?.lastPanelOpenAtRef ?? lastPanelOpenAtRefOwned;
  const panelFlashGuardRef = input.refs?.panelFlashGuardRef ?? panelFlashGuardRefOwned;

  const refs = useMemo<RightPanelControllerRefs>(
    () => ({
      lastPanelRequestSigRef,
      lastOpenIntentRef,
      lastOpenedPanelRef,
      lastPanelOpenReasonRef,
      lastPanelOpenSourceRef,
      lastPanelOpenAtRef,
      panelFlashGuardRef,
    }),
    [
      lastPanelRequestSigRef,
      lastOpenIntentRef,
      lastOpenedPanelRef,
      lastPanelOpenReasonRef,
      lastPanelOpenSourceRef,
      lastPanelOpenAtRef,
      panelFlashGuardRef,
    ]
  );

  const state = useMemo<RightPanelControllerState>(
    () => ({
      activePanelId,
      activePanelView,
      activePanelSource: null,
      activePanelReason: null,
      hasOpenPanel: Boolean(
        (typeof activePanelView === "string" && activePanelView.trim() !== "") ||
          (typeof activePanelId === "string" && activePanelId.trim() !== "")
      ),
    }),
    [activePanelId, activePanelView]
  );

  const emitRightPanelDiagnostic = useCallback(
    (eventName: RightPanelDiagnosticEventName, payload?: RightPanelDiagnosticPayload | null, dedupeKey?: string | null) => {
      emitRightPanelDiagnosticDev(
        eventName,
        { ...(payload ?? {}), activePanelId: activePanelId ?? null },
        dedupeKey
      );
    },
    [activePanelId]
  );

  const openRightPanel = useCallback(
    (view: string, source: string, options?: OpenRightPanelOptions) => {
      const authoritySource = mapIncomingSourceToAuthoritySource(source);
      const snap = getRightPanelSnapshot();
      const sel = typeof selectedObjectId === "string" ? selectedObjectId.trim() : "";
      const foc = typeof focusedObjectId === "string" ? focusedObjectId.trim() : "";
      const snapCtx = typeof snap.contextId === "string" ? snap.contextId.trim() : "";
      const contextId = sel || foc || snapCtx || null;

      const rawLower = String(view ?? "").trim().toLowerCase();
      const mapped = normalizeRawAuthorityPanelView(rawLower);
      const normalizedView = mapped.view;
      if (rawLower !== String(normalizedView ?? "").trim().toLowerCase()) {
        emitRightPanelDiagnosticDev(
          "panel_normalized",
          {
            requestedView: view ?? null,
            normalizedView: normalizedView ?? null,
            source: authoritySource,
            reason: `openRightPanel:${source}`,
            signature: `${rawLower}->${String(normalizedView ?? "")}`,
            activePanelId: activePanelId ?? null,
          },
          `open_rp_norm:${rawLower}`
        );
      }
      const family = inferAuthorityFamily(String(normalizedView ?? ""));

      const reason =
        options?.reason !== undefined && options?.reason !== null
          ? String(options.reason)
          : `openRightPanel:${source}`;

      const openIntentSig = JSON.stringify({
        view: normalizedView ?? null,
        contextId,
      });
      if (
        !options?.bypassDedupe &&
        lastOpenIntentRef.current === openIntentSig &&
        rightPanelIsOpen === true &&
        activePanelView === normalizedView &&
        (snap.contextId ?? null) === (contextId ?? null)
      ) {
        const logSig = JSON.stringify({
          skipped: "open_right_panel_intent",
          signature: openIntentSig,
        });
        emitRightPanelDiagnosticDev(
          "panel_open_skipped",
          {
            requestedView: view ?? null,
            normalizedView: normalizedView ?? null,
            source: authoritySource,
            reason,
            skippedReason: "same_open_intent_as_current_panel",
            signature: openIntentSig,
            activePanelId: activePanelId ?? null,
          },
          logSig
        );
        return;
      }

      const req: PanelAuthorityOpenRequest = {
        view: String(normalizedView ?? ""),
        family,
        source: authoritySource,
        contextId,
        forceOpen: true,
        reason,
      };

      const bridge = panelAuthorityOpenBridgeRef.current;
      if (!bridge) {
        emitRightPanelDiagnosticDev(
          "panel_open_requested",
          {
            detail: "panel_authority_open_bridge_not_wired",
            requestedView: view ?? null,
            normalizedView: normalizedView ?? null,
            source: authoritySource,
            reason,
            signature: openIntentSig,
            activePanelId: activePanelId ?? null,
          },
          "open_bridge_unwired"
        );
        return;
      }
      bridge(req);
    },
    [
      activePanelId,
      activePanelView,
      getRightPanelSnapshot,
      lastOpenIntentRef,
      panelAuthorityOpenBridgeRef,
      rightPanelIsOpen,
      selectedObjectId,
      focusedObjectId,
    ]
  );

  const runCloseRightPanel = useCallback(() => {
    const snap = getRightPanelSnapshot();
    emitDebugEvent({
      type: "panel_reset_detected",
      layer: "panel",
      source: "HomeScreen",
      status: "info",
      message: "Right panel close invoked",
      metadata: { previousView: snap.view ?? null, rawSource: "closeRightPanel" },
    });
    panelAuthorityCloseBridgeRef.current?.("closeRightPanel");
    clearClickIntentLock("panel_closed", {
      source: "closeRightPanel",
      nextView: null,
      nextContextId: null,
    });
    logPanelClose({
      previousView: snap.view ?? null,
    });
    traceRightPanelPathAudit("closeRightPanel", null, "direct_state_write");
    lastRightPanelChangeSourceRef.current = "closeRightPanel";
    traceRightPanelStateMutation("closeRightPanel", snap.view ?? null, null, snap.contextId ?? null);
    emitRightPanelDiagnosticDev("panel_close_committed", {
      reason: "closeRightPanel",
      normalizedView: snap.view ?? null,
      contextId: snap.contextId ?? null,
      activePanelId: activePanelId ?? null,
    });
  }, [
    activePanelId,
    clearClickIntentLock,
    getRightPanelSnapshot,
    lastRightPanelChangeSourceRef,
    panelAuthorityCloseBridgeRef,
    traceRightPanelPathAudit,
    traceRightPanelStateMutation,
  ]);

  const closeRightPanel = useCallback(
    (_reason?: string) => {
      void _reason;
      runCloseRightPanel();
    },
    [runCloseRightPanel]
  );

  const getActivePanelId = useCallback(() => activePanelId, [activePanelId]);

  const isPanelOpen = useCallback(
    (view: string) => {
      const v = typeof view === "string" ? view.trim() : "";
      if (!v) return false;
      const active = activePanelView;
      if (typeof active !== "string" || active.trim() === "") return false;
      const a = active.trim();
      return a === v || a.toLowerCase() === v.toLowerCase();
    },
    [activePanelView]
  );

  const callbacks = useMemo<RightPanelControllerCallbacks>(
    () => ({
      openRightPanel,
      closeRightPanel,
      getActivePanelId,
      isPanelOpen,
    }),
    [openRightPanel, closeRightPanel, getActivePanelId, isPanelOpen]
  );

  return useMemo<UseRightPanelControllerResult>(
    () => ({
      state,
      refs,
      callbacks,
      diagnostics: {
        emitRightPanelDiagnostic,
      },
      extractionPlan: RIGHT_PANEL_CONTROLLER_EXTRACTION_PLAN,
    }),
    [state, refs, callbacks, emitRightPanelDiagnostic]
  );
}
