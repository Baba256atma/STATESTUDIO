"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Vector3 } from "three";
import {
  EXECUTIVE_STAGE_FIXED_CAMERA,
  resolveExecutiveStageFixedCamera,
} from "@/app/lib/spatial-presentation/executiveStage2DFixedCamera";
import type { NexoraMVPStageCameraPresentation } from "@/app/lib/nex-mvp/nexora3DExecutiveStage";

type Props = {
  readonly camera: NexoraMVPStageCameraPresentation;
};

/**
 * STAGE-2D:1 — Active Executive Stage camera authority.
 *
 * Fixed front-facing PerspectiveCamera looking at Stage center (0,0,0).
 * Presentation camera props are accepted for API compatibility but cannot
 * override the fixed-camera contract (focus / selection / attention / nav).
 *
 * No orbit, pan, zoom, or cinematic retargeting.
 */
export function NexoraExecutiveCameraController({ camera }: Props) {
  const { camera: threeCamera } = useThree();
  const lookAt = useRef(new Vector3());
  // Keep prop referenced so React Compiler / callers retain the Stage contract
  // surface; STAGE-2D:1 ignores variance and always applies the fixed pose.
  void camera;

  useFrame(() => {
    const fixed = resolveExecutiveStageFixedCamera();

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

    // Hard invariant — STAGE-2D:1 forbids user/controls-driven camera motion.
    void EXECUTIVE_STAGE_FIXED_CAMERA.orbitEnabled;
  });

  return null;
}
