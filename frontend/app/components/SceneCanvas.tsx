"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";

import { SceneRenderer } from "./SceneRenderer";
import { DecisionPathOverlayLayer } from "./overlays/DecisionPathOverlayLayer";
import { smoothValue } from "../lib/smooth";
import { traceHighlightFlow } from "../lib/debug/highlightDebugTrace";
import { usePropagationBridge } from "../lib/simulation/usePropagationBridge";
import { useSimulationOverlay } from "../lib/simulation/useSimulationOverlay";
import type { ScenarioActionPropagationIntent } from "../lib/simulation/propagationTriggerTypes";
import { mapDecisionPathResultToOverlay } from "../lib/simulation/decisionPathMapper";
import type { WarRoomOverlayDetail, WarRoomOverlaySummary } from "../lib/warroom/warRoomTypes";
import { useDecisionImpact } from "../lib/impact/useDecisionImpact";
import {
  isProjectedPointWithinSafeRegion,
  measureFrameDrift,
  resolveLayoutAwareFrameSpec,
} from "../lib/scene/layoutAwareFraming";
import {
  useClearAllOverrides,
  useOverrides,
  usePruneOverridesTo,
  useSelectedId,
  useSetOverride,
  useSetSelectedId,
} from "./SceneContext";

type SceneCanvasProps = {
  prefs: any;
  camPos: [number, number, number];
  starCount: number;
  isDraggingHUD: boolean;

  focusPinned: boolean;
  focusMode: "all" | "selected";
  focusedId: string | null;

  effectiveActiveLoopId: string | null;
  cameraLockedByUser: boolean;
  isOrbiting: boolean;
  hudDockSide?: "left" | "right";

  sceneJson: any | null;
  storyAccent?: {
    label?: string;
    tint?: string;
    glow?: string;
  } | null;
  propagationPayload?: unknown;
  scenarioTrigger?: ScenarioActionPropagationIntent | null;
  manualPropagationSourceId?: string | null;
  onScenarioOverlayChange?: (summary: WarRoomOverlaySummary | null, detail?: WarRoomOverlayDetail | null) => void;
  objectSelection?: {
    highlighted_objects?: string[];
    risk_sources?: string[];
    risk_targets?: string[];
    dim_unrelated_objects?: boolean;
  } | null;
  getUxForObject: (id: string) => { shape?: string; base_color?: string; opacity?: number; scale?: number } | null;
  objectUxById?: Record<string, { opacity?: number; scale?: number }>;

  loops: any[];
  showLoops: boolean;
  showLoopLabels: boolean;
  showAxes?: boolean;
  showGrid?: boolean;
  showCameraHelper?: boolean;

  selectedSetterRef: React.MutableRefObject<(id: string | null) => void>;
  selectedIdRef: React.MutableRefObject<string | null>;
  overridesRef: React.MutableRefObject<Record<string, any>>;
  setOverrideRef: React.MutableRefObject<(id: string, patch: any) => void>;
  clearAllOverridesRef: React.MutableRefObject<() => void>;
  pruneOverridesRef: React.MutableRefObject<(ids: string[]) => void>;

  onPointerMissed: () => void;
  onOrbitStart: () => void;
  onOrbitEnd: () => void;
  onSelectedChange: (id: string | null) => void;
  onSelectedScreenX?: (sx: number | null) => void;
};

const ORBIT_MOUSE_BUTTONS = {
  LEFT: -1 as unknown as THREE.MOUSE,
  MIDDLE: THREE.MOUSE.DOLLY,
  RIGHT: THREE.MOUSE.ROTATE,
};

function AnimatedScaleGroup({
  target,
  children,
}: {
  target: number;
  children: React.ReactNode;
}) {
  const g = useRef<THREE.Group>(null);
  const v = useRef<number>(target);
  useEffect(() => {
    v.current = target;
  }, [target]);
  useLayoutEffect(() => {
    if (!g.current) return;
    const s = v.current;
    g.current.scale.set(s, s, s);
  }, []);
  useFrame((_, delta) => {
    const current = g.current?.scale.x ?? 1;
    const next = smoothValue(current, v.current, delta, 10);
    if (g.current) g.current.scale.set(next, next, next);
  });
  return <group ref={g}>{children}</group>;
}

function SetterRegistrar({
  refSetter,
}: {
  refSetter: React.MutableRefObject<(id: string | null) => void>;
}) {
  const setSelectedId = useSetSelectedId();
  useEffect(() => {
    refSetter.current = (id: string | null) => setSelectedId(id);
  }, [refSetter, setSelectedId]);
  return null;
}

function FullRegistrar({
  selectedIdRefLocal,
  overridesRefLocal,
  setOverrideRefLocal,
  clearAllOverridesRefLocal,
  pruneOverridesRefLocal,
  onSelectedChange,
}: {
  selectedIdRefLocal: React.MutableRefObject<string | null>;
  overridesRefLocal: React.MutableRefObject<Record<string, any>>;
  setOverrideRefLocal: React.MutableRefObject<(id: string, patch: any) => void>;
  clearAllOverridesRefLocal: React.MutableRefObject<() => void>;
  pruneOverridesRefLocal: React.MutableRefObject<(ids: string[]) => void>;
  onSelectedChange: (id: string | null) => void;
}) {
  const selectedId = useSelectedId();
  const overrides = useOverrides();
  const setOverride = useSetOverride();
  const clearAll = useClearAllOverrides();
  const pruneTo = usePruneOverridesTo();

  useEffect(() => {
    selectedIdRefLocal.current = selectedId;
    onSelectedChange(selectedId);
  }, [selectedId, onSelectedChange, selectedIdRefLocal]);

  useEffect(() => {
    overridesRefLocal.current = overrides;
  }, [overrides, overridesRefLocal]);

  useEffect(() => {
    setOverrideRefLocal.current = (id: string, patch: any) => setOverride(id, patch);
  }, [setOverride, setOverrideRefLocal]);

  useEffect(() => {
    clearAllOverridesRefLocal.current = () => clearAll();
  }, [clearAll, clearAllOverridesRefLocal]);

  useEffect(() => {
    pruneOverridesRefLocal.current = (ids: string[]) => pruneTo(ids);
  }, [pruneTo, pruneOverridesRefLocal]);

  return null;
}

type Bounds3 = {
  min: [number, number, number];
  max: [number, number, number];
  center: [number, number, number];
  size: [number, number, number];
};

function readObjectPos(obj: any): [number, number, number] | null {
  const fromTransform = obj?.transform?.pos;
  const fromPosition = obj?.position;
  const src = Array.isArray(fromTransform) && fromTransform.length >= 3
    ? fromTransform
    : Array.isArray(fromPosition) && fromPosition.length >= 3
    ? fromPosition
    : null;
  if (!src) return null;
  const x = Number(src[0]);
  const y = Number(src[1]);
  const z = Number(src[2]);
  if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) return null;
  return [x, y, z];
}

function computeSceneBounds(objects: any[]): Bounds3 | null {
  const points: [number, number, number][] = [];
  for (const obj of objects) {
    const p = readObjectPos(obj);
    if (!p) continue;
    points.push(p);
  }
  if (!points.length) return null;

  let minX = points[0][0];
  let minY = points[0][1];
  let minZ = points[0][2];
  let maxX = points[0][0];
  let maxY = points[0][1];
  let maxZ = points[0][2];

  for (const p of points) {
    minX = Math.min(minX, p[0]);
    minY = Math.min(minY, p[1]);
    minZ = Math.min(minZ, p[2]);
    maxX = Math.max(maxX, p[0]);
    maxY = Math.max(maxY, p[1]);
    maxZ = Math.max(maxZ, p[2]);
  }

  const center: [number, number, number] = [
    (minX + maxX) / 2,
    (minY + maxY) / 2,
    (minZ + maxZ) / 2,
  ];
  const size: [number, number, number] = [
    Math.max(0.1, maxX - minX),
    Math.max(0.1, maxY - minY),
    Math.max(0.1, maxZ - minZ),
  ];

  return {
    min: [minX, minY, minZ],
    max: [maxX, maxY, maxZ],
    center,
    size,
  };
}

function computeCameraFrameFromBounds(
  bounds: Bounds3,
  opts?: { horizontalBias?: number; verticalBias?: number; pullback?: number }
): { position: [number, number, number]; lookAt: [number, number, number] } {
  const [cx, cy, cz] = bounds.center;
  const [sx, sy, sz] = bounds.size;
  const radius = Math.max(2.8, Math.max(sx, sy, sz) * 0.9);
  const horizontalBias = Number.isFinite(opts?.horizontalBias) ? Number(opts?.horizontalBias) : 0.02;
  const verticalBias = Number.isFinite(opts?.verticalBias) ? Number(opts?.verticalBias) : 0;
  const pullback = Number.isFinite(opts?.pullback) ? Number(opts?.pullback) : 1;

  const lookAt: [number, number, number] = [
    cx - radius * horizontalBias,
    cy + radius * verticalBias,
    cz - radius * 0.06,
  ];
  const position: [number, number, number] = [
    lookAt[0] + radius * 0.16,
    lookAt[1] + radius * 0.72,
    lookAt[2] + radius * 1.36 * pullback,
  ];

  return { position, lookAt };
}

function sceneObjectsSignature(objects: any[]): string {
  if (!Array.isArray(objects) || !objects.length) return "empty";
  return objects
    .map((obj, idx) => {
      const id = String(obj?.id ?? obj?.name ?? `obj_${idx}`);
      const p = readObjectPos(obj);
      if (!p) return `${id}:na`;
      return `${id}:${p[0].toFixed(2)},${p[1].toFixed(2)},${p[2].toFixed(2)}`;
    })
    .join("|");
}

function CameraIntelligence({
  focusPinned,
  focusMode,
  focusedId,
  sceneJson,
  camPos,
  overridesRef,
  cameraLockedByUser,
  isOrbiting,
  hudDockSide,
  controlsRef,
  localIsOrbitingRef,
  preserveCameraOnClearRef,
  orbitControlsEnabled,
}: {
  focusPinned: boolean;
  focusMode: "all" | "selected";
  focusedId: string | null;
  sceneJson: any | null;
  camPos: [number, number, number];
  overridesRef: React.MutableRefObject<Record<string, any>>;
  cameraLockedByUser: boolean;
  isOrbiting: boolean;
  hudDockSide?: "left" | "right";
  controlsRef?: React.MutableRefObject<any | null>;
  localIsOrbitingRef?: React.MutableRefObject<boolean>;
  preserveCameraOnClearRef?: React.MutableRefObject<boolean>;
  orbitControlsEnabled: boolean;
}) {
  const { camera, size } = useThree();
  const focusTargetRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const desiredCamPosRef = useRef<THREE.Vector3>(
    new THREE.Vector3(camPos[0], camPos[1], camPos[2])
  );
  const desiredLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const defaultCamPosRef = useRef<THREE.Vector3>(
    new THREE.Vector3(camPos[0], camPos[1], camPos[2])
  );
  const defaultLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const tmpLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const tmpCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const lastFocusIdRef = useRef<string | null>(null);
  const lastAutoFrameSigRef = useRef<string>("");
  const lastSceneJsonRef = useRef<any>(null);
  const hasSeededCameraRef = useRef<boolean>(false);
  const suspendAutoCameraUntilRef = useRef<number>(0);
  const lastCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3(camPos[0], camPos[1], camPos[2]));
  const lastControlTargetRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const lastCameraAssistKeyRef = useRef<string>("");
  const baselineCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(camPos[0], camPos[1], camPos[2]));
  const baselineLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const lastBaselineSignatureRef = useRef<string>("");
  const lastDriftRecoveryAtRef = useRef<number>(0);

  const captureBaselineFrame = (
    position: [number, number, number],
    lookAt: [number, number, number],
    signature: string
  ) => {
    baselineCamPosRef.current.set(position[0], position[1], position[2]);
    baselineLookAtRef.current.set(lookAt[0], lookAt[1], lookAt[2]);
    defaultCamPosRef.current.set(position[0], position[1], position[2]);
    defaultLookAtRef.current.set(lookAt[0], lookAt[1], lookAt[2]);
    lastBaselineSignatureRef.current = signature;
    if (process.env.NODE_ENV !== "production") {
      console.log("[Nexora][Framing] baseline captured", { signature, position, lookAt });
    }
  };

  useLayoutEffect(() => {
    defaultCamPosRef.current.set(camPos[0], camPos[1], camPos[2]);
    if (!hasSeededCameraRef.current) {
      hasSeededCameraRef.current = true;
      desiredCamPosRef.current.set(camPos[0], camPos[1], camPos[2]);
      camera.position.set(camPos[0], camPos[1], camPos[2]);
    }
  }, [camPos, camera]);

  useEffect(() => {
    if (orbitControlsEnabled) return;
    suspendAutoCameraUntilRef.current = performance.now() + 250;
  }, [orbitControlsEnabled]);

  useEffect(() => {
    const lookAt = sceneJson?.scene?.camera?.lookAt;
    if (!Array.isArray(lookAt) || lookAt.length < 3) {
      defaultLookAtRef.current.set(0, 0, 0);
      return;
    }
    const x = Number(lookAt[0]);
    const y = Number(lookAt[1]);
    const z = Number(lookAt[2]);
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
      defaultLookAtRef.current.set(0, 0, 0);
      return;
    }
    defaultLookAtRef.current.set(x, y, z);
    desiredLookAtRef.current.set(x, y, z);
    currentLookAtRef.current.set(x, y, z);
  }, [sceneJson?.scene?.camera?.lookAt]);

  useLayoutEffect(() => {
    const sceneCamera = sceneJson?.scene?.camera ?? {};
    const hasExplicitPos = Array.isArray(sceneCamera?.pos) && sceneCamera.pos.length >= 3;
    const shouldAutoFrame = sceneCamera?.autoFrame === true || !hasExplicitPos;
    if (!shouldAutoFrame) return;

    if (lastSceneJsonRef.current !== sceneJson) {
      lastSceneJsonRef.current = sceneJson;
      lastAutoFrameSigRef.current = "";
    }

    const objects = Array.isArray(sceneJson?.scene?.objects) ? sceneJson.scene.objects : [];
    const signature = sceneObjectsSignature(objects);
    if (!signature || signature === "empty") return;
    if (lastAutoFrameSigRef.current === signature) return;

    const bounds = computeSceneBounds(objects);
    if (!bounds) return;

    const frameSpec = resolveLayoutAwareFrameSpec({
      viewportWidth: size.width,
      viewportHeight: size.height,
      hudDockSide,
    });
    const frame = computeCameraFrameFromBounds(bounds, {
      horizontalBias: frameSpec.horizontalBias,
      verticalBias: frameSpec.verticalBias,
      pullback: frameSpec.pullback,
    });
    captureBaselineFrame(frame.position, frame.lookAt, `${signature}:${hudDockSide ?? "none"}:${size.width}x${size.height}`);
    desiredCamPosRef.current.set(frame.position[0], frame.position[1], frame.position[2]);
    desiredLookAtRef.current.set(frame.lookAt[0], frame.lookAt[1], frame.lookAt[2]);
    currentLookAtRef.current.set(frame.lookAt[0], frame.lookAt[1], frame.lookAt[2]);

    // Apply the fresh frame immediately so first visible frame is stable.
    const now = performance.now();
    const autoCameraSuspended = now < suspendAutoCameraUntilRef.current;
    if (!cameraLockedByUser && !(localIsOrbitingRef?.current || isOrbiting) && !autoCameraSuspended) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[Nexora][SceneInteraction] layout-aware frame region updated", frameSpec);
      }
      camera.position.set(frame.position[0], frame.position[1], frame.position[2]);
      lastCameraPosRef.current.set(frame.position[0], frame.position[1], frame.position[2]);
      const controls = controlsRef?.current;
      if (controls?.target) {
        controls.target.set(frame.lookAt[0], frame.lookAt[1], frame.lookAt[2]);
        lastControlTargetRef.current.set(frame.lookAt[0], frame.lookAt[1], frame.lookAt[2]);
        controls.update();
      } else {
        currentLookAtRef.current.set(frame.lookAt[0], frame.lookAt[1], frame.lookAt[2]);
        camera.lookAt(frame.lookAt[0], frame.lookAt[1], frame.lookAt[2]);
      }
    }

    lastAutoFrameSigRef.current = signature;
  }, [sceneJson, hudDockSide, camera, cameraLockedByUser, controlsRef, isOrbiting, localIsOrbitingRef, size.height, size.width]);

  useEffect(() => {
    const isFocusActive = focusPinned || focusMode === "selected";
    if (!isFocusActive || !focusedId) {
      // Empty-scene deselection should not force camera reframe/reset.
      // Freeze the current camera + target as the desired state so no visible slide happens.
      if (preserveCameraOnClearRef?.current) {
        preserveCameraOnClearRef.current = false;

        desiredCamPosRef.current.copy(camera.position);

        const controls = controlsRef?.current;
        if (controls?.target) {
          desiredLookAtRef.current.copy(controls.target);
          currentLookAtRef.current.copy(controls.target);
          lastControlTargetRef.current.copy(controls.target);
        } else {
          desiredLookAtRef.current.copy(currentLookAtRef.current);
          lastControlTargetRef.current.copy(currentLookAtRef.current);
        }

        lastFocusIdRef.current = null;
        return;
      }
      if (cameraLockedByUser || !orbitControlsEnabled) {
        desiredCamPosRef.current.copy(camera.position);
        const controls = controlsRef?.current;
        if (controls?.target) {
          desiredLookAtRef.current.copy(controls.target);
          currentLookAtRef.current.copy(controls.target);
          lastControlTargetRef.current.copy(controls.target);
        } else {
          desiredLookAtRef.current.copy(currentLookAtRef.current);
          lastControlTargetRef.current.copy(currentLookAtRef.current);
        }
      } else {
        desiredCamPosRef.current.copy(defaultCamPosRef.current);
        desiredLookAtRef.current.copy(defaultLookAtRef.current);
      }
      lastFocusIdRef.current = null;
      return;
    }

    // Selection/focus is visual/UI state only; do not move/reframe camera on object click.
    // Keep desired camera target stable unless an explicit framing system changes it.
    lastCameraPosRef.current.copy(camera.position);
    const controls = controlsRef?.current;
    if (controls?.target) {
      lastControlTargetRef.current.copy(controls.target);
    }
    // Keep desired camera target stable unless an explicit framing system changes it.
    lastFocusIdRef.current = focusedId;
    const targetObject = Array.isArray(sceneJson?.scene?.objects)
      ? (sceneJson.scene.objects as any[]).find((item) => {
          const stableId = String(item?.id ?? item?.name ?? "");
          return stableId === focusedId;
        })
      : null;
    const targetPos = targetObject ? readObjectPos(targetObject) : null;
    if (!targetPos) return;
    const frameSpec = resolveLayoutAwareFrameSpec({
      viewportWidth: size.width,
      viewportHeight: size.height,
      hudDockSide,
    });
    const baselineCamPos = baselineCamPosRef.current;
    const baselineLookAt = baselineLookAtRef.current;
    desiredCamPosRef.current.copy(baselineCamPos);
    desiredLookAtRef.current.copy(baselineLookAt);
    const projected = new THREE.Vector3(targetPos[0], targetPos[1], targetPos[2]).project(camera);
    const assistKey = `${focusedId}:${projected.x.toFixed(2)}:${projected.y.toFixed(2)}`;
    if (lastCameraAssistKeyRef.current === assistKey) return;
    const isVisible = isProjectedPointWithinSafeRegion(projected, frameSpec.safeRegion);
    if (isVisible) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[Nexora][Framing] assist skipped (already safe)", { focusedId, projected, safeRegion: frameSpec.safeRegion });
      }
      lastCameraAssistKeyRef.current = assistKey;
      return;
    }
    const focusVector = new THREE.Vector3(targetPos[0], targetPos[1], targetPos[2]);
    const nextLookAt = baselineLookAt.clone().lerp(focusVector, 0.14);
    const delta = nextLookAt.clone().sub(baselineLookAt);
    desiredLookAtRef.current.copy(nextLookAt);
    desiredCamPosRef.current.copy(baselineCamPos);
    desiredCamPosRef.current.x += delta.x * 0.4;
    desiredCamPosRef.current.y += delta.y * 0.16;
    suspendAutoCameraUntilRef.current = performance.now() + 240;
    lastCameraAssistKeyRef.current = assistKey;
    if (process.env.NODE_ENV !== "production") {
      console.log("[Nexora][Framing] assist applied", { focusedId, projected, safeRegion: frameSpec.safeRegion });
    }
  }, [focusPinned, focusMode, focusedId, sceneJson, overridesRef, preserveCameraOnClearRef, cameraLockedByUser, orbitControlsEnabled, controlsRef, camera, hudDockSide, size.height, size.width]);

  const applyHudShift = (lookAt: THREE.Vector3, camPosV: THREE.Vector3) => {
    const frameSpec = resolveLayoutAwareFrameSpec({
      viewportWidth: size.width,
      viewportHeight: size.height,
      hudDockSide,
    });
    if (!hudDockSide) return;
    const shiftSign = hudDockSide === "left" ? 1 : -1;
    const shift = frameSpec.worldShift;
    lookAt.x += shiftSign * shift;
    camPosV.x += shiftSign * (shift * 0.42);
  };

  useFrame(() => {
    const now = performance.now();
    const userOrbiting = !!localIsOrbitingRef?.current || isOrbiting;
    const controls = controlsRef?.current;

    if (userOrbiting) {
      suspendAutoCameraUntilRef.current = now + 900;
      lastCameraPosRef.current.copy(camera.position);
      if (controls?.target) {
        lastControlTargetRef.current.copy(controls.target);
      }
      return;
    }

    if (cameraLockedByUser || !orbitControlsEnabled) {
      lastCameraPosRef.current.copy(camera.position);
      if (controls?.target) {
        lastControlTargetRef.current.copy(controls.target);
      }
      return;
    }

    if (now < suspendAutoCameraUntilRef.current) {
      lastCameraPosRef.current.copy(camera.position);
      if (controls?.target) {
        lastControlTargetRef.current.copy(controls.target);
      }
      return;
    }

    const hasExplicitFocus = (focusPinned || focusMode === "selected") && !!focusedId;
    if (!hasExplicitFocus) {
      const currentLookAt = controls?.target ?? currentLookAtRef.current;
      const drift = measureFrameDrift({
        currentPosition: camera.position,
        currentLookAt,
        baselinePosition: [
          baselineCamPosRef.current.x,
          baselineCamPosRef.current.y,
          baselineCamPosRef.current.z,
        ],
        baselineLookAt: [
          baselineLookAtRef.current.x,
          baselineLookAtRef.current.y,
          baselineLookAtRef.current.z,
        ],
      });
      const driftExceeded = drift.positionDistance > 0.7 || drift.lookAtDistance > 0.45;
      if (driftExceeded) {
        desiredCamPosRef.current.copy(baselineCamPosRef.current);
        desiredLookAtRef.current.copy(baselineLookAtRef.current);
        if (now - lastDriftRecoveryAtRef.current > 1200) {
          lastDriftRecoveryAtRef.current = now;
          if (process.env.NODE_ENV !== "production") {
            console.log("[Nexora][Framing] drift threshold exceeded", drift);
            console.log("[Nexora][Framing] baseline recovery applied", {
              signature: lastBaselineSignatureRef.current,
            });
          }
        }
      }
    }

    // Copy desired targets into reusable temps (no allocations)
    const lookAt = tmpLookAtRef.current.copy(desiredLookAtRef.current);
    const camPosV = tmpCamPosRef.current.copy(desiredCamPosRef.current);

    // Apply HUD composition shift (no drift)
    applyHudShift(lookAt, camPosV);

    // Smooth camera position
    camera.position.lerp(camPosV, 0.06);
    lastCameraPosRef.current.copy(camera.position);

    // Drive look direction through OrbitControls when present
    if (controls?.target) {
      controls.target.lerp(lookAt, 0.06);
      lastControlTargetRef.current.copy(controls.target);
      controls.update();
      return;
    }

    currentLookAtRef.current.lerp(lookAt, 0.06);
    lastControlTargetRef.current.copy(currentLookAtRef.current);
    camera.lookAt(currentLookAtRef.current);
  });

  return null;
}

export function SceneCanvas(props: SceneCanvasProps) {
  const theme = props.prefs?.theme ?? "night";
  const orbitMode = props.prefs?.orbitMode ?? "auto";
  const selectedIdCtx = useSelectedId();
  const {
    propagationOverlay,
    scenarioOverlayPackage,
    propagationLoading,
    propagationError,
    propagationMode,
  } = usePropagationBridge({
    sceneJson: props.sceneJson,
    loops: props.loops,
    selectedObjectId: selectedIdCtx,
    scenarioTrigger: props.scenarioTrigger,
    manualActionObjectId: props.manualPropagationSourceId,
    propagationPayload: props.propagationPayload,
    previewEnabled: true,
  });
  const simulationOverlay = useSimulationOverlay(props.propagationPayload);
  const mergedPropagationOverlay = React.useMemo(() => {
    if (simulationOverlay.highlightedIds.length === 0 && simulationOverlay.links.length === 0) {
      return propagationOverlay;
    }

    const baseNodes = propagationOverlay?.impacted_nodes ?? [];
    const baseEdges = propagationOverlay?.impacted_edges ?? [];
    const nodeMap = new Map(
      baseNodes.map((node) => [node.object_id, node] as const)
    );
    simulationOverlay.highlightedIds.forEach((id, index) => {
      const strength = Math.max(simulationOverlay.intensityMap[id] ?? 0.72, nodeMap.get(id)?.strength ?? 0);
      nodeMap.set(id, {
        object_id: id,
        depth: nodeMap.get(id)?.depth ?? (index === 0 ? 0 : 1),
        strength,
        role: nodeMap.get(id)?.role ?? (index === 0 ? "source" : "impacted"),
      });
    });

    const edgeMap = new Map(
      baseEdges.map((edge) => [`${edge.from}:${edge.to}`, edge] as const)
    );
    simulationOverlay.links.forEach((link) => {
      edgeMap.set(`${link.source}:${link.target}`, {
        from: link.source,
        to: link.target,
        depth: 1,
        strength: Math.max(0.15, Math.min(1, link.weight)),
      });
    });

    return {
      active: true,
      source_object_id:
        propagationOverlay?.source_object_id ??
        simulationOverlay.links[0]?.source ??
        simulationOverlay.highlightedIds[0] ??
        null,
      mode: propagationOverlay?.mode ?? "backend",
      impacted_nodes: Array.from(nodeMap.values()),
      impacted_edges: Array.from(edgeMap.values()),
      meta: {
        label: propagationOverlay?.meta?.label ?? "Simulation propagation",
        timestamp: propagationOverlay?.meta?.timestamp ?? 0,
        source_kind: propagationOverlay?.meta?.source_kind ?? "backend_payload",
      },
    };
  }, [propagationOverlay, simulationOverlay.highlightedIds, simulationOverlay.intensityMap, simulationOverlay.links]);
  const decisionPathOverlay = React.useMemo(
    () => mapDecisionPathResultToOverlay(scenarioOverlayPackage.decisionPath ?? null),
    [scenarioOverlayPackage.decisionPath]
  );
  const { selection: decisionImpactSelection } = useDecisionImpact({
    propagation: mergedPropagationOverlay,
    decisionPath: scenarioOverlayPackage.decisionPath ?? null,
    strategicAdvice:
      (props.propagationPayload as any)?.strategic_advice ??
      props.sceneJson?.strategic_advice ??
      props.sceneJson?.scene?.strategic_advice ??
      null,
    strategicCouncil:
      (props.propagationPayload as any)?.strategic_council ??
      props.sceneJson?.strategic_council ??
      props.sceneJson?.scene?.strategic_council ??
      null,
    scenarioAction: scenarioOverlayPackage.sourceAction ?? props.scenarioTrigger ?? null,
    sceneJson: props.sceneJson,
    source: "scene_canvas",
  });
  const combinedObjectSelection = React.useMemo(() => {
    const base = props.objectSelection ?? null;
    if (!decisionImpactSelection) {
      if (simulationOverlay.highlightedIds.length === 0) return base;
      return {
        ...base,
        highlighted_objects: Array.from(
          new Set([...(base?.highlighted_objects ?? []).map(String), ...simulationOverlay.highlightedIds.map(String)])
        ),
      };
    }
    return {
      highlighted_objects: Array.from(
        new Set([
          ...(base?.highlighted_objects ?? []).map(String),
          ...decisionImpactSelection.highlighted_objects.map(String),
          ...simulationOverlay.highlightedIds.map(String),
        ])
      ),
      risk_sources: Array.from(
        new Set([...(base?.risk_sources ?? []).map(String), ...decisionImpactSelection.risk_sources.map(String)])
      ),
      risk_targets: Array.from(
        new Set([...(base?.risk_targets ?? []).map(String), ...decisionImpactSelection.risk_targets.map(String)])
      ),
      dim_unrelated_objects:
        decisionImpactSelection.dim_unrelated_objects || base?.dim_unrelated_objects === true,
    };
  }, [decisionImpactSelection, props.objectSelection, simulationOverlay.highlightedIds]);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (simulationOverlay.highlightedIds.length === 0 && simulationOverlay.links.length === 0) return;
    console.log("[Nexora][SimulationFlow]", {
      triggered: true,
      impacted: simulationOverlay.highlightedIds.length,
      links: simulationOverlay.links.length,
    });
  }, [simulationOverlay.highlightedIds.length, simulationOverlay.links.length]);

  useEffect(() => {
    if (!props.onScenarioOverlayChange) return;
    const sourceAction = scenarioOverlayPackage.sourceAction ?? props.scenarioTrigger ?? null;
    if (sourceAction?.metadata?.origin !== "war_room") {
      props.onScenarioOverlayChange(null, null);
      return;
    }
    const sourceId = sourceAction.intent.source_object_id ?? null;
    const sceneContainsSource =
      !sourceId ||
      (Array.isArray(props.sceneJson?.scene?.objects) &&
        props.sceneJson.scene.objects.some((object: any, index: number) => {
          const objectId = String(object?.id ?? object?.name ?? `${object?.type ?? "obj"}:${index}`).trim();
          return objectId === sourceId;
        }));
    if (!sceneContainsSource) {
      props.onScenarioOverlayChange(null, null);
      return;
    }
    const summary: WarRoomOverlaySummary = {
      active:
        mergedPropagationOverlay?.active === true ||
        decisionPathOverlay?.active === true ||
        propagationLoading,
      actionId: sourceAction.intent.action_id ?? null,
      sourceObjectId: sourceId,
      overlayMode: scenarioOverlayPackage.mode,
      resultMode:
        scenarioOverlayPackage.decisionPath?.active || decisionPathOverlay?.active
          ? "backend"
          : propagationMode,
      loading: propagationLoading,
      error: propagationError,
      propagationNodeCount: mergedPropagationOverlay?.impacted_nodes.length ?? 0,
      propagationEdgeCount: mergedPropagationOverlay?.impacted_edges.length ?? 0,
      decisionNodeCount: decisionPathOverlay?.nodes.length ?? 0,
      decisionEdgeCount: decisionPathOverlay?.edges.length ?? 0,
    };
    const detail: WarRoomOverlayDetail = {
      propagation: mergedPropagationOverlay ?? null,
      decisionPath: scenarioOverlayPackage.decisionPath ?? null,
      scenarioAction: sourceAction,
      overlayPackage: scenarioOverlayPackage,
    };
    props.onScenarioOverlayChange(summary, detail);
  }, [
    decisionPathOverlay,
    props.onScenarioOverlayChange,
    props.scenarioTrigger,
    propagationError,
    propagationLoading,
    propagationMode,
    mergedPropagationOverlay,
    scenarioOverlayPackage,
  ]);

  const controlsRef = useRef<any>(null);
  const localIsOrbitingRef = useRef<boolean>(false);
  const preserveCameraOnClearRef = useRef<boolean>(false);
  const tmpWorld = React.useMemo(() => new THREE.Vector3(), []);
  const [isHudInteracting, setIsHudInteracting] = useState(false);
  const isHudInteractingRef = useRef(false);

  // Camera mode values may come from UI as: "orbit" | "fixed" (new)
  // or legacy values: "auto" | "manual".
  const cameraMode = String(orbitMode);
  const isFixedCamera = cameraMode === "fixed";
  const orbitControlsEnabled = !isFixedCamera && !props.isDraggingHUD && !isHudInteracting;

  // Global scale can easily make objects feel "too big". Keep a sane default and clamp the range.
  const rawGlobalScale = typeof props.prefs?.globalScale === "number" ? props.prefs.globalScale : 0.65;
  const globalScale = Math.min(1.6, Math.max(0.35, rawGlobalScale));
  const showGrid = typeof props.showGrid === "boolean" ? props.showGrid : !!props.prefs?.showGrid;
  const showAxes = typeof props.showAxes === "boolean" ? props.showAxes : !!props.prefs?.showAxes;
  const shadowsEnabled = !!props.prefs?.shadowsEnabled;

  const bg = theme === "day" ? "#e9edf5" : theme === "stars" ? "#050b2a" : "#05060a";
  const sceneObjectIds = React.useMemo(
    () =>
      Array.isArray(props.sceneJson?.scene?.objects)
        ? (props.sceneJson.scene.objects as any[])
            .map((obj: any, idx: number) => String(obj?.id ?? obj?.name ?? `${obj?.type ?? "obj"}:${idx}`))
            .filter(Boolean)
        : [],
    [props.sceneJson]
  );
  const highlightedObjectIds = React.useMemo(
    () =>
      Array.isArray(combinedObjectSelection?.highlighted_objects)
        ? combinedObjectSelection.highlighted_objects.map(String)
        : [],
    [combinedObjectSelection]
  );

  useEffect(() => {
    const highlightedSet = new Set(highlightedObjectIds);
    const protectedIds = Array.from(
      new Set([
        ...highlightedObjectIds,
        ...(props.focusedId ? [String(props.focusedId)] : []),
        ...(selectedIdCtx ? [String(selectedIdCtx)] : []),
      ])
    );
    const dimmedIds =
      combinedObjectSelection?.dim_unrelated_objects === true
        ? sceneObjectIds.filter((id) => !highlightedSet.has(id) && id !== props.focusedId && id !== selectedIdCtx).slice(0, 6)
        : [];

    traceHighlightFlow("scene_canvas", {
      highlightedObjectIds,
      dimUnrelatedObjects: combinedObjectSelection?.dim_unrelated_objects === true,
      focusedId: props.focusedId ?? null,
      selectedObjectId: selectedIdCtx ?? null,
      pinnedId: props.focusPinned ? props.focusedId ?? null : null,
      focusMode: props.focusMode,
      sceneObjectIds: sceneObjectIds.slice(0, 12),
      protectedIds,
      dimmedIds,
    });
  }, [
    highlightedObjectIds,
    props.focusMode,
    props.focusPinned,
    props.focusedId,
    combinedObjectSelection,
    sceneObjectIds,
    selectedIdCtx,
  ]);

  useEffect(() => {
    isHudInteractingRef.current = isHudInteracting;
  }, [isHudInteracting]);

  useEffect(() => {
    if (isFixedCamera) {
      localIsOrbitingRef.current = false;
    }
  }, [isFixedCamera]);

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key !== "Escape") return;
      // Clear selection via the ref wired by <SetterRegistrar />
      props.selectedSetterRef?.current?.(null);
      props.onSelectedChange?.(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [props]);

  useEffect(() => {
    const isInsideHud = (t: EventTarget | null) => {
      const el = t as HTMLElement | null;
      return !!(el && typeof (el as any).closest === "function" && el.closest('[data-hud="chat"]'));
    };

    // Track pointer hover inside HUD so we can disable OrbitControls reliably.
    // Use capture so we see events even if something else stops propagation.
    const onPointerOverCapture = (e: PointerEvent) => {
      if (isInsideHud(e.target)) {
        if (!isHudInteractingRef.current) setIsHudInteracting(true);
      }
    };

    const onPointerOutCapture = (e: PointerEvent) => {
      const fromHud = isInsideHud(e.target);
      const goingToHud = isInsideHud((e as any).relatedTarget ?? null);
      if (fromHud && !goingToHud) {
        if (isHudInteractingRef.current) setIsHudInteracting(false);
      }
    };

    // Stop wheel/touchmove from reaching scene/global handlers when originating from HUD.
    // Do NOT preventDefault so native scrolling still works.
    const stopIfHudCapture = (e: Event) => {
      if (!isInsideHud(e.target)) return;
      (e as any).stopImmediatePropagation?.();
      e.stopPropagation();
    };

    window.addEventListener("pointerover", onPointerOverCapture, { capture: true });
    window.addEventListener("pointerout", onPointerOutCapture, { capture: true });
    window.addEventListener("wheel", stopIfHudCapture, { passive: true, capture: true });
    window.addEventListener("touchmove", stopIfHudCapture, { passive: true, capture: true });

    return () => {
      window.removeEventListener("pointerover", onPointerOverCapture, true as any);
      window.removeEventListener("pointerout", onPointerOutCapture, true as any);
      window.removeEventListener("wheel", stopIfHudCapture, true as any);
      window.removeEventListener("touchmove", stopIfHudCapture, true as any);
    };
  }, []);

  useEffect(() => {
    const isInsideHud = (t: EventTarget | null) => {
      const el = t as HTMLElement | null;
      return !!(el && typeof (el as any).closest === "function" && el.closest('[data-hud="chat"]'));
    };

    const onTouchStartCapture = (e: TouchEvent) => {
      if (isInsideHud(e.target)) setIsHudInteracting(true);
    };

    const clear = () => setIsHudInteracting(false);

    window.addEventListener("touchstart", onTouchStartCapture, { passive: true, capture: true });
    window.addEventListener("touchend", clear, { passive: true, capture: true });
    window.addEventListener("touchcancel", clear, { passive: true, capture: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStartCapture, true as any);
      window.removeEventListener("touchend", clear as any, true as any);
      window.removeEventListener("touchcancel", clear as any, true as any);
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minWidth: 0,
        minHeight: 0,
        overflow: "hidden",
        flex: "1 1 0%",
        zIndex: 0,
      }}
    >
      {props.storyAccent ? (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
            border: `1px solid ${props.storyAccent.tint ?? "rgba(148,163,184,0.14)"}`,
            boxShadow: `inset 0 0 0 1px ${props.storyAccent.tint ?? "rgba(148,163,184,0.12)"}, inset 0 0 52px ${
              props.storyAccent.glow ?? "rgba(56,189,248,0.12)"
            }`,
            background: `radial-gradient(circle at 18% 16%, ${props.storyAccent.glow ?? "rgba(56,189,248,0.08)"} 0%, rgba(2,6,23,0) 42%)`,
            transition: "box-shadow 260ms ease, border-color 260ms ease, background 260ms ease",
          }}
        >
          {props.storyAccent.label ? (
            <div
              style={{
                position: "absolute",
                right: 16,
                top: 16,
                padding: "5px 10px",
                borderRadius: 999,
                border: `1px solid ${props.storyAccent.tint ?? "rgba(148,163,184,0.18)"}`,
                background: "rgba(15,23,42,0.64)",
                color: "#e2e8f0",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {props.storyAccent.label}
            </div>
          ) : null}
        </div>
      ) : null}
      <Canvas
        shadows={shadowsEnabled}
        camera={{ position: props.camPos ?? [0, 0, 5], fov: 50, near: 0.1, far: 250 }}
        style={{ width: "100%", height: "100%", display: "block" }}
        onPointerDown={(e) => {
          if (e.button === 0) {
            const intersections = (e as any).intersections as Array<{ object: THREE.Object3D }> | undefined;
            const camera = (e as any).camera as THREE.Camera | undefined;
            if (camera && intersections && intersections.length > 0) {
              const obj = intersections[0]?.object;
              if (obj) {
                obj.getWorldPosition(tmpWorld);
                tmpWorld.project(camera);
                const raw = (tmpWorld.x + 1) / 2;
                const sx = Math.max(0, Math.min(1, raw));
                props.onSelectedScreenX?.(sx);
              }
            }
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
        onPointerMissed={(e) => {
          if ((e as any)?.button !== 0) return;
          if (localIsOrbitingRef.current || isHudInteractingRef.current) {
            if (process.env.NODE_ENV !== "production") {
              console.log("[Nexora][SceneInteraction] empty click ignored", {
                orbiting: localIsOrbitingRef.current,
                hudInteracting: isHudInteractingRef.current,
              });
            }
            return;
          }
          if (process.env.NODE_ENV !== "production") {
            console.log("[Nexora][SceneInteraction] empty click ignored", {
              action: "soft_deselect_without_reframe",
            });
          }
          // Clicking empty space should softly deselect without camera reframe/reset.
          preserveCameraOnClearRef.current = true;
          props.selectedSetterRef?.current?.(null);
          props.onSelectedScreenX?.(null);
          props.onPointerMissed();
        }}
      >
        <color attach="background" args={[bg]} />

        <CameraIntelligence
          focusPinned={props.focusPinned}
          focusMode={props.focusMode}
          focusedId={props.focusedId}
          sceneJson={props.sceneJson}
          camPos={props.camPos}
          overridesRef={props.overridesRef}
          cameraLockedByUser={props.cameraLockedByUser || isFixedCamera}
          isOrbiting={props.isOrbiting}
          hudDockSide={props.hudDockSide}
          controlsRef={controlsRef}
          localIsOrbitingRef={localIsOrbitingRef}
          preserveCameraOnClearRef={preserveCameraOnClearRef}
          orbitControlsEnabled={orbitControlsEnabled}
        />

        {theme === "stars" && (
          <Stars radius={80} depth={50} count={props.starCount ?? 1500} factor={4} saturation={0} fade speed={1} />
        )}

        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={0.8} />

        <OrbitControls
          ref={controlsRef}
          enabled={orbitControlsEnabled}
          enableZoom
          enableRotate
          enablePan={false}
          minDistance={1.5}
          maxDistance={80}
          mouseButtons={ORBIT_MOUSE_BUTTONS}
          onStart={() => {
            if (isFixedCamera) return;
            localIsOrbitingRef.current = true;
            preserveCameraOnClearRef.current = true;
            props.onOrbitStart();
          }}
          onEnd={() => {
            if (isFixedCamera) return;
            localIsOrbitingRef.current = false;
            preserveCameraOnClearRef.current = true;
            props.onOrbitEnd();
          }}
        />

        <AnimatedScaleGroup target={globalScale}>
          {showGrid && <gridHelper args={[10, 10]} />}
          {showAxes && <axesHelper args={[3]} />}
          {props.showCameraHelper ? (
            <group>
              <mesh position={[0, 1.2, 0]}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
            </group>
          ) : null}

          {props.sceneJson && (
            <>
              <DecisionPathOverlayLayer overlay={decisionPathOverlay}>
                {(decisionPathRenderState) => (
                  <SceneRenderer
                    sceneJson={{
                      ...props.sceneJson,
                      meta: {
                        ...(props.sceneJson?.meta || {}),
                        cameraLockedByUser: isFixedCamera
                          ? true
                          : orbitMode === "manual"
                          ? props.cameraLockedByUser
                          : props.isOrbiting,
                      },
                    }}
                    objectSelection={combinedObjectSelection ?? null}
                    shadowsEnabled={shadowsEnabled}
                    focusMode={props.focusMode}
                    focusedId={props.focusedId}
                    activeLoopId={props.effectiveActiveLoopId}
                    theme={theme}
                    getUxForObject={props.getUxForObject}
                    objectUxById={props.objectUxById}
                    loops={props.loops}
                    showLoops={props.showLoops}
                    showLoopLabels={props.showLoopLabels}
                    propagationOverlay={mergedPropagationOverlay}
                    decisionPathOverlay={decisionPathRenderState}
                  />
                )}
              </DecisionPathOverlayLayer>

              <SetterRegistrar refSetter={props.selectedSetterRef} />
              <FullRegistrar
                selectedIdRefLocal={props.selectedIdRef}
                overridesRefLocal={props.overridesRef}
                setOverrideRefLocal={props.setOverrideRef}
                clearAllOverridesRefLocal={props.clearAllOverridesRef}
                pruneOverridesRefLocal={props.pruneOverridesRef}
                onSelectedChange={props.onSelectedChange}
              />
            </>
          )}
        </AnimatedScaleGroup>
      </Canvas>
    </div>
  );
}
