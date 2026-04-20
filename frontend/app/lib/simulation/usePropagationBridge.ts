"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { SceneJson, SceneLoop } from "../sceneTypes";
import {
  buildPreviewPropagationOverlay,
  buildPropagationSceneSignature,
  hasMeaningfulPropagationOverlay,
  hasPropagationRelations,
  isPropagationOverlayCompatible,
  resolveScannerPrimarySource,
} from "./propagationOverlay";
import { requestPropagationSimulation } from "./propagationClient";
import { buildScenarioOverlayPackage, normalizeScenarioActionResponsePayload } from "./scenarioActionContract";
import { requestScenarioAction } from "./scenarioActionClient";
import { resolvePropagationTrigger } from "./resolvePropagationTrigger";
import type { PropagationOverlayState } from "./propagationTypes";
import type { ScenarioActionPropagationIntent } from "./propagationTriggerTypes";
import type { ScenarioActionResponsePayload, ScenarioOverlayPackage } from "./scenarioActionTypes";

type PropagationModeState = "backend" | "preview" | "idle";

type PropagationBridgeParams = {
  sceneJson: SceneJson | null;
  loops?: SceneLoop[] | null;
  selectedObjectId?: string | null;
  scannerPrimaryObjectId?: string | null;
  scenarioTrigger?: ScenarioActionPropagationIntent | null;
  manualActionObjectId?: string | null;
  propagationPayload?: unknown;
  previewEnabled?: boolean;
  maxDepth?: number;
  decay?: number;
};

const propagationCache = new Map<string, PropagationOverlayState>();

function normalizeId(value: string | null | undefined): string | null {
  const next = String(value ?? "").trim();
  return next.length > 0 ? next : null;
}

function buildRequestKey(params: {
  sourceId: string | null;
  sceneSignature: string;
  maxDepth: number;
  decay: number;
  triggerSignature?: string | null;
}): string | null {
  if (!params.sourceId) return null;
  return [
    params.sourceId,
    params.sceneSignature,
    params.maxDepth,
    params.decay.toFixed(3),
    params.triggerSignature ?? "default",
  ].join("::");
}

function buildTriggerSignature(trigger: ReturnType<typeof resolvePropagationTrigger>["active_trigger"]): string | null {
  if (!trigger) return null;
  if (trigger.kind === "scenario_action" && trigger.scenario_action?.intent) {
    const intent = trigger.scenario_action.intent;
    return [
      trigger.kind,
      intent.action_id,
      intent.action_kind,
      intent.mode ?? "what_if",
      Array.isArray(intent.requested_outputs) ? intent.requested_outputs.join(",") : "",
    ].join(":");
  }
  return `${trigger.kind}:${trigger.source_object_id ?? "none"}`;
}

function isValidBackendOverlay(params: {
  overlay: PropagationOverlayState | null | undefined;
  sceneJson: SceneJson | null;
  loops?: SceneLoop[] | null;
  expectedSourceId: string | null;
}): params is { overlay: PropagationOverlayState; sceneJson: SceneJson | null; loops?: SceneLoop[] | null; expectedSourceId: string | null } {
  return isPropagationOverlayCompatible({
    overlay: params.overlay,
    sceneJson: params.sceneJson,
    loops: params.loops,
    expectedSourceId: params.expectedSourceId,
  });
}

export function usePropagationBridge(params: PropagationBridgeParams) {
  const {
    sceneJson,
    loops,
    selectedObjectId = null,
    scannerPrimaryObjectId = null,
    scenarioTrigger = null,
    manualActionObjectId = null,
    propagationPayload,
    previewEnabled = true,
    maxDepth = 2,
    decay = 0.74,
  } = params;

  const [manualSourceId, setManualSourceId] = useState<string | null>(null);
  const [backendOverlay, setBackendOverlay] = useState<PropagationOverlayState | null>(null);
  const [backendOverlayKey, setBackendOverlayKey] = useState<string | null>(null);
  const [scenarioActionPayload, setScenarioActionPayload] = useState<ScenarioActionResponsePayload | null>(null);
  const [scenarioActionKey, setScenarioActionKey] = useState<string | null>(null);
  const [propagationLoading, setPropagationLoading] = useState(false);
  const [propagationError, setPropagationError] = useState<string | null>(null);
  const [refreshNonce, setRefreshNonce] = useState(0);
  const activeRequestKeyRef = useRef<string | null>(null);
  const triggerResolution = useMemo(
    () =>
      resolvePropagationTrigger({
        selectedObjectId,
        scannerPrimaryObjectId: scannerPrimaryObjectId ?? resolveScannerPrimarySource(sceneJson),
        manualActionObjectId: manualSourceId ?? manualActionObjectId,
        propagationPayload,
        scenarioTrigger,
        allowPreviewFallback: previewEnabled,
      }),
    [manualActionObjectId, manualSourceId, previewEnabled, propagationPayload, scannerPrimaryObjectId, scenarioTrigger, sceneJson, selectedObjectId]
  );
  const activeTrigger = triggerResolution.active_trigger;
  const resolvedSourceId = normalizeId(activeTrigger?.source_object_id);
  const embeddedBackendOverlay = activeTrigger?.payload ?? null;
  const embeddedScenarioPayload = useMemo(
    () =>
      activeTrigger?.kind === "scenario_action"
        ? normalizeScenarioActionResponsePayload(activeTrigger.scenario_action?.payload ?? null)
        : normalizeScenarioActionResponsePayload(propagationPayload),
    [activeTrigger?.kind, activeTrigger?.scenario_action?.payload, propagationPayload]
  );

  const sceneSignature = useMemo(
    () => buildPropagationSceneSignature({ sceneJson, loops }),
    [loops, sceneJson]
  );
  const requestKey = useMemo(
    () =>
      buildRequestKey({
        sourceId: resolvedSourceId,
        sceneSignature,
        maxDepth,
        decay,
        triggerSignature: buildTriggerSignature(activeTrigger),
      }),
    [activeTrigger, decay, maxDepth, resolvedSourceId, sceneSignature]
  );
  const sceneSupportsBackendPropagation = useMemo(
    () => hasPropagationRelations({ sceneJson, loops }),
    [loops, sceneJson]
  );

  useEffect(() => {
    if (!resolvedSourceId) {
      setBackendOverlay(null);
      setBackendOverlayKey(null);
      setScenarioActionPayload(null);
      setScenarioActionKey(null);
      setPropagationLoading(false);
      setPropagationError(null);
      activeRequestKeyRef.current = null;
      return;
    }
    if (
      embeddedBackendOverlay &&
      hasMeaningfulPropagationOverlay(embeddedBackendOverlay) &&
      isValidBackendOverlay({
        overlay: embeddedBackendOverlay,
        sceneJson,
        loops,
        expectedSourceId: resolvedSourceId,
      })
    ) {
      setBackendOverlay(embeddedBackendOverlay);
      setBackendOverlayKey(requestKey);
      if (embeddedScenarioPayload && activeTrigger?.kind === "scenario_action") {
        setScenarioActionPayload(embeddedScenarioPayload);
        setScenarioActionKey(requestKey);
      }
      setPropagationLoading(false);
      setPropagationError(null);
      activeRequestKeyRef.current = requestKey;
      return;
    }
    if (embeddedBackendOverlay && !hasMeaningfulPropagationOverlay(embeddedBackendOverlay)) {
      if (process.env.NODE_ENV !== "production") {
        console.debug("[Nexora][PropagationSkippedEmpty]", {
          sourceId: resolvedSourceId,
          reason: "embedded_overlay_not_meaningful",
        });
      }
    }
    if (
      backendOverlay &&
      !isPropagationOverlayCompatible({
        overlay: backendOverlay,
        sceneJson,
        loops,
        expectedSourceId: resolvedSourceId,
      })
    ) {
      setBackendOverlay(null);
      setBackendOverlayKey(null);
    }
    if (scenarioActionPayload && scenarioActionKey !== requestKey) {
      setScenarioActionPayload(null);
      setScenarioActionKey(null);
    }
  }, [activeTrigger?.kind, backendOverlay, embeddedBackendOverlay, embeddedScenarioPayload, loops, requestKey, resolvedSourceId, scenarioActionKey, scenarioActionPayload, sceneJson]);

  useEffect(() => {
    if (!requestKey || !resolvedSourceId) return;
    if (triggerResolution.should_reuse_payload && embeddedBackendOverlay) {
      return;
    }
    if (!triggerResolution.should_request_backend || !sceneSupportsBackendPropagation) return;

    const cached = propagationCache.get(requestKey) ?? null;
    if (
      cached &&
      isPropagationOverlayCompatible({
        overlay: cached,
        sceneJson,
        loops,
        expectedSourceId: resolvedSourceId,
      })
    ) {
      setBackendOverlay(cached);
      setBackendOverlayKey(requestKey);
      setPropagationLoading(false);
      setPropagationError(null);
      return;
    }

    let cancelled = false;
    activeRequestKeyRef.current = requestKey;
    setPropagationLoading(true);
    setPropagationError(null);

    if (process.env.NODE_ENV !== "production") {
      console.debug("[Nexora][PropagationBridge] backend request start", {
        sourceId: resolvedSourceId,
        requestKey,
      });
    }

    const requestPromise =
      activeTrigger?.kind === "scenario_action" && activeTrigger.scenario_action
        ? requestScenarioAction({
            contract: activeTrigger.scenario_action,
            sceneJson,
            loops,
            maxDepth,
            decay,
          }).then((payload) => {
            if (payload?.propagation) {
              return {
                overlay: payload.propagation,
                scenarioPayload: payload,
              };
            }
            return {
              overlay: null,
              scenarioPayload: payload,
            };
          })
        : requestPropagationSimulation({
            sourceObjectId: resolvedSourceId,
            sceneJson,
            loops,
            maxDepth,
            decay,
            mode: "preview",
          }).then((overlay) => ({ overlay, scenarioPayload: null as ScenarioActionResponsePayload | null }));

    void requestPromise.then(({ overlay, scenarioPayload }) => {
      if (cancelled) return;
      if (activeRequestKeyRef.current !== requestKey) {
        if (process.env.NODE_ENV !== "production") {
          console.debug("[Nexora][PropagationBridge] backend request stale result ignored", {
            requestKey,
            sourceId: resolvedSourceId,
          });
        }
        return;
      }
      if (
        overlay &&
        hasMeaningfulPropagationOverlay(overlay) &&
        isPropagationOverlayCompatible({
          overlay,
          sceneJson,
          loops,
          expectedSourceId: resolvedSourceId,
        })
      ) {
        propagationCache.set(requestKey, overlay);
        setBackendOverlay(overlay);
        setBackendOverlayKey(requestKey);
        if (scenarioPayload) {
          setScenarioActionPayload(scenarioPayload);
          setScenarioActionKey(requestKey);
        }
        setPropagationError(null);
        if (process.env.NODE_ENV !== "production") {
          console.debug("[Nexora][PropagationBridge] backend request success", {
            sourceId: resolvedSourceId,
            impactedCount: overlay.impacted_nodes.length,
            edgeCount: overlay.impacted_edges.length,
          });
        }
      } else if (overlay && process.env.NODE_ENV !== "production") {
        console.debug("[Nexora][PropagationSkippedEmpty]", {
          sourceId: resolvedSourceId,
          reason: "backend_overlay_not_meaningful",
        });
      } else if (process.env.NODE_ENV !== "production") {
        console.debug("[Nexora][PropagationBridge] preview fallback used", {
          sourceId: resolvedSourceId,
          requestKey,
        });
      }
      setPropagationLoading(false);
    }).catch((error) => {
      if (cancelled || activeRequestKeyRef.current !== requestKey) return;
      setPropagationLoading(false);
      setPropagationError(error instanceof Error ? error.message : "Propagation request failed");
      if (process.env.NODE_ENV !== "production") {
        console.debug("[Nexora][PropagationBridge] preview fallback used", {
          sourceId: resolvedSourceId,
          message: error instanceof Error ? error.message : String(error),
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [
    decay,
    embeddedBackendOverlay,
    loops,
    maxDepth,
    refreshNonce,
    requestKey,
    resolvedSourceId,
    sceneJson,
    sceneSupportsBackendPropagation,
    triggerResolution.should_request_backend,
    triggerResolution.should_reuse_payload,
  ]);

  const previewOverlay = useMemo(() => {
    if (!previewEnabled || !resolvedSourceId || !triggerResolution.should_fallback_preview) return null;
    const overlay = buildPreviewPropagationOverlay({
      sceneJson,
      loops,
      sourceObjectId: resolvedSourceId,
      sourceKind: "fallback_preview",
      maxDepth: Math.min(2, maxDepth),
      decay: Math.min(decay, 0.74),
    });
    if (!overlay && process.env.NODE_ENV !== "production") {
      console.debug("[Nexora][PropagationSkippedEmpty]", {
        sourceId: resolvedSourceId,
        reason: "preview_overlay_not_meaningful",
      });
    }
    return overlay;
  }, [decay, loops, maxDepth, previewEnabled, resolvedSourceId, sceneJson, triggerResolution.should_fallback_preview]);

  const propagationOverlay = useMemo(() => {
    if (
      backendOverlayKey === requestKey &&
      backendOverlay &&
      isPropagationOverlayCompatible({
        overlay: backendOverlay,
        sceneJson,
        loops,
        expectedSourceId: resolvedSourceId,
      })
    ) {
      return backendOverlay;
    }
    return previewOverlay;
  }, [backendOverlay, backendOverlayKey, loops, previewOverlay, requestKey, resolvedSourceId, sceneJson]);
  const scenarioOverlayPackage: ScenarioOverlayPackage = useMemo(
    () =>
      buildScenarioOverlayPackage(
        scenarioActionKey === requestKey ? scenarioActionPayload : embeddedScenarioPayload,
        propagationOverlay
      ),
    [embeddedScenarioPayload, propagationOverlay, requestKey, scenarioActionKey, scenarioActionPayload]
  );

  const propagationMode: PropagationModeState = propagationOverlay?.active
    ? propagationOverlay.mode === "backend"
      ? "backend"
      : "preview"
    : "idle";

  const refreshPropagation = useCallback(() => {
    if (!requestKey) return;
    propagationCache.delete(requestKey);
    setRefreshNonce((value) => value + 1);
  }, [requestKey]);

  const clearPropagation = useCallback(() => {
    setManualSourceId(null);
    setBackendOverlay(null);
    setBackendOverlayKey(null);
    setPropagationLoading(false);
    setPropagationError(null);
    activeRequestKeyRef.current = null;
  }, []);

  const setPropagationSource = useCallback((nextId: string | null) => {
    setManualSourceId(normalizeId(nextId));
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!resolvedSourceId) return;
    console.debug("[Nexora][PropagationBridge] source resolved", {
      sourceId: resolvedSourceId,
      sourceKind: activeTrigger?.kind ?? null,
      requestKey,
      propagationMode,
      resolutionReason: triggerResolution.resolution_reason,
    });
  }, [activeTrigger?.kind, propagationMode, requestKey, resolvedSourceId, triggerResolution.resolution_reason]);

  return {
    propagationOverlay: propagationOverlay as PropagationOverlayState | null,
    propagationPayload: propagationOverlay as PropagationOverlayState | null,
    scenarioOverlayPackage,
    propagationSourceId: resolvedSourceId,
    propagationMode,
    propagationLoading,
    propagationError,
    refreshPropagation,
    clearPropagation,
    setPropagationSource,
    triggerResolution,
  };
}
