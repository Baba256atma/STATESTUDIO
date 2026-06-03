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
import { resolveExecutive3DDefaultCamera } from "../../../lib/scene/camera/executive3DCameraProfile";
import { shouldSuppressIdleDebugLog } from "../../../lib/runtime/idleRuntimeStabilityGuard";

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
const loggedViewportCameraHookAuditSignatures = new Set<string>();

function logViewportCameraHookAuditOnce(input: {
  viewMode: WorkspaceViewMode;
  hasFrame: boolean;
  renderPath: "2d_orthographic" | "3d_perspective";
}): void {
  if (process.env.NODE_ENV === "production") return;
  const signature = `${input.viewMode}:${input.hasFrame}:${input.renderPath}`;
  if (loggedViewportCameraHookAuditSignatures.has(signature)) return;
  if (shouldSuppressIdleDebugLog(`viewport-camera-hook-audit:${signature}`)) return;
  loggedViewportCameraHookAuditSignatures.add(signature);
  console.info("[Nexora][ViewportCameraHookAudit]", {
    viewMode: input.viewMode,
    hasFrame: input.hasFrame,
    renderPath: input.renderPath,
    hookAuditPassed: true,
  });
}

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
  const defaultPerspectiveFrame = useMemo(() => resolveExecutive3DDefaultCamera(), []);
  const perspectiveFrame = useMemo(
    () =>
      frame ?? {
        position: defaultPerspectiveFrame.position,
        lookAt: defaultPerspectiveFrame.lookAt,
        fov: defaultPerspectiveFrame.fov ?? 43,
        zoom: 1,
        orthoSize: 12,
        operationalCenter: [0, 0, 0] as [number, number, number],
        projection: "perspective" as const,
      },
    [defaultPerspectiveFrame, frame]
  );
  const orthoRef = useRef<THREE.OrthographicCamera>(null);
  const perspectiveRef = useRef<THREE.PerspectiveCamera>(null);
  const renderPath: "2d_orthographic" | "3d_perspective" =
    props.viewMode === "2D" && frame ? "2d_orthographic" : "3d_perspective";

  useEffect(() => {
    logViewportCameraHookAuditOnce({
      viewMode: props.viewMode,
      hasFrame: !!frame,
      renderPath,
    });
  }, [frame, props.viewMode, renderPath]);

  useEffect(() => {
    if (props.viewMode !== "2D" || !frame || !orthoRef.current) return;
    const bounds = resolveExecutiveViewportOrthoBounds({
      orthoSize: frame.orthoSize,
      viewportWidth: size.width,
      viewportHeight: size.height,
    });
    const camera = orthoRef.current;
    camera.position.set(frame.position[0], frame.position[1], frame.position[2]);
    camera.left = bounds.left;
    camera.right = bounds.right;
    camera.top = bounds.top;
    camera.bottom = bounds.bottom;
    camera.zoom = frame.zoom;
    camera.lookAt(frame.lookAt[0], frame.lookAt[1], frame.lookAt[2]);
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
