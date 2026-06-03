"use client";

import React, { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";

import { computeTopologyCameraFrame } from "../../../lib/scene/topology/topologyCameraFrame";
import { logTopologyCameraBrake } from "../../../lib/scene/topology/topologyCameraDevLog";
import type { ScenePosition } from "../../../lib/scene/topology/topologyScenePositioning";

export type TopologyCameraAutoFrameProps = {
  enabled: boolean;
  positions: readonly ScenePosition[];
  topologySignature: string;
  userCameraLocked?: boolean;
  controlsRef?: React.MutableRefObject<{ target?: { set: (x: number, y: number, z: number) => void }; update?: () => void } | null>;
  programmaticCameraUpdateRef?: React.MutableRefObject<boolean>;
};

function markProgrammaticCameraUpdate(ref?: React.MutableRefObject<boolean>): void {
  if (!ref) return;
  ref.current = true;
  queueMicrotask(() => {
    ref.current = false;
  });
}

function TopologyCameraAutoFrameComponent({
  enabled,
  positions,
  topologySignature,
  userCameraLocked = false,
  controlsRef,
  programmaticCameraUpdateRef,
}: TopologyCameraAutoFrameProps): null {
  const { camera } = useThree();
  const lastAppliedSignatureRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      lastAppliedSignatureRef.current = null;
      return;
    }
    if (userCameraLocked) {
      logTopologyCameraBrake("Camera fit skipped because user camera lock is active");
      return;
    }
    if (!topologySignature || lastAppliedSignatureRef.current === topologySignature) {
      return;
    }

    const frame = computeTopologyCameraFrame({ positions });
    if (!frame.valid) {
      return;
    }

    markProgrammaticCameraUpdate(programmaticCameraUpdateRef);
    camera.position.set(
      frame.cameraPosition.x,
      frame.cameraPosition.y,
      frame.cameraPosition.z
    );
    camera.lookAt(frame.target.x, frame.target.y, frame.target.z);
    camera.updateProjectionMatrix();

    const controls = controlsRef?.current;
    if (controls?.target?.set) {
      controls.target.set(frame.target.x, frame.target.y, frame.target.z);
      controls.update?.();
    }

    lastAppliedSignatureRef.current = topologySignature;
  }, [
    camera,
    controlsRef,
    enabled,
    positions,
    programmaticCameraUpdateRef,
    topologySignature,
    userCameraLocked,
  ]);

  return null;
}

export const TopologyCameraAutoFrame = React.memo(TopologyCameraAutoFrameComponent);
