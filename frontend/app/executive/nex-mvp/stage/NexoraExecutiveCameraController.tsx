"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Vector3 } from "three";
import {
  EXECUTIVE_STAGE_FIXED_CAMERA,
  resolveExecutiveStageFixedCamera,
  resolveExecutiveStageFixedCameraAtDistance,
} from "@/app/lib/spatial-presentation/executiveStage2DFixedCamera";
import { EXECUTIVE_STAGE_MOTION } from "@/app/lib/spatial-presentation/executiveStageMotion";
import type { NexoraMVPStageCameraPresentation } from "@/app/lib/nex-mvp/nexora3DExecutiveStage";

type Props = {
  readonly camera: NexoraMVPStageCameraPresentation;
  readonly fitDistance?: number;
};

/**
 * STAGE-2D:1 — Active Executive Stage camera authority.
 *
 * Fixed restrained off-axis PerspectiveCamera looking at Stage center (0,0,0).
 * STAGE-CAMERA:FIX1 may increase distance to fit the Safe Stage Viewport.
 * No orbit, pan, user zoom, pointer parallax, or cinematic retargeting.
 */
export function NexoraExecutiveCameraController({ camera, fitDistance }: Props) {
  const lookAt = useRef(new Vector3());
  const appliedDistance = useRef(EXECUTIVE_STAGE_FIXED_CAMERA.distance);
  const reducedMotion = useRef(false);
  void camera;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      reducedMotion.current = media.matches;
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useFrame((state, delta) => {
    const threeCamera = state.camera;
    const targetDistance =
      typeof fitDistance === "number" && Number.isFinite(fitDistance)
        ? fitDistance
        : EXECUTIVE_STAGE_FIXED_CAMERA.distance;
    const durationSec =
      (reducedMotion.current
        ? EXECUTIVE_STAGE_MOTION.reducedMotionDurationMs
        : EXECUTIVE_STAGE_MOTION.topologyDurationMs) / 1000;
    if (reducedMotion.current || durationSec <= 0) {
      appliedDistance.current = targetDistance;
    } else {
      const t = Math.min(1, Math.max(0.08, delta / durationSec));
      appliedDistance.current =
        appliedDistance.current +
        (targetDistance - appliedDistance.current) * t;
    }

    const fixed = resolveExecutiveStageFixedCameraAtDistance(
      appliedDistance.current,
    );

    threeCamera.position.set(
      fixed.position.x,
      fixed.position.y,
      fixed.position.z,
    );
    lookAt.current.set(fixed.target.x, fixed.target.y, fixed.target.z);
    threeCamera.lookAt(lookAt.current);

    if (threeCamera instanceof PerspectiveCamera) {
      let projectionDirty = false;

      if (threeCamera.fov !== fixed.fov) {
        threeCamera.fov = fixed.fov;
        projectionDirty = true;
      }
      if (threeCamera.near !== fixed.near) {
        threeCamera.near = fixed.near;
        projectionDirty = true;
      }
      if (threeCamera.far !== fixed.far) {
        threeCamera.far = fixed.far;
        projectionDirty = true;
      }
      if (projectionDirty) {
        threeCamera.updateProjectionMatrix();
      }
    }

    void EXECUTIVE_STAGE_FIXED_CAMERA.orbitEnabled;
    void EXECUTIVE_STAGE_FIXED_CAMERA.pointerOffset;
    void resolveExecutiveStageFixedCamera;
  });

  return null;
}
