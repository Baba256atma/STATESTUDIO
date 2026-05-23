"use client";

import React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

import {
  createCameraTransitionState,
  createPreserveOrientationFocusTarget,
  dollyCameraAlongView,
  EXECUTIVE_CAMERA_DEFAULT,
  readCameraSnapshot,
  stepCameraTransition,
  type CameraTransitionState,
} from "../../../lib/scene/sceneNavigationCamera";
import {
  SCENE_NAVIGATION_ACTION_EVENT,
  SCENE_NAVIGATION_FOCUS_EVENT,
  SCENE_NAVIGATION_MODE_EVENT,
  SCENE_NAVIGATION_PRESET_EVENT,
} from "../../../lib/scene/sceneNavigationContract";
import { bindWindowListener } from "../../../lib/dom/domListenerLifecycle";
import { resolveSceneObjectHudPosition } from "../../../lib/scene/resolveSceneObjectHudPosition";
import type {
  SceneNavigationActionId,
  SceneNavigationFocusRequest,
  SceneNavigationMode,
} from "../../../lib/scene/sceneNavigationTypes";
import {
  logSceneNavigationCameraFocus,
  logSceneNavigationCameraReset,
  logSceneNavigationFitScene,
  logSceneNavigationPresetSelected,
  logSceneNavigationToolbarAction,
} from "../../../lib/ui/sceneNavigationInstrumentation";

export type SceneNavigationControllerProps = {
  controlsRef: React.MutableRefObject<{ target?: THREE.Vector3; update?: () => void } | null>;
  sceneJson: unknown;
  selectedObjectId?: string | null;
  onRequestStaticReframe: () => void;
  enabled?: boolean;
};

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

  const startTransition = React.useCallback(
    (targetPosition: THREE.Vector3, targetLookAt: THREE.Vector3) => {
      transitionRef.current = createCameraTransitionState(camera, props.controlsRef.current, {
        position: targetPosition,
        lookAt: targetLookAt,
      });
    },
    [camera, props.controlsRef]
  );

  useFrame((_, delta) => {
    const transition = transitionRef.current;
    if (!transition) return;
    const finished = stepCameraTransition(camera, props.controlsRef.current, transition, delta * 1000);
    if (finished) transitionRef.current = null;
  });

  React.useEffect(() => {
    if (props.enabled === false) return undefined;

    const handleFocus = (event: Event) => {
      const detail = (event as CustomEvent<SceneNavigationFocusRequest>).detail;
      const objectId = detail?.objectId?.trim();
      if (!objectId) return;
      const anchor = resolveSceneObjectHudPosition(props.sceneJson, objectId);
      if (!anchor) return;
      logSceneNavigationCameraFocus({
        objectId,
        source: detail.source,
        selectedObjectId: props.selectedObjectId ?? null,
        camera: snapshotPayload(camera, props.controlsRef.current, objectId, navigationModeRef.current),
      });
      if (detail.animate === false) {
        const controls = props.controlsRef.current;
        if (controls?.target) {
          controls.target.set(anchor[0], anchor[1], anchor[2]);
          controls.update?.();
        } else {
          camera.lookAt(anchor[0], anchor[1], anchor[2]);
        }
        return;
      }
      const target = createPreserveOrientationFocusTarget(camera, props.controlsRef.current, anchor);
      startTransition(target.position, target.lookAt);
    };

    const handleAction = (event: Event) => {
      const detail = (event as CustomEvent<{ action?: SceneNavigationActionId; source?: string }>).detail;
      const action = detail?.action;
      if (!action || action === "select_preset" || action === "fullscreen") return;

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
        startTransition(
          new THREE.Vector3(...EXECUTIVE_CAMERA_DEFAULT.position),
          new THREE.Vector3(...EXECUTIVE_CAMERA_DEFAULT.lookAt)
        );
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
        dollyCameraAlongView(camera, props.controlsRef.current, "in");
        return;
      }

      if (action === "zoom_out") {
        dollyCameraAlongView(camera, props.controlsRef.current, "out");
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
    camera,
    props.controlsRef,
    props.enabled,
    props.onRequestStaticReframe,
    props.sceneJson,
    props.selectedObjectId,
    startTransition,
  ]);

  return null;
}

export default SceneNavigationController;
