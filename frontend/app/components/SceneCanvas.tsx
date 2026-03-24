"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";

import { SceneRenderer } from "./SceneRenderer";
import { smoothValue } from "../lib/smooth";
import { traceHighlightFlow } from "../lib/debug/highlightDebugTrace";
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
  objectSelection?: {
    highlighted_objects?: string[];
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
  opts?: { rightPanelBias?: number; pullback?: number }
): { position: [number, number, number]; lookAt: [number, number, number] } {
  const [cx, cy, cz] = bounds.center;
  const [sx, sy, sz] = bounds.size;
  const radius = Math.max(2.8, Math.max(sx, sy, sz) * 0.9);
  const rightPanelBias = Number.isFinite(opts?.rightPanelBias) ? Number(opts?.rightPanelBias) : 0.1;
  const pullback = Number.isFinite(opts?.pullback) ? Number(opts?.pullback) : 1;

  const lookAt: [number, number, number] = [
    cx - radius * rightPanelBias,
    cy,
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
  const { camera } = useThree();
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

    const dockBias = hudDockSide === "right" ? 0.14 : hudDockSide === "left" ? 0.04 : 0.1;
    const frame = computeCameraFrameFromBounds(bounds, { rightPanelBias: dockBias, pullback: 1.05 });
    defaultCamPosRef.current.set(frame.position[0], frame.position[1], frame.position[2]);
    defaultLookAtRef.current.set(frame.lookAt[0], frame.lookAt[1], frame.lookAt[2]);
    desiredCamPosRef.current.set(frame.position[0], frame.position[1], frame.position[2]);
    desiredLookAtRef.current.set(frame.lookAt[0], frame.lookAt[1], frame.lookAt[2]);
    currentLookAtRef.current.set(frame.lookAt[0], frame.lookAt[1], frame.lookAt[2]);

    // Apply the fresh frame immediately so first visible frame is stable.
    const now = performance.now();
    const autoCameraSuspended = now < suspendAutoCameraUntilRef.current;
    if (!cameraLockedByUser && !(localIsOrbitingRef?.current || isOrbiting) && !autoCameraSuspended) {
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
  }, [sceneJson, hudDockSide, camera, cameraLockedByUser, controlsRef, isOrbiting, localIsOrbitingRef]);

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
  }, [focusPinned, focusMode, focusedId, sceneJson, overridesRef, preserveCameraOnClearRef, cameraLockedByUser, orbitControlsEnabled, controlsRef]);

  const applyHudShift = (lookAt: THREE.Vector3, camPosV: THREE.Vector3) => {
    const dock =
      hudDockSide === "left" ? "left" : hudDockSide === "right" ? "right" : null;
    if (!dock) return;

    const shiftSign = dock === "left" ? 1 : -1;

    // world-units; keep noticeable but safe
    const SHIFT = 2.2;

    lookAt.x += shiftSign * SHIFT;
    camPosV.x += shiftSign * (SHIFT * 0.7);
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

    // Copy desired targets into reusable temps (no allocations)
    const lookAt = tmpLookAtRef.current.copy(desiredLookAtRef.current);
    const camPosV = tmpCamPosRef.current.copy(desiredCamPosRef.current);

    // Apply HUD composition shift (no drift)
    applyHudShift(lookAt, camPosV);

    // Smooth camera position
    camera.position.lerp(camPosV, 0.08);
    lastCameraPosRef.current.copy(camera.position);

    // Drive look direction through OrbitControls when present
    if (controls?.target) {
      controls.target.lerp(lookAt, 0.08);
      lastControlTargetRef.current.copy(controls.target);
      controls.update();
      return;
    }

    currentLookAtRef.current.lerp(lookAt, 0.08);
    lastControlTargetRef.current.copy(currentLookAtRef.current);
    camera.lookAt(currentLookAtRef.current);
  });

  return null;
}

export function SceneCanvas(props: SceneCanvasProps) {
  const theme = props.prefs?.theme ?? "night";
  const orbitMode = props.prefs?.orbitMode ?? "auto";
  const selectedIdCtx = useSelectedId();

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
      Array.isArray(props.objectSelection?.highlighted_objects)
        ? props.objectSelection.highlighted_objects.map(String)
        : [],
    [props.objectSelection]
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
      props.objectSelection?.dim_unrelated_objects === true
        ? sceneObjectIds.filter((id) => !highlightedSet.has(id) && id !== props.focusedId && id !== selectedIdCtx).slice(0, 6)
        : [];

    traceHighlightFlow("scene_canvas", {
      highlightedObjectIds,
      dimUnrelatedObjects: props.objectSelection?.dim_unrelated_objects === true,
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
    props.objectSelection,
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
          if (localIsOrbitingRef.current || isHudInteractingRef.current) return;
          // Clicking empty space should reliably deselect
          preserveCameraOnClearRef.current = true;
          props.selectedSetterRef?.current?.(null);
          props.onSelectedChange?.(null);
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
                objectSelection={props.objectSelection ?? null}
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
              />

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
