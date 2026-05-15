/**
 * Scene Apply Controller — `useSceneApplyController`
 *
 * **Owns:** scene *write* orchestration (`applySceneChangeSafe`, dedupe/safety refs, bridge wiring in `useEffect`,
 * `emitSceneApplyDiagnostic`, `traceSceneWrite` / dev merge helpers used on the write path).
 * **Does not own:** React `sceneJson` state — the shell (`HomeScreen`) keeps `useState` and passes `sceneJson` + `setSceneJson`.
 *
 * **External consumers** (logic lives outside this file): right panel, chat pipeline, Type-C, ingestion — they invoke
 * the apply callback or bridge refs only; do not fold those zones in here without an explicit extraction prompt.
 *
 * **Cursor / AI:** Prefer this file + `useSceneApplyController.types.ts` + the `useSceneApplyController({…})` call site
 * in `HomeScreen.tsx` for scene-write work. Avoid loading all of `HomeScreen.tsx` unless bridge wiring, `sceneJson`
 * ownership, or a cross-consumer regression requires it.
 */

import { useCallback, useEffect, useMemo, useRef } from "react";

import type { SceneJson } from "../../../lib/sceneTypes.ts";
import { traceSceneWrite, type SceneWriteSource } from "../../../lib/debug/sceneWriteTrace.ts";
import { buildSceneSemanticSignature } from "../../../lib/scene/sceneSemanticSignature.ts";
import { asRecord, getHighlightedObjectIdsFromSelection } from "../../homeScreenResponseReaders.ts";
import {
  SCENE_APPLY_CONTROLLER_EXTRACTION_PLAN,
  type ApplySceneChangeSafe,
  type SceneApplyBridgeName,
  type SceneApplyControllerCallbacks,
  type SceneApplyControllerRefs,
  type SceneApplyControllerState,
  type SceneApplyDiagnosticEventName,
  type SceneApplyDiagnosticPayload,
  type SceneApplyOptions,
  type UseSceneApplyControllerContract,
  type UseSceneApplyControllerInput,
} from "./useSceneApplyController.types.ts";

export type UseSceneApplyControllerResult = UseSceneApplyControllerContract &
  Readonly<{
    extractionPlan: typeof SCENE_APPLY_CONTROLLER_EXTRACTION_PLAN;
  }>;

function countSceneObjectsForApply(scene: unknown): number {
  return Array.isArray((scene as { scene?: { objects?: unknown[] } } | null)?.scene?.objects)
    ? ((scene as { scene: { objects: unknown[] } }).scene.objects.length)
    : 0;
}

function countSceneObjectsSafe(scene: SceneJson | null): number {
  const objects = scene?.scene?.objects;
  return Array.isArray(objects) ? objects.length : 0;
}

/** O2:6 — dev-only: one `[Nexora][SceneApply][BridgeConnected]` log per bridge name per page load. */
const __nexoraO26BridgeConnectedLogged = new Set<SceneApplyBridgeName>();

/**
 * Public contract — `useSceneApplyController(input)`
 *
 * **Inputs:** `sceneJson`, `setSceneJson`, `selectedObjectId`, `focusedObjectId`, optional `refs` (shared semantic /
 * render / write-ref overrides), `lastSceneResetTraceSigRef` (shared reset-trace dedupe), `sceneApplyConsoleDebug`,
 * optional `bridgeRefs` (e.g. `applyTypeCSceneUpdateRef`).
 *
 * **Outputs (`callbacks`):** `applySceneChangeSafe`, `emitSceneApplyDiagnostic`, `getSceneObjectCount`,
 * `getSceneSemanticSignature`. **Also:** `state`, `refs`, `extractionPlan` on the returned contract object.
 */
export function useSceneApplyController(input: UseSceneApplyControllerInput): UseSceneApplyControllerResult {
  const { setSceneJson, sceneApplyConsoleDebug, lastSceneResetTraceSigRef } = input;
  const writeSourceOverrideRef = input.refs?.lastSceneWriteSourceRef;
  const writeAtOverrideRef = input.refs?.lastSceneWriteAtRef;
  const typeCBridgeRef = input.bridgeRefs?.applyTypeCSceneUpdateRef;

  const lastSceneApplySigRefOwned = useRef<string | null>(null);
  const placeholderSemantic = useRef<string | null>(null);
  const placeholderRender = useRef<string | null>(null);
  const lastSceneWriteSourceRefOwned = useRef<string | null>(null);
  const lastSceneWriteAtRefOwned = useRef<number | null>(null);
  const lastDuplicateJsonApplyLogSigRef = useRef<string | null>(null);

  const emitSceneApplyDiagnostic = useCallback(
    (name: SceneApplyDiagnosticEventName, payload: SceneApplyDiagnosticPayload = {}) => {
      if (process.env.NODE_ENV === "production") return;
      try {
        const at = Date.now();
        const merged: SceneApplyDiagnosticPayload = { ...payload, at };

        if (name === "apply_skipped") {
          const sr = payload.skippedReason ?? "";
          if (
            sr === "semantic_visual_match_inside_apply" ||
            sr === "upstream_semantic_map" ||
            sr === "panel_only_no_op"
          ) {
            if (sr === "panel_only_no_op") {
              globalThis.console.debug("[Nexora][SceneApplyBlocked][PanelOnlyChange]", {
                source: payload.source,
                objectCountBefore: payload.objectCountBefore,
                objectCountAfter: payload.objectCountAfter,
              });
              return;
            }
            sceneApplyConsoleDebug("[Nexora][UpstreamDedup][Skipped]", {
              type: "scene",
              source: payload.source ?? "",
              signature: payload.signature ?? payload.semanticSig ?? null,
            });
            return;
          }
          if (sr === "unified_reaction_duplicate_semantic") {
            globalThis.console.debug("[Nexora][SceneApply][SkippedDuplicateSemantic]", {
              semanticSig: payload.signature ?? payload.semanticSig ?? null,
            });
            return;
          }
        }

        if (name === "destructive_reset_blocked" && payload.reason === "workspace_empty_payload_after_hydration") {
          globalThis.console.warn("[Nexora][WorkspaceSceneClearBlocked]", merged);
          return;
        }

        if (name === "bridge_connected") {
          const bridgeName = payload.bridgeName as SceneApplyBridgeName | undefined;
          if (bridgeName && !__nexoraO26BridgeConnectedLogged.has(bridgeName)) {
            __nexoraO26BridgeConnectedLogged.add(bridgeName);
            globalThis.console.info("[Nexora][SceneApply][BridgeConnected]", {
              bridgeName,
              connected: payload.connected ?? true,
              extractionPhase: payload.extractionPhase ?? "O2:6",
              at,
            });
          }
          return;
        }

        if (name === "duplicate_scene_write_skipped") {
          globalThis.console.debug(`[Nexora][SceneApply][${name}]`, merged);
          return;
        }

        if (name === "apply_committed") {
          globalThis.console.debug("[SceneApply]", payload.bucket ?? payload.source ?? "scene");
          return;
        }

        globalThis.console.debug(`[Nexora][SceneApply][${name}]`, merged);
      } catch {
        /* dev diagnostics must never throw */
      }
    },
    [sceneApplyConsoleDebug]
  );

  const resolvedRefs = useMemo<SceneApplyControllerRefs>(
    () => ({
      lastSceneApplySigRef: lastSceneApplySigRefOwned,
      lastSceneResetTraceSigRef,
      lastSceneSemanticSignatureRef:
        input.refs?.lastSceneSemanticSignatureRef ?? placeholderSemantic,
      lastSceneRenderSignatureRef: input.refs?.lastSceneRenderSignatureRef ?? placeholderRender,
      lastSceneWriteSourceRef: writeSourceOverrideRef ?? lastSceneWriteSourceRefOwned,
      lastSceneWriteAtRef: writeAtOverrideRef ?? lastSceneWriteAtRefOwned,
    }),
    [
      lastSceneResetTraceSigRef,
      input.refs?.lastSceneRenderSignatureRef,
      input.refs?.lastSceneSemanticSignatureRef,
      writeAtOverrideRef,
      writeSourceOverrideRef,
      lastSceneApplySigRefOwned,
      lastSceneWriteAtRefOwned,
      lastSceneWriteSourceRefOwned,
      placeholderRender,
      placeholderSemantic,
    ]
  );

  const applySceneChangeSafe = useCallback<ApplySceneChangeSafe>(
    (nextOrUpdater, source, options?: SceneApplyOptions) => {
      setSceneJson((prev) => {
        const next =
          typeof nextOrUpdater === "function"
            ? (nextOrUpdater as (p: SceneJson | null) => SceneJson | null)(prev)
            : nextOrUpdater;
        if (next === prev) return prev;
        const nextObjects = Array.isArray(next?.scene?.objects) ? next.scene.objects : [];
        const prevCount = countSceneObjectsForApply(prev);
        const nextCount = countSceneObjectsForApply(next);
        const isSceneHydrationWrite = prevCount === 0 && nextCount > 0;
        const isWorkspaceEmptySceneClear =
          source === "workspace" && prevCount > 0 && nextCount === 0;
        if (isWorkspaceEmptySceneClear) {
          emitSceneApplyDiagnostic("destructive_reset_blocked", {
            source: String(source),
            reason: "workspace_empty_payload_after_hydration",
            objectCountBefore: prevCount,
            objectCountAfter: nextCount,
          });
          return prev;
        }
        const isResetCandidate =
          source === "workspace" || next == null || (prevCount > 0 && nextCount === 0);
        if (process.env.NODE_ENV !== "production" && isResetCandidate) {
          const resetTrace = {
            source,
            prevCount,
            nextCount,
            reason:
              source === "workspace"
                ? "workspace_apply"
                : next == null
                  ? "scene_null"
                  : prevCount > 0 && nextCount === 0
                    ? "objects_cleared"
                    : "unknown",
          };
          const resetSig = JSON.stringify(resetTrace);
          if (lastSceneResetTraceSigRef.current !== resetSig) {
            lastSceneResetTraceSigRef.current = resetSig;
            globalThis.console.warn("[Nexora][SceneParity][SceneResetCandidate]", resetTrace);
          }
        }
        const objectIds = nextObjects
          .map((obj: unknown, idx: number) => {
            const o = asRecord(obj);
            return String(o?.id ?? o?.name ?? `${o?.type ?? "obj"}:${idx}`);
          })
          .filter(Boolean);
        const nextSelection = asRecord(next)?.object_selection;
        const highlightedIds = getHighlightedObjectIdsFromSelection(nextSelection);
        const shouldDim = (nextSelection as { dim_unrelated_objects?: boolean } | null)?.dim_unrelated_objects === true;
        const dimmedIds = shouldDim ? objectIds.filter((id) => !highlightedIds.includes(id)) : [];
        const semanticSig = buildSceneSemanticSignature({
          objectIds,
          highlightedIds,
          dimmedIds,
          selectedId: null,
          reactionMode: null,
          propagationSource: source,
        });
        const prevObjects = Array.isArray(prev?.scene?.objects) ? prev.scene.objects : [];
        const prevObjectIds = prevObjects
          .map((obj: unknown, idx: number) => {
            const o = asRecord(obj);
            return String(o?.id ?? o?.name ?? `${o?.type ?? "obj"}:${idx}`);
          })
          .filter(Boolean);
        const prevSelection = asRecord(prev)?.object_selection;
        const prevHighlightedIds = getHighlightedObjectIdsFromSelection(prevSelection);
        const prevShouldDim =
          (prevSelection as { dim_unrelated_objects?: boolean } | null)?.dim_unrelated_objects === true;
        const prevDimmedIds = prevShouldDim
          ? prevObjectIds.filter((id) => !prevHighlightedIds.includes(id))
          : [];
        const prevSemanticSig = buildSceneSemanticSignature({
          objectIds: prevObjectIds,
          highlightedIds: prevHighlightedIds,
          dimmedIds: prevDimmedIds,
          selectedId: null,
          reactionMode: null,
          propagationSource: source,
        });
        const stablePrevObjects = prevObjects
          .map((obj: unknown, idx: number) => {
            const o = asRecord(obj);
            return {
              id: String(o?.id ?? o?.name ?? `${o?.type ?? "obj"}:${idx}`),
              type: String(o?.type ?? ""),
              label: String(o?.label ?? o?.name ?? ""),
              state: String(o?.state ?? o?.status ?? ""),
            };
          })
          .sort((a, b) => a.id.localeCompare(b.id));
        const stableNextObjects = nextObjects
          .map((obj: unknown, idx: number) => {
            const o = asRecord(obj);
            return {
              id: String(o?.id ?? o?.name ?? `${o?.type ?? "obj"}:${idx}`),
              type: String(o?.type ?? ""),
              label: String(o?.label ?? o?.name ?? ""),
              state: String(o?.state ?? o?.status ?? ""),
            };
          })
          .sort((a, b) => a.id.localeCompare(b.id));
        const hasExplicitObjectMutation =
          JSON.stringify(stablePrevObjects) !== JSON.stringify(stableNextObjects);
        const prevVisualSig = JSON.stringify({
          scene: asRecord(prev)?.scene ?? null,
          selection: prevSelection ?? null,
        });
        const nextVisualSig = JSON.stringify({
          scene: asRecord(next)?.scene ?? null,
          selection: nextSelection ?? null,
        });
        const normalizedSource = String(source ?? "").toLowerCase();
        const isPanelDrivenSource =
          normalizedSource.includes("panel") ||
          normalizedSource.includes("rightpanelhost") ||
          normalizedSource.includes("dashboard");
        const hasNoMeaningfulSceneMutation =
          !hasExplicitObjectMutation &&
          prevSemanticSig === semanticSig &&
          prevVisualSig === nextVisualSig;
        if (isPanelDrivenSource && hasNoMeaningfulSceneMutation) {
          emitSceneApplyDiagnostic("apply_skipped", {
            skippedReason: "panel_only_no_op",
            source: String(source),
            objectCountBefore: prevCount,
            objectCountAfter: nextCount,
          });
          return prev;
        }
        if (prevSemanticSig === semanticSig && prevVisualSig === nextVisualSig) {
          emitSceneApplyDiagnostic("apply_skipped", {
            skippedReason: "semantic_visual_match_inside_apply",
            source: String(source),
            signature: semanticSig,
            semanticSig,
          });
          return prev;
        }
        const sceneWriteSource: SceneWriteSource = source.includes("propagation")
          ? "propagation"
          : source === "chat" || source === "unified_reaction" || source.includes("intent")
            ? "chat"
            : source === "selection"
              ? "selection"
              : source.includes("click") || source.includes("manual") || source.includes("ui")
                ? "ui_event"
                : source.includes("ingestion")
                  ? "ingestion"
                  : source.includes("fallback")
                    ? "system_fallback"
                    : "system";
        const shouldBypassSceneWriteDuplicateGuard =
          isSceneHydrationWrite &&
          (source === "workspace" ||
            source === "demo" ||
            source.includes("hydrate") ||
            source.includes("restore") ||
            source.includes("initial"));
        if (process.env.NODE_ENV !== "production" && shouldBypassSceneWriteDuplicateGuard) {
          globalThis.console.warn("[Nexora][SceneHydration][Allowed]", {
            source,
            prevCount,
            nextCount,
            objectIds,
          });
        }
        const allowed = shouldBypassSceneWriteDuplicateGuard
          ? true
          : traceSceneWrite({
              source: sceneWriteSource,
              semanticSig,
              context: {
                writer: "HomeScreen.applySceneChangeSafe",
                reason: source,
                highlightedCount: highlightedIds.length,
                objectCount: objectIds.length,
                isSceneHydrationWrite,
              },
            });
        if (typeof window !== "undefined") {
          const w = window as unknown as {
            __NEXORA_DEBUG__?: { chatPipeline?: Record<string, unknown> };
          };
          const prevDebug = (w.__NEXORA_DEBUG__?.chatPipeline ?? {}) as Record<string, unknown>;
          w.__NEXORA_DEBUG__ = {
            ...(w.__NEXORA_DEBUG__ ?? {}),
            chatPipeline: {
              ...prevDebug,
              sceneWrite: {
                source: sceneWriteSource,
                semanticSig,
                blocked: !allowed,
              },
              updatedAt: Date.now(),
            },
          };
        }
        if (!allowed) {
          return prev;
        }
        const sig = next == null ? "__scene_null__" : JSON.stringify(next);
        if (!options?.bypassDedupe && lastSceneApplySigRefOwned.current === sig && !isSceneHydrationWrite) {
          if (lastDuplicateJsonApplyLogSigRef.current !== sig) {
            lastDuplicateJsonApplyLogSigRef.current = sig;
            emitSceneApplyDiagnostic("duplicate_scene_write_skipped", {
              source: String(source),
              signature: sig,
              skippedReason: "json_sig_match",
            });
          }
          return prev;
        }
        lastSceneApplySigRefOwned.current = sig;
        lastDuplicateJsonApplyLogSigRef.current = null;
        if (process.env.NODE_ENV !== "production") {
          const bucket =
            source === "nexora_decision_assistant" ||
            source === "intent_pipeline" ||
            source.includes("intent")
              ? "intent_pipeline"
              : source === "feedback" ||
                  source === "execution" ||
                  source === "product_flow" ||
                  source === "timeline" ||
                  source === "snapshot" ||
                  source === "unified_reaction" ||
                  source === "chat"
                ? "chat"
                : source.includes("scan")
                  ? "scanner"
                  : source;
          emitSceneApplyDiagnostic("apply_committed", {
            source: String(source),
            bucket,
            objectCountBefore: prevCount,
            objectCountAfter: nextCount,
            applied: true,
          });
        }
        if (next === prev) return prev;
        const writeSourceRef = writeSourceOverrideRef ?? lastSceneWriteSourceRefOwned;
        const writeAtRef = writeAtOverrideRef ?? lastSceneWriteAtRefOwned;
        writeSourceRef.current = String(source);
        writeAtRef.current = Date.now();
        return next;
      });
    },
    [
      emitSceneApplyDiagnostic,
      lastSceneApplySigRefOwned,
      lastDuplicateJsonApplyLogSigRef,
      lastSceneResetTraceSigRef,
      lastSceneWriteAtRefOwned,
      lastSceneWriteSourceRefOwned,
      setSceneJson,
      writeAtOverrideRef,
      writeSourceOverrideRef,
    ]
  );

  const getSceneObjectCount = useCallback(
    () => countSceneObjectsSafe(input.sceneJson),
    [input.sceneJson]
  );

  const getSceneSemanticSignature = useCallback(
    () => resolvedRefs.lastSceneSemanticSignatureRef.current ?? null,
    [resolvedRefs.lastSceneSemanticSignatureRef]
  );

  const state = useMemo<SceneApplyControllerState>(
    () => ({
      sceneJson: input.sceneJson,
      sceneObjectCount: countSceneObjectsSafe(input.sceneJson),
      selectedObjectId: input.selectedObjectId,
      focusedObjectId: input.focusedObjectId,
    }),
    [input.focusedObjectId, input.sceneJson, input.selectedObjectId]
  );

  const callbacks = useMemo<SceneApplyControllerCallbacks>(
    () => ({
      applySceneChangeSafe,
      emitSceneApplyDiagnostic,
      getSceneObjectCount,
      getSceneSemanticSignature,
    }),
    [applySceneChangeSafe, emitSceneApplyDiagnostic, getSceneObjectCount, getSceneSemanticSignature]
  );

  useEffect(() => {
    if (!typeCBridgeRef) return undefined;
    const apply = applySceneChangeSafe;
    typeCBridgeRef.current = apply;
    emitSceneApplyDiagnostic("bridge_connected", {
      bridgeName: "type_c",
      connected: true,
      extractionPhase: "O2:6",
    });
    return () => {
      if (typeCBridgeRef.current === apply) typeCBridgeRef.current = null;
    };
  }, [applySceneChangeSafe, emitSceneApplyDiagnostic, typeCBridgeRef]);

  return useMemo(
    (): UseSceneApplyControllerResult => ({
      state,
      refs: resolvedRefs,
      callbacks,
      extractionPlan: SCENE_APPLY_CONTROLLER_EXTRACTION_PLAN,
    }),
    [callbacks, resolvedRefs, state]
  );
}
