"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

import type { WorkspaceViewMode } from "../../../lib/workspace/workspaceViewModeTypes";
import {
  buildExecutiveOrbitConfigSignature,
  resolveExecutiveOrbitRuntimeConfig,
  sanitizeExecutiveOrbitTarget,
} from "../../../lib/scene/interaction/executiveOrbitRuntime";
import {
  logExecutiveOrbit,
  logExecutivePan,
  logExecutiveZoom,
} from "../../../lib/scene/interaction/executiveInteractionDiagnostics";
import { patchExecutiveInteractionState } from "../../../lib/scene/interaction/executiveInteractionStateRuntime";
import { armExecutiveCameraMemory } from "../../../lib/scene/camera/executiveCameraMemoryRuntime";

type OrbitControlsImpl = {
  target?: THREE.Vector3;
  minDistance?: number;
  maxDistance?: number;
  minZoom?: number;
  maxZoom?: number;
  update?: () => void;
  mouseButtons?: { LEFT: number; MIDDLE: number; RIGHT: number };
};

export type ExecutiveOrbitControlsProps = {
  controlsRef: React.MutableRefObject<OrbitControlsImpl | null>;
  sceneJson: unknown;
  viewMode: WorkspaceViewMode;
  enabled: boolean;
  isInteracting?: boolean;
  programmaticCameraUpdateRef?: React.MutableRefObject<boolean>;
  cameraAuthorityRef?: React.MutableRefObject<{
    activeWriter: string | null;
    signature: string | null;
    cooldownUntil: number;
    appliedAt: number;
  }>;
  layoutSignature?: string | null;
  mountedAtMs?: number;
  onStart?: () => void;
  onEnd?: () => void;
};

const loggedOrbitGuardSignatures = new Set<string>();
const loggedLateCameraWriteSignatures = new Set<string>();

function markProgrammaticCameraUpdate(ref?: React.MutableRefObject<boolean>) {
  if (!ref) return;
  ref.current = true;
  queueMicrotask(() => {
    ref.current = false;
  });
}

function logOrbitGuardOnce(input: {
  blocked: true;
  kind: "orbit_start" | "orbit_end";
  reason: "programmatic_camera_update";
}) {
  if (process.env.NODE_ENV === "production") return;
  const signature = `${input.kind}:${input.reason}`;
  if (loggedOrbitGuardSignatures.has(signature)) return;
  loggedOrbitGuardSignatures.add(signature);
  console.log("[Nexora][OrbitGuard]", input);
}

function logLateCameraWriteOnce(input: {
  writer: string;
  reason: string;
  position?: [number, number, number] | null;
  target?: [number, number, number] | null;
  objectCount: number;
  layoutSignature?: string | null;
  authorityWriter?: string | null;
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
    reason: input.reason,
    objectCount: input.objectCount,
    layoutSignature: input.layoutSignature ?? null,
    elapsedMs: input.mountedAtMs != null ? Number((now - input.mountedAtMs).toFixed(1)) : null,
    timestampMs: Number(now.toFixed(1)),
    authorityWriter: input.authorityWriter ?? null,
    blocked: input.blocked === true,
    position: input.position ?? null,
    target: input.target ?? null,
  });
}

export function ExecutiveOrbitControls(props: ExecutiveOrbitControlsProps): React.ReactElement {
  const { invalidate } = useThree();
  const lastAppliedConfigSignatureRef = useRef<string | null>(null);
  const interactingRef = useRef(false);
  const config = useMemo(
    () =>
      resolveExecutiveOrbitRuntimeConfig({
        viewMode: props.viewMode,
        sceneJson: props.sceneJson,
      }),
    [props.sceneJson, props.viewMode]
  );
  const configSignature = useMemo(
    () =>
      buildExecutiveOrbitConfigSignature({
        viewMode: props.viewMode,
        sceneJson: props.sceneJson,
      }),
    [props.sceneJson, props.viewMode]
  );

  useEffect(() => {
    patchExecutiveInteractionState({ viewMode: props.viewMode });
  }, [props.viewMode]);

  useEffect(() => {
    const controls = props.controlsRef.current;
    if (!controls || lastAppliedConfigSignatureRef.current === configSignature) return;
    lastAppliedConfigSignatureRef.current = configSignature;
    controls.minDistance = config.minDistance;
    controls.maxDistance = config.maxDistance;
    controls.minZoom = config.minZoom;
    controls.maxZoom = config.maxZoom;
    const target = sanitizeExecutiveOrbitTarget(config.target);
    if (controls.target instanceof THREE.Vector3) {
      const currentTarget = controls.target.toArray() as [number, number, number];
      const visualBoundsOwnsCamera = props.cameraAuthorityRef?.current.activeWriter === "visual_bounds_frame";
      logLateCameraWriteOnce({
        writer: "ExecutiveOrbitControls",
        reason: visualBoundsOwnsCamera ? "blocked_orbit_config_target_visual_bounds_authority" : "orbit_config_target",
        position: null,
        target,
        objectCount: config.objectCount,
        layoutSignature: props.layoutSignature ?? null,
        authorityWriter: props.cameraAuthorityRef?.current.activeWriter ?? null,
        blocked: visualBoundsOwnsCamera,
        mountedAtMs: props.mountedAtMs,
        signature: `orbit_config_target:${configSignature}:${visualBoundsOwnsCamera ? 1 : 0}:${target
          .map((value) => value.toFixed(3))
          .join(",")}:${currentTarget.map((value) => value.toFixed(3)).join(",")}`,
      });
      if (!visualBoundsOwnsCamera) {
        markProgrammaticCameraUpdate(props.programmaticCameraUpdateRef);
        controls.target.set(target[0], target[1], target[2]);
      }
    }
    markProgrammaticCameraUpdate(props.programmaticCameraUpdateRef);
    controls.update?.();
  }, [
    config.maxDistance,
    config.maxZoom,
    config.minDistance,
    config.minZoom,
    config.target,
    configSignature,
    props.cameraAuthorityRef,
    props.controlsRef,
    props.layoutSignature,
    props.mountedAtMs,
    props.programmaticCameraUpdateRef,
  ]);

  useFrame(() => {
    markProgrammaticCameraUpdate(props.programmaticCameraUpdateRef);
    props.controlsRef.current?.update?.();
    if (props.enabled && (interactingRef.current || props.isInteracting)) {
      invalidate();
    }
  });

  const handleStart = () => {
    if (props.programmaticCameraUpdateRef?.current) {
      logOrbitGuardOnce({
        blocked: true,
        kind: "orbit_start",
        reason: "programmatic_camera_update",
      });
      return;
    }
    interactingRef.current = true;
    const kind: "orbit" | "pan" = props.viewMode === "2D" ? "pan" : "orbit";
    patchExecutiveInteractionState({
      orbitActive: kind === "orbit",
      panActive: kind === "pan",
      zoomActive: false,
    });
    armExecutiveCameraMemory(`executive_${kind}`);
    const signature = `${kind}:${configSignature}`;
    if (kind === "orbit") {
      logExecutiveOrbit(signature, { viewMode: props.viewMode, objectCount: config.objectCount });
    } else {
      logExecutivePan(signature, { viewMode: props.viewMode, objectCount: config.objectCount });
    }
    props.onStart?.();
  };

  const handleEnd = () => {
    if (props.programmaticCameraUpdateRef?.current) {
      logOrbitGuardOnce({
        blocked: true,
        kind: "orbit_end",
        reason: "programmatic_camera_update",
      });
      return;
    }
    interactingRef.current = false;
    patchExecutiveInteractionState({
      orbitActive: false,
      panActive: false,
      zoomActive: false,
    });
    props.onEnd?.();
  };

  return (
    <OrbitControls
      ref={props.controlsRef as React.Ref<any>}
      enabled={props.enabled}
      enableZoom={config.enableZoom}
      enableRotate={config.enableRotate}
      enablePan={config.enablePan}
      enableDamping={config.enableDamping}
      dampingFactor={config.dampingFactor}
      rotateSpeed={config.rotateSpeed}
      panSpeed={config.panSpeed}
      zoomSpeed={config.zoomSpeed}
      zoomToCursor={config.zoomToCursor}
      autoRotate={false}
      minDistance={config.minDistance}
      maxDistance={config.maxDistance}
      minZoom={config.minZoom}
      maxZoom={config.maxZoom}
      minPolarAngle={config.minPolarAngle}
      maxPolarAngle={config.maxPolarAngle}
      mouseButtons={config.mouseButtons}
      screenSpacePanning={config.screenSpacePanning}
      onStart={handleStart}
      onEnd={handleEnd}
    />
  );
}

export default ExecutiveOrbitControls;
