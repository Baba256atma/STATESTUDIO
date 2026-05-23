import * as THREE from "three";

import { CALM_FRAMING } from "./calmCameraFraming";

export type CameraTransitionTarget = {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
};

export type CameraTransitionState = {
  fromPosition: THREE.Vector3;
  fromLookAt: THREE.Vector3;
  toPosition: THREE.Vector3;
  toLookAt: THREE.Vector3;
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
  anchor: [number, number, number]
): CameraTransitionTarget {
  const currentTarget =
    controls?.target instanceof THREE.Vector3 ? controls.target.clone() : new THREE.Vector3(0, 0, 0);
  const offset = camera.position.clone().sub(currentTarget);
  if (offset.lengthSq() < 1e-6) {
    offset.set(0, 2, 6);
  }
  const nextTarget = new THREE.Vector3(anchor[0], anchor[1], anchor[2]);
  const nextPosition = nextTarget.clone().add(offset);
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
  return {
    fromPosition: camera.position.clone(),
    fromLookAt,
    toPosition: target.position.clone(),
    toLookAt: target.lookAt.clone(),
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

  camera.position.lerpVectors(state.fromPosition, state.toPosition, eased);
  const nextLookAt = new THREE.Vector3().lerpVectors(state.fromLookAt, state.toLookAt, eased);

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
  camera.position.addScaledVector(offset, signedDelta);
  (camera as THREE.PerspectiveCamera | THREE.OrthographicCamera).updateProjectionMatrix();
  controls?.update?.();
}

export const EXECUTIVE_CAMERA_DEFAULT = {
  position: [0, 6, 14] as [number, number, number],
  lookAt: [0, 0, 0] as [number, number, number],
};

/** Calm transition duration aligned with executive camera policy. */
export const SCENE_NAVIGATION_TRANSITION_MS = Math.round(
  (1 / Math.max(CALM_FRAMING.shellCameraLerp, 0.01)) * 16
);
