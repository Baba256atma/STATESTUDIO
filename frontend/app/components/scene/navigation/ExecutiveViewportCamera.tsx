"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { OrthographicCamera, PerspectiveCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

import type { WorkspaceViewMode } from "../../../lib/workspace/workspaceViewModeTypes";
import {
  resolveExecutiveViewportCameraFrame,
  resolveExecutiveViewportOrthoBounds,
} from "../../../lib/scene/viewport/executiveViewportCameraRuntime";
import { resolveExecutiveViewportModeConfig } from "../../../lib/scene/viewport/executiveViewportModeRuntime";

export type ExecutiveViewportCameraProps = {
  viewMode: WorkspaceViewMode;
  sceneJson: unknown;
  preserveCenter?: [number, number, number] | null;
  layoutPositions?: Record<string, [number, number, number]>;
  objectCount?: number;
  layoutSignature?: string | null;
  cameraAuthorityRef?: React.MutableRefObject<{
    activeWriter: string | null;
    signature: string | null;
    cooldownUntil: number;
    appliedAt: number;
  }>;
  mountedAtMs?: number;
};

const loggedLateCameraWriteSignatures = new Set<string>();

function logLateCameraWriteOnce(input: {
  writer: string;
  reason: string;
  position: [number, number, number];
  target: [number, number, number];
  objectCount: number;
  layoutSignature?: string | null;
  authorityWriter?: string | null;
  mountedAtMs?: number;
  signature: string;
}) {
  if (process.env.NODE_ENV === "production") return;
  if (loggedLateCameraWriteSignatures.has(input.signature)) return;
  loggedLateCameraWriteSignatures.add(input.signature);
  const now = performance.now();
  console.log("[Nexora][LateCameraWrite]", {
    writer: input.writer,
    reason: input.reason,
    elapsedMs: input.mountedAtMs != null ? Number((now - input.mountedAtMs).toFixed(1)) : null,
    timestampMs: Number(now.toFixed(1)),
    authorityWriter: input.authorityWriter ?? null,
    objectCount: input.objectCount,
    layoutSignature: input.layoutSignature ?? null,
    blocked: false,
    position: input.position,
    target: input.target,
  });
}

export function ExecutiveViewportCamera(props: ExecutiveViewportCameraProps): React.ReactElement {
  const { size } = useThree();
  const modeConfig = useMemo(
    () => resolveExecutiveViewportModeConfig(props.viewMode),
    [props.viewMode]
  );
  const frame = useMemo(
    () =>
      resolveExecutiveViewportCameraFrame({
        sceneJson: props.sceneJson,
        viewMode: props.viewMode,
        viewportWidth: size.width,
        viewportHeight: size.height,
        preserveCenter: props.preserveCenter,
        layoutPositions: props.layoutPositions,
      }),
    [props.layoutPositions, props.preserveCenter, props.sceneJson, props.viewMode, size.height, size.width]
  );
  const orthoRef = useRef<THREE.OrthographicCamera>(null);
  const perspectiveRef = useRef<THREE.PerspectiveCamera>(null);

  useEffect(() => {
    if (props.viewMode !== "2D" || !frame || !orthoRef.current) return;
    const bounds = resolveExecutiveViewportOrthoBounds({
      orthoSize: frame.orthoSize,
      viewportWidth: size.width,
      viewportHeight: size.height,
    });
    const camera = orthoRef.current;
    camera.left = bounds.left;
    camera.right = bounds.right;
    camera.top = bounds.top;
    camera.bottom = bounds.bottom;
    camera.zoom = frame.zoom;
    camera.updateProjectionMatrix();
  }, [frame, props.viewMode, size.height, size.width]);

  if (props.viewMode === "2D" && frame) {
    return (
      <OrthographicCamera
        makeDefault
        ref={orthoRef}
        position={frame.position}
        zoom={frame.zoom}
        near={0.1}
        far={500}
        onUpdate={(camera) => {
          camera.lookAt(...frame.lookAt);
          logLateCameraWriteOnce({
            writer: "ExecutiveViewportCamera",
            reason: "orthographic_camera_update",
            position: frame.position,
            target: frame.lookAt,
            objectCount: props.objectCount ?? 0,
            layoutSignature: props.layoutSignature ?? null,
            authorityWriter: props.cameraAuthorityRef?.current.activeWriter ?? null,
            mountedAtMs: props.mountedAtMs,
            signature: `ortho:${props.viewMode}:${frame.position.map((value) => value.toFixed(3)).join(",")}:${frame.lookAt
              .map((value) => value.toFixed(3))
              .join(",")}`,
          });
        }}
      />
    );
  }

  const perspectiveFrame = frame ?? {
    position: [6, 9, 14] as [number, number, number],
    lookAt: [0, 0, 0] as [number, number, number],
    fov: modeConfig.executiveTiltRadians ? 42 : 42,
    zoom: 1,
    orthoSize: 12,
    operationalCenter: [0, 0, 0] as [number, number, number],
    projection: "perspective" as const,
  };

  return (
    <PerspectiveCamera
      makeDefault
      ref={perspectiveRef}
      position={perspectiveFrame.position}
      fov={perspectiveFrame.fov}
      near={0.1}
      far={250}
      onUpdate={(camera) => {
        camera.lookAt(...perspectiveFrame.lookAt);
        logLateCameraWriteOnce({
          writer: "ExecutiveViewportCamera",
          reason: "perspective_camera_update",
          position: perspectiveFrame.position,
          target: perspectiveFrame.lookAt,
          objectCount: props.objectCount ?? 0,
          layoutSignature: props.layoutSignature ?? null,
          authorityWriter: props.cameraAuthorityRef?.current.activeWriter ?? null,
          mountedAtMs: props.mountedAtMs,
          signature: `perspective:${props.viewMode}:${perspectiveFrame.position.map((value) => value.toFixed(3)).join(",")}:${perspectiveFrame.lookAt
            .map((value) => value.toFixed(3))
            .join(",")}`,
        });
      }}
    />
  );
}

export default ExecutiveViewportCamera;
