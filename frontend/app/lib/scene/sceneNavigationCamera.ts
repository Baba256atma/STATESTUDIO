import * as THREE from "three";

import { CALM_FRAMING } from "./calmCameraFraming";
import { EXECUTIVE_SCENE_COMPOSITION } from "./executiveSceneComposition";

export type CameraTransitionTarget = {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  fov?: number;
  zoom?: number;
};

export type CameraTransitionState = {
  fromPosition: THREE.Vector3;
  fromLookAt: THREE.Vector3;
  fromFov: number | null;
  fromZoom: number | null;
  toPosition: THREE.Vector3;
  toLookAt: THREE.Vector3;
  toFov: number | null;
  toZoom: number | null;
  elapsedMs: number;
  durationMs: number;
};

export function readCameraSnapshot(
  camera: THREE.Camera,
  controls: { target?: THREE.Vector3 } | null | undefined
): { position: [number, number, number]; target: [number, number, number] } {
  const target = controls?.target instanceof THREE.Vector3 ? controls.target : new THREE.Vector3(0, 0, 0);
  return {
    position: [camera.position.x, camera.position.y, camera.position.z],
    target: [target.x, target.y, target.z],
  };
}

export function createPreserveOrientationFocusTarget(
  camera: THREE.Camera,
  controls: { target?: THREE.Vector3 } | null | undefined,
  anchor: [number, number, number],
  options?: { maxDistanceDelta?: number }
): CameraTransitionTarget {
  const currentTarget =
    controls?.target instanceof THREE.Vector3 ? controls.target.clone() : new THREE.Vector3(0, 0, 0);
  const offset = camera.position.clone().sub(currentTarget);
  if (offset.lengthSq() < 1e-6) {
    offset.set(0, 2, 6);
  }
  const nextTarget = new THREE.Vector3(anchor[0], anchor[1], anchor[2]);
  const currentDistance = offset.length();
  const disciplinedDistance = Math.max(
    EXECUTIVE_SCENE_COMPOSITION.minCameraDistance,
    Math.min(EXECUTIVE_SCENE_COMPOSITION.maxCameraDistance, currentDistance * 0.985)
  );
  const maxDistanceDelta = Math.max(0.25, options?.maxDistanceDelta ?? 2.4);
  const distanceDelta = disciplinedDistance - currentDistance;
  const adjustedDistance =
    Math.abs(distanceDelta) > maxDistanceDelta
      ? currentDistance + Math.sign(distanceDelta) * maxDistanceDelta
      : disciplinedDistance;
  const nextPosition = nextTarget.clone().add(offset.normalize().multiplyScalar(adjustedDistance));
  return { position: nextPosition, lookAt: nextTarget };
}

export function createCameraTransitionState(
  camera: THREE.Camera,
  controls: { target?: THREE.Vector3 } | null | undefined,
  target: CameraTransitionTarget,
  durationMs = 420
): CameraTransitionState {
  const fromLookAt =
    controls?.target instanceof THREE.Vector3 ? controls.target.clone() : new THREE.Vector3(0, 0, 0);
  const perspectiveCamera = camera as THREE.PerspectiveCamera;
  const orthographicCamera = camera as THREE.OrthographicCamera;
  const fromZoom =
    typeof orthographicCamera.zoom === "number" && Number.isFinite(orthographicCamera.zoom)
      ? orthographicCamera.zoom
      : null;
  return {
    fromPosition: camera.position.clone(),
    fromLookAt,
    fromFov:
      typeof perspectiveCamera.fov === "number" && Number.isFinite(perspectiveCamera.fov)
        ? perspectiveCamera.fov
        : null,
    fromZoom,
    toPosition: target.position.clone(),
    toLookAt: target.lookAt.clone(),
    toFov: typeof target.fov === "number" && Number.isFinite(target.fov) ? target.fov : null,
    toZoom: typeof target.zoom === "number" && Number.isFinite(target.zoom) ? target.zoom : null,
    elapsedMs: 0,
    durationMs,
  };
}

export function stepCameraTransition(
  camera: THREE.Camera,
  controls: { target?: THREE.Vector3; update?: () => void } | null | undefined,
  state: CameraTransitionState,
  deltaMs: number
): boolean {
  state.elapsedMs = Math.min(state.durationMs, state.elapsedMs + deltaMs);
  const t = state.durationMs <= 0 ? 1 : state.elapsedMs / state.durationMs;
  const eased = t * t * (3 - 2 * t);

  if (
    !Number.isFinite(state.toPosition.x) ||
    !Number.isFinite(state.toPosition.y) ||
    !Number.isFinite(state.toPosition.z) ||
    !Number.isFinite(state.toLookAt.x) ||
    !Number.isFinite(state.toLookAt.y) ||
    !Number.isFinite(state.toLookAt.z)
  ) {
    return true;
  }

  camera.position.lerpVectors(state.fromPosition, state.toPosition, eased);
  const nextLookAt = new THREE.Vector3().lerpVectors(state.fromLookAt, state.toLookAt, eased);
  if (state.fromFov != null && state.toFov != null && camera instanceof THREE.PerspectiveCamera) {
    camera.fov = THREE.MathUtils.lerp(state.fromFov, state.toFov, eased);
  }
  if (state.fromZoom != null && state.toZoom != null && camera instanceof THREE.OrthographicCamera) {
    camera.zoom = THREE.MathUtils.lerp(state.fromZoom, state.toZoom, eased);
  }

  if (controls?.target) {
    controls.target.copy(nextLookAt);
    controls.update?.();
  } else {
    camera.lookAt(nextLookAt);
  }
  (camera as THREE.PerspectiveCamera | THREE.OrthographicCamera).updateProjectionMatrix();

  return state.elapsedMs >= state.durationMs;
}

export function dollyCameraAlongView(
  camera: THREE.Camera,
  controls: { target?: THREE.Vector3; update?: () => void } | null | undefined,
  direction: "in" | "out",
  delta = 0.85
): void {
  const target =
    controls?.target instanceof THREE.Vector3 ? controls.target : new THREE.Vector3(0, 0, 0);
  const offset = camera.position.clone().sub(target);
  if (offset.lengthSq() < 1e-6) {
    offset.set(0, 0, 1);
  }
  offset.normalize();
  const signedDelta = direction === "in" ? -delta : delta;
  const currentDistance = camera.position.distanceTo(target);
  const nextDistance = Math.max(
    EXECUTIVE_SCENE_COMPOSITION.minCameraDistance,
    Math.min(EXECUTIVE_SCENE_COMPOSITION.maxCameraDistance, currentDistance + signedDelta)
  );
  camera.position.copy(target).addScaledVector(offset, nextDistance);
  (camera as THREE.PerspectiveCamera | THREE.OrthographicCamera).updateProjectionMatrix();
  controls?.update?.();
}

export const EXECUTIVE_CAMERA_DEFAULT = {
  position: [0, 8, 20] as [number, number, number],
  lookAt: [0, 0, 0] as [number, number, number],
};

/** Calm transition duration aligned with executive camera policy. */
export const SCENE_NAVIGATION_TRANSITION_MS = Math.round(
  (1 / Math.max(CALM_FRAMING.shellCameraLerp, 0.01)) * 16
);
