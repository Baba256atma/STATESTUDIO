import * as THREE from "three";

import type { CameraTransitionState, CameraTransitionTarget } from "../sceneNavigationCamera";

/** Quint ease-in-out — intentional acceleration and deceleration. */
export function easeExecutiveCameraProgress(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped < 0.5
    ? 4 * clamped * clamped * clamped
    : 1 - Math.pow(-2 * clamped + 2, 3) / 2;
}

export function createExecutiveCameraTransitionState(
  camera: THREE.Camera,
  controls: { target?: THREE.Vector3 } | null | undefined,
  target: CameraTransitionTarget,
  durationMs = 560
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
    durationMs: Math.max(240, durationMs),
  };
}

export function stepExecutiveCameraTransition(
  camera: THREE.Camera,
  controls: { target?: THREE.Vector3; update?: () => void } | null | undefined,
  state: CameraTransitionState,
  deltaMs: number
): boolean {
  state.elapsedMs = Math.min(state.durationMs, state.elapsedMs + deltaMs);
  const rawProgress = state.durationMs <= 0 ? 1 : state.elapsedMs / state.durationMs;
  const eased = easeExecutiveCameraProgress(rawProgress);

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

export function buildExecutiveCameraTransitionSignature(input: {
  preset: string;
  source: string;
  sceneSignature: string;
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
}): string {
  return JSON.stringify({
    preset: input.preset,
    source: input.source,
    sceneSignature: input.sceneSignature,
    position: input.position.map((value) => Math.round(value * 1000) / 1000),
    lookAt: input.lookAt.map((value) => Math.round(value * 1000) / 1000),
    fov: Math.round(input.fov * 100) / 100,
  });
}

const lastAppliedTransitionSignature = new Map<string, string>();

export function shouldApplyExecutiveCameraTransition(
  channel: string,
  signature: string
): boolean {
  const previous = lastAppliedTransitionSignature.get("global");
  if (previous === signature) return false;
  lastAppliedTransitionSignature.set("global", signature);
  lastAppliedTransitionSignature.set(channel, signature);
  return true;
}

export function resetExecutiveCameraTransitionGuardForTests(): void {
  lastAppliedTransitionSignature.clear();
}

export function applyExecutiveCameraFrameImmediate(
  camera: THREE.Camera,
  controls: { target?: THREE.Vector3; update?: () => void } | null | undefined,
  frame: {
    position: [number, number, number];
    lookAt: [number, number, number];
    operationalCenter: [number, number, number];
    fov: number;
    zoom: number;
    projection: "perspective" | "orthographic";
  }
): void {
  camera.position.set(frame.position[0], frame.position[1], frame.position[2]);
  const target = new THREE.Vector3(frame.operationalCenter[0], frame.operationalCenter[1], frame.operationalCenter[2]);
  if (controls?.target instanceof THREE.Vector3) {
    controls.target.copy(target);
    controls.update?.();
  } else {
    camera.lookAt(frame.lookAt[0], frame.lookAt[1], frame.lookAt[2]);
  }
  if (frame.projection === "orthographic" && camera instanceof THREE.OrthographicCamera) {
    camera.zoom = frame.zoom;
  }
  if (frame.projection === "perspective" && camera instanceof THREE.PerspectiveCamera) {
    camera.fov = frame.fov;
  }
  (camera as THREE.PerspectiveCamera | THREE.OrthographicCamera).updateProjectionMatrix();
}
