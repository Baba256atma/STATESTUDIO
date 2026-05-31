"use client";

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";

import { smoothValue } from "../lib/smooth";
import { traceHighlightFlow } from "../lib/debug/highlightDebugTrace";
import type { ScenarioActionPropagationIntent } from "../lib/simulation/propagationTriggerTypes";
import type { WarRoomOverlayDetail, WarRoomOverlaySummary } from "../lib/warroom/warRoomTypes";
import { useSceneOverlayRuntime } from "../lib/overlay/useSceneOverlayRuntime";
import { bindWindowListener, logDomListenerStable } from "../lib/dom/domListenerLifecycle";
import { SceneOverlayRenderer } from "./scene/overlay/SceneOverlayRenderer";
import {
  isProjectedPointWithinSafeRegion,
  measureFrameDrift,
  resolveLayoutAwareFrameSpec,
} from "../lib/scene/layoutAwareFraming";
import {
  CALM_FRAMING,
  clampLookAtDeltaToRadius,
  sceneRadiusFromBoundsSize,
} from "../lib/scene/calmCameraFraming";
import {
  calculateExecutiveCameraDistance,
  countSceneRelationships,
  normalizeExecutiveObjectScale,
} from "../lib/scene/executiveSceneComposition";
import {
  computeWorkspaceScaleMetrics,
  evaluateCameraStability,
  registerAutoFrameSignature,
} from "../lib/scene/density";
import { runSceneOccupancyAudit } from "../lib/scene/sceneOccupancyAudit";
import { runExecutiveLayoutAudit } from "../lib/scene/executiveLayoutAuditRuntime";
import { buildExecutiveLayoutAuditInputSignature } from "../lib/scene/executiveLayoutAuditSignature";
import { resolveWorkspaceLayoutContract } from "../lib/ui/workspaceLayoutController";
import { detectHudDrift, markHudDriftBaseline } from "../lib/hud/hudAnchoringRuntime";
import {
  markSceneHudDriftBaseline,
  scheduleSceneHudDriftBaseline,
  scheduleSceneHudDriftDetect,
} from "../lib/scene/sceneHudDriftGuard";
import { buildSceneActivityDriftSignature } from "../lib/runtime/sceneParityRuntime";
import { updateIdleRuntimeSemanticSignature } from "../lib/runtime/idleRuntimeStabilityGuard";
import {
  buildSceneObjectsRegistrySignature,
  syncSceneObjectRegistry,
} from "../lib/scene/objectRegistryRuntime";
import { buildSceneObjectSelectionSignature } from "../lib/scene/sceneObjectSelectionStable";
import {
  SCENE_SHELL_CLASS,
  SCENE_WORLD_LAYER_CLASS,
} from "../lib/scene/sceneLayerContract";
import {
  useClearAllOverrides,
  useOverrides,
  usePruneOverridesTo,
  useSelectedId,
  useSetOverride,
  useSetSelectedId,
} from "./SceneContext";
import {
  resolveNexoraSceneEnvironment,
  sceneRendererThemeFromUi,
  type SceneAtmosphereMode,
} from "../lib/scene/nexoraSceneEnvironment";
import type { ResolvedUiTheme } from "../lib/ui/nexoraUiTheme";
import { SceneInfoHudOverlay } from "./scene/SceneInfoHudOverlay";
import type { SceneInfoHudProps } from "./scene/SceneInfoHud";
import { ObjectInfoHudOverlay } from "./scene/ObjectInfoHudOverlay";
import type { ObjectInfoHudModel } from "../lib/scene/objectInfoHudTypes";
import type { EditableObjectPatch } from "../lib/modeling/objectEditingRuntime";
import type { PropagationPath, PropagationPathPatch } from "../lib/propagation/propagationAuthoringRuntime";
import type { ExecutiveTimelineHudModel } from "../lib/scene/executiveTimelineHudTypes";
import { ExecutiveQuickActionsDockOverlay } from "./scene/ExecutiveQuickActionsDockOverlay";
import type { ExecutiveQuickActionsDockOverlayProps } from "./scene/ExecutiveQuickActionsDockOverlay";
import { ExecutiveBottomWorkspaceOverlay } from "./scene/ExecutiveBottomWorkspaceOverlay";
import { ExecutiveStatusHudOverlay } from "./scene/status/ExecutiveStatusHudOverlay";
import type { ExecutiveStatusHudModel } from "./scene/status/ExecutiveStatusHud.types";
import { ExecutiveSceneToolbarOverlay } from "./scene/navigation/ExecutiveSceneToolbarOverlay";
import { ExecutiveFocusModeDocumentBridge } from "./scene/navigation/ExecutiveFocusModeDocumentBridge";
import { SceneHudLayer } from "./scene/SceneHudLayer";
import { SceneNavigationController } from "./scene/navigation/SceneNavigationController";
import { SCENE_NAVIGATION_ACTION_EVENT } from "../lib/scene/sceneNavigationContract";
import {
  resolveExecutiveCameraFrameForMode,
  resolveExecutiveDefaultCameraForMode,
} from "../lib/workspace/workspaceModeTransitionRuntime";
import {
  buildExecutiveSceneObjectSignature,
  isValidExecutiveCameraFrame,
  resolveExecutiveCameraPresetFrame,
} from "../lib/scene/executiveCameraPresets";
import {
  createCameraTransitionState,
  stepCameraTransition,
  type CameraTransitionState,
} from "../lib/scene/sceneNavigationCamera";
import { devLogOnSignatureChange } from "../lib/runtime/diagnosticIdleGate";
import {
  hydrateExecutiveFocusMode,
} from "../lib/workspace/executiveFocusModeRuntime";
import {
  getWorkspaceViewMode,
  getWorkspaceViewModeServerSnapshot,
  hydrateWorkspaceViewMode,
  subscribeWorkspaceViewMode,
} from "../lib/workspace/workspaceViewModeRuntime";
import type { WorkspaceViewMode } from "../lib/workspace/workspaceViewModeTypes";
import { logCameraProfileForMode, validateWorkspaceModeActivation } from "../lib/workspace/workspaceModeValidation";
import { resolveWorkspaceDensityProfile } from "../lib/scene/density/workspaceDensityModeProfiles";
import type { NexoraRelationship } from "../lib/relationships/relationshipTypes";
import {
  resolveNexoraHudThemeMode,
  type NexoraHudThemeMode,
} from "../lib/scene/nexoraHudTheme";
import { logHudThemeModeResolved } from "../lib/ui/cameraToolbarInstrumentation";
import { logWorkspaceSceneThemeUpdated } from "../lib/ui/workspaceAppearanceInstrumentation";
import { nx } from "./ui/nexoraTheme";

const CANVAS_STATIC_MODE = true;

function roundExecutiveScaleInput(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.round(value * 100) / 100;
}

function holdStableScaleInput(
  ref: React.MutableRefObject<{ signature: string; value: number } | null>,
  signature: string,
  next: number,
  threshold = 0.02
): number {
  const rounded = roundExecutiveScaleInput(next);
  const previous = ref.current;
  if (!previous || previous.signature !== signature || Math.abs(rounded - previous.value) >= threshold) {
    ref.current = { signature, value: rounded };
    return rounded;
  }
  return previous.value;
}

type SceneCanvasProps = {
  prefs: any;
  /** Resolved app chrome theme; drives scene clear color / fog / lights with atmosphere prefs. */
  resolvedUiTheme?: ResolvedUiTheme;
  /** Softer hover / drift on the 3D scene (from Settings → Motion low). */
  motionCalm?: boolean;
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
  /** E2:2 executive dock-aware camera framing (optional). */
  layoutDockInsets?: {
    leftDockInsetRatio?: number;
    rightDockInsetRatio?: number;
  };

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
  selectedObjectId?: string | null;

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
  onObjectPositionChange?: (
    objectId: string,
    position: { x: number; y: number; z: number },
    phase: "drag" | "move"
  ) => void;
  selectedRelationshipId?: string | null;
  onRelationshipSelect?: (relationship: NexoraRelationship) => void;
  selectedPropagationPathId?: string | null;
  onPropagationPathSelect?: (path: PropagationPath) => void;
  onCreateImpactPath?: (sourceObjectId?: string | null) => void;
  onSelectedScreenX?: (sx: number | null) => void;
  /** E2:8 embedded executive scene HUD (Type-C). */
  sceneInfoHud?: SceneInfoHudProps | null;
  /** E2:9 embedded executive object intelligence HUD (Type-C). */
  objectInfoHud?: {
    model: ObjectInfoHudModel;
    sceneJson: unknown;
    onCreateRelationship?: () => void;
    onDeleteRelationship?: (relationshipId: string) => void;
    onCreateImpactPath?: (sourceObjectId?: string | null) => void;
    onEditPropagationPath?: (pathId: string, patch: PropagationPathPatch) => void;
    onDeletePropagationPath?: (pathId: string) => void;
    onEditObject?: (objectId: string, patch: EditableObjectPatch) => void;
    onDuplicateObject?: (objectId: string) => void;
    onDeleteObject?: (objectId: string) => void;
  } | null;
  /** E2:10 embedded executive timeline HUD (Type-C). */
  timelineHud?: ExecutiveTimelineHudModel | null;
  /** E2:16 executive quick actions dock (Type-C). */
  quickActionsDock?: Omit<ExecutiveQuickActionsDockOverlayProps, "stackAboveTimeline"> | null;
  /** E2:22 executive status intelligence HUD (Type-C). */
  executiveStatusHud?: ExecutiveStatusHudModel | null;
  /** E2:21 scene-native executive navigation toolbar + shared HUD theme mode. */
  hudThemeMode?: NexoraHudThemeMode;
  sceneNavigationToolbar?: boolean;
  /** @deprecated Use sceneNavigationToolbar */
  cameraToolbar?: boolean;
};

function SceneFogSync({ color, near, far }: { color: string; near: number; far: number }) {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.Fog(new THREE.Color(color), near, far);
    return () => {
      scene.fog = null;
    };
  }, [scene, color, near, far]);
  return null;
}

/** Demand frameloop: keep drawing while stable; pause invalidation briefly during shell column width animation. */
function SceneDemandInvalidateDriver({
  layoutPauseRef,
  invalidateOutRef,
  sceneJson,
  isOrbiting,
  localIsOrbitingRef,
  viewMode,
}: {
  layoutPauseRef: React.MutableRefObject<boolean>;
  invalidateOutRef: React.MutableRefObject<(() => void) | null>;
  sceneJson: unknown;
  isOrbiting: boolean;
  localIsOrbitingRef: React.MutableRefObject<boolean>;
  viewMode: WorkspaceViewMode;
}) {
  const { invalidate } = useThree();
  const lastFrameTickSignatureRef = useRef<string | null>(null);
  useLayoutEffect(() => {
    invalidateOutRef.current = invalidate;
    if (process.env.NODE_ENV !== "production") {
      const signature = "initial_layout_invalidate";
      if (lastFrameTickSignatureRef.current !== signature) {
        lastFrameTickSignatureRef.current = signature;
        console.debug("[Nexora][CanvasFrameTick]", { reason: "initial_layout_invalidate" });
      }
    }
    invalidate();
  }, [invalidate, invalidateOutRef]);
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      const signature = "scene_payload_changed";
      if (lastFrameTickSignatureRef.current !== signature) {
        lastFrameTickSignatureRef.current = signature;
        console.debug("[Nexora][CanvasFrameTick]", { reason: "scene_payload_changed" });
      }
    }
    invalidate();
  }, [sceneJson, invalidate]);
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      const signature = `view_mode_${viewMode}`;
      if (lastFrameTickSignatureRef.current !== signature) {
        lastFrameTickSignatureRef.current = signature;
        console.debug("[Nexora][CanvasFrameTick]", { reason: "view_mode_changed", viewMode });
      }
    }
    invalidate();
  }, [invalidate, viewMode]);
  useEffect(() => {
    if (!isOrbiting && !localIsOrbitingRef.current) return;
    if (layoutPauseRef.current) return;
    if (process.env.NODE_ENV !== "production") {
      const signature = "orbit_interaction";
      if (lastFrameTickSignatureRef.current !== signature) {
        lastFrameTickSignatureRef.current = signature;
        console.debug("[Nexora][CanvasFrameTick]", { reason: "orbit_interaction" });
      }
    }
    invalidate();
  }, [invalidate, isOrbiting, layoutPauseRef, localIsOrbitingRef]);
  return null;
}

function AnimatedScaleGroup({
  target,
  staticMode = false,
  children,
}: {
  target: number;
  staticMode?: boolean;
  children: React.ReactNode;
}) {
  if (staticMode) {
    return <group scale={target}>{children}</group>;
  }
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
  const lastSelectedIdRef = useRef<string | null>(selectedId);

  useEffect(() => {
    selectedIdRefLocal.current = selectedId;
    if (lastSelectedIdRef.current === selectedId) return;
    lastSelectedIdRef.current = selectedId;
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
  opts?: {
    horizontalBias?: number;
    verticalBias?: number;
    pullback?: number;
    objectCount?: number;
    relationshipCount?: number;
    viewportWidth?: number;
    viewportHeight?: number;
    viewMode?: WorkspaceViewMode;
  }
): { position: [number, number, number]; lookAt: [number, number, number]; fov: number } {
  const executiveDistance = calculateExecutiveCameraDistance({
    objectCount: opts?.objectCount ?? 1,
    relationshipCount: opts?.relationshipCount ?? 0,
    boundsSize: bounds.size,
    viewportWidth: opts?.viewportWidth,
    viewportHeight: opts?.viewportHeight,
  });
  const radius = executiveDistance.distance;
  const viewMode = opts?.viewMode ?? "2D";
  return resolveExecutiveCameraFrameForMode(
    viewMode,
    { center: bounds.center, size: bounds.size },
    radius,
    {
      horizontalBias: opts?.horizontalBias,
      verticalBias: opts?.verticalBias,
      pullback: opts?.pullback,
    }
  );
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
  selectedObjectId,
  focusPinned,
  focusMode,
  focusedId,
  sceneJson,
  camPos,
  overridesRef,
  cameraLockedByUser,
  isOrbiting,
  hudDockSide,
  layoutDockInsets,
  controlsRef,
  localIsOrbitingRef,
  preserveCameraOnClearRef,
  orbitControlsEnabled,
  layoutPauseRef,
  layoutResumeNonce: _layoutResumeNonce,
}: {
  selectedObjectId: string | null;
  focusPinned: boolean;
  focusMode: "all" | "selected";
  focusedId: string | null;
  sceneJson: any | null;
  camPos: [number, number, number];
  overridesRef: React.MutableRefObject<Record<string, any>>;
  cameraLockedByUser: boolean;
  isOrbiting: boolean;
  hudDockSide?: "left" | "right";
  layoutDockInsets?: {
    leftDockInsetRatio?: number;
    rightDockInsetRatio?: number;
  };
  controlsRef?: React.MutableRefObject<any | null>;
  localIsOrbitingRef?: React.MutableRefObject<boolean>;
  preserveCameraOnClearRef?: React.MutableRefObject<boolean>;
  orbitControlsEnabled: boolean;
  layoutPauseRef?: React.MutableRefObject<boolean>;
  /** Bumped when left command column finishes width transition so layout-aware framing can re-run. */
  layoutResumeNonce?: number;
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
  const lastCameraFocusSignatureRef = useRef<string | null>(null);
  const baselineCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(camPos[0], camPos[1], camPos[2]));
  const baselineLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const lastBaselineSignatureRef = useRef<string>("");
  const lastDriftRecoveryAtRef = useRef<number>(0);
  const lastDriftLogSigRef = useRef<string>("");
  const lastRecoveryLogSigRef = useRef<string>("");
  const lastLayoutFrameAppliedAtRef = useRef<number>(0);
  const lastLayoutFrameKeyRef = useRef<string>("");
  const lastViewportRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  /** Stops micro-jitter when camera is already essentially at the framing target. */
  const lastCamToTargetDistRef = useRef<number | null>(null);

  /** World-units: desired already matches baseline (avoid pointless recovery writes). */
  const FRAMING_DESIRED_BASELINE_EPS = 0.00025;

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
    suspendAutoCameraUntilRef.current = performance.now() + 420;
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
    const viewportDelta = Math.abs(size.width - lastViewportRef.current.width) + Math.abs(size.height - lastViewportRef.current.height);
    lastViewportRef.current = { width: size.width, height: size.height };
    if (layoutPauseRef?.current) return;
    if (!signature || signature === "empty") return;
    const previousSignature = lastAutoFrameSigRef.current;
    const stability = evaluateCameraStability({
      trigger: "auto_frame",
      nextObjectCount: objects.length,
      signatureChanged: previousSignature !== signature,
    });
    if (!stability.allowFullReframe) {
      lastAutoFrameSigRef.current = signature;
      registerAutoFrameSignature(signature, objects.length);
      return;
    }
    if (lastAutoFrameSigRef.current === signature) return;

    const bounds = computeSceneBounds(objects);
    if (!bounds) return;

    const frameSpec = resolveLayoutAwareFrameSpec({
      viewportWidth: size.width,
      viewportHeight: size.height,
      hudDockSide,
      leftDockInsetRatio: layoutDockInsets?.leftDockInsetRatio,
      rightDockInsetRatio: layoutDockInsets?.rightDockInsetRatio,
    });
    const frame = computeCameraFrameFromBounds(bounds, {
      horizontalBias: frameSpec.horizontalBias,
      verticalBias: frameSpec.verticalBias,
      pullback: frameSpec.pullback,
      objectCount: objects.length,
      relationshipCount: countSceneRelationships(sceneJson),
      viewportWidth: size.width,
      viewportHeight: size.height,
    });

    const frameKey = [
      signature,
      hudDockSide ?? "none",
      size.width.toFixed(1),
      size.height.toFixed(1),
      frame.position.map((n) => n.toFixed(3)).join(","),
      frame.lookAt.map((n) => n.toFixed(3)).join(","),
    ].join("|");

    const now = performance.now();
    const frameAlreadyApplied = lastLayoutFrameKeyRef.current === frameKey;
    const tinyViewportChange = viewportDelta < 2;
    const recentlyApplied = now - lastLayoutFrameAppliedAtRef.current < 250;

    if (frameAlreadyApplied || (tinyViewportChange && recentlyApplied)) {
      return;
    }

    captureBaselineFrame(frame.position, frame.lookAt, `${signature}:${hudDockSide ?? "none"}:${size.width}x${size.height}`);
    desiredCamPosRef.current.set(frame.position[0], frame.position[1], frame.position[2]);
    desiredLookAtRef.current.set(frame.lookAt[0], frame.lookAt[1], frame.lookAt[2]);
    currentLookAtRef.current.set(frame.lookAt[0], frame.lookAt[1], frame.lookAt[2]);

    // Apply the fresh frame immediately so first visible frame is stable.
    const applyNow = performance.now();
    const autoCameraSuspended = applyNow < suspendAutoCameraUntilRef.current;
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
    lastLayoutFrameAppliedAtRef.current = applyNow;
    lastLayoutFrameKeyRef.current = frameKey;

    lastAutoFrameSigRef.current = signature;
    registerAutoFrameSignature(signature, objects.length);
  }, [
    sceneJson,
    hudDockSide,
    camera,
    cameraLockedByUser,
    controlsRef,
    isOrbiting,
    localIsOrbitingRef,
    size.height,
    size.width,
    _layoutResumeNonce,
  ]);

  useEffect(() => {
    const stableSelectedId =
      typeof selectedObjectId === "string" && selectedObjectId.trim().length > 0
        ? selectedObjectId.trim()
        : null;
    const cameraFocusSignature = stableSelectedId ? `selected:${stableSelectedId}` : "none";
    if (lastCameraFocusSignatureRef.current === cameraFocusSignature) {
      return;
    }
    lastCameraFocusSignatureRef.current = cameraFocusSignature;

    if (!stableSelectedId) {
      return;
    }

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
    lastFocusIdRef.current = stableSelectedId;
    const targetObject = Array.isArray(sceneJson?.scene?.objects)
      ? (sceneJson.scene.objects as any[]).find((item) => {
          const stableId = String(item?.id ?? item?.name ?? "");
          return stableId === stableSelectedId;
        })
      : null;
    const targetPos = targetObject ? readObjectPos(targetObject) : null;
    if (!targetPos) return;
    const frameSpec = resolveLayoutAwareFrameSpec({
      viewportWidth: size.width,
      viewportHeight: size.height,
      hudDockSide,
      leftDockInsetRatio: layoutDockInsets?.leftDockInsetRatio,
      rightDockInsetRatio: layoutDockInsets?.rightDockInsetRatio,
    });
    const baselineCamPos = baselineCamPosRef.current;
    const baselineLookAt = baselineLookAtRef.current;
    desiredCamPosRef.current.copy(baselineCamPos);
    desiredLookAtRef.current.copy(baselineLookAt);
    const projected = new THREE.Vector3(targetPos[0], targetPos[1], targetPos[2]).project(camera);
    const assistKey = `${stableSelectedId}:${projected.x.toFixed(1)}:${projected.y.toFixed(1)}`;
    if (lastCameraAssistKeyRef.current === assistKey) return;
    const isVisible = isProjectedPointWithinSafeRegion(projected, frameSpec.safeRegion);
    if (isVisible) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[Nexora][Framing] assist skipped (already safe)", { focusedId, projected, safeRegion: frameSpec.safeRegion });
      }
      lastCameraAssistKeyRef.current = assistKey;
      return;
    }
    const bounds = computeSceneBounds(Array.isArray(sceneJson?.scene?.objects) ? sceneJson.scene.objects : []);
    const sceneR = bounds ? sceneRadiusFromBoundsSize(bounds.size) : 4;
    const focusVector = new THREE.Vector3(targetPos[0], targetPos[1], targetPos[2]);
    const rawNext = baselineLookAt.clone().lerp(focusVector, CALM_FRAMING.maxFocusAssistLookLerp);
    const clamped = clampLookAtDeltaToRadius(
      baselineLookAt,
      rawNext,
      sceneR,
      CALM_FRAMING.maxLookShiftVsRadius
    );
    const nextLookAt = new THREE.Vector3(clamped.x, clamped.y, clamped.z);
    const delta = nextLookAt.clone().sub(baselineLookAt);
    desiredLookAtRef.current.copy(nextLookAt);
    desiredCamPosRef.current.copy(baselineCamPos);
    desiredCamPosRef.current.x += delta.x * CALM_FRAMING.focusAssistCamPosAlongDelta;
    desiredCamPosRef.current.y += delta.y * CALM_FRAMING.focusAssistCamPosVerticalScale;
    suspendAutoCameraUntilRef.current = performance.now() + 380;
    lastCameraAssistKeyRef.current = assistKey;
    globalThis.console?.debug?.("[Nexora][CalmCameraMove]", {
      selectedObjectId: stableSelectedId,
      signature: cameraFocusSignature,
    });
    if (process.env.NODE_ENV !== "production") {
      console.log("[Nexora][Framing] assist applied", { focusedId, projected, safeRegion: frameSpec.safeRegion });
    }
  }, [camera, cameraLockedByUser, controlsRef, focusMode, focusPinned, focusedId, hudDockSide, layoutDockInsets, orbitControlsEnabled, overridesRef, preserveCameraOnClearRef, sceneJson, selectedObjectId, size.height, size.width]);

  const applyHudShift = (lookAt: THREE.Vector3, camPosV: THREE.Vector3) => {
    const frameSpec = resolveLayoutAwareFrameSpec({
      viewportWidth: size.width,
      viewportHeight: size.height,
      hudDockSide,
      leftDockInsetRatio: layoutDockInsets?.leftDockInsetRatio,
      rightDockInsetRatio: layoutDockInsets?.rightDockInsetRatio,
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
      suspendAutoCameraUntilRef.current = now + CALM_FRAMING.userSettleAfterOrbitMs;
      lastCameraPosRef.current.copy(camera.position);
      lastCamToTargetDistRef.current = null;
      if (controls?.target) {
        lastControlTargetRef.current.copy(controls.target);
      }
      return;
    }

    if (layoutPauseRef?.current) {
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
      // Steady-state lerp uses HUD-shifted targets; drift must compare the same composition
      // or we falsely exceed threshold forever and spam baseline recovery.
      const shiftedBasePos = tmpCamPosRef.current.copy(baselineCamPosRef.current);
      const shiftedBaseLook = tmpLookAtRef.current.copy(baselineLookAtRef.current);
      applyHudShift(shiftedBaseLook, shiftedBasePos);

      const drift = measureFrameDrift({
        currentPosition: camera.position,
        currentLookAt,
        baselinePosition: [shiftedBasePos.x, shiftedBasePos.y, shiftedBasePos.z],
        baselineLookAt: [shiftedBaseLook.x, shiftedBaseLook.y, shiftedBaseLook.z],
      });

      const driftExceeded = drift.positionDistance > 0.85 || drift.lookAtDistance > 0.55;

      if (driftExceeded) {
        const desiredPosDelta = desiredCamPosRef.current.distanceTo(baselineCamPosRef.current);
        const desiredLookDelta = desiredLookAtRef.current.distanceTo(baselineLookAtRef.current);
        const desiredAlreadyBaseline =
          desiredPosDelta < FRAMING_DESIRED_BASELINE_EPS && desiredLookDelta < FRAMING_DESIRED_BASELINE_EPS;
        const recoveryCoolingDown = now - lastLayoutFrameAppliedAtRef.current < 420;
        if (recoveryCoolingDown && desiredAlreadyBaseline) {
          return;
        }

        let appliedRecovery = false;
        if (!desiredAlreadyBaseline) {
          desiredCamPosRef.current.copy(baselineCamPosRef.current);
          desiredLookAtRef.current.copy(baselineLookAtRef.current);
          appliedRecovery = true;
        }

        if (process.env.NODE_ENV !== "production" && now - lastDriftRecoveryAtRef.current > 1200) {
          lastDriftRecoveryAtRef.current = now;
          const driftSig = [
            drift.positionDistance.toFixed(3),
            drift.lookAtDistance.toFixed(3),
            lastBaselineSignatureRef.current,
          ].join("|");
          if (lastDriftLogSigRef.current !== driftSig) {
            lastDriftLogSigRef.current = driftSig;
            console.log("[Nexora][Framing] drift threshold exceeded", drift);
          }
          if (appliedRecovery) {
            const recSig = `${driftSig}|rec`;
            if (lastRecoveryLogSigRef.current !== recSig) {
              lastRecoveryLogSigRef.current = recSig;
              console.log("[Nexora][Framing] baseline recovery applied", {
                signature: lastBaselineSignatureRef.current,
              });
            }
          }
        }
      } else {
        lastDriftLogSigRef.current = "";
        lastRecoveryLogSigRef.current = "";
      }
    }

    // Copy desired targets into reusable temps (no allocations)
    const lookAt = tmpLookAtRef.current.copy(desiredLookAtRef.current);
    const camPosV = tmpCamPosRef.current.copy(desiredCamPosRef.current);

    // Apply HUD composition shift (no drift)
    applyHudShift(lookAt, camPosV);

    const lerpA = CALM_FRAMING.shellCameraLerp;
    const prevCam = lastCameraPosRef.current;
    const distToTarget = camera.position.distanceTo(camPosV);
    const CAM_SNAP_EPS = 0.015;
    if (distToTarget < CAM_SNAP_EPS) {
      camera.position.copy(camPosV);
      lastCamToTargetDistRef.current = 0;
    } else {
      const prevDist = lastCamToTargetDistRef.current;
      lastCamToTargetDistRef.current = distToTarget;
      if (
        prevDist != null &&
        Math.abs(distToTarget - prevDist) < 0.0001 &&
        distToTarget < 0.06
      ) {
        camera.position.copy(camPosV);
      } else {
        camera.position.lerp(camPosV, lerpA);
        const dcx = camera.position.x - prevCam.x;
        const dcy = camera.position.y - prevCam.y;
        const dcz = camera.position.z - prevCam.z;
        const cd = Math.sqrt(dcx * dcx + dcy * dcy + dcz * dcz);
        if (cd > CALM_FRAMING.maxCamPosStep && cd > 1e-6) {
          const s = CALM_FRAMING.maxCamPosStep / cd;
          camera.position.set(prevCam.x + dcx * s, prevCam.y + dcy * s, prevCam.z + dcz * s);
        }
      }
    }
    if (camera.position.distanceTo(camPosV) < CAM_SNAP_EPS) {
      camera.position.copy(camPosV);
      lastCamToTargetDistRef.current = 0;
    }
    lastCameraPosRef.current.copy(camera.position);

    // Drive look direction through OrbitControls when present
    if (controls?.target) {
      const pt = controls.target;
      const TARGET_SNAP = 0.015;
      if (pt.distanceTo(lookAt) < TARGET_SNAP) {
        pt.copy(lookAt);
      } else {
        const ptx = pt.x;
        const pty = pt.y;
        const ptz = pt.z;
        pt.lerp(lookAt, lerpA);
        const dtx = pt.x - ptx;
        const dty = pt.y - pty;
        const dtz = pt.z - ptz;
        const td = Math.sqrt(dtx * dtx + dty * dty + dtz * dtz);
        if (td > CALM_FRAMING.maxTargetStep && td > 1e-6) {
          const s = CALM_FRAMING.maxTargetStep / td;
          pt.set(ptx + dtx * s, pty + dty * s, ptz + dtz * s);
        }
        if (pt.distanceTo(lookAt) < TARGET_SNAP) {
          pt.copy(lookAt);
        }
      }
      lastControlTargetRef.current.copy(controls.target);
      controls.update();
      return;
    }

    const cl = currentLookAtRef.current;
    const TARGET_SNAP_FALLBACK = 0.015;
    if (cl.distanceTo(lookAt) < TARGET_SNAP_FALLBACK) {
      cl.copy(lookAt);
    } else {
      const clx = cl.x;
      const cly = cl.y;
      const clz = cl.z;
      cl.lerp(lookAt, lerpA);
      const dlx = cl.x - clx;
      const dly = cl.y - cly;
      const dlz = cl.z - clz;
      const ld = Math.sqrt(dlx * dlx + dly * dly + dlz * dlz);
      if (ld > CALM_FRAMING.maxTargetStep && ld > 1e-6) {
        const s = CALM_FRAMING.maxTargetStep / ld;
        cl.set(clx + dlx * s, cly + dly * s, clz + dlz * s);
      }
      if (cl.distanceTo(lookAt) < TARGET_SNAP_FALLBACK) {
        cl.copy(lookAt);
      }
    }
    lastControlTargetRef.current.copy(currentLookAtRef.current);
    camera.lookAt(currentLookAtRef.current);
  });

  return null;
}

function StaticSceneFramer({
  sceneJson,
  controlsRef,
  localIsOrbitingRef,
  isOrbiting,
  enabled,
  reframeNonce = 0,
  viewMode = "2D",
}: {
  sceneJson: any | null;
  controlsRef: React.MutableRefObject<any | null>;
  localIsOrbitingRef: React.MutableRefObject<boolean>;
  isOrbiting: boolean;
  enabled: boolean;
  reframeNonce?: number;
  viewMode?: WorkspaceViewMode;
}) {
  const { camera, invalidate, size } = useThree();
  const lastAppliedSignatureRef = useRef<string | null>(null);
  const transitionRef = useRef<CameraTransitionState | null>(null);

  useEffect(() => {
    if (reframeNonce > 0) {
      lastAppliedSignatureRef.current = null;
    }
  }, [reframeNonce]);

  useEffect(() => {
    lastAppliedSignatureRef.current = null;
  }, [viewMode]);

  useFrame((_, delta) => {
    const transition = transitionRef.current;
    if (!transition) return;
    const finished = stepCameraTransition(camera, controlsRef.current, transition, delta * 1000);
    invalidate();
    if (finished) transitionRef.current = null;
  });

  useEffect(() => {
    if (!enabled) {
      devLogOnSignatureChange("[E2:87][Camera]", `static-disabled:${viewMode}`, {
        activeMode: viewMode,
        skipped: true,
        reason: "static_framer_disabled",
      });
      return;
    }
    if (!sceneJson?.scene?.objects || !Array.isArray(sceneJson.scene.objects)) {
      devLogOnSignatureChange("[E2:87][Camera]", `missing-objects:${viewMode}`, {
        activeMode: viewMode,
        skipped: true,
        reason: "missing_scene_objects",
      });
      return;
    }
    if (isOrbiting || localIsOrbitingRef.current) {
      devLogOnSignatureChange("[E2:87][Camera]", `orbit-active:${viewMode}`, {
        activeMode: viewMode,
        skipped: true,
        reason: "orbit_active",
      });
      return;
    }
    const objects = sceneJson.scene.objects as any[];
    const sceneSignature = buildExecutiveSceneObjectSignature(sceneJson);
    const framingSignature = `${sceneSignature}|${viewMode}|${reframeNonce}`;
    if (lastAppliedSignatureRef.current === framingSignature) {
      devLogOnSignatureChange("[E2:87][Camera]", `unchanged:${viewMode}:${sceneSignature}`, {
        activeMode: viewMode,
        skipped: true,
        reason: "unchanged_framing_signature",
        framingSignature,
      });
      return;
    }
    const bounds = computeSceneBounds(objects);
    if (!bounds) {
      devLogOnSignatureChange("[E2:87][Camera]", `missing-bounds:${viewMode}:${sceneSignature}`, {
        activeMode: viewMode,
        skipped: true,
        reason: "missing_scene_bounds",
      });
      return;
    }

    const frame = resolveExecutiveCameraPresetFrame({
      preset: viewMode === "2D" ? "VIEW_2D" : "VIEW_3D",
      mode: viewMode,
      sceneJson,
      viewportWidth: size.width,
      viewportHeight: size.height,
    });
    if (!isValidExecutiveCameraFrame(frame)) return;
    const position = frame.position;
    const lookAt = frame.lookAt;

    transitionRef.current = createCameraTransitionState(
      camera,
      controlsRef.current,
      {
        position: new THREE.Vector3(position[0], position[1], position[2]),
        lookAt: new THREE.Vector3(lookAt[0], lookAt[1], lookAt[2]),
        fov: frame.fov,
      },
      560
    );
    lastAppliedSignatureRef.current = framingSignature;
    devLogOnSignatureChange(viewMode === "2D" ? "[E2:87][View2D]" : "[E2:87][View3D]", framingSignature, {
      activeMode: viewMode,
      cameraProfile: viewMode === "2D" ? "executive_2d_strategic" : "executive_3d_strategic",
      position,
      target: lookAt,
      fov: frame.fov,
    });
    logCameraProfileForMode(viewMode);
    validateWorkspaceModeActivation({
      requestedMode: viewMode,
      source: "static_scene_framer",
      sceneSubscribed: true,
      cameraApplied: true,
    });
    invalidate();

    devLogOnSignatureChange("[E2:87][Camera]", framingSignature, {
      signature: framingSignature,
      viewMode,
      position,
      lookAt,
      fov: frame.fov,
      size: Math.max(bounds.size[0], bounds.size[1], bounds.size[2], 1),
    });
  }, [camera, controlsRef, enabled, invalidate, isOrbiting, localIsOrbitingRef, reframeNonce, sceneJson, size.height, size.width, viewMode]);

  return null;
}

function SceneCanvasComponent(props: SceneCanvasProps) {
  const resolvedUi: ResolvedUiTheme = props.resolvedUiTheme ?? "night";
  const atmosphere: SceneAtmosphereMode = (props.prefs?.theme ?? "night") as SceneAtmosphereMode;
  const sceneEnv = useMemo(
    () => resolveNexoraSceneEnvironment(resolvedUi, atmosphere),
    [resolvedUi, atmosphere]
  );
  useEffect(() => {
    logWorkspaceSceneThemeUpdated(resolvedUi);
  }, [resolvedUi]);
  const rendererTheme = useMemo(
    () => sceneRendererThemeFromUi(resolvedUi, atmosphere),
    [resolvedUi, atmosphere]
  );
  const orbitMode = props.prefs?.orbitMode ?? "auto";
  const selectedIdCtx = useSelectedId();
  const lastHighlightedRef = useRef<string | null>(null);
  useEffect(() => {
    const nextSelectedId = typeof props.selectedObjectId === "string" ? props.selectedObjectId.trim() : "";
    if (!nextSelectedId) {
      lastHighlightedRef.current = null;
      return;
    }
    if (selectedIdCtx === nextSelectedId) return;
    if (lastHighlightedRef.current === nextSelectedId) return;
    lastHighlightedRef.current = nextSelectedId;
    const id = requestAnimationFrame(() => {
      props.selectedSetterRef.current?.(nextSelectedId);
    });
    return () => cancelAnimationFrame(id);
  }, [props.selectedObjectId, props.selectedSetterRef, selectedIdCtx]);
  const sceneFragilityLevel = useMemo(() => {
    const level =
      props.sceneJson?.scene?.scanner_state_vector?.fragility_level ??
      props.sceneJson?.state_vector?.fragility_level ??
      props.sceneJson?.fragility_level;
    return typeof level === "string" ? level : null;
  }, [props.sceneJson]);

  const overlayRuntime = useSceneOverlayRuntime({
    sceneJson: props.sceneJson,
    loops: props.loops,
    selectedObjectId: selectedIdCtx,
    scenarioTrigger: props.scenarioTrigger,
    manualPropagationSourceId: props.manualPropagationSourceId,
    propagationPayload: props.propagationPayload,
    objectSelection: props.objectSelection,
    fragilityLevel: sceneFragilityLevel,
    previewEnabled: true,
  });

  const {
    mergedPropagationOverlay,
    decisionPathOverlay,
    combinedObjectSelection,
    scenarioOverlayPackage,
    propagationLoading,
    propagationError,
    propagationMode,
    simulationOverlay,
  } = overlayRuntime;

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
      if (lastOverlayDispatchKeyRef.current !== "empty:not_war_room") {
        lastOverlayDispatchKeyRef.current = "empty:not_war_room";
        props.onScenarioOverlayChange(null, null);
      }
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
      if (lastOverlayDispatchKeyRef.current !== "empty:missing_source") {
        lastOverlayDispatchKeyRef.current = "empty:missing_source";
        props.onScenarioOverlayChange(null, null);
      }
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
    const dispatchKey = JSON.stringify(summary);
    if (lastOverlayDispatchKeyRef.current === dispatchKey) return;
    lastOverlayDispatchKeyRef.current = dispatchKey;
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
  const sceneShellRef = useRef<HTMLDivElement | null>(null);
  const workspaceViewMode = useSyncExternalStore(
    subscribeWorkspaceViewMode,
    getWorkspaceViewMode,
    getWorkspaceViewModeServerSnapshot
  );
  const executiveCameraDefaults = useMemo(
    () => resolveExecutiveDefaultCameraForMode(workspaceViewMode),
    [workspaceViewMode]
  );
  const [cameraReframeNonce, setCameraReframeNonce] = useState(0);
  const hudThemeMode = props.hudThemeMode ?? resolveNexoraHudThemeMode(resolvedUi);
  const requestStaticCameraReframe = useCallback(() => {
    markSceneHudDriftBaseline("camera-fit-scene", sceneShellRef.current);
    setCameraReframeNonce((value) => value + 1);
    scheduleSceneHudDriftDetect("camera-fit-scene", sceneShellRef.current);
  }, []);

  useEffect(() => {
    hydrateWorkspaceViewMode();
    hydrateExecutiveFocusMode();
  }, []);

  useEffect(() => {
    setCameraReframeNonce((value) => value + 1);
  }, [workspaceViewMode]);

  useEffect(() => {
    logHudThemeModeResolved({ mode: hudThemeMode });
  }, [hudThemeMode]);

  useEffect(() => {
    runSceneOccupancyAudit([
      {
        panelId: "sceneInfo",
        owner: "Scene Info",
        visible: Boolean(props.sceneInfoHud),
        coverageEstimate: 8,
      },
      {
        panelId: "objectInfo",
        owner: "Object Info",
        visible: Boolean(props.objectInfoHud),
        coverageEstimate: 9,
      },
      {
        panelId: "timeline",
        owner: "Executive Bottom Workspace",
        visible: Boolean(props.timelineHud),
        coverageEstimate: 11,
      },
      {
        panelId: "quickActions",
        owner: "Executive Quick Actions",
        visible: !props.timelineHud && Boolean(props.quickActionsDock),
        coverageEstimate: 4,
      },
      {
        panelId: "executiveStatus",
        owner: "Executive Status HUD",
        visible: Boolean(props.executiveStatusHud),
        coverageEstimate: 5,
      },
      {
        panelId: "sceneToolbar",
        owner: "Scene Toolbar",
        visible: Boolean(props.sceneNavigationToolbar ?? props.cameraToolbar),
        coverageEstimate: 4,
      },
    ]);
  }, [
    props.cameraToolbar,
    props.executiveStatusHud,
    props.objectInfoHud,
    props.quickActionsDock,
    props.sceneInfoHud,
    props.sceneNavigationToolbar,
    props.timelineHud,
  ]);

  const layoutAuditSignature = useMemo(() => {
    if (process.env.NODE_ENV === "production") return null;
    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1440;
    const contract = resolveWorkspaceLayoutContract("executive", viewportWidth);
    return buildExecutiveLayoutAuditInputSignature({
      contract,
      selectedObjectId: props.objectInfoHud?.model.selectedObjectId?.trim() || null,
      pipelineStatus: "ready",
      visiblePanels: {
        sceneInfoHud: Boolean(props.sceneInfoHud),
        objectInfoHud: Boolean(props.objectInfoHud),
        executiveStatusHud: Boolean(props.executiveStatusHud),
        timelineHud: Boolean(props.timelineHud),
        quickActionsDock: !props.timelineHud && Boolean(props.quickActionsDock),
        executiveSceneToolbar: Boolean(props.sceneNavigationToolbar ?? props.cameraToolbar),
      },
    });
  }, [
    props.cameraToolbar,
    props.executiveStatusHud,
    props.objectInfoHud,
    props.objectInfoHud?.model.selectedObjectId,
    props.quickActionsDock,
    props.sceneInfoHud,
    props.sceneNavigationToolbar,
    props.timelineHud,
  ]);

  useEffect(() => {
    if (process.env.NODE_ENV === "production" || !layoutAuditSignature) return;
    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1440;
    const contract = resolveWorkspaceLayoutContract("executive", viewportWidth);
    runExecutiveLayoutAudit({
      contract,
      selectedObjectId: props.objectInfoHud?.model.selectedObjectId?.trim() || null,
      pipelineStatus: "ready",
      visiblePanels: {
        sceneInfoHud: Boolean(props.sceneInfoHud),
        objectInfoHud: Boolean(props.objectInfoHud),
        executiveStatusHud: Boolean(props.executiveStatusHud),
        timelineHud: Boolean(props.timelineHud),
        quickActionsDock: !props.timelineHud && Boolean(props.quickActionsDock),
        executiveSceneToolbar: Boolean(props.sceneNavigationToolbar ?? props.cameraToolbar),
      },
      root: sceneShellRef.current,
    });
  }, [layoutAuditSignature, props.objectInfoHud?.model.selectedObjectId]);

  const localIsOrbitingRef = useRef<boolean>(false);
  const preserveCameraOnClearRef = useRef<boolean>(false);
  const leftColumnLayoutPauseRef = useRef(false);
  const sceneInvalidateRef = useRef<(() => void) | null>(null);
  const leftColumnLayoutTimerRef = useRef<number | null>(null);
  const lastLeftCommandOpenForLayoutRef = useRef<boolean | null>(null);
  const [leftColumnLayoutResumeNonce, setLeftColumnLayoutResumeNonce] = useState(0);
  const tmpWorld = useMemo(() => new THREE.Vector3(), []);
  const [isHudInteracting, setIsHudInteracting] = useState(false);
  const isHudInteractingRef = useRef(false);
  const lastOverlayDispatchKeyRef = useRef<string>("");
  const lastHighlightTraceSigRef = useRef<string>("");
  const stableGlobalScaleInputRef = useRef<{ signature: string; value: number } | null>(null);

  // Camera mode values may come from UI as: "orbit" | "fixed" (new)
  // or legacy values: "auto" | "manual".
  const cameraMode = String(orbitMode);
  const isFixedCamera = cameraMode === "fixed";
  const orbitControlsEnabled = !isFixedCamera && !props.isDraggingHUD && !isHudInteracting;
  const orbitMouseButtons = useMemo(
    () =>
      workspaceViewMode === "3D"
        ? {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN,
          }
        : {
            LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN,
          },
    [workspaceViewMode]
  );

  // Global scale can easily make objects feel too large for an executive overview.
  const sceneObjectCountForScale = Array.isArray(props.sceneJson?.scene?.objects)
    ? props.sceneJson.scene.objects.length
    : 1;
  const requestedGlobalScale = typeof props.prefs?.globalScale === "number" ? props.prefs.globalScale : 0.52;
  const rawGlobalScale = holdStableScaleInput(
    stableGlobalScaleInputRef,
    `scene:${sceneObjectCountForScale}`,
    requestedGlobalScale
  );
  const globalScale = useMemo(
    () =>
      normalizeExecutiveObjectScale({
        objectId: "scene",
        scale: rawGlobalScale,
        objectCount: sceneObjectCountForScale,
      }),
    [rawGlobalScale, sceneObjectCountForScale]
  );
  const densityProfile = useMemo(
    () => resolveWorkspaceDensityProfile(workspaceViewMode),
    [workspaceViewMode]
  );
  const resolvedGlobalScale = CANVAS_STATIC_MODE ? densityProfile.scaleMultiplier : globalScale;
  const showGrid = typeof props.showGrid === "boolean" ? props.showGrid : !!props.prefs?.showGrid;
  const showAxes = typeof props.showAxes === "boolean" ? props.showAxes : !!props.prefs?.showAxes;
  const shadowsEnabled = !!props.prefs?.shadowsEnabled;

  const sceneObjectIds = useMemo(
    () =>
      Array.isArray(props.sceneJson?.scene?.objects)
        ? (props.sceneJson.scene.objects as any[])
            .map((obj: any, idx: number) => String(obj?.id ?? obj?.name ?? `${obj?.type ?? "obj"}:${idx}`))
            .filter(Boolean)
        : [],
    [props.sceneJson]
  );
  const idleRuntimeSemanticSignature = useMemo(
    () =>
      JSON.stringify({
        objectCount: sceneObjectIds.length,
        objectIds: [...sceneObjectIds].sort(),
        selectedObjectId: selectedIdCtx ?? props.selectedObjectId ?? null,
      }),
    [props.selectedObjectId, sceneObjectIds, selectedIdCtx]
  );
  useEffect(() => {
    updateIdleRuntimeSemanticSignature(idleRuntimeSemanticSignature);
  }, [idleRuntimeSemanticSignature]);
  const rawHighlightedObjectIds = Array.isArray(combinedObjectSelection?.highlighted_objects)
    ? combinedObjectSelection.highlighted_objects.map(String)
    : [];
  const rawHighlightedObjectIdsSig = useMemo(
    () => JSON.stringify(rawHighlightedObjectIds),
    [rawHighlightedObjectIds]
  );
  const highlightedObjectIds = useMemo(
    () => Array.from(new Set(rawHighlightedObjectIds)).sort(),
    [rawHighlightedObjectIdsSig]
  );
  const sceneJsonObjectsSignature = useMemo(
    () =>
      buildSceneObjectsRegistrySignature(
        Array.isArray(props.sceneJson?.scene?.objects) ? (props.sceneJson.scene.objects as any[]) : []
      ),
    [props.sceneJson]
  );
  const stableSceneJsonForRenderRef = useRef<{ signature: string; value: any | null }>({
    signature: "uninitialized",
    value: null,
  });
  const stableSceneJsonForRender = useMemo(() => {
    if (props.sceneJson && stableSceneJsonForRenderRef.current.signature !== sceneJsonObjectsSignature) {
      stableSceneJsonForRenderRef.current = {
        signature: sceneJsonObjectsSignature,
        value: props.sceneJson,
      };
    }
    return stableSceneJsonForRenderRef.current.value;
  }, [props.sceneJson, sceneJsonObjectsSignature]);
  const objectSelectionSignature = buildSceneObjectSelectionSignature(combinedObjectSelection ?? null);
  const stableObjectSelection = useMemo(
    () => combinedObjectSelection ?? null,
    [objectSelectionSignature]
  );

  const sceneJsonForRenderer = stableSceneJsonForRender;

  const rawSceneObjects = sceneJsonForRenderer?.scene?.objects;
  const overlayObjectsRegistrySignature = useMemo(
    () => buildSceneObjectsRegistrySignature(Array.isArray(rawSceneObjects) ? rawSceneObjects : []),
    [rawSceneObjects]
  );
  const overlaySceneObjects = useMemo(
    () => syncSceneObjectRegistry(Array.isArray(rawSceneObjects) ? rawSceneObjects : []),
    [overlayObjectsRegistrySignature, rawSceneObjects]
  );

  const sceneRendererProps = useMemo(
    () => ({
      shadowsEnabled,
      focusMode: props.focusMode,
      focusedId: props.focusedId,
      activeLoopId: props.effectiveActiveLoopId,
      theme: rendererTheme,
      motionCalm: props.motionCalm === true,
      getUxForObject: props.getUxForObject,
      objectUxById: props.objectUxById,
      globalScale,
      loops: props.loops,
      showLoops: props.showLoops,
      showLoopLabels: props.showLoopLabels,
      onObjectPositionChange: props.onObjectPositionChange,
    }),
    [
      shadowsEnabled,
      globalScale,
      props.effectiveActiveLoopId,
      props.focusMode,
      props.focusedId,
      props.getUxForObject,
      props.loops,
      props.motionCalm,
      props.objectUxById,
      props.onObjectPositionChange,
      props.showLoopLabels,
      props.showLoops,
      rendererTheme,
    ]
  );

  useEffect(() => {
    const objects = Array.isArray(props.sceneJson?.scene?.objects) ? props.sceneJson.scene.objects : [];
    computeWorkspaceScaleMetrics({
      totalObjects: objects.length,
      visibleObjects: objects.length,
      relationships: countSceneRelationships(props.sceneJson),
    });
  }, [props.sceneJson]);

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

    const traceSig = JSON.stringify({
      highlightedObjectIds,
      dimUnrelatedObjects: combinedObjectSelection?.dim_unrelated_objects === true,
      focusedId: props.focusedId ?? null,
      selectedObjectId: selectedIdCtx ?? null,
      pinnedId: props.focusPinned ? props.focusedId ?? null : null,
      focusMode: props.focusMode,
      protectedIds,
      dimmedIds,
    });
    if (lastHighlightTraceSigRef.current === traceSig) return;
    lastHighlightTraceSigRef.current = traceSig;

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

  const sceneObjectCount = Array.isArray(props.sceneJson?.scene?.objects)
    ? props.sceneJson.scene.objects.length
    : 0;
  const sceneActivitySignature = useMemo(
    () =>
      buildSceneActivityDriftSignature({
        objectCount: sceneObjectCount,
        selectedObjectId: props.selectedObjectId,
        selectedRelationshipId: props.selectedRelationshipId,
        selectedPropagationPathId: props.selectedPropagationPathId,
      }),
    [
      sceneObjectCount,
      props.selectedObjectId,
      props.selectedRelationshipId,
      props.selectedPropagationPathId,
    ]
  );
  const lastSceneActivityDriftSigRef = useRef<string | null>(null);
  const lastSceneActivityDriftAtRef = useRef(0);

  useEffect(() => {
    markHudDriftBaseline("scene-activity");
    scheduleSceneHudDriftBaseline("scene-activity", sceneShellRef.current);
  }, []);

  useEffect(() => {
    if (lastSceneActivityDriftSigRef.current === sceneActivitySignature) return;
    lastSceneActivityDriftSigRef.current = sceneActivitySignature;
    const now = Date.now();
    if (now - lastSceneActivityDriftAtRef.current < 20_000) return;
    lastSceneActivityDriftAtRef.current = now;
    detectHudDrift("scene-activity");
    scheduleSceneHudDriftDetect("scene-activity", sceneShellRef.current);
  }, [sceneActivitySignature]);

  useEffect(() => {
    const onNavigationAction = (event: Event) => {
      const detail = (event as CustomEvent<{ action?: string }>).detail;
      const action = detail?.action?.trim() || "unknown";
      const reason = `camera-${action}`;
      markSceneHudDriftBaseline(reason, sceneShellRef.current);
      scheduleSceneHudDriftDetect(reason, sceneShellRef.current);
    };
    return bindWindowListener(SCENE_NAVIGATION_ACTION_EVENT, onNavigationAction as EventListener, undefined, {
      component: "SceneCanvas",
      eventType: SCENE_NAVIGATION_ACTION_EVENT,
    });
  }, []);

  useEffect(() => {
    if (isFixedCamera) {
      localIsOrbitingRef.current = false;
    }
  }, [isFixedCamera]);

  useEffect(() => {
    const onLeftCommandOpenChanged = (event: Event) => {
      const detail = (event as CustomEvent<{ open?: boolean }>).detail;
      if (typeof detail?.open !== "boolean") return;
      if (lastLeftCommandOpenForLayoutRef.current === null) {
        lastLeftCommandOpenForLayoutRef.current = detail.open;
        return;
      }
      if (lastLeftCommandOpenForLayoutRef.current === detail.open) return;
      lastLeftCommandOpenForLayoutRef.current = detail.open;
      leftColumnLayoutPauseRef.current = true;
      if (leftColumnLayoutTimerRef.current != null) {
        window.clearTimeout(leftColumnLayoutTimerRef.current);
      }
      leftColumnLayoutTimerRef.current = window.setTimeout(() => {
        leftColumnLayoutTimerRef.current = null;
        leftColumnLayoutPauseRef.current = false;
        setLeftColumnLayoutResumeNonce((n) => n + 1);
        sceneInvalidateRef.current?.();
      }, 180);
    };
    const detach = bindWindowListener(
      "nexora:left-command-open-changed",
      onLeftCommandOpenChanged as EventListener,
      undefined,
      {
        component: "SceneCanvas",
        eventType: "nexora:left-command-open-changed",
      }
    );
    return () => {
      detach();
      if (leftColumnLayoutTimerRef.current != null) {
        window.clearTimeout(leftColumnLayoutTimerRef.current);
        leftColumnLayoutTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        sceneInvalidateRef.current?.();
      });
    };
    const detach = bindWindowListener("resize", onResize, { passive: true }, {
      component: "SceneCanvas",
      eventType: "resize",
    });
    return () => {
      detach();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const selectedIdRefForKeydown = useRef(props.selectedIdRef);
  const selectedSetterRefForKeydown = useRef(props.selectedSetterRef);
  const onSelectedChangeForKeydownRef = useRef(props.onSelectedChange);
  useLayoutEffect(() => {
    selectedIdRefForKeydown.current = props.selectedIdRef;
    selectedSetterRefForKeydown.current = props.selectedSetterRef;
    onSelectedChangeForKeydownRef.current = props.onSelectedChange;
  }, [props.onSelectedChange, props.selectedIdRef, props.selectedSetterRef]);

  const onSceneCanvasKeyDown = useCallback((event: Event) => {
    const ev = event as KeyboardEvent;
    if (ev.key !== "Escape") return;
    // Clear selection via the ref wired by <SetterRegistrar />.
    if (selectedIdRefForKeydown.current.current == null) return;
    selectedSetterRefForKeydown.current?.current?.(null);
    onSelectedChangeForKeydownRef.current?.(null);
  }, []);

  useEffect(() => {
    const meta = {
      component: "SceneCanvas",
      eventType: "keydown",
    };
    const detach = bindWindowListener("keydown", onSceneCanvasKeyDown, undefined, meta);
    logDomListenerStable(meta);
    return detach;
  }, [onSceneCanvasKeyDown]);

  useEffect(() => {
    const isInsideHud = (t: EventTarget | null) => {
      const el = t as HTMLElement | null;
      return !!(el && typeof (el as any).closest === "function" && el.closest('.scene-hud-layer, [data-hud="chat"], [data-hud="scene-info"], [data-hud="object-info"], [data-hud="timeline"], [data-hud="camera-toolbar"], [data-hud="scene-navigation"], [data-hud="executive-status"], [data-hud="quick-actions"], [data-nx="scene-info-hud"], [data-nx="object-info-hud"], [data-nx="executive-timeline-hud"], [data-nx="executive-camera-toolbar"], [data-nx="executive-scene-toolbar"], [data-nx="executive-status-hud"], [data-nx="executive-quick-actions-dock"]'));
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

    const meta = { component: "SceneCanvas", eventType: "hud-capture" } as const;
    const detachOver = bindWindowListener("pointerover", onPointerOverCapture as EventListener, { capture: true }, {
      ...meta,
      eventType: "pointerover",
    });
    const detachOut = bindWindowListener("pointerout", onPointerOutCapture as EventListener, { capture: true }, {
      ...meta,
      eventType: "pointerout",
    });
    const detachWheel = bindWindowListener("wheel", stopIfHudCapture, { passive: true, capture: true }, {
      ...meta,
      eventType: "wheel",
    });
    const detachTouchMove = bindWindowListener("touchmove", stopIfHudCapture, { passive: true, capture: true }, {
      ...meta,
      eventType: "touchmove",
    });

    return () => {
      detachOver();
      detachOut();
      detachWheel();
      detachTouchMove();
    };
  }, []);

  useEffect(() => {
    const isInsideHud = (t: EventTarget | null) => {
      const el = t as HTMLElement | null;
      return !!(el && typeof (el as any).closest === "function" && el.closest('.scene-hud-layer, [data-hud="chat"], [data-hud="scene-info"], [data-hud="object-info"], [data-hud="timeline"], [data-hud="camera-toolbar"], [data-hud="scene-navigation"], [data-hud="executive-status"], [data-hud="quick-actions"], [data-nx="scene-info-hud"], [data-nx="object-info-hud"], [data-nx="executive-timeline-hud"], [data-nx="executive-camera-toolbar"], [data-nx="executive-scene-toolbar"], [data-nx="executive-status-hud"], [data-nx="executive-quick-actions-dock"]'));
    };

    const onTouchStartCapture = (e: TouchEvent) => {
      if (isInsideHud(e.target)) setIsHudInteracting(true);
    };

    const clear = () => setIsHudInteracting(false);

    const meta = { component: "SceneCanvas", eventType: "hud-touch-capture" } as const;
    const detachStart = bindWindowListener("touchstart", onTouchStartCapture as EventListener, { passive: true, capture: true }, {
      ...meta,
      eventType: "touchstart",
    });
    const detachEnd = bindWindowListener("touchend", clear, { passive: true, capture: true }, {
      ...meta,
      eventType: "touchend",
    });
    const detachCancel = bindWindowListener("touchcancel", clear, { passive: true, capture: true }, {
      ...meta,
      eventType: "touchcancel",
    });

    return () => {
      detachStart();
      detachEnd();
      detachCancel();
    };
  }, []);

  const handleCanvasPointerDown = useCallback(
    (e: any) => {
      if (e.button !== 0) return;
      const intersections = (e as any).intersections as Array<{ object: THREE.Object3D }> | undefined;
      const camera = (e as any).camera as THREE.Camera | undefined;
      if (!camera || !intersections || intersections.length === 0) return;
      const obj = intersections[0]?.object;
      if (!obj) return;
      obj.getWorldPosition(tmpWorld);
      tmpWorld.project(camera);
      const raw = (tmpWorld.x + 1) / 2;
      const sx = Math.max(0, Math.min(1, raw));
      props.onSelectedScreenX?.(sx);
      if (process.env.NODE_ENV !== "production") {
        console.log("[Nexora][SceneCanvas][SelectionUpdate]", {
          kind: "pointer_down",
          screenX: Number(sx.toFixed(3)),
        });
      }
    },
    [props.onSelectedScreenX, tmpWorld]
  );

  const handleCanvasContextMenu = useCallback((e: any) => {
    e.preventDefault();
  }, []);

  const handlePointerMissed = useCallback(
    (e: any) => {
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
      if (props.selectedIdRef.current == null && !props.selectedRelationshipId && !props.selectedPropagationPathId) {
        props.onSelectedScreenX?.(null);
        return;
      }
      if (process.env.NODE_ENV !== "production") {
        console.log("[Nexora][SceneInteraction] empty click ignored", {
          action: "soft_deselect_without_reframe",
        });
      }
      preserveCameraOnClearRef.current = true;
      props.selectedSetterRef?.current?.(null);
      props.onSelectedChange?.(null);
      props.onSelectedScreenX?.(null);
      props.onPointerMissed();
    },
    [
      props.onPointerMissed,
      props.onSelectedChange,
      props.onSelectedScreenX,
      props.selectedIdRef,
      props.selectedPropagationPathId,
      props.selectedRelationshipId,
      props.selectedSetterRef,
    ]
  );

  const handleOrbitStart = useCallback(() => {
    if (isFixedCamera || localIsOrbitingRef.current) return;
    markHudDriftBaseline("camera-orbit");
    markSceneHudDriftBaseline("camera-orbit", sceneShellRef.current);
    localIsOrbitingRef.current = true;
    preserveCameraOnClearRef.current = true;
    props.onOrbitStart();
    if (process.env.NODE_ENV !== "production") {
      console.log("[Nexora][SceneCanvas][FocusUpdate]", {
        kind: "orbit_start",
        fixedCamera: isFixedCamera,
      });
    }
  }, [isFixedCamera, props.onOrbitStart]);

  const handleOrbitEnd = useCallback(() => {
    if (isFixedCamera || !localIsOrbitingRef.current) return;
    localIsOrbitingRef.current = false;
    preserveCameraOnClearRef.current = true;
    props.onOrbitEnd();
    detectHudDrift("camera-orbit");
    scheduleSceneHudDriftDetect("camera-orbit", sceneShellRef.current);
    if (process.env.NODE_ENV !== "production") {
      console.log("[Nexora][SceneCanvas][FocusUpdate]", {
        kind: "orbit_end",
        fixedCamera: isFixedCamera,
      });
    }
  }, [isFixedCamera, props.onOrbitEnd]);

  const clearTemporaryCameraFocus = useCallback(() => {
    preserveCameraOnClearRef.current = true;
    props.selectedSetterRef?.current?.(null);
    props.onSelectedChange?.(null);
    props.onSelectedScreenX?.(null);
  }, [props.onSelectedChange, props.onSelectedScreenX, props.selectedSetterRef]);

  return (
    <div
      ref={sceneShellRef}
      className={SCENE_SHELL_CLASS}
      data-nx-view-mode={workspaceViewMode}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minWidth: 0,
        minHeight: 0,
        overflow: "hidden",
        flex: "1 1 0%",
        zIndex: 0,
        contain: "layout size style",
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
            background: `radial-gradient(circle at 18% 16%, ${props.storyAccent.glow ?? "rgba(56,189,248,0.08)"} 0%, transparent 42%)`,
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
                border: `1px solid ${props.storyAccent.tint ?? nx.border}`,
                background: nx.bgElevated,
                color: nx.textSoft,
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
        className={SCENE_WORLD_LAYER_CLASS}
        frameloop="demand"
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        shadows={shadowsEnabled}
        camera={{
          position: CANVAS_STATIC_MODE ? executiveCameraDefaults.position : props.camPos ?? executiveCameraDefaults.position,
          fov: CANVAS_STATIC_MODE ? executiveCameraDefaults.fov : 48,
          near: 0.1,
          far: 250,
        }}
        style={{ width: "100%", height: "100%", display: "block" }}
        onPointerDown={handleCanvasPointerDown}
        onContextMenu={handleCanvasContextMenu}
        onPointerMissed={handlePointerMissed}
      >
        <SceneDemandInvalidateDriver
          layoutPauseRef={leftColumnLayoutPauseRef}
          invalidateOutRef={sceneInvalidateRef}
          sceneJson={props.sceneJson}
          isOrbiting={props.isOrbiting}
          localIsOrbitingRef={localIsOrbitingRef}
          viewMode={workspaceViewMode}
        />
        <color attach="background" args={[sceneEnv.clearColor]} />
        <SceneFogSync color={sceneEnv.fogColor} near={sceneEnv.fogNear} far={sceneEnv.fogFar} />

        {!CANVAS_STATIC_MODE && (
          <CameraIntelligence
            selectedObjectId={selectedIdCtx ?? null}
            focusPinned={props.focusPinned}
            focusMode={props.focusMode}
            focusedId={props.focusedId}
            sceneJson={props.sceneJson}
            camPos={props.camPos}
            overridesRef={props.overridesRef}
            cameraLockedByUser={props.cameraLockedByUser || isFixedCamera}
            isOrbiting={props.isOrbiting}
            hudDockSide={props.hudDockSide}
            layoutDockInsets={props.layoutDockInsets}
            controlsRef={controlsRef}
            localIsOrbitingRef={localIsOrbitingRef}
            preserveCameraOnClearRef={preserveCameraOnClearRef}
            orbitControlsEnabled={orbitControlsEnabled}
            layoutPauseRef={leftColumnLayoutPauseRef}
            layoutResumeNonce={leftColumnLayoutResumeNonce}
          />
        )}
        <StaticSceneFramer
          sceneJson={props.sceneJson}
          controlsRef={controlsRef}
          localIsOrbitingRef={localIsOrbitingRef}
          isOrbiting={props.isOrbiting}
          enabled={CANVAS_STATIC_MODE}
          reframeNonce={cameraReframeNonce}
          viewMode={workspaceViewMode}
        />

        {sceneEnv.showStars ? (
          <Stars
            radius={80}
            depth={50}
            count={Math.max(120, Math.round((props.starCount ?? 1500) * sceneEnv.starCountFactor))}
            factor={sceneEnv.starsSpreadFactor}
            saturation={0}
            fade
            speed={1}
          />
        ) : null}

        <ambientLight intensity={sceneEnv.ambientLight} />
        <directionalLight position={[5, 8, 5]} intensity={sceneEnv.directionalLight} />

        <OrbitControls
          ref={controlsRef}
          enabled={orbitControlsEnabled}
          enableZoom
          enableRotate={workspaceViewMode === "3D"}
          enablePan
          enableDamping={false}
          autoRotate={false}
          minDistance={8}
          maxDistance={70}
          mouseButtons={orbitMouseButtons}
          screenSpacePanning={workspaceViewMode === "2D"}
          onStart={handleOrbitStart}
          onEnd={handleOrbitEnd}
        />

        <AnimatedScaleGroup target={resolvedGlobalScale} staticMode={CANVAS_STATIC_MODE}>
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

          {sceneJsonForRenderer ? (
            <>
              <SceneOverlayRenderer
                sceneJson={sceneJsonForRenderer}
                objects={overlaySceneObjects}
                themeId={hudThemeMode}
                visibility={overlayRuntime.visibility}
                propagationOverlay={mergedPropagationOverlay}
                decisionPathOverlay={decisionPathOverlay}
                decisionPathRenderInput={decisionPathOverlay}
                objectSelection={stableObjectSelection}
                selectedObjectId={selectedIdCtx ?? props.selectedObjectId ?? null}
                selectedRelationshipId={props.selectedRelationshipId ?? null}
                selectedPropagationPathId={props.selectedPropagationPathId ?? null}
                onRelationshipSelect={props.onRelationshipSelect}
                onPropagationPathSelect={props.onPropagationPathSelect}
                sceneRendererProps={sceneRendererProps}
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
          ) : null}
        </AnimatedScaleGroup>

        {(props.sceneNavigationToolbar ?? props.cameraToolbar) ? (
          <SceneNavigationController
            controlsRef={controlsRef}
            sceneJson={props.sceneJson}
            selectedObjectId={selectedIdCtx ?? props.selectedObjectId ?? null}
            onRequestStaticReframe={requestStaticCameraReframe}
            onClearTemporaryFocus={clearTemporaryCameraFocus}
          />
        ) : null}
      </Canvas>
      <ExecutiveFocusModeDocumentBridge />
      <SceneHudLayer>
        {props.sceneInfoHud ? <SceneInfoHudOverlay {...props.sceneInfoHud} themeMode={hudThemeMode} /> : null}
        {props.objectInfoHud ? (
          <ObjectInfoHudOverlay
            model={props.objectInfoHud.model}
            sceneJson={props.objectInfoHud.sceneJson}
            themeMode={hudThemeMode}
            onCreateRelationship={props.objectInfoHud.onCreateRelationship}
            onDeleteRelationship={props.objectInfoHud.onDeleteRelationship}
            onCreateImpactPath={props.objectInfoHud.onCreateImpactPath}
            onEditPropagationPath={props.objectInfoHud.onEditPropagationPath}
            onDeletePropagationPath={props.objectInfoHud.onDeletePropagationPath}
            onEditObject={props.objectInfoHud.onEditObject}
            onDuplicateObject={props.objectInfoHud.onDuplicateObject}
            onDeleteObject={props.objectInfoHud.onDeleteObject}
          />
        ) : null}
        {props.timelineHud ? (
          <ExecutiveBottomWorkspaceOverlay
            timeline={props.timelineHud}
            quickActions={props.quickActionsDock ? {
              model: props.quickActionsDock.model,
              onAction: props.quickActionsDock.onAction,
            } : null}
            themeMode={hudThemeMode}
          />
        ) : null}
        {!props.timelineHud && props.quickActionsDock ? (
          <ExecutiveQuickActionsDockOverlay
            {...props.quickActionsDock}
            stackAboveTimeline={false}
          />
        ) : null}
        {props.executiveStatusHud ? (
          <ExecutiveStatusHudOverlay model={props.executiveStatusHud} themeMode={hudThemeMode} />
        ) : null}
        {(props.sceneNavigationToolbar ?? props.cameraToolbar) ? (
          <ExecutiveSceneToolbarOverlay themeMode={hudThemeMode} />
        ) : null}
      </SceneHudLayer>
    </div>
  );
}

export const SceneCanvas = React.memo(SceneCanvasComponent);
