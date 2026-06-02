"use client";

import React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

import {
  dollyCameraAlongView,
  readCameraSnapshot,
  type CameraTransitionState,
} from "../../../lib/scene/sceneNavigationCamera";
import { getWorkspaceViewMode } from "../../../lib/workspace/workspaceViewModeRuntime";
import {
  buildExecutiveSceneObjectSignature,
  isValidExecutiveCameraFrame,
  normalizeExecutiveCameraPresetId,
  readExecutiveSceneObjects,
  resolveExecutiveCameraPresetFrame,
  type ExecutiveCameraPresetId,
} from "../../../lib/scene/executiveCameraPresets";
import {
  buildExecutiveCameraContextSignature,
  describeExecutiveCameraContextReason,
  mapToolbarPresetToExecutivePreset,
  resolveExecutiveCameraPresetFromContext,
  type ExecutiveCameraContextInput,
} from "../../../lib/scene/camera/executiveCameraContextRuntime";
import {
  armExecutiveCameraMemory,
  saveExecutiveCameraMemory,
} from "../../../lib/scene/camera/executiveCameraMemoryRuntime";
import {
  buildExecutiveCameraTransitionSignature,
  createExecutiveCameraTransitionState,
  shouldApplyExecutiveCameraTransition,
  stepExecutiveCameraTransition,
} from "../../../lib/scene/camera/executiveCameraTransitionRuntime";
import { logExecutiveCameraTransition } from "../../../lib/scene/camera/executiveCameraDiagnostics";
import {
  SCENE_NAVIGATION_ACTION_EVENT,
  SCENE_NAVIGATION_FOCUS_EVENT,
  SCENE_NAVIGATION_MODE_EVENT,
  SCENE_NAVIGATION_PRESET_EVENT,
} from "../../../lib/scene/sceneNavigationContract";
import { bindWindowListener } from "../../../lib/dom/domListenerLifecycle";
import { evaluateCameraStability } from "../../../lib/scene/density";
import { resolveSceneObjectHudPosition } from "../../../lib/scene/resolveSceneObjectHudPosition";
import type {
  SceneNavigationActionId,
  SceneNavigationFocusRequest,
  SceneNavigationMode,
} from "../../../lib/scene/sceneNavigationTypes";
import { isCameraPresetId } from "../../../lib/scene/sceneNavigationTypes";
import {
  logSceneNavigationCameraFocus,
  logSceneNavigationCameraReset,
  logSceneNavigationFitScene,
  logSceneNavigationPresetSelected,
  logSceneNavigationToolbarAction,
} from "../../../lib/ui/sceneNavigationInstrumentation";
import { readSceneNavigationPresetId } from "../../../lib/scene/sceneNavigationContract";

export type SceneNavigationControllerProps = {
  controlsRef: React.MutableRefObject<{ target?: THREE.Vector3; update?: () => void } | null>;
  sceneJson: unknown;
  layoutPositions?: Record<string, [number, number, number]>;
  selectedObjectId?: string | null;
  cameraContext?: ExecutiveCameraContextInput;
  cameraAuthorityRef?: React.MutableRefObject<{
    activeWriter: string | null;
    signature: string | null;
    cooldownUntil: number;
    appliedAt: number;
  }>;
  programmaticCameraUpdateRef?: React.MutableRefObject<boolean>;
  layoutSignature?: string | null;
  mountedAtMs?: number;
  onRequestStaticReframe: () => void;
  onClearTemporaryFocus?: () => void;
  enabled?: boolean;
};

const NAVIGATION_CAMERA_AUTHORITY_COOLDOWN_MS = 800;
const loggedNavigationCameraWriteSignatures = new Set<string>();
const loggedNavigationCameraAuthorityBlocks = new Set<string>();
const loggedCameraStartupGuardSignatures = new Set<string>();
const loggedCameraStartupBlockedSignatures = new Set<string>();
const loggedLateCameraWriteSignatures = new Set<string>();

function markProgrammaticCameraUpdate(ref?: React.MutableRefObject<boolean>) {
  if (!ref) return;
  ref.current = true;
  queueMicrotask(() => {
    ref.current = false;
  });
}

function logNavigationCameraWriteOnce(input: {
  writer: string;
  objectCount: number;
  preset?: string | null;
  focusObjectId?: string | null;
  position: [number, number, number];
  target: [number, number, number];
  signature: string;
}) {
  if (process.env.NODE_ENV === "production") return;
  if (loggedNavigationCameraWriteSignatures.has(input.signature)) return;
  loggedNavigationCameraWriteSignatures.add(input.signature);
  console.log("[Nexora][CameraWrite]", {
    writer: input.writer,
    objectCount: input.objectCount,
    preset: input.preset ?? null,
    focusObjectId: input.focusObjectId ?? null,
    position: input.position,
    target: input.target,
    signature: input.signature,
  });
}

function logNavigationCameraAuthorityBlock(input: {
  activeWriter: string | null;
  blockedWriter: string;
  reason: string;
  signature: string;
}) {
  if (process.env.NODE_ENV === "production") return;
  const logSignature = JSON.stringify(input);
  if (loggedNavigationCameraAuthorityBlocks.has(logSignature)) return;
  loggedNavigationCameraAuthorityBlocks.add(logSignature);
  console.log("[Nexora][CameraAuthority]", input);
}

function logLateCameraWriteOnce(input: {
  writer: string;
  reason: string;
  objectCount: number;
  layoutSignature?: string | null;
  authorityWriter?: string | null;
  position: [number, number, number];
  target: [number, number, number];
  blocked?: boolean;
  mountedAtMs?: number;
  signature: string;
}) {
  if (process.env.NODE_ENV === "production") return;
  if (loggedLateCameraWriteSignatures.has(input.signature)) return;
  loggedLateCameraWriteSignatures.add(input.signature);
  const now = performance.now();
  console.log("[Nexora][LateCameraWrite]", {
    writer: input.writer,
    timeSinceMountMs: input.mountedAtMs != null ? Number((now - input.mountedAtMs).toFixed(1)) : null,
    position: input.position,
    target: input.target,
    reason: input.reason,
    objectCount: input.objectCount,
    layoutSignature: input.layoutSignature ?? null,
    authorityWriter: input.authorityWriter ?? null,
    blocked: input.blocked === true,
  });
}

function logCameraStartupGuardOnce(input: {
  reason: string;
  preset: ExecutiveCameraPresetId;
  selectedObjectId: string | null;
  objectCount: number;
  signature: string;
}) {
  if (process.env.NODE_ENV === "production") return;
  if (loggedCameraStartupGuardSignatures.has(input.signature)) return;
  loggedCameraStartupGuardSignatures.add(input.signature);
  console.log("[Nexora][CameraStartupGuard]", {
    reason: input.reason,
    preset: input.preset,
    selectedObjectId: input.selectedObjectId,
    objectCount: input.objectCount,
  });
}

function logCameraStartupBlockedOnce(input: {
  reason: string;
  preset: ExecutiveCameraPresetId;
  selectedObjectId: string | null;
  objectCount: number;
  signature: string;
}) {
  if (process.env.NODE_ENV === "production") return;
  if (loggedCameraStartupBlockedSignatures.has(input.signature)) return;
  loggedCameraStartupBlockedSignatures.add(input.signature);
  console.log("[Nexora][CameraStartupBlocked]", {
    reason: input.reason,
    preset: input.preset,
    selectedObjectId: input.selectedObjectId,
    objectCount: input.objectCount,
  });
}

function claimNavigationCameraAuthority(input: {
  authorityRef?: SceneNavigationControllerProps["cameraAuthorityRef"];
  writer: string;
  signature: string;
  reason: string;
  override?: boolean;
}): boolean {
  const authority = input.authorityRef?.current;
  if (!authority) return true;
  const now = performance.now();
  const competingWriter = Boolean(authority.activeWriter && authority.activeWriter !== input.writer);
  if (!input.override && authority.activeWriter === "visual_bounds_frame") {
    logNavigationCameraAuthorityBlock({
      activeWriter: authority.activeWriter,
      blockedWriter: input.writer,
      reason: input.reason,
      signature: input.signature,
    });
    return false;
  }
  if (!input.override && competingWriter && now < authority.cooldownUntil) {
    logNavigationCameraAuthorityBlock({
      activeWriter: authority.activeWriter,
      blockedWriter: input.writer,
      reason: `${input.reason}:cooldown`,
      signature: input.signature,
    });
    return false;
  }
  authority.activeWriter = input.writer;
  authority.signature = input.signature;
  authority.appliedAt = now;
  authority.cooldownUntil = now + NAVIGATION_CAMERA_AUTHORITY_COOLDOWN_MS;
  return true;
}

function snapshotPayload(
  camera: THREE.Camera,
  controls: SceneNavigationControllerProps["controlsRef"]["current"],
  selectedObjectId: string | null,
  mode?: SceneNavigationMode
): Record<string, unknown> {
  const snap = readCameraSnapshot(camera, controls);
  return {
    ...snap,
    mode,
    selectedObjectId,
  };
}

export function SceneNavigationController(props: SceneNavigationControllerProps): null {
  const { camera } = useThree();
  const transitionRef = React.useRef<CameraTransitionState | null>(null);
  const navigationModeRef = React.useRef<SceneNavigationMode>("select");
  const lastContextSignatureRef = React.useRef<string | null>(null);
  const lastAppliedPresetRef = React.useRef<string | null>(null);
  const previousSelectedObjectRef = React.useRef<string | null>(null);
  const startupCameraGuardRef = React.useRef(false);

  const startTransition = React.useCallback(
    (
      targetPosition: THREE.Vector3,
      targetLookAt: THREE.Vector3,
      durationMs = 560,
      fov?: number,
      zoom?: number
    ) => {
      transitionRef.current = createExecutiveCameraTransitionState(
        camera,
        props.controlsRef.current,
        {
          position: targetPosition,
          lookAt: targetLookAt,
          fov,
          zoom,
        },
        durationMs
      );
    },
    [camera, props.controlsRef]
  );

  const applyExecutivePreset = React.useCallback(
    (
      preset: ExecutiveCameraPresetId,
      source: string,
      options?: {
        durationMs?: number;
        focusObjectId?: string | null;
        channel?: string;
        overrideAuthority?: boolean;
      }
    ) => {
      const normalizedPreset = normalizeExecutiveCameraPresetId(preset);
      const mode =
        preset === "VIEW_2D" ? "2D" : preset === "VIEW_3D" ? "3D" : getWorkspaceViewMode();
      const size =
        typeof window !== "undefined"
          ? { width: window.innerWidth, height: window.innerHeight }
          : { width: 1440, height: 900 };
      const focusObjectId = options?.focusObjectId ?? props.selectedObjectId ?? null;
      const objects = readExecutiveSceneObjects(props.sceneJson);
      const normalizedFocusObjectId = focusObjectId?.trim() || null;
      if (
        normalizedPreset === "FOCUS" &&
        normalizedFocusObjectId === "nexora_core" &&
        options?.overrideAuthority !== true
      ) {
        logNavigationCameraAuthorityBlock({
          activeWriter: props.cameraAuthorityRef?.current.activeWriter ?? null,
          blockedWriter: "SceneNavigationController",
          reason: "blocked_implicit_nexora_core_focus",
          signature: `${source}:${normalizedPreset}:${normalizedFocusObjectId}`,
        });
        return false;
      }
      const frame = resolveExecutiveCameraPresetFrame({
        preset,
        mode,
        sceneJson: props.sceneJson,
        viewportWidth: size.width,
        viewportHeight: size.height,
        focusObjectId: normalizedPreset === "FOCUS" ? normalizedFocusObjectId : null,
        layoutPositions: props.layoutPositions,
      });
      if (!isValidExecutiveCameraFrame(frame)) return false;

      const sceneSignature = buildExecutiveSceneObjectSignature(props.sceneJson, props.layoutPositions);
      const signature = buildExecutiveCameraTransitionSignature({
        preset: normalizedPreset,
        source,
        sceneSignature,
        position: frame.position,
        lookAt: frame.lookAt,
        fov: frame.fov,
      });
      const channel = options?.channel ?? "executive-preset";
      if (!shouldApplyExecutiveCameraTransition(channel, signature)) {
        return false;
      }
      if (
        !claimNavigationCameraAuthority({
          authorityRef: props.cameraAuthorityRef,
          writer: "SceneNavigationController",
          signature,
          reason: source,
          override: options?.overrideAuthority === true,
        })
      ) {
        logLateCameraWriteOnce({
          writer: "SceneNavigationController",
          reason: `blocked_navigation_preset:${source}`,
          objectCount: objects.length,
          layoutSignature: props.layoutSignature ?? sceneSignature,
          authorityWriter: props.cameraAuthorityRef?.current.activeWriter ?? null,
          position: frame.position,
          target: frame.lookAt,
          blocked: true,
          mountedAtMs: props.mountedAtMs,
          signature: `blocked_navigation:${signature}`,
        });
        return false;
      }

      startTransition(
        new THREE.Vector3(...frame.position),
        new THREE.Vector3(...frame.lookAt),
        options?.durationMs ?? 560,
        frame.fov,
        typeof (frame as { zoom?: number }).zoom === "number" ? (frame as { zoom?: number }).zoom : undefined
      );
      logNavigationCameraWriteOnce({
        writer: "SceneNavigationController",
        objectCount: objects.length,
        preset: normalizedPreset,
        focusObjectId: normalizedPreset === "FOCUS" ? normalizedFocusObjectId : null,
        position: frame.position,
        target: frame.lookAt,
        signature: `SceneNavigationController:${signature}`,
      });
      logLateCameraWriteOnce({
        writer: "SceneNavigationController",
        reason: options?.overrideAuthority === true ? `explicit_navigation_preset:${source}` : `automatic_navigation_preset:${source}`,
        objectCount: objects.length,
        layoutSignature: props.layoutSignature ?? sceneSignature,
        authorityWriter: props.cameraAuthorityRef?.current.activeWriter ?? null,
        position: frame.position,
        target: frame.lookAt,
        blocked: false,
        mountedAtMs: props.mountedAtMs,
        signature: `late_navigation:${signature}`,
      });
      lastAppliedPresetRef.current = signature;
      logExecutiveCameraTransition(signature, {
        preset: normalizedPreset,
        source,
        focusObjectId: normalizedPreset === "FOCUS" ? normalizedFocusObjectId : null,
        position: frame.position,
        target: frame.lookAt,
        fov: frame.fov,
      });
      return true;
    },
    [props.cameraAuthorityRef, props.layoutPositions, props.layoutSignature, props.mountedAtMs, props.sceneJson, props.selectedObjectId, startTransition]
  );

  useFrame((_, delta) => {
    const transition = transitionRef.current;
    if (!transition) return;
    markProgrammaticCameraUpdate(props.programmaticCameraUpdateRef);
    const finished = stepExecutiveCameraTransition(
      camera,
      props.controlsRef.current,
      transition,
      delta * 1000
    );
    if (finished) transitionRef.current = null;
  });

  React.useEffect(() => {
    const contextInput: ExecutiveCameraContextInput = {
      ...(props.cameraContext ?? {}),
      selectedObjectId: props.selectedObjectId ?? props.cameraContext?.selectedObjectId ?? null,
      manualPresetId: props.cameraContext?.manualPresetId ?? readSceneNavigationPresetId(),
      workspaceViewMode: props.cameraContext?.workspaceViewMode ?? getWorkspaceViewMode(),
    };
    const contextSignature = buildExecutiveCameraContextSignature(contextInput);
    const selectedObjectId = contextInput.selectedObjectId?.trim() || null;
    const previousSelected = previousSelectedObjectRef.current;
    const objectCount = readExecutiveSceneObjects(props.sceneJson).length;
    const contextPreset = resolveExecutiveCameraPresetFromContext(contextInput);
    const resolvedPreset = contextPreset === "FOCUS" ? "GLOBAL" : contextPreset;
    const contextReason = describeExecutiveCameraContextReason(contextInput, resolvedPreset);

    if (previousSelected && !selectedObjectId) {
      logCameraStartupBlockedOnce({
        reason: "automatic_memory_restore_blocked",
        preset: resolvedPreset,
        selectedObjectId,
        objectCount,
        signature: `memory_restore:${contextSignature}`,
      });
      const snap = readCameraSnapshot(camera, props.controlsRef.current);
      logLateCameraWriteOnce({
        writer: "CameraMemory",
        reason: "blocked_automatic_memory_restore",
        objectCount,
        layoutSignature: props.layoutSignature ?? null,
        authorityWriter: props.cameraAuthorityRef?.current.activeWriter ?? null,
        position: snap.position,
        target: snap.target,
        blocked: true,
        mountedAtMs: props.mountedAtMs,
        signature: `blocked_camera_memory:${contextSignature}`,
      });
    }

    if (!previousSelected && selectedObjectId) {
      armExecutiveCameraMemory("selection_started");
      const snap = readCameraSnapshot(camera, props.controlsRef.current);
      saveExecutiveCameraMemory({
        position: snap.position,
        target: snap.target,
        fov: camera instanceof THREE.PerspectiveCamera ? camera.fov : null,
        reason: "before_focus",
      });
    }
    previousSelectedObjectRef.current = selectedObjectId;

    if (lastContextSignatureRef.current === contextSignature) return;
    lastContextSignatureRef.current = contextSignature;

    if (!startupCameraGuardRef.current) {
      startupCameraGuardRef.current = true;
      logCameraStartupGuardOnce({
        reason: `initial_context_evaluation:${contextReason}`,
        preset: resolvedPreset,
        selectedObjectId,
        objectCount,
        signature: `initial:${contextSignature}`,
      });
      logCameraStartupBlockedOnce({
        reason: "blocked_initial_context_auto_preset",
        preset: resolvedPreset,
        selectedObjectId,
        objectCount,
        signature: `initial:${contextSignature}`,
      });
      return;
    }

    logCameraStartupBlockedOnce({
      reason:
        props.cameraAuthorityRef?.current.activeWriter === "visual_bounds_frame"
          ? `blocked_context_auto_preset_visual_bounds_authority:${contextReason}`
          : `blocked_context_auto_preset:${contextReason}`,
      preset: resolvedPreset,
      selectedObjectId,
      objectCount,
      signature: `context:${contextSignature}:${props.cameraAuthorityRef?.current.activeWriter ?? "none"}`,
    });
  }, [
    props.cameraContext,
    props.cameraAuthorityRef,
    props.controlsRef,
    props.layoutSignature,
    props.mountedAtMs,
    props.sceneJson,
    props.selectedObjectId,
  ]);

  React.useEffect(() => {
    if (props.enabled === false) return undefined;

    const handleFocus = (event: Event) => {
      const detail = (event as CustomEvent<SceneNavigationFocusRequest>).detail;
      const objectId = detail?.objectId?.trim();
      if (!objectId) return;
      const anchor = resolveSceneObjectHudPosition(props.sceneJson, objectId);
      if (!anchor) return;
      const objects = readExecutiveSceneObjects(props.sceneJson);
      const stability = evaluateCameraStability({
        trigger: "focus_object",
        nextObjectCount: objects.length,
      });
      if (!stability.allowFocusTransition) return;
      logSceneNavigationCameraFocus({
        objectId,
        source: detail.source,
        selectedObjectId: props.selectedObjectId ?? null,
        camera: snapshotPayload(camera, props.controlsRef.current, objectId, navigationModeRef.current),
      });
      if (detail.animate === false) {
        const directSignature = `SceneNavigationController:direct_focus:${objectId}:${anchor
          .map((value) => value.toFixed(3))
          .join(",")}`;
        if (
          !claimNavigationCameraAuthority({
            authorityRef: props.cameraAuthorityRef,
            writer: "SceneNavigationController",
            signature: directSignature,
            reason: detail.source ?? "focus",
            override: true,
          })
        ) {
          return;
        }
        const controls = props.controlsRef.current;
        if (controls?.target) {
          markProgrammaticCameraUpdate(props.programmaticCameraUpdateRef);
          controls.target.set(anchor[0], anchor[1], anchor[2]);
          controls.update?.();
        } else {
          markProgrammaticCameraUpdate(props.programmaticCameraUpdateRef);
          camera.lookAt(anchor[0], anchor[1], anchor[2]);
        }
        logNavigationCameraWriteOnce({
          writer: "SceneNavigationController",
          objectCount: objects.length,
          preset: "FOCUS",
          focusObjectId: objectId,
          position: camera.position.toArray() as [number, number, number],
          target: anchor,
          signature: directSignature,
        });
        return;
      }
      applyExecutivePreset("FOCUS", detail.source ?? "focus", {
        focusObjectId: objectId,
        durationMs: stability.transitionDurationMs,
        channel: "focus-object",
        overrideAuthority: true,
      });
    };

    const handleAction = (event: Event) => {
      const detail = (event as CustomEvent<{ action?: SceneNavigationActionId; source?: string }>).detail;
      const action = detail?.action;
      if (!action || action === "fullscreen") return;
      if (action === "select_preset") {
        props.onRequestStaticReframe();
        return;
      }

      logSceneNavigationToolbarAction({
        action,
        source: detail?.source ?? "toolbar",
        selectedObjectId: props.selectedObjectId ?? null,
        camera: snapshotPayload(
          camera,
          props.controlsRef.current,
          props.selectedObjectId ?? null,
          navigationModeRef.current
        ),
      });

      if (action === "fit_scene") {
        logSceneNavigationFitScene({
          source: detail?.source ?? "toolbar",
          camera: snapshotPayload(camera, props.controlsRef.current, props.selectedObjectId ?? null),
        });
        props.onRequestStaticReframe();
        return;
      }

      if (action === "reset_view") {
        logSceneNavigationCameraReset({
          source: detail?.source ?? "toolbar",
          camera: snapshotPayload(camera, props.controlsRef.current, props.selectedObjectId ?? null),
        });
        applyExecutivePreset("GLOBAL", detail?.source ?? "toolbar", {
          channel: "toolbar-reset",
          overrideAuthority: true,
        });
        return;
      }

      if (action === "focus_selection") {
        const objectId = props.selectedObjectId?.trim() || null;
        if (!objectId) return;
        handleFocus(
          new CustomEvent(SCENE_NAVIGATION_FOCUS_EVENT, {
            detail: { objectId, source: detail?.source ?? "toolbar", animate: true },
          })
        );
        return;
      }

      if (action === "zoom_in") {
        const before = readCameraSnapshot(camera, props.controlsRef.current);
        dollyCameraAlongView(camera, props.controlsRef.current, "in");
        armExecutiveCameraMemory("zoom_in");
        const after = readCameraSnapshot(camera, props.controlsRef.current);
        logNavigationCameraWriteOnce({
          writer: "SceneNavigationController",
          objectCount: readExecutiveSceneObjects(props.sceneJson).length,
          preset: "zoom_in",
          focusObjectId: null,
          position: after.position,
          target: after.target,
          signature: `SceneNavigationController:zoom_in:${before.position.join(",")}:${after.position.join(",")}`,
        });
        return;
      }

      if (action === "zoom_out") {
        const before = readCameraSnapshot(camera, props.controlsRef.current);
        dollyCameraAlongView(camera, props.controlsRef.current, "out");
        armExecutiveCameraMemory("zoom_out");
        const after = readCameraSnapshot(camera, props.controlsRef.current);
        logNavigationCameraWriteOnce({
          writer: "SceneNavigationController",
          objectCount: readExecutiveSceneObjects(props.sceneJson).length,
          preset: "zoom_out",
          focusObjectId: null,
          position: after.position,
          target: after.target,
          signature: `SceneNavigationController:zoom_out:${before.position.join(",")}:${after.position.join(",")}`,
        });
      }
    };

    const handleMode = (event: Event) => {
      const mode = (event as CustomEvent<{ mode?: SceneNavigationMode }>).detail?.mode;
      if (!mode) return;
      navigationModeRef.current = mode;
    };

    const handlePreset = (event: Event) => {
      const presetId = (event as CustomEvent<{ presetId?: string }>).detail?.presetId;
      if (!presetId) return;
      logSceneNavigationPresetSelected({
        presetId,
        source: (event as CustomEvent<{ source?: string }>).detail?.source ?? "toolbar",
      });
      if (presetId === "global") {
        props.onClearTemporaryFocus?.();
      }
      if (!isCameraPresetId(presetId)) return;
      const mappedPreset = mapToolbarPresetToExecutivePreset(presetId);
      applyExecutivePreset(mappedPreset, (event as CustomEvent<{ source?: string }>).detail?.source ?? "toolbar", {
        channel: `toolbar-preset:${presetId}`,
        overrideAuthority: true,
      });
    };

    const handleLegacy = (event: Event) => {
      const action = (event as CustomEvent<{ action?: string }>).detail?.action;
      if (!action) return;
      const mapped =
        action === "fit_view"
          ? "fit_scene"
          : action === "reset_view"
            ? "reset_view"
            : action === "focus_selection"
              ? "focus_selection"
              : action === "zoom_in"
                ? "zoom_in"
                : action === "zoom_out"
                  ? "zoom_out"
                  : null;
      if (!mapped) return;
      handleAction(new CustomEvent(SCENE_NAVIGATION_ACTION_EVENT, { detail: { action: mapped, source: "legacy" } }));
    };

    const meta = { component: "SceneNavigationController" };
    const detachFocus = bindWindowListener(SCENE_NAVIGATION_FOCUS_EVENT, handleFocus as EventListener, undefined, {
      ...meta,
      eventType: SCENE_NAVIGATION_FOCUS_EVENT,
    });
    const detachAction = bindWindowListener(SCENE_NAVIGATION_ACTION_EVENT, handleAction as EventListener, undefined, {
      ...meta,
      eventType: SCENE_NAVIGATION_ACTION_EVENT,
    });
    const detachMode = bindWindowListener(SCENE_NAVIGATION_MODE_EVENT, handleMode as EventListener, undefined, {
      ...meta,
      eventType: SCENE_NAVIGATION_MODE_EVENT,
    });
    const detachPreset = bindWindowListener(SCENE_NAVIGATION_PRESET_EVENT, handlePreset as EventListener, undefined, {
      ...meta,
      eventType: SCENE_NAVIGATION_PRESET_EVENT,
    });
    const detachLegacy = bindWindowListener("nexora:camera-toolbar-action", handleLegacy as EventListener, undefined, {
      ...meta,
      eventType: "nexora:camera-toolbar-action",
    });
    return () => {
      detachFocus();
      detachAction();
      detachMode();
      detachPreset();
      detachLegacy();
    };
  }, [
    applyExecutivePreset,
    camera,
    props.controlsRef,
    props.enabled,
    props.onClearTemporaryFocus,
    props.onRequestStaticReframe,
    props.sceneJson,
    props.selectedObjectId,
  ]);

  return null;
}

export default SceneNavigationController;
